'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeStore } from '@/lib/api';
import { demoData } from '@/lib/demoData';
import ScoreCard from './components/ScoreCard';
import ProductCard from './components/ProductCard';
import QuerySimulator from './components/QuerySimulator';
import StoreHealthCharts from './components/StoreHealthCharts';
import { BarChart2, RefreshCcw, AlertTriangle, Database, Search, Loader2 } from 'lucide-react';

const STEPS = [
  'connecting to shopify api...',
  'fetching product catalog...',
  'extracting merchant intent...',
  'simulating ai perception...',
  'running gap analysis...',
  'estimating impact scores...',
  'generating neural fixes...',
  'compiling intelligence report...',
];

export default function Dashboard() {
  const router = useRouter();
  const [data, setData]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [isDemo, setIsDemo]     = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [step, setStep]         = useState(0);

  const run = async (forceDemo = false) => {
    setLoading(true);
    setError(null);
    setStep(0);

    const iv = setInterval(() => setStep(p => p < STEPS.length - 1 ? p + 1 : p), 1600);

    if (forceDemo || isDemo) {
      setTimeout(() => { clearInterval(iv); setData(demoData); setLoading(false); }, 2200);
      return;
    }

    const url   = localStorage.getItem('shopify_url') || '';
    const token = localStorage.getItem('shopify_token') || '';
    try {
      const res = await analyzeStore(url, token);
      clearInterval(iv);
      setData(res);
    } catch (e: any) {
      clearInterval(iv);
      setError(e.response?.data?.detail || 'Backend unreachable. Showing demo data.');
      setData(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const demo = localStorage.getItem('demo_mode') === 'true';
    setIsDemo(demo);
    run(demo);
  }, []);

  const sorted = useMemo(() => {
    if (!data?.products) return [];
    return [...data.products].sort((a, b) => b.gaps.severity - a.gaps.severity);
  }, [data]);

  const health = useMemo(() => {
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
    run(next);
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-xs space-y-6 text-center">
          <div className="w-12 h-12 rounded-[14px] mx-auto flex items-center justify-center" style={{ background: 'var(--accent-dim)', border: '1.5px solid var(--accent-border)' }}>
            <Loader2 size={22} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
          <div className="space-y-1.5">
            <p className="font-bold text-sm lowercase" style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--text)' }}>
              analyzing your store
            </p>
            <p className="text-xs lowercase" style={{ color: 'var(--text-subtle)' }}>{STEPS[step]}</p>
          </div>
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full transition-all duration-700 rounded-full"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'var(--accent)' }}
            />
          </div>
          <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>step {step + 1} of {STEPS.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4" style={{ background: 'var(--bg)', borderBottom: '1.5px solid var(--border)' }}>
        <button onClick={() => router.push('/')} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <BarChart2 size={13} className="text-[#0e0e0e]" strokeWidth={3} />
          </div>
          <span className="font-bold text-sm lowercase" style={{ fontFamily: 'var(--font-montserrat)' }}>repoptimizer</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)' }}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: isDemo ? 'var(--warn)' : 'var(--ok)', ...(isDemo ? {} : { animation: 'pulse 2s infinite' }) }}
            />
            <span className="text-[11px] lowercase" style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--text-subtle)' }}>
              {isDemo ? 'demo' : 'live'}
            </span>
          </div>
          <button
            onClick={toggleDemo}
            suppressHydrationWarning
            className="btn-ghost px-3 py-1.5 text-[11px] lowercase"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {isDemo ? 'switch to live' : 'use demo'}
          </button>
          <button
            onClick={() => run()}
            suppressHydrationWarning
            className="btn-ghost p-2"
          >
            <RefreshCcw size={13} />
          </button>
        </div>
      </nav>

      {error && (
        <div className="max-w-7xl mx-auto px-8 mt-4">
          <div className="flex items-center gap-2.5 p-3 text-xs" style={{ background: 'var(--warn-dim)', border: '1.5px solid var(--warn-border)', borderRadius: 12, color: 'var(--warn)' }}>
            <AlertTriangle size={13} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-12 anim-fade-in">

        <section className="space-y-6">
          <div>
            <p className="label mb-2">your store's AI health check</p>
            <h1 className="font-black lowercase tracking-tighter" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '2.5rem', lineHeight: 1 }}>
              overall score.{' '}
              <span style={{ color: data.store_score.overall_score > 70 ? 'var(--ok)' : data.store_score.overall_score > 50 ? 'var(--warn)' : 'var(--danger)' }}>
                {data.store_score.overall_score}
              </span>
              <span style={{ color: 'var(--text-subtle)' }}>/100</span>
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-subtle)' }}>
              {data.store_score.overall_score > 70
                ? 'Your store is well-optimized for AI shoppers. A few tweaks can push it further.'
                : data.store_score.overall_score > 50
                ? 'AI shoppers can find some of your products. Several improvements can help a lot.'
                : 'AI shoppers are likely skipping most of your products. The fixes below can make a big difference.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Object.entries(data.store_score.dimension_scores).map(([key, details]: [string, any]) => (
              <ScoreCard key={key} label={key.replace(/_/g, ' ')} score={details.score} reason={details.reason} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-flat p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={13} style={{ color: 'var(--accent)' }} />
              <p className="label">score breakdown</p>
            </div>
            <div style={{ height: 220 }}>
              <StoreHealthCharts type="bar" data={data.store_score.dimension_scores} />
            </div>
          </div>

          <div className="card-flat p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={13} style={{ color: 'var(--danger)' }} />
              <p className="label">product health</p>
            </div>
            <div style={{ height: 140 }}>
              <StoreHealthCharts type="pie" data={health} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4" style={{ borderTop: '1.5px solid var(--border-subtle)' }}>
              {[
                { l: 'critical',  v: health.critical,  c: 'var(--danger)' },
                { l: 'warning',   v: health.warning,   c: 'var(--warn)'   },
                { l: 'optimized', v: health.optimized, c: 'var(--ok)'     },
              ].map(({ l, v, c }) => (
                <div key={l} className="text-center">
                  <p className="font-black text-lg" style={{ color: c, fontFamily: 'var(--font-montserrat)' }}>{v}</p>
                  <p className="text-[10px] lowercase" style={{ color: 'var(--text-subtle)' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={13} style={{ color: 'var(--danger)' }} />
            <h2 className="font-bold text-sm lowercase" style={{ fontFamily: 'var(--font-montserrat)' }}>products AI shoppers are skipping</h2>
            <span className="pill pill-danger">{sorted.filter((p: any) => p.gaps.severity >= 7).length} need urgent fixes</span>
          </div>
          <div className="space-y-3">
            {sorted.filter((p: any) => p.gaps.severity >= 7).map((p: any) => (
              <ProductCard key={p.id} product={p} highlighted />
            ))}
            {sorted.filter((p: any) => p.gaps.severity >= 7).length === 0 && (
              <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>no critical issues detected.</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Database size={13} style={{ color: 'var(--accent)' }} />
            <h2 className="font-bold text-sm lowercase" style={{ fontFamily: 'var(--font-montserrat)' }}>all your products</h2>
            <span className="text-[11px]" style={{ color: 'var(--text-subtle)' }}>{data.products.length} analyzed</span>
          </div>
          <div className="space-y-3">
            {sorted.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Search size={13} style={{ color: 'var(--info)' }} />
            <h2 className="font-bold text-sm lowercase" style={{ fontFamily: 'var(--font-montserrat)' }}>test how AI would search your store</h2>
          </div>
          <QuerySimulator products={data.products} />
        </section>

      </main>

      <footer className="mt-16 px-8 py-6" style={{ borderTop: '1.5px solid var(--border-subtle)' }}>
        <p className="text-center text-[11px] lowercase" style={{ color: 'var(--text-faint)' }}>
          repoptimizer — kasparro hackathon 2026
        </p>
      </footer>
    </div>
  );
}
