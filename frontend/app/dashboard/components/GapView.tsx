import React from 'react';

interface GapViewProps {
  gaps: any;
}

export default function GapView({ gaps }: GapViewProps) {
  return (
    <div className="space-y-5">

      {gaps.missing_attributes?.length > 0 && (
        <div className="space-y-2">
          <p className="section-label text-[#f87171]">Missing Attributes</p>
          <div className="flex flex-wrap gap-2">
            {gaps.missing_attributes.map((attr: string, i: number) => (
              <span key={i} className="badge badge-critical">{attr}</span>
            ))}
          </div>
        </div>
      )}

      {gaps.misinterpretations?.length > 0 && (
        <div className="space-y-2">
          <p className="section-label">AI Misinterpretations</p>
          <div className="space-y-2">
            {gaps.misinterpretations.map((m: string, i: number) => (
              <div key={i} className="flex gap-3 p-3.5 bg-[#111118] border border-[#2a2a3a] rounded-lg">
                <div className="w-1 flex-shrink-0 rounded-full bg-[#fbbf24] self-stretch" />
                <p className="text-xs text-[#a0a0b8] leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.confidence_drop_reasons?.length > 0 && (
        <div className="space-y-2">
          <p className="section-label">Confidence Drop Factors</p>
          <div className="flex flex-wrap gap-2">
            {gaps.confidence_drop_reasons.map((reason: string, i: number) => (
              <span key={i} className="badge badge-info">{reason}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
