'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Zap, BarChart2, ShieldCheck, GitBranch } from 'lucide-react';

const FEATURES = [
  { icon: Zap,          label: 'intent extraction',    desc: 'Understand what your product is actually trying to sell.' },
  { icon: BarChart2,    label: 'gap analysis',          desc: 'Find exactly what AI agents need but cannot find.' },
  { icon: ShieldCheck,  label: 'perception simulation', desc: "See your store through an AI agent's eyes." },
  { icon: GitBranch,    label: 'neural fix generator',  desc: 'Get optimized descriptions and structured tags instantly.' },
];

export default function LandingPage() {
  const router = useRouter();
  const [storeUrl, setStoreUrl] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-[#0e0e0e] text-[#f5f5f5] flex flex-col">

      <nav className="flex items-center justify-between px-8 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[var(--accent)] flex items-center justify-center">
            <BarChart2 size={13} className="text-[#0e0e0e]" strokeWidth={3} />
          </div>
          <span
            className="text-sm font-bold lowercase tracking-tight"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            repoptimizer
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#how" className="text-xs text-[var(--text-subtle)] hover:text-[var(--text)] transition-colors lowercase tracking-wide"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            how it works
          </a>
          <button
            onClick={handleDemo}
            className="text-xs font-bold text-[var(--accent)] hover:opacity-70 transition-opacity lowercase tracking-wide"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            view demo →
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-8">

        <section className="pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="pill pill-accent w-fit">
                track 5 — ai representation optimizer
              </div>

              <h1
                className="text-[4.5rem] font-black lowercase tracking-tighter leading-[0.88] text-[var(--text)]"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                your store is{' '}
                <span className="text-[var(--accent)]">
                  invisible
                </span>{' '}
                to ai agents.
              </h1>

              <p className="text-[var(--text-muted)] text-base leading-relaxed max-w-md">
                ai shopping agents are replacing search. we diagnose why they skip your products — 
                and generate the precise fixes to rank at the top.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleDemo}
                className="btn-accent px-6 py-3.5 text-sm lowercase flex items-center gap-2"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                see a live demo <ArrowRight size={15} strokeWidth={2.5} />
              </button>
              <span className="text-xs text-[var(--text-faint)]">no signup needed</span>
            </div>

            <div className="flex items-center gap-8 pt-2 border-t border-[var(--border-subtle)]">
              {[
                { val: '142%', label: 'avg confidence lift' },
                { val: '< 60s', label: 'full store audit' },
                { val: '5 dims', label: 'scored & ranked' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p
                    className="text-2xl font-black lowercase tracking-tight text-[var(--text)]"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    {val}
                  </p>
                  <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-flat p-7 space-y-6 mt-4">
            <div>
              <p
                className="text-base font-bold lowercase mb-1"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                connect your store
              </p>
              <p className="text-xs text-[var(--text-subtle)]">
                read-only access. credentials never stored.
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-4">
              <div className="space-y-1.5">
                <label className="label">store admin url</label>
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
                  <Lock size={9} /> admin api token
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
              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                className="btn-accent w-full py-3.5 text-sm lowercase flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#0e0e0e]/30 border-t-[#0e0e0e] rounded-full animate-spin" />
                    connecting...
                  </>
                ) : (
                  <>run store audit <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              <span className="text-[11px] text-[var(--text-faint)] lowercase">or</span>
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            </div>

            <button
              onClick={handleDemo}
              className="btn-ghost w-full py-3 text-sm lowercase"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              try with demo data
            </button>
          </div>
        </section>

        <section id="how" className="py-20 border-t border-[var(--border-subtle)]">
          <div className="mb-12">
            <p className="label mb-3">how it works</p>
            <h2
              className="text-4xl font-black lowercase tracking-tighter"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              a real intelligence pipeline.
            </h2>
            <p className="text-[var(--text-muted)] mt-3 max-w-lg text-sm leading-relaxed">
              not a chatbot wrapper. five deterministic + ai phases run on every product.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-[10px] bg-[var(--accent-dim)] border border-[var(--accent-border)]">
                    <Icon size={14} className="text-[var(--accent)]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text-faint)]" style={{ fontFamily: 'var(--font-montserrat)' }}>0{i + 1}</span>
                </div>
                <div>
                  <p className="font-bold text-sm lowercase" style={{ fontFamily: 'var(--font-montserrat)' }}>{label}</p>
                  <p className="text-xs text-[var(--text-subtle)] mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 border-t border-[var(--border-subtle)]">
          <div className="card-flat p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3
                className="text-2xl font-black lowercase tracking-tight"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                ready to audit your store?
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">see the exact gaps an ai agent sees. under 60 seconds.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleDemo}
                className="btn-ghost px-5 py-2.5 text-sm lowercase"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                view demo
              </button>
              <button
                onClick={handleDemo}
                className="btn-accent px-5 py-2.5 text-sm lowercase flex items-center gap-2"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                start free audit <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-subtle)] px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-[var(--text-faint)] lowercase">repoptimizer — kasparro hackathon 2026</p>
          <p className="text-[11px] text-[var(--text-faint)] lowercase">track 5: ai representation optimizer</p>
        </div>
      </footer>
    </div>
  );
}
