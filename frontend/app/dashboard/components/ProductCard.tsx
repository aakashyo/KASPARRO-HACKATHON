import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, TrendingUp, Sparkles, Wand2 } from 'lucide-react';
import GapView from './GapView';
import FixSuggestions from './FixSuggestions';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] overflow-hidden transition-all hover:border-zinc-700/50 hover:bg-zinc-900/60 shadow-xl">
      <div 
        className="p-8 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-700">
              <span className="text-2xl font-black text-zinc-600">{product.title[0]}</span>
            </div>
            {product.gaps.severity > 7 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-zinc-900 flex items-center justify-center animate-pulse">
                <AlertCircle size={10} className="text-white" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 animate-pulse ${
                product.gaps.severity >= 7 ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]' : 
                product.gaps.severity >= 4 ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' :
                'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]'}`} 
              />
              <h4 className="text-xl font-bold text-white tracking-tight">{product.title}</h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.gaps.impact_level === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {product.gaps.impact_level} impact gap
              </span>
            </div>
            
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none">AI Confidence</span>
                 <div className="h-1 w-12 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${product.ai_perception.confidence * 100}%` }}></div>
                 </div>
                 <span className="text-xs font-bold text-blue-400">{Math.round(product.ai_perception.confidence * 100)}%</span>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp size={12} className="text-emerald-500" />
                <span className="text-xs font-bold text-emerald-500">+{product.impact.improvement_percentage}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none">Potential</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block mr-4">
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Status</p>
            <p className={`text-xs font-bold ${product.ai_perception.recommendation === 'yes' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {product.ai_perception.recommendation === 'yes' ? 'Recommended' : 'Rejected by AI'}
            </p>
          </div>
          <div className="p-2 bg-zinc-800 rounded-xl">
             {isOpen ? <ChevronUp size={20} className="text-zinc-400" /> : <ChevronDown size={20} className="text-zinc-400" />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-8 pb-10 border-t border-zinc-800/50 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-10">
            <section className="space-y-8">
              <div>
                <h5 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></span>
                  Perception Audit
                </h5>
                <GapView intent={product.intent} perception={product.ai_perception} gaps={product.gaps} />
              </div>
              
              <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
                <div className="flex items-center gap-2 mb-3">
                   <TrendingUp size={16} className="text-blue-400" />
                   <p className="text-sm font-bold text-blue-100 italic">Impact Calculation</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {product.impact.reason}
                </p>
              </div>
            </section>
            
            <section>
              <h5 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400 shadow-[0_0_8px_#10b981]" />
                Neural Fix Strategy
              </h5>
              <FixSuggestions fixes={product.fixes} />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
