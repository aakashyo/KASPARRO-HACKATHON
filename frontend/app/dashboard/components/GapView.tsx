import React from 'react';
import { Target, Eye, AlertTriangle } from 'lucide-react';

interface GapViewProps {
  intent: any;
  perception: any;
  gaps: any;
}

export default function GapView({ intent, perception, gaps }: GapViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-emerald-400" />
            <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">Merchant Intent</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-zinc-300"><span className="text-zinc-500">For:</span> {intent.target_user}</p>
            <p className="text-xs text-zinc-300"><span className="text-zinc-500">Use:</span> {intent.use_case}</p>
          </div>
        </div>
        
        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={14} className="text-blue-400" />
            <p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">AI Perception</p>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed italic">
            "{perception.summary}"
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {gaps.missing_attributes.length > 0 && (
          <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-rose-400">
              <AlertTriangle size={14} />
              <p className="text-[10px] uppercase font-bold tracking-widest">Missing Attributes</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {gaps.missing_attributes.map((attr: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 rounded text-[10px] font-bold border border-rose-500/20 uppercase">
                  {attr}
                </span>
              ))}
            </div>
          </div>
        )}

        {gaps.misinterpretations.length > 0 && (
          <div className="space-y-2">
             <p className="text-[10px] text-zinc-500 uppercase font-bold">Confusions & Misinterpretations</p>
             {gaps.misinterpretations.map((m: string, i: number) => (
               <div key={i} className="flex gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                 <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                 <p className="text-xs text-zinc-400">{m}</p>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
