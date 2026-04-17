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
  BarChart2, RefreshCcw, AlertTriangle, Database, Search,
  Loader2, TrendingUp, Package, Zap, ArrowRight, CheckCircle
} from 'lucide-react';

const STEPS = [
  'Connecting to Shopify...',
  'Reading your products...',
  'Understanding what you sell...',
  'Simulating AI shopping agents...',
  'Finding gaps and issues...',
  'Calculating impact scores...',
  'Writing improved descriptions...',
  'Building your report...',
];

export default function Dashboard() {
  const router = useRouter();
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [isDemo, setIsDemo]   = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep]       = useState(0);

  const run = async (forceDemo = false) => {
    setLoading(true);
    setError(null);
    setStep(0);
    const iv = setInterval(() => setStep(p => p < STEPS.length - 1 ? p + 1 : p), 1400);

    if (forceDemo || isDemo) {
      setTimeout(() => { clearInterval(iv); setData(demoData); setLoading(false); }, 2000);
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
      setError(e.response?.data?.detail || 'Could not reach backend. Showing demo data instead.');
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
      if (p.gaps.severity >= 7)      acc.critical++;
      else if (p.gaps.severity >= 4) acc.warning++;
      else                           acc.optimized++;
      return acc;
    }, { critical: 0, warning: 0, optimized: 0 });
  }, [data]);

  const avgBefore = useMemo(() => {
    if (!data?.products?.length) return 0;
    return Math.round(data.products.reduce((s: number, p: any) => s + p.impact.before_score, 0) / data.products.length * 100);
  }, [data]);

  const avgAfter = useMemo(() => {
    if (!data?.products?.length) return 0;
    return Math.round(data.products.reduce((s: number, p: any) => s + p.impact.after_score, 0) / data.products.length * 100);
  }, [data]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8" style={{ background: 'var(--bg)' }}>
        <div className="space-y-6 w-full max-w-xs text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="font-bold text-[15px] mb-1.5" style={{ fontFamily: 'var(--font-head)' }}>
              Analyzing your store
            </p>
            <p className="text-[13px] text-[var(--text-secondary)]">{STEPS[step]}</p>
          </div>
          <div className="space-y-2">
            <div className="progress-bar">
              <div className="progress-bar-fill transition-all duration-700" style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'var(--accent)' }} />
            </div>
            <p className="text-[11px] text-[var(--text-faint)]">Step {step + 1} of {STEPS.length}</p>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = data.store_score.overall_score;
  const scoreColor   = overallScore > 70 ? 'var(--ok)' : overallScore > 50 ? 'var(--warn)' : 'var(--danger)';
  const scoreMsg     = overallScore > 70
    ? 'Your store is well-optimized for AI shoppers.'
    : overallScore > 50
    ? 'Several improvements can boost your AI visibility.'
    : 'AI shoppers are likely skipping most of your products.';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5"
        style={{ background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => router.push('/')} className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <BarChart2 size={14} className="text-[var(--bg)]" strokeWidth={3} />
          </div>
          <span className="font-bold text-[14px]" style={{ fontFamily: 'var(--font-head)' }}>RepOptimizer</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px]"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: isDemo ? 'var(--warn)' : 'var(--ok)', animation: isDemo ? 'none' : 'pulse 2s infinite' }} />
            {isDemo ? 'Demo Mode' : 'Live Store'}
          </div>
          <button onClick={() => { const n = !isDemo; setIsDemo(n); localStorage.setItem('demo_mode', String(n)); run(n); }}
            suppressHydrationWarning className="btn-ghost px-3 py-1.5 text-[12px]" style={{ fontFamily: 'var(--font-head)' }}>
            {isDemo ? 'Connect Real Store' : 'Use Demo'}
          </button>
          <button onClick={() => run()} suppressHydrationWarning className="btn-ghost p-2 rounded-lg">
            <RefreshCcw size={14} />
          </button>
        </div>
      </nav>

      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="flex items-center gap-2.5 p-3 rounded-xl text-[13px]"
            style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn-border)', color: 'var(--warn)' }}>
            <AlertTriangle size={14} className="flex-shrink-0" />
            {error}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 anim-fade-in">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="card p-6 relative overflow-hidden lg:col-span-1 flex flex-col justify-between">
            <div className="glow-blob" style={{ width: 200, height: 200, top: -60, right: -40, background: `${scoreColor === 'var(--ok)' ? 'rgba(34,197,94,0.08)' : scoreColor === 'var(--warn)' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'}` }} />
            <div className="relative z-10">
              <p className="label mb-4">Overall AI Score</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-7xl font-black leading-none" style={{ fontFamily: 'var(--font-head)', color: scoreColor }}>{overallScore}</span>
                <span className="text-xl text-[var(--text-faint)]">/100</span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-5">{scoreMsg}</p>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-bar-fill" style={{ width: `${overallScore}%`, background: scoreColor }} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Package,    label: 'Total Products',    value: data.products.length,        unit: '',  color: 'var(--info)'   },
              { icon: AlertTriangle, label: 'Need Urgent Fix', value: health.critical,            unit: '',  color: 'var(--danger)' },
              { icon: Zap,        label: 'Can Be Improved',   value: health.warning,              unit: '',  color: 'var(--warn)'   },
              { icon: CheckCircle, label: 'Fully Optimized',  value: health.optimized,            unit: '',  color: 'var(--ok)'     },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card p-4 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                  <Icon size={15} style={{ color }} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-black" style={{ fontFamily: 'var(--font-head)', color }}>{value}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5" style={{ fontFamily: 'var(--font-head)' }}>{label}</p>
                </div>
              </div>
            ))}

            <div className="card p-4 col-span-2 sm:col-span-4 flex items-center justify-between gap-4">
              <div>
                <p className="label mb-1">AI Visibility After Applying Fixes</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[var(--text-faint)]" style={{ fontFamily: 'var(--font-head)' }}>{avgBefore}%</span>
                  <ArrowRight size={16} className="text-[var(--text-faint)]" />
                  <span className="text-2xl font-black" style={{ fontFamily: 'var(--font-head)', color: 'var(--ok)' }}>{avgAfter}%</span>
                  <TrendingUp size={16} style={{ color: 'var(--ok)' }} />
                </div>
              </div>
              <div className="flex-1 max-w-48">
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-bar-fill" style={{ width: `${avgAfter}%`, background: 'var(--ok)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="card-flat rounded-2xl p-5 lg:col-span-3">
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 size={14} style={{ color: 'var(--accent)' }} />
              <p className="label">Score Breakdown</p>
            </div>
            <div style={{ height: 220 }}>
              <StoreHealthCharts type="bar" data={data.store_score.dimension_scores} />
            </div>
          </div>

          <div className="card-flat rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Database size={14} style={{ color: 'var(--accent)' }} />
              <p className="label">Product Health</p>
            </div>
            <div style={{ height: 150 }}>
              <StoreHealthCharts type="pie" data={health} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              {[
                { l: 'Critical',  v: health.critical,  c: 'var(--danger)' },
                { l: 'Warning',   v: health.warning,   c: 'var(--warn)'   },
                { l: 'Good',      v: health.optimized, c: 'var(--ok)'     },
              ].map(({ l, v, c }) => (
                <div key={l} className="text-center">
                  <p className="text-2xl font-black" style={{ color: c, fontFamily: 'var(--font-head)' }}>{v}</p>
                  <p className="text-[10px] text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-head)' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="font-bold text-[15px]" style={{ fontFamily: 'var(--font-head)' }}>Score by Category</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(data.store_score.dimension_scores).map(([key, details]: [string, any]) => (
              <ScoreCard key={key} label={key.replace(/_/g, ' ')} score={details.score} reason={details.reason} />
            ))}
          </div>
        </div>

        {sorted.filter((p: any) => p.gaps.severity >= 7).length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger-border)' }}>
                <AlertTriangle size={12} style={{ color: 'var(--danger)' }} />
              </div>
              <p className="font-bold text-[15px]" style={{ fontFamily: 'var(--font-head)' }}>Products AI Shoppers Are Skipping</p>
              <span className="pill pill-danger">{sorted.filter((p: any) => p.gaps.severity >= 7).length} Need Urgent Fixes</span>
            </div>
            <div className="space-y-3">
              {sorted.filter((p: any) => p.gaps.severity >= 7).map((p: any) => (
                <ProductCard key={p.id} product={p} highlighted />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
              <Package size={12} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="font-bold text-[15px]" style={{ fontFamily: 'var(--font-head)' }}>All Your Products</p>
            <span className="text-[12px] text-[var(--text-muted)]">{data.products.length} analyzed</span>
          </div>
          <div className="space-y-3">
            {sorted.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--info-soft)', border: '1px solid var(--info-border)' }}>
              <Search size={12} style={{ color: 'var(--info)' }} />
            </div>
            <p className="font-bold text-[15px]" style={{ fontFamily: 'var(--font-head)' }}>Test How AI Would Search Your Store</p>
          </div>
          <QuerySimulator products={data.products} />
        </div>

      </main>

      <footer className="mt-16 px-6 py-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <p className="text-center text-[11px] text-[var(--text-faint)]">RepOptimizer — Kasparro Hackathon 2026</p>
      </footer>
    </div>
  );
}
