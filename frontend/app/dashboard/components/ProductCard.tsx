'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, Brain, Target, Eye } from 'lucide-react';
import GapView from './GapView';
import FixSuggestions from './FixSuggestions';

interface ProductCardProps {
  product: any;
  highlighted?: boolean;
}

export default function ProductCard({ product, highlighted = false }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'diagnosis' | 'fix'>('diagnosis');
  const severity = product.gaps.severity;

  const pillCls = severity >= 7 ? 'pill pill-danger' : severity >= 4 ? 'pill pill-warn' : 'pill pill-ok';
  const pillLabel = severity >= 7 ? 'critical gap' : severity >= 4 ? 'needs work' : 'optimized';

  const before = Math.round(product.impact.before_score * 100);
  const after  = Math.round(product.impact.after_score  * 100);

  const borderColor = highlighted
    ? 'color-mix(in srgb, var(--danger) 30%, transparent)'
    : 'var(--border)';

  return (
    <div style={{ background: 'var(--bg-card)', border: `1.5px solid ${borderColor}`, borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.2s' }}>

      <div
        className="px-5 py-4 cursor-pointer transition-colors"
        style={{ transition: 'background 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        onClick={() => setOpen(!open)}
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-[14px] overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1.5px solid var(--border)' }}>
              {product.original_data.image
                ? <img src={product.original_data.image} alt="" className="w-full h-full object-cover" />
                : <span className="text-[9px] font-bold" style={{ color: 'var(--text-faint)' }}>IMG</span>
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-sm lowercase truncate" style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--text)' }}>
                  {product.title.toLowerCase()}
                </p>
                <span className={pillCls}>{pillLabel}</span>
              </div>
              <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-subtle)' }}>{product.gaps.insight}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="line-through text-xs" style={{ color: 'var(--text-faint)' }}>{before}%</span>
              <ArrowRight size={11} style={{ color: 'var(--text-faint)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--ok)', fontFamily: 'var(--font-montserrat)' }}>{after}%</span>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', color: 'var(--text-subtle)' }}>
              {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1.5px solid var(--border)' }} className="anim-fade-in">
          <div className="flex" style={{ borderBottom: '1.5px solid var(--border)' }}>
            {(['diagnosis', 'fix'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-3 text-xs font-semibold lowercase transition-colors"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  color: tab === t ? 'var(--text)' : 'var(--text-subtle)',
                  borderBottom: tab === t ? `2px solid var(--accent)` : '2px solid transparent',
                }}
              >
                {t === 'diagnosis' ? 'what is wrong' : 'how to fix it'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'diagnosis' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="space-y-2">
                  <p className="label flex items-center gap-1.5"><Target size={10} />merchant intent</p>
                  <div className="p-4 space-y-3" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', borderRadius: 14 }}>
                    <div>
                      <p className="text-[10px] mb-1" style={{ color: 'var(--text-subtle)' }}>target user</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{product.intent.target_user}</p>
                    </div>
                    <div>
                      <p className="text-[10px] mb-1" style={{ color: 'var(--text-subtle)' }}>use case</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{product.intent.use_case}</p>
                    </div>
                    {product.intent.key_attributes?.length > 0 && (
                      <div>
                        <p className="text-[10px] mb-1.5" style={{ color: 'var(--text-subtle)' }}>key attributes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {product.intent.key_attributes.map((a: string, i: number) => (
                            <span key={i} className="pill pill-ok">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="label flex items-center gap-1.5"><Eye size={10} />ai perception</p>
                  <div className="p-4 space-y-3" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border)', borderRadius: 14 }}>
                    <div>
                      <p className="text-[10px] mb-1" style={{ color: 'var(--text-subtle)' }}>summary</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{product.ai_perception.summary}</p>
                    </div>
                    <div>
                      <p className="text-[10px] mb-1.5" style={{ color: 'var(--text-subtle)' }}>confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${product.ai_perception.confidence * 100}%`,
                              background: product.ai_perception.confidence > 0.7 ? 'var(--ok)' : product.ai_perception.confidence > 0.4 ? 'var(--warn)' : 'var(--danger)'
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-montserrat)' }}>
                          {Math.round(product.ai_perception.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] mb-1" style={{ color: 'var(--text-subtle)' }}>will recommend</p>
                      <span className={product.ai_perception.recommendation === 'yes' ? 'pill pill-ok' : 'pill pill-danger'}>
                        {product.ai_perception.recommendation === 'yes' ? 'yes' : 'no'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="label flex items-center gap-1.5"><Brain size={10} />intelligence gaps</p>
                  <GapView gaps={product.gaps} />
                </div>

              </div>
            )}
            {tab === 'fix' && <FixSuggestions fixes={product.fixes} />}
          </div>
        </div>
      )}
    </div>
  );
}
