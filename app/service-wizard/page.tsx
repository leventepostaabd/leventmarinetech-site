import type { Metadata } from 'next';
import { Suspense } from 'react';
import ServiceWizardClient from './ServiceWizardClient';

export const metadata: Metadata = {
  title: 'Request Service — Marine Electrical',
  description: 'Multi-step intake for marine electrical service requests. Vessel, port, problem, urgency, contact — same business day response.',
  alternates: { canonical: '/service-wizard' }
};

export default function Page() {
  return (
    <div className="container-x py-12 md:py-16">
      <nav className="text-[12px] font-mono text-ink-subtle mb-4">
        <a href="/" className="hover:text-amber-600 no-underline">Home</a>
        <span className="mx-2">/</span>
        <span>Service request</span>
      </nav>
      <div className="kicker mb-3">Service intake</div>
      <h1 className="mb-3">Request marine electrical service.</h1>
      <p className="text-ink-muted max-w-2xl mb-10">Seven quick steps. Anything ambiguous — leave it blank, we'll ask. Auto-routed to the right engineer within the business day.</p>
      <Suspense fallback={<div className="text-ink-subtle font-mono text-sm">Loading wizard…</div>}>
        <ServiceWizardClient />
      </Suspense>
    </div>
  );
}
