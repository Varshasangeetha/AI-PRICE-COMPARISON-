/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink, Star, ArrowUpDown, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { PlatformPrice } from '../types';
import { ComparisonEngine } from '../backend/services/ComparisonEngine';

interface PriceComparisonTableProps {
  prices: PlatformPrice[];
}

export const PriceComparisonTable: React.FC<PriceComparisonTableProps> = ({ prices }) => {

  const getPlatformClass = (platform: string) => {
    const classes: Record<string, string> = {
      amazon: 'bg-amber-50 text-amber-800 border-amber-200',
      flipkart: 'bg-blue-50 text-blue-800 border-blue-200',
      ebay: 'bg-red-50 text-red-800 border-red-200',
      bestbuy: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      walmart: 'bg-sky-50 text-sky-800 border-sky-200'
    };
    return classes[platform] || 'bg-gray-50 text-gray-800';
  };

  const getPlatformLabel = (platform: string) => {
    const labels: Record<string, string> = {
      amazon: 'Amazon',
      flipkart: 'Flipkart',
      ebay: 'eBay',
      bestbuy: 'BestBuy',
      walmart: 'Walmart'
    };
    return labels[platform] || platform;
  };

  // Pre-calculate normalized values
  const normalizedDeals = prices.map(p => {
    const costINR = ComparisonEngine.calculateTotalCostINR(p);
    const convertedPrice = ComparisonEngine.convertToINR(p.price, p.currency);
    return {
      ...p,
      costINR,
      convertedPrice
    };
  }).sort((a, b) => a.costINR - b.costINR);

  const lowestCost = normalizedDeals[0]?.costINR || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="price_comparison_table">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h4 className="font-sans font-semibold text-slate-900 tracking-tight text-sm">Real-Time Offers & Multi-Platform Comparison</h4>
          <p className="text-xs text-slate-500">Prices are updated live. Normalized to Indian Rupees (INR) for fair comparison.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold tracking-wider bg-slate-50/80">
              <th className="py-3 px-6">Store Platform</th>
              <th className="py-3 px-4">Listed Price</th>
              <th className="py-3 px-4">Est. Discount</th>
              <th className="py-3 px-4">Delivery</th>
              <th className="py-3 px-4">Policies</th>
              <th className="py-3 px-4">Final Scored Cost</th>
              <th className="py-3 px-6 text-right">Shop Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {normalizedDeals.map((deal, idx) => {
              const isBest = deal.costINR === lowestCost && deal.inStock;
              return (
                <tr 
                  key={deal.platform} 
                  className={`transition hover:bg-slate-50/50 ${
                    isBest ? 'bg-indigo-50/20' : ''
                  }`}
                >
                  {/* Platform */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPlatformClass(deal.platform)} uppercase`}>
                        {getPlatformLabel(deal.platform)}
                      </span>
                      {isBest && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 animate-pulse">
                          BEST VALUE
                        </span>
                      )}
                      {!deal.inStock && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Listed Price */}
                  <td className="py-4 px-4 font-mono">
                    <div className="text-slate-900 font-semibold">
                      {deal.currency === 'USD' ? '$' : '₹'}
                      {deal.price.toLocaleString()}
                    </div>
                    {deal.currency !== 'INR' && (
                      <div className="text-[10px] text-slate-400">
                        (~₹{Math.round(deal.convertedPrice).toLocaleString()})
                      </div>
                    )}
                  </td>

                  {/* Discount */}
                  <td className="py-4 px-4">
                    {deal.discount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                        {deal.discount}% OFF
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>

                  {/* Delivery */}
                  <td className="py-4 px-4">
                    <div className="flex items-center text-xs text-slate-600">
                      <Truck className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
                      <div>
                        <div className="font-medium text-slate-900">{deal.deliveryTime}</div>
                        <div className="text-[10px] text-slate-400">
                          {deal.shippingCost > 0 ? `+₹${Math.round(ComparisonEngine.convertToINR(deal.shippingCost, deal.currency))} shipping` : 'Free Shipping'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Policies */}
                  <td className="py-4 px-4">
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center">
                        <RefreshCw className="h-3 w-3 text-slate-400 mr-1" />
                        <span>{deal.returnPolicy}</span>
                      </div>
                      <div className="flex items-center">
                        <ShieldCheck className="h-3 w-3 text-slate-400 mr-1" />
                        <span>{deal.warranty}</span>
                      </div>
                    </div>
                  </td>

                  {/* Final Scored Cost */}
                  <td className="py-4 px-4">
                    <div className="font-mono text-indigo-600 font-bold text-sm">
                      ₹{deal.costINR.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <div className="flex text-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {deal.sellerRating}/5
                      </span>
                    </div>
                  </td>

                  {/* Go Button */}
                  <td className="py-4 px-6 text-right">
                    <a 
                      href={deal.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                        isBest 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Buy Deal <ExternalLink className="h-3 w-3 ml-1.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
