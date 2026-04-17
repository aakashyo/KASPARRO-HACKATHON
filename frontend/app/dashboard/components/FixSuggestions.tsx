'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight } from 'lucide-react';

interface FixSuggestionsProps {
  fixes: any;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-md hover:bg-[var(--bg-elevated)] transition-colors" style={{ color: copied ? 'var(--ok)' : 'var(--text-faint)' }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

export default function FixSuggestions({ fixes }: FixSuggestionsProps) {
  const desc = fixes?.improved_description || 'No changes needed.';
  const tags = fixes?.structured_tags || [];
  const keywords = fixes?.added_keywords || [];
  const faqs = fixes?.faq_suggestions || [];

  return (
    <div className="space-y-5">
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ok)', fontFamily: 'var(--font-head)' }}>Improved Description</p>
          <CopyBtn text={desc} />
        </div>
        <p className="px-4 py-3.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">{desc}</p>
      </div>

      {keywords.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-head)' }}>Added Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw: string, i: number) => (
              <span key={i} className="pill pill-ok">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-head)' }}>Structured Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag: string, i: number) => (
              <span key={i} className="mono px-2.5 py-1 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-head)' }}>Suggested FAQs</p>
          <div className="space-y-2">
            {faqs.map((faq: any, i: number) => (
              <div key={i} className="px-4 py-3 space-y-1 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <p className="text-[12px] font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-head)' }}>{faq.question}</p>
                <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="btn-accent w-full py-3 text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-head)' }}>
        Push All Fixes to Shopify <ArrowUpRight size={14} />
      </button>
    </div>
  );
}
