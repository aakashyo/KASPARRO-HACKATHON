import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreCardProps {
  label: string;
  score: number;
  reason: string;
}

export default function ScoreCard({ label, score, reason }: ScoreCardProps) {
  const isGood = score > 80;
  const isOk = score > 50;
  const color = isGood ? '#4ade80' : isOk ? '#fbbf24' : '#f87171';
  const Icon = isGood ? TrendingUp : isOk ? Minus : TrendingDown;

  const circumference = 2 * Math.PI * 26;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="card p-5 flex flex-col gap-4 group relative">
      <div className="flex items-start justify-between">
        <p className="section-label leading-snug max-w-[80%]">{label}</p>
        <Icon size={13} style={{ color }} strokeWidth={2.5} className="flex-shrink-0 mt-0.5" />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
            <circle cx="30" cy="30" r="26" fill="none" stroke="#1f1f2e" strokeWidth="5" />
            <circle
              cx="30" cy="30" r="26"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="score-ring"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold stat-number" style={{ color }}>
            {score}
          </span>
        </div>
        <p className="text-[11px] text-[#6b6b80] leading-relaxed">{reason}</p>
      </div>
    </div>
  );
}
