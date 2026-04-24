'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
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
  const severity = isAudited ? (audit?.gaps?.severity ?? scan?.severity ?? 0) : scan?.severity ?? 0;
  const currentScore = isAudited
    ? Math.round((audit?.impact?.before_score ?? scan?.quick_score / 100) * 100)
    : scan?.quick_score;
  const targetScore = isAudited ? Math.round((audit?.impact?.after_score ?? 1) * 100) : 100;
  const gapsData = audit?.gaps || product.gaps || {};

  const status =
    severity >= 7
      ? { label: 'Critical', color: 'var(--danger)', bg: 'var(--danger-soft)', border: 'var(--danger-border)' }
      : severity >= 4
        ? { label: 'Warning', color: 'var(--warn)', bg: 'var(--warn-soft)', border: 'var(--warn-border)' }
        : { label: 'Optimized', color: 'var(--ok)', bg: 'var(--ok-soft)', border: 'var(--ok-border)' };

  const tabs = [
    { id: 'audit', icon: Target, label: 'Gap analysis' },
    { id: 'fixes', icon: Zap, label: 'Fix plan' },
    { id: 'logs', icon: Info, label: 'Audit payload' },
  ] as const;

  const imageSrc = product.original_data?.image?.src || product.original_data?.image;

  return (
    <motion.div
      layout
      className="product-card"
      style={{
        borderColor: highlighted ? 'var(--danger-border)' : 'var(--border)',
        boxShadow: open
          ? '0 28px 60px rgba(0, 0, 0, 0.2), 0 0 28px var(--accent-glow)'
          : highlighted
            ? '0 18px 38px rgba(255, 107, 107, 0.08)'
            : 'none',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: '100%',
          border: 'none',
          background: 'transparent',
          padding: '20px 22px',
          color: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 1 320px', minWidth: 0 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {imageSrc ? (
                <img src={imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-faint)',
                    fontFamily: 'var(--font-head)',
                    fontWeight: 800,
                  }}
                >
                  AI
                </div>
              )}

              {isAudited && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#12141a',
                  }}
                >
                  <Zap size={10} />
                </div>
              )}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)' }}>{product.title}</h3>
                <span
                  className="chip"
                  style={{
                    background: status.bg,
                    borderColor: status.border,
                    color: status.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {status.label}
                </span>
              </div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  fontSize: '0.92rem',
                  maxWidth: 760,
                }}
              >
                {isAudited ? audit?.gaps?.insight || scan?.basic_gap : scan?.basic_gap}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              flex: '0 1 auto',
            }}
          >
            {isAudited ? (
              <div className="surface-muted" style={{ padding: '12px 14px', minWidth: 180 }}>
                <span className="section-kicker" style={{ marginBottom: 8 }}>
                  AI score shift
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.7rem', fontWeight: 900, fontFamily: 'var(--font-head)' }}>{currentScore}</span>
                  <ArrowRight size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '1.7rem', fontWeight: 900, fontFamily: 'var(--font-head)', color: 'var(--accent)' }}>
                    {targetScore}
                  </span>
                </div>
              </div>
            ) : (
              <div className="surface-muted" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Loader2 size={15} className="spin" color="var(--info)" />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--info)' }}>Awaiting deep audit</span>
              </div>
            )}

            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: open ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
                flexShrink: 0,
              }}
            >
              {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ borderTop: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-surface)' }}
          >
            {!isAudited ? (
              <div style={{ padding: 26, textAlign: 'center' }}>
                <div
                  className="surface-muted"
                  style={{
                    width: 58,
                    height: 58,
                    margin: '0 auto 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  <Loader2 size={22} className="spin" color="var(--text-muted)" />
                </div>
                <p style={{ fontWeight: 700, marginBottom: 6 }}>Deep intelligence processing...</p>
                <p className="faded-note">
                  Fast scan identified severity level {scan.severity}. The detailed audit payload will appear here once
                  analysis completes.
                </p>
              </div>
            ) : (
              <>
                <div className="tab-strip">
                  {tabs.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`tab-button ${tab === item.id ? 'tab-button--active' : ''}`}
                      onClick={() => setTab(item.id)}
                    >
                      <item.icon size={15} />
                      {item.label}
                    </button>
                  ))}
                </div>

                <div style={{ padding: 22 }}>
                  {tab === 'audit' && (
                    <div className="stack" style={{ gap: 20 }}>
                      <GapView gaps={gapsData} severity={severity} isAudited={isAudited} />

                      {audit?.intent && (
                        <div className="surface-muted" style={{ padding: 20 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <Target size={16} color="var(--accent)" />
                            <span className="section-kicker" style={{ marginBottom: 0 }}>
                              Merchant intent vs AI perception
                            </span>
                          </div>

                          <div className="detail-grid">
                            <div>
                              <span className="section-kicker" style={{ marginBottom: 8 }}>
                                Expected user
                              </span>
                              <p style={{ lineHeight: 1.6 }}>{audit.intent.target_user}</p>
                            </div>
                            <div>
                              <span className="section-kicker" style={{ marginBottom: 8 }}>
                                AI perceived user
                              </span>
                              <p style={{ lineHeight: 1.6, color: 'var(--warn)' }}>
                                {audit.ai_perception?.target_user || 'Unknown'}
                              </p>
                            </div>
                          </div>

                          {!!audit.intent.important_keywords?.length && (
                            <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px dashed var(--border)' }}>
                              <span className="section-kicker" style={{ marginBottom: 10 }}>
                                Missing keywords that matter to AI queries
                              </span>
                              <div className="chip-list">
                                {audit.intent.important_keywords.map((keyword: string) => (
                                  <span
                                    key={keyword}
                                    className="chip"
                                    style={{
                                      background: 'var(--danger-soft)',
                                      borderColor: 'var(--danger-border)',
                                      color: 'var(--danger)',
                                    }}
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {product.guardrail && (
                        <div
                          className="surface-muted"
                          style={{
                            padding: 18,
                            background: product.guardrail.is_safe ? 'var(--ok-soft)' : 'var(--danger-soft)',
                            borderColor: product.guardrail.is_safe ? 'var(--ok-border)' : 'var(--danger-border)',
                          }}
                        >
                          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            {product.guardrail.is_safe ? (
                              <ShieldCheck size={18} color="var(--ok)" style={{ flexShrink: 0, marginTop: 2 }} />
                            ) : (
                              <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                            )}
                            <div>
                              <p
                                style={{
                                  fontWeight: 800,
                                  marginBottom: 6,
                                  color: product.guardrail.is_safe ? 'var(--ok)' : 'var(--danger)',
                                }}
                              >
                                {product.guardrail.is_safe ? 'Policy guardrail passed' : 'Policy guardrail flagged risk'}
                              </p>
                              <p className="faded-note" style={{ color: 'inherit' }}>
                                {product.guardrail.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {tab === 'logs' && (
                    <div className="terminal-window">
                      <div className="terminal-header">
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          RAW_AUDIT_LOG.json
                        </span>
                        <span className="ghost-pill">Inspect raw payload</span>
                      </div>
                      <pre className="terminal-body">{JSON.stringify(isAudited ? audit : scan, null, 2)}</pre>
                    </div>
                  )}

                  {tab === 'fixes' && (
                    <FixSuggestions fixes={audit?.fixes} productId={product.id} isDemo={isDemo} guardrail={product.guardrail} />
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
