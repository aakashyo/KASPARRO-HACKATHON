import React from 'react';
import { Target, Eye, AlertTriangle, ShieldAlert } from 'lucide-react';

interface GapViewProps {
  gaps: any;
}

export default function GapView({ gaps }: GapViewProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {gaps.missing_attributes.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
            <div className="flex items-center gap-2 mb-3 text-red-700">
              <ShieldAlert size={14} />
              <p className="text-[10px] uppercase font-black tracking-widest">Unresolved Attributes</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {gaps.missing_attributes.map((attr: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-white text-red-700 rounded-lg text-[10px] font-bold border border-red-200 shadow-sm uppercase tracking-tighter">
                  {attr}
                </span>
              ))}
            </div>
          </div>
        )}

        {gaps.misinterpretations.length > 0 && (
          <div className="space-y-3">
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest px-1">AI Logic Errors</p>
             <div className="space-y-2">
                {gaps.misinterpretations.map((m: string, i: number) => (
                <div key={i} className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-50" />
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{m}</p>
                </div>
                ))}
             </div>
          </div>
        )}

        {gaps.confidence_drop_reasons.length > 0 && (
          <div className="space-y-3">
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest px-1">Confidence Impact</p>
             <div className="flex flex-wrap gap-2">
                {gaps.confidence_drop_reasons.map((reason: string, i: number) => (
                    <div key={i} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold border border-slate-200">
                        {reason}
                    </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
