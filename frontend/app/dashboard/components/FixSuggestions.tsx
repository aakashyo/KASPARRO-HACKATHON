import React from 'react';
import { Sparkles, Copy, CheckCircle2 } from 'lucide-react';

interface FixSuggestionsProps {
  fixes: any;
}

export default function FixSuggestions({ fixes }: FixSuggestionsProps) {
  const description = fixes?.improved_description || 'No description update needed.';
  const tags = fixes?.structured_tags || [];
  const faqs = fixes?.faq_suggestions || [];

  return (
    <div className="space-y-6">
      <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-[1.5rem] relative group group">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] text-emerald-600 uppercase font-black tracking-[0.2em]">Optimized Neural Description</p>
          <button className="text-slate-400 hover:text-emerald-600 transition-colors" title="Copy to clipboard">
            <Copy size={14} />
          </button>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="space-y-6">
        {tags.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3 px-1">Structured Meta-Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-white text-slate-600 rounded-xl text-[10px] font-bold border border-slate-200 shadow-sm flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {faqs.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest px-1">Agent Knowledge Queries (FAQs)</p>
            <div className="space-y-2">
                {faqs.map((faq: any, i: number) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-xs font-black text-emerald-600 mb-1">Q: {faq.question}</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">A: {faq.answer}</p>
                </div>
                ))}
            </div>
          </div>
        )}
      </div>
      
      <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-[0.98]">
        <Sparkles size={14} /> Push Fixes to Store
      </button>
    </div>
  );
}
