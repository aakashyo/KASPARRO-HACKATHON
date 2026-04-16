'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeStore } from '@/lib/api';
import { demoData } from '@/lib/demoData';
import ScoreCard from './components/ScoreCard';
import ProductCard from './components/ProductCard';
import QuerySimulator from './components/QuerySimulator';
import StoreHealthCharts from './components/StoreHealthCharts';
import { Bot, RefreshCcw, LayoutDashboard, Database, ShieldAlert, BarChart3, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const fetchData = async (forceDemo: boolean = false) => {
    setLoading(true);
    setError(null);
    setLoadingStep(0);
    
    // Simulate progressive loading text
    const loadingInterval = setInterval(() => {
        setLoadingStep(prev => prev < 9 ? prev + 1 : prev);
    }, 2000);

    if (forceDemo || isDemo) {
        setTimeout(() => {
            clearInterval(loadingInterval);
            setData(demoData);
            setLoading(false);
        }, 1500);
        return;
    }

    const url = localStorage.getItem('shopify_url') || '';
    const token = localStorage.getItem('shopify_token') || '';

    try {
      const result = await analyzeStore(url, token);
      clearInterval(loadingInterval);
      setData(result);
    } catch (err: any) {
      clearInterval(loadingInterval);
      setError(err.response?.data?.detail || 'Failed to connect to the backend. Please ensure the FastAPI server is running.');
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

  // Sorted and filtered products
  const sortedProducts = useMemo(() => {
    if (!data?.products) return [];
    return [...data.products].sort((a, b) => b.gaps.severity - a.gaps.severity);
  }, [data]);

  const topIssues = useMemo(() => sortedProducts.slice(0, 3), [sortedProducts]);

  const healthCounts = useMemo(() => {
    if (!data?.products) return { critical: 0, warning: 0, optimized: 0 };
    return data.products.reduce((acc: any, p: any) => {
        if (p.gaps.severity >= 7) acc.critical++;
        else if (p.gaps.severity >= 4) acc.warning++;
        else acc.optimized++;
        return acc;
    }, { critical: 0, warning: 0, optimized: 0 });
  }, [data]);

  const toggleDemo = () => {
    const nextMode = !isDemo;
    setIsDemo(nextMode);
    localStorage.setItem('demo_mode', String(nextMode));
    fetchData(nextMode);
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center animate-fade-in">
            <div className="relative mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                <Bot className="text-white animate-pulse" size={32} />
            </div>
            <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analyzing Intelligence Gaps</h2>
                <div className="flex items-center justify-center gap-3 text-slate-500 font-medium">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
                    <span>Processing product {loadingStep + 1} of 10...</span>
                </div>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${(loadingStep + 1) * 10}%` }}
                />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* SaaS Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="p-2 bg-blue-600 rounded-lg shadow-md group-hover:bg-blue-700 transition-colors">
              <Bot size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">AI Representation Optimizer</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-slate-100 rounded-full flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isDemo ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {isDemo ? 'Demo Dataset' : 'Production Pipeline'}
                </span>
            </div>
            <button 
                onClick={toggleDemo}
                suppressHydrationWarning
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isDemo ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
                {isDemo ? 'Switch to Live Store' : 'Enable Demo Mode'}
            </button>
            <button 
              onClick={() => fetchData()}
              suppressHydrationWarning
              className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
      </nav>

      {error && !isDemo && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle size={18} />
                <p className="text-sm font-semibold">{error}</p>
            </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12 mb-20 animate-fade-in">
        
        {/* SECTION 1: Store Overview */}
        <section className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                   <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <LayoutDashboard size={14} /> Global Analysis
                   </h2>
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight">Store Intelligence Overview</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <div className="lg:col-span-1">
                    <div className="h-full p-8 card-premium flex flex-col items-center justify-center text-center bg-slate-900 text-white border-slate-900">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Overall Score</span>
                        <span className="text-6xl font-black tabular-nums tracking-tighter">{data.store_score.overall_score}</span>
                        <div className="mt-4 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
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
        </section>

        {/* SECTION 2: Health Summary & Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="p-8 card-premium flex flex-col h-full">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <BarChart3 size={16} className="text-blue-600" /> Dimension Performance
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                        <StoreHealthCharts type="bar" data={data.store_score.dimension_scores} />
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="p-8 card-premium flex flex-col h-full bg-white">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                         <ShieldAlert size={16} className="text-red-600" /> Asset Health Status
                    </h3>
                    <div className="flex-1 min-h-[200px]">
                        <StoreHealthCharts type="pie" data={healthCounts} />
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-2">
                        <div className="text-center">
                            <p className="text-xl font-bold text-red-600">{healthCounts.critical}</p>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Critical</p>
                        </div>
                        <div className="text-center border-x border-slate-100">
                            <p className="text-xl font-bold text-amber-500">{healthCounts.warning}</p>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Warning</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-emerald-500">{healthCounts.optimized}</p>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Optimized</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION 3: TOP ISSUES */}
        <section className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <ShieldAlert size={20} className="text-red-500" /> High-Severity Intelligence Gaps
                </h2>
                <span className="text-xs font-bold text-slate-400">Urgent Fixes Required</span>
             </div>
             <div className="space-y-4">
                {topIssues.map((p: any) => (
                    <ProductCard key={p.id} product={p} highlighted={true} />
                ))}
             </div>
        </section>

        {/* SECTION 4: FULL ANALYSIS */}
        <section className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Database size={20} className="text-blue-500" /> Full Knowledge Index Audit
                </h2>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                        All Products ({data.products.length})
                    </div>
                </div>
             </div>
             <div className="space-y-4">
                {sortedProducts.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </section>

        {/* QUERY SIMULATOR */}
        <section className="pt-12">
            <QuerySimulator products={data.products} />
        </section>

      </main>
    </div>
  );
}
