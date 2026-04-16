'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeStore } from '@/lib/api';
import { demoData } from '@/lib/demoData';
import ScoreCard from './components/ScoreCard';
import ProductCard from './components/ProductCard';
import QuerySimulator from './components/QuerySimulator';
import { Bot, RefreshCcw, Loader2, Search, TriangleAlert, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const fetchData = async (forceDemo: boolean = false) => {
    setLoading(true);
    setError(null);
    
    if (forceDemo || isDemo) {
        setTimeout(() => {
            setData(demoData);
            setLoading(false);
        }, 1500);
        return;
    }

    const url = localStorage.getItem('shopify_url') || '';
    const token = localStorage.getItem('shopify_token') || '';

    try {
      const result = await analyzeStore(url, token);
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to connect to the backend. Please ensure the FastAPI server is running.');
      // Automatically fallback to demo data if backend is missing for presentation safety
      setIsDemo(true);
      setData(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const demoMode = localStorage.getItem('demo_mode') === 'true';
    setIsDemo(demoMode);
    fetchData(demoMode);
  }, []);

  if (!isMounted) return null;

  const toggleDemo = () => {
    const nextMode = !isDemo;
    setIsDemo(nextMode);
    localStorage.setItem('demo_mode', String(nextMode));
    fetchData(nextMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6">
        <div className="relative mb-12">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <Bot className="text-blue-500 relative animate-bounce" size={64} />
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-2">Waking up Agent Intelligence...</h2>
        <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
            <Sparkles size={16} />
            <p className="text-sm font-bold uppercase tracking-widest">Simulating AI Shopping Behaviors</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      <nav className="border-b border-zinc-900 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/40 group-hover:scale-110 transition-transform">
              <Bot size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter">AI RepOptimizer</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
                onClick={toggleDemo}
                suppressHydrationWarning
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${isDemo ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-lg shadow-amber-900/10' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
                {isDemo ? 'Demo Mode Active' : 'Live Store Mode'}
            </button>
            <button 
              onClick={() => fetchData()}
              suppressHydrationWarning
              className="p-2 text-zinc-500 hover:text-white transition-colors hover:rotate-180 duration-500"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>
      </nav>

      {error && !isDemo && (
        <div className="max-w-7xl mx-auto px-8 mt-6">
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-400">
                <TriangleAlert size={20} />
                <p className="text-sm font-bold">{error}</p>
            </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-20 space-y-2">
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-zinc-600 bg-clip-text text-transparent">
            AI Readiness Audit
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Analyzing your store through the lens of Agentic AI (Llama 3.3 70B Engine).
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-24">
          <div className="lg:col-span-1">
             <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-3 relative z-10">Readiness Score</span>
                <span className="text-7xl font-black relative z-10 tabular-nums">{data.store_score.overall_score}</span>
                <div className="mt-6 px-4 py-1.5 bg-black/20 rounded-full text-[10px] font-black uppercase tracking-widest relative z-10 backdrop-blur-md">
                    Target: 85+
                </div>
             </div>
          </div>
          {Object.entries(data.store_score.dimension_scores).map(([key, details]: [string, any]) => (
            <ScoreCard 
              key={key}
              label={key.replace('_', ' ')} 
              score={details.score}
              reason={details.reason}
            />
          ))}
        </div>

        {/* Query Simulator - The "Wow" Component */}
        <div className="mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <QuerySimulator products={data.products} />
        </div>

        {/* Product Gaps */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">Intelligence Gap Analysis</h2>
            <p className="text-zinc-500 font-medium">Deep dive into specific product misinterpretations.</p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Critical Gaps Detected</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {data.products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-zinc-900 mt-40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800">
                    <Bot size={20} className="text-zinc-400" />
                </div>
                <div>
                   <p className="text-sm font-bold">AI Representation Optimizer</p>
                   <p className="text-xs text-zinc-500">© 2026 Hackathon Edition</p>
                </div>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
                <a href="#" className="hover:text-white transition-colors">API Status</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
        </div>
      </footer>
    </div>
  );
}
