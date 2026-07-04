/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RefreshCw, ShoppingBag, ShieldAlert, Heart, ChevronRight, CornerDownRight } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';

interface ChatProps {
  onViewProduct: (id: string) => void;
}

export const Chat: React.FC<ChatProps> = ({ onViewProduct }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hello! I am your ValueScout AI shopping partner. You can ask me to compare specifications, suggest gadgets within a budget, or describe what you want in full detail (e.g. 'headphones with strong bass and ANC under 20000')." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load local catalog to provide visual quick access during chat
    api.products.getAll({ limit: '4' })
      .then(res => setCatalog(res.products || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await api.search.chat(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: res.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'model', text: `Connection Failure: ${err.message || 'Check network connection'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'model', text: "Hello! I am your ValueScout AI shopping partner. You can ask me to compare specifications, suggest gadgets within a budget, or describe what you want in full detail (e.g. 'headphones with strong bass and ANC under 20000')." }
    ]);
  };

  const suggestedQuestions = [
    "Suggest noise-cancelling headphones under 15000",
    "Should I buy PlayStation 5 or Nintendo Switch?",
    "MacBook Pro M3 vs Dell XPS 15",
    "What are some popular trending gadgets?"
  ];

  return (
    <div className="font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 h-[calc(100vh-140px)] min-h-[500px]" id="chat_page_layout">
      
      {/* Left panel: Catalog and suggestions */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-6 h-full">
        
        {/* Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
            <h3 className="font-bold text-slate-900 text-sm">ValueScout Smart Partner</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            Interact with our Gemini-powered conversational agent. Ask complex queries and receive structured tabular data or weighted buying score matrices.
          </p>
        </div>

        {/* Suggestion box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex-1 overflow-y-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Quick Prompts</span>
          <div className="space-y-2">
            {suggestedQuestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInput(s)}
                className="w-full text-left bg-slate-50 border border-slate-200 hover:border-indigo-100 hover:bg-indigo-50/30 p-3 rounded-xl transition text-xs font-semibold text-slate-700 flex items-start"
              >
                <CornerDownRight className="h-3.5 w-3.5 mr-2 text-indigo-500 shrink-0 mt-0.5" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick action catalog */}
        {catalog.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 hidden lg:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Quick Catalog Check</span>
            <div className="divide-y divide-slate-100">
              {catalog.map(prod => (
                <div 
                  key={prod.id} 
                  onClick={() => onViewProduct(prod.id)}
                  className="py-2.5 flex items-center justify-between cursor-pointer group"
                >
                  <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-600 transition truncate max-w-[180px]">{prod.name}</span>
                  <span className="font-mono text-xs font-bold text-indigo-600">₹{prod.prices?.[0]?.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right panel: Chat interface */}
      <div className="lg:col-span-8 flex flex-col h-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Agent Conversation Room</span>
          </div>
          
          <button 
            onClick={clearChat}
            className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold flex items-center"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Clear Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none font-light'
              }`}>
                {/* Parse line breaks inside message */}
                {m.text.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className={line.trim() ? 'mb-2' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-5 py-3 text-sm text-slate-400 flex items-center space-x-1.5 shadow-sm">
                <span className="animate-bounce font-bold">●</span>
                <span className="animate-bounce delay-100 font-bold">●</span>
                <span className="animate-bounce delay-200 font-bold">●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Form Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex items-center space-x-3">
          <input
            type="text"
            required
            placeholder="Describe what gadget or feature set you want to compare..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800 font-sans"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl transition shadow-md flex items-center justify-center shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
