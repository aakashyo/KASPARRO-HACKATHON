'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, TrendingUp, Filter, AlertCircle, Info } from 'lucide-react';

interface QuerySimulatorProps {
  products: any[];
}

export default function QuerySimulator({ products }: QuerySimulatorProps) {
  const [query, setQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const simulateQuery = () => {
    setIsSimulating(true);
    
    // In a real app, this would call the backend /simulate endpoint
    // For demo, we simulate ranking based on severity (better optimized = better rank)
    setTimeout(() => {
        const sorted = [...products].sort((a, b) => a.gaps.severity - b.gaps.severity);
        const top3 = sorted.slice(0, 3).map((p, index) => ({
            ...p,
            rank: index + 1,
            match_score: 95 - (index * 8) + (Math.random() * 5),
            match_reason: index === 0 ? "Perfect technical and semantic match for intent." : "Strong match with minor keyword gaps."
        }));
        
        const rejected = sorted.slice(-2).map(p => ({
            ...p,
            rejection_reason: "Critical knowledge gaps in target audience attributes."
        }));

        setResults({ ranked: top3, rejected: rejected });
        setIsSimulating(false);
    }, 1500);
  };

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="card-premium p-8 bg-white space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Ranking Simulator</h3>
          <p className="text-xs text-slate-500 font-medium">Test how a Neural Shopping Agent ranks your products for live queries.</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="e.g., 'Hydrating sunscreen for sensitive skin under ₹1500'"
          suppressHydrationWarning
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-14 pr-32 text-slate-900 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={simulateQuery}
          disabled={!query || isSimulating}
          suppressHydrationWarning
          className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/10"
        >
          {isSimulating ? 'Analyzing...' : <>Analyze <ArrowRight size={14} /></>}
        </button>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {/* Top Ranked Results */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                <TrendingUp size={14} /> Top Agent Recommendations
            </h4>
            <div className="space-y-3">
              {results.ranked.map((p: any) => (
                <div key={p.id} className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl flex items-center justify-between group hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{getMedal(p.rank)}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{p.title}</p>
                      <p className="text-[10px] text-emerald-600 font-medium">{p.match_reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">{Math.round(p.match_score)}%</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Match Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rejections */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                <AlertCircle size={14} /> Failed / Filtered Out
            </h4>
            <div className="space-y-3 grayscale opacity-60">
              {results.rejected.map((p: any) => (
                <div key={p.id} className="p-4 bg-red-50/20 border border-red-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                        <AlertCircle size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{p.title}</p>
                      <p className="text-[10px] text-red-600 font-medium">{p.rejection_reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3 italic">
                <Info size={16} className="text-slate-400 shrink-0" />
                <p className="text-[10px] text-slate-500 font-medium">Filtered due to missing structured metadata. AI cannot verify if this product satisfies the query constraints.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
