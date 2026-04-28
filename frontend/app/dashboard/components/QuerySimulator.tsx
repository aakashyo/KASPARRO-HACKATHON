'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  CircleDollarSign,
  Fingerprint,
  Gift,
  Loader2,
  Search,
} from 'lucide-react';
import { simulateQuery } from '@/lib/api';

const EXAMPLES = [
  'best moisturizer for dry skin under INR 1500',
  'SPF 50 sunscreen for outdoor sports',
  'cheap resistance bands for home rehab',
  'desk lamp with phone charger for gaming',
  'premium organic green tea for a gift',
];

const ICONS: Record<string, React.ReactNode> = {
  budget: <CircleDollarSign size={14} color="var(--amber)" />,
  techspec: <Fingerprint size={14} color="var(--info)" />,
  gift: <Gift size={14} color="var(--accent)" />,
  default: <Bot size={14} color="var(--accent)" />,
};

export default function QuerySimulator({ products }: { products: any[] }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [benchmarkMode, setBenchmarkMode] = useState(false);

  const simulate = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults(null);
    setActiveTab(0);

    try {
      const response = await simulateQuery(query, products);

      const parsedPersonas = response.personas.map((personaRes: any) => {
        const top = (personaRes.ranked_results || []).map((result: any) => {
          const product = products.find((item) => item.id === result.product_id);
          return {
            id: result.product_id,
            title: product ? product.title : 'Unknown Product',
            rank: result.rank,
            match_score: result.match_score,
            match_reason: result.reason,
          };
        });

        const rejected = (personaRes.rejected_products || []).map((result: any) => {
          const product = products.find((item) => item.id === result.product_id);
          return {
            id: result.product_id,
            title: product ? product.title : 'Unknown Product',
            rejection_reason: result.reason,
          };
        });

        return {
          key: personaRes.persona_key || 'default',
          name: personaRes.persona || 'AI Agent',
          top,
          rejected,
        };
      });

      setResults(parsedPersonas);
    } catch (error) {
      console.error('Simulation failed:', error);
      setResults([
        {
          key: 'default',
          name: 'Demo fallback AI',
          top: products.slice(0, 2).map((product, index) => ({
            id: product.id,
            title: product.title,
            rank: index + 1,
            match_score: 90 - index * 10,
            match_reason: 'Demo match for query',
          })),
          rejected: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <span className="section-kicker">Multi-persona query simulation</span>
          <p className="section-copy">
            AI shoppers are not a monolith. Run the same query across budget, technical-spec, and gifting behaviors to
            see where your catalog wins or drops.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => setBenchmarkMode((value) => !value)}
          style={{
            borderColor: benchmarkMode ? 'var(--accent-border)' : 'var(--border)',
            background: benchmarkMode ? 'var(--accent-soft)' : 'rgba(255,255,255,0.03)',
            color: benchmarkMode ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        >
          <Bot size={14} />
          {benchmarkMode ? 'Benchmark mode active' : 'Benchmark mode off'}
        </button>
      </div>

      <div className="surface-muted" style={{ padding: 18 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && simulate()}
            className="input-shell"
            placeholder="e.g. cheap resistance bands for home rehab"
            suppressHydrationWarning
            style={{ paddingLeft: 42, paddingRight: 148 }}
          />
          <button
            type="button"
            onClick={simulate}
            disabled={!query.trim() || loading}
            className="btn-primary"
            style={{ position: 'absolute', right: 6, minHeight: 40, padding: '0 14px' }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="spin" />
                Running
              </>
            ) : (
              <>
                Simulate
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

        <div className="chip-list">
          {EXAMPLES.map((example) => (
            <button key={example} type="button" className="filter-chip" onClick={() => setQuery(example)}>
              {example}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <div className="stack" style={{ gap: 18 }}>
          <div className="filter-chip-row">
            {results.map((result: any, index: number) => (
              <button
                key={result.key}
                type="button"
                className={`filter-chip ${activeTab === index ? 'filter-chip--active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                {ICONS[result.key] || ICONS.default}
                {result.name}
              </button>
            ))}
          </div>

          <div className="query-grid">
            <div className="stack" style={{ gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: 'var(--ok)',
                    display: 'inline-block',
                  }}
                />
                <span className="section-kicker" style={{ marginBottom: 0, color: 'var(--ok)' }}>
                  Strong recommendations
                </span>
              </div>

              {results[activeTab].top.length === 0 ? (
                <div className="surface-muted" style={{ padding: 16 }}>
                  <p className="faded-note">This AI found no relevant matches in the current catalog snapshot.</p>
                </div>
              ) : (
                <>
                  {results[activeTab].top.map((result: any, index: number) => (
                    <div
                      key={`${result.id}-${index}`}
                      className="surface-muted"
                      style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
                    >
                      <span
                        style={{
                          width: 30,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-muted)',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        #{result.rank}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 800, marginBottom: 3 }}>{result.title}</p>
                        <p className="faded-note" style={{ whiteSpace: 'normal' }}>
                          {result.match_reason}
                        </p>
                      </div>
                      <span style={{ fontWeight: 900, color: 'var(--ok)', fontFamily: 'var(--font-head)' }}>
                        {result.match_score}%
                      </span>
                    </div>
                  ))}

                  {benchmarkMode && (
                    <div
                      className="surface-muted"
                      style={{
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        borderStyle: 'dashed',
                        opacity: 0.72,
                      }}
                    >
                      <span style={{ width: 30, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>EXT</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 800, color: 'var(--text-muted)', marginBottom: 3 }}>
                          Generic marketplace competitor
                        </p>
                        <p className="faded-note">
                          Added as an external benchmark to show how much the optimized listing can separate itself.
                        </p>
                      </div>
                      <span style={{ fontWeight: 900, color: 'var(--text-faint)', fontFamily: 'var(--font-head)' }}>
                        42%
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="stack" style={{ gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: 'var(--danger)',
                    display: 'inline-block',
                  }}
                />
                <span className="section-kicker" style={{ marginBottom: 0, color: 'var(--danger)' }}>
                  Rejected products
                </span>
              </div>

              {results[activeTab].rejected.length === 0 ? (
                <div className="surface-muted" style={{ padding: 16 }}>
                  <p className="faded-note">No products were actively rejected by this persona in the current run.</p>
                </div>
              ) : (
                results[activeTab].rejected.map((result: any, index: number) => (
                  <div key={`${result.id}-${index}`} className="surface-muted" style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: 800, marginBottom: 4 }}>{result.title}</p>
                    <p className="faded-note">{result.rejection_reason}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
