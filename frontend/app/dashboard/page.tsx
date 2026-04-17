'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeStore } from '@/lib/api';
import { demoData } from '@/lib/demoData';
import ScoreCard from './components/ScoreCard';
import ProductCard from './components/ProductCard';
import QuerySimulator from './components/QuerySimulator';
import StoreHealthCharts from './components/StoreHealthCharts';
import { RefreshCcw, AlertTriangle, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';

const STEPS = [
  'Connecting to Shopify…',
  'Reading your products…',
  'Understanding what you sell…',
  'Simulating AI shopping agents…',
  'Finding gaps and issues…',
  'Calculating impact scores…',
  'Writing improved descriptions…',
  'Building your report…',
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

  const avgAfter = useMemo(() => {
    if (!data?.products?.length) return 0;
    return Math.round(data.products.reduce((s: number, p: any) => s + p.impact.after_score, 0) / data.products.length * 100);
  }, [data]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, background: '#08080c' }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={22} style={{ color: '#c8f135', animation: 'spin 1s linear infinite' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16, color: '#f0f0f0', marginBottom: 8 }}>Analyzing your store</p>
          <p style={{ fontSize: 13, color: 'rgba(240,240,240,0.4)' }}>{STEPS[step]}</p>
        </div>
        <div style={{ width: 240 }}>
          <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: '#c8f135', width: `${((step + 1) / STEPS.length) * 100}%`, transition: 'width 0.7s ease' }} />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.25)', textAlign: 'center', marginTop: 8 }}>Step {step + 1} of {STEPS.length}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const score = data.store_score.overall_score;
  const scoreColor = score > 70 ? '#22c55e' : score > 50 ? '#f59e0b' : '#ef4444';
  const criticalCount = sorted.filter((p: any) => p.gaps.severity >= 7).length;

  return (
    <div style={{ minHeight: '100vh', background: '#08080c', color: '#f0f0f0', fontFamily: 'var(--font-sans)' }}>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 56, background: 'rgba(8,8,12,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'none', border: 'none', color: '#f0f0f0', padding: 0 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#08080c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em' }}>RepOptimizer</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(240,240,240,0.5)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDemo ? '#f59e0b' : '#22c55e', display: 'inline-block' }} />
            {isDemo ? 'Demo Store' : 'Live Store'}
          </div>
          <button onClick={() => { const n = !isDemo; setIsDemo(n); localStorage.setItem('demo_mode', String(n)); run(n); }} suppressHydrationWarning
            style={{ background: 'transparent', color: 'rgba(240,240,240,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-head)' }}>
            {isDemo ? 'Use Real Store' : 'Switch to Demo'}
          </button>
          <button onClick={() => run()} suppressHydrationWarning
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: 'rgba(240,240,240,0.4)', display: 'flex', alignItems: 'center' }}>
            <RefreshCcw size={13} />
          </button>
        </div>
      </nav>

      {error && (
        <div style={{ maxWidth: 1200, margin: '16px auto 0', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: 13 }}>
            <AlertTriangle size={14} />
            {error}
          </div>
        </div>
      )}

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 80px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>

          <div style={{ gridColumn: '1 / 3', background: '#0e0e14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${scoreColor}15, transparent 70%)`, pointerEvents: 'none' }} />
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(240,240,240,0.35)', marginBottom: 12, fontFamily: 'var(--font-head)' }}>Overall AI Score</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-head)', fontSize: 72, fontWeight: 900, lineHeight: 1, color: scoreColor }}>{score}</span>
              <span style={{ fontSize: 20, color: 'rgba(240,240,240,0.25)' }}>/100</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(240,240,240,0.45)', marginBottom: 18 }}>
              {score > 70 ? 'Your store is well-optimized for AI shoppers.' : score > 50 ? 'Several fixes can significantly boost your AI visibility.' : 'AI shoppers are likely skipping most of your products.'}
            </p>
            <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ height: '100%', borderRadius: 99, background: scoreColor, width: `${score}%`, transition: 'width 1s ease' }} />
            </div>
          </div>

          {[
            { label: 'Need Urgent Fix', value: health.critical, color: '#ef4444', sub: 'products' },
            { label: 'Can Be Better', value: health.warning, color: '#f59e0b', sub: 'products' },
            { label: 'After Fixing All →', value: `${avgAfter}%`, color: '#22c55e', sub: 'avg AI visibility', icon: <TrendingUp size={13} style={{ color: '#22c55e' }} /> },
          ].map(({ label, value, color, sub, icon }) => (
            <div key={label} style={{ background: '#0e0e14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '24px 28px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(240,240,240,0.35)', marginBottom: 14, fontFamily: 'var(--font-head)' }}>{label}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-head)', fontSize: 40, fontWeight: 900, lineHeight: 1, color }}>{value}</span>
                {icon}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(240,240,240,0.3)', marginTop: 6 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#0e0e14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '24px 28px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(240,240,240,0.35)', marginBottom: 18, fontFamily: 'var(--font-head)' }}>Score by Category</p>
            <div style={{ height: 200 }}>
              <StoreHealthCharts type="bar" data={data.store_score.dimension_scores} />
            </div>
          </div>
          <div style={{ background: '#0e0e14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '24px 28px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(240,240,240,0.35)', marginBottom: 18, fontFamily: 'var(--font-head)' }}>Product Health</p>
            <div style={{ height: 130 }}>
              <StoreHealthCharts type="pie" data={health} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[['#ef4444', health.critical, 'Critical'], ['#f59e0b', health.warning, 'Warning'], ['#22c55e', health.optimized, 'Good']].map(([c, v, l]) => (
                <div key={l as string} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-head)', color: c as string }}>{v as number}</div>
                  <div style={{ fontSize: 10, color: 'rgba(240,240,240,0.35)', marginTop: 2 }}>{l as string}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
            {Object.entries(data.store_score.dimension_scores).map(([key, details]: [string, any]) => (
              <ScoreCard key={key} label={key.replace(/_/g, ' ')} score={details.score} reason={details.reason} />
            ))}
          </div>
        </div>

        {criticalCount > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: '#f0f0f0' }}>Products AI Shoppers Are Skipping</h2>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', color: '#ef4444' }}>{criticalCount} need urgent fixes</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sorted.filter((p: any) => p.gaps.severity >= 7).map((p: any) => (
                <ProductCard key={p.id} product={p} highlighted />
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(240,240,240,0.3)' }} />
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: '#f0f0f0' }}>All Your Products</h2>
            <span style={{ fontSize: 12, color: 'rgba(240,240,240,0.3)' }}>{data.products.length} analyzed</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sorted.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: '#f0f0f0' }}>Test How AI Would Search Your Store</h2>
          </div>
          <QuerySimulator products={data.products} />
        </div>

      </main>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.2)' }}>RepOptimizer — Kasparro Hackathon 2026</p>
      </div>
    </div>
  );
}
