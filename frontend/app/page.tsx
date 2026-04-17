'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, ArrowUpRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [storeUrl, setStoreUrl] = useState('');
  const [token, setToken]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [count, setCount]       = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = 58;
    let n = 0;
    const timer = setInterval(() => {
      n += 2;
      if (n >= target) { setCount(target); clearInterval(timer); }
      else setCount(n);
    }, 28);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('shopify_url', storeUrl);
    localStorage.setItem('shopify_token', token);
    localStorage.removeItem('demo_mode');
    setTimeout(() => router.push('/dashboard'), 700);
  };

  const handleDemo = () => {
    localStorage.setItem('demo_mode', 'true');
    router.push('/dashboard');
  };

  return (
    <div style={{ background: '#08080c', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 60, background: 'rgba(8,8,12,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#08080c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em' }}>RepOptimizer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#connect" style={{ fontSize: 13, color: 'rgba(240,240,240,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f0')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,240,240,0.5)')}>
            Connect Store
          </a>
          <button onClick={handleDemo}
            style={{ background: '#c8f135', color: '#08080c', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-head)', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Try Demo <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      <div ref={heroRef} style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center', maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px', position: 'relative', background: 'radial-gradient(800px circle at var(--mx, 50%) var(--my, 40%), rgba(200,241,53,0.04), transparent 60%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(200,241,53,0.25)', background: 'rgba(200,241,53,0.06)', marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8f135', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#c8f135', fontFamily: 'var(--font-head)', letterSpacing: '0.04em' }}>AI STORE HEALTH CHECK</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24, color: '#f0f0f0' }}>
          Your store scores <span style={{ color: '#c8f135' }}>{count}/100</span><br />
          for AI visibility.
        </h1>

        <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(240,240,240,0.55)', maxWidth: 520, margin: '0 auto 40px', fontWeight: 400 }}>
          When someone asks an AI assistant to find a product, your store might get skipped — even with the perfect match. We find exactly why and fix it in seconds.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleDemo}
            style={{ background: '#c8f135', color: '#08080c', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-head)', display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em', boxShadow: '0 0 32px rgba(200,241,53,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 40px rgba(200,241,53,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(200,241,53,0.2)'; }}>
            Check My Store Free <ArrowRight size={16} />
          </button>
          <button onClick={handleDemo}
            style={{ background: 'transparent', color: 'rgba(240,240,240,0.55)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-head)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f0f0f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(240,240,240,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
            See demo first
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(240,240,240,0.3)', marginTop: 16 }}>Free · No signup · Takes 60 seconds</p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px 100px' }}>
        <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#0e0e14' }}>
          <div style={{ position: 'absolute', inset: '-1px', borderRadius: 21, background: 'linear-gradient(135deg, rgba(200,241,53,0.12), transparent 40%, rgba(56,189,248,0.06))', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginLeft: 8, fontFamily: 'var(--font-mono)' }}>repoptimizer.ai — store analysis</span>
          </div>

          <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0 }}>
            <div style={{ paddingRight: 36 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', marginBottom: 12, fontFamily: 'var(--font-head)' }}>Before RepOptimizer</p>
              <div style={{ fontSize: 64, fontWeight: 900, fontFamily: 'var(--font-head)', color: '#ef4444', lineHeight: 1, marginBottom: 6 }}>58</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>out of 100</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { l: 'Product Quality', v: 45, c: '#ef4444' },
                  { l: 'FAQ Coverage',    v: 40, c: '#ef4444' },
                  { l: 'Tag Structure',   v: 50, c: '#f59e0b' },
                ].map(({ l, v, c }) => (
                  <div key={l}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{l}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: c, fontFamily: 'var(--font-mono)' }}>{v}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ height: '100%', borderRadius: 99, background: c, width: `${v}%`, opacity: 0.7 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ paddingLeft: 36 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(200,241,53,0.7)', marginBottom: 12, fontFamily: 'var(--font-head)' }}>After RepOptimizer</p>
              <div style={{ fontSize: 64, fontWeight: 900, fontFamily: 'var(--font-head)', color: '#22c55e', lineHeight: 1, marginBottom: 6 }}>92</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>out of 100</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { l: 'Product Quality', v: 90, c: '#22c55e' },
                  { l: 'FAQ Coverage',    v: 88, c: '#22c55e' },
                  { l: 'Tag Structure',   v: 95, c: '#22c55e' },
                ].map(({ l, v, c }) => (
                  <div key={l}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{l}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: c, fontFamily: 'var(--font-mono)' }}>{v}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ height: '100%', borderRadius: 99, background: c, width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px 32px', display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap', background: 'rgba(255,255,255,0.015)' }}>
        {[
          { n: '+142%', l: 'Avg. AI visibility increase' },
          { n: '< 60s', l: 'Full store audit time' },
          { n: '5 dims', l: 'Scored & diagnosed' },
          { n: '100%', l: 'Free to try' },
        ].map(({ n, l }) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, fontFamily: 'var(--font-head)', color: '#f0f0f0', letterSpacing: '-0.02em' }}>{n}</div>
            <div style={{ fontSize: 12, color: 'rgba(240,240,240,0.4)', marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      <div id="connect" style={{ maxWidth: 760, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 900, letterSpacing: '-0.025em', marginBottom: 12, color: '#f0f0f0' }}>
            Connect your store
          </h2>
          <p style={{ color: 'rgba(240,240,240,0.45)', fontSize: 15 }}>Read-only access. We never change or store your data.</p>
        </div>

        <div style={{ background: '#0e0e14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 40px' }}>
          <form onSubmit={handleStart}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(240,240,240,0.4)', marginBottom: 8, fontFamily: 'var(--font-head)' }}>Store Admin URL</label>
                <input type="text" placeholder="your-store.myshopify.com"
                  value={storeUrl} onChange={e => setStoreUrl(e.target.value)}
                  suppressHydrationWarning required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f0f0f0', outline: 'none', fontFamily: 'var(--font-sans)', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(200,241,53,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(240,240,240,0.4)', marginBottom: 8, fontFamily: 'var(--font-head)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Lock size={9} /> Admin API Token
                </label>
                <input type="password" placeholder="shpat_xxxxxxxxxxxx"
                  value={token} onChange={e => setToken(e.target.value)}
                  suppressHydrationWarning required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f0f0f0', outline: 'none', fontFamily: 'var(--font-mono)', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(200,241,53,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={loading} suppressHydrationWarning
                style={{ flex: 1, background: '#c8f135', color: '#08080c', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-head)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.6 : 1, transition: 'all 0.2s' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                {loading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(8,8,12,0.3)', borderTop: '2px solid #08080c', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Connecting...</> : <>Run Store Audit <ArrowRight size={15} /></>}
              </button>
              <button type="button" onClick={handleDemo}
                style={{ background: 'transparent', color: 'rgba(240,240,240,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-head)', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f0f0f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(240,240,240,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                Try demo
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 12, color: 'rgba(240,240,240,0.2)' }}>RepOptimizer — Kasparro Hackathon 2026</p>
        <p style={{ fontSize: 12, color: 'rgba(240,240,240,0.2)' }}>Track 5: AI Representation Optimizer</p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
