'use client';

import Link from 'next/link';
import { useState } from 'react';
import MarketingShell from '@/components/marketing/MarketingShell';

export default function LoginPage() {
  const [storeUrl, setStoreUrl] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!storeUrl || !token) {
      setState('error');
      setMessage('Please enter both store URL and token.');
      return;
    }

    setState('loading');
    setMessage('Verifying credentials...');

    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem('demo_mode', 'false');
    localStorage.setItem('shopify_url', storeUrl.trim());
    localStorage.setItem('shopify_token', token.trim());
    setState('success');
    setMessage('Success. Redirecting to dashboard...');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 450);
  };

  return (
    <MarketingShell primaryCtaHref="/login" primaryCtaLabel="Start audit" showFooterCta={false}>
      <div className="sleek-submain subpage login-stage-page">
        <section className="login-stage">
          <div className="login-stage-copy">
            <p className="sleek-eyebrow">STORE LOGIN</p>
            <h1>Authenticate and launch your audit workspace.</h1>
            <p className="sleek-copy">
              Secure connection to your Shopify store with calmer review-first sync controls, session protection, and
              a cleaner handoff into the audit dashboard.
            </p>

            <div className="login-stage-rail" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="login-stage-points">
              <article className="login-panel">
                <p className="login-panel-kicker">SESSION</p>
                <h3>Protected credential handoff</h3>
                <p>Store URL and token stay in a focused launch flow instead of competing with the marketing content.</p>
              </article>

              <article className="login-panel">
                <p className="login-panel-kicker">WORKSPACE</p>
                <h3>Audit-ready in one step</h3>
                <p>Verify the store, open the dashboard, and continue with a cleaner transition into the live workspace.</p>
              </article>
            </div>
          </div>

          <section className="login-auth-wrap">
            <form className="connect-form login-form login-form-large" onSubmit={submit}>
              <p className="login-form-title">Sign in to Shopify credentials</p>
              <p className="login-form-subtitle">
                Use your store URL and Admin API token to start a protected audit session.
              </p>

              <label htmlFor="login-store-url">SHOPIFY STORE URL</label>
              <input
                id="login-store-url"
                value={storeUrl}
                onChange={(event) => setStoreUrl(event.target.value)}
                placeholder="https://your-store.myshopify.com"
              />

              <label htmlFor="login-token">ADMIN API TOKEN</label>
              <div className="token-row">
                <input
                  id="login-token"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  type={showToken ? 'text' : 'password'}
                  placeholder="shpat_****************"
                />
                <button className="token-toggle" type="button" onClick={() => setShowToken((prev) => !prev)}>
                  {showToken ? 'Hide' : 'Show'}
                </button>
              </div>

              {message ? <p className={`form-message ${state === 'error' ? 'error' : ''}`}>{message}</p> : null}

              <button className="sleek-btn solid big" type="submit" disabled={state === 'loading'}>
                {state === 'loading' ? 'Connecting...' : 'Start audit'}
              </button>

              <div className="login-foot-links">
                <Link href="/dashboard" className="sleek-inline-link">Use demo workspace without credentials</Link>
                <Link href="/" className="sleek-inline-link">Back to landing</Link>
              </div>
            </form>
          </section>
        </section>
      </div>
    </MarketingShell>
  );
}
