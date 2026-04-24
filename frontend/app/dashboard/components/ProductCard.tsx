'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, ShieldCheck, AlertCircle, Zap, Target, MessageSquare, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GapView from './GapView';
import FixSuggestions from './FixSuggestions';

interface ProductCardProps {
  product: any;
  highlighted?: boolean;
  isDemo?: boolean;
}

export default function ProductCard({ product, highlighted = false, isDemo = false }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'audit' | 'logs' | 'fixes'>('audit');
  
  const scan = product.scan_quick;
  const audit = product.audit_deep;
  const isAudited = product.is_audited;

  const severity = isAudited ? (audit?.gaps?.severity ?? scan?.severity ?? 0) : (scan?.severity ?? 0);
  
  const status = severity >= 7
    ? { label: 'CRITICAL', color: 'var(--danger)', bg: 'var(--danger-soft)', border: 'var(--danger-border)' }
    : severity >= 4
    ? { label: 'WARNING', color: 'var(--warn)', bg: 'var(--warn-soft)', border: 'var(--warn-border)' }
    : { label: 'OPTIMIZED', color: 'var(--ok)', bg: 'var(--ok-soft)', border: 'var(--ok-border)' };

  const currentScore = isAudited ? Math.round((audit?.impact?.before_score ?? (scan?.quick_score / 100)) * 100) : scan?.quick_score;
  const targetScore = isAudited ? Math.round((audit?.impact?.after_score ?? 1) * 100) : 100;

  const gapsData = audit?.gaps || product.gaps || {};

  return (
    <motion.div 
      layout
      style={{
      background: 'var(--bg-card)',
      border: `1px solid ${highlighted ? 'var(--danger-border)' : 'var(--border)'}`,
      borderRadius: 18,
      overflow: 'hidden',
      transition: 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      ...(open && { boxShadow: '0 20px 40px -20px rgba(0,0,0,0.2), 0 0 20px var(--accent-glow)' })
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
          {isAudited ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Score</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-head)', color: 'var(--text)', lineHeight: 1 }}>{currentScore}</span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-head)', color: 'var(--accent)', lineHeight: 1 }}>{targetScore}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <Loader2 size={14} className="spin" color="var(--info)" />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--info)' }}>Awaiting Full Audit</span>
            </div>
          )}
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: open ? 'var(--bg-elevated)' : 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', transition: 'background 0.2s', border: '1px solid var(--border)' }}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>
    </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}
          >
          {!isAudited ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-card)' }}>
               <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-surface)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Loader2 size={18} className="animate-spin" color="var(--text-muted)" />
               </div>
               <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Deep intelligence processing...</p>
               <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Fast scan identified severity level {scan.severity}. Audit report arriving soon.</p>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px' }}>
                 {[
                   { id: 'audit', icon: Target, label: 'Gap Analysis' },
                   { id: 'fixes', icon: Zap, label: '1-Click Fix' },
                   { id: 'logs', icon: Info, label: 'Audit Payload' }
                 ].map(t => (
                   <button 
                     key={t.id} 
                     onClick={() => setTab(t.id as any)}
                     style={{ 
                       display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', background: 'none', border: 'none',
                       borderBottom: `2px solid ${tab === t.id ? 'var(--accent)' : 'transparent'}`,
                       color: tab === t.id ? 'var(--text)' : 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                     }}
                   >
                     <t.icon size={14} /> {t.label}
                   </button>
                 ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: 24, minHeight: 300 }}>
                 {tab === 'audit' && (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                     <GapView gaps={gapsData} severity={severity} isAudited={isAudited} />
                     
                     {isAudited && audit?.intent && (
                       <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
                         <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                           <Target size={14} color="var(--accent)" />
                           Merchant Intent vs AI Perception
                         </h4>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                           <div>
                             <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Expected User</p>
                             <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{audit.intent.target_user}</p>
                           </div>
                           <div>
                             <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>AI Perceived User</p>
                             <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--warn)' }}>{audit.ai_perception?.target_user || 'Unknown'}</p>
                           </div>
                         </div>
                         
                         <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed var(--border)' }}>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Missing Keywords critical for AI queries</p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {(audit.intent.important_keywords || []).map((k: string) => (
                                <span key={k} style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid var(--danger-border)' }}>
                                  {k}
                                </span>
                              ))}
                            </div>
                         </div>
                       </div>
                     )}

                     {product.guardrail && (
                       <div style={{ background: product.guardrail.is_safe ? 'var(--ok-soft)' : 'var(--danger-soft)', border: `1px solid ${product.guardrail.is_safe ? 'var(--ok-border)' : 'var(--danger-border)'}`, borderRadius: 12, padding: '16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                         {product.guardrail.is_safe ? <ShieldCheck size={20} color="var(--ok)" /> : <AlertCircle size={20} color="var(--danger)" />}
                         <div>
                           <p style={{ fontSize: 13, fontWeight: 700, color: product.guardrail.is_safe ? 'var(--ok)' : 'var(--danger)' }}>
                             {product.guardrail.is_safe ? 'Policy Guardrail Passed' : 'Policy Violation Detected'}
                           </p>
                           <p style={{ fontSize: 12, color: product.guardrail.is_safe ? 'var(--text-secondary)' : 'var(--danger)', marginTop: 4 }}>
                             {product.guardrail.reason}
                           </p>
                         </div>
                       </div>
                     )}
                   </div>
                 )}

                 {tab === 'logs' && (
                   <div style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                       <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>RAW_AUDIT_LOG.json</h4>
                     </div>
                     <pre style={{ 
                       margin: 0, 
                       fontFamily: 'var(--font-mono)', 
                       fontSize: 12, 
                       color: 'var(--info)', 
                       whiteSpace: 'pre-wrap', 
                       wordBreak: 'break-all',
                       maxHeight: 400,
                       overflowY: 'auto'
                     }}>
                       {JSON.stringify(isAudited ? audit : scan, null, 2)}
                     </pre>
                   </div>
                 )}

                 {tab === 'fixes' && <FixSuggestions fixes={audit?.fixes} productId={product.id} isDemo={isDemo} guardrail={product.guardrail} />}
              </div>
            </>
          )}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: ".animate-spin { animation: spin 1s linear infinite; }" }} />
    </motion.div>
  );
}
