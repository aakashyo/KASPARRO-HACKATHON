'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import MarketingShell from '@/components/marketing/MarketingShell';

const signals = [
  'query confidence +142%',
  'semantic drift removed',
  'policy packet verified',
  'storefront index refreshed',
];

const transformations = [
  {
    before: 'generic_skin_item\\n?undefined_signals',
    after: 'vitamin_c_serum\\n::trust.packet.v3',
    events: [
      '+ Added ingredient concentration anchors',
      '+ Reframed benefit claims with measurable language',
      '+ Injected policy-safe FAQ coverage',
    ],
  },
  {
    before: 'hydrating_cleanser\\n?missing_context',
    after: 'ceramide_cleanser\\n::intent.packet.v2',
    events: [
      '+ Appended skin-type compatibility metadata',
      '+ Normalized claim wording for model ranking',
      '+ Patched duplicate tags in product narrative',
    ],
  },
  {
    before: 'energy_gummies\\n?low_query_match',
    after: 'b12_focus_gummies\\n::benefit.packet.v4',
    events: [
      '+ Added active ingredient evidence references',
      '+ Enriched Q and A snippets for commerce bots',
      '+ Removed weak qualifiers from key attributes',
    ],
  },
];

export default function LandingPage() {
  const reducedMotion = useReducedMotion();
  const [signalIndex, setSignalIndex] = useState(0);
  const [transformIndex, setTransformIndex] = useState(0);
  const [timestamp, setTimestamp] = useState('');
  const [heavyReady, setHeavyReady] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [errors, setErrors] = useState<{ storeUrl?: string; token?: string }>({});
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSignalIndex((prev) => (prev + 1) % signals.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTransformIndex((prev) => (prev + 1) % transformations.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const refreshTick = () => {
      const now = new Date();
      setTimestamp(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );
    };
    refreshTick();
    const ticker = window.setInterval(refreshTick, 1000);
    return () => window.clearInterval(ticker);
  }, []);

  const activeTransform = transformations[transformIndex];

  useEffect(() => {
    const activate = () => setHeavyReady(true);
    const deferred = window.setTimeout(activate, 700);
    return () => window.clearTimeout(deferred);
  }, []);

  useEffect(() => {
    if (!heavyReady || reducedMotion) return;
    const move = (event: MouseEvent) => {
      const glow = glowRef.current;
      if (!glow) return;
      glow.style.transform = `translate(${event.clientX - 130}px, ${event.clientY - 130}px)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [heavyReady, reducedMotion]);

  const validate = () => {
    const nextErrors: { storeUrl?: string; token?: string } = {};
    const shopifyPattern = /^https:\/\/[a-zA-Z0-9-]+\.myshopify\.com\/?$/;

    if (!storeUrl.trim()) nextErrors.storeUrl = 'Store URL is required.';
    else if (!shopifyPattern.test(storeUrl.trim())) {
      nextErrors.storeUrl = 'Use a valid myshopify URL (https://your-store.myshopify.com).';
    }

    if (!token.trim()) nextErrors.token = 'Admin token is required.';
    else if (!token.startsWith('shpat_') || token.length < 14) {
      nextErrors.token = 'Token should start with shpat_ and look complete.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleConnect = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitMessage('');
    setSubmitState('idle');

    if (!validate()) {
      setSubmitState('error');
      setSubmitMessage('Please fix the highlighted fields.');
      return;
    }

    setSubmitState('loading');
    setSubmitMessage('Validating credentials...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      localStorage.setItem('demo_mode', 'false');
      localStorage.setItem('shopify_url', storeUrl.trim());
      localStorage.setItem('shopify_token', token.trim());
      setSubmitState('success');
      setSubmitMessage('Connected successfully. Opening dashboard...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch {
      setSubmitState('error');
      setSubmitMessage('Connection failed. Please retry.');
    }
  };

  return (
    <MarketingShell primaryCtaHref="/login" primaryCtaLabel="Start audit" showFooterCta>
      {heavyReady && !reducedMotion && <div ref={glowRef} className="cursor-glow" />}

      <div>
        <section className="sleek-hero">
          <div className="hero-noise" />
          <div className="sleek-hero-left">
            <p className="sleek-eyebrow">AI COMMERCE SIGNAL INFRASTRUCTURE</p>
            <h1>
              Make your catalog
              <br />
              <span>impossible to ignore.</span>
            </h1>
            <p className="sleek-copy">
              RepOptimizer rewrites noisy Shopify product data into recommendation-grade trust packets that rank better
              inside modern AI shopping engines.
            </p>

            <div className="sleek-cta-row">
              <Link href="/login" className="sleek-btn solid big">
                Start audit
              </Link>
              <Link href="/dashboard" className="sleek-btn ghost big">
                Enter live workspace
              </Link>
            </div>

            <div className="signal-ticker">
              <span className="dot" />
              <span className="ticker-text">{signals[signalIndex]}</span>
            </div>
          </div>

          <div className="sleek-hero-card">
            <div className="card-top">
              <span>LIVE SIGNAL MAP</span>
              <span className="card-track">TRACK 5 · {timestamp || '--:--:--'}</span>
            </div>
            <div className={`orbital-stage ${heavyReady && !reducedMotion ? 'orbit-active' : ''}`}>
              <div className="ring a" />
              <div className="ring b" />
              <div className="ring c" />
              <div className="core">AI</div>
              <div className="orbiter one" />
              <div className="orbiter two" />
            </div>
            <div className="code-surface">
              <div>
                <label>before</label>
                <pre>{activeTransform.before}</pre>
              </div>
              <div>
                <label>after</label>
                <pre>{activeTransform.after}</pre>
              </div>
            </div>
            <div className="card-metrics">
              <div>
                <span>trust score</span>
                <strong>91%</strong>
              </div>
              <div>
                <span>drift issues</span>
                <strong>12</strong>
              </div>
              <div>
                <span>queued fixes</span>
                <strong>04</strong>
              </div>
            </div>
            <div className="wave-strip" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <ul className="card-events code-font">
              {activeTransform.events.map((event) => (
                <li key={event}>{event}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="connect" className="sleek-connect">
          <div className="connect-copy">
            <p className="sleek-eyebrow">CONNECT YOUR STORE</p>
            <h2>Fast onboarding, clean controls, zero noise.</h2>
            <p>
              Connect once, run the audit in under a minute, and review high-confidence fixes before anything syncs
              back to Shopify.
            </p>
          </div>

          <form className="connect-form" onSubmit={handleConnect} noValidate>
            <label htmlFor="store-url">SHOPIFY STORE URL</label>
            <input
              id="store-url"
              value={storeUrl}
              onChange={(event) => {
                setStoreUrl(event.target.value);
                if (errors.storeUrl) setErrors((prev) => ({ ...prev, storeUrl: undefined }));
              }}
              aria-invalid={!!errors.storeUrl}
              placeholder="https://your-store.myshopify.com"
            />
            {errors.storeUrl ? <p className="form-error">{errors.storeUrl}</p> : null}

            <label htmlFor="token">ADMIN API TOKEN</label>
            <div className="token-row">
              <input
                id="token"
                value={token}
                onChange={(event) => {
                  setToken(event.target.value);
                  if (errors.token) setErrors((prev) => ({ ...prev, token: undefined }));
                }}
                aria-invalid={!!errors.token}
                placeholder="shpat_****************"
                type={showToken ? 'text' : 'password'}
              />
              <button
                className="token-toggle"
                type="button"
                onClick={() => setShowToken((prev) => !prev)}
                aria-label={showToken ? 'Hide token' : 'Show token'}
              >
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.token ? <p className="form-error">{errors.token}</p> : null}

            {submitMessage ? (
              <p className={`form-message ${submitState === 'error' ? 'error' : ''}`}>{submitMessage}</p>
            ) : null}

            <button className="sleek-btn solid big" type="submit" disabled={submitState === 'loading'}>
              {submitState === 'loading' ? 'Connecting...' : 'Connect and run audit'}
            </button>
            <Link href="/login" className="sleek-inline-link center">
              Open dedicated login page
            </Link>
            <Link href="/dashboard" className="sleek-inline-link center">
              Try demo mode instead
            </Link>
          </form>
        </section>

        <section className="sleek-grid">
          <article tabIndex={0}>
            <h3>Signal cleanup</h3>
            <p>Convert weak merchant phrasing into high-clarity product evidence that models can trust.</p>
          </article>
          <article tabIndex={0}>
            <h3>Intent mapping</h3>
            <p>Align prompt-level buyer intent with missing attributes, FAQs, and tag structure.</p>
          </article>
          <article tabIndex={0}>
            <h3>Guardrailed sync</h3>
            <p>Push only verified fixes after policy checks and confidence scoring are complete.</p>
          </article>
        </section>
      </div>
    </MarketingShell>
  );
}
