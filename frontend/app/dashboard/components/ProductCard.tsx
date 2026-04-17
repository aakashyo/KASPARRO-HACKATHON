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

  const statusConfig = severity >= 7
    ? { label: 'Needs Urgent Fix', cls: 'pill-danger', bar: 'var(--danger)' }
    : severity >= 4
    ? { label: 'Can Be Improved', cls: 'pill-warn',   bar: 'var(--warn)'   }
    : { label: 'Looking Good',    cls: 'pill-ok',     bar: 'var(--ok)'     };

  const before = Math.round(product.impact.before_score * 100);
  const after  = Math.round(product.impact.after_score  * 100);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${highlighted ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
      }}
    >
      <div
        className="px-5 py-4 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
        style={{ transition: 'background 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              {product.original_data?.image
                ? <img src={product.original_data.image} alt="" className="w-full h-full object-cover" />
                : <span className="text-[10px] font-bold text-[var(--text-faint)]">IMG</span>
              }
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-0.5">
                <p className="font-bold text-[14px] truncate" style={{ fontFamily: 'var(--font-head)' }}>
                  {product.title}
                </p>
                <span className={`pill ${statusConfig.cls}`}>{statusConfig.label}</span>
              </div>
              <p className="text-[12px] text-[var(--text-muted)] truncate">{product.gaps.insight}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-[var(--text-faint)] line-through">{before}%</span>
              <ArrowRight size={11} className="text-[var(--text-faint)]" />
              <span className="text-sm font-bold" style={{ color: 'var(--ok)', fontFamily: 'var(--font-head)' }}>{after}%</span>
            </div>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              {open ? <ChevronUp size={14} className="text-[var(--text-muted)]" /> : <ChevronDown size={14} className="text-[var(--text-muted)]" />}
            </div>
          </div>
        </div>

        <div className="mt-3 progress-bar" style={{ height: 3 }}>
          <div className="progress-bar-fill" style={{ width: `${before}%`, background: statusConfig.bar }} />
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)' }} className="anim-fade-in">
          <div className="flex" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            {(['diagnosis', 'fix'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-3 text-[12px] font-semibold transition-all relative"
                style={{
                  fontFamily: 'var(--font-head)',
                  color: tab === t ? 'var(--text)' : 'var(--text-muted)',
                }}
              >
                {t === 'diagnosis' ? '🔍 What Is Wrong' : '✨ How To Fix It'}
                {tab === t && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--accent)' }} />
                )}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === 'diagnosis' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5" style={{ fontFamily: 'var(--font-head)' }}>
                    <Target size={10} /> What You're Selling
                  </p>
                  <div className="p-3.5 rounded-xl space-y-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <div>
                      <p className="text-[10px] text-[var(--text-faint)] mb-1">Target Customer</p>
                      <p className="text-[12px] font-medium text-[var(--text)]">{product.intent.target_user}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--text-faint)] mb-1">Main Use Case</p>
                      <p className="text-[12px] font-medium text-[var(--text)]">{product.intent.use_case}</p>
                    </div>
                    {product.intent.key_attributes?.length > 0 && (
                      <div>
                        <p className="text-[10px] text-[var(--text-faint)] mb-1.5">Key Features</p>
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
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5" style={{ fontFamily: 'var(--font-head)' }}>
                    <Eye size={10} /> How AI Sees It
                  </p>
                  <div className="p-3.5 rounded-xl space-y-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <div>
                      <p className="text-[10px] text-[var(--text-faint)] mb-1">AI Summary</p>
                      <p className="text-[12px] font-medium text-[var(--text)]">{product.ai_perception.summary}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--text-faint)] mb-1.5">AI Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 progress-bar" style={{ height: 5 }}>
                          <div className="progress-bar-fill" style={{
                            width: `${product.ai_perception.confidence * 100}%`,
                            background: product.ai_perception.confidence > 0.7 ? 'var(--ok)' : product.ai_perception.confidence > 0.4 ? 'var(--warn)' : 'var(--danger)'
                          }} />
                        </div>
                        <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-head)', color: 'var(--text)' }}>
                          {Math.round(product.ai_perception.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--text-faint)] mb-1">Will AI Recommend It?</p>
                      <span className={`pill ${product.ai_perception.recommendation === 'yes' ? 'pill-ok' : 'pill-danger'}`}>
                        {product.ai_perception.recommendation === 'yes' ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5" style={{ fontFamily: 'var(--font-head)' }}>
                    <Brain size={10} /> The Problems
                  </p>
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
