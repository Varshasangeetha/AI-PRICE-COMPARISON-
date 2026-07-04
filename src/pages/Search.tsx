/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Sparkles, Filter, RefreshCw, Layers, Sliders, Info } from 'lucide-react';
import { Product, AIRecommendation as AIRecType } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { AIRecommendation } from '../components/AIRecommendation';

interface SearchProps {
  initialQuery?: string;
  onViewProduct: (id: string) => void;
}

export const Search: React.FC<SearchProps> = ({ initialQuery = '', onViewProduct }) => {
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [aiRec, setAiRec] = useState<AIRecType | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNlpSearch, setIsNlpSearch] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Autoload
  useEffect(() => {
    handleSearch(initialQuery);
  }, [initialQuery]);

  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    setAiRec(null);
    setIsNlpSearch(false);

    try {
      if (searchTerm.trim()) {
        // Evaluate if this looks like an NLP query (more than 2 words or contains specific terms)
        const words = searchTerm.trim().split(/\s+/);
        const looksLikeNLP = words.length > 2 || /under|above|budget|with|from|than|below/i.test(searchTerm);

        if (looksLikeNLP) {
          console.log('[Search] Executing NLP naturalSearch...');
          setIsNlpSearch(true);
          const res = await api.search.natural(searchTerm);
          setProducts(res.products || []);
          setAiRec(res.recommendation);
        } else {
          console.log('[Search] Executing keyword search...');
          const params: Record<string, string> = { search: searchTerm };
          if (categoryFilter) params.category = categoryFilter;
          if (brandFilter) params.brand = brandFilter;
          const res = await api.products.getAll(params);
          
          if (res.products && res.products.length > 0) {
            setProducts(res.products || []);
          } else {
            console.log('[Search] No local results found for keyword search. Falling back to NLP natural search for dynamic price comparison...');
            setIsNlpSearch(true);
            const resNlp = await api.search.natural(searchTerm);
            setProducts(resNlp.products || []);
            setAiRec(resNlp.recommendation);
          }
        }
      } else {
        console.log('[Search] Fetching all products...');
        const params: Record<string, string> = {};
        if (categoryFilter) params.category = categoryFilter;
        if (brandFilter) params.brand = brandFilter;
        const res = await api.products.getAll(params);
        setProducts(res.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const applyKeywordFilters = () => {
    // Re-trigger standard fetch
    handleSearch(query);
  };

  // Unique brands & categories from fetched list for the filter options
  const uniqueCategories = [
    'Mobile Phones', 'Laptops', 'Audio / Headphones', 'Tablets', 'Gaming / Consoles', 'Smartwatches', 'Smart Home / Speakers', 'Cameras & Drones', 'VR & AR Headsets'
  ];
  const uniqueBrands = [
    'Acer', 'Amazon', 'Apple', 'Asus', 'Bose', 'Dell', 'DJI', 'Fitbit', 'Garmin', 'Google', 'GoPro', 'HP', 'Lenovo', 'Meta', 'Microsoft', 'Nintendo', 'Nothing', 'OnePlus', 'Samsung', 'Sennheiser', 'Sony'
  ];

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price_asc') {
      return (a.prices?.[0]?.price || 0) - (b.prices?.[0]?.price || 0);
    }
    if (sortBy === 'price_desc') {
      return (b.prices?.[0]?.price || 0) - (a.prices?.[0]?.price || 0);
    }
    if (sortBy === 'rating') {
      return b.averageRating - a.averageRating;
    }
    return 0;
  });

  return (
    <div className="font-sans space-y-8 pb-16" id="search_page">
      
      {/* 1. Header & Search Area */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Search Comparison Engine</h2>
        <p className="text-sm text-slate-500 mb-6">Type a brand, specific item, or describe what you want in full natural sentences.</p>

        <form onSubmit={handleFormSubmit} className="relative flex items-center bg-slate-100 border border-transparent rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition duration-200 max-w-3xl">
          <div className="pl-3 text-indigo-600 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="What product are you looking to buy today? (e.g., Apple headphones with active noise cancellation)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent pl-3 pr-10 py-3 text-sm focus:outline-none text-slate-800 font-sans"
          />
          <button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition shadow-md flex items-center space-x-1 shrink-0"
          >
            <span>AI Scout</span>
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 2. Left Panel: Filters */}
        <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center">
              <Filter className="h-4 w-4 mr-2 text-indigo-600" /> Catalog Filters
            </h3>
            <button 
              onClick={() => { setCategoryFilter(''); setBrandFilter(''); setSortBy(''); }}
              className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold"
            >
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Category</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Brands */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Brand</label>
            <select 
              value={brandFilter} 
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sort Results By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="">Best Match</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          <button 
            onClick={applyKeywordFilters}
            className="w-full bg-slate-800 hover:bg-slate-950 text-white py-2 rounded-xl text-xs font-semibold tracking-wide transition shadow-sm flex items-center justify-center space-x-1"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>

        {/* 3. Right Panel: Results & AI Recommendations */}
        <div className="flex-1 space-y-8">
          
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
              <span className="text-sm font-semibold text-slate-900">ValueScout agent is scanning deal engines...</span>
              <span className="text-xs text-slate-400 mt-1">Normalizing currencies and calculating value scores</span>
            </div>
          )}

          {!loading && aiRec && (
            <div className="transition">
              <AIRecommendation recommendation={aiRec} onViewProduct={onViewProduct} />
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <Info className="h-8 w-8 text-slate-400 mb-4" />
              <span className="text-sm font-semibold text-slate-900">No products match your query</span>
              <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                Try searching for a different keyword or describe a broader item description.
              </p>
            </div>
          )}

          {!loading && sortedProducts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Active Comparison List ({products.length} Products Found)
                </span>
                {isNlpSearch && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                    <Sparkles className="h-3 w-3 mr-1 animate-pulse" /> AI Expanded Result
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onViewDetails={onViewProduct}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
