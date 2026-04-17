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
    <button onClick={copy} style={{ color: copied ? 'var(--ok)' : 'var(--text-subtle)' }} className="p-1 hover:opacity-70 transition-opacity">
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

export default function FixSuggestions({ fixes }: FixSuggestionsProps) {
  const desc = fixes?.improved_description || 'No description update needed.';
  const tags = fixes?.structured_tags || [];
  const keywords = fixes?.added_keywords || [];
  const faqs = fixes?.faq_suggestions || [];

  return (
    <div className="space-y-5">

      <div style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1.5px solid var(--border-subtle)' }}>
          <p className="label" style={{ color: 'var(--ok)' }}>optimized description</p>
          <CopyBtn text={desc} />
        </div>
        <p className="px-4 py-3.5 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>

      {keywords.length > 0 && (
        <div className="space-y-2">
          <p className="label">added keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw: string, i: number) => (
              <span key={i} className="pill pill-ok">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-2">
          <p className="label">structured tags</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag: string, i: number) => (
              <span key={i} className="mono px-2.5 py-1 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', color: 'var(--accent)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="space-y-2">
          <p className="label">suggested faqs</p>
          <div className="space-y-2">
            {faqs.map((faq: any, i: number) => (
              <div key={i} className="px-4 py-3 space-y-1" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', borderRadius: 14 }}>
                <p className="text-xs font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-montserrat)' }}>{faq.question}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-subtle)' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="w-full py-3 text-sm lowercase flex items-center justify-center gap-2 font-semibold transition-all"
        style={{
          background: 'var(--accent-dim)',
          border: '1.5px solid var(--accent-border)',
          borderRadius: 14,
          color: 'var(--accent)',
          fontFamily: 'var(--font-montserrat)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 20%, transparent)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent-dim)')}
      >
        push fixes to shopify <ArrowUpRight size={14} />
      </button>

    </div>
  );
}
