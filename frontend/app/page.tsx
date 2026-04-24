'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  BarChart2,
  BrainCircuit,
  Lock,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { fetchConfig, validateCredentials } from '@/lib/api';

const features = [
  {
    icon: <Zap size={17} color="var(--accent)" />,
    title: 'Rule sweep before AI spend',
    desc: 'Flag obvious catalog gaps in seconds so the expensive reasoning only goes where it matters.',
  },
  {
    icon: <BrainCircuit size={17} color="var(--info)" />,
    title: 'Perception-grade scoring',
    desc: 'See how confident an AI shopper is when matching your listings to high-intent product queries.',
  },
  {
    icon: <Target size={17} color="var(--amber)" />,
    title: 'Intent mismatch detection',
    desc: 'Expose where merchant positioning and model interpretation diverge before recommendations are lost.',
  },
  {
    icon: <ShieldCheck size={17} color="var(--ok)" />,
    title: 'Safe fixes into Shopify',
    desc: 'Ship optimized descriptions, tags, FAQs, and policy-safe improvements without leaving the dashboard.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Ingest the storefront reality',
    desc: 'Pull products, policies, and tag structure directly from Shopify using read-only access.',
  },
  {
    number: '02',
    title: 'Run the quick signal scan',
    desc: 'Catch missing specs, weak metadata, and obvious structural issues before the deep audit begins.',
  },
  {
    number: '03',
    title: 'Simulate agent perception',
    desc: 'Score how an LLM actually interprets the listing, not how a merchant hopes it does.',
  },
  {
    number: '04',
    title: 'Generate repair plans',
    desc: 'Create new descriptions, structured tags, FAQs, and category signals tailored to AI discovery.',
  },
  {
    number: '05',
    title: 'Close the recommendation gap',
    desc: 'Preview, approve, and push the improvements back to the catalog with a cleaner execution path.',
  },
];

