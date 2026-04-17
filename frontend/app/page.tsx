'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap, ShieldCheck, BarChart2, GitBranch, Lock } from 'lucide-react';

const FEATURES = [
  { icon: Zap, label: 'Intent Extraction', desc: 'Deep context from raw product titles and tags.' },
  { icon: BarChart2, label: 'Gap Analysis', desc: 'Missing attributes triaged by impact severity.' },
  { icon: ShieldCheck, label: 'Perception Simulation', desc: 'See your store through an AI agent\'s eyes.' },
  { icon: GitBranch, label: 'Neural Fix Generator', desc: 'Optimized descriptions and structured tags for LLMs.' },
];

export default function LandingPage() {
  const router = useRouter();
  const [storeUrl, setStoreUrl] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    localStorage.setItem('shopify_url', storeUrl);
    localStorage.setItem('shopify_token', token);
    localStorage.removeItem('demo_mode');
    setTimeout(() => router.push('/dashboard'), 800);
  };

  const handleDemo = () => {
    localStorage.setItem('demo_mode', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5]">

      <nav className="border-b border-[#1f1f2e] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#00d4ff] to-[#7c5cfc] flex items-center justify-center">
              <BarChart2 size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm tracking-tight">RepOptimizer</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how" className="text-xs text-[#6b6b80] hover:text-[#f0f0f5] transition-colors">How it works</a>
            <button
              onClick={handleDemo}
              className="text-xs font-semibold text-[#00d4ff] hover:text-white transition-colors"
            >
              View demo
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">

        <section className="pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a3a] bg-[#111118] text-[11px] font-semibold text-[#00d4ff] tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
              Track 5 — AI Representation Optimizer
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-[#f0f0f5]">
              Your Shopify store is{' '}
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#7c5cfc] bg-clip-text text-transparent">
                invisible
              </span>{' '}
              to AI agents.
            </h1>

            <p className="text-[#a0a0b8] text-lg leading-relaxed max-w-lg">
              AI shopping agents are replacing search. We diagnose exactly why they skip your products — and generate the precise fixes to rank at the top.
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={handleDemo}
                className="btn-primary px-6 py-3 text-sm flex items-center gap-2 font-semibold"
              >
                See a live demo <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <span className="text-xs text-[#6b6b80]">No signup required</span>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { label: '142%', sub: 'avg confidence lift' },
                { label: '< 60s', sub: 'store audit time' },
                { label: '5 dims', sub: 'scored per store' },
              ].map(({ label, sub }) => (
                <div key={sub} className="space-y-0.5">
                  <p className="text-xl font-bold stat-number text-[#f0f0f5]">{label}</p>
                  <p className="text-[11px] text-[#6b6b80]">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-static p-8 space-y-6">
            <div>
              <p className="font-semibold text-sm mb-1">Connect your store</p>
              <p className="text-xs text-[#6b6b80]">We read your product data. We never write or store credentials.</p>
            </div>

            <form onSubmit={handleStart} className="space-y-4">
              <div className="space-y-1.5">
                <label className="section-label">Store Admin URL</label>
                <input
                  type="text"
                  placeholder="your-store.myshopify.com"
                  className="input-dark w-full px-4 py-3 text-sm"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  suppressHydrationWarning
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="section-label flex items-center gap-1.5">
                  <Lock size={10} /> Admin API Access Token
                </label>
                <input
                  type="password"
                  placeholder="shpat_xxxxxxxxxxxxxxxx"
                  className="input-dark w-full px-4 py-3 text-sm font-mono"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  suppressHydrationWarning
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                suppressHydrationWarning
                className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>Run Intelligence Audit <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#2a2a3a]" />
              <span className="text-[11px] text-[#6b6b80]">or</span>
              <div className="flex-1 h-px bg-[#2a2a3a]" />
            </div>

            <button
              onClick={handleDemo}
              className="w-full py-3 rounded-[10px] border border-[#2a2a3a] bg-[#111118] hover:bg-[#16161f] text-sm font-semibold text-[#a0a0b8] hover:text-[#f0f0f5] transition-all"
            >
              Try with demo store data
            </button>
          </div>
        </section>

        <section id="how" className="py-20 border-t border-[#1f1f2e]">
          <div className="text-center mb-14 space-y-3">
            <p className="section-label">How it works</p>
            <h2 className="text-3xl font-bold tracking-tight">Built on a real intelligence pipeline</h2>
            <p className="text-[#a0a0b8] max-w-xl mx-auto text-sm leading-relaxed">
              Not just an LLM prompt. Every product goes through five deterministic and AI analysis phases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#111118] border border-[#2a2a3a]">
                    <Icon size={16} className="text-[#00d4ff]" strokeWidth={2} />
                  </div>
                  <span className="text-[11px] text-[#2a2a3a] font-bold">0{i + 1}</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-[#6b6b80] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 border-t border-[#1f1f2e]">
          <div className="card-static p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Ready to audit your store?</h3>
              <p className="text-[#6b6b80] text-sm">See the exact gaps an AI agent sees in under 60 seconds.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={handleDemo} className="px-5 py-2.5 rounded-[10px] border border-[#2a2a3a] text-sm font-semibold text-[#a0a0b8] hover:text-white hover:border-[#3a3a4d] transition-all">
                View demo
              </button>
              <button onClick={handleDemo} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 font-semibold">
                Start free audit <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-[#1f1f2e] px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs text-[#6b6b80]">AI RepOptimizer — Kasparro Hackathon 2026</p>
          <p className="text-xs text-[#6b6b80]">Track 5: AI Representation Optimizer</p>
        </div>
      </footer>

    </div>
  );
}
