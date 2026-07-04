/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Bell, MessageSquare, User, LogOut, Shield, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, onSearch }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearch(searchVal.trim());
      setCurrentPage('search');
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: ShoppingBag },
    { id: 'search', label: 'Compare', icon: Search },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, auth: true },
    { id: 'alerts', label: 'Alerts', icon: Bell, auth: true },
    { id: 'chat', label: 'AI Assistant', icon: Sparkles },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" id="main_navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-slate-800 flex items-center">
              Value<span className="text-indigo-600">Scout</span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 flex items-center">
                <Sparkles className="h-2.5 w-2.5 mr-0.5 text-indigo-600 animate-pulse" /> AI
              </span>
            </span>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative items-center">
            <span className="absolute left-4 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search products using AI (e.g. 'headphones under 30000')..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-10 pl-11 pr-4 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800"
            />
          </form>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map(item => {
              if (item.auth && !isAuthenticated) return null;
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center text-sm font-medium px-3 py-2 rounded-lg transition ${
                    isActive 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1.5" />
                  {item.label}
                </button>
              );
            })}

            {/* Admin Dashboard */}
            {isAuthenticated && user?.role === 'admin' && (
              <button
                onClick={() => setCurrentPage('admin')}
                className={`flex items-center text-sm font-medium px-3 py-2 rounded-lg transition ${
                  currentPage === 'admin'
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Shield className="h-4 w-4 mr-1.5 text-purple-600" />
                Admin
              </button>
            )}

            {/* User Dropdown / Auth Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden xl:inline">{user?.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                    <button
                      onClick={() => { setCurrentPage('profile'); setDropdownOpen(false); }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 mr-2 text-slate-400" />
                      My Profile
                    </button>
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); setCurrentPage('home'); }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                    >
                      <LogOut className="h-4 w-4 mr-2 text-red-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('profile')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-500 hover:text-slate-900 p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search products using AI..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-slate-100 border border-transparent rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {navItems.map(item => {
            if (item.auth && !isAuthenticated) return null;
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </button>
            );
          })}

          {isAuthenticated && user?.role === 'admin' && (
            <button
              onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }}
              className="flex items-center w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-purple-600 bg-purple-50"
            >
              <Shield className="h-4 w-4 mr-3" />
              Admin Panel
            </button>
          )}

          {isAuthenticated ? (
            <>
              <button
                onClick={() => { setCurrentPage('profile'); setMobileMenuOpen(false); }}
                className="flex items-center w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600"
              >
                <User className="h-4 w-4 mr-3" />
                My Profile
              </button>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); setCurrentPage('home'); }}
                className="flex items-center w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => { setCurrentPage('profile'); setMobileMenuOpen(false); }}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-center font-medium block"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
