/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, PlatformPrice, ParsedIntent } from '../../types';

export const EXCHANGE_RATES: Record<string, number> = {
  INR: 1.0,
  USD: 83.5,
  EUR: 90.2,
  GBP: 105.4
};

export class ComparisonEngine {

  /**
   * Normalize any price to INR
   */
  public static convertToINR(price: number, currency: string): number {
    const rate = EXCHANGE_RATES[currency.toUpperCase()] || 1.0;
    return price * rate;
  }

  /**
   * Calculate total effective cost on a platform (Price + Shipping - Discount amount)
   */
  public static calculateTotalCostINR(priceInfo: PlatformPrice): number {
    const basePriceINR = this.convertToINR(priceInfo.price, priceInfo.currency);
    const shippingINR = this.convertToINR(priceInfo.shippingCost, priceInfo.currency);
    const discountAmount = basePriceINR * (priceInfo.discount / 100);
    return Math.round(basePriceINR + shippingINR - discountAmount);
  }

  /**
   * Calculate a Value Score (out of 100) for a platform deal
   * Weighted: price (40%), rating (25%), delivery (15%), return policy (10%), warranty (10%)
   */
  public static calculateDealValueScore(deal: PlatformPrice, lowestCostINR: number): number {
    let score = 0;

    const totalCostINR = this.calculateTotalCostINR(deal);
    
    // 1. Price Score (40%): How close to the lowest available price
    if (totalCostINR > 0) {
      const ratio = lowestCostINR / totalCostINR;
      score += Math.round(ratio * 40);
    }

    // 2. Rating Score (25%): 0-5 seller rating
    score += Math.round((deal.sellerRating / 5) * 25);

    // 3. Delivery Score (15%): Speed of delivery
    const delivery = deal.deliveryTime.toLowerCase();
    if (delivery.includes('tomorrow') || delivery.includes('1 day')) score += 15;
    else if (delivery.includes('2 days') || delivery.includes('3 days')) score += 10;
    else score += 5;

    // 4. Return Policy Score (10%)
    const returnPolicy = deal.returnPolicy.toLowerCase();
    if (returnPolicy.includes('30 days') || returnPolicy.includes('replacement')) score += 10;
    else if (returnPolicy.includes('14 days') || returnPolicy.includes('7 days')) score += 7;
    else score += 3;

    // 5. Warranty Score (10%)
    const warranty = deal.warranty.toLowerCase();
    if (warranty.includes('brand') || warranty.includes('manufacturer') || warranty.includes('1 year') || warranty.includes('year')) score += 10;
    else if (warranty.includes('seller') || warranty.includes('90 days')) score += 6;
    else score += 2;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Normalized pricing and sorted list of platform deals for a single product
   */
  public static getSortedDeals(product: Product) {
    const deals = product.prices.map(priceInfo => {
      const totalCostINR = this.calculateTotalCostINR(priceInfo);
      return {
        ...priceInfo,
        totalCostINR,
        priceINR: Math.round(this.convertToINR(priceInfo.price, priceInfo.currency))
      };
    });

    const lowestCostINR = Math.min(...deals.map(d => d.totalCostINR));
    
    return deals.map(d => ({
      ...d,
      valueScore: this.calculateDealValueScore(d as any, lowestCostINR)
    })).sort((a, b) => a.totalCostINR - b.totalCostINR);
  }

  /**
   * Compare multiple products side-by-side
   */
  public static compareProducts(products: Product[]) {
    return products.map(product => {
      const sortedDeals = this.getSortedDeals(product);
      const bestDeal = sortedDeals.find(d => d.inStock) || sortedDeals[0];
      
      return {
        product,
        bestDeal,
        allDeals: sortedDeals,
        lowestPriceINR: sortedDeals[0]?.totalCostINR || 0
      };
    });
  }

  /**
   * Find Best Deal in general across products considering a parsed intent budget/category
   */
  public static findBestDeal(products: Product[], intent: ParsedIntent) {
    const scoredList = products.map(product => {
      const deals = this.getSortedDeals(product);
      const bestDeal = deals.find(d => d.inStock) || deals[0];
      return {
        product,
        bestDeal,
        score: bestDeal ? bestDeal.valueScore : 0
      };
    });

    // Filter out products exceeding budget if budget exists
    let filtered = scoredList;
    if (intent.budget) {
      filtered = scoredList.filter(item => item.bestDeal && item.bestDeal.totalCostINR <= (intent.budget as number));
    }

    // Sort by best score descending
    return filtered.sort((a, b) => b.score - a.score);
  }
}
