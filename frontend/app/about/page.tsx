import MarketingShell from '@/components/marketing/MarketingShell';

export default function AboutPage() {
  return (
    <MarketingShell>
      <div className="sleek-submain subpage">
        <p className="sleek-eyebrow">ABOUT</p>
        <h1>We design for technical teams who care about ranking quality.</h1>
        <p className="sleek-copy">
          RepOptimizer was built for the Kasparro Hackathon Track 5 to solve one sharp problem: most catalogs read well
          to humans and poorly to machine recommenders.
        </p>

        <section className="sleek-grid">
          <article tabIndex={0}>
            <h3>Principle 1</h3>
            <p>Every insight must map to an executable fix.</p>
          </article>
          <article tabIndex={0}>
            <h3>Principle 2</h3>
            <p>Every fix must pass trust and policy checks.</p>
          </article>
          <article tabIndex={0}>
            <h3>Principle 3</h3>
            <p>Every release should improve recommendation confidence measurably.</p>
          </article>
        </section>
      </div>
    </MarketingShell>
  );
}
