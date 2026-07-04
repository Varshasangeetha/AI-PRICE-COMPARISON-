/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../db/localDb';
import { AIAgent, cosineSimilarity } from '../services/AIAgent';
import { ComparisonEngine } from '../services/ComparisonEngine';

export class ProductController {

  public static async getAllProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const { category, brand, search, page = '1', limit = '10' } = req.query;
      const pNum = parseInt(page as string, 10);
      const lNum = parseInt(limit as string, 10);

      let filtered = db.getProducts();

      if (category) {
        filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
      }

      if (brand) {
        filtered = filtered.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
      }

      if (search) {
        const q = (search as string).toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.brand.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q)
        );
      }

      const total = filtered.length;
      const paginated = filtered.slice((pNum - 1) * lNum, pNum * lNum);

      res.status(200).json({
        products: paginated,
        pagination: {
          total,
          page: pNum,
          limit: lNum,
          totalPages: Math.ceil(total / lNum)
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  }

  public static getProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const product = db.findProductById(id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const sortedDeals = ComparisonEngine.getSortedDeals(product);
      res.status(200).json({
        product,
        deals: sortedDeals,
        bestDeal: sortedDeals.find(d => d.inStock) || sortedDeals[0]
      });
    } catch (e: any) {
      res.status(500).json({ error: 'Error fetching product' });
    }
  }

  public static async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const productData = req.body;
      if (!productData.name || !productData.brand || !productData.category) {
        res.status(400).json({ error: 'Name, brand, and category are required' });
        return;
      }

      // Generate embedding for the new product to enable semantic search!
      const embeddingText = `${productData.name} ${productData.brand} ${productData.description || ''}`;
      const embedding = await AIAgent.generateEmbedding(embeddingText);

      const newProduct = db.createProduct({
        ...productData,
        embedding,
        prices: productData.prices || [],
        averageRating: productData.averageRating || 4.5,
        totalReviews: productData.totalReviews || 1,
        images: productData.images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80']
      });

      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Error creating product' });
    }
  }

  public static updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updated = db.updateProduct(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.status(200).json({ message: 'Product updated successfully', product: updated });
    } catch (e: any) {
      res.status(500).json({ error: 'Error updating product' });
    }
  }

  public static deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      db.deleteProduct(id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (e: any) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }

  public static compareProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const { productIds } = req.body;
      if (!Array.isArray(productIds) || productIds.length === 0) {
        res.status(400).json({ error: 'An array of product IDs is required' });
        return;
      }

      const products = db.getProducts().filter(p => productIds.includes(p.id));
      const comparison = ComparisonEngine.compareProducts(products);

      res.status(200).json({ comparison });
    } catch (e: any) {
      res.status(500).json({ error: 'Error comparing products' });
    }
  }

  /**
   * Generates beautiful mock 6-month historical price data and requests AIAgent to analyze the trend
   */
  public static async getPriceTrends(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const product = db.findProductById(id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      // Generate realistic price points over past 6 months
      const sortedDeals = ComparisonEngine.getSortedDeals(product);
      const lowestNow = sortedDeals[0]?.totalCostINR || 50000;

      const history = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        // Trend slightly upwards/downwards with some random noise
        const variation = 0.95 + (i * 0.01) + (Math.sin(i) * 0.02); 
        history.push({
          date: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          price: Math.round(lowestNow * variation)
        });
      }

      const analysis = await AIAgent.analyzePriceTrend(history);

      res.status(200).json({
        history,
        analysis
      });
    } catch (e: any) {
      res.status(500).json({ error: 'Error generating price trends' });
    }
  }

  /**
   * Find similar products using actual cosine similarity on embeddings!
   */
  public static async getSimilarProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const target = db.findProductById(id);
      if (!target) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      // Generate embedding if not exists yet
      if (!target.embedding) {
        const text = `${target.name} ${target.brand} ${target.description}`;
        target.embedding = await AIAgent.generateEmbedding(text);
        db.updateProduct(target.id, { embedding: target.embedding });
      }

      const candidates = db.getProducts().filter(p => p.id !== target.id);
      
      const similarityScores = [];
      for (const p of candidates) {
        if (!p.embedding) {
          const text = `${p.name} ${p.brand} ${p.description}`;
          p.embedding = await AIAgent.generateEmbedding(text);
          db.updateProduct(p.id, { embedding: p.embedding });
        }
        
        const score = cosineSimilarity(target.embedding!, p.embedding!);
        similarityScores.push({ product: p, score });
      }

      // Sort by similarity score descending
      const similar = similarityScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(item => ({
          ...item.product,
          similarityScore: Number(item.score.toFixed(3))
        }));

      res.status(200).json({ similar });
    } catch (e: any) {
      res.status(500).json({ error: 'Error finding similar products' });
    }
  }

  public static addReview(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { rating, comment, userName } = req.body;
      const product = db.findProductById(id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const newCount = product.totalReviews + 1;
      const newRating = Number(((product.averageRating * product.totalReviews + rating) / newCount).toFixed(1));

      const updated = db.updateProduct(id, {
        averageRating: newRating,
        totalReviews: newCount
      });

      res.status(201).json({
        message: 'Review submitted successfully',
        product: updated
      });
    } catch (e: any) {
      res.status(500).json({ error: 'Error submitting review' });
    }
  }
}
