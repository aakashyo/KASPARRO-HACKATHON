'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  CheckCircle2,
  Download,
  Loader2,
  Moon,
  RefreshCcw,
  RefreshCw,
  Search,
  Sun,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeStore, exportReportCSV, pushBulkFixes } from '@/lib/api';
import { demoData } from '@/lib/demoData';
import StoreHealthCharts from './components/StoreHealthCharts';
import ScoreCard from './components/ScoreCard';
import StrategicRoadmap from './components/StrategicRoadmap';
import ProductCard from './components/ProductCard';

type DashboardStatus = 'idle' | 'initializing' | 'scanning' | 'auditing' | 'complete' | 'error';
type FilterKey = 'ALL' | 'CRITICAL' | 'WARNING' | 'OPTIMIZED';
type ThemeKey = 'light' | 'dark';

interface Product {
  id: number | string;
  name: string;
  severity: 'CRITICAL' | 'WARNING' | 'OPTIMIZED';
  oldScore: number;
  newScore: number;
  diagnosis: string;
  issues: string[];
  fixes: string[];
  afterSync: string;
  is_audited?: boolean;
  audit_deep?: any;
  scan_quick?: any;
  guardrail?: any;
}

const statusCopy: Record<Exclude<DashboardStatus, 'idle' | 'complete' | 'error'>, string> = {
  initializing: 'Warming the audit engine and checking the catalog surface.',
  scanning: 'Running the deterministic sweep to catch obvious visibility gaps.',
  auditing: 'Deep-auditing product clarity against shopper expectations.',
};

const STATIC_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Neural Vitamin C Serum',
    severity: 'CRITICAL',
    oldScore: 28,
    newScore: 89,
    diagnosis: 'AI fails to detect active ingredients, reducing ranking in treatment-focused queries.',
    issues: ['Missing active ingredient %', 'No skin-type attribute', 'No clinical claim structure'],
    fixes: [
      'Add Ascorbic Acid 15% to description',
      'Add metafields: skin_type, treatment_target',
      'Restructure benefit claims with measurement anchors',
    ],
    afterSync: 'Vitamin C 15% serum for uneven tone. Structured for sensitive and combination skin recovery.',
  },
  {
    id: 2,
    name: 'Hydra-Boost Moisturizer',
    severity: 'WARNING',
    oldScore: 51,
    newScore: 78,
    diagnosis: 'Missing skin-type attributes reduce precision matching.',
    issues: ['Vague hydration claim', 'No ingredient hierarchy', 'Missing use-case scenario'],
    fixes: [
      'Add skin-type tags: dry, combination',
      'Specify key ingredients by concentration',
      'Add best-for use-case in description',
    ],
    afterSync: 'Gel moisturizer with layered hyaluronic fractions, built for dry-to-combination daily hydration.',
  },
  {
    id: 3,
    name: 'SPF 50 Daily Shield',
    severity: 'OPTIMIZED',
    oldScore: 88,
    newScore: 92,
    diagnosis: 'Strong structured data with clear use-case framing.',
    issues: ['Minor: SPF claim lacks third-party reference'],
    fixes: ['Add dermatologist-tested badge reference'],
    afterSync: 'Broad-spectrum SPF 50 with verified testing references and clear UV exposure context.',
  },
  {
    id: 4,
    name: 'Retinol Night Repair',
    severity: 'CRITICAL',
    oldScore: 31,
    newScore: 85,
    diagnosis: 'Retinol concentration missing; AI cannot rank in treatment-specific queries.',
    issues: ['No concentration anchor', 'No usage cadence guidance'],
    fixes: ['Add 0.3% retinol concentration', 'Add PM routine instructions'],
    afterSync: '0.3% retinol overnight concentrate with staged usage guidance for tolerance-safe renewal.',
  },
  {
    id: 5,
    name: 'Gentle Foaming Cleanser',
    severity: 'WARNING',
    oldScore: 55,
    newScore: 74,
    diagnosis: 'Category ambiguity; AI is unsure if face wash or body wash.',
    issues: ['No category qualifier', 'Missing skin-target phrasing'],
    fixes: ['Declare facial cleanser category', 'Add oily/sensitive skin matching tags'],
    afterSync: 'Face cleanser for daily makeup and SPF removal, mapped to oily and sensitive skin journeys.',
  },
  {
    id: 6,
    name: 'Collagen Eye Cream',
    severity: 'CRITICAL',
    oldScore: 24,
    newScore: 88,
    diagnosis: 'No measurable benefit claims. AI treats as decorative item.',
    issues: ['No quantified effect', 'No concern-specific signal'],
    fixes: ['Add measurable depuffing claim', 'Map to dark circle concern tags'],
    afterSync: 'Eye cream with peptide-collagen blend and timed depuffing claim for dark-circle support.',
  },
];

const FILTERS: FilterKey[] = ['ALL', 'CRITICAL', 'WARNING', 'OPTIMIZED'];

