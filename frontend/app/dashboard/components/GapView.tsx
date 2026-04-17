import React from 'react';

interface GapViewProps {
  gaps: any;
}

export default function GapView({ gaps }: GapViewProps) {
  return (
    <div className="space-y-4">

      {gaps.missing_attributes?.length > 0 && (
        <div className="space-y-2">
          <p className="label" style={{ color: 'var(--danger)' }}>missing attributes</p>
          <div className="flex flex-wrap gap-1.5">
            {gaps.missing_attributes.map((attr: string, i: number) => (
              <span key={i} className="pill pill-danger">{attr}</span>
            ))}
          </div>
        </div>
      )}

      {gaps.misinterpretations?.length > 0 && (
        <div className="space-y-2">
          <p className="label">ai misinterpretations</p>
          <div className="space-y-2">
            {gaps.misinterpretations.map((m: string, i: number) => (
              <div key={i} className="flex gap-3 p-3" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', borderRadius: 14 }}>
                <div className="w-0.5 rounded-full flex-shrink-0 self-stretch" style={{ background: 'var(--warn)' }} />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{m}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.confidence_drop_reasons?.length > 0 && (
        <div className="space-y-2">
          <p className="label">confidence drop factors</p>
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
