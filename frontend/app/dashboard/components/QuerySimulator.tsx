import React, { useState } from 'react';
import { Search, Bot, BrainCircuit, XCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface QuerySimulatorProps {
  products: any[];
}

export default function QuerySimulator({ products }: QuerySimulatorProps) {
  const [query, setQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateQuery = () => {
    setIsSimulating(true);
    // In a real app we'd call backend, here we simulate the ranking logic for the demo
    setTimeout(() => {
      const topProduct = products[0];
      setResult({
        ranked_results: [
          { rank: 1, product_id: topProduct.id, title: topProduct.title, match_score: 0.88, reason: `Matches the core intent but lacks higher confidence due to ${topProduct.gaps.missing_attributes[0]}.` }
        ],
        rejected_products: [
          { product_id: "other", title: "Generic Competitor", reason: "Missing structured skin-type metadata required for safety-first recommendation." }
        ]
      });
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] backdrop-blur-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
          <BrainCircuit className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Query Simulator</h2>
          <p className="text-zinc-500 text-sm">See how agents rank your products for specific natural language queries.</p>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input 
          type="text"
          placeholder="e.g., 'Hydrating serum for dry skin under ₹1500'"
          suppressHydrationWarning
          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-5 pl-14 pr-32 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={simulateQuery}
          disabled={!query || isSimulating}
          suppressHydrationWarning
          className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
        >
          {isSimulating ? 'Thinking...' : <>Analyze <ArrowRight size={14} /></>}
        </button>
      </div>

      {result && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={14} className="text-emerald-500" />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Ranked Selection</p>
            </div>
            {result.ranked_results.map((r: any, i: number) => (
              <div key={i} className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <CheckCircle size={80} className="text-emerald-500" />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl font-black text-emerald-400">#1</span>
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase">
                    {Math.round(r.match_score * 100)}% Match
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{r.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                  "{r.reason}"
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={14} className="text-rose-500" />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Rejected / Filtered</p>
            </div>
            {result.rejected_products.map((r: any, i: number) => (
              <div key={i} className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl">
                <h4 className="text-sm font-bold text-zinc-300 mb-1">{r.title}</h4>
                <p className="text-[11px] text-rose-400/80 font-medium">REASON: {r.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
