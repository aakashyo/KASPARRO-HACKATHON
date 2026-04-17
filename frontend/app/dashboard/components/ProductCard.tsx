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
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'fix'>('diagnosis');
  const severity = product.gaps.severity;

  const statusConfig = severity >= 7
    ? { label: 'Critical Gap', cls: 'badge-critical' }
    : severity >= 4
    ? { label: 'Needs Work', cls: 'badge-warning' }
    : { label: 'Optimized', cls: 'badge-success' };

  const confidenceBefore = Math.round(product.impact.before_score * 100);
  const confidenceAfter = Math.round(product.impact.after_score * 100);

  return (
    <div className={`card-static overflow-hidden ${highlighted ? 'border-[#f87171]/30' : ''}`}>

      <div
        className="px-5 py-4 cursor-pointer hover:bg-[#111118] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#1e1e2a] border border-[#2a2a3a] overflow-hidden flex-shrink-0 flex items-center justify-center">
              {product.original_data.image ? (
                <img src={product.original_data.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#3a3a4d] text-[9px] font-bold uppercase">IMG</div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <p className="font-semibold text-sm text-[#f0f0f5] truncate">{product.title}</p>
                <span className={`badge ${statusConfig.cls}`}>{statusConfig.label}</span>
              </div>
              <p className="text-xs text-[#6b6b80] mt-0.5 truncate">{product.gaps.insight}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <span className="stat-number text-[#6b6b80] line-through text-xs">{confidenceBefore}%</span>
              <ArrowRight size={12} className="text-[#3a3a4d]" />
              <span className="stat-number text-[#4ade80] font-bold">{confidenceAfter}%</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#1f1f2e] flex items-center justify-center text-[#6b6b80]">
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-[#1f1f2e] animate-fade-in">
          <div className="flex border-b border-[#1f1f2e]">
            {(['diagnosis', 'fix'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-xs font-semibold transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-[#f0f0f5] border-b-2 border-[#00d4ff]'
                    : 'text-[#6b6b80] hover:text-[#a0a0b8]'
                }`}
              >
                {tab === 'diagnosis' ? 'Gap Diagnosis' : 'Neural Fixes'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'diagnosis' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="space-y-3">
                  <p className="section-label flex items-center gap-1.5"><Target size={11} /> Merchant Intent</p>
                  <div className="bg-[#111118] border border-[#2a2a3a] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-[10px] text-[#6b6b80] mb-1">Target User</p>
                      <p className="text-xs font-medium text-[#f0f0f5]">{product.intent.target_user}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6b6b80] mb-1">Use Case</p>
                      <p className="text-xs font-medium text-[#f0f0f5]">{product.intent.use_case}</p>
                    </div>
                    {product.intent.key_attributes?.length > 0 && (
                      <div>
                        <p className="text-[10px] text-[#6b6b80] mb-1.5">Key Attributes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {product.intent.key_attributes.map((a: string, i: number) => (
                            <span key={i} className="badge badge-success">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="section-label flex items-center gap-1.5"><Eye size={11} /> AI Perception</p>
                  <div className="bg-[#111118] border border-[#2a2a3a] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-[10px] text-[#6b6b80] mb-1">Summary</p>
                      <p className="text-xs font-medium text-[#f0f0f5]">{product.ai_perception.summary}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6b6b80] mb-1">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#1f1f2e] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${product.ai_perception.confidence * 100}%`,
                              background: product.ai_perception.confidence > 0.7 ? '#4ade80' : product.ai_perception.confidence > 0.4 ? '#fbbf24' : '#f87171'
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#f0f0f5]">{Math.round(product.ai_perception.confidence * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6b6b80] mb-1">Will Recommend</p>
                      <span className={`badge ${product.ai_perception.recommendation === 'yes' ? 'badge-success' : 'badge-critical'}`}>
                        {product.ai_perception.recommendation === 'yes' ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="section-label flex items-center gap-1.5"><Brain size={11} /> Intelligence Gaps</p>
                  <GapView gaps={product.gaps} />
                </div>

              </div>
            )}

            {activeTab === 'fix' && (
              <FixSuggestions fixes={product.fixes} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