const signalStats = [
  { value: '+142%', label: 'Average visibility lift' },
  { value: '<60s', label: 'Audit startup window' },
  { value: '250', label: 'Products scanned per run' },
  { value: '3x', label: 'Buyer personas simulated' },
];

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  const [storeUrl, setStoreUrl] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = 58;
    let current = 0;
    const timer = window.setInterval(() => {
      current += 2;
      if (current >= target) {
        setCount(target);
        window.clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchConfig();
        if (config.store_url) setStoreUrl(config.store_url);
        if (config.access_token) setToken(config.access_token);
      } catch (err) {
        console.warn('Could not fetch default config:', err);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;

    const move = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      node.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const handleStart = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await validateCredentials(storeUrl.trim(), token.trim());
      const finalUrl = result.sanitized_url || storeUrl.trim();

      // Clear demo artifacts and set live credentials
      localStorage.removeItem('demo_mode');
      localStorage.setItem('shopify_url', finalUrl);
      localStorage.setItem('shopify_token', token.trim());

      router.push('/dashboard');
    } catch (err: any) {
      const message = err.message || 'Connection failed. Please check your credentials.';
      setError(message);
      setLoading(false);
    }
  };

  const handleDemo = () => {
    localStorage.setItem('demo_mode', 'true');
    router.push('/dashboard');
  };

  return (
    <div>
      <div className="page-shell">
        <nav className="site-nav">
          <div className="brand-lockup">
            <div className="brand-mark">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="brand-copy">
              <span className="brand-name">RepOptimizer</span>
              <span className="brand-tagline">Kasparro Hackathon Track 5</span>
            </div>
          </div>

          <div className="nav-actions">
            <span className="status-pill">
              <Sparkles size={14} />
              Agentic commerce signal lab
            </span>
            <button type="button" className="btn-secondary" onClick={handleDemo}>
              Explore demo
            </button>
          </div>
        </nav>

        <main className="landing-main">
          <section className="hero-grid">
            <div
              ref={heroRef}
              className="panel panel--glow hero-copy anim-fade-up"
              style={{
                background:
                  'radial-gradient(820px circle at var(--mx, 26%) var(--my, 18%), rgba(197, 229, 74, 0.12), transparent 52%), linear-gradient(180deg, rgba(255,255,255,0.05), transparent), var(--bg-card)',
              }}
            >
              <div className="stack" style={{ gap: 26 }}>
                <span className="eyebrow">
                  <Sparkles size={14} />
                  AI discovery control room
                </span>

                <div className="stack" style={{ gap: 18 }}>
                  <h1 className="hero-title">
                    Make your catalog readable to
                    {' '}
                    <span className="hero-gradient">AI shoppers.</span>
                  </h1>
                  <p className="hero-summary">
                    RepOptimizer turns vague product listings into recommendation-ready inventory. We simulate how
                    shopping LLMs interpret your store, surface the perception gaps, and prepare fixes that actually
                    improve discoverability.
                  </p>
                </div>

                <div className="hero-actions">
                  <button type="button" className="btn-primary" onClick={handleDemo}>
                    Walk through the demo
                    <ArrowRight size={16} />
                  </button>
                  <div className="flash-card">
                    <BarChart2 size={18} color="var(--amber)" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.92rem', marginBottom: 4 }}>
                        {count} live-style audits benchmarked this week
                      </strong>
                      <span className="faded-note">
                        Designed for teams who need clearer AI ranking signals, not just prettier dashboards.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stack" style={{ gap: 18 }}>
                <div className="hero-feature-grid">
                  {features.map((feature) => (
                    <div key={feature.title} className="hero-feature">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {feature.icon}
                        <strong>{feature.title}</strong>
                      </div>
                      <p>{feature.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="hero-metrics">
                  <div className="hero-stat">
                    <strong>Merchant intent</strong>
                    <span>What the product should rank for according to the business.</span>
                  </div>
                  <div className="hero-stat">
                    <strong>Model perception</strong>
                    <span>What the AI actually understands based on your existing listing data.</span>
                  </div>
                  <div className="hero-stat">
                    <strong>Actionable sync</strong>
                    <span>The fastest path from diagnostic insight to approved catalog repair.</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="panel hero-form-card anim-fade-up anim-d2">
              <div className="terminal-ribbon">
                <div className="terminal-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="ghost-pill">Secure Shopify intake</span>
              </div>

              <div className="terminal-panel">
                <span className="section-kicker">Launch an audit</span>
                <h2 className="section-title">Connect your store with a cleaner starting point.</h2>
                <p className="section-copy">
                  We validate the Shopify URL, preserve sanitized credentials locally, and move straight into the audit
                  dashboard once access is confirmed.
                </p>
              </div>

              <div className="flash-card">
                <Sparkles size={18} color="var(--accent)" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.94rem', marginBottom: 4 }}>
                    Demo mode is ready immediately
                  </strong>
                  <span className="faded-note">
                    Prefer a fast walkthrough first? The demo opens with curated catalog data and simulated AI outputs.
                  </span>
                </div>
              </div>

              <form onSubmit={handleStart} className="input-stack">
                <div>
                  <label className="field-label">Shopify store URL</label>
                  <input
                    type="text"
                    required
                    value={storeUrl}
                    onChange={(event) => setStoreUrl(event.target.value)}
                    className="input-shell"
                    placeholder="your-store.myshopify.com"
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label className="field-label">
                    <Lock size={13} />
                    Admin API token
                  </label>
                  <input
                    type="password"
                    required
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    className="input-shell"
                    placeholder="shpat_..."
                    suppressHydrationWarning
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                {error && (
                  <div
                    style={{
                      padding: '14px 16px',
                      borderRadius: 18,
                      border: '1px solid var(--danger-border)',
                      background: 'var(--danger-soft)',
                      color: 'var(--danger)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>{error}</span>
                  </div>
                )}

                <div className="shield-note">
                  <ShieldCheck size={18} color="var(--ok)" />
                  <span style={{ lineHeight: 1.55 }}>
                    Read-only by default. No catalog updates are pushed unless you explicitly approve them later.
                  </span>
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                  {loading ? (
                    <>
                      <span
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: '50%',
                          border: '2px solid rgba(18, 20, 26, 0.2)',
                          borderTopColor: '#12141a',
                        }}
                        className="spin"
                      />
                      Validating connection
                    </>
                  ) : (
                    <>
                      Run free audit
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <button type="button" className="btn-secondary" onClick={handleDemo}>
                  Start with demo data instead
                </button>
              </form>
            </aside>
          </section>

          <section className="panel signal-strip anim-fade-up anim-d3">
            {signalStats.map((item) => (
              <div key={item.label} className="signal-block">
                <strong className="signal-value">{item.value}</strong>
                <span className="signal-label">{item.label}</span>
              </div>
            ))}
          </section>

          <section className="panel" style={{ marginTop: 22, padding: '32px' }}>
            <span className="section-kicker">How the system thinks</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 20,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ maxWidth: 620 }}>
                <h2 className="section-title">A storefront audit that behaves more like an operations workflow.</h2>
                <p className="section-copy">
                  The interface is built around one outcome: make it obvious why a product is invisible to AI and what
                  to fix first. Every stage is meant to move from signal to action, not just show charts for the sake
                  of looking technical.
                </p>
              </div>
              <span className="metric-pill">
                <Target size={14} />
                Designed for merchants under time pressure
              </span>
            </div>

            <div className="step-grid">
              {steps.map((step) => (
                <article key={step.number} className="step-card">
                  <span className="step-number">{step.number}</span>
                  <h3 style={{ fontSize: '1.05rem', lineHeight: 1.1 }}>{step.title}</h3>
                  <p className="section-copy" style={{ fontSize: '0.9rem' }}>
                    {step.desc}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <footer
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 14,
              flexWrap: 'wrap',
              padding: '26px 4px 0',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <span>RepOptimizer for Kasparro Hackathon 2026</span>
            <span>Next.js, FastAPI, Groq, and a frontend rebuilt for clarity</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
