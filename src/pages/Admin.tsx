/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Users, RefreshCw, BarChart2, Server, Trash2, Edit, CheckCircle, AlertTriangle, Play } from 'lucide-react';
import { api } from '../services/api';

export const Admin: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [monitor, setMonitor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.admin.dashboard();
      setStats(statsRes);

      const usersRes = await api.admin.getUsers();
      setUsers(usersRes.users || []);

      const logsRes = await api.admin.logs();
      setLogs(logsRes.logs || []);

      const monRes = await api.admin.monitor();
      setMonitor(monRes.status || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.admin.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
        fetchAdminData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm mt-6">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
        <span className="text-sm font-semibold text-slate-900">Loading secure admin dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="font-sans space-y-12 pb-16" id="admin_page">
      
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-purple-600" /> Admin Command Center
          </h2>
          <p className="text-sm text-slate-500">Monitor pricing APIs, manage active users, and review RAG prompt telemetry.</p>
        </div>

        <button
          onClick={fetchAdminData}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition shadow-sm flex items-center space-x-1.5 shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Console</span>
        </button>
      </div>

      {/* 2. Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Users</span>
            <div className="text-2xl font-mono font-bold text-slate-900">{stats.stats.totalUsers}</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Scraped Catalog</span>
            <div className="text-2xl font-mono font-bold text-indigo-600">{stats.stats.totalProducts}</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Queries Run</span>
            <div className="text-2xl font-mono font-bold text-emerald-600">{stats.stats.totalSearches}</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Deploy Alerts</span>
            <div className="text-2xl font-mono font-bold text-purple-600">{stats.stats.totalAlerts}</div>
          </div>

        </div>
      )}

      {/* 3. API Monitor Status */}
      {monitor && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-indigo-600 border-b border-slate-100 pb-3">
            <Server className="h-4 w-4" />
            <h4 className="font-bold text-slate-900 text-sm">Integrations & API Health Monitor</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 block">Google Gemini API</span>
                <span className="text-slate-400">Model: gemini-2.5-flash</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                monitor.geminiAPI === 'Connected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {monitor.geminiAPI}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 block">Price Scrapers</span>
                <span className="text-slate-400">Search Grounding</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                {monitor.priceScrapers}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 block">Local SQLite DB</span>
                <span className="text-slate-400">File-backed JSON</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                {monitor.dbHealth}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 block">Rate Limiters</span>
                <span className="text-slate-400">CORS Guard</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                {monitor.rateLimiters}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Users Table & Activity Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Management Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 border-b border-slate-100 pb-3">
              <Users className="h-4 w-4" />
              <h4 className="font-bold text-slate-900 text-sm">User Directory ({users.length} Users)</h4>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-96 pr-2">
              {users.map((u) => (
                <div key={u.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">{u.name}</span>
                    <span className="text-slate-400">{u.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role}
                    </span>
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Delete User"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live System Log Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 border-b border-slate-100 pb-3">
              <BarChart2 className="h-4 w-4" />
              <h4 className="font-bold text-slate-900 text-sm">System Telemetry & RAG Logs</h4>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-96 pr-2 font-mono text-[10px] text-slate-600 space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="py-2.5">
                  <div className="flex justify-between items-baseline font-bold">
                    <span className="text-indigo-600 uppercase">ACTION: {log.action}</span>
                    <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    <span className="font-bold text-slate-600">User:</span> {log.userEmail} <br />
                    <span className="font-bold text-slate-600">Context:</span> {JSON.stringify(log.details || {})}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
