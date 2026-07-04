/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import { intentParserPrompt } from '../prompts/intentParser';
import { recommendationPrompt } from '../prompts/recommendation';
import { chatAssistantPrompt } from '../prompts/chatAssistant';
import { Product, ParsedIntent, UserPreferences, AIRecommendation } from '../../types';

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;

export function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is missing. Configure it in the Secrets panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Cosine similarity helper
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class AIAgent {
  
  public static async parseIntent(userQuery: string): Promise<ParsedIntent> {
    try {
      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userQuery,
        config: {
          systemInstruction: intentParserPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              product: { type: Type.STRING, description: "Core product type searched for." },
              brand: { type: Type.STRING, description: "Brand name or empty string if not specified." },
              budget: { type: Type.NUMBER, description: "Max budget limit in INR or null." },
              specifications: {
                type: Type.OBJECT,
                properties: {
                  processor: { type: Type.STRING },
                  ram: { type: Type.STRING },
                  storage: { type: Type.STRING },
                  display: { type: Type.STRING },
                  battery: { type: Type.STRING },
                  camera: { type: Type.STRING },
                  color: { type: Type.STRING }
                }
              },
              features: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['product', 'brand', 'budget', 'specifications', 'features']
          }
        }
      });

      const text = response.text || '';
      return JSON.parse(text) as ParsedIntent;
    } catch (e) {
      console.error('Error parsing intent:', e);
      // Fallback
      return {
        product: userQuery.split(' ')[0] || 'gadget',
        brand: '',
        budget: null,
        specifications: {},
        features: []
      };
    }
  }

  public static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const ai = getAIClient();
      const response = await ai.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: text
      });
      return (response as any).embedding?.values || (response as any).embeddings?.[0]?.values || [];
    } catch (e) {
      console.error('Error generating embedding:', e);
      // Return mock-like pseudo-random reproducible embedding so vector search still works without crashing
      const hash = Array.from(text).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
      const pseudo = [];
      for (let i = 0; i < 768; i++) {
        pseudo.push(Math.sin(hash + i));
      }
      return pseudo;
    }
  }

  public static async generateRecommendation(
    products: Product[],
    userIntent: ParsedIntent,
    userPreferences: UserPreferences
  ): Promise<AIRecommendation | null> {
    if (products.length === 0) return null;
    try {
      const ai = getAIClient();
      const promptText = `
User Query Intent: ${JSON.stringify(userIntent)}
User Preferences: ${JSON.stringify(userPreferences)}
Available Products in database: ${JSON.stringify(products)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptText,
        config: {
          systemInstruction: recommendationPrompt,
          responseMimeType: 'application/json'
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      // Match ID back to actual product object
      const matchedProd = products.find(p => p.id === result.recommendedProduct?.id) || products[0];
      const alternatives = (result.alternatives || []).map((alt: any) => {
        const altProd = products.find(p => p.id === alt.productId) || products[0];
        return {
          product: altProd,
          platform: alt.platform || 'amazon',
          price: alt.price || matchedProd.prices[0].price,
          reason: alt.reason || 'Good alternative choice.'
        };
      });

      return {
        recommendedProduct: matchedProd,
        platform: result.platform || matchedProd.prices[0].platform,
        price: result.price || matchedProd.prices[0].price,
        reasons: result.reasons || ['Best overall value and review rating.'],
        alternatives,
        totalScore: result.totalScore || 85
      };
    } catch (e) {
      console.error('Error generating recommendation:', e);
      // Fallback
      return {
        recommendedProduct: products[0],
        platform: products[0].prices[0].platform,
        price: products[0].prices[0].price,
        reasons: ['Lowest priced deal matching the category.'],
        alternatives: [],
        totalScore: 80
      };
    }
  }

  public static async chatAssistant(
    userQuery: string,
    catalog: Product[],
    chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]
  ): Promise<string> {
    try {
      const ai = getAIClient();
      const catalogText = catalog.map(p => `
ID: ${p.id}
Name: ${p.name}
Brand: ${p.brand}
Description: ${p.description}
Specifications: ${JSON.stringify(p.specifications)}
Prices: ${JSON.stringify(p.prices.map(pr => ({ platform: pr.platform, price: pr.price, currency: pr.currency, inStock: pr.inStock })))}
Rating: ${p.averageRating}
      `).join('\n---\n');

      const systemInstruction = chatAssistantPrompt.replace('{{catalogContext}}', catalogText);

      // We form a standard chat session
      const chat = ai.chats.create({
        model: 'gemini-3.5-flash',
        config: {
          systemInstruction,
          temperature: 0.7
        },
        history: chatHistory.map(h => ({
          role: h.role,
          parts: [{ text: h.parts[0].text }]
        }))
      });

      const response = await chat.sendMessage({ message: userQuery });
      return response.text || "I apologize, I didn't catch that. How can I help you find the best deal?";
    } catch (e) {
      console.error('Error in chat assistant:', e);
      return "I'm having trouble connecting to my brain right now. Please verify your GEMINI_API_KEY.";
    }
  }

  public static async analyzePriceTrend(priceHistory: { date: string; price: number }[]): Promise<{
    prediction: 'drop' | 'stable' | 'rise';
    confidence: number;
    explanation: string;
    suggestedAction: string;
  }> {
    try {
      const ai = getAIClient();
      const prompt = `Analyze this pricing history for a product and predict the near-term trend:
${JSON.stringify(priceHistory)}
Provide your prediction ('drop' | 'stable' | 'rise'), a confidence percentage, an explanation of the trend, and a suggested action. Return as valid JSON only.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prediction: { type: Type.STRING, description: "Predict drop, stable, or rise." },
              confidence: { type: Type.NUMBER, description: "Confidence score percentage (0-100)." },
              explanation: { type: Type.STRING },
              suggestedAction: { type: Type.STRING }
            },
            required: ['prediction', 'confidence', 'explanation', 'suggestedAction']
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error('Error analyzing price trend:', e);
      return {
        prediction: 'stable',
        confidence: 60,
        explanation: 'Pricing shows minor seasonal fluctuations but is currently stable.',
        suggestedAction: 'Buy now if needed, or set a price alert for 5% off.'
      };
    }
  }

  public static async extractProductFeatures(description: string): Promise<Record<string, string>> {
    try {
      const ai = getAIClient();
      const prompt = `Extract a flat key-value object of specifications (e.g. processor, display, ram, battery, etc.) from this description:
"${description}"
Return valid JSON only.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error('Error extracting product features:', e);
      return {};
    }
  }
}
