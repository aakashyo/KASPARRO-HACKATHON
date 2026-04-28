'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type MarketingShellProps = {
  children: ReactNode;
  showFooterCta?: boolean;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
};

const links = [
  { href: '/platform', label: 'Platform' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export default function MarketingShell({
  children,
  showFooterCta = true,
  primaryCtaHref = '/login',
  primaryCtaLabel = 'Start audit',
}: MarketingShellProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <div className="sleek-page" data-route={pathname}>
      <nav className="sleek-nav ready" aria-label="Primary navigation">
        <Link href="/" className="sleek-brand">
          <span className="sleek-brand-box">R</span>
          <span className="sleek-brand-text">RepOptimizer</span>
        </Link>

        <div className="sleek-links">
          {links.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="sleek-actions">
          <Link href={primaryCtaHref} className="sleek-btn solid">
            {primaryCtaLabel}
          </Link>
        </div>
      </nav>

      <AnimatePresence mode="wait" initial={!reducedMotion}>
        <motion.main
          key={pathname}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
          transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {showFooterCta && (
        <footer className="sleek-footer-cta">
          <div>
            <p className="sleek-eyebrow">READY TO IMPROVE AI VISIBILITY</p>
            <h3>Run a live catalog audit and ship safer fixes faster.</h3>
          </div>
          <Link href="/dashboard" className="sleek-btn solid big">
            Enter live workspace
          </Link>
        </footer>
      )}
    </div>
  );
}
