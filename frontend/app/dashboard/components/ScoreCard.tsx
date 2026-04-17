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
  const Icon = isGood ? TrendingUp : isOk ? Minus : TrendingDown;

  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="label leading-snug max-w-[75%]">{label}</p>
        <Icon size={12} style={{ color }} strokeWidth={2.5} />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
            <circle cx="30" cy="30" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle
              cx="30" cy="30" r={r}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-xs font-black"
            style={{ color, fontFamily: 'var(--font-montserrat)' }}
          >
            {score}
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-subtle)] leading-relaxed">{reason}</p>
      </div>
    </div>
  );
}
