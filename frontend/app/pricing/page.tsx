import Link from 'next/link';
import MarketingShell from '@/components/marketing/MarketingShell';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    note: 'forever',
    points: ['15 products/month', 'Baseline AI quick scan', 'Demo workspace access'],
  },
  { name: 'Starter', price: '$79', note: 'per month', points: ['100 products/month', 'Quick AI audit', 'Manual sync'] },
  { name: 'Growth', price: '$249', note: 'per month', points: ['2,000 products/month', 'Deep perception scan', 'Batch sync + policies'] },
  { name: 'Scale', price: 'Custom', note: 'annual', points: ['Unlimited catalogs', 'Priority pipeline', 'Dedicated tuning support'] },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <div className="sleek-submain subpage">
        <p className="sleek-eyebrow">PRICING</p>
        <h1>Simple plans for serious catalog teams.</h1>

        <section className="sleek-grid pricing-grid">
          {tiers.map((tier) => (
            <article key={tier.name} tabIndex={0}>
              <h3>{tier.name}</h3>
              <p className="price-line">
                {tier.price} <span>{tier.note}</span>
              </p>
              <ul>
                {tier.points.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/dashboard" className="sleek-btn solid" style={{ marginTop: 10 }}>
                Choose {tier.name}
              </Link>
            </article>
          ))}
        </section>
      </div>
    </MarketingShell>
  );
}
