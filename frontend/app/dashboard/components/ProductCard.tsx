import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, TrendingUp, Sparkles, Brain, Eye, Target, Zap, CheckCircle2, XCircle } from 'lucide-react';
import GapView from './GapView';
import FixSuggestions from './FixSuggestions';

interface ProductCardProps {
  product: any;
  highlighted?: boolean;
}

export default function ProductCard({ product, highlighted = false }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const severity = product.gaps.severity;
  
  const getStatus = () => {
    if (severity >= 7) return { label: 'Critical Gap', color: 'bg-red-50 text-red-700 border-red-100', icon: <XCircle size={14} /> };
    if (severity >= 4) return { label: 'Needs Improvement', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: <AlertCircle size={14} /> };
    return { label: 'Optimized', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CheckCircle2 size={14} /> };
  };

  const status = getStatus();

  return (
    <div className={`card-premium overflow-hidden transition-all ${highlighted ? 'ring-2 ring-red-500/20 bg-white' : 'bg-white'}`}>
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
                {product.original_data.image ? (
                  <img src={product.original_data.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-300 font-bold text-xs uppercase">Product</div>
                )}
              </div>
              <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${severity >= 7 ? 'bg-red-600' : severity >= 4 ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                {severity}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight leading-none">{product.title}</h3>
              <div className="flex items-center gap-3">
                <div className={`px-2.5 py-1 rounded-full border ${status.color} text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5`}>
                  {status.icon} {status.label}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Severity {severity}/10</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            {/* Before vs After Summary */}
            <div className="hidden md:flex items-center gap-6 pr-6 border-r border-slate-100">
                <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">AI Confidence</p>
                    <div className="flex items-center justify-end gap-3">
                        <span className="text-sm font-bold text-slate-400 strike-through opacity-50">{Math.round(product.impact.before_score * 100)}%</span>
                        <div className="flex items-center gap-1 text-emerald-600 font-black text-sm">
                            <TrendingUp size={14} />
                            <span>{Math.round(product.impact.after_score * 100)}%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-slate-400">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

        {/* Intelligence Insight (Critical Line) */}
        {!isOpen && (
            <div className="mt-4 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center gap-3">
                <Brain size={18} className="text-blue-600 flex-shrink-0" />
                <p className="text-xs text-slate-600 font-medium">
                    <span className="font-bold text-slate-900 uppercase text-[9px] tracking-widest mr-2">Intelligence Insight:</span>
                    {product.gaps.insight || "AI cannot discern primary target user, affecting search recommendation ranking."}
                </p>
            </div>
        )}
      </div>

      {/* Expanded Content Grid */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-white animate-fade-in">
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Intent vs Perception */}
            <div className="space-y-10">
              {/* Insight Line */}
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-[1.5rem] flex items-start gap-4">
                <Brain size={20} className="text-blue-600 mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600/60 mb-1">Expert Diagnosis</p>
                  <p className="text-sm font-bold text-blue-900 leading-relaxed">
                    {product.gaps.insight || "AI is misinterpreting functional attributes for purely aesthetic ones, causing a match penalty."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    <Target size={14} /> Merchant Intent
                  </h4>
                  <div className="p-5 bg-emerald-50/30 border border-emerald-100 rounded-2xl space-y-4">
                    <div>
                      <p className="text-[9px] font-bold text-emerald-600/60 uppercase mb-1">Target User</p>
                      <p className="text-xs font-bold text-slate-800">{product.intent.target_user}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-emerald-600/60 uppercase mb-1">Primary Use Case</p>
                      <p className="text-xs font-bold text-slate-800">{product.intent.use_case}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600">
                    <Eye size={14} /> AI Perception
                  </h4>
                  <div className="p-5 bg-red-50/30 border border-red-100 rounded-2xl space-y-4">
                    <div>
                      <p className="text-[9px] font-bold text-red-600/60 uppercase mb-1">AI Recommendation</p>
                      <div className="flex items-center gap-1.5 font-black text-xs text-slate-800">
                        {product.ai_perception.recommendation === 'yes' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-red-500" />}
                        {product.ai_perception.recommendation.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-red-600/60 uppercase mb-1">Confidence</p>
                      <p className="text-xs font-bold text-slate-800">{Math.round(product.ai_perception.confidence * 100)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Before vs After Visualization */}
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 text-center">Outcome Simulation</h4>
                <div className="flex items-center justify-around gap-4 px-4">
                  <div className="text-center space-y-2">
                    <div className="inline-flex px-2 py-0.5 bg-slate-200 text-slate-500 rounded text-[9px] font-black uppercase tracking-tighter">Current</div>
                    <div className="w-20 h-20 rounded-full border-4 border-slate-200 flex items-center justify-center">
                       <span className="text-xl font-black text-slate-400">{Math.round(product.impact.before_score * 100)}%</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">Low Recommendation</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Zap className="text-slate-300 animate-pulse" size={24} />
                    <div className="w-0.5 h-12 bg-gradient-to-b from-slate-200 via-blue-200 to-slate-200 my-2" />
                  </div>

                  <div className="text-center space-y-2">
                    <div className="inline-flex px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-black uppercase tracking-tighter shadow-lg shadow-blue-500/20">Optimized</div>
                    <div className="w-20 h-20 rounded-full border-4 border-blue-600 flex items-center justify-center relative">
                       <span className="text-xl font-black text-blue-600">{Math.round(product.impact.after_score * 100)}%</span>
                       <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                         <TrendingUp size={10} />
                       </div>
                    </div>
                    <p className="text-[10px] font-bold text-blue-800">High Ranking Rank</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Gaps & Fixes */}
            <div className="space-y-10">
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4">
                  <AlertCircle size={14} /> Knowledge Gap Recovery
                </h4>
                <GapView gaps={product.gaps} />
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
                  <Sparkles size={14} /> Neural Optimization Plan
                </h4>
                <FixSuggestions fixes={product.fixes} />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
