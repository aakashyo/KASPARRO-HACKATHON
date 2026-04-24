'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight, Loader2, ShieldCheck } from 'lucide-react';
import { pushFixes } from '@/lib/api';
import PreviewModal from './PreviewModal';

interface FixSuggestionsProps {
  fixes: any;
  productId?: string;
  isDemo?: boolean;
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

export default function FixSuggestions({ fixes, productId, isDemo, guardrail }: { fixes: any, productId?: string, isDemo?: boolean, guardrail?: any }) {
  const desc     = fixes?.improved_description || 'No changes needed.';
  const tags     = fixes?.structured_tags || [];
  const keywords = fixes?.added_keywords || [];
  const faqs     = fixes?.faq_suggestions || [];

  const tagStrings = tags.map((t: any) => (typeof t === 'object' ? `${t.name}: ${t.value}` : t));

  const [pushing, setPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pushMessage, setPushMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const confirmPush = async () => {
    if (!productId) return;
    setPushing(true);
    setPushStatus('idle');
    try {
      await pushFixes(productId, desc, tagStrings);
      setPushStatus('success');
      setPushMessage('Changes applied to your Shopify store successfully.');
      setShowPreview(false);
    } catch (e: any) {
      setPushStatus('error');
      setPushMessage(e.message || 'Push failed. Check backend logs.');
    } finally {
      setPushing(false);
    }
  };

  const handlePush = async () => {
    if (isDemo) {
      setPushStatus('success');
      setPushMessage('Demo mode — changes would be applied to your live store.');
      return;
    }
    setShowPreview(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {guardrail && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10, 
          padding: '10px 14px', 
          borderRadius: 12, 
          background: guardrail.is_safe ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          border: `1px solid ${guardrail.is_safe ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          marginBottom: 4
        }}>
          <div style={{ padding: 6, borderRadius: 8, background: guardrail.is_safe ? '#22c55e' : '#ef4444', color: '#fff' }}>
            <ShieldCheck size={14} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, color: guardrail.is_safe ? '#22c55e' : '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              AI Policy Guardrail: {guardrail.is_safe ? 'SECURE' : 'ACTION REQUIRED'}
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              {guardrail.reason || 'Verified against store refund and shipping policies.'}
            </p>
          </div>
        </div>
      )}

      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--ok-soft)', borderBottom: '1px solid var(--ok-border)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ok)', fontFamily: 'var(--font-head)' }}>Improved Description</p>
          <CopyBtn text={desc} />
        </div>
        <p style={{ padding: '14px 16px', fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>{desc}</p>
      </div>

      {keywords.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-head)' }}>Added Keywords</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {keywords.map((kw: string, i: number) => (
              <span key={i} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: 'var(--ok-soft)', border: '1px solid var(--ok-border)', color: 'var(--ok)', fontWeight: 600, fontFamily: 'var(--font-head)' }}>{kw}</span>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-head)' }}>Structured Tags</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map((tag: any, i: number) => {
              const label = typeof tag === 'object' ? `${tag.name}: ${tag.value}` : tag;
              return <span key={i} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{label}</span>;
            })}
          </div>
        </div>
      )}

      {faqs.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-head)' }}>Suggested FAQs</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq: any, i: number) => (
              <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontFamily: 'var(--font-head)' }}>
                  {typeof faq === 'string' ? faq : faq.question}
                </p>
                <p style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  {typeof faq === 'string' ? 'See product details for more information.' : faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent)', fontFamily: 'var(--font-head)' }}>Shopify Storefront Preview</p>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Simulated Next.js App Route</span>
        </div>
        
        <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e4e4e7', padding: '20px', color: '#18181b', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
           <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
             <span style={{ fontSize: 10, padding: '4px 8px', background: '#f4f4f5', borderRadius: 6, color: '#52525b', fontWeight: 600, border: '1px solid #e4e4e7' }}>AI Optimized</span>
             {tags.map((tag: any, i: number) => {
                const label = typeof tag === 'object' ? `${tag.name}: ${tag.value}` : tag;
                return <span key={i} style={{ fontSize: 10, padding: '4px 8px', background: '#f4f4f5', borderRadius: 6, color: '#52525b', border: '1px solid #e4e4e7' }}>{label}</span>;
             })}
             {keywords.map((kw: string, i: number) => (
                <span key={'kw'+i} style={{ fontSize: 10, padding: '4px 8px', background: '#ecfdf5', color: '#059669', borderRadius: 6, border: '1px solid #a7f3d0' }}>{kw}</span>
             ))}
           </div>
           
           <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#09090b', letterSpacing: '-0.02em', fontFamily: 'var(--font-head)' }}>Description</h4>
           <div style={{ fontSize: 13, lineHeight: 1.6, color: '#3f3f46', background: '#fff', padding: '16px', borderRadius: 8, border: '1px solid #e4e4e7', whiteSpace: 'pre-wrap' }}>
             {desc}
           </div>
        </div>
      </div>

      {pushStatus === 'success' && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--ok-soft)', border: '1px solid var(--ok-border)', color: 'var(--ok)', fontSize: 12, fontWeight: 600 }}>
          {pushMessage}
        </div>
      )}
      {pushStatus === 'error' && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--danger-soft)', border: '1px solid var(--danger-border)', color: 'var(--danger)', fontSize: 12, fontWeight: 600 }}>
          {pushMessage}
        </div>
      )}

      <button
        onClick={handlePush}
        disabled={pushing}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 10, background: pushStatus === 'success' ? 'var(--ok)' : 'var(--accent)', color: '#08080c', border: 'none', cursor: pushing ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, transition: 'all 0.2s', opacity: pushing ? 0.7 : 1 }}
        onMouseEnter={e => { if (!pushing) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--accent-glow)'; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {pushing ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Pushing to Shopify...</> : pushStatus === 'success' ? <>Applied to Shopify <Check size={15} /></> : <>Push All Fixes to Shopify <ArrowUpRight size={15} /></>}
      </button>

      {showPreview && (
        <PreviewModal 
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onConfirm={confirmPush}
          title="Review AI Product Fixes"
          description="You are about to update this product's description and tags on Shopify."
          contentType="single_fix"
          content={{ description: desc, tags: tagStrings }}
          loading={pushing}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
