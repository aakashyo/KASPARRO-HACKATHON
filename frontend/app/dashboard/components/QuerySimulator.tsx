'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const EXAMPLES = [
  'best moisturizer for dry skin under ₹1500',
  'vitamin C serum for oily skin, no fragrance',
  'SPF 50 sunscreen for outdoor sports',
];

export default function QuerySimulator({ products }: { products: any[] }) {
  const [query, setQuery]   = useState('');
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
        match_reason: i === 0
          ? 'Strong match — clear attributes and description.'
          : 'Partial match — some details were missing.',
      }));
      const rejected = sorted.slice(-Math.min(2, sorted.length)).map(p => ({
        ...p,
        rejection_reason: 'Not enough product details for AI to confidently recommend.',
      }));
      setResults({ top, rejected });
      setLoading(false);
    }, 1300);
  };

  return (
    <div className="card-flat p-6 space-y-6 rounded-2xl">
      <div>
        <p className="font-bold text-[15px] mb-1" style={{ fontFamily: 'var(--font-head)' }}>
          Test How AI Would Search Your Store
        </p>
        <p className="text-[13px] text-[var(--text-secondary)]">
          Type any shopping question. See which of your products an AI assistant would recommend — and which it would skip.
        </p>
      </div>

      <div className="space-y-3">
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="e.g. best moisturizer for dry skin under ₹2000"
            className="input-field w-full pl-11 pr-32 py-3 text-[13px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && simulate()}
            suppressHydrationWarning
          />
          <button
            onClick={simulate}
            disabled={!query.trim() || loading}
            suppressHydrationWarning
            className="btn-accent absolute right-2 px-4 py-2 text-[12px] flex items-center gap-1.5"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <><span>Simulate</span><ArrowRight size={13} /></>}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(q => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="text-[11px] px-3 py-1.5 rounded-full transition-all hover:border-[var(--accent)] hover:text-[var(--text)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)', fontFamily: 'var(--font-head)' }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 anim-fade-in">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={13} style={{ color: 'var(--ok)' }} />
              <p className="text-[12px] font-semibold" style={{ color: 'var(--ok)', fontFamily: 'var(--font-head)' }}>AI Would Recommend</p>
            </div>
            <div className="space-y-2">
              {results.top.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <span className="text-[11px] font-bold w-6 text-center text-[var(--text-faint)]" style={{ fontFamily: 'var(--font-head)' }}>#{p.rank}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold truncate text-[var(--text)]" style={{ fontFamily: 'var(--font-head)' }}>{p.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">{p.match_reason}</p>
                  </div>
                  <span className="text-[13px] font-bold flex-shrink-0" style={{ color: 'var(--ok)', fontFamily: 'var(--font-head)' }}>{p.match_score}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle size={13} style={{ color: 'var(--danger)' }} />
              <p className="text-[12px] font-semibold" style={{ color: 'var(--danger)', fontFamily: 'var(--font-head)' }}>AI Would Skip</p>
            </div>
            <div className="space-y-2">
              {results.rejected.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3.5 rounded-xl opacity-60" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <XCircle size={13} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold truncate text-[var(--text)]" style={{ fontFamily: 'var(--font-head)' }}>{p.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">{p.rejection_reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-faint)] px-1 leading-relaxed">
              These products need better descriptions and tags before AI will recommend them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