function getFilterKey(product: any): FilterKey {
  const severity = product.scan_quick?.severity ?? product.audit_deep?.gaps?.severity ?? product.severity;

  if (typeof severity === 'number') {
    if (severity >= 7) return 'CRITICAL';
    if (severity >= 4) return 'WARNING';
    return 'OPTIMIZED';
  }

  if (severity === 'CRITICAL' || severity === 'WARNING' || severity === 'OPTIMIZED') {
    return severity;
  }

  return 'WARNING';
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL');
  const [products, setProducts] = useState<Record<string, any>>({});
  const [storeScore, setStoreScore] = useState<any>(null);
  const [status, setStatus] = useState<DashboardStatus>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState('Initializing catalog audit...');
  const [isDemo, setIsDemo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSaved, setTimeSaved] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>('light');

  const productList = useMemo(() => {
    const liveProducts = Object.values(products);
    return liveProducts.length > 0 ? liveProducts : STATIC_PRODUCTS;
  }, [products]);

  const stats = useMemo(() => {
    const nextStats = { critical: 0, warning: 0, optimized: 0 };

    productList.forEach((product) => {
      const key = getFilterKey(product);
      if (key === 'CRITICAL') nextStats.critical += 1;
      else if (key === 'WARNING') nextStats.warning += 1;
      else nextStats.optimized += 1;
    });

    return nextStats;
  }, [productList]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'ALL') return productList;
    return productList.filter((product) => getFilterKey(product) === activeFilter);
  }, [activeFilter, productList]);

  const applyTheme = (nextTheme: ThemeKey) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('repoptimizer-theme', nextTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'light' ? 'dark' : 'light');
  };

  const run = async (forceDemo = false) => {
    setProducts({});
    setStoreScore(null);
    setError(null);
    setSyncComplete(false);

    if (forceDemo || isDemo) {
      setStatus('scanning');
      setMessage('Loading demo catalog...');

      window.setTimeout(() => {
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

    try {
      setStatus('initializing');

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
            if (processed) setTimeSaved(processed * 2.1);
          } else if (processed && total) {
            setProgress({ current: processed, total });
            setTimeSaved(processed * 2.1);
          }
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
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    const demo = localStorage.getItem('demo_mode') === 'true';
    setIsDemo(demo);
    run(demo);
  }, []);

  const handleMegaSync = async () => {
    if (isDemo) {
      alert('Mega-Sync is disabled in Demo Mode.');
      return;
    }

    setIsSyncing(true);

    try {
      const allFixable = productList.filter((product) => product.audit_deep?.fixes);
      const fixes = allFixable.map((product) => ({
        product_id: product.id,
        description: product.audit_deep.fixes.improved_description || '',
        tags: (product.audit_deep.fixes.structured_tags || []).map((tag: any) =>
          typeof tag === 'string' ? tag : `${tag.name}:${tag.value}`
        ),
      }));

      if (fixes.length === 0) {
        alert('No fixes available to sync.');
        return;
      }

      await pushBulkFixes(fixes);
      setSyncComplete(true);
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!mounted) return null;

  const showsScores = status === 'complete' && storeScore;
  const progressWidth = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  const scoreColor = showsScores
    ? storeScore.overall_score > 70
      ? 'var(--ok)'
      : storeScore.overall_score > 45
        ? 'var(--warn)'
        : 'var(--danger)'
    : 'var(--text-faint)';

  const statCards = [
    { label: 'Scanned', value: productList.length, sub: 'Products surfaced', color: 'var(--accent)' },
    { label: 'Critical', value: stats.critical, sub: 'Urgent catalog gaps', color: 'var(--danger)' },
    { label: 'Audited', value: productList.filter((product) => product.is_audited).length, sub: 'Deep reviews complete', color: 'var(--ok)' },
    { label: 'Time saved', value: `${Math.floor(timeSaved)}s`, sub: 'Automation reclaimed', color: 'var(--amber)' },
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
    <div className="page-shell" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav className="site-nav">
        <button type="button" onClick={() => router.push('/')} className="brand-button">
          <div className="brand-lockup">
            <div className="brand-mark"><Brain size={20} /></div>
            <div className="brand-copy">
              <span className="brand-name">RepOptimizer</span>
              <span className="brand-tagline">Catalog quality workspace</span>
            </div>
          </div>
        </button>

        <div className="nav-actions">
          {status !== 'complete' && status !== 'error' && (
            <span className="status-pill"><Loader2 size={14} className="spin" /> {message}</span>
          )}
          <span className={isDemo ? 'metric-pill' : 'ghost-pill'}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isDemo ? 'var(--amber)' : 'var(--ok)', display: 'inline-block' }} />
            {isDemo ? 'Demo mode' : 'Live audit'}
          </span>
          {status === 'complete' && (
            <button type="button" className="btn-secondary" onClick={() => exportReportCSV(productList)}>
              <Download size={15} /> Export CSV
            </button>
          )}
          <button type="button" className="icon-button" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button type="button" className="icon-button" onClick={() => run()}>
            <RefreshCcw size={17} />
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <motion.section
          className="dashboard-top-grid"
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="panel score-hero">
            <div className="stack" style={{ gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <span className="section-kicker">Store readiness index</span>
                <span className="ghost-pill">{status === 'complete' ? 'Decision layer active' : 'Audit running'}</span>
              </div>
              <div className="score-shell">
                <div>
                  <div className="score-value" style={{ color: scoreColor, fontWeight: 700 }}>
                    {showsScores ? storeScore.overall_score : '--'}
                  </div>
                  <div className="score-sub">out of 100 storewide presentation confidence</div>
                </div>
              </div>
              <p className="section-copy" style={{ maxWidth: 620 }}>
                {showsScores
                  ? 'This score reflects how clearly your catalog communicates product intent, trust, and structure.'
                  : statusCopy[status as keyof typeof statusCopy] || 'Preparing the dashboard.'}
              </p>
            </div>

            <div className="stack" style={{ gap: 14, marginTop: 24 }}>
              <div className="progress-shell">
                <div className="progress-track" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${progressWidth}%`, background: 'var(--accent)' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {progress.current}/{progress.total || 100}
                </span>
              </div>
              <div className="flash-card">
                <Search size={18} color="var(--accent)" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.96rem', marginBottom: 4 }}>{message}</strong>
                  <span className="faded-note">Streaming updates appear here while the catalog scan progresses.</span>
                </div>
              </div>
              {error && (
                <div className="error-banner">
                  <span style={{ lineHeight: 1.55 }}>{error}</span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="metric-grid">
            {statCards.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="metric-card"
                style={{ borderLeft: `4px solid ${stat.color}` }}
              >
                <span className="metric-label">{stat.label}</span>
                <div>
                  <div className="metric-value" style={{ fontWeight: 700 }}>{stat.value}</div>
                  <p className="faded-note" style={{ marginTop: 8 }}>{stat.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {showsScores && storeScore.business_impact && (
          <section className="panel impact-card" style={{ marginTop: 24 }}>
            <div>
              <span className="section-kicker">Recoverable upside</span>
              <div className="impact-figure">
                <span style={{ color: 'var(--accent)' }}>$</span>
                {storeScore.business_impact.recoverable_revenue.toLocaleString()}
                <span style={{ fontSize: '1.3rem', color: 'var(--text-muted)' }}>/mo</span>
              </div>
            </div>
            <p className="section-copy" style={{ maxWidth: 560 }}>
              Based on {productList.length} products, there are <strong style={{ color: 'var(--danger)' }}>{storeScore.business_impact.critical_fixes_needed} critical gaps</strong> suppressing visibility.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              <button type="button" className="btn-secondary" onClick={() => setActiveFilter('CRITICAL')}>Focus critical gaps</button>
              <button type="button" className="btn-primary" onClick={handleMegaSync} disabled={isSyncing || syncComplete}>
                {isSyncing ? <><RefreshCw size={16} className="spin" /> Syncing</> : syncComplete ? <><CheckCircle2 size={16} /> Complete</> : <><RefreshCw size={16} /> Mega-Sync safe fixes</>}
              </button>
            </div>
          </section>
        )}

        {showsScores && (
          <section className="chart-grid" style={{ marginTop: 24 }}>
            <div className="panel chart-card">
              <span className="section-kicker">Dimension radar</span>
              <div style={{ height: 320, margin: '20px 0' }}>
                <StoreHealthCharts type="radar" data={storeScore.dimension_scores} />
              </div>
              <div className="scorecard-grid">
                {dimensionEntries.map((entry) => (
                  <ScoreCard key={entry.key} label={entry.label} score={entry.score} reason={entry.reason} />
                ))}
              </div>
            </div>

            <div className="panel chart-card">
              <span className="section-kicker">Catalog health mix</span>
              <div style={{ height: 260, margin: '20px 0' }}>
                <StoreHealthCharts type="pie" data={stats} />
              </div>
              <div className="stack" style={{ gap: 10 }}>
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="surface-muted" style={{ padding: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
                    <span style={{ fontWeight: 700, color: `var(--${key === 'critical' ? 'danger' : key === 'warning' ? 'warn' : 'ok'})` }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {showsScores && storeScore.roadmap && (
          <div style={{ marginTop: 24 }}>
            <StrategicRoadmap roadmap={storeScore.roadmap} products={productList} onMegaSync={handleMegaSync} />
          </div>
        )}

        <section className="panel" style={{ marginTop: 24, padding: 32 }}>
          <div className="filter-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 18, marginBottom: 24 }}>
            <div>
              <span className="section-kicker">Product Queue</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Deep Audit Catalog</h2>
            </div>
            <div className="filter-chip-row">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-chip ${activeFilter === filter ? 'filter-chip--active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="stack" style={{ gap: 16 }}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} isDemo={isDemo} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
