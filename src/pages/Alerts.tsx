/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Trash2, Edit2, Play, RefreshCw, ShieldCheck, Heart, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { PriceAlert } from '../types';
import { useAuth } from '../context/AuthContext';

interface AlertsProps {
  onViewProduct: (id: string) => void;
}

export const Alerts: React.FC<AlertsProps> = ({ onViewProduct }) => {
  const { isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState<(PriceAlert & { product?: any })[]>([]);
  const [history, setHistory] = useState<(PriceAlert & { product?: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggeringMonitor, setTriggeringMonitor] = useState(false);
  const [triggerMessage, setTriggerMessage] = useState('');

  // Editing Alert
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState('');

  const fetchAlerts = async () => {
    try {
      const activeRes = await api.alerts.get();
      setAlerts(activeRes.alerts || []);

      const histRes = await api.alerts.history();
      setHistory(histRes.history || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    try {
      await api.alerts.delete(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id: string) => {
    const val = parseFloat(editPriceInput);
    if (!val || isNaN(val)) {
      alert('Please enter a valid price.');
      return;
    }

    try {
      await api.alerts.update(id, val);
      setEditingId(null);
      setEditPriceInput('');
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const triggerPriceMonitorCheck = async () => {
    setTriggeringMonitor(true);
    setTriggerMessage('');
    try {
      const res = await api.alerts.triggerCheck();
      setTriggerMessage(res.message);
      // Refresh list to see if any alerts were triggered!
      await fetchAlerts();
    } catch (err: any) {
      setTriggerMessage(`Error scanning price daemon: ${err.message}`);
    } finally {
      setTriggeringMonitor(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm mt-6 text-center max-w-lg mx-auto p-6 space-y-6">
        <Bell className="h-12 w-12 text-indigo-600 fill-indigo-100" />
        <div>
          <h3 className="font-sans font-bold text-slate-900 text-lg">Alert agent requires authentication</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed font-light">
            Sign in to configure automated pricing trigger thresholds. The ValueScout agent operates a server cron job checking live marketplace adjustments on your behalf.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm mt-6">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
        <span className="text-sm font-semibold text-slate-900">Synchronizing price triggers...</span>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className="font-sans space-y-12 pb-16" id="alerts_page">
      
      {/* Header and Manual Cron Trigger */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Active Pricing Triggers</h2>
          <p className="text-sm text-slate-500">Configure thresholds below which the assistant notifies you immediately.</p>
        </div>

        <button
          onClick={triggerPriceMonitorCheck}
          disabled={triggeringMonitor}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition shadow-sm flex items-center space-x-1.5 shrink-0"
        >
          {triggeringMonitor ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          <span>Run Live Price Scanner Daemon</span>
        </button>
      </div>

      {triggerMessage && (
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs rounded-xl p-4 flex items-center font-semibold">
          <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" /> {triggerMessage}
        </div>
      )}

      {/* Grid of active alerts */}
      {activeAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm text-center p-6">
          <BellRing className="h-10 w-10 text-slate-300 mb-4" />
          <span className="text-sm font-semibold text-slate-900">No active price alert agents</span>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Visit details page of any product in our comparisons and type a target budget price to monitor it!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeAlerts.map((alert) => {
            const isEditing = editingId === alert.id;
            return (
              <div 
                key={alert.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    <img src={alert.product?.images?.[0]} alt={alert.product?.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{alert.platform}</span>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => { setEditingId(alert.id); setEditPriceInput(String(alert.targetPrice)); }}
                          className="text-slate-400 hover:text-indigo-600 p-1 rounded"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(alert.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 
                      onClick={() => onViewProduct(alert.productId)}
                      className="font-sans font-bold text-slate-900 text-xs line-clamp-1 hover:text-indigo-600 transition cursor-pointer"
                    >
                      {alert.product?.name}
                    </h3>

                    <div className="flex items-center space-x-3 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">CURRENT</span>
                        <span className="font-mono text-xs font-bold text-slate-700">₹{alert.currentPrice.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">TARGET</span>
                        {isEditing ? (
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <input
                              type="number"
                              value={editPriceInput}
                              onChange={(e) => setEditPriceInput(e.target.value)}
                              className="w-20 bg-slate-50 border border-slate-200 rounded p-1 text-[11px] font-mono font-bold focus:outline-none"
                            />
                            <button 
                              onClick={() => handleUpdate(alert.id)}
                              className="bg-indigo-600 text-white px-2 py-1 rounded text-[9px] font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-xs font-bold text-indigo-600">₹{alert.targetPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Trigger History */}
      {history.length > 0 && (
        <section className="space-y-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
            Trigger Activity & Notification Logs ({history.length} Fired Triggers)
          </span>

          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {history.map((hist) => (
              <div key={hist.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition">
                <div className="flex items-start space-x-3.5">
                  <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 
                      onClick={() => onViewProduct(hist.productId)}
                      className="font-sans font-semibold text-slate-900 text-xs tracking-tight hover:text-indigo-600 transition cursor-pointer"
                    >
                      {hist.product?.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-light">
                      Flashed below target threshold of ₹{hist.targetPrice.toLocaleString()} on {hist.platform}. Actual price dipped to <span className="font-mono font-bold text-emerald-600">₹{hist.currentPrice.toLocaleString()}</span>.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                    TRIGGERED
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(hist.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
