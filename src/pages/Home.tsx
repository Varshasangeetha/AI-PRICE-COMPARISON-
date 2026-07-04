/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Compass, ShoppingBag, ShieldCheck, Heart, Bell } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  setCurrentPage: (page: string) => void;
  onSearch: (query: string) => void;
  onViewProduct: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentPage, onSearch, onViewProduct }) => {
  const [query, setQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingQueries, setTrendingQueries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const pRes = await api.products.getAll({ limit: '3' });
        setFeaturedProducts(pRes.products);

        const tRes = await api.search.trending();
        setTrendingQueries(tRes.trending);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setCurrentPage('search');
    }
  };

  const handleTrendingClick = (term: string) => {
    onSearch(term);
    setCurrentPage('search');
  };

  const categories = [
    { name: 'Mobile Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
    { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181130204-755241524eab?w=300&q=80' },
    { name: 'Audio / Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
    { name: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80' },
    { name: 'Smartwatches', image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300&q=80' },
    { name: 'Smart Home / Speakers', image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=300&q=80' },
    { name: 'Cameras & Drones', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=300&q=80' },
    { name: 'VR & AR Headsets', image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&q=80' }
  ];

  return (
    <div className="font-sans space-y-16 pb-16" id="home_page">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl mt-6 shadow-xl">
        
        {/* Ambient Lights */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center space-x-2 bg-indigo-500/15 border border-indigo-500/35 px-4 py-1.5 rounded-full text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-indigo-400 animate-pulse" />
            Empowered by Google Gemini AI
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
            Find the Best Product Deal, <span className="text-indigo-400">Guaranteed.</span>
          </h1>

          <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto font-light">
            Search products using natural language. Our AI comparison agent instantly scans Amazon, Flipkart, eBay, and BestBuy to recommend the ultimate value deals.
          </p>

          {/* NLP Search Bar */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative mt-8">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border border-indigo-100">
              <div className="pl-3 text-indigo-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="What are you shopping for? Try: 'laptops under 120000'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent pl-3 pr-12 py-3 text-sm focus:outline-none text-gray-800"
              />
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition shadow-lg shrink-0 flex items-center space-x-1.5"
              >
                <span>Scout Deals</span>
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Trending Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 text-xs text-indigo-200">
            <span className="font-semibold flex items-center"><TrendingUp className="h-3.5 w-3.5 mr-1" /> Trending:</span>
            {trendingQueries.map((term, idx) => (
              <button
                key={idx}
                onClick={() => handleTrendingClick(term)}
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition border border-white/5 font-medium cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">THE VALUE SCOUT DIFFERENCE</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2 font-sans">
            How our AI Comparison Agent Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="bg-indigo-50 text-indigo-600 h-12 w-12 rounded-xl flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-sans font-bold text-slate-900 text-base">NLP Intent Parser</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We don't just match keywords. Gemini parses complex requests including budget constraints, color preferences, RAM, and processor specifications.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="bg-indigo-50 text-indigo-600 h-12 w-12 rounded-xl flex items-center justify-center mx-auto shadow-inner">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-sans font-bold text-slate-900 text-base">True Scored Comparison</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our unique value-scoring engine checks listed price, seller feedback, warranty period, delivery timeframe, and shipping costs to rate every deal.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="bg-indigo-50 text-indigo-600 h-12 w-12 rounded-xl flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-sans font-bold text-slate-900 text-base">Persistent Price Guard</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Set automated target price alerts. Our background price collector checks constantly and emails/notifies you when prices fall.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Browse Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">EXPLORE CATALOG</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
              Shop by Category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => { onSearch(cat.name); setCurrentPage('search'); }}
              className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-slate-200 hover:shadow-md transition duration-300"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-4">
                <span className="font-sans font-semibold text-white text-sm tracking-tight">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">EXCLUSIVE FINDS</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
              Top Scored Tech Products
            </h2>
          </div>
          <button 
            onClick={() => { onSearch(''); setCurrentPage('search'); }}
            className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold flex items-center space-x-1"
          >
            <span>View All Products</span>
            <span>&rarr;</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-200 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={onViewProduct}
                onSetAlert={() => { setCurrentPage('alerts'); }}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
