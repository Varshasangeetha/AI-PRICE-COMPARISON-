/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { AIRecommendation as AIRecType } from '../types';

interface AIRecommendationProps {
  recommendation: AIRecType;
  onViewProduct: (id: string) => void;
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({ recommendation, onViewProduct }) => {
  const { recommendedProduct, platform, price, reasons, alternatives = [], totalScore = 85 } = recommendation;

  const getPlatformLabel = (plat: string) => {
    const labels: Record<string, string> = {
      amazon: 'Amazon',
      flipkart: 'Flipkart',
      ebay: 'eBay',
      bestbuy: 'BestBuy',
      walmart: 'Walmart'
    };
    return labels[plat] || plat;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-100 shadow-md p-6 relative overflow-hidden" id="ai_recommendation_card">
      
      {/* Decorative Gradient Ball */}
      <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 bg-purple-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-5">
        <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">VALUE SCOUT AI ANALYSIS</span>
          <h4 className="font-sans font-bold text-slate-900 tracking-tight text-base flex items-center">
            Smart Agent Choice Recommendation
          </h4>
        </div>
      </div>

      {/* Main recommendation item */}
      <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl p-5 mb-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">{recommendedProduct.brand}</span>
            <h3 
              onClick={() => onViewProduct(recommendedProduct.id)}
              className="font-sans font-semibold text-slate-900 text-lg hover:text-indigo-600 transition cursor-pointer leading-tight mb-2"
            >
              {recommendedProduct.name}
            </h3>
            
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-sm text-slate-500">Best Deal on:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                {getPlatformLabel(platform)}
              </span>
              <span className="font-mono font-bold text-lg text-indigo-600">
                ₹{price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Score Circle */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-3.5 rounded-2xl flex flex-col items-center justify-center shadow-lg w-24 h-24 shrink-0 border border-indigo-400">
            <Award className="h-4 w-4 text-indigo-100 mb-1" />
            <span className="text-2xl font-mono font-bold leading-none">{totalScore}</span>
            <span className="text-[9px] font-semibold text-indigo-100 uppercase mt-1 tracking-wider">Value Score</span>
          </div>
        </div>

        {/* Reasons list */}
        <div className="mt-5 pt-4 border-t border-indigo-50 space-y-2.5">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Why our Agent picked this deal:</h5>
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start text-sm text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-150">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Calculated Alternative Options:</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alternatives.map((alt, idx) => (
              <div 
                key={idx} 
                onClick={() => onViewProduct(alt.productId)}
                className="bg-white/55 border border-slate-200 hover:border-indigo-100 hover:bg-white p-3.5 rounded-xl cursor-pointer transition shadow-sm"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">{getPlatformLabel(alt.platform)}</span>
                  <span className="font-mono font-bold text-xs text-slate-900">₹{alt.price.toLocaleString()}</span>
                </div>
                <h6 className="font-sans font-medium text-slate-800 text-xs tracking-tight line-clamp-1 mb-1.5">{alt.name}</h6>
                <p className="text-[11px] text-slate-500 leading-tight">{alt.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
