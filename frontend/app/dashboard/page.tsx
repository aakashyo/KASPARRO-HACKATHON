'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeStore } from '@/lib/api';
import { demoData } from '@/lib/demoData';
import ScoreCard from './components/ScoreCard';
import ProductCard from './components/ProductCard';
import QuerySimulator from './components/QuerySimulator';
import StoreHealthCharts from './components/StoreHealthCharts';
import { RefreshCcw, AlertTriangle, TrendingUp, Search, Brain, Loader2, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Record<string, any>>({});
  const [storeScore, setStoreScore] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'initializing' | 'scanning' | 'auditing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState('Initializing AI Audit...');
  const [isDemo, setIsDemo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSaved, setTimeSaved] = useState(0);

  const run = async (forceDemo = false) => {
    setProducts({});
    setStoreScore(null);
    setError(null);
    
    if (forceDemo || isDemo) {
      setStatus('scanning');
      setMessage('Loading demo catalog...');
      setTimeout(() => {
        const demoProducts: Record<string, any> = {};
        demoData.products.forEach((p: any) => {
          demoProducts[p.id] = { ...p, is_audited: true, scan_quick: { severity: p.gaps.severity, quick_score: 80, basic_gap: p.gaps.insight, priority: 'high' } };
        });
        setProducts(demoProducts);
        setStoreScore(demoData.store_score);
        setStatus('complete');
        setMessage('Demo Audit Complete!');
      }, 1000);
      return;
    }

    const url = localStorage.getItem('shopify_url') || '';
    const token = localStorage.getItem('shopify_token') || '';
    
    try {
      setStatus('initializing');
      await analyzeStore(url, token, (update: any) => {
        const { type, status: updateStatus, data, message: updateMsg, total, processed, audited, store_score } = update;

        if (type === 'progress') {
          setStatus(updateStatus);
          if (updateStatus === 'scanning' && total) {
            setProgress({ current: 0, total });
          }
          if (processed && total) {
            setProgress({ current: processed, total });
            setTimeSaved(processed * 2.1); // Est. 2.1s saved per rule-based scan
          }
          setMessage(updateMsg);
        } else if (type === 'product') {
          const product = data;
          setProducts(prev => ({
            ...prev,
            [product.id]: product
          }));
        } else if (type === 'complete') {
          setStatus('complete');
          setStoreScore(store_score);
          setMessage(updateMsg);
        } else if (type === 'error') {
          setStatus('error');
          setError(updateMsg);
        }
      });
    } catch (e: any) {
      setStatus('error');
      setError('Connection lost. Please ensure the backend is running.');
    }
  };

  useEffect(() => {
    setMounted(true);
    const demo = localStorage.getItem('demo_mode') === 'true';
    setIsDemo(demo);
    run(demo);
  }, []);

  const productList = useMemo(() => Object.values(products), [products]);
  
  const sorted = useMemo(() => {
    return [...productList].sort((a, b) => (b.scan_quick?.severity || 0) - (a.scan_quick?.severity || 0));
  }, [productList]);

  const stats = useMemo(() => {
    return productList.reduce((acc: any, p: any) => {
      const sev = p.scan_quick?.severity || 0;
      if (sev >= 7) acc.critical++;
      else if (sev >= 4) acc.warning++;
      else acc.optimized++;
      return acc;
    }, { critical: 0, warning: 0, optimized: 0 });
  }, [productList]);

  if (!mounted) return null;

  const showsScores = status === 'complete' && storeScore;
  const analyzedCount = productList.length;
  const auditedCount = productList.filter(p => p.is_audited).length;

  return (
    <div style={{ minHeight: '100vh', background: '#08080c', color: '#f0f0f0', fontFamily: 'var(--font-sans)' }}>
      {/* Navigation */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 64, background: 'rgba(8,8,12,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: 'none', border: 'none', color: '#f0f0f0', padding: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={18} color="#08080c" />
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>RepOptimizer <span style={{ color: '#c8f135', fontSize: 10, marginLeft: 4, padding: '2px 6px', borderRadius: 4, background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.2)' }}>PRO</span></span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {status !== 'complete' && status !== 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'rgba(200,241,53,0.05)', border: '1px solid rgba(200,241,53,0.15)', color: '#c8f135', fontSize: 12, fontWeight: 700 }}>
              <Loader2 size={13} style={{ animation: 'spin 1.5s linear infinite' }} />
              {message}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(240,240,240,0.5)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDemo ? '#f59e0b' : '#22c55e', display: 'inline-block' }} />
            {isDemo ? 'Demo Mode' : 'Live Audit'}
          </div>
          <button onClick={() => run()} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px', cursor: 'pointer', color: 'rgba(240,240,240,0.4)', transition: 'all 0.2s' }}>
            <RefreshCcw size={15} />
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px' }}>
        
        {/* Header / Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 20, marginBottom: 32 }}>
          <div style={{ background: 'linear-gradient(135deg, #0e0e14 0%, #08080c 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '32px', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,241,53,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
             <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Health Overview</p>
             <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                <h1 style={{ fontSize: 64, fontWeight: 900, fontFamily: 'var(--font-head)', color: showsScores ? (storeScore.overall_score > 70 ? '#22c55e' : '#f59e0b') : '#f0f0f0' }}>
                  {showsScores ? storeScore.overall_score : '--'}
                </h1>
                <span style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.15)' }}>/100</span>
             </div>
             <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
               {status === 'complete' ? 'Catalog-wide AI SEO score based on deep product audit.' : 'Analysis in progress...'}
             </p>
          </div>

          {[
            { label: 'Scanned', value: analyzedCount, sub: 'Inventory Total', color: '#38bdf8' },
            { label: 'Critical', value: stats.critical, sub: 'Urgent Gaps', color: '#ef4444' },
            { label: 'Audited', value: auditedCount, sub: 'Deep Intelligence', color: '#c8f135' }
          ].map(stat => (
            <div key={stat.label} style={{ background: '#0e0e14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', marginBottom: 12 }}>{stat.label}</p>
              <p style={{ fontSize: 40, fontWeight: 900, fontFamily: 'var(--font-head)', color: stat.color, marginBottom: 4 }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{stat.sub}</p>
            </div>
          ))}
          <div style={{ background: 'rgba(200,241,53,0.03)', border: '1px solid rgba(200,241,53,0.1)', borderRadius: 24, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c8f135', marginBottom: 12 }}>Time Saved</p>
            <p style={{ fontSize: 40, fontWeight: 900, fontFamily: 'var(--font-head)', color: '#c8f135', marginBottom: 4 }}>{Math.floor(timeSaved)}<span style={{ fontSize: 16 }}>s</span></p>
            <p style={{ fontSize: 12, color: 'rgba(200,241,53,0.4)', fontWeight: 600 }}>via Rule-Based Scanner</p>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ display: 'flex', gap: 4, padding: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <button style={{ padding: '6px 16px', fontSize: 12, fontWeight: 700, borderRadius: 7, background: status === 'scanning' ? 'rgba(255,255,255,0.1)' : 'transparent', color: status === 'scanning' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}>⚡ Fast Scan</button>
                  <button style={{ padding: '6px 16px', fontSize: 12, fontWeight: 700, borderRadius: 7, background: status === 'auditing' || status === 'complete' ? 'rgba(255,255,255,0.1)' : 'transparent', color: status === 'auditing' || status === 'complete' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}>🧠 Deep Audit</button>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> {stats.critical} Critical
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /> {stats.warning} Warning
                  </span>
                </div>
             </div>
             {status !== 'complete' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 120, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#c8f135', width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`, transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{progress.current}/{progress.total} ANALYZED</span>
                </div>
             )}
        </div>

        {/* Error Handling */}
        {error && (
          <div style={{ marginBottom: 24, padding: '16px 20px', borderRadius: 16, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={18} />
            <p style={{ fontSize: 14, fontWeight: 600 }}>{error}</p>
            <button onClick={() => run()} style={{ marginLeft: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Retry Analysis</button>
          </div>
        )}

        {/* Product List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.length === 0 && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 80, borderRadius: 20, background: '#0e0e14', border: '1px solid rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite ease-in-out' }} />
          ))}
          {sorted.map(p => (
            <ProductCard key={p.id} product={p} highlighted={p.scan_quick.severity >= 7} />
          ))}
        </div>

        {/* global widgets - query simulator */}
        {status === 'complete' && (
          <div style={{ marginTop: 48 }}>
             <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, color: '#f0f0f0', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
               <Search size={20} color="#c8f135" />
               Live Search Simulation
             </h2>
             <QuerySimulator products={productList} />
          </div>
        )}

      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
