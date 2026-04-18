'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, ShieldCheck, AlertCircle, Zap, Target, MessageSquare, Info, Loader2 } from 'lucide-react';
import GapView from './GapView';
import FixSuggestions from './FixSuggestions';

interface ProductCardProps {
  product: any;
  highlighted?: boolean;
}

export default function ProductCard({ product, highlighted = false }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'audit' | 'logs' | 'fixes'>('audit');
  
  const scan = product.scan_quick;
  const audit = product.audit_deep;
  const isAudited = product.is_audited;

  const severity = isAudited ? (audit?.gaps?.severity ?? scan?.severity ?? 0) : (scan?.severity ?? 0);
  
  const status = severity >= 7
    ? { label: 'CRITICAL', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' }
    : severity >= 4
    ? { label: 'WARNING', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' }
    : { label: 'OPTIMIZED', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' };

  const currentScore = isAudited ? Math.round((audit?.impact?.before_score ?? (scan?.quick_score / 100)) * 100) : scan?.quick_score;
  const targetScore = isAudited ? Math.round((audit?.impact?.after_score ?? 1) * 100) : 100;

  return (
    <div style={{
      background: '#0e0e14',
      border: `1px solid ${highlighted ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 18,
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      ...(open && { boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5), 0 0 20px rgba(200,241,53,0.03)' })
    }}>
      {/* Header Bar */}
      <div
        style={{ padding: '18px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
             {product.original_data?.image?.src || product.original_data?.image
               ? <img src={product.original_data.image.src || product.original_data.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontSize: 10, fontWeight: 800 }}>AI</div>
             }
             {isAudited && (
               <div style={{ position: 'absolute', top: 0, right: 0, padding: 2, background: '#c8f135', borderRadius: '0 0 0 4px' }}>
                 <Zap size={8} color="#08080c" />
               </div>
             )}
          </div>
          
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</h3>
              <span style={{ fontSize: 9, fontWeight: 900, padding: '2px 8px', borderRadius: 6, background: status.bg, border: `1px solid ${status.border}`, color: status.color, letterSpacing: '0.05em' }}>{status.label}</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isAudited ? (audit?.gaps?.insight || scan?.basic_gap) : scan?.basic_gap}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 2 }}>Current Readiness</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: currentScore < 50 ? '#ef4444' : '#f59e0b', fontFamily: 'var(--font-mono)' }}>{currentScore}%</span>
                <ArrowRight size={10} color="rgba(255,255,255,0.1)" />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: 'var(--font-mono)' }}>{targetScore}%</span>
              </div>
            </div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {open && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'slideDown 0.3s ease' }}>
          {!isAudited ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(0,0,0,0.1)' }}>
               <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Loader2 size={18} className="animate-spin" color="rgba(255,255,255,0.2)" />
               </div>
               <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Deep intelligence processing...</p>
               <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>Fast scan identified severity level {scan.severity}. Audit report arriving soon.</p>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                 {[
                   { id: 'audit', label: 'Audit Report', icon: <ShieldCheck size={14} /> },
                   { id: 'logs', label: 'AI Reasoning', icon: <MessageSquare size={14} /> },
                   { id: 'fixes', label: 'Fix Pipeline', icon: < Zap size={14} /> }
                 ].map(t => (
                   <button 
                     key={t.id} 
                     onClick={() => setTab(t.id as any)}
                     style={{ 
                       flex: 1, padding: '14px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                       display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, fontWeight: 700,
                       color: tab === t.id ? '#c8f135' : 'rgba(255,255,255,0.3)', borderBottom: `2px solid ${tab === t.id ? '#c8f135' : 'transparent'}`,
                       transition: 'all 0.2s', fontFamily: 'var(--font-head)'
                     }}
                   >
                     {t.icon} {t.label}
                   </button>
                 ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: '24px' }}>
                 {tab === 'audit' && (
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                           <p style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Target size={12} /> Merchant Intent</p>
                           <div style={{ display: 'grid', gap: 10 }}>
                             <div>
                               <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 2 }}>Target Demographic</p>
                               <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{audit?.intent?.target_user || 'Detecting...'}</p>
                             </div>
                             <div>
                               <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 2 }}>Primary Use Case</p>
                               <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{audit?.intent?.use_case || 'Analyzing...'}</p>
                             </div>
                           </div>
                        </div>
                        <div style={{ padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                           <p style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Info size={12} /> Impact Analysis</p>
                           <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{audit?.impact?.detailed_impact || 'Calculating impact trajectory...'}</p>
                        </div>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <GapView gaps={audit?.gaps} />
                        <div style={{ padding: '16px', borderRadius: 16, background: status.bg, border: `1px solid ${status.border}` }}>
                           <p style={{ fontSize: 10, fontWeight: 800, color: status.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>DIAGNOSTIC INSIGHT</p>
                           <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0', lineHeight: 1.5 }}>{audit?.gaps?.detailed_explanation || audit?.gaps?.insight || 'Preparing diagnostic report...'}</p>
                        </div>
                     </div>
                   </div>
                 )}

                 {tab === 'logs' && (
                   <div style={{ background: '#000', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>AI_PERCEPTION_LOG_v1.0.43</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                        </div>
                      </div>
                      <div style={{ padding: '20px', fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7, color: '#c8f135', background: 'rgba(200,241,53,0.02)' }}>
                        <p style={{ color: 'rgba(255,255,255,0.3)' }}>// Simulating AI Agent reasoning process...</p>
                        <p style={{ marginTop: 8 }}>{audit?.ai_perception?.detailed_reasoning || 'Processing perception model logs...'}</p>
                        <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.3)' }}>// Evaluation Conclusion:</p>
                        <p style={{ color: audit?.ai_perception?.recommendation === 'yes' ? '#22c55e' : '#ef4444' }}>
                           &gt; Recommendation: {audit?.ai_perception?.recommendation?.toUpperCase() || 'EVALUATING'} ({Math.round((audit?.ai_perception?.confidence || 0) * 100)}% Confidence)
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>&gt; Reason: {audit?.ai_perception?.reason || 'Synthesizing final verdict...'}</p>
                      </div>
                   </div>
                 )}

                 {tab === 'fixes' && <FixSuggestions fixes={audit?.fixes} />}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
