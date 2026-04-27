'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Download,
  Filter,
  Loader2,
  Moon,
  RefreshCcw,
  RefreshCw,
  Search,
  Sun,
  LogOut,
} from 'lucide-react';
import { analyzeStore, exportReportCSV, pushBulkFixes } from '@/lib/api';
import { demoData } from '@/lib/demoData';
import ProductCard from './components/ProductCard';
import QuerySimulator from './components/QuerySimulator';
import StoreHealthCharts from './components/StoreHealthCharts';
import ScoreCard from './components/ScoreCard';
import StrategicRoadmap from './components/StrategicRoadmap';
import DimensionDetailModal from './components/DimensionDetailModal';
import PreviewModal from './components/PreviewModal';

type DashboardStatus = 'idle' | 'initializing' | 'scanning' | 'auditing' | 'complete' | 'error';
type FilterKey = 'all' | 'critical' | 'warning' | 'optimized';
type ThemeKey = 'light' | 'dark';

const statusCopy: Record<Exclude<DashboardStatus, 'idle' | 'complete' | 'error'>, string> = {
  initializing: 'Warming the audit engine and checking the catalog surface.',
  scanning: 'Running the deterministic sweep to catch obvious visibility gaps.',
  auditing: 'Deep-auditing product perception against shopping AI expectations.',
};

