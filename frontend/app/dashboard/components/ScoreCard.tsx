import React from 'react';

interface ScoreCardProps {
  label: string;
  score: number;
  reason: string;
}

export default function ScoreCard({ label, score, reason }: ScoreCardProps) {
  const isGood = score > 80;
  const isOk   = score > 50;
  const color  = isGood ? '#22c55e' : isOk ? '#f59e0b' : '#ef4444';

  return (
    <div
      style={{ background: '#0e0e14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 20px 18px', display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color 0.2s', cursor: 'default' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
    >
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(240,240,240,0.35)', fontFamily: 'var(--font-head)', lineHeight: 1.3 }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 900, lineHeight: 1, color }}>{score}</span>
        <span style={{ fontSize: 12, color: 'rgba(240,240,240,0.2)' }}>/100</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ height: '100%', borderRadius: 99, background: color, width: `${score}%`, transition: 'width 1s ease' }} />
      </div>
      <p style={{ fontSize: 11, color: 'rgba(240,240,240,0.4)', lineHeight: 1.5, marginTop: 2 }}>{reason}</p>
    </div>
  );
}
