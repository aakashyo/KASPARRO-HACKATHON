'use client';

import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, Target, ShieldCheck, Zap } from 'lucide-react';

interface DimensionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dimension: string;
  score: number;
  reason: string;
  products: any[];
}

export default function DimensionDetailModal({ isOpen, onClose, dimension, score, reason, products }: DimensionDetailModalProps) {
  if (!isOpen) return null;

  const getDetails = () => {
    switch (dimension) {
      case 'Product Quality':
        const lowConfidence = products.filter(p => p.is_audited && (p.audit_deep?.ai_perception?.confidence || 0) < 0.7);
        return (
          <div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              This score measures how confident AI agents are when classifying your products. High confidence comes from structured attributes and clear benefits.
            </p>
            {lowConfidence.length > 0 ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                 <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--danger)' }}>Low Confidence Products ({lowConfidence.length})</p>
                 {lowConfidence.map(p => (
                   <div key={p.id} style={{ padding: 12, borderRadius: 12, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{p.title}</span>
                      <span style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 800 }}>{Math.round(p.audit_deep.ai_perception.confidence * 100)}% Match</span>
                   </div>
                 ))}
               </div>
            ) : (
              <div style={{ padding: 20, borderRadius: 12, background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.1)', textAlign: 'center' }}>
                 <CheckCircle2 size={24} color="var(--ok)" style={{ margin: '0 auto 10px' }} />
                 <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ok)' }}>All audited products have high AI confidence!</p>
              </div>
            )}
          </div>
        );
      case 'Policy Clarity':
        return (
           <div>
             <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
               AI agents prioritize stores with clear Refund, Privacy, and Shipping policies to ensure user safety.
             </p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                   <ShieldCheck size={18} color={score > 50 ? 'var(--ok)' : 'var(--danger)'} />
                   <span style={{ fontSize: 13, fontWeight: 600 }}>{score > 50 ? 'Found legal policies in store footer' : 'No standardized policies detected'}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                   * AI agents like ChatGPT will flag stores without Refund policies as "High Risk".
                </p>
             </div>
           </div>
        );
      case 'Structured Data':
         const missingTags = products.filter(p => !p.original_data?.tags);
         return (
           <div>
             <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
               Structured tags (e.g. <code>SkinType:Oily</code>) help AI filters find your products during specific user searches.
             </p>
             {missingTags.length > 0 ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                 <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--warn)' }}>Missing Tags ({missingTags.length})</p>
                 <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {missingTags.slice(0, 10).map(p => (
                      <div key={p.id} style={{ padding: 10, borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)', fontSize: 12 }}>
                         {p.title}
                      </div>
                    ))}
                    {missingTags.length > 10 && <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>+ {missingTags.length - 10} more</p>}
                 </div>
               </div>
             ) : (
               <div style={{ padding: 20, borderRadius: 12, background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.1)', textAlign: 'center' }}>
                  <Zap size={24} color="var(--accent)" style={{ margin: '0 auto 10px' }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ok)' }}>Excellent tag coverage detected!</p>
               </div>
             )}
           </div>
         );
      default:
        return <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Detailed metrics for {dimension} are being calculated based on your catalog size.</p>;
    }
  };

  const isGood = score > 80;
  const isOk   = score > 50;
  const color  = isGood ? 'var(--ok)' : isOk ? 'var(--warn)' : 'var(--danger)';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 500, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '32px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 900, color: 'var(--text)', margin: 0 }}>{dimension}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
               <div style={{ width: 40, height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: color, width: `${score}%` }} />
               </div>
               <span style={{ fontSize: 14, fontWeight: 800, color }}>{score}/100</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: 24 }}>
           <div style={{ display: 'flex', gap: 12 }}>
              <Info size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>{reason}</p>
           </div>
        </div>

        <div style={{ marginBottom: 32 }}>
           {getDetails()}
        </div>

        <button 
          onClick={onClose}
          style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          Close Detail View
        </button>
      </div>
    </div>
  );
}
