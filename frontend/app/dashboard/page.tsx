'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Severity = 'CRITICAL' | 'WARNING' | 'OPTIMIZED';

const statusCopy: Record<Exclude<DashboardStatus, 'idle' | 'complete' | 'error'>, string> = {
  initializing: 'Warming the audit engine and checking the catalog surface.',
  scanning: 'Running the deterministic sweep to catch obvious visibility gaps.',
  auditing: 'Deep-auditing product clarity against shopper expectations.',
};

const PRODUCTS: Product[] = [
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

const DIMENSIONS = [
  { name: 'Product Quality', value: 42 },
  { name: 'Policy Clarity', value: 85 },
  { name: 'FAQ Coverage', value: 38 },
  { name: 'Trust Signals', value: 72 },
  { name: 'Structured Data', value: 45 },
];

const FILTERS = ['ALL', 'CRITICAL', 'WARNING', 'OPTIMIZED'] as const;

type Filter = (typeof FILTERS)[number];

function severityClass(level: Severity): string {
  if (level === 'CRITICAL') return 'status-critical';
  if (level === 'WARNING') return 'status-warning';
  return 'status-optimized';
}

export default function DashboardPage() {
  const router = useRouter();
  const [navReady, setNavReady] = useState(false);
  const [readiness, setReadiness] = useState(0);
  const [upside, setUpside] = useState(0);
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL');
  const [displayFilter, setDisplayFilter] = useState<Filter>('ALL');
  const [fading, setFading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [pulseCard, setPulseCard] = useState<number | null>(null);
  const [hoverAxis, setHoverAxis] = useState<number | null>(null);

  const [products, setProducts] = useState<Record<string, any>>({});
  const [storeScore, setStoreScore] = useState<any>(null);
  const [status, setStatus] = useState<DashboardStatus>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState('Initializing catalog audit...');
  const [isDemo, setIsDemo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSaved, setTimeSaved] = useState(0);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>('light');
  const [selectedDimension, setSelectedDimension] = useState<any>(null);

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
    const nextTheme: ThemeKey = savedTheme === 'dark' ? 'dark' : 'light';
    applyTheme(nextTheme);

    const demo = localStorage.getItem('demo_mode') === 'true';
    setIsDemo(demo);
    run(demo);
    // `run` is intentionally initialized once here for the first dashboard load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      setReadiness(Math.round(54 * ease));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const node = upsideRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const start = performance.now();
          const duration = 1800;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const ease = 1 - Math.pow(1 - t, 3);
            setUpside(Math.round(12500 * ease));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 115;
    const angleStep = (Math.PI * 2) / DIMENSIONS.length;

    const draw = (scale: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

          return accumulator;
        },
        { critical: 0, warning: 0, optimized: 0 }
      ),
    [productList]
  );

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
          : 'No catalog fixes available to sync.'
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

      for (let i = 0; i < DIMENSIONS.length; i += 1) {
        const angle = -Math.PI / 2 + i * angleStep;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#e2ddd8';
        ctx.lineWidth = 1;
        ctx.stroke();

        const labelX = centerX + Math.cos(angle) * (radius + 22);
        const labelY = centerY + Math.sin(angle) * (radius + 22);
        ctx.fillStyle = i === hoverAxis ? '#b87333' : '#8c857d';
        ctx.font = '12px "DM Sans"';
        ctx.textAlign = 'center';
        ctx.fillText(DIMENSIONS[i]?.name ?? '', labelX, labelY);
      }

      ctx.beginPath();
      for (let i = 0; i < DIMENSIONS.length; i += 1) {
        const angle = -Math.PI / 2 + i * angleStep;
        const p = (DIMENSIONS[i]?.value ?? 0) / 100;
        const x = centerX + Math.cos(angle) * radius * p * scale;
        const y = centerY + Math.sin(angle) * radius * p * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(184,115,51,0.15)';
      ctx.strokeStyle = '#b87333';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    };

    const start = performance.now();
    const duration = 800;
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      draw(ease);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let found: number | null = null;
      for (let i = 0; i < DIMENSIONS.length; i += 1) {
        const angle = -Math.PI / 2 + i * angleStep;
        const lx = centerX + Math.cos(angle) * (radius + 22);
        const ly = centerY + Math.sin(angle) * (radius + 22);
        const dx = x - lx;
        const dy = y - ly;
        if (Math.sqrt(dx * dx + dy * dy) < 26) {
          found = i;
          break;
        }
      }
      setHoverAxis(found);
      draw(1);
    };

    const onLeave = () => {
      setHoverAxis(null);
      draw(1);
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [hoverAxis]);

  useEffect(() => {
    const canvas = donutCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = [
      { label: 'Critical', value: 3, color: '#991b1b' },
      { label: 'Warning', value: 3, color: '#92400e' },
      { label: 'Optimized', value: 0, color: '#2d6a4f' },
    ];
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 82;
    const inner = radius * 0.6;

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let start = -Math.PI / 2;
      const gap = (3 / (Math.PI * radius)) * 2;
      data.forEach((segment) => {
        const slice = total === 0 ? 0 : (segment.value / total) * Math.PI * 2;
        const end = start + slice * progress;
        if (slice > 0) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, start + gap, end - gap);
          ctx.strokeStyle = segment.color;
          ctx.lineWidth = radius - inner;
          ctx.lineCap = 'butt';
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, start, start + Math.PI / 2);
          ctx.strokeStyle = 'rgba(45,106,79,0.22)';
          ctx.lineWidth = radius - inner;
          ctx.stroke();
        }
        start += slice;
      });
      ctx.fillStyle = '#4a4540';
      ctx.font = '14px "DM Sans"';
      ctx.textAlign = 'center';
      ctx.fillText('6 total', centerX, centerY + 4);
    };

    const startTs = performance.now();
    const duration = 1000;
    const animate = (now: number) => {
      const t = Math.min(1, (now - startTs) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      draw(ease);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    let timer: number;
    const pulse = () => {
      const index = Math.floor(Math.random() * PRODUCTS.length);
      setPulseCard(PRODUCTS[index]?.id ?? null);
      timer = window.setTimeout(() => {
        setPulseCard(null);
        timer = window.setTimeout(pulse, 8000 + Math.floor(Math.random() * 4000));
      }, 400);
    };
    timer = window.setTimeout(pulse, 9000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const down = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName === 'BUTTON') {
        target.classList.add('spring');
        target.classList.remove('spring-up');
      }
    };
    const up = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName === 'BUTTON') {
        target.classList.remove('spring');
        target.classList.add('spring-up');
        setTimeout(() => target.classList.remove('spring-up'), 180);
      }
    };
    document.addEventListener('mousedown', down);
    document.addEventListener('mouseup', up);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('mouseup', up);
    };
  }, []);

  const filtered = useMemo(() => {
    if (displayFilter === 'ALL') return PRODUCTS;
    return PRODUCTS.filter((item) => item.severity === displayFilter);
  }, [displayFilter]);

  const setFilter = (next: Filter) => {
    if (next === activeFilter) return;
    setActiveFilter(next);
    setFading(true);
    setTimeout(() => {
      setDisplayFilter(next);
      setFading(false);
    }, 200);
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
    { label: 'Scanned', value: analyzedCount, sub: 'Products surfaced', color: 'var(--accent)' },
    { label: 'Critical', value: stats.critical, sub: 'Urgent catalog gaps', color: 'var(--danger)' },
    { label: 'Audited', value: auditedCount, sub: 'Deep product reviews complete', color: 'var(--ok)' },
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
                <span className="brand-tagline">Catalog quality workspace</span>
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
            <button type="button" className="icon-button" onClick={() => run()}>
              <RefreshCcw size={17} />
            </button>
          </div>
        </button>
        <div className="dash-nav-right">
          <div className="demo-pill">● DEMO MODE</div>
          <button className="export-btn" type="button">
            ↓ Export CSV
          </button>
          <button className="icon-btn" type="button" aria-label="Toggle theme">
            ☼
          </button>
          <button className="icon-btn" type="button" aria-label="Refresh">
            ↻
          </button>
        </div>
      </nav>

        <main className="dashboard-main">
          <motion.section 
            className="dashboard-top-grid"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="panel score-hero"
            >
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
                    Store readiness index
                  </span>
                  <span className="ghost-pill">{isProcessing ? 'Audit running' : 'Decision layer active'}</span>
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
                    ? 'This score reflects how clearly your catalog communicates product intent, trust, structure, and searchable context to modern shopping journeys.'
                    : statusCopy[status as keyof typeof statusCopy] || 'Preparing the dashboard.'}
                </p>
              </div>

              <div className="stack" style={{ gap: 14 }}>
                <div className="progress-shell">
                  <div className="progress-track" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${progressWidth}%`, background: 'var(--accent)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {progress.current}/{progress.total || 100}
                  </span>
                </div>

                <div className="flash-card" style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>
                  <Search size={18} color="var(--accent)" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.96rem', marginBottom: 4 }}>{message}</strong>
                    <span className="faded-note">
                      {status === 'complete'
                        ? 'Use the cards below to inspect dimensions, roadmap actions, and product-by-product catalog gaps.'
                        : 'Streaming updates appear here while the catalog scan progresses.'}
                    </span>
                  </div>
                </div>
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
                    <div className="metric-value" style={{ color: 'var(--text)', fontWeight: 700 }}>
                      {stat.value}
                    </div>
                    <p className="faded-note" style={{ marginTop: 8 }}>
                      {stat.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

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
                  {storeScore.business_impact.critical_fixes_needed} critical catalog clarity gaps
                </strong>
                {' '}
                are suppressing product visibility. Fixing the structure first creates the fastest lift.
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
                      ? 'var(--ok)'
                      : 'var(--gradient-primary)',
                    boxShadow: '0 12px 24px rgba(37, 99, 235, 0.24)'
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
                      Which parts of the catalog are helping or hurting customer trust?
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
                  This view shows how many products are still critical, in warning territory, or ready to present.
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
            <StrategicRoadmap roadmap={storeScore.roadmap} products={productList} onMegaSync={handleMegaSync} />
          )}

          <section className="panel section-bar" style={{ padding: '28px 32px', background: '#FFFFFF' }}>
            <div className="filter-row" style={{ marginBottom: 20 }}>
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
                      style={{
                        background: filter === item.id ? 'var(--gradient-primary)' : 'transparent',
                        color: filter === item.id ? '#FFFFFF' : 'var(--text-secondary)',
                        borderColor: filter === item.id ? 'transparent' : 'var(--border)'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>

            <div className="progress-shell" style={{ background: 'var(--bg)', padding: '16px 20px', borderRadius: 12 }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Live processing status</div>
                <p className="faded-note">
                  {isProcessing ? message : `Showing ${sortedProducts.length} products in the current filter.`}
                </p>
              </div>
              <div className="progress-track" style={{ height: 8, background: 'var(--border)' }}>
                <div className="progress-fill" style={{ width: `${progressWidth}%` }} />
              </div>
              <div className="metric-sub" style={{ color: 'var(--copper)', fontWeight: 500, cursor: 'pointer' }}>
                Run your first sync to start saving time →
              </div>
            </article>
          </div>
        </section>

        <section className="upside reveal" ref={upsideRef}>
          <div>
            <div className="metric-label" style={{ color: 'rgba(250,249,247,0.4)' }}>
              RECOVERABLE UPSIDE
            </div>
            <div className="up-amount">
              ${upside.toLocaleString()}
              <small>/mo</small>
            </div>
          </div>
          <div style={{ maxWidth: 400 }}>
            <p style={{ fontSize: 15, lineHeight: 1.65 }}>
              Based on 6 analyzed products, the system estimates that <span style={{ color: 'var(--danger)', fontWeight: 600 }}>4 critical AI perception gaps</span> are suppressing recommendation visibility. Fixing the
              structure first creates the fastest lift.
            </p>
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button className="ghost-btn" type="button" style={{ padding: '10px 20px', color: 'rgba(250,249,247,0.7)', borderColor: 'rgba(250,249,247,0.2)' }}>
                Focus critical gaps
              </button>
              <button className="btn-primary" type="button" style={{ padding: '10px 20px' }}>
                Mega-Sync safe fixes ⟳
              </button>
            </div>
          </div>
        </section>

        <section className="section-grid reveal">
          <article className="dash-card">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              DIMENSION RADAR
            </div>
            <h3 style={{ fontSize: 26, lineHeight: 1.2 }}>Which parts of the catalog are helping or hurting AI trust?</h3>
            <p style={{ marginTop: 8, color: 'var(--ink-secondary)', fontSize: 14 }}>Click any dimension card to open more context.</p>

            <div className="canvas-wrap">
              <canvas ref={radarCanvasRef} width={320} height={320} />
            </div>

          {status === 'complete' && (
            <section className="panel chart-card" style={{ marginTop: 28 }}>
              <span className="section-kicker">Search testing lab</span>
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
                    Test how different shoppers rank the catalog now.
                  </h2>
                  <p className="section-copy">
                    Compare confidence across multiple buying personas and inspect why products are
                    accepted or rejected.
                  </p>
                </div>
                <span className="status-pill">
                  <Search size={14} />
                  Query studio live
                </span>
              </div>
              <h4 style={{ marginTop: 14, fontFamily: 'DM Sans, sans-serif', fontSize: 17 }}>Trust Foundation</h4>
              <p style={{ marginTop: 4, color: 'var(--ink-secondary)', fontSize: 13 }}>Generate AI Discovery Guide and Policies</p>
              <div style={{ marginTop: 20, fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-tertiary)' }}>EST. IMPACT</div>
              <div style={{ marginTop: 4, fontSize: 13 }}>High (Legal and Agent Safety)</div>
              <button className="nav-btn" type="button" style={{ width: '100%', marginTop: 16 }}>
                ✦ Build Trust Guide
              </button>
            </article>

            <article className="road-card">
              <div className="road-top" style={{ background: 'var(--danger)' }} />
              <div className="badge-row">
                <span className="badge-small" style={{ background: 'var(--bg-muted)', color: 'var(--ink-secondary)' }}>
                  PHASE 2
                </span>
                <span className="badge-small" style={{ border: '1px solid rgba(153,27,27,0.2)', background: 'rgba(153,27,27,0.08)', color: 'var(--danger)' }}>
                  ● CRITICAL
                </span>
              </div>
              <h4 style={{ marginTop: 14, fontFamily: 'DM Sans, sans-serif', fontSize: 17 }}>Search Visibility</h4>
              <p style={{ marginTop: 4, color: 'var(--ink-secondary)', fontSize: 13 }}>Mega-Sync 4 Product Tags</p>
              <div style={{ marginTop: 20, fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-tertiary)' }}>EST. IMPACT</div>
              <div style={{ marginTop: 4, fontSize: 13 }}>Medium (Ranking Volume)</div>
              <button className="nav-btn" type="button" style={{ width: '100%', marginTop: 16 }}>
                ⚡ Execute Sync
              </button>
            </article>

            <article className="road-card">
              <div className="road-top" style={{ background: 'var(--warning)' }} />
              <div className="badge-row">
                <span className="badge-small" style={{ background: 'var(--bg-muted)', color: 'var(--ink-secondary)' }}>
                  PHASE 3
                </span>
                <span className="badge-small" style={{ border: '1px solid rgba(146,64,14,0.2)', background: 'rgba(146,64,14,0.08)', color: 'var(--warning)' }}>
                  ● WARNING
                </span>
              </div>
              <h4 style={{ marginTop: 14, fontFamily: 'DM Sans, sans-serif', fontSize: 17 }}>Conversion Optimization</h4>
              <p style={{ marginTop: 4, color: 'var(--ink-secondary)', fontSize: 13 }}>Semantic Description Deep Audit</p>
              <div style={{ marginTop: 20, fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-tertiary)' }}>EST. IMPACT</div>
              <div style={{ marginTop: 4, fontSize: 13 }}>High (Recommendation Confidence)</div>
              <button className="nav-btn" type="button" style={{ width: '100%', marginTop: 16 }}>
                ↗ Start Audit
              </button>
            </article>
          </div>
        </section>

        <section className="queue reveal">
          <div className="queue-head">
            <div>
              <div className="metric-label">PRODUCT QUEUE</div>
              <div style={{ marginTop: 6, color: 'var(--ink-secondary)', fontSize: 13 }}>⎇ Filter by severity</div>
            </div>

            <div>
              <div className="tabs">
                {FILTERS.map((f) => (
                  <button key={f} type="button" className={`tab ${activeFilter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, color: 'var(--ink-secondary)' }}>Live processing status</div>
              <div style={{ width: 200, height: 4, marginTop: 6, background: 'var(--bg-muted)', borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 2,
                    background: 'var(--success)',
                    transition: 'width 1500ms ease-out',
                  }}
                />
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-tertiary)' }}>
                Showing {filtered.length} products in the current filter.
              </div>
            </div>
          </div>

          <div className={`queue-list ${fading ? 'fading' : ''}`}>
            {filtered.map((product) => {
              const open = expanded === product.id;
              return (
                <article
                  key={product.id}
                  className={`product-card ${pulseCard === product.id ? 'pulse' : ''}`}
                  onClick={() => setExpanded((prev) => (prev === product.id ? null : product.id))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setExpanded((prev) => (prev === product.id ? null : product.id));
                    }
                  }}
                  tabIndex={0}
                  role="button"
                >
                  <div className="product-main">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div className="avatar">{product.name.slice(0, 1)}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{product.name}</div>
                        <div className={`status-badge ${severityClass(product.severity)}`}>{product.severity}</div>
                        <div style={{ marginTop: 4, color: 'var(--ink-secondary)', fontSize: 14 }}>{product.diagnosis}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                      <div className="score-shift">
                        <div className="metric-label">AI SCORE SHIFT</div>
                        <div style={{ marginTop: 4, fontSize: 24, fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
                          <span style={{ color: 'var(--danger)' }}>{product.oldScore}</span>{' '}
                          <span style={{ color: 'var(--ink-tertiary)' }}>→</span>{' '}
                          <span style={{ color: 'var(--success)' }}>{product.newScore}</span>
                        </div>
                      </div>
                      <div style={{ color: 'var(--ink-tertiary)', fontSize: 20, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms var(--ease)' }}>
                        ˅
                      </div>
                    </div>
                  </div>

                  <div className={`expand-wrap ${open ? 'open' : ''}`}>
                    <div className="expand-inner">
                      <div className="expand-grid">
                        <div>
                          <div className="metric-label">ISSUES DETECTED</div>
                          <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--ink-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                            {product.issues.map((issue) => (
                              <li key={issue}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="metric-label">RECOMMENDED FIXES</div>
                          <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--ink-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                            {product.fixes.map((fix) => (
                              <li key={fix}>{fix}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="metric-label">AFTER SYNC</div>
                          <div className="preview-box code-font" style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-secondary)', lineHeight: 1.7 }}>
                            {product.afterSync}
                          </div>
                        </div>
                      </div>

                      <div className="action-row">
                        <button type="button" className="btn-primary" style={{ padding: '10px 18px' }}>
                          Apply this fix →
                        </button>
                        <button type="button" style={{ border: 'none', background: 'transparent', color: 'var(--ink-secondary)', textDecoration: 'underline', cursor: 'pointer' }}>
                          Skip for now
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
