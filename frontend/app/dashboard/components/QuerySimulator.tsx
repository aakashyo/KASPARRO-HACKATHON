'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, Loader2, Bot, CircleDollarSign, Fingerprint, Gift } from 'lucide-react';
import { simulateQuery } from '@/lib/api';

const EXAMPLES = [
  'best moisturizer for dry skin under ₹1500',
  'SPF 50 sunscreen for outdoor sports',
  'cheap resistance bands for home rehab',
  'desk lamp with phone charger for gaming',
  'premium organic green tea for a gift'
];

const ICONS: Record<string, any> = {
  budget: <CircleDollarSign size={14} color="#f59e0b" />,
  techspec: <Fingerprint size={14} color="#38bdf8" />,
  gift: <Gift size={14} color="#a78bfa" />,
  default: <Bot size={14} color="#c8f135" />
};

export default function QuerySimulator({ products }: { products: any[] }) {
  const [query, setQuery]     = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const simulate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    setActiveTab(0);
    try {
      const response = await simulateQuery(query, products);
      
      const parsedPersonas = response.personas.map((personaRes: any) => {
        const top = (personaRes.ranked_results || []).map((r: any) => {
          const p = products.find((prod) => prod.id === r.product_id);
          return {
            id: r.product_id,
            title: p ? p.title : 'Unknown Product',
            rank: r.rank,
            match_score: r.match_score,
            match_reason: r.reason,
          };
        });

        const rejected = (personaRes.rejected_products || []).map((r: any) => {
          const p = products.find((prod) => prod.id === r.product_id);
          return {
            id: r.product_id,
            title: p ? p.title : 'Unknown Product',
            rejection_reason: r.reason,
          };
        });

        return {
          key: personaRes.persona_key || 'default',
          name: personaRes.persona || 'AI Agent',
          top,
          rejected
        };
      });

      setResults(parsedPersonas);
    } catch (e) {
      console.error('Simulation Failed:', e);
      // Fallback
      setResults([{
        key: 'default',
        name: 'Demo Fallback AI',
        top: products.slice(0, 2).map((p, i) => ({ id: p.id, title: p.title, rank: i+1, match_score: 90 - i*10, match_reason: 'Demo match for query' })),
        rejected: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0e0e14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <p style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: '#f0f0f0' }}>
            Multi-Persona Query Simulation
          </p>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(200,241,53,0.1)', color: '#c8f135', border: '1px solid rgba(200,241,53,0.2)', fontWeight: 700 }}>NEW</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(240,240,240,0.45)', lineHeight: 1.6, maxWidth: 600 }}>
          AI shoppers aren't a monolith. Test your store's visibility against three distinct LLM architectures: Budget limits, Technical specs, and Gift/Brand bias.
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: 14, color: 'rgba(240,240,240,0.3)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="e.g. cheap resistance bands for home rehab"
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
            {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Simulate 3 AIs</span><ArrowRight size={12} /></>}
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
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fadeIn 0.3s ease' }}>
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {results.map((res: any, idx: number) => (
              <button key={res.key} onClick={() => setActiveTab(idx)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 99, border: '1px solid', borderColor: activeTab === idx ? 'rgba(255,255,255,0.2)' : 'transparent', background: activeTab === idx ? 'rgba(255,255,255,0.06)' : 'transparent', color: activeTab === idx ? '#fff' : 'rgba(240,240,240,0.4)', cursor: 'pointer', fontWeight: 600, fontSize: 12, transition: 'all 0.2s' }}>
                {ICONS[res.key] || ICONS['default']}
                {res.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#22c55e', fontFamily: 'var(--font-head)' }}>Strong Recommendation</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results[activeTab].top.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>This AI found no relevant matches in your catalog.</p>
                ) : (
                  results[activeTab].top.map((p: any) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,240,240,0.3)', width: 20, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>#{p.rank}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0', fontFamily: 'var(--font-head)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{p.title}</p>
                        <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.match_reason}</p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', flexShrink: 0, fontFamily: 'var(--font-head)' }}>{p.match_score}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ef4444', fontFamily: 'var(--font-head)' }}>Rejected Products</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results[activeTab].rejected.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>None</p>
                ) : (
                  results[activeTab].rejected.map((p: any) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0', fontFamily: 'var(--font-head)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{p.title}</p>
                        <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.rejection_reason}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
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
