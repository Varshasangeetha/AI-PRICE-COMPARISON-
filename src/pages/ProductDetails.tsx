/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, Heart, Bell, MessageSquare, ArrowLeft, ShieldCheck, RefreshCw, Sparkles, TrendingDown, Info, ChevronRight } from 'lucide-react';
import { Product, PlatformPrice } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PriceComparisonTable } from '../components/PriceComparisonTable';

interface ProductDetailsProps {
  productId: string;
  onBack: () => void;
  onViewProduct: (id: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onBack, onViewProduct }) => {
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [deals, setDeals] = useState<PlatformPrice[]>([]);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [history, setHistory] = useState<{ date: string; price: number }[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Review state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Price Alert State
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertPlatform, setAlertPlatform] = useState('amazon');
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Wishlist state
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const res = await api.products.getOne(productId);
        setProduct(res.product);
        setDeals(res.deals || []);

        const simRes = await api.products.similar(productId);
        setSimilar(simRes.similar || []);

        const trendRes = await api.products.trends(productId);
        setHistory(trendRes.history || []);
        setTrendAnalysis(trendRes.analysis || null);

        if (isAuthenticated) {
          const wlCheck = await api.wishlist.check(productId);
          setInWishlist(wlCheck.inWishlist);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [productId, isAuthenticated]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in to add items to your wishlist!');
      return;
    }

    try {
      if (inWishlist) {
        await api.wishlist.remove(productId);
        setInWishlist(false);
      } else {
        await api.wishlist.add(productId);
        setInWishlist(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to set price alerts!');
      return;
    }

    const priceNum = parseFloat(alertTargetPrice);
    if (!priceNum || isNaN(priceNum)) {
      alert('Please enter a valid target price.');
      return;
    }

    try {
      const selectedDeal = deals.find(d => d.platform === alertPlatform) || deals[0];
      await api.alerts.create({
        productId,
        targetPrice: priceNum,
        platform: alertPlatform,
        currentPrice: selectedDeal ? selectedDeal.price : priceNum
      });
      setAlertSuccess(true);
      setAlertTargetPrice('');
      setTimeout(() => setAlertSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setSubmittingReview(true);
    try {
      const updatedData = await api.products.submitReview(productId, {
        rating: ratingInput,
        comment: commentInput,
        userName: user?.name || 'Guest User'
      });
      setProduct(updatedData.product);
      setCommentInput('');
      alert('Review submitted successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm mt-6">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
        <span className="text-sm font-semibold text-slate-900">Loading comprehensive comparison details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <Info className="h-8 w-8 text-rose-500 mb-4" />
        <span className="text-sm font-semibold text-slate-900">Product not found or has been removed</span>
        <button onClick={onBack} className="text-indigo-600 font-semibold mt-4 text-xs flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to listings
        </button>
      </div>
    );
  }

  // Find lowest price
  const lowestPrice = deals[0]?.price || 0;
  const lowestCurrency = deals[0]?.currency || 'INR';

  return (
    <div className="font-sans space-y-12 pb-16" id="product_details_page">
      
      {/* Back Button */}
      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-6">
        <button onClick={onBack} className="text-slate-600 hover:text-indigo-600 flex items-center font-medium">
          <ArrowLeft className="h-4 w-4 mr-1" /> Compare Catalog
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-500 font-medium truncate max-w-sm">{product.name}</span>
      </div>

      {/* Hero Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        
        {/* Left: Carousel / Image */}
        <div className="lg:col-span-5 relative bg-slate-50 rounded-2xl overflow-hidden pt-[80%] border border-slate-100">
          <img 
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'} 
            alt={product.name} 
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase">{product.brand}</span>
              <button
                onClick={handleWishlistToggle}
                className={`p-2.5 rounded-xl border transition flex items-center space-x-1.5 text-xs font-semibold ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-100 text-rose-600'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-600'
                }`}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
                <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center space-x-2">
              <div className="flex text-amber-400">
                <Star className="h-4 w-4 fill-current" />
              </div>
              <span className="text-sm font-bold text-slate-800">{product.averageRating}</span>
              <span className="text-xs text-slate-400">({product.totalReviews} customer evaluations)</span>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Specifications Bento Grid */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Specs</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications || {}).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <div key={key} className="text-xs">
                      <span className="text-slate-400 capitalize block">{key}:</span>
                      <span className="font-semibold text-slate-900">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">Lowest Deal Starts At</span>
              <span className="font-mono text-3xl font-extrabold text-indigo-600">
                {lowestCurrency === 'USD' ? '$' : '₹'}
                {lowestPrice.toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Offers & Platforms Comparison Table */}
      <section>
        <PriceComparisonTable prices={deals} />
      </section>

      {/* Price Alerts Form & Trends Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Set Price Alert */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Bell className="h-5 w-5" />
              <h3 className="font-sans font-bold text-slate-900 text-base">Configure Price Alert Agent</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Specify your target price and platform. Our automated price scraping daemon checks daily and logs updates when it falls to your requested target.
            </p>

            {alertSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl p-3 flex items-center font-semibold">
                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" /> Price alert configured and active!
              </div>
            )}

            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    placeholder="Enter target price in INR..."
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Retail Platform</label>
                <select
                  value={alertPlatform}
                  onChange={(e) => setAlertPlatform(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                >
                  <option value="amazon">Amazon</option>
                  <option value="flipkart">Flipkart</option>
                  <option value="ebay">eBay</option>
                  <option value="bestbuy">BestBuy</option>
                  <option value="walmart">Walmart</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
              >
                Deploy Alert Agent
              </button>
            </form>
          </div>
        </div>

        {/* Price History & Trends Graph */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <h3 className="font-sans font-bold text-slate-900 text-base">AI Pricing Trend & Advice</h3>
            </div>

            {/* Smart Advice Panel */}
            {trendAnalysis && (
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-indigo-900">
                  <span>Forecast Trend: <span className="uppercase text-indigo-600">{trendAnalysis.prediction}</span></span>
                  <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px]">Confidence: {trendAnalysis.confidence}%</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-light">{trendAnalysis.explanation}</p>
                <div className="font-semibold text-slate-800 pt-1 border-t border-indigo-100/50">
                  <span className="text-indigo-600">Suggested:</span> {trendAnalysis.suggestedAction}
                </div>
              </div>
            )}

            {/* SVG Interactive Chart */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Historical Pricing (6 Months)</span>
              
              <div className="h-40 flex items-end justify-between px-2 relative border-b border-slate-200 pb-2">
                
                {history.map((pt, idx) => {
                  const maxPrice = Math.max(...history.map(h => h.price));
                  const minPrice = Math.min(...history.map(h => h.price));
                  // Height ratio (between 25% and 80%)
                  const height = maxPrice === minPrice ? '50%' : `${25 + ((pt.price - minPrice) / (maxPrice - minPrice)) * 55}%`;
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 space-y-2 group">
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-4 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded font-mono transition duration-200">
                        ₹{pt.price.toLocaleString()}
                      </span>
                      
                      {/* Bar indicator */}
                      <div 
                        style={{ height }}
                        className="w-4 bg-gradient-to-t from-indigo-500 to-indigo-600 rounded-t-sm group-hover:from-indigo-600 group-hover:to-purple-600 transition duration-300" 
                      />
                      
                      <span className="text-[9px] font-medium text-slate-400">{pt.date}</span>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Similar products */}
      {similar.length > 0 && (
        <section>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-6">
            Compare Similar Products (RAG Semantic Recommendation)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.slice(0, 4).map(prod => (
              <div 
                key={prod.id}
                onClick={() => onViewProduct(prod.id)}
                className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition shadow-sm relative group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="aspect-video bg-slate-50 rounded-lg overflow-hidden relative">
                    <img src={prod.images?.[0]} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{prod.brand}</span>
                  <h4 className="font-sans font-medium text-slate-900 text-xs tracking-tight line-clamp-2 h-8 group-hover:text-indigo-600 transition">{prod.name}</h4>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-[10px] font-bold text-emerald-600">Sim Score: 95%</span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    ₹{prod.prices?.[0]?.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Review Submit Block */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-sans font-bold text-slate-900 text-base">Write a Customer Evaluation</h3>
          <p className="text-xs text-slate-500 mt-1">Submit your feedback. Reviews help calibrate our AI recommendations scoring.</p>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Rating:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingInput(star)}
                  className={`p-1 hover:scale-110 transition ${
                    star <= ratingInput ? 'text-amber-400' : 'text-slate-200'
                  }`}
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Your Comment</label>
            <textarea
              required
              rows={4}
              placeholder="What do you think about this product's price, specs, and performance?"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="bg-slate-800 hover:bg-slate-950 text-white px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
          >
            {submittingReview ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </form>
      </section>

    </div>
  );
};
