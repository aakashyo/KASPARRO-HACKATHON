import React from 'react';
import { Sparkles, Copy } from 'lucide-react';

interface FixSuggestionsProps {
  fixes: any;
}

export default function FixSuggestions({ fixes }: FixSuggestionsProps) {
  // Safety checks to handle potential missing data
  const description = fixes?.improved_description || 'No description update needed.';
  const tags = fixes?.structured_tags || [];
  const faqs = fixes?.faq_suggestions || [];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">Optimized AI Index Description</p>
          <button className="text-zinc-500 hover:text-white transition-colors" title="Copy to clipboard">
            <Copy size={14} />
          </button>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {tags.length > 0 && (
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">Recommended Structured Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-[11px] font-medium border border-zinc-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {faqs.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">AI Curiosity FAQs</p>
            {faqs.map((faq: any, i: number) => (
              <div key={i} className="p-3 bg-zinc-950/50 border border-zinc-900 rounded-xl">
                <p className="text-xs font-bold text-emerald-400">Q: {faq.question}</p>
                <p className="text-[11px] text-zinc-500 mt-1">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
        <Sparkles size={14} /> Apply Neural Fixes (Ready)
      </button>
    </div>
  );
}
