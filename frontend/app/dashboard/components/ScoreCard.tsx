import React from 'react';
import { Info } from 'lucide-react';

interface ScoreCardProps {
  label: string;
  score: number;
  reason: string;
}

export default function ScoreCard({ label, score, reason }: ScoreCardProps) {
  return (
    <div className="card-premium p-6 flex flex-col items-center justify-center text-center relative group overflow-hidden">
      {/* Tooltip on hover */}
      <div className="absolute inset-0 bg-slate-900/95 text-white p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-[10px] sm:text-xs leading-relaxed z-10 font-medium">
        <p>{reason}</p>
      </div>

      <div className="relative z-0 flex flex-col items-center">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-50 rounded-full blur-2xl opacity-50 group-hover:bg-blue-100 transition-colors" />
        
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 truncate max-w-full px-2">
            {label}
        </span>
        
        <div className="relative">
            <span className={`text-4xl font-black tabular-nums transition-colors ${score > 80 ? 'text-emerald-500' : score > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {score}
            </span>
            <span className="text-xs font-bold text-slate-300 ml-0.5">/100</span>
        </div>

        <div className="mt-4 p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
            <Info size={14} />
        </div>
      </div>
    </div>
  );
}
