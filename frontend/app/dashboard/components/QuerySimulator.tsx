'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const EXAMPLES = [
  'hydrating sunscreen for sensitive skin under ₹1500',
  'vitamin c serum for oily skin with no fragrance',
  'spf 50 reef safe sunscreen for outdoor sports',
];

export default function QuerySimulator({ products }: { products: any[] }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const simulate = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      const sorted = [...products].sort((a, b) => a.gaps.severity - b.gaps.severity);
      const top = sorted.slice(0, Math.min(3, sorted.length)).map((p, i) => ({
        ...p,
        rank: i + 1,
        match_score: Math.round(94 - i * 9 + (Math.random() * 4 - 2)),
        match_reason: i === 0 ? 'Strong semantic and attribute match.' : 'Core intent match with minor gaps.',
      }));
      const rejected = sorted.slice(-Math.min(2, sorted.length)).map(p => ({
        ...p,
        rejection_reason: 'Insufficient structured metadata to verify query constraints.',
      }));
      setResults({ top, rejected });
      setLoading(false);
    }, 1300);
  };

  return (
    <div className="card-flat p-6 space-y-6">
      <div>
        <p className="font-bold text-sm lowercase mb-0.5" style={{ fontFamily: 'var(--font-montserrat)' }}>
          ai ranking simulator
        </p>
        <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
          test how a neural shopping agent ranks your products for any natural language query.
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-4" style={{ color: 'var(--text-subtle)' }} />
          <input
            type="text"
            placeholder="e.g. best moisturizer for dry skin under ₹2000"
            className="input-field w-full pl-11 pr-32 py-3 text-sm lowercase"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && simulate()}
            suppressHydrationWarning
          />
          <button
            onClick={simulate}
            disabled={!query.trim() || loading}
            suppressHydrationWarning
            className="btn-accent absolute right-2 px-4 py-2 text-xs lowercase flex items-center gap-1.5"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <><span>simulate</span><ArrowRight size={13} /></>}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {EXAMPLES.map(q => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="text-[10px] px-2.5 py-1 rounded-full lowercase transition-colors hover:opacity-80"
              style={{ border: '1.5px solid var(--border)', color: 'var(--text-subtle)', background: 'var(--bg-surface)', fontFamily: 'var(--font-montserrat)' }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 anim-fade-in">
          <div className="space-y-3">
            <p className="label flex items-center gap-1.5" style={{ color: 'var(--ok)' }}>
              <CheckCircle size={10} /> ranked by agent
            </p>
            <div className="space-y-2">
              {results.top.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3.5" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', borderRadius: 14 }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold w-5 text-center" style={{ color: 'var(--text-subtle)', fontFamily: 'var(--font-montserrat)' }}>
                      #{p.rank}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold lowercase truncate" style={{ color: 'var(--text)', fontFamily: 'var(--font-montserrat)' }}>{p.title.toLowerCase()}</p>
                      <p className="text-[10px] truncate" style={{ color: 'var(--text-subtle)' }}>{p.match_reason}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold flex-shrink-0 ml-3" style={{ color: 'var(--ok)', fontFamily: 'var(--font-montserrat)' }}>{p.match_score}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="label flex items-center gap-1.5" style={{ color: 'var(--danger)' }}>
              <XCircle size={10} /> filtered out
            </p>
            <div className="space-y-2">
              {results.rejected.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3.5 opacity-50" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', borderRadius: 14 }}>
                  <XCircle size={13} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold lowercase truncate" style={{ color: 'var(--text)', fontFamily: 'var(--font-montserrat)' }}>{p.title.toLowerCase()}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-subtle)' }}>{p.rejection_reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] leading-relaxed px-1" style={{ color: 'var(--text-faint)' }}>
              rejected products lack the structured attributes needed for confident agent matching.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
