'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Command, Sparkles } from 'lucide-react';

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
    <div style={{ background: '#09090b', color: '#fafafa', minHeight: '100vh', fontFamily: 'var(--font-sans)', selection: { background: '#c8f135', color: '#09090b' } }}>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 60, background: 'rgba(9,9,11,0.6)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>RepOptimizer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button onClick={handleDemo}
            style={{ background: 'transparent', color: '#a1a1aa', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fafafa')}
            onMouseLeave={e => (e.currentTarget.style.color = '#a1a1aa')}>
            View Demo Report
          </button>
        </div>
      </nav>

      <div ref={heroRef} style={{ paddingTop: 140, paddingBottom: 100, textAlign: 'center', maxWidth: 860, margin: '0 auto', padding: '140px 32px 80px', position: 'relative', background: 'radial-gradient(800px circle at var(--mx, 50%) var(--my, 40%), rgba(200,241,53,0.03), transparent 60%)' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40, textAlign: 'left' }}>
          
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', marginBottom: 24 }}>
              <Sparkles size={12} fill="#c8f135" color="#c8f135" />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#e4e4e7', fontFamily: 'var(--font-sans)' }}>AI Perception Intelligence</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20, color: '#fafafa' }}>
              Optimize your store for <span style={{ color: '#c8f135' }}>AI shoppers.</span>
            </h1>

            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#a1a1aa', maxWidth: 440, marginBottom: 32, fontWeight: 400 }}>
              AI agents like ChatGPT are replacing search. We analyze your store and fix the gaps making your products invisible to them.
            </p>
            
            <div style={{ display: 'flex', gap: 48 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 4 }}>+142%</div>
                <div style={{ fontSize: 12, color: '#71717a' }}>Visibility Increase</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 4 }}>{'<'}60s</div>
                <div style={{ fontSize: 12, color: '#71717a' }}>Audit Time</div>
              </div>
            </div>
            
          </div>

          <div style={{ flex: '1 1 340px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative' }}>
             <div style={{ position: 'absolute', top: -1, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,241,53,0.5), transparent)' }} />
             
             <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fafafa', marginBottom: 6, letterSpacing: '-0.01em' }}>Connect your store</h3>
             <p style={{ fontSize: 13, color: '#71717a', marginBottom: 24 }}>Get a complete diagnostic report instantly.</p>

             <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#a1a1aa', marginBottom: 6 }}>Shopify URL</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="store.myshopify.com"
                    value={storeUrl} onChange={e => setStoreUrl(e.target.value)}
                    required
                    style={{ width: '100%', background: '#09090b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#fafafa', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(200,241,53,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#a1a1aa', marginBottom: 6 }}>
                  <Lock size={12} /> Admin API Token
                </label>
                <input type="password" placeholder="shpat_..."
                  value={token} onChange={e => setToken(e.target.value)}
                  required
                  style={{ width: '100%', background: '#09090b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#fafafa', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'var(--font-mono)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(200,241,53,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', background: '#fafafa', color: '#09090b', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
                {loading ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid #09090b', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Analyzing...</> : <>Run Analysis <ArrowRight size={14} /></>}
              </button>

              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: '#71717a' }}>or </span>
                <button type="button" onClick={handleDemo} style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#c8f135', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}>
                  use demo data
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 32px' }}>
         <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#c8f135', marginBottom: 20 }}>The Process</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
               {[
                 { num: '01', title: 'Connect Data', desc: 'Secure read-only API access fetches your catalog.' },
                 { num: '02', title: 'AI Simulation', desc: 'We test products via shopping LLMs to grade visibility.' },
                 { num: '03', title: 'Gap Detection', desc: 'Identifies missing context and misinterpretations.' },
                 { num: '04', title: 'Neural Fixes', desc: 'Generates ready-to-use descriptions & tags.' }
               ].map(step => (
                 <div key={step.num}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#52525b', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>{step.num}</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#fafafa', marginBottom: 6 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5 }}>{step.desc}</div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, color: '#71717a' }}>Kasparro Hackathon 2026</p>
        <p style={{ fontSize: 13, color: '#71717a' }}>Track 5: RepOptimizer</p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
