'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight } from 'lucide-react';

interface FixSuggestionsProps {
  fixes: any;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ padding: '4px 6px', borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? '#22c55e' : 'rgba(240,240,240,0.3)', transition: 'color 0.2s' }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

export default function FixSuggestions({ fixes }: FixSuggestionsProps) {
  const desc     = fixes?.improved_description || 'No changes needed.';
  const tags     = fixes?.structured_tags || [];
  const keywords = fixes?.added_keywords || [];
  const faqs     = fixes?.faq_suggestions || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(34,197,94,0.06)', borderBottom: '1px solid rgba(34,197,94,0.12)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#22c55e', fontFamily: 'var(--font-head)' }}>Improved Description</p>
          <CopyBtn text={desc} />
        </div>
        <p style={{ padding: '14px 16px', fontSize: 13, lineHeight: 1.65, color: 'rgba(240,240,240,0.6)', background: 'rgba(255,255,255,0.02)' }}>{desc}</p>
      </div>

      {keywords.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,240,0.3)', marginBottom: 8, fontFamily: 'var(--font-head)' }}>Added Keywords</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {keywords.map((kw: string, i: number) => (
              <span key={i} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', fontWeight: 600, fontFamily: 'var(--font-head)' }}>{kw}</span>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,240,0.3)', marginBottom: 8, fontFamily: 'var(--font-head)' }}>Structured Tags</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map((tag: any, i: number) => {
              const label = typeof tag === 'object' ? `${tag.name}: ${tag.value}` : tag;
              return <span key={i} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#c8f135', fontFamily: 'var(--font-mono)' }}>{label}</span>
            })}
          </div>
        </div>
      )}

      {faqs.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,240,0.3)', marginBottom: 8, fontFamily: 'var(--font-head)' }}>Suggested FAQs</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq: any, i: number) => (
              <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0', marginBottom: 4, fontFamily: 'var(--font-head)' }}>{faq.question}</p>
                <p style={{ fontSize: 11, lineHeight: 1.5, color: 'rgba(240,240,240,0.4)' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 10, background: '#c8f135', color: '#08080c', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,241,53,0.2)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        Push All Fixes to Shopify <ArrowUpRight size={15} />
      </button>
    </div>
  );
}
