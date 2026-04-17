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
  const color = isGood ? 'var(--ok)' : isOk ? 'var(--warn)' : 'var(--danger)';
  const softBg = isGood ? 'var(--ok-soft)' : isOk ? 'var(--warn-soft)' : 'var(--danger-soft)';
  const Icon = isGood ? TrendingUp : isOk ? Minus : TrendingDown;

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-head)' }}>
          {label}
        </p>
        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: softBg }}>
          <Icon size={11} style={{ color }} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-black leading-none" style={{ color, fontFamily: 'var(--font-head)' }}>{score}</span>
        <span className="text-xs text-[var(--text-faint)] mb-0.5">/100</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{reason}</p>
    </div>
  );
}
