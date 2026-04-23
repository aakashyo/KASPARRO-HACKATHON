'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeStore, exportReportCSV, pushBulkFixes } from '@/lib/api';
import { demoData } from '@/lib/demoData';
import ProductCard from './components/ProductCard';
import QuerySimulator from './components/QuerySimulator';
import StoreHealthCharts from './components/StoreHealthCharts';
import ScoreCard from './components/ScoreCard';
import StrategicRoadmap from './components/StrategicRoadmap';
import DimensionDetailModal from './components/DimensionDetailModal';
import { RefreshCcw, AlertTriangle, Search, Brain, Loader2, Download, Filter, RefreshCw, CheckCircle2, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'optimized'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedDimension, setSelectedDimension] = useState<any>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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
          demoProducts[p.id] = {
            ...p,
            is_audited: true,
            audit_deep: {
              intent: p.intent,
              ai_perception: p.ai_perception,
              gaps: p.gaps,
              impact: p.impact,
              fixes: p.fixes,
            },
            scan_quick: { severity: p.gaps.severity, quick_score: 80, basic_gap: p.gaps.insight, priority: 'high' }
          };
        });
        setProducts(demoProducts);
        setStoreScore(demoData.store_score);
        setStatus('complete');
        setMessage('Demo Audit Complete');
      }, 1000);
      return;
    }

    const url = localStorage.getItem('shopify_url') || '';
    const token = localStorage.getItem('shopify_token') || '';

    try {
      setStatus('initializing');
      await analyzeStore(url, token, (update: any) => {
        const { type, status: updateStatus, data, message: updateMsg, total, processed, progress_percent, store_score } = update;

        if (type === 'progress') {
          setStatus(updateStatus);
          if (progress_percent !== undefined) {
            setProgress({ current: Math.floor(progress_percent), total: 100 });
            if (processed) setTimeSaved(processed * 2.1);
          } else if (processed && total) {
            setProgress({ current: processed, total });
            setTimeSaved(processed * 2.1);
          }
          setMessage(updateMsg);
        } else if (type === 'product') {
          const product = data;
          setProducts(prev => ({ ...prev, [product.id]: product }));
        } else if (type === 'complete') {
          setStatus('complete');
          setStoreScore(store_score);
          setMessage(updateMsg);
          setProgress({ current: 100, total: 100 });
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
    document.documentElement.setAttribute('data-theme', 'dark');
    run(demo);
  }, []);

  const productList = useMemo(() => Object.values(products), [products]);

  const handleMegaSync = async () => {
    if (isDemo) return alert("Mega-Sync is disabled in Demo Mode. Connect your store to push real fixes.");
    setIsSyncing(true);
    setSyncComplete(false);
    
    // Auto-gather all deep audited fixes that passed the policy guardrail
    const allFixable = productList.filter(p => p.audit_deep && p.audit_deep.fixes);
    const safeFixes = allFixable.filter(p => !p.guardrail || p.guardrail.is_safe);
    
    const skippedCount = allFixable.length - safeFixes.length;

    const fixes = safeFixes.map(p => ({
        product_id: p.id,
        description: p.audit_deep!.fixes!.improved_description || '',
        tags: (p.audit_deep!.fixes!.structured_tags || []).map((t: any) => typeof t === 'string' ? t : `${t.name}:${t.value}`)
    }));
      
    if (fixes.length === 0) {
      alert(skippedCount > 0 
        ? `${skippedCount} products were skipped due to policy guardrail violations. No safe fixes available to sync.`
        : "No AI fixes available to sync.");
      setIsSyncing(false);
      return;
    }

    try {
      const result = await pushBulkFixes(fixes);
      const failed = (result?.results || []).filter((item: any) => !item.success);
      if (failed.length > 0) {
        throw new Error(`${failed.length} product update${failed.length === 1 ? '' : 's'} failed during Mega-Sync.`);
      }
      setSyncComplete(true);
      setTimeout(() => setSyncComplete(false), 5000);
    } catch (err: any) {
      alert("Mega-Sync Failed: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const sorted = useMemo(() => {
    let list = [...productList];
    if (filter === 'critical') list = list.filter(p => (p.scan_quick?.severity || 0) >= 7);
    if (filter === 'warning') list = list.filter(p => { const s = p.scan_quick?.severity || 0; return s >= 4 && s < 7; });
    if (filter === 'optimized') list = list.filter(p => (p.scan_quick?.severity || 0) < 4);
    
    return list.sort((a, b) => (b.scan_quick?.severity || 0) - (a.scan_quick?.severity || 0));
  }, [productList, filter]);

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
  const isProcessing = status !== 'complete' && status !== 'error';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, background: 'var(--bg-surface)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)', opacity: 0.95 }}>
        <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text)', padding: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={18} color="#08080c" />
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>RepOptimizer <span style={{ color: 'var(--accent)', fontSize: 10, marginLeft: 4, padding: '2px 6px', borderRadius: 4, background: 'var(--accent-glow)', border: '1px solid var(--accent-border)' }}>PRO</span></span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'var(--accent-glow)', border: '1px solid var(--accent-border)', color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>
              <Loader2 size={13} style={{ animation: 'spin 1.5s linear infinite' }} />
              {message}
            </div>
          )}
          <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '8px', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDemo ? '#f59e0b' : '#22c55e', display: 'inline-block' }} />
            {isDemo ? 'Demo Mode' : 'Live Audit'}
          </div>
          {status === 'complete' && (
            <button
              onClick={() => exportReportCSV(productList)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(200,241,53,0.08)', border: '1px solid rgba(200,241,53,0.2)', color: '#c8f135', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,241,53,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,241,53,0.08)')}
            >
              <Download size={13} /> Export CSV
            </button>
          )}
          <button onClick={() => run()} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px', cursor: 'pointer', color: 'rgba(240,240,240,0.4)', transition: 'all 0.2s' }}>
            <RefreshCcw size={15} />
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: '2 1 320px', background: 'var(--bg-elevated)', backgroundImage: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg) 100%)', border: '1px solid var(--border)', borderRadius: 24, padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>AI Readiness Score</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 56, fontWeight: 900, fontFamily: 'var(--font-head)', color: showsScores ? (storeScore.overall_score > 70 ? 'var(--ok)' : storeScore.overall_score > 45 ? 'var(--warn)' : 'var(--danger)') : 'var(--text-faint)', lineHeight: 1 }}>
                {showsScores ? storeScore.overall_score : '--'}
              </h1>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-muted)' }}>/100</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {status === 'complete' ? 'Catalog-wide AI SEO score based on deep product audit.' : 'Analysis in progress...'}
            </p>
          </div>

          {[
            { label: 'Scanned', value: analyzedCount, sub: 'Total Products', color: 'var(--info)' },
            { label: 'Critical', value: stats.critical, sub: 'Urgent Gaps', color: 'var(--danger)' },
            { label: 'Audited', value: auditedCount, sub: 'AI Analyzed', color: 'var(--accent)' },
            { label: 'Time Saved', value: `${Math.floor(timeSaved)}s`, sub: 'Rule-Based Engine', color: '#a78bfa' },
          ].map((stat, i) => (
            <div key={stat.label} style={{ flex: '1 1 140px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 24, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 10 }}>{stat.label}</p>
              <p style={{ fontSize: 36, fontWeight: 900, fontFamily: 'var(--font-head)', color: stat.color, marginBottom: 4 }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {showsScores && storeScore.business_impact && (
          <div style={{ background: 'var(--bg-elevated)', backgroundImage: 'linear-gradient(to right, var(--accent-glow), transparent)', border: '1px solid var(--accent-border)', borderRadius: 24, padding: '32px 40px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, color: 'var(--text-secondary)' }}>Est. Recoverable Revenue</p>
              <h2 style={{ fontSize: 48, fontWeight: 900, fontFamily: 'var(--font-head)', letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--text)' }}>
                <span style={{ color: 'var(--accent)' }}>$</span>{storeScore.business_impact.recoverable_revenue.toLocaleString()}<span style={{ fontSize: 20, color: 'var(--text-muted)', fontWeight: 700 }}>/mo</span>
              </h2>
            </div>
            <div style={{ flex: 1, minWidth: 280, maxWidth: 500, borderLeft: '1px solid var(--border)', paddingLeft: 32 }}>
              <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                Based on analyzing {analyzedCount} products, we estimate a direct revenue leakage from <strong style={{ color: 'var(--danger)' }}>{storeScore.business_impact.critical_fixes_needed} critical AI perception gaps</strong>. Fixing these structural deficits unlocks immediate recommendation volume in Llama and ChatGPT searches.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <button
                 onClick={() => {
                   setFilter('critical');
                   window.scrollTo({ top: 800, behavior: 'smooth' });
                 }}
                 style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', padding: '14px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)', cursor: 'pointer', transition: 'all 0.2s' }}
                 onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface)'; }}
                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                View Gaps
              </button>
              <button
                 onClick={handleMegaSync}
                 disabled={isSyncing || syncComplete}
                 style={{ background: syncComplete ? 'var(--ok-soft)' : 'var(--accent)', color: syncComplete ? 'var(--ok)' : '#09090b', border: 'none', padding: '14px 28px', borderRadius: 12, fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-head)', cursor: isSyncing ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                 onMouseEnter={e => { if(!isSyncing && !syncComplete) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px var(--accent-glow)'; } }}
                 onMouseLeave={e => { if(!isSyncing && !syncComplete) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}
              >
                {isSyncing ? (
                  <><RefreshCw size={18} className="spin" /> Syncing Catalog...</>
                ) : syncComplete ? (
                  <><CheckCircle2 size={18} /> Sync Complete</>
                ) : (
                  <>Mega-Sync: Auto-Fix All</>
                )}
              </button>
            </div>
          </div>
        )}

        {showsScores && storeScore.dimension_scores && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 24, padding: '24px' }}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 20 }}>Dimension Scores</p>
              <div style={{ height: 180, marginBottom: 24 }}>
                <StoreHealthCharts type="bar" data={storeScore.dimension_scores} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                {Object.entries(storeScore.dimension_scores).map(([key, val]: any) => (
                  <ScoreCard 
                    key={key} 
                    label={key.replace('_', ' ')} 
                    score={val.score} 
                    reason={val.reason} 
                    onClick={() => setSelectedDimension({ label: key.replace('_', ' '), ...val })}
                  />
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 24, padding: '24px' }}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 20 }}>Catalog Health</p>
              <div style={{ height: 180 }}>
                <StoreHealthCharts type="pie" data={stats} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                {[
                  { label: 'Critical', color: 'var(--danger)', value: stats.critical },
                  { label: 'Warning', color: 'var(--warn)', value: stats.warning },
                  { label: 'Optimized', color: 'var(--ok)', value: stats.optimized },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showsScores && storeScore.roadmap && (
          <StrategicRoadmap 
            roadmap={storeScore.roadmap} 
            products={productList} 
            onMegaSync={handleMegaSync} 
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={14} color="var(--text-muted)" />
              <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'critical', label: 'Critical' },
                  { id: 'warning', label: 'Warning' },
                  { id: 'optimized', label: 'Optimized' }
                ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id as any)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, borderRadius: 7, border: 'none', background: filter === f.id ? 'var(--border-strong, var(--border))' : 'transparent', color: filter === f.id ? 'var(--text)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-head)' }}>{f.label}</button>
                ))}
              </div>
            </div>
          </div>
          {isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 120, height: 4, borderRadius: 99, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--accent)', width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`, transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{progress.current}/{progress.total}</span>
            </div>
          )}
        </div>

        {error && (
          <div style={{ marginBottom: 24, padding: '16px 20px', borderRadius: 16, background: 'var(--danger-soft)', border: '1px solid var(--danger-border)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <AlertTriangle size={18} />
            <p style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{error}</p>
            <button onClick={() => run()} style={{ background: 'var(--danger-soft)', color: 'var(--danger)', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Retry</button>
          </div>
        )}

        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {sorted.length === 0 && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 76, borderRadius: 18, background: 'var(--bg-surface)', border: '1px solid var(--border)', animation: 'pulse 1.5s infinite ease-in-out' }} />
          ))}
          {sorted.map(p => (
            <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
              <ProductCard product={p} highlighted={p.scan_quick.severity >= 7} isDemo={isDemo} />
            </motion.div>
          ))}
        </motion.div>

        {status === 'complete' && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800, color: '#f0f0f0', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Search size={18} color="#c8f135" />
              Live Search Simulation
            </h2>
            <QuerySimulator products={productList} />
          </div>
        )}

      </main>

      {selectedDimension && (
        <DimensionDetailModal 
          isOpen={!!selectedDimension}
          onClose={() => setSelectedDimension(null)}
          dimension={selectedDimension.label}
          score={selectedDimension.score}
          reason={selectedDimension.reason}
          products={productList}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
        @media (max-width: 768px) {
          main { padding: 16px 12px !important; }
        }
      `}</style>
    </div>
  );
}
