'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Sparkles, ArrowRight, ShieldCheck, Zap, Laptop, Brain, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [storeUrl, setStoreUrl] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    localStorage.setItem('shopify_url', storeUrl);
    localStorage.setItem('shopify_token', token);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Bot size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">AI RepOptimizer</span>
        </div>
        <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-slate-900 transition-colors">Methodology</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Demo</a>
          <button 
            onClick={() => {
                localStorage.setItem('demo_mode', 'true');
                router.push('/dashboard');
            }}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Launch Demo
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={12} className="text-blue-500" /> Solving the Agentic SEO Gap
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 max-w-5xl mx-auto leading-[0.9]">
            Optimize for AI Agents. <span className="text-blue-600">Not just Search Engines.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Shopping is moving from Google to Agentic LLMs. We diagnose why AI assistants fail to recommend your products and provide the neural fixes to win the ranking race.
          </p>
          
          <div className="flex items-center justify-center gap-12 pt-4">
            <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest">Agent Verified</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest">Deep Diagnosis</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest">Neural Fixing</span>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="p-10 card-premium shadow-2xl shadow-blue-900/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Brain size={120} />
            </div>

            <form onSubmit={handleStart} className="space-y-6 relative z-10">
                <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Admin URL</label>
                <input 
                    type="text" 
                    placeholder="e.g. your-store.myshopify.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    required
                    suppressHydrationWarning
                />
                </div>
                <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin API Access Token</label>
                <input 
                    type="password" 
                    placeholder="shpat_xxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
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
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 group text-xs"
                >
                {isLoading ? 'Decrypting Neural Intelligence...' : (
                    <>
                    Start Store Intelligence Audit <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
                </button>
            </form>
            
            <div className="pt-4 flex items-center justify-between text-slate-400 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-widest">Demo Sandbox Available</p>
                <button 
                    onClick={() => {
                        localStorage.setItem('demo_mode', 'true');
                        router.push('/dashboard');
                    }}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                >
                    Try it now &rarr;
                </button>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
              <Zap size={20} className="mx-auto text-amber-500" />
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Real-time Analysis</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
              <TrendingUp size={20} className="mx-auto text-emerald-500" />
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Ranking Uplift</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
              <Laptop size={20} className="mx-auto text-blue-500" />
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">SaaS Ready</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CheckCircle2({ className, size }: { className?: string, size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
        </svg>
    );
}
