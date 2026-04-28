import React from 'react';

interface GapViewProps {
  gaps: any;
  severity?: number;
  isAudited?: boolean;
}

export default function GapView({ gaps, severity, isAudited }: GapViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {gaps.missing_attributes?.length > 0 && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--danger)', marginBottom: 9, fontFamily: 'var(--font-head)' }}>Missing Details</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {gaps.missing_attributes.map((attr: string, i: number) => (
              <span key={i} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 99, background: 'var(--danger-soft)', border: '1px solid var(--danger-border)', color: 'var(--danger)', fontWeight: 600, fontFamily: 'var(--font-head)', lineHeight: 1.35 }}>{attr}</span>
            ))}
          </div>
        </div>
      )}

      {gaps.misinterpretations?.length > 0 && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)', marginBottom: 9, fontFamily: 'var(--font-head)' }}>What Shoppers May Misread</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {gaps.misinterpretations.map((m: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div style={{ width: 2, borderRadius: 99, flexShrink: 0, alignSelf: 'stretch', background: 'var(--warn)', opacity: 0.7 }} />
                <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)' }}>{m}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.confidence_drop_reasons?.length > 0 && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)', marginBottom: 9, fontFamily: 'var(--font-head)' }}>Why Confidence Drops</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {gaps.confidence_drop_reasons.map((reason: string, i: number) => (
              <span key={i} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 99, background: 'var(--info-soft)', border: '1px solid var(--info-border)', color: 'var(--info)', fontWeight: 600, fontFamily: 'var(--font-head)', lineHeight: 1.35 }}>{reason}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

