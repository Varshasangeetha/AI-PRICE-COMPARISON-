/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, History, Shield, Info, Lock, Mail, UserCheck, KeySquare, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Profile: React.FC = () => {
  const { user, login, register, logout, isAuthenticated, updateUserPreferences } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  // Forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // User details preferences
  const [currency, setCurrency] = useState('INR');
  const [notifications, setNotifications] = useState(true);

  // History timeline
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setCurrency(user.preferences?.currency || 'INR');
      setNotifications(user.preferences?.notifications !== false);

      // Fetch search logs
      api.search.history()
        .then(res => setHistory(res.history || []))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMsg('Full name is required');
          setSubmitting(false);
          return;
        }
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserPreferences({
        currency,
        notifications
      });
      alert('Preferences saved successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="font-sans max-w-md mx-auto py-16 px-4" id="auth_view">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          
          {/* Logo / Icon */}
          <div className="text-center space-y-2">
            <div className="bg-indigo-50 text-indigo-600 h-12 w-12 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <KeySquare className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isSignUp ? 'Create comparison account' : 'Sign in to ValueScout'}
            </h2>
            <p className="text-xs text-slate-500">Access price alerts, saved wishlists, and shopping assistant memory logs.</p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl p-3 flex items-center font-semibold">
              <Shield className="h-4 w-4 mr-2 text-rose-500" /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-3.5 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400 h-4 w-4" />
                <input
                  type="email"
                  required
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400 h-4 w-4" />
                <input
                  type="password"
                  required
                  placeholder="Enter secure password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-xs tracking-wide transition shadow-lg flex items-center justify-center space-x-1.5"
            >
              <span>{submitting ? 'Connecting...' : isSignUp ? 'Create Free Account' : 'Sign In Now'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up Free"}
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16" id="profile_page">
      
      {/* Left panel: Profile Card and Settings */}
      <div className="lg:col-span-5 space-y-6 mt-6">
        
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="h-16 w-16 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-bold text-xl border border-indigo-200">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-sans font-bold text-slate-900 text-lg leading-tight">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider">
              Role: {user?.role}
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        {/* Configuration preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 text-indigo-600 border-b border-slate-100 pb-3 mb-4">
            <Settings className="h-4 w-4" />
            <h4 className="font-bold text-slate-900 text-sm">Agent & System Preferences</h4>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Default Currency Conversion</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none text-slate-800"
              >
                <option value="INR">Indian Rupees (INR - ₹)</option>
                <option value="USD">US Dollars (USD - $)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Deploy Automated Notifications</span>
                <span className="text-[10px] text-slate-400">Receive triggered alerts</span>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 text-indigo-600 rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-semibold tracking-wide transition shadow-sm"
            >
              Save Preferences
            </button>
          </form>
        </div>

      </div>

      {/* Right panel: Timeline of Search Log Activity */}
      <div className="lg:col-span-7 space-y-6 mt-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
          <div className="flex items-center space-x-2 text-indigo-600 border-b border-slate-100 pb-3 mb-6">
            <History className="h-4 w-4" />
            <h4 className="font-bold text-slate-900 text-sm">Recent Search Activity Logs</h4>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center p-6 space-y-3">
              <Info className="h-8 w-8 text-slate-300" />
              <span className="text-xs font-semibold text-slate-900">No activity logs recorded</span>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                As you perform NLP natural language scans, history logs will appear here detailing the parsed intents.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((hist) => (
                <div key={hist.id} className="relative flex gap-4 pl-4 before:absolute before:left-[11px] before:top-8 before:bottom-0 before:w-0.5 before:bg-slate-100">
                  <div className="h-6 w-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-baseline justify-between">
                      <h5 className="text-xs font-bold text-slate-800 font-sans">Scouted "{hist.query}"</h5>
                      <span className="text-[9px] text-slate-400 font-mono">{new Date(hist.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Specifications badges parsed */}
                    {hist.parsedIntent && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hist.parsedIntent.brand && (
                          <span className="text-[9px] font-semibold uppercase bg-slate-50 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                            Brand: {hist.parsedIntent.brand}
                          </span>
                        )}
                        {hist.parsedIntent.budget && (
                          <span className="text-[9px] font-semibold uppercase bg-slate-50 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                            Budget: {hist.parsedIntent.budget}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
