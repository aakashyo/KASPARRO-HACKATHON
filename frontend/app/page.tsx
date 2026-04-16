'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [storeUrl, setStoreUrl] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, we'd validate here. For hacking, we pass to dashboard.
    localStorage.setItem('shopify_url', storeUrl);
    localStorage.setItem('shopify_token', token);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Bot size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter">AI RepOptimizer</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">How it works</a>
          <a href="#" className="hover:text-white transition-colors">Demo Store</a>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest animate-fade-in">
            <Sparkles size={12} /> The Future of E-commerce SEO
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Optimize for AI Agents. <br /> Not just Search Engines.
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Shopping is moving from Google to AI Assistants. Is your Shopify store data ready to be recommended by LLMs?
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <form onSubmit={handleStart} className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">Store Admin URL</label>
              <input 
                type="text" 
                placeholder="https://your-store.myshopify.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                required
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">Admin API Access Token</label>
              <input 
                type="password" 
                placeholder="shpat_xxxxxxxxxxxxxxxx"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                suppressHydrationWarning
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group"
            >
              {isLoading ? 'Connecting to Shopify...' : (
                <>
                  Generate AI Readiness Audit <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
              <Zap size={20} className="mx-auto text-amber-500 mb-2" />
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Fast Diagnostics</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
              <ShieldCheck size={20} className="mx-auto text-emerald-500 mb-2" />
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Trust Signals</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
              <Bot size={20} className="mx-auto text-blue-500 mb-2" />
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Agent Verified</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
