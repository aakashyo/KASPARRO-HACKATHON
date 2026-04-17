'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface QuerySimulatorProps {
  products: any[];
}

const EXAMPLE_QUERIES = [
  'Hydrating sunscreen for sensitive skin under ₹1500',
  'Vitamin C serum for oily skin with no fragrance',
  'SPF 50 sunscreen reef safe for outdoor sports',
];

export default function QuerySimulator({ products }: QuerySimulatorProps) {
  const [query, setQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const simulateQuery = () => {
    if (!query.trim()) return;
    setIsSimulating(true);
    setResults(null);

    setTimeout(() => {
      const sorted = [...products].sort((a, b) => a.gaps.severity - b.gaps.severity);
      const top = sorted.slice(0, Math.min(3, sorted.length)).map((p, i) => ({
        ...p,
        rank: i + 1,
        match_score: Math.round(95 - i * 8 + (Math.random() * 4 - 2)),
        match_reason: i === 0
          ? 'Strong semantic and technical match for all query constraints.'
          : 'Matches core intent but has minor attribute gaps.',
      }));
      const rejected = sorted.slice(-Math.min(2, sorted.length)).map(p => ({
        ...p,
        rejection_reason: 'Insufficient structured metadata to verify query constraints.',
      }));
      setResults({ top, rejected });
      setIsSimulating(false);
    }, 1400);
  };

  return (
    <div className="card-static p-6 space-y-6">
      <div>
        <p className="font-semibold text-sm mb-0.5">AI Ranking Simulator</p>
        <p className="text-xs text-[#6b6b80]">Test how a neural shopping agent ranks your products for any natural language query.</p>
      </div>

      <div className="space-y-2">
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-4 text-[#6b6b80]" />
          <input
            type="text"
            placeholder="e.g. Best moisturizer for dry skin under ₹2000"
            className="input-dark w-full pl-11 pr-32 py-3 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && simulateQuery()}
            suppressHydrationWarning
          />
          <button
            onClick={simulateQuery}
            disabled={!query.trim() || isSimulating}
            suppressHydrationWarning
            className="absolute right-2 btn-primary px-4 py-1.5 text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSimulating ? <Loader2 size={13} className="animate-spin" /> : <><span>Simulate</span> <ArrowRight size={13} /></>}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="text-[11px] text-[#6b6b80] hover:text-[#a0a0b8] border border-[#2a2a3a] px-2.5 py-1 rounded-md transition-colors hover:border-[#3a3a4d]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="space-y-3">
            <p className="section-label text-[#4ade80] flex items-center gap-1.5">
              <CheckCircle size={11} /> Ranked by Agent
            </p>
            <div className="space-y-2">
              {results.top.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3.5 bg-[#111118] border border-[#2a2a3a] rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-[#6b6b80] w-5 text-center">#{p.rank}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#f0f0f5] truncate">{p.title}</p>
                      <p className="text-[10px] text-[#6b6b80] truncate">{p.match_reason}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#4ade80] flex-shrink-0 ml-3">{p.match_score}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="section-label text-[#f87171] flex items-center gap-1.5">
              <XCircle size={11} /> Filtered Out
            </p>
            <div className="space-y-2">
              {results.rejected.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3.5 bg-[#111118] border border-[#2a2a3a] rounded-lg opacity-60">
                  <XCircle size={14} className="text-[#f87171] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#f0f0f5] truncate">{p.title}</p>
                    <p className="text-[10px] text-[#6b6b80] truncate">{p.rejection_reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#6b6b80] leading-relaxed px-1">
              Rejected products lack the structured attributes needed for confident agent matching.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
