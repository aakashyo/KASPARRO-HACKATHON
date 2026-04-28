'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Severity = 'CRITICAL' | 'WARNING' | 'OPTIMIZED';

type Product = {
  id: number;
  name: string;
  severity: Severity;
  oldScore: number;
  newScore: number;
  diagnosis: string;
  issues: string[];
  fixes: string[];
  afterSync: string;
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

  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const donutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const upsideRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setNavReady(true);
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

      for (let layer = 1; layer <= 4; layer += 1) {
        ctx.beginPath();
        for (let i = 0; i < DIMENSIONS.length; i += 1) {
          const angle = -Math.PI / 2 + i * angleStep;
          const x = centerX + Math.cos(angle) * ((radius * layer) / 4);
          const y = centerY + Math.sin(angle) * ((radius * layer) / 4);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(226,221,216,0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
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

  const critical = PRODUCTS.filter((p) => p.severity === 'CRITICAL').length;
  const warning = PRODUCTS.filter((p) => p.severity === 'WARNING').length;

  return (
    <div className="page-wrap">
      <nav className={`main-nav ${navReady ? 'nav-ready' : ''}`}>
        <button
          type="button"
          className="brand-home"
          onClick={() => router.push('/')}
          aria-label="Go to home"
        >
          <div className="nav-left">
            <div className="logo-box">R</div>
            <div className="brand-name">RepOptimizer</div>
            <div className="nav-sep" />
            <div className="nav-track">KASPARRO HACKATHON TRACK 5</div>
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

      <main className="dash-container">
        <section className="dash-grid-top reveal">
          <article className="readiness-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div className="metric-label">AI READINESS INDEX</div>
              <div className="badge-small" style={{ border: '1px solid var(--border)', background: 'var(--bg-muted)', color: 'var(--ink-secondary)' }}>
                DECISION LAYER ACTIVE
              </div>
            </div>
            <div className="readiness-score">{readiness}</div>
            <div style={{ color: 'var(--ink-secondary)', fontSize: 14, marginTop: -8 }}>
              out of 100 storewide recommendation confidence
            </div>
            <div className="progress-track">
              <div className="progress-fill play" style={{ width: `${readiness}%` }} />
            </div>
            <p style={{ marginTop: 20, color: 'var(--ink-secondary)', fontSize: 14, lineHeight: 1.65 }}>
              This score reflects how clearly your catalog communicates product intent, trust, structure, and searchable
              context to shopping AI systems.
            </p>
            <div
              style={{
                marginTop: 16,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '14px 16px',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ color: 'var(--copper)' }}>⌕</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Demo audit complete</div>
                <div style={{ marginTop: 4, color: 'var(--ink-secondary)', fontSize: 13 }}>
                  Use the cards below to inspect dimensions, roadmap actions, and product-by-product AI gaps.
                </div>
              </div>
            </div>
          </article>

          <div className="small-grid">
            <article className="metric-card">
              <div className="metric-label">SCANNED</div>
              <div className="metric-num">6</div>
              <div className="metric-sub">Products surfaced</div>
            </article>
            <article className="metric-card">
              <div className="metric-label">CRITICAL</div>
              <div className="metric-num" style={{ color: 'var(--danger)' }}>
                3
              </div>
              <div className="metric-sub">Urgent recommendation gaps</div>
            </article>
            <article className="metric-card">
              <div className="metric-label">AUDITED</div>
              <div className="metric-num">6</div>
              <div className="metric-sub">Deep AI reviews complete</div>
            </article>
            <article className="metric-card">
              <div className="metric-label">TIME SAVED</div>
              <div className="metric-num" style={{ color: 'var(--copper)' }}>
                0s
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

            <div className="score-row">
              {DIMENSIONS.slice(0, 4).map((dim, idx) => (
                <div key={dim.name} className={`score-chip ${hoverAxis === idx ? 'active' : ''}`}>
                  <div className="metric-label">{dim.name.toUpperCase()}</div>
                  <div style={{ marginTop: 4, fontSize: 22, fontWeight: 700 }}>{dim.value}/100</div>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill"
                      style={{
                        width: `${dim.value}%`,
                        background:
                          dim.value < 45 ? 'var(--danger)' : dim.value < 75 ? 'var(--warning)' : 'var(--success)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="dash-card">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              CATALOG HEALTH MIX
            </div>
            <h3 style={{ fontSize: 24 }}>Gap distribution</h3>
            <p style={{ marginTop: 8, color: 'var(--ink-secondary)', fontSize: 14 }}>
              How many products are critical, warning, or ready.
            </p>

            <div className="canvas-wrap">
              <canvas ref={donutCanvasRef} width={200} height={200} />
            </div>

            <div className="legend-row">
              <span>● Critical</span>
              <strong style={{ color: 'var(--danger)' }}>{critical}</strong>
            </div>
            <div className="legend-row">
              <span>● Warning</span>
              <strong style={{ color: 'var(--warning)' }}>{warning}</strong>
            </div>
            <div className="legend-row">
              <span>● Optimized</span>
              <span style={{ color: 'var(--ink-tertiary)', fontStyle: 'italic' }}>0 - sync fixes to promote</span>
            </div>
          </article>
        </section>

        <section className="dash-card roadmap reveal">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--copper)' }}>⌖</span>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Strategic AI Growth Roadmap</div>
          </div>
          <p style={{ marginTop: 4, color: 'var(--ink-secondary)', fontSize: 14 }}>
            A prioritized, 3-phase action plan to maximize your store AI-driven discoverability and conversion.
          </p>

          <div className="road-grid">
            <article className="road-card">
              <div className="road-top" style={{ background: 'var(--danger)' }} />
              <div className="badge-row">
                <span className="badge-small" style={{ background: 'var(--bg-muted)', color: 'var(--ink-secondary)' }}>
                  PHASE 1
                </span>
                <span className="badge-small" style={{ border: '1px solid rgba(153,27,27,0.2)', background: 'rgba(153,27,27,0.08)', color: 'var(--danger)' }}>
                  ● CRITICAL
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
