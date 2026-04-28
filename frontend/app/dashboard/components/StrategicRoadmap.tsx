'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertCircle, Clock, Zap, ShieldCheck, TrendingUp, Loader2 } from 'lucide-react';
import { pushFAQPage, previewFAQPage } from '@/lib/api';
import PreviewModal from './PreviewModal';

export default function StrategicRoadmap({ roadmap, products, onMegaSync }: { roadmap: any[], products: any[], onMegaSync: () => Promise<void> }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [preview, setPreview] = useState<{ isOpen: boolean; title: string; description: string; contentType: 'faq' | 'bulk_fixes'; content: any } | null>(null);

  const confirmPushFAQ = async () => {
    setLoadingAction('push_faq');
    try {
      await pushFAQPage(products);
      setCompletedActions(prev => [...prev, 'push_faq']);
      alert("Success! Your AI Discovery Guide has been published to Shopify.");
      setPreview(null);
    } catch (err: any) {
      alert("Failed to build FAQ Guide: " + err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const confirmMegaSync = async () => {
    setLoadingAction('mega_sync');
    try {
      await onMegaSync();
      setCompletedActions(prev => prev.includes('mega_sync') ? prev : [...prev, 'mega_sync']);
      setPreview(null);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAction = async (type: string) => {
    if (type === 'push_faq') {
      setLoadingAction('preview_faq');
      try {
        const { html } = await previewFAQPage(products);
        setPreview({
          isOpen: true,
          title: 'Review AI Discovery Guide',
          description: 'This page will be published as "AI Shopping Assistant Guide" in your Shopify pages.',
          contentType: 'faq',
          content: html
        });
      } catch (err: any) {
        alert("Failed to generate preview: " + err.message);
      } finally {
        setLoadingAction(null);
      }
    } else if (type === 'mega_sync') {
      const allFixable = products.filter(p => p.audit_deep && p.audit_deep.fixes);
      const safeFixes = allFixable.filter(p => !p.guardrail || p.guardrail.is_safe);
      
      if (safeFixes.length === 0) {
        alert("No AI fixes available to sync.");
        return;
      }

      setPreview({
        isOpen: true,
        title: 'Review Mega-Sync Fixes',
        description: `You are about to push AI-optimized descriptions and tags to ${safeFixes.length} products.`,
        contentType: 'bulk_fixes',
        content: safeFixes.map(p => ({
          title: p.title,
          description: p.audit_deep!.fixes!.improved_description,
          tags: (p.audit_deep!.fixes!.structured_tags || []).map((t: any) => typeof t === 'string' ? t : `${t.name}:${t.value}`)
        }))
      });
    } else if (type === 'deep_audit') {
      alert("Pro Tip: Start with Phase 1 and 2 to build the foundation before deep auditing all descriptions.");
    }
  };

  const getStatusIcon = (status: string, phase: string) => {
    if (completedActions.includes(phase)) return <CheckCircle2 size={16} color="#22c55e" />;
    if (status === 'critical') return <AlertCircle size={16} color="#ef4444" />;
    if (status === 'warning') return <Clock size={16} color="#f59e0b" />;
    return <CheckCircle2 size={16} color="#22c55e" />;
  };

  const getStatusLabel = (status: string, phase: string) => {
    if (completedActions.includes(phase)) return "COMPLETED";
    return status.toUpperCase();
  };

  return (
    <div className="panel chart-card" style={{ marginTop: 18, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ padding: 10, borderRadius: 12, background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
          <Compass size={20} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 18, color: 'var(--text)', margin: 0 }}>Strategic AI Growth Roadmap</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>A prioritized, 3-phase action plan to maximize your store AI-driven discoverability and conversion.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {roadmap.map((item) => (
          <div key={item.phase} className="surface-muted" style={{ position: 'relative', padding: 20, transition: 'all 0.2s', opacity: completedActions.includes(item.action_type) ? 0.7 : 1 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 999, background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                PHASE {item.phase}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: item.status === 'critical' && !completedActions.includes(item.action_type) ? '#ef4444' : 'var(--text-muted)' }}>
                {getStatusIcon(item.status, item.action_type)}
                {getStatusLabel(item.status, item.action_type)}
              </div>
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', margin: '0 0 8px 0', fontFamily: 'var(--font-head)' }}>{item.title}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16, minHeight: 36 }}>{item.task}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Est. Impact</span>
                <span style={{ fontSize: 11, color: 'var(--text)', fontWeight: 700 }}>{item.impact}</span>
              </div>
            </div>

            <button
              onClick={() => handleAction(item.action_type)}
              disabled={loadingAction !== null || completedActions.includes(item.action_type)}
              style={{ width: '100%', background: completedActions.includes(item.action_type) ? 'transparent' : 'var(--accent)', color: completedActions.includes(item.action_type) ? 'var(--ok)' : '#08080c', border: completedActions.includes(item.action_type) ? '1px solid var(--ok)' : 'none', borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700, cursor: completedActions.includes(item.action_type) ? 'default' : 'pointer', fontFamily: 'var(--font-head)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
            >
              {loadingAction === item.action_type ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : (
                <>
                  {completedActions.includes(item.action_type) ? <CheckCircle2 size={14} /> : phaseIcons[item.action_type]}
                  {completedActions.includes(item.action_type) ? 'DONE' : phaseButtonLabels[item.action_type]}
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      
      {preview && (
        <PreviewModal 
          isOpen={preview.isOpen}
          onClose={() => setPreview(null)}
          onConfirm={preview.contentType === 'faq' ? confirmPushFAQ : confirmMegaSync}
          title={preview.title}
          description={preview.description}
          contentType={preview.contentType}
          content={preview.content}
          loading={loadingAction !== null}
        />
      )}
    </div>
  );
}

const phaseIcons: Record<string, any> = {
  push_faq: <ShieldCheck size={14} />,
  mega_sync: <Zap size={14} />,
  deep_audit: <TrendingUp size={14} />
};

const phaseButtonLabels: Record<string, string> = {
  push_faq: "Build Trust Guide",
  mega_sync: "Execute Sync",
  deep_audit: "Start Audit"
};
