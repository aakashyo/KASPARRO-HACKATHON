import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, ShieldCheck, Zap, AlertCircle, Info, Target } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  contentType: 'faq' | 'bulk_fixes' | 'single_fix' | 'audit_queue';
  content: any;
  loading?: boolean;
}

export default function PreviewModal({ isOpen, onClose, onConfirm, title, description, contentType, content, loading }: PreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modal = (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 99999, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 20,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)'
    }}>
      <div 
        style={{ position: 'absolute', inset: 0 }} 
        onClick={onClose}
      />
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: 800, 
        maxHeight: '85vh', 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border)', 
        borderRadius: 24, 
        display: 'flex', 
        flexDirection: 'column', 
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        animation: 'modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <style>{`
          @keyframes modalEnter {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
        
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{title}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{description}</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '32px', overflowY: 'auto', flex: 1, background: 'rgba(0,0,0,0.4)', minHeight: 0 }}>
          {contentType === 'faq' && (
            <div style={{ background: '#fff', color: '#333', padding: '40px', borderRadius: 12, fontSize: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', width: '100%' }}>
               <div dangerouslySetInnerHTML={{ __html: content }} className="faq-preview-content" />
            </div>
          )}

          {contentType === 'audit_queue' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {content.map((p: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                      {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: 10 }}>IMG</div>}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{p.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{p.handle}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--info)' }}>
                    <Target size={14} />
                    <span style={{ fontSize: 11, fontWeight: 700 }}>QUEUED</span>
                  </div>
                </div>
              ))}
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
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{fix.title}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, border: '1px dashed var(--border-subtle)' }}>
                    {fix.description}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {fix.tags.map((tag: string, j: number) => (
                      <span key={j} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
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
                   <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>Optimized Description</p>
                   <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{content.description}</div>
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
                   <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>Added Semantic Tags</p>
                   <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {content.tags.map((t: string, i: number) => (
                         <span key={i} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}>{t}</span>
                      ))}
                   </div>
                </div>
             </div>
          )}
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 12, justifyContent: 'flex-end', background: 'var(--bg-surface)', flexShrink: 0 }}>
           <button 
             onClick={onClose}
             style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
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
               background: 'var(--accent)', 
               color: '#08080c', 
               fontSize: 14, 
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
                 {contentType === 'audit_queue' ? 'Start Deep Audit' : 'Approve & Push to Shopify'}
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
