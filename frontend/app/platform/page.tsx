import Link from 'next/link';
import MarketingShell from '@/components/marketing/MarketingShell';

export default function PlatformPage() {
  return (
    <MarketingShell>
      <div className="sleek-submain subpage">
        <p className="sleek-eyebrow">PLATFORM</p>
        <h1>Built like infrastructure, not a dashboard toy.</h1>
        <p className="sleek-copy">
          The platform runs a deterministic catalog sweep, deep LLM interpretation, trust guardrails, and safe sync
          pipelines in one flow.
        </p>

        <section className="sleek-grid">
          <article tabIndex={0}>
            <h3>Audit graph</h3>
            <p>Track confidence movement across products, policies, and metadata dependencies.</p>
            <Link href="/dashboard" className="sleek-inline-link">See graph in demo</Link>
          </article>
          <article tabIndex={0}>
            <h3>Fix simulator</h3>
            <p>Preview score impact before any mutation hits your storefront.</p>
            <Link href="/dashboard" className="sleek-inline-link">Run simulator</Link>
          </article>
          <article tabIndex={0}>
            <h3>Execution controls</h3>
            <p>Promote safe batches only when policy and trust thresholds pass.</p>
            <Link href="/dashboard" className="sleek-inline-link">Open execution panel</Link>
          </article>
        </section>
      </div>
    </MarketingShell>
  );
}
