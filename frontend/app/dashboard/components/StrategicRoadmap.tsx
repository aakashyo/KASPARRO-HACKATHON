'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertCircle, Clock, Zap, ShieldCheck, TrendingUp, Loader2 } from 'lucide-react';
import { pushFAQPage, previewFAQPage } from '@/lib/api';

export default function StrategicRoadmap({ 
  roadmap, 
  products, 
  onMegaSync,
  onShowPreview,
  onLoading
}: { 
  roadmap: any[], 
  products: any[], 
  onMegaSync: () => Promise<void>,
  onShowPreview: (preview: any) => void,
  onLoading: (loading: boolean) => void
}) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  const confirmPushFAQ = async () => {
    setLoadingAction('push_faq');
    onLoading(true);
    try {
      await pushFAQPage(products);
      setCompletedActions(prev => [...prev, 'push_faq']);
      alert("Success! Your AI Discovery Guide has been published to Shopify.");
      onShowPreview(null);
    } catch (err: any) {
      alert("Failed to build FAQ Guide: " + err.message);
    } finally {
      setLoadingAction(null);
      onLoading(false);
    }
  };

  const confirmMegaSync = async () => {
    setLoadingAction('mega_sync');
    onLoading(true);
    try {
      await onMegaSync();
      setCompletedActions(prev => prev.includes('mega_sync') ? prev : [...prev, 'mega_sync']);
      onShowPreview(null);
    } finally {
      setLoadingAction(null);
      onLoading(false);
    }
  };

  const confirmDeepAudit = async () => {
    setLoadingAction('deep_audit');
    onLoading(true);
    try {
      // For demo/hackathon, we'll simulate a re-audit by refreshing
      window.location.reload();
    } finally {
      setLoadingAction(null);
      onLoading(false);
    }
  };

  const handleAction = async (type: string) => {
    if (products.length > 0 && products[0].id.startsWith('demo-')) {
      alert("Demo Mode: This action is simulated. Connect your live store to publish to Shopify.");
      if (type === 'push_faq') setCompletedActions(prev => [...prev, 'push_faq']);
      if (type === 'mega_sync') setCompletedActions(prev => [...prev, 'mega_sync']);
      if (type === 'deep_audit') setCompletedActions(prev => [...prev, 'deep_audit']);
      return;
    }

    if (type === 'push_faq') {
      setLoadingAction('preview_faq');
      try {
        const { html } = await previewFAQPage(products);
        onShowPreview({
          isOpen: true,
          title: 'Review AI Discovery Guide',
          description: 'This page will be published as "AI Shopping Assistant Guide" in your Shopify pages.',
          contentType: 'faq',
          content: html,
          onConfirm: confirmPushFAQ
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

      onShowPreview({
        isOpen: true,
        title: 'Review Mega-Sync Fixes',
        description: `You are about to push AI-optimized descriptions and tags to ${safeFixes.length} products.`,
        contentType: 'bulk_fixes',
        content: safeFixes.map(p => ({
          title: p.title,
          description: p.audit_deep!.fixes!.improved_description,
          tags: (p.audit_deep!.fixes!.structured_tags || []).map((t: any) => typeof t === 'string' ? t : `${t.name}:${t.value}`)
        })),
        onConfirm: confirmMegaSync
      });
    } else if (type === 'deep_audit') {
      const pendingAudit = products.filter(p => !p.is_audited);
      const listToShow = pendingAudit.length > 0 ? pendingAudit : products.slice(0, 5);

      onShowPreview({
        isOpen: true,
        title: 'Queue Semantic Deep Audit',
        description: `This will trigger a deep AI analysis of ${pendingAudit.length || products.length} products to identify conversion gaps.`,
        contentType: 'audit_queue',
        content: listToShow.map(p => ({
          title: p.title,
          handle: p.handle,
          image: p.original_data?.image?.src || p.original_data?.image
        })),
        onConfirm: confirmDeepAudit
      });
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
