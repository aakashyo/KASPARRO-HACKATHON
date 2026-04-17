'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Zap, BarChart2, ShieldCheck, GitBranch, Check, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';

const FEATURES = [
  { icon: Zap,          label: 'Understand Your Products', desc: 'We figure out what you are selling and who it is for.' },
  { icon: BarChart2,    label: 'Find What\'s Missing',     desc: 'We spot exact details AI shoppers need but cannot find.' },
  { icon: ShieldCheck,  label: 'See Through AI Eyes',      desc: 'See your store exactly how a smart AI assistant sees it.' },
  { icon: GitBranch,    label: 'Get Instant Fixes',        desc: 'Better product descriptions and tags, ready to copy-paste.' },
];

const DEMO_SCORES = [
  { label: 'Product Quality', score: 45, color: '#ef4444' },
  { label: 'Policy Clarity',  score: 85, color: '#22c55e' },
  { label: 'FAQ Coverage',    score: 40, color: '#ef4444' },
  { label: 'Trust Signals',   score: 70, color: '#f59e0b' },
  { label: 'Tags & Structure', score: 50, color: '#f59e0b' },
];

export default function LandingPage() {
  const router = useRouter();
  const [storeUrl, setStoreUrl] = useState('');
  const [token, setToken]       = useState('');
  const [loading, setLoading]   = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      heroRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      heroRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4" style={{ background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <BarChart2 size={14} className="text-[var(--bg)]" strokeWidth={3} />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-head)' }}>RepOptimizer</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#how" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors hidden sm:block">How it works</a>
          <button onClick={handleDemo} className="btn-accent px-4 py-2 text-[13px] flex items-center gap-1.5" style={{ fontFamily: 'var(--font-head)' }}>
            Try Demo <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      <div ref={heroRef} className="relative overflow-hidden" style={{ background: `radial-gradient(800px circle at var(--mx, 50%) var(--my, 30%), rgba(200,241,53,0.06), transparent 60%)` }}>

        <div className="glow-blob" style={{ width: 500, height: 500, top: -120, left: '15%', background: 'rgba(200,241,53,0.035)' }} />
        <div className="glow-blob" style={{ width: 400, height: 400, top: 100, right: '-5%', background: 'rgba(56,189,248,0.02)' }} />

        <main className="relative z-10 max-w-6xl mx-auto px-8 pt-32 pb-24">
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6 anim-fade-up">
                <div className="pill pill-accent w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  AI Store Health Check
                </div>

                <h1 className="text-[3.25rem] md:text-[3.75rem] font-black leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-head)' }}>
                  AI shoppers can't find your{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-[var(--accent)]">products</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 rounded-sm" style={{ background: 'var(--accent-soft)' }} />
                  </span>
                </h1>

                <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed max-w-md">
                  When someone asks ChatGPT or Perplexity to find a product, your store might get skipped — even if you have the perfect match. We show you exactly why, and fix it in seconds.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 anim-fade-up anim-d2">
                <button onClick={handleDemo} className="btn-accent px-6 py-3.5 text-sm flex items-center gap-2" style={{ fontFamily: 'var(--font-head)' }}>
                  See a Live Demo <ArrowRight size={15} strokeWidth={2.5} />
                </button>
                <span className="text-[13px] text-[var(--text-faint)]">Free &middot; No signup</span>
              </div>

              <div className="flex items-center gap-6 pt-4 anim-fade-up anim-d3">
                {[
                  { icon: Check, text: 'Takes under 60 seconds' },
                  { icon: Check, text: 'Works with any Shopify store' },
                  { icon: Check, text: 'Read-only — we never change data' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--ok-soft)', border: '1px solid var(--ok-border)' }}>
                      <Icon size={9} style={{ color: 'var(--ok)' }} strokeWidth={3} />
                    </div>
                    <span className="text-[12px] text-[var(--text-secondary)]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 anim-fade-up anim-d3">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl" style={{ background: 'linear-gradient(135deg, var(--accent-soft), transparent 50%, var(--info-soft))', filter: 'blur(30px)', opacity: 0.5 }} />

                <div className="relative card-flat rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

                  <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e' }} />
                    </div>
                    <span className="text-[11px] text-[var(--text-faint)] ml-2" style={{ fontFamily: 'var(--font-mono)' }}>store-analysis.repoptimizer.ai</span>
                  </div>

                  <div className="p-5 space-y-4" style={{ background: 'var(--bg-card)' }}>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-head)' }}>Overall AI Readiness</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black" style={{ fontFamily: 'var(--font-head)', color: 'var(--warn)' }}>58</span>
                          <span className="text-sm text-[var(--text-faint)]">/100</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-head)' }}>After Fixes</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black" style={{ fontFamily: 'var(--font-head)', color: 'var(--ok)' }}>92</span>
                          <span className="text-sm text-[var(--text-faint)]">/100</span>
                          <TrendingUp size={14} style={{ color: 'var(--ok)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {DEMO_SCORES.map(({ label, score, color }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-[11px] text-[var(--text-secondary)] w-28 shrink-0" style={{ fontFamily: 'var(--font-head)' }}>{label}</span>
                          <div className="flex-1 progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${score}%`, background: color }} />
                          </div>
                          <span className="text-[12px] font-bold w-8 text-right" style={{ color, fontFamily: 'var(--font-mono)' }}>{score}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                      <AlertTriangle size={12} style={{ color: 'var(--danger)' }} />
                      <span className="text-[11px] text-[var(--text-secondary)]">2 products need urgent attention</span>
                      <ChevronRight size={12} className="ml-auto" style={{ color: 'var(--text-faint)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <section className="relative border-t border-[var(--border)]" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-start">

          <div className="space-y-5">
            <p className="label">Start Your Analysis</p>
            <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-head)' }}>Check your Shopify store</h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Paste your store URL and admin token below. We only read your product data — we never change or store anything.
            </p>

            <form onSubmit={handleStart} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="label">Store Admin URL</label>
                <input
                  type="text"
                  placeholder="your-store.myshopify.com"
                  className="input-field w-full px-4 py-3 text-sm"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  suppressHydrationWarning
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="label flex items-center gap-1.5">
                  <Lock size={10} /> Admin API Token
                </label>
                <input
                  type="password"
                  placeholder="shpat_xxxxxxxxxxxxxxxx"
                  className="input-field w-full px-4 py-3 text-sm mono"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  suppressHydrationWarning
                  required
                />
              </div>
              <button type="submit" disabled={loading} suppressHydrationWarning className="btn-accent w-full py-3.5 text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-head)' }}>
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-[var(--bg)]/30 border-t-[var(--bg)] rounded-full animate-spin" /> Connecting...</>
                ) : (
                  <>Run Store Audit <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[11px] text-[var(--text-faint)]">or</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            <button onClick={handleDemo} className="btn-ghost w-full py-3 text-sm" style={{ fontFamily: 'var(--font-head)' }}>
              Try with demo store data
            </button>
          </div>

          <div className="space-y-4">
            <p className="label">What You Get</p>
            <div className="space-y-3">
              {[
                { emoji: '🔍', title: 'AI Visibility Score', desc: 'A clear 0-100 score showing how visible your store is to AI shopping assistants like ChatGPT and Perplexity.' },
                { emoji: '⚠️', title: 'Issue Detection', desc: 'We find missing product details, unclear descriptions, and structural problems that make AI shoppers skip your products.' },
                { emoji: '✨', title: 'One-Click Fixes', desc: 'Get improved descriptions, better tags, and structured data — all ready to paste directly into your Shopify admin.' },
                { emoji: '📊', title: 'Before & After Comparison', desc: 'See exactly how your AI visibility score improves after applying our suggested fixes.' },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="card p-4 flex gap-4 cursor-default">
                  <span className="text-2xl mt-0.5">{emoji}</span>
                  <div>
                    <p className="font-semibold text-sm mb-0.5" style={{ fontFamily: 'var(--font-head)' }}>{title}</p>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section id="how" className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="text-center mb-14">
            <p className="label mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ fontFamily: 'var(--font-head)' }}>
              Four simple steps. Zero technical knowledge needed.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="card p-6 flex flex-col gap-4 group">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
                    <Icon size={18} style={{ color: 'var(--accent)' }} strokeWidth={2} />
                  </div>
                  <span className="text-xs font-bold text-[var(--text-faint)]" style={{ fontFamily: 'var(--font-head)' }}>0{i + 1}</span>
                </div>
                <div>
                  <p className="font-bold text-[14px] mb-1" style={{ fontFamily: 'var(--font-head)' }}>{label}</p>
                  <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="card p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
            <div className="glow-blob" style={{ width: 300, height: 300, top: -100, right: -50, background: 'var(--accent-glow)' }} />
            <div className="relative z-10">
              <h3 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'var(--font-head)' }}>
                Want to see it in action?
              </h3>
              <p className="text-[var(--text-secondary)] mt-1 text-sm">Try the demo — no sign up, no credit card, takes under a minute.</p>
            </div>
            <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
              <button onClick={handleDemo} className="btn-accent px-6 py-3 text-sm flex items-center gap-2" style={{ fontFamily: 'var(--font-head)' }}>
                Start Free Demo <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border-subtle)] px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-[var(--text-faint)]">RepOptimizer — Kasparro Hackathon 2026</p>
          <p className="text-[11px] text-[var(--text-faint)]">Track 5: AI Representation Optimizer</p>
        </div>
      </footer>
    </div>
  );
}
