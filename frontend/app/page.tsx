'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  BarChart2,
  BrainCircuit,
  CheckCircle2,
  Lock,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
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

const marqueeCards = [
  { title: 'Clear product story', score: '94', tone: 'sage' },
  { title: 'Stronger trust cues', score: '81', tone: 'gold' },
  { title: 'Search-ready tags', score: '88', tone: 'clay' },
  { title: 'Cleaner descriptions', score: '91', tone: 'ink' },
  { title: 'Policy confidence', score: '79', tone: 'sage' },
  { title: 'Better buyer fit', score: '86', tone: 'gold' },
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

  const handleStart = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await validateCredentials(storeUrl, token);
      const finalUrl = result.sanitized_url || storeUrl;

      localStorage.setItem('shopify_url', finalUrl);
      localStorage.setItem('shopify_token', token);
      localStorage.removeItem('demo_mode');

      router.push('/dashboard');
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : 'Connection failed. Please check your credentials.';
      const message =
        /all connection attempts failed|connect to shopify|connection refused|timed out/i.test(rawMessage)
          ? 'This environment cannot reach Shopify right now. Your store URL may be valid, but the live connection is being blocked. Use demo mode for the walkthrough or retry from a network that can reach Shopify.'
          : rawMessage;
      setError(message);
      setLoading(false);
    }
  };

  const handleDemo = () => {
    localStorage.setItem('demo_mode', 'true');
    router.push('/dashboard');
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="page-shell">
        <nav className="site-nav">
          <div className="brand-lockup">
            <div className="brand-mark">
              <BrainCircuit size={18} color="#FFFFFF" />
            </div>
            <div className="brand-copy">
              <span className="brand-name">RepOptimizer</span>
              <span className="brand-tagline">Studio Light • Kasparro 2026</span>
            </div>
          </div>

          <div className="nav-actions">
            <span className="ghost-pill" style={{ background: 'var(--accent-soft)', color: 'var(--accent-strong)', borderColor: 'var(--accent-border)' }}>
              <Sparkles size={14} />
              AI Perception Hub
            </span>
            <button type="button" className="btn-secondary" onClick={handleDemo} suppressHydrationWarning>
              Demo access
            </button>
          </div>
        </nav>

        <main className="landing-main">
          <motion.section 
            className="hero-grid landing-stage"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className="panel hero-copy"
              style={{
                boxShadow: 'var(--shadow-card)',
                padding: '56px'
              }}
            >
              <div className="commerce-orbit" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="stack" style={{ gap: 26 }}>
                <span className="eyebrow">
                  <PackageCheck size={14} />
                  Storefront readiness studio
                </span>

                <div className="stack" style={{ gap: 20 }}>
                  <h1 className="hero-title" style={{ fontWeight: 800, lineHeight: 1.03 }}>
                    Make every product
                    <br />
                    <span className="hero-gradient">easy to choose.</span>
                  </h1>
                  <p className="hero-summary" style={{ color: 'var(--text-secondary)' }}>
                    RepOptimizer turns unclear listings into confident shopping signals. Audit your catalog, spot weak
                    product stories, and prepare cleaner descriptions, tags, and trust content from one focused workspace.
                  </p>
                </div>

                <div className="catalog-marquee catalog-marquee--hero" aria-hidden="true">
                  <div className="catalog-marquee__track">
                    {[...marqueeCards, ...marqueeCards].map((card, index) => (
                      <div key={`${card.title}-hero-${index}`} className={`catalog-marquee__card catalog-marquee__card--${card.tone}`}>
                        <span>{card.title}</span>
                        <strong>{card.score}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hero-actions" style={{ marginTop: 8 }}>
                  <button type="button" className="btn-primary" onClick={handleDemo} style={{ height: 64, padding: '0 38px', fontSize: '1.2rem' }} suppressHydrationWarning>
                    Walk through the demo
                    <ArrowRight size={20} />
                  </button>
                  <div className="flash-card" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <BarChart2 size={18} color="var(--accent)" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.04rem', marginBottom: 4, color: 'var(--text)' }}>
                        Precision signals for the agentic age.
                      </strong>
                      <span className="faded-note" style={{ color: 'var(--text-secondary)' }}>
                        Designed for merchants who need ranking signals, not just dashboards.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="commerce-flow" aria-hidden="true">
                {[
                  ['Product copy', '92'],
                  ['Trust signals', '76'],
                  ['Search tags', '88'],
                ].map(([label, value], index) => (
                  <motion.div
                    key={label}
                    className="commerce-flow-card"
                    initial={{ opacity: 0, y: 20, rotate: index === 1 ? -2 : 2 }}
                    animate={{ opacity: 1, y: [0, -8, 0], rotate: index === 1 ? [-2, 1, -2] : [2, -1, 2] }}
                    transition={{ delay: 0.35 + index * 0.15, duration: 4.5 + index, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <CheckCircle2 size={17} />
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </motion.div>
                ))}
              </div>

              <div className="stack" style={{ gap: 24, marginTop: 40 }}>
                <motion.div 
                  className="hero-feature-grid"
                  variants={{
                    show: { transition: { staggerChildren: 0.1 } }
                  }}
                >
                  {features.map((feature) => (
                    <motion.div 
                      key={feature.title} 
                      className="hero-feature" 
                      style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}
                      variants={{ 
                        hidden: { opacity: 0, y: 15 }, 
                        show: { opacity: 1, y: 0, transition: { duration: 0.5 } } 
                      }}
                      whileHover={{ y: -4, borderColor: 'var(--accent-border)', boxShadow: 'var(--shadow-hover)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <motion.div 
                          style={{ padding: 8, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}
                          whileHover={{ rotate: 8, scale: 1.05 }}
                        >
                          {feature.icon}
                        </motion.div>
                        <strong style={{ fontSize: '0.95rem' }}>{feature.title}</strong>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            <motion.aside 
              variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }}
              className="panel hero-form-card"
              style={{ boxShadow: 'var(--shadow-card)', padding: '42px' }}
            >


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
                <h2 className="section-title">Connect your store and start with clarity.</h2>
                <p className="section-copy">
                  We validate the Shopify URL, preserve sanitized credentials locally, and move straight into the audit
                  dashboard once access is confirmed.
                </p>
              </div>

              <div className="flash-card">
                <Sparkles size={18} color="var(--accent)" />
                <div>
                      <strong style={{ display: 'block', fontSize: '1.05rem', marginBottom: 4 }}>
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

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }} suppressHydrationWarning>
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

                <button type="button" className="btn-secondary" onClick={handleDemo} suppressHydrationWarning>
                  Start with demo data instead
                </button>
              </form>
            </motion.aside>
          </motion.section>

          <motion.section 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="panel signal-strip"
            style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
          >
            {signalStats.map((item, index) => (
              <motion.div 
                key={item.label} 
                className="signal-block"
                variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <strong className="signal-value" style={{ color: 'var(--accent)' }}>{item.value}</strong>
                <span className="signal-label">{item.label}</span>
              </motion.div>
            ))}
          </motion.section>

          <motion.section 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="panel" 
            style={{ marginTop: 22, padding: '48px', background: '#FFFFFF' }}
          >
            <span className="section-kicker">How the system thinks</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 20,
                flexWrap: 'wrap',
                marginBottom: 32
              }}
            >
              <div style={{ maxWidth: 620 }}>
                <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: 12 }}>A storefront audit that behaves more like an operations workflow.</h2>
                <p className="section-copy" style={{ fontSize: '1.1rem' }}>
                  The interface is built around one outcome: make it obvious why a product is invisible to AI and what
                  to fix first. Every stage is meant to move from signal to action.
                </p>
              </div>
              <span className="ghost-pill" style={{ background: 'var(--accent-soft)', color: 'var(--accent-strong)', borderColor: 'var(--accent-border)' }}>
                <Target size={14} />
                Precision Audit Architecture
              </span>
            </div>

            <div className="step-grid">
              {steps.map((step, index) => (
                <motion.article 
                  key={step.number} 
                  className="step-card" 
                  style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', padding: 24, borderRadius: 16 }}
                  variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6, borderColor: 'var(--accent-border)', boxShadow: 'var(--shadow-hover)' }}
                >
                  <motion.span 
                    className="step-number" 
                    style={{ color: 'var(--accent)', background: 'var(--accent-soft)', marginBottom: 16, display: 'inline-block', fontSize: '1.8rem', fontWeight: 700 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {step.number}
                  </motion.span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                  <p className="section-copy" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                    {step.desc}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.footer
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 14,
              flexWrap: 'wrap',
              padding: '40px 12px',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              borderTop: '1px solid var(--border)',
              marginTop: 40
            }}
          >
            <span>RepOptimizer • Kasparro 2026</span>
            <span>Studio Light Theme Engine Active</span>
          </motion.footer>
        </main>
      </div>
    </div>
  );
}
