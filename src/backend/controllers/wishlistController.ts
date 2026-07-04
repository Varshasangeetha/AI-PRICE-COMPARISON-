/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../db/localDb';

export class WishlistController {

  public static getWishlist(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const wishlist = db.getWishlistByUserId(req.user.id);
      
      // Map item IDs back to complete product objects
      const items = wishlist.products.map(item => {
        const product = db.findProductById(item.productId);
        return {
          product,
          addedAt: item.addedAt,
          notes: item.notes
        };
      }).filter(item => item.product !== undefined);

      res.status(200).json({ wishlist: items });
    } catch (e) {
      res.status(500).json({ error: 'Error fetching wishlist' });
    }
  }

  public static addToWishlist(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { productId, notes } = req.body;
      if (!productId) {
        res.status(400).json({ error: 'Product ID is required' });
        return;
      }

      const product = db.findProductById(productId);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      db.addToWishlist(req.user.id, productId, notes);
      db.logActivity(req.user.id, 'add_to_wishlist', { productId });

      res.status(201).json({ message: 'Added to wishlist successfully' });
    } catch (e) {
      res.status(500).json({ error: 'Error adding to wishlist' });
    }
  }

  public static removeFromWishlist(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { id } = req.params; // product ID to remove
      db.removeFromWishlist(req.user.id, id);
      res.status(200).json({ message: 'Removed from wishlist successfully' });
    } catch (e) {
      res.status(500).json({ error: 'Error removing from wishlist' });
    }
  }

  public static checkInWishlist(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { productId } = req.params;
      const wishlist = db.getWishlistByUserId(req.user.id);
      const exists = wishlist.products.some(p => p.productId === productId);
      res.status(200).json({ inWishlist: exists });
    } catch (e) {
      res.status(500).json({ error: 'Error checking wishlist' });
    }
  }

  /**
   * Recommend items based on what's currently in their wishlist!
   */
  public static getWishlistRecommendations(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const wishlist = db.getWishlistByUserId(req.user.id);
      if (wishlist.products.length === 0) {
        // Fallback: return top rated products
        const topRated = db.getProducts()
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 3);
        res.status(200).json({ recommendations: topRated });
        return;
      }

      // Collect categories of products currently in wishlist
      const categoriesInWishlist = wishlist.products.map(item => {
        const prod = db.findProductById(item.productId);
        return prod ? prod.category : null;
      }).filter(c => c !== null);

      // Find other products in these categories not already in wishlist
      const wishlistProductIds = new Set(wishlist.products.map(p => p.productId));
      const recommended = db.getProducts().filter(p => 
        categoriesInWishlist.includes(p.category) && !wishlistProductIds.has(p.id)
      ).slice(0, 3);

      res.status(200).json({ recommendations: recommended });
    } catch (e) {
      res.status(500).json({ error: 'Error getting wishlist recommendations' });
    }
  }
}
