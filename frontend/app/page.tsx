'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Sparkles, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

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

  const features = [
    { icon: <Zap size={16} color="#c8f135" />, title: 'Instant Rule Scan', desc: 'Flags gaps in seconds before the AI activates.' },
    { icon: <BarChart2 size={16} color="#38bdf8" />, title: 'AI Perception Score', desc: 'Grades how confidently an LLM recommends your product.' },
    { icon: <ShieldCheck size={16} color="#22c55e" />, title: 'Neural Fixes', desc: 'Auto-generates optimized copy and structured tags.' },
    { icon: <Sparkles size={16} color="#a78bfa" />, title: 'Push to Shopify', desc: 'Apply fixes directly to your store in one click.' },
  ];

  return (
    <div style={{ background: '#09090b', color: '#fafafa', minHeight: '100vh', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 60, background: 'rgba(9,9,11,0.7)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>RepOptimizer</span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.2)', color: '#c8f135', fontWeight: 700 }}>PRO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={handleDemo}
            suppressHydrationWarning
            style={{ background: 'transparent', color: '#a1a1aa', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '6px 14px', borderRadius: 8, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fafafa')}
            onMouseLeave={e => (e.currentTarget.style.color = '#a1a1aa')}>
            View Demo
          </button>
          <button onClick={handleDemo}
            suppressHydrationWarning
            style={{ background: '#fafafa', color: '#09090b', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '7px 18px', borderRadius: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            Try Demo
          </button>
        </div>
      </nav>

      <div ref={heroRef} style={{ paddingTop: 120, paddingBottom: 80, maxWidth: 1100, margin: '0 auto', padding: '120px 32px 80px', position: 'relative', background: 'radial-gradient(900px circle at var(--mx, 50%) var(--my, 40%), rgba(200,241,53,0.04), transparent 60%)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', marginBottom: 28, display: 'inline-flex' }}>
          <Sparkles size={12} fill="#c8f135" color="#c8f135" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e4e4e7' }}>Kasparro Hackathon 2026 &mdash; Track 5</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 48, justifyContent: 'space-between' }}>

          <div style={{ flex: '1 1 420px', maxWidth: 520 }}>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 20, color: '#fafafa' }}>
              Make your store<br />visible to <span style={{ color: '#c8f135' }}>AI shoppers.</span>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: '#71717a', maxWidth: 440, marginBottom: 36 }}>
              AI agents like ChatGPT are replacing search bars. We analyze your Shopify catalog and automatically fix the data gaps that make your products invisible to them.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 40 }}>
              {features.map(f => (
                <div key={f.title} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {f.icon}
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7' }}>{f.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#52525b', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 40 }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 4 }}>+142%</div>
                <div style={{ fontSize: 12, color: '#52525b' }}>Avg. Visibility Gain</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 4 }}>&lt;60s</div>
                <div style={{ fontSize: 12, color: '#52525b' }}>Full Audit Time</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 4 }}>250</div>
                <div style={{ fontSize: 12, color: '#52525b' }}>Products Per Run</div>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 320px', maxWidth: 380, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: 28, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -1, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,241,53,0.6), transparent)' }} />

            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fafafa', marginBottom: 6, letterSpacing: '-0.01em' }}>Connect your store</h3>
            <p style={{ fontSize: 13, color: '#52525b', marginBottom: 24 }}>Get a complete diagnostic report in under a minute.</p>

            <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#71717a', marginBottom: 6 }}>Shopify URL</label>
                <input type="text" placeholder="store.myshopify.com"
                  suppressHydrationWarning
                  value={storeUrl} onChange={e => setStoreUrl(e.target.value)}
                  required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fafafa', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(200,241,53,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#71717a', marginBottom: 6 }}>
                  <Lock size={11} /> Admin API Token
                </label>
                <input type="password" placeholder="shpat_..."
                  suppressHydrationWarning
                  value={token} onChange={e => setToken(e.target.value)}
                  required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fafafa', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'var(--font-mono)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(200,241,53,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>

              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={13} color="#22c55e" />
                <span style={{ fontSize: 11, color: '#52525b' }}>Read-only access. We never modify your store without permission.</span>
              </div>

              <button type="submit" disabled={loading}
                suppressHydrationWarning
                style={{ width: '100%', background: '#fafafa', color: '#09090b', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, transition: 'all 0.2s' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
                {loading ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.15)', borderTop: '2px solid #09090b', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Analyzing...</> : <>Run Free Audit <ArrowRight size={14} /></>}
              </button>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: '#3f3f46' }}>or </span>
                <button type="button" onClick={handleDemo} suppressHydrationWarning style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#c8f135', cursor: 'pointer', fontWeight: 600 }}>
                  explore with demo data
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>How it works</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {[
              { num: '01', title: 'Connect Data', desc: 'Secure read-only API access pulls your full catalog.' },
              { num: '02', title: 'AI Simulation', desc: 'Products are tested against shopping LLMs to grade visibility.' },
              { num: '03', title: 'Gap Detection', desc: 'Missing context and misinterpretations are identified precisely.' },
              { num: '04', title: 'Neural Fixes', desc: 'Optimized descriptions, tags, and FAQs are generated instantly.' },
              { num: '05', title: 'Push to Store', desc: 'Apply all fixes to your live Shopify store in one click.' },
            ].map(step => (
              <div key={step.num}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#27272a', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>{step.num}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fafafa', marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#52525b', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 12, color: '#3f3f46' }}>Kasparro Hackathon 2026 &mdash; Track 5: RepOptimizer</p>
        <p style={{ fontSize: 12, color: '#3f3f46' }}>Built with Next.js, FastAPI, Groq &amp; Llama 3</p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
}
