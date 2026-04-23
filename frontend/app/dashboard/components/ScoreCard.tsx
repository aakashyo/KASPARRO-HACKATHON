import React from 'react';

interface ScoreCardProps {
  label: string;
  score: number;
  reason: string;
}

export default function ScoreCard({ label, score, reason }: ScoreCardProps) {
  const isGood = score > 80;
  const isOk   = score > 50;
  const color  = isGood ? 'var(--ok)' : isOk ? 'var(--warn)' : 'var(--danger)';

  return (
    <div
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 20px 18px', display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color 0.2s', cursor: 'default' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong, var(--border))')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontFamily: 'var(--font-head)', lineHeight: 1.3 }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 900, lineHeight: 1, color }}>{score}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/100</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: 'var(--bg-elevated)' }}>
        <div style={{ height: '100%', borderRadius: 99, background: color, width: `${score}%`, transition: 'width 1s ease' }} />
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 2 }}>{reason}</p>
    </div>
  );
}
