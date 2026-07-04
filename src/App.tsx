/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { ProductDetails } from './pages/ProductDetails';
import { Wishlist } from './pages/Wishlist';
import { Alerts } from './pages/Alerts';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { ChatWidget } from './components/ChatWidget';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('details');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            setCurrentPage={setCurrentPage} 
            onSearch={handleSearch} 
            onViewProduct={handleViewProduct} 
          />
        );
      case 'search':
        return (
          <Search 
            initialQuery={searchQuery} 
            onViewProduct={handleViewProduct} 
          />
        );
      case 'details':
        return (
          <ProductDetails 
            productId={selectedProductId} 
            onBack={() => setCurrentPage('search')} 
            onViewProduct={handleViewProduct} 
          />
        );
      case 'wishlist':
        return (
          <Wishlist 
            onViewProduct={handleViewProduct} 
          />
        );
      case 'alerts':
        return (
          <Alerts 
            onViewProduct={handleViewProduct} 
          />
        );
      case 'chat':
        return (
          <Chat 
            onViewProduct={handleViewProduct} 
          />
        );
      case 'profile':
        return <Profile />;
      case 'admin':
        return <Admin />;
      default:
        return (
          <Home 
            setCurrentPage={setCurrentPage} 
            onSearch={handleSearch} 
            onViewProduct={handleViewProduct} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans" id="app_root_layout">
      <div>
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          onSearch={handleSearch} 
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderPage()}
        </main>
      </div>

      {/* Footer */}
      <footer className="h-12 bg-slate-800 text-slate-400 flex flex-col sm:flex-row items-center justify-between px-8 text-[10px] shrink-0 font-medium uppercase tracking-wider mt-12 py-3 sm:py-0 gap-2 shadow-inner" id="main_footer">
        <div>© 2026 ValueScout AI Comparison Agent</div>
        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          <span>Systems Grounded</span>
          <span>SQLite DB Enabled</span>
          <span>Gemini LLM Active</span>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      {currentPage !== 'chat' && <ChatWidget />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
