import React from 'react';

interface GapViewProps {
  gaps: any;
}

export default function GapView({ gaps }: GapViewProps) {
  return (
    <div className="space-y-4">
      {gaps.missing_attributes?.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--danger)', fontFamily: 'var(--font-head)' }}>Missing Details</p>
          <div className="flex flex-wrap gap-1.5">
            {gaps.missing_attributes.map((attr: string, i: number) => (
              <span key={i} className="pill pill-danger">{attr}</span>
            ))}
          </div>
        </div>
      )}

      {gaps.misinterpretations?.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-head)' }}>What AI Gets Wrong</p>
          <div className="space-y-2">
            {gaps.misinterpretations.map((m: string, i: number) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div className="w-0.5 rounded-full flex-shrink-0 self-stretch" style={{ background: 'var(--warn)' }} />
                <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">{m}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.confidence_drop_reasons?.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-head)' }}>Why AI Is Unsure</p>
          <div className="flex flex-wrap gap-1.5">
            {gaps.confidence_drop_reasons.map((reason: string, i: number) => (
              <span key={i} className="pill pill-info">{reason}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
