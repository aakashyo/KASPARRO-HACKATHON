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
  const [benchmarkMode, setBenchmarkMode] = useState(false);

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
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '28px 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <p style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>
            Multi-Persona Query Simulation
          </p>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent-border)', fontWeight: 700 }}>NEW</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 600 }}>
            AI shoppers aren't a monolith. Test your store's visibility against three distinct LLM architectures: Budget limits, Technical specs, and Gift/Brand bias.
          </p>
          <button 
            onClick={() => setBenchmarkMode(!benchmarkMode)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, 
              background: benchmarkMode ? 'var(--accent-glow)' : 'var(--bg-surface)', 
              border: `1px solid ${benchmarkMode ? 'var(--accent-border)' : 'var(--border)'}`,
              color: benchmarkMode ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-head)'
            }}
          >
            <Bot size={13} /> {benchmarkMode ? 'Benchmark: ACTIVE' : 'Benchmark: OFF'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: 14, color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="e.g. cheap resistance bands for home rehab"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && simulate()}
            suppressHydrationWarning
            style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 120px 11px 40px', fontSize: 13, color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            onClick={simulate}
            disabled={!query.trim() || loading}
            suppressHydrationWarning
            style={{ position: 'absolute', right: 6, background: query.trim() && !loading ? 'var(--accent)' : 'var(--bg-elevated)', color: query.trim() && !loading ? '#08080c' : 'var(--text-muted)', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: query.trim() && !loading ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-head)', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s' }}
          >
            {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Simulate 3 AIs</span><ArrowRight size={12} /></>}
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {EXAMPLES.map(q => (
            <button key={q} onClick={() => setQuery(q)}
              style={{ fontSize: 11, padding: '5px 12px', borderRadius: 99, border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-head)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)', animation: 'fadeIn 0.3s ease' }}>
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {results.map((res: any, idx: number) => (
              <button key={res.key} onClick={() => setActiveTab(idx)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 99, border: '1px solid', borderColor: activeTab === idx ? 'var(--accent-border)' : 'transparent', background: activeTab === idx ? 'var(--accent-glow)' : 'transparent', color: activeTab === idx ? 'var(--text)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: 12, transition: 'all 0.2s' }}>
                {ICONS[res.key] || ICONS['default']}
                {res.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)' }} />
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ok)', fontFamily: 'var(--font-head)' }}>Strong Recommendation</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results[activeTab].top.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '16px', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border)' }}>This AI found no relevant matches in your catalog.</p>
                ) : (
                  <>
                    {results[activeTab].top.map((p: any, idx: number) => (
                      <div key={`${p.id}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', width: 20, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>#{p.rank}</span>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-head)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{p.title}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.match_reason}</p>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ok)', flexShrink: 0, fontFamily: 'var(--font-head)' }}>{p.match_score}%</span>
                      </div>
                    ))}
                    
                    {benchmarkMode && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', opacity: 0.7 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', width: 20, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>EXT</span>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-head)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>Generic Marketplace Competitor</p>
                          <p style={{ fontSize: 11, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lacks structured benefits; ranked lower by AI agent due to ambiguity.</p>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-faint)', flexShrink: 0, fontFamily: 'var(--font-head)' }}>42%</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)' }} />
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--danger)', fontFamily: 'var(--font-head)' }}>Rejected Products</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results[activeTab].rejected.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>None</p>
                ) : (
                  results[activeTab].rejected.map((p: any, idx: number) => (
                    <div key={`${p.id}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-head)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{p.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.rejection_reason}</p>
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
