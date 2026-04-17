'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import GapView from './GapView';
import FixSuggestions from './FixSuggestions';

interface ProductCardProps {
  product: any;
  highlighted?: boolean;
}

export default function ProductCard({ product, highlighted = false }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState<'diagnosis' | 'fix'>('diagnosis');
  const { severity }    = product.gaps;

  const status = severity >= 7
    ? { label: 'Needs Urgent Fix', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.2)' }
    : severity >= 4
    ? { label: 'Can Be Improved',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' }
    : { label: 'Looking Good',     color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.2)' };

  const before = Math.round(product.impact.before_score * 100);
  const after  = Math.round(product.impact.after_score  * 100);

  return (
    <div style={{
      background: '#0e0e14',
      border: `1px solid ${highlighted ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <div
        style={{ padding: '16px 20px', cursor: 'pointer', transition: 'background 0.15s' }}
        onClick={() => setOpen(!open)}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {product.original_data?.image
                ? <img src={product.original_data.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(240,240,240,0.2)' }}>IMG</span>
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 3 }}>
                <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, color: '#f0f0f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.title}
                </p>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: status.bg, border: `1px solid ${status.border}`, color: status.color, flexShrink: 0, fontFamily: 'var(--font-head)', letterSpacing: '0.02em' }}>
                  {status.label}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(240,240,240,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.gaps.insight}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(240,240,240,0.25)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>{before}%</span>
              <ArrowRight size={11} style={{ color: 'rgba(240,240,240,0.2)' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', fontFamily: 'var(--font-mono)' }}>{after}%</span>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(240,240,240,0.3)' }}>
              {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ height: '100%', borderRadius: 99, background: status.color, width: `${before}%`, opacity: 0.6 }} />
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {(['diagnosis', 'fix'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '12px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid #c8f135' : '2px solid transparent', color: tab === t ? '#f0f0f0' : 'rgba(240,240,240,0.35)', fontFamily: 'var(--font-head)', transition: 'all 0.15s', letterSpacing: '0.01em' }}>
                {t === 'diagnosis' ? '🔍 What Is Wrong' : '✨ How To Fix It'}
              </button>
            ))}
          </div>

          <div style={{ padding: '20px 24px' }}>
            {tab === 'diagnosis' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(240,240,240,0.3)', marginBottom: 10, fontFamily: 'var(--font-head)' }}>What You're Selling</p>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(240,240,240,0.3)', marginBottom: 4 }}>Target Customer</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{product.intent.target_user}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(240,240,240,0.3)', marginBottom: 4 }}>Main Use Case</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{product.intent.use_case}</p>
                    </div>
                    {product.intent.key_attributes?.length > 0 && (
                      <div>
                        <p style={{ fontSize: 10, color: 'rgba(240,240,240,0.3)', marginBottom: 6 }}>Key Features</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {product.intent.key_attributes.map((a: string, i: number) => (
                            <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', fontFamily: 'var(--font-head)', fontWeight: 600 }}>{a}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(240,240,240,0.3)', marginBottom: 10, fontFamily: 'var(--font-head)' }}>How AI Sees It</p>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(240,240,240,0.3)', marginBottom: 4 }}>AI Summary</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0', lineHeight: 1.4 }}>{product.ai_perception.summary}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(240,240,240,0.3)', marginBottom: 6 }}>AI Confidence</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                          <div style={{ height: '100%', borderRadius: 99, width: `${product.ai_perception.confidence * 100}%`, background: product.ai_perception.confidence > 0.7 ? '#22c55e' : product.ai_perception.confidence > 0.4 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#f0f0f0', fontFamily: 'var(--font-mono)' }}>{Math.round(product.ai_perception.confidence * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(240,240,240,0.3)', marginBottom: 5 }}>Will AI Recommend?</p>
                      <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 99, fontWeight: 700, fontFamily: 'var(--font-head)', ...(product.ai_perception.recommendation === 'yes' ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' } : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }) }}>
                        {product.ai_perception.recommendation === 'yes' ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(240,240,240,0.3)', marginBottom: 10, fontFamily: 'var(--font-head)' }}>The Problems</p>
                  <GapView gaps={product.gaps} />
                </div>
              </div>
            )}
            {tab === 'fix' && <FixSuggestions fixes={product.fixes} />}
          </div>
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
