/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, Heart, Bell, ExternalLink, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: string) => void;
  onSetAlert?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onSetAlert }) => {
  const { isAuthenticated } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [lowestPrice, setLowestPrice] = useState<number>(0);
  const [lowestPlatform, setLowestPlatform] = useState<string>('');

  useEffect(() => {
    // Find lowest price
    if (product.prices && product.prices.length > 0) {
      const sorted = [...product.prices].sort((a, b) => {
        // Simple conversion for displaying
        const aPrice = a.currency === 'USD' ? a.price * 83.5 : a.price;
        const bPrice = b.currency === 'USD' ? b.price * 83.5 : b.price;
        return aPrice - bPrice;
      });
      setLowestPrice(sorted[0].price);
      setLowestPlatform(sorted[0].platform);
    }

    // Check wishlist
    if (isAuthenticated) {
      api.wishlist.check(product.id)
        .then(res => setInWishlist(res.inWishlist))
        .catch(err => console.error(err));
    }
  }, [product, isAuthenticated]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to use wishlists!');
      return;
    }

    try {
      if (inWishlist) {
        await api.wishlist.remove(product.id);
        setInWishlist(false);
      } else {
        await api.wishlist.add(product.id);
        setInWishlist(true);
      }
    } catch (e) {
      console.error(e);
    }
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

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full cursor-pointer overflow-hidden relative group"
      onClick={() => onViewDetails(product.id)}
      id={`prod_card_${product.id}`}
    >
      {/* Thumbnail */}
      <div className="relative pt-[70%] bg-slate-50 overflow-hidden">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md border transition ${
            inWishlist 
              ? 'bg-rose-50 border-rose-100 text-rose-500' 
              : 'bg-white/80 border-slate-200 text-slate-500 hover:text-rose-500'
          }`}
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>

        {/* Category Tag */}
        <span className="absolute bottom-3 left-3 px-2 py-1 text-[10px] font-semibold bg-slate-900/80 text-white rounded-md uppercase tracking-wider backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Brand */}
        <span className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase mb-1">
          {product.brand}
        </span>

        {/* Title */}
        <h3 className="font-sans font-medium text-slate-800 text-sm tracking-tight mb-2 line-clamp-2 h-10 group-hover:text-indigo-600 transition">
          {product.name}
        </h3>

        {/* Reviews */}
        <div className="flex items-center space-x-1.5 mb-3">
          <div className="flex text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold text-slate-700">{product.averageRating}</span>
          <span className="text-slate-400 text-[10px]">({product.totalReviews} reviews)</span>
        </div>

        {/* Features list bullet previews */}
        <div className="flex flex-wrap gap-1 mb-4 h-6 overflow-hidden">
          {Object.entries(product.specifications || {}).slice(0, 2).map(([key, value]) => {
            if (!value) return null;
            return (
              <span key={key} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                {key.toUpperCase()}: {value}
              </span>
            );
          })}
        </div>

        {/* Lowest Price Block */}
        <div className="mt-auto border-t border-slate-100 pt-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">BEST DEALS FROM</span>
              <span className="font-mono font-bold text-lg text-slate-800">
                {product.prices?.[0]?.currency === 'USD' ? '$' : '₹'}
                {lowestPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 capitalize">
                {getPlatformLabel(lowestPlatform)}
              </span>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex space-x-2 mt-3">
            <button 
              onClick={(e) => { e.stopPropagation(); onViewDetails(product.id); }}
              className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-1.5 rounded-lg text-xs font-medium transition text-center flex items-center justify-center border border-indigo-100"
            >
              See Deals <ExternalLink className="h-3 w-3 ml-1" />
            </button>
            {onSetAlert && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSetAlert(product); }}
                className="bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 p-1.5 rounded-lg border border-slate-200 transition"
                title="Set Price Alert"
              >
                <Bell className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
