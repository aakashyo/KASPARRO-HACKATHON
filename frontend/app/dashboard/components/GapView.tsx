import React from 'react';

interface GapViewProps {
  gaps: any;
}

export default function GapView({ gaps }: GapViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {gaps.missing_attributes?.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#ef4444', marginBottom: 7, fontFamily: 'var(--font-head)' }}>Missing Details</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {gaps.missing_attributes.map((attr: string, i: number) => (
              <span key={i} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 99, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontWeight: 600, fontFamily: 'var(--font-head)' }}>{attr}</span>
            ))}
          </div>
        </div>
      )}

      {gaps.misinterpretations?.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,240,0.3)', marginBottom: 7, fontFamily: 'var(--font-head)' }}>What AI Gets Wrong</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {gaps.misinterpretations.map((m: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 2, borderRadius: 99, flexShrink: 0, alignSelf: 'stretch', background: '#f59e0b', opacity: 0.7 }} />
                <p style={{ fontSize: 11, lineHeight: 1.5, color: 'rgba(240,240,240,0.55)' }}>{m}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.confidence_drop_reasons?.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,240,0.3)', marginBottom: 7, fontFamily: 'var(--font-head)' }}>Why AI Is Unsure</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {gaps.confidence_drop_reasons.map((reason: string, i: number) => (
              <span key={i} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 99, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.18)', color: '#38bdf8', fontWeight: 600, fontFamily: 'var(--font-head)' }}>{reason}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
