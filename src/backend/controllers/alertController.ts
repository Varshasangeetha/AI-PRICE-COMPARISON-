/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../db/localDb';
import { PriceCollector } from '../services/PriceCollector';

export class AlertController {

  public static getAlerts(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const list = db.getPriceAlerts(req.user.id);
      
      const populated = list.map(alert => {
        const product = db.findProductById(alert.productId);
        return {
          ...alert,
          product
        };
      }).filter(a => a.product !== undefined);

      res.status(200).json({ alerts: populated });
    } catch (e) {
      res.status(500).json({ error: 'Error fetching price alerts' });
    }
  }

  public static createAlert(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { productId, targetPrice, platform, currentPrice } = req.body;
      if (!productId || !targetPrice || !platform) {
        res.status(400).json({ error: 'Product ID, target price, and platform are required' });
        return;
      }

      const product = db.findProductById(productId);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const alert = db.createPriceAlert({
        userId: req.user.id,
        productId,
        targetPrice: Number(targetPrice),
        currentPrice: Number(currentPrice || targetPrice),
        platform
      });

      db.logActivity(req.user.id, 'set_alert', { productId, targetPrice, platform });

      res.status(201).json({ message: 'Price alert created successfully', alert });
    } catch (e) {
      res.status(500).json({ error: 'Error creating price alert' });
    }
  }

  public static updateAlert(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { id } = req.params;
      const { targetPrice } = req.body;
      if (!targetPrice) {
        res.status(400).json({ error: 'Target price is required' });
        return;
      }

      const updated = db.updatePriceAlert(id, { targetPrice: Number(targetPrice) });
      if (!updated) {
        res.status(404).json({ error: 'Alert not found' });
        return;
      }

      res.status(200).json({ message: 'Alert updated successfully', alert: updated });
    } catch (e) {
      res.status(500).json({ error: 'Error updating alert' });
    }
  }

  public static deleteAlert(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { id } = req.params;
      db.deletePriceAlert(id);
      res.status(200).json({ message: 'Price alert cancelled/deleted successfully' });
    } catch (e) {
      res.status(500).json({ error: 'Error deleting alert' });
    }
  }

  public static getAlertHistory(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Triggered or cancelled alerts of this user
    const list = db.getPriceAlerts(req.user.id).filter(a => a.status === 'triggered');
    const populated = list.map(alert => {
      const product = db.findProductById(alert.productId);
      return {
        ...alert,
        product
      };
    }).filter(a => a.product !== undefined);

    res.status(200).json({ history: populated });
  }

  /**
   * Cron job trigger to verify price fluctuations and trigger alerts!
   */
  public static async checkAlerts(req: AuthenticatedRequest, res: Response) {
    try {
      await PriceCollector.monitorPriceChanges();
      res.status(200).json({ message: 'Price monitor checking completed successfully.' });
    } catch (e) {
      res.status(500).json({ error: 'Error scanning price changes.' });
    }
  }
}
