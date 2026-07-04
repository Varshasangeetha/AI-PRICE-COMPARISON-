/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../db/localDb';
import { AIAgent, cosineSimilarity } from '../services/AIAgent';
import { PriceCollector } from '../services/PriceCollector';

export class SearchController {

  /**
   * Natural Language Search Pipeline
   * Parse Intent -> Collect Prices -> Find or Create dynamic product -> Generate Recommendation -> Store History
   */
  public static async naturalSearch(req: AuthenticatedRequest, res: Response) {
    try {
      const { query } = req.body;
      const userId = req.user?.id || 'anonymous';

      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      console.log(`[SearchController] NLP Search starting for: "${query}" (User: ${userId})`);

      // 1. Parse intent with Gemini
      const intent = await AIAgent.parseIntent(query);
      console.log(`[SearchController] Parsed intent:`, intent);

      // 2. Query DB to see if we have products matching this brand/category/keyword
      let matchingProducts = db.getProducts().filter(p => {
        // Broad search matching
        const brandMatch = !intent.brand || p.brand.toLowerCase() === intent.brand.toLowerCase();
        
        const nameMatch = !intent.product || 
          p.name.toLowerCase().includes(intent.product.toLowerCase()) || 
          intent.product.toLowerCase().includes(p.name.toLowerCase()) ||
          p.category.toLowerCase().includes(intent.product.toLowerCase()) ||
          (p.specifications?.processor && p.specifications.processor.toLowerCase().includes(intent.product.toLowerCase()));
          
        return (brandMatch && nameMatch) || (brandMatch && !intent.product);
      });

      // 3. Dynamic Expansion: If no products matched or user explicitly searched for a custom product,
      // collect fresh prices from our Google Grounded PriceCollector, and create a dynamic Product record!
      if (matchingProducts.length === 0) {
        console.log(`[SearchController] Dynamic Product Expansion triggered for: "${intent.product}"`);
        const prices = await PriceCollector.collectPrices(query);
        
        // Extract features and describe via Gemini
        const features = await AIAgent.extractProductFeatures(query);
        
        const newProd = db.createProduct({
          name: intent.brand ? `${intent.brand} ${intent.product}` : intent.product,
          brand: intent.brand || 'Generic',
          description: `Freshly collected comparison page for ${intent.product}. Auto-analyzed by AI Price Comparison Agent.`,
          category: 'Electronics',
          specifications: {
            ...intent.specifications,
            ...features
          },
          prices,
          averageRating: 4.5,
          totalReviews: 12,
          images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80']
        });

        matchingProducts = [newProd];
      } else {
        // We have matching products in our local SQLite database.
        // Rather than blocking the search with slow sequential API requests for each product,
        // we return our rich local product data immediately. We can asynchronously refresh 
        // the prices for one of the products in the background to ensure freshness.
        if (matchingProducts.length > 0) {
          const firstProduct = matchingProducts[0];
          PriceCollector.collectPrices(firstProduct.name).then(freshPrices => {
            db.updateProduct(firstProduct.id, { prices: freshPrices });
          }).catch(err => {
            console.error('[SearchController] Background price refresh failed:', err);
          });
        }
      }

      // 4. Generate highly customized recommendation using AIAgent
      const userPrefs = req.user ? (db.findUserById(req.user.id)?.preferences || { currency: 'INR', notifications: true, theme: 'light' as const }) : { currency: 'INR', notifications: true, theme: 'light' as const };
      const recommendation = await AIAgent.generateRecommendation(matchingProducts, intent, userPrefs);

      // 5. Store in history
      const savedHistory = db.createSearchHistory({
        userId,
        query,
        parsedIntent: intent,
        results: matchingProducts.map(p => {
          const matchPrice = p.prices.find(pr => pr.platform === recommendation?.platform) || p.prices[0];
          return {
            productId: p.id,
            selected: recommendation?.recommendedProduct?.id === p.id,
            price: matchPrice ? matchPrice.price : 0,
            platform: matchPrice ? matchPrice.platform : 'amazon'
          };
        }),
        recommendedProduct: recommendation ? recommendation.recommendedProduct : null
      });

      if (req.user) {
        db.logActivity(req.user.id, 'search', { query, intent });
      }

      res.status(200).json({
        intent,
        products: matchingProducts,
        recommendation,
        historyId: savedHistory.id
      });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Error executing natural search' });
    }
  }

  /**
   * Semantic Vector Search
   */
  public static async semanticSearch(req: AuthenticatedRequest, res: Response) {
    try {
      const { query, limit = 5 } = req.body;
      if (!query) {
        res.status(400).json({ error: 'Query is required for semantic search' });
        return;
      }

      // Generate query embedding
      const queryEmbedding = await AIAgent.generateEmbedding(query);
      const allProducts = db.getProducts();

      const ranked = [];
      for (const p of allProducts) {
        if (!p.embedding) {
          const text = `${p.name} ${p.brand} ${p.description}`;
          p.embedding = await AIAgent.generateEmbedding(text);
          db.updateProduct(p.id, { embedding: p.embedding });
        }

        const sim = cosineSimilarity(queryEmbedding, p.embedding!);
        ranked.push({ product: p, score: sim });
      }

      const results = ranked
        .sort((a, b) => b.score - a.score)
        .slice(0, Number(limit))
        .map(item => ({
          product: item.product,
          score: Number(item.score.toFixed(3))
        }));

      res.status(200).json({ results });
    } catch (e: any) {
      res.status(500).json({ error: 'Semantic search failed' });
    }
  }

  public static getSearchHistory(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const history = db.getSearchHistory(req.user.id);
    res.status(200).json({ history });
  }

  public static deleteSearchHistoryItem(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { id } = req.params;
    db.deleteSearchHistoryItem(id, req.user.id);
    res.status(200).json({ message: 'Search history entry deleted successfully' });
  }

  public static getTrendingSearches(req: AuthenticatedRequest, res: Response) {
    // Count recurring queries in search history
    const allHistory = db.getSearchHistory();
    const counts: Record<string, number> = {};
    for (const h of allHistory) {
      counts[h.query] = (counts[h.query] || 0) + 1;
    }

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 5);

    // Fallbacks if history is thin
    const trending = sorted.length > 0 ? sorted : ['iPhone 15 Pro', 'MacBook Pro M3', 'Bose Noise Cancelling', 'OLED Gaming Console', 'Samsung S24 Ultra'];
    res.status(200).json({ trending });
  }

  /**
   * RAG Chat assistant
   */
  public static async chatWithAI(req: AuthenticatedRequest, res: Response) {
    try {
      const { message, history = [] } = req.body;
      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const catalog = db.getProducts();
      const aiReply = await AIAgent.chatAssistant(message, catalog, history);

      res.status(200).json({ reply: aiReply });
    } catch (e: any) {
      res.status(500).json({ error: 'Error chatting with shopping assistant' });
    }
  }
}
