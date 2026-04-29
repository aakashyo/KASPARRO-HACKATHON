'use client';

import React from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  contentType: 'faq' | 'bulk_fixes' | 'single_fix';
  content: any;
  loading?: boolean;
}

export default function PreviewModal({ isOpen, onClose, onConfirm, title, description, contentType, content, loading }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div 
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.82), rgba(37,99,235,0.34))', backdropFilter: 'blur(10px)' }} 
        onClick={onClose}
      />
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: 800, 
        maxHeight: '85vh', 
        background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(239,246,255,0.96))', 
        border: '1px solid var(--accent-border)', 
        borderRadius: 24, 
        display: 'flex', 
        flexDirection: 'column', 
        boxShadow: '0 28px 90px rgba(15,23,42,0.45)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{title}</h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '6px 0 0 0', lineHeight: 1.6 }}>{description}</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '32px', overflowY: 'auto', flex: 1, background: 'linear-gradient(135deg, rgba(219,234,254,0.42), rgba(236,253,245,0.36))' }}>
          {contentType === 'faq' && (
            <div style={{ background: '#fff', color: '#333', padding: 40, borderRadius: 12, fontSize: 16, lineHeight: 1.75, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
               <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}

          {contentType === 'bulk_fixes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {content.map((fix: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ padding: 6, borderRadius: 8, background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                      <Zap size={14} />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{fix.title}</span>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, background: 'rgba(0,0,0,0.2)', padding: 14, borderRadius: 8, border: '1px dashed var(--border-subtle)' }}>
                    {fix.description}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {fix.tags.map((tag: string, j: number) => (
                      <span key={j} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {contentType === 'single_fix' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
                   <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12, letterSpacing: '0.08em' }}>Optimized Description</p>
                   <div style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{content.description}</div>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
                   <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12, letterSpacing: '0.08em' }}>Added Semantic Tags</p>
                   <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {content.tags.map((t: string, i: number) => (
                         <span key={i} style={{ fontSize: 13, padding: '6px 12px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}>{t}</span>
                      ))}
                   </div>
                </div>
             </div>
          )}
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 12, justifyContent: 'flex-end', background: 'var(--bg-surface)' }}>
           <button 
             onClick={onClose}
             style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
           >
             Cancel
           </button>
           <button 
             onClick={onConfirm}
             disabled={loading}
             style={{ 
               padding: '12px 32px', 
               borderRadius: 12, 
               border: 'none', 
               background: 'var(--gradient-primary)', 
               color: '#FFFFFF', 
               fontSize: 15, 
               fontWeight: 800, 
               cursor: loading ? 'not-allowed' : 'pointer',
               display: 'flex',
               alignItems: 'center',
               gap: 10
             }}
           >
             {loading ? 'Processing...' : (
               <>
                 <CheckCircle2 size={18} />
                 Approve & Push to Shopify
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
}
