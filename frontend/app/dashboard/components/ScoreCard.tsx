import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface ScoreCardProps {
  label: string;
  score: number;
  reason: string;
}

export default function ScoreCard({ label, score, reason }: ScoreCardProps) {
  const [showReason, setShowReason] = useState(false);

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getBgColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-400/10 border-emerald-400/20';
    if (s >= 50) return 'bg-amber-400/10 border-amber-400/20';
    return 'bg-rose-400/10 border-rose-400/20';
  };

  return (
    <div 
      className={`p-6 rounded-2xl border ${getBgColor(score)} backdrop-blur-sm transition-all hover:scale-[1.02] cursor-help relative group`}
      onMouseEnter={() => setShowReason(true)}
      onMouseLeave={() => setShowReason(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">{label}</h3>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-2">
        <div 
          className={`h-1.5 rounded-full transition-all duration-1000 ${getScoreColor(score).replace('text-', 'bg-')}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <Info size={12} className="text-zinc-500" />
        <p className="text-[10px] text-zinc-500 uppercase font-bold">Details</p>
      </div>

      {showReason && (
        <div className="absolute top-[110%] left-0 right-0 z-30 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <p className="text-xs text-zinc-300 leading-relaxed font-medium">
            {reason}
          </p>
        </div>
      )}
    </div>
  );
}
