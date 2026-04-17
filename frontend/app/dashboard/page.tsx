'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeStore } from '@/lib/api';
import { demoData } from '@/lib/demoData';
import ScoreCard from './components/ScoreCard';
import ProductCard from './components/ProductCard';
import QuerySimulator from './components/QuerySimulator';
import StoreHealthCharts from './components/StoreHealthCharts';
import {
  BarChart2, RefreshCcw, AlertTriangle, Database, Search, Loader2,
} from 'lucide-react';

const LOADING_STEPS = [
  'Connecting to Shopify Admin API...',
  'Fetching product catalog...',
  'Extracting merchant intent...',
  'Simulating AI agent perception...',
  'Running gap analysis engine...',
  'Estimating impact scores...',
  'Generating neural fixes...',
  'Compiling store intelligence report...',
];

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

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1600);

    if (forceDemo || isDemo) {
      setTimeout(() => {
        clearInterval(interval);
        setData(demoData);
        setLoading(false);
      }, 2000);
      return;
    }

    const url = localStorage.getItem('shopify_url') || '';
    const token = localStorage.getItem('shopify_token') || '';

    try {
      const result = await analyzeStore(url, token);
      clearInterval(interval);
      setData(result);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.response?.data?.detail || 'Could not reach the backend. Showing demo data instead.');
      setData(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const demo = localStorage.getItem('demo_mode') === 'true';
    setIsDemo(demo);
    fetchData(demo);
  }, []);

  const sortedProducts = useMemo(() => {
    if (!data?.products) return [];
    return [...data.products].sort((a, b) => b.gaps.severity - a.gaps.severity);
  }, [data]);

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
    const next = !isDemo;
    setIsDemo(next);
    localStorage.setItem('demo_mode', String(next));
    fetchData(next);
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c5cfc] flex items-center justify-center mx-auto">
            <Loader2 size={24} className="text-white animate-spin" />
          </div>
          <div className="space-y-1.5">
            <p className="font-semibold text-sm text-[#f0f0f5]">Analyzing Your Store</p>
            <p className="text-xs text-[#6b6b80]">{LOADING_STEPS[loadingStep]}</p>
          </div>
          <div className="w-full h-0.5 bg-[#1f1f2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00d4ff] to-[#7c5cfc] transition-all duration-700"
              style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-[#3a3a4d]">Step {loadingStep + 1} of {LOADING_STEPS.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5]">

      <nav className="sticky top-0 z-50 bg-[#0a0a0f] border-b border-[#1f1f2e]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#00d4ff] to-[#7c5cfc] flex items-center justify-center">
              <BarChart2 size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm tracking-tight">RepOptimizer</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#111118] border border-[#2a2a3a]">
              <span className={`w-1.5 h-1.5 rounded-full ${isDemo ? 'bg-[#fbbf24]' : 'bg-[#4ade80] animate-pulse'}`} />
              <span className="text-[11px] font-medium text-[#6b6b80]">
                {isDemo ? 'Demo' : 'Live'}
              </span>
            </div>
            <button
              onClick={toggleDemo}
              suppressHydrationWarning
              className="px-3 py-1.5 rounded-md border border-[#2a2a3a] text-[11px] font-semibold text-[#a0a0b8] hover:text-white hover:border-[#3a3a4d] transition-all"
            >
              {isDemo ? 'Switch to Live' : 'Use Demo'}
            </button>
            <button
              onClick={() => fetchData()}
              suppressHydrationWarning
              className="p-1.5 rounded-md border border-[#2a2a3a] text-[#6b6b80] hover:text-white hover:border-[#3a3a4d] transition-all"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
        </div>
      </nav>

      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="flex items-center gap-2.5 p-3 bg-[#1a1008] border border-[#fbbf24]/20 rounded-lg text-[#fbbf24] text-xs">
            <AlertTriangle size={14} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10 animate-fade-in">

        <section className="space-y-5">
          <div>
            <p className="section-label mb-1">Store Intelligence Overview</p>
            <h1 className="text-2xl font-bold tracking-tight">
              AI Readiness Score:{' '}
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#7c5cfc] bg-clip-text text-transparent">
                {data.store_score.overall_score}/100
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Object.entries(data.store_score.dimension_scores).map(([key, details]: [string, any]) => (
              <ScoreCard
                key={key}
                label={key.replace(/_/g, ' ')}
                score={details.score}
                reason={details.reason}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-static p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={14} className="text-[#00d4ff]" />
              <p className="section-label">Dimension Performance</p>
            </div>
            <div className="h-56">
              <StoreHealthCharts type="bar" data={data.store_score.dimension_scores} />
            </div>
          </div>

          <div className="card-static p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={14} className="text-[#f87171]" />
              <p className="section-label">Asset Health</p>
            </div>
            <div className="h-36">
              <StoreHealthCharts type="pie" data={healthCounts} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-[#1f1f2e]">
              {[
                { label: 'Critical', val: healthCounts.critical, color: '#f87171' },
                { label: 'Warning', val: healthCounts.warning, color: '#fbbf24' },
                { label: 'Optimized', val: healthCounts.optimized, color: '#4ade80' },
              ].map(({ label, val, color }) => (
                <div key={label} className="text-center">
                  <p className="stat-number text-lg font-bold" style={{ color }}>{val}</p>
                  <p className="text-[10px] text-[#6b6b80]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-[#f87171]" />
            <h2 className="font-semibold text-sm">High Priority Issues</h2>
            <span className="badge badge-critical">{sortedProducts.filter((p: any) => p.gaps.severity >= 7).length} critical</span>
          </div>
          <div className="space-y-3">
            {sortedProducts.filter((p: any) => p.gaps.severity >= 7).map((p: any) => (
              <ProductCard key={p.id} product={p} highlighted />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-[#7c5cfc]" />
            <h2 className="font-semibold text-sm">Full Product Audit</h2>
            <span className="text-[11px] text-[#6b6b80]">{data.products.length} products</span>
          </div>
          <div className="space-y-3">
            {sortedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-[#00d4ff]" />
            <h2 className="font-semibold text-sm">AI Query Simulator</h2>
          </div>
          <QuerySimulator products={data.products} />
        </section>

      </main>

      <footer className="border-t border-[#1f1f2e] mt-16 px-6 py-6">
        <p className="text-center text-[11px] text-[#3a3a4d]">AI RepOptimizer — Kasparro Hackathon 2026</p>
      </footer>

    </div>
  );
}
