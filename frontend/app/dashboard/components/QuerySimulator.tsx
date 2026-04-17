'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';

const EXAMPLES = [
  'best moisturizer for dry skin under ₹1500',
  'vitamin C serum for oily skin, no fragrance',
  'SPF 50 sunscreen for outdoor sports',
];

export default function QuerySimulator({ products }: { products: any[] }) {
  const [query, setQuery]     = useState('');
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
        match_reason: i === 0 ? 'Strong match — clear attributes and description.' : 'Partial match — some details were missing.',
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
    <div style={{ background: '#0e0e14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15, color: '#f0f0f0', marginBottom: 6 }}>
          Test How AI Would Search Your Store
        </p>
        <p style={{ fontSize: 13, color: 'rgba(240,240,240,0.45)', lineHeight: 1.6 }}>
          Type any shopping question. See which products an AI assistant would recommend — and which it would skip.
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: 14, color: 'rgba(240,240,240,0.3)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="e.g. best moisturizer for dry skin under ₹2000"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && simulate()}
            suppressHydrationWarning
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 120px 11px 40px', fontSize: 13, color: '#f0f0f0', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(200,241,53,0.4)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          <button
            onClick={simulate}
            disabled={!query.trim() || loading}
            suppressHydrationWarning
            style={{ position: 'absolute', right: 6, background: query.trim() && !loading ? '#c8f135' : 'rgba(200,241,53,0.15)', color: query.trim() && !loading ? '#08080c' : 'rgba(200,241,53,0.5)', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: query.trim() && !loading ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-head)', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s' }}
          >
            {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Simulate</span><ArrowRight size={12} /></>}
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {EXAMPLES.map(q => (
            <button key={q} onClick={() => setQuery(q)}
              style={{ fontSize: 11, padding: '5px 12px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,240,240,0.4)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-head)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,241,53,0.3)'; e.currentTarget.style.color = '#c8f135'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(240,240,240,0.4)'; }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fadeIn 0.3s ease' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#22c55e', fontFamily: 'var(--font-head)' }}>AI Would Recommend</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.top.map((p: any) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,240,240,0.3)', width: 20, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>#{p.rank}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0', fontFamily: 'var(--font-head)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{p.title}</p>
                    <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.match_reason}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', flexShrink: 0, fontFamily: 'var(--font-head)' }}>{p.match_score}%</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ef4444', fontFamily: 'var(--font-head)' }}>AI Would Skip</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.rejected.map((p: any) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', opacity: 0.6 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0', fontFamily: 'var(--font-head)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{p.title}</p>
                    <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.rejection_reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.25)', marginTop: 10, lineHeight: 1.5 }}>
              These products need better descriptions before AI will recommend them.
            </p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
