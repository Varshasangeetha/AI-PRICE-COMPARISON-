/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, ChevronUp, RefreshCw, Paperclip } from 'lucide-react';
import { api } from '../services/api';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hi! I am your ValueScout AI shopping assistant. Ask me anything about specifications, price comparison, or buying recommendations!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // Form chat history
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await api.search.chat(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: res.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message || 'Couldn\'t connect to AI'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'model', text: "Hi! I am your ValueScout AI shopping assistant. Ask me anything about specifications, price comparison, or buying recommendations!" }
    ]);
  };

  const suggestions = [
    "Should I buy iPhone 15 Pro or S24 Ultra?",
    "Best noise-cancelling headphones",
    "Is MacBook Pro M3 worth it?",
    "Suggest gadgets under 50000"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:scale-105 hover:bg-indigo-700 transition z-50 flex items-center justify-center border border-indigo-500"
        id="floating_chat_trigger"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
          1
        </span>
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-32px)] h-[500px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col z-50 overflow-hidden font-sans"
      id="floating_chat_widget"
    >
      {/* Header */}
      <div className="bg-indigo-600 px-4 py-3 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <div className="bg-white/10 p-1.5 rounded-lg">
            <Sparkles className="h-4 w-4 text-indigo-200" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">ValueScout Smart Agent</h4>
            <span className="text-[10px] text-indigo-200">Online & ready to compare</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={clearChat} 
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition"
            title="Clear conversation"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none leading-relaxed'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs text-slate-400 flex items-center space-x-1 shadow-sm">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Try asking:</span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInput(s)}
                className="text-[10px] bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-100 px-2.5 py-1 rounded-full transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex items-center bg-white space-x-2">
        <input
          type="text"
          placeholder="Ask AI comparison questions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800"
        />
        <button 
          type="submit" 
          className="bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 transition"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};