export default function Dashboard() {
  const router = useRouter();

  const [products, setProducts] = useState<Record<string, any>>({});
  const [storeScore, setStoreScore] = useState<any>(null);
  const [status, setStatus] = useState<DashboardStatus>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState('Initializing AI Audit...');
  const [isDemo, setIsDemo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSaved, setTimeSaved] = useState(0);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>('dark');
  const [selectedDimension, setSelectedDimension] = useState<any>(null);
  
  // Modal State for Roadmap actions
  const [preview, setPreview] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    contentType: 'faq' | 'bulk_fixes' | 'single_fix';
    content: any;
    onConfirm: () => void;
  } | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const applyTheme = (nextTheme: ThemeKey) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('repoptimizer-theme', nextTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleDisconnect = () => {
    localStorage.removeItem('shopify_url');
    localStorage.removeItem('shopify_token');
    localStorage.removeItem('demo_mode');
    router.push('/');
  };

  const run = async (forceDemo = false) => {
    setProducts({});
    setStoreScore(null);
    setError(null);
    setSyncComplete(false);

    if (forceDemo) {
      setStatus('scanning');
      setMessage('Loading demo catalog...');

      setTimeout(() => {
        const demoProducts: Record<string, any> = {};

        demoData.products.forEach((product: any) => {
          demoProducts[product.id] = {
            ...product,
            is_audited: true,
            audit_deep: {
              intent: product.intent,
              ai_perception: product.ai_perception,
              gaps: product.gaps,
              impact: product.impact,
              fixes: product.fixes,
            },
            scan_quick: {
              severity: product.gaps.severity,
              quick_score: 80,
              basic_gap: product.gaps.insight,
              priority: 'high',
            },
          };
        });

        setProducts(demoProducts);
        setStoreScore(demoData.store_score);
        setStatus('complete');
        setMessage('Demo audit complete');
        setProgress({ current: 100, total: 100 });
      }, 1000);

      return;
    }

    const url = localStorage.getItem('shopify_url') || '';
    const token = localStorage.getItem('shopify_token') || '';

    if (!url || !token) {
        router.push('/');
        return;
    }

    startLiveAudit(url, token);
  };

  const startLiveAudit = async (url: string, token: string) => {
    setStatus('initializing');

    try {
      await analyzeStore(url, token, (update: any) => {
        const {
          type,
          status: updateStatus,
          data,
          message: updateMessage,
          total,
          processed,
          progress_percent: progressPercent,
          store_score: nextStoreScore,
        } = update;

        if (type === 'progress') {
          setStatus(updateStatus);

          if (progressPercent !== undefined) {
            setProgress({ current: Math.floor(progressPercent), total: 100 });
          } else if (processed && total) {
            setProgress({ current: processed, total });
          }

          // Calculate more realistic time saved
          // Quick scan: ~30s per product, Deep audit: ~5m (300s) per product
          setProducts((currentProducts) => {
            const list = Object.values(currentProducts);
            const auditedCount = list.filter((p: any) => p.is_audited).length;
            const scannedCount = list.length;
            setTimeSaved((scannedCount * 30) + (auditedCount * 270)); // 30 + 270 = 300 (5 mins)
            return currentProducts;
          });

          setMessage(updateMessage);
        } else if (type === 'product') {
          setProducts((previous) => ({ ...previous, [data.id]: data }));
        } else if (type === 'complete') {
          setStatus('complete');
          setStoreScore(nextStoreScore);
          setMessage(updateMessage);
          setProgress({ current: 100, total: 100 });
        } else if (type === 'error') {
          setStatus('error');
          setError(updateMessage);
        }
      });
    } catch {
      setStatus('error');
      setError('Connection lost. Please ensure the backend is running.');
    }
  };

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('repoptimizer-theme');
    const nextTheme: ThemeKey = savedTheme === 'light' ? 'light' : 'dark';
    applyTheme(nextTheme);

    const savedUrl = localStorage.getItem('shopify_url') || '';
    const savedToken = localStorage.getItem('shopify_token') || '';
    const hasLiveCredentials = Boolean(savedUrl && savedToken);
    const demoRequested = localStorage.getItem('demo_mode') === 'true';
    const shouldUseDemo = demoRequested && !hasLiveCredentials;

    if (hasLiveCredentials) {
      localStorage.removeItem('demo_mode');
    }

    setIsDemo(shouldUseDemo);
    run(shouldUseDemo);
    // `run` is intentionally initialized once here for the first dashboard load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productList = useMemo(() => Object.values(products), [products]);

  // Unified severity helper (prefer deep audit)
  const getProductSeverity = (product: any) => {
    if (product.is_audited && product.audit_deep?.gaps) {
      return product.audit_deep.gaps.severity ?? product.scan_quick?.severity ?? 0;
    }
    return product.scan_quick?.severity ?? 0;
  };

  const sortedProducts = useMemo(() => {
    let list = [...productList];

    if (filter === 'critical') list = list.filter((product) => getProductSeverity(product) >= 7);
    if (filter === 'warning') {
      list = list.filter((product) => {
        const severity = getProductSeverity(product);
        return severity >= 4 && severity < 7;
      });
    }
    if (filter === 'optimized') list = list.filter((product) => getProductSeverity(product) < 4);

    return list.sort((left, right) => getProductSeverity(right) - getProductSeverity(left));
  }, [filter, productList]);

  const stats = useMemo(
    () =>
      productList.reduce(
        (accumulator: any, product: any) => {
          const severity = getProductSeverity(product);

          if (severity >= 7) accumulator.critical += 1;
          else if (severity >= 4) accumulator.warning += 1;
          else accumulator.optimized += 1;

          return accumulator;
        },
        { critical: 0, warning: 0, optimized: 0 }
      ),
    [productList]
  );

  const formatTimeSaved = (seconds: number) => {
    if (seconds === 0) return '0s';
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  const handleMegaSync = async () => {
    if (isDemo) {
      alert('Mega-Sync is disabled in Demo Mode. Connect your store to push real fixes.');
      return;
    }

    setIsSyncing(true);
    setSyncComplete(false);

    const allFixable = productList.filter((product) => product.audit_deep && product.audit_deep.fixes);
    const safeFixes = allFixable.filter((product) => !product.guardrail || product.guardrail.is_safe);
    const skippedCount = allFixable.length - safeFixes.length;

    const fixes = safeFixes.map((product) => ({
      product_id: product.id,
      description: product.audit_deep!.fixes!.improved_description || '',
      tags: (product.audit_deep!.fixes!.structured_tags || []).map((tag: any) =>
        typeof tag === 'string' ? tag : `${tag.name}:${tag.value}`
      ),
    }));

    if (fixes.length === 0) {
      alert(
        skippedCount > 0
          ? `${skippedCount} products were skipped due to policy guardrail violations. No safe fixes available to sync.`
          : 'No AI fixes available to sync.'
      );
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
      alert(`Mega-Sync Failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!mounted) return null;

  const showsScores = status === 'complete' && storeScore;
  const analyzedCount = productList.length;
  const auditedCount = productList.filter((product) => product.is_audited).length;
  const isProcessing = status !== 'complete' && status !== 'error';
  const progressWidth = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  const scoreColor = showsScores
    ? storeScore.overall_score > 70
      ? 'var(--ok)'
      : storeScore.overall_score > 45
        ? 'var(--warn)'
        : 'var(--danger)'
    : 'var(--text-faint)';

  const statCards = [
    { label: 'Scanned', value: analyzedCount, sub: 'Products surfaced', color: 'var(--info)' },
    { label: 'Critical', value: stats.critical, sub: 'Urgent recommendation gaps', color: 'var(--danger)' },
    { label: 'Audited', value: auditedCount, sub: 'Deep AI reviews complete', color: 'var(--accent)' },
    { label: 'Time saved', value: formatTimeSaved(timeSaved), sub: 'Automation reclaimed', color: 'var(--amber)' },
  ];

  const dimensionEntries = showsScores
    ? Object.entries(storeScore.dimension_scores).map(([key, value]: any) => ({
        key,
        label: key.replace(/_/g, ' '),
        score: value.score,
        reason: value.reason,
      }))
    : [];

  return (
    <div>
      <div className="page-shell">
        <nav className="site-nav">
          <button
            type="button"
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer' }}
          >
            <div className="brand-lockup">
              <div className="brand-mark">
                <Brain size={20} />
              </div>
              <div className="brand-copy">
                <span className="brand-name">RepOptimizer</span>
                <span className="brand-tagline">Catalog perception dashboard</span>
              </div>
            </div>
          </button>

          <div className="nav-actions">
            {isProcessing && (
              <span className="status-pill">
                <Loader2 size={14} className="spin" />
                {message}
              </span>
            )}
            <span className={isDemo ? 'metric-pill' : 'ghost-pill'}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isDemo ? 'var(--amber)' : 'var(--ok)',
                  display: 'inline-block',
                }}
              />
              {isDemo ? 'Demo mode' : 'Live audit'}
            </span>
            {status === 'complete' && (
              <button type="button" className="btn-secondary" onClick={() => exportReportCSV(productList)}>
                <Download size={15} />
                Export CSV
              </button>
            )}
            <button type="button" className="icon-button" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button type="button" className="icon-button" onClick={() => run()} title="Refresh Audit">
              <RefreshCcw size={17} />
            </button>
            <button type="button" className="icon-button" onClick={handleDisconnect} title="Disconnect Store">
              <LogOut size={17} />
            </button>
          </div>
        </nav>

        <main className="dashboard-main">
          <section className="dashboard-top-grid">
            <div className="panel panel--glow score-hero">
              <div className="stack" style={{ gap: 18 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <span className="section-kicker" style={{ marginBottom: 0 }}>
                    AI readiness index
                  </span>
                  <span className="ghost-pill">{isProcessing ? 'Audit running' : 'Decision layer active'}</span>
                </div>

                <div className="score-shell">
                  <div>
                    <div className="score-value" style={{ color: scoreColor }}>
                      {showsScores ? storeScore.overall_score.toFixed(1) : '--'}
                    </div>
                    <div className="score-sub">out of 100 storewide recommendation confidence</div>
                  </div>
                </div>

                <p className="section-copy" style={{ maxWidth: 620 }}>
                  {showsScores
                    ? 'This score reflects how clearly your catalog communicates product intent, trust, structure, and searchable context to shopping AI systems.'
                    : statusCopy[status as keyof typeof statusCopy] || 'Preparing the dashboard.'}
                </p>
              </div>

              <div className="stack" style={{ gap: 14 }}>
                <div className="progress-shell">
                  <div className="progress-track" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${progressWidth}%` }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {progress.current}/{progress.total || 100}
                  </span>
                </div>

                <div className="flash-card">
                  <Search size={18} color="var(--accent)" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.96rem', marginBottom: 4 }}>{message}</strong>
                    <span className="faded-note">
                      {status === 'complete'
                        ? 'Use the cards below to inspect dimensions, roadmap actions, and product-by-product AI gaps.'
                        : 'Streaming updates appear here while the catalog scan progresses.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="metric-grid">
              {statCards.map((stat) => (
                <div key={stat.label} className="metric-card">
                  <span className="metric-label">{stat.label}</span>
                  <div>
                    <div className="metric-value" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <p className="faded-note" style={{ marginTop: 8 }}>
                      {stat.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {showsScores && storeScore.business_impact && (
            <section className="panel impact-card">
              <div>
                <span className="section-kicker">Recoverable upside</span>
                <div className="impact-figure">
                  <span style={{ color: 'var(--accent)' }}>$</span>
                  {storeScore.business_impact.recoverable_revenue.toLocaleString()}
                  <span style={{ fontSize: '1.3rem', color: 'var(--text-muted)' }}>/mo</span>
                </div>
              </div>

              <p className="section-copy" style={{ maxWidth: 560 }}>
                Based on {analyzedCount} analyzed products, the system estimates that
                {' '}
                <strong style={{ color: 'var(--danger)' }}>
                  {storeScore.business_impact.critical_fixes_needed} critical AI perception gaps
                </strong>
                {' '}
                are suppressing recommendation visibility. Fixing the structure first creates the fastest lift.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setFilter('critical');
                    window.scrollTo({ top: 1100, behavior: 'smooth' });
                  }}
                >
                  Focus critical gaps
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleMegaSync}
                  disabled={isSyncing || syncComplete}
                  style={{
                    background: syncComplete
                      ? 'linear-gradient(135deg, var(--ok), #8bf0c9)'
                      : 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
                  }}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw size={16} className="spin" />
                      Syncing catalog
                    </>
                  ) : syncComplete ? (
                    <>
                      <CheckCircle2 size={16} />
                      Sync complete
                    </>
                  ) : (
                    <>
                      Mega-Sync safe fixes
                      <RefreshCw size={16} />
                    </>
                  )}
                </button>
              </div>
            </section>
          )}

          {showsScores && storeScore.dimension_scores && (
            <section className="chart-grid">
              <div className="panel chart-card">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 20,
                    flexWrap: 'wrap',
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <span className="section-kicker">Dimension radar</span>
                    <h2 className="section-title" style={{ marginBottom: 8 }}>
                      Which parts of the catalog are helping or hurting AI trust?
                    </h2>
                    <p className="section-copy">
                      Click any dimension card to open more context and see what that score means inside the catalog.
                    </p>
                  </div>
                </div>

                <div style={{ height: 280, marginBottom: 22 }}>
                  <StoreHealthCharts type="radar" data={storeScore.dimension_scores} />
                </div>

                <div className="scorecard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                  {dimensionEntries.map((entry) => (
                    <ScoreCard
                      key={entry.key}
                      label={entry.label}
                      score={entry.score}
                      reason={entry.reason}
                      onClick={() => setSelectedDimension(entry)}
                    />
                  ))}
                </div>
              </div>

              <div className="panel chart-card">
                <span className="section-kicker">Catalog health mix</span>
                <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 10 }}>
                  Gap distribution
                </h2>
                <p className="section-copy" style={{ marginBottom: 20 }}>
                  This view shows how many products are still critical, in warning territory, or already recommendation-ready.
                </p>

                <div style={{ height: 220 }}>
                  <StoreHealthCharts type="pie" data={stats} />
                </div>

                <div className="stack" style={{ marginTop: 18 }}>
                  {[
                    { label: 'Critical', color: 'var(--danger)', value: stats.critical },
                    { label: 'Warning', color: 'var(--warn)', value: stats.warning },
                    { label: 'Optimized', color: 'var(--ok)', value: stats.optimized },
                  ].map((entry) => (
                    <div
                      key={entry.label}
                      className="surface-muted"
                      style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: entry.color,
                            display: 'inline-block',
                          }}
                        />
                        <span style={{ fontWeight: 700 }}>{entry.label}</span>
                      </div>
                      <span style={{ color: entry.color, fontWeight: 800 }}>{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {showsScores && storeScore.roadmap && (
            <StrategicRoadmap 
              roadmap={storeScore.roadmap} 
              products={productList} 
              onMegaSync={handleMegaSync} 
              onShowPreview={setPreview}
              onLoading={setModalLoading}
            />
          )}

          <section className="panel section-bar">
            <div className="filter-row">
              <span className="section-kicker" style={{ marginBottom: 0 }}>
                Product queue
              </span>
              <div className="filter-row">
                <Filter size={15} color="var(--text-muted)" />
                <div className="filter-chip-row">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'critical', label: 'Critical' },
                    { id: 'warning', label: 'Warning' },
                    { id: 'optimized', label: 'Optimized' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`filter-chip ${filter === item.id ? 'filter-chip--active' : ''}`}
                      onClick={() => setFilter(item.id as FilterKey)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="progress-shell">
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Live processing status</div>
                <p className="faded-note">
                  {isProcessing ? message : `Showing ${sortedProducts.length} products in the current filter.`}
                </p>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressWidth}%` }} />
              </div>
            </div>
          </section>

          {error && (
            <div className="error-banner">
              <AlertTriangle size={18} />
              <p style={{ flex: 1 }}>{error}</p>
              <button type="button" className="btn-secondary" onClick={() => run()}>
                Retry audit
              </button>
            </div>
          )}

          <motion.div
            className="stack"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            style={{ marginTop: 18 }}
          >
            {sortedProducts.length === 0 &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="surface-muted"
                  style={{ height: 88, opacity: 0.65, animation: 'fadeUp 0.9s ease infinite alternate' }}
                />
              ))}

            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <ProductCard product={product} highlighted={getProductSeverity(product) >= 7} isDemo={isDemo} />
              </motion.div>
            ))}
          </motion.div>

          {status === 'complete' && (
            <section className="panel chart-card" style={{ marginTop: 28 }}>
              <span className="section-kicker">Search simulation lab</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: 20,
                  flexWrap: 'wrap',
                  marginBottom: 16,
                }}
              >
                <div>
                  <h2 className="section-title" style={{ marginBottom: 8 }}>
                    Test how different AI shoppers rank the catalog now.
                  </h2>
                  <p className="section-copy">
                    Compare recommendation confidence across multiple buying personas and inspect why products are
                    accepted or rejected.
                  </p>
                </div>
                <span className="status-pill">
                  <Search size={14} />
                  Query sandbox live
                </span>
              </div>

              <QuerySimulator products={productList} />
            </section>
          )}
        </main>
      </div>

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

      {preview && (
        <PreviewModal
          isOpen={preview.isOpen}
          onClose={() => setPreview(null)}
          onConfirm={preview.onConfirm}
          title={preview.title}
          description={preview.description}
          contentType={preview.contentType}
          content={preview.content}
          loading={modalLoading}
        />
      )}
    </div>
  );
}
