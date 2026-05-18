import type { Metadata } from 'next';
import { Suspense } from 'react';
import SupplyWizardClient from './SupplyWizardClient';

export const metadata: Metadata = {
  title: 'Request a Quote — Marine Parts Supply',
  description: 'Tell us the brand, part number, vessel and port. We come back the same business day with availability, lead time, and an engineering note for equivalents.',
  alternates: { canonical: '/supply-wizard' }
};

export default function Page() {
  return (
    <div className="container-x py-12 md:py-16">
      <nav className="text-[12px] font-mono text-ink-subtle mb-4">
        <a href="/" className="hover:text-amber-600 no-underline">Home</a>
        <span className="mx-2">/</span>
        <span>Request a quote</span>
      </nav>
      <div className="kicker mb-3">Supply intake</div>
      <h1 className="mb-3">Request a quote.</h1>
      <p className="text-ink-muted max-w-2xl mb-10">Brand, part number, vessel, port, urgency. Photo of the nameplate works too — bottom of step 2.</p>
      <Suspense fallback={<div className="text-ink-subtle font-mono text-sm">Loading wizard…</div>}>
        <SupplyWizardClient />
      </Suspense>
    </div>
  );
}
