'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight } from 'lucide-react';

interface FixSuggestionsProps {
  fixes: any;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md text-[#6b6b80] hover:text-[#f0f0f5] hover:bg-[#1f1f2e] transition-all"
      title="Copy"
    >
      {copied ? <Check size={12} className="text-[#4ade80]" /> : <Copy size={12} />}
    </button>
  );
}

export default function FixSuggestions({ fixes }: FixSuggestionsProps) {
  const description = fixes?.improved_description || 'No description update required.';
  const tags = fixes?.structured_tags || [];
  const keywords = fixes?.added_keywords || [];
  const faqs = fixes?.faq_suggestions || [];

  return (
    <div className="space-y-5">

      <div className="bg-[#111118] border border-[#2a2a3a] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1f1f2e]">
          <p className="section-label text-[#4ade80]">Optimized Description</p>
          <CopyButton text={description} />
        </div>
        <p className="px-4 py-3.5 text-sm text-[#a0a0b8] leading-relaxed">{description}</p>
      </div>

      {keywords.length > 0 && (
        <div className="space-y-2">
          <p className="section-label">Added Keywords</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw: string, i: number) => (
              <span key={i} className="badge badge-success">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-2">
          <p className="section-label">Structured Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string, i: number) => (
              <span key={i} className="px-2.5 py-1 rounded-md bg-[#111118] border border-[#2a2a3a] text-[11px] font-mono text-[#7c5cfc]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="space-y-2">
          <p className="section-label">Suggested FAQs</p>
          <div className="space-y-2">
            {faqs.map((faq: any, i: number) => (
              <div key={i} className="bg-[#111118] border border-[#2a2a3a] rounded-lg px-4 py-3 space-y-1">
                <p className="text-xs font-semibold text-[#f0f0f5]">{faq.question}</p>
                <p className="text-xs text-[#6b6b80] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="w-full py-3 rounded-[10px] border border-[#2a2a3a] bg-gradient-to-r from-[#00d4ff]/10 to-[#7c5cfc]/10 hover:from-[#00d4ff]/15 hover:to-[#7c5cfc]/15 text-sm font-semibold text-[#f0f0f5] transition-all flex items-center justify-center gap-2">
        Push all fixes to Shopify <ArrowUpRight size={14} />
      </button>

    </div>
  );
}
