/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ExternalLink, RefreshCw, ShoppingBag, Info, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface WishlistProps {
  onViewProduct: (id: string) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ onViewProduct }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<{ product: Product; addedAt: string; notes?: string }[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.wishlist.get();
      setItems(res.wishlist || []);

      const recRes = await api.wishlist.recommendations();
      setRecommendations(recRes.recommendations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleRemove = async (productId: string) => {
    try {
      await api.wishlist.remove(productId);
      setItems(prev => prev.filter(item => item.product.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm mt-6 text-center max-w-lg mx-auto p-6 space-y-6">
        <Heart className="h-12 w-12 text-rose-500 fill-rose-100" />
        <div>
          <h3 className="font-sans font-bold text-slate-900 text-lg">Wishlist requires authentication</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed font-light">
            Please log in or create an account to start saving items, adding personal shopping notes, and receiving personalized discount trackers.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm mt-6">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
        <span className="text-sm font-semibold text-slate-900">Synchronizing saved products...</span>
      </div>
    );
  }

  return (
    <div className="font-sans space-y-12 pb-16" id="wishlist_page">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">My Saved Wishlist</h2>
        <p className="text-sm text-slate-500">Track and manage products you are watching. Price fluctuations are scanned daily.</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-center p-6">
          <ShoppingBag className="h-10 w-10 text-slate-300 mb-4" />
          <span className="text-sm font-semibold text-slate-900">Your wishlist is currently empty</span>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Search items in the Compare screen and click the heart icon on any card to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(({ product, addedAt, notes }) => {
            const lowestPrice = product.prices?.[0]?.price || 0;
            return (
              <div 
                key={product.id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5 relative group"
              >
                {/* Thumb */}
                <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-xl overflow-hidden shrink-0 relative border border-slate-100">
                  <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{product.brand}</span>
                      <button 
                        onClick={() => handleRemove(product.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded transition"
                        title="Delete from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 
                      onClick={() => onViewProduct(product.id)}
                      className="font-sans font-semibold text-slate-900 text-sm tracking-tight hover:text-indigo-600 transition cursor-pointer line-clamp-1 mb-1 mt-0.5"
                    >
                      {product.name}
                    </h3>

                    <span className="font-mono text-base font-extrabold text-indigo-600">
                      ₹{lowestPrice.toLocaleString()}
                    </span>

                    <p className="text-[11px] text-slate-400 mt-1.5 font-light">Added on {new Date(addedAt).toLocaleDateString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button 
                      onClick={() => onViewProduct(product.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                    >
                      <span>Check Live Deals</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RAG Wishlist Recommendations Banner */}
      {recommendations.length > 0 && (
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          
          <div className="absolute top-0 right-0 h-48 w-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 mr-1 text-yellow-300 animate-pulse" />
              <span>Smart RAG Catalog recommendation</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">
              Curated alternative deals you might love:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              {recommendations.slice(0, 3).map(prod => (
                <div 
                  key={prod.id}
                  onClick={() => onViewProduct(prod.id)}
                  className="bg-white/10 hover:bg-white/15 border border-white/5 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-200 uppercase">{prod.brand}</span>
                    <h4 className="text-xs font-bold font-sans tracking-tight line-clamp-1">{prod.name}</h4>
                  </div>
                  <div className="mt-4 flex justify-between items-baseline pt-2 border-t border-white/5">
                    <span className="text-[9px] font-semibold text-emerald-300">★★★★★ {prod.averageRating}</span>
                    <span className="font-mono text-xs font-bold text-white">₹{prod.prices?.[0]?.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
};
