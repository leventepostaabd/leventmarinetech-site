import type { Metadata } from 'next';
import { Suspense } from 'react';
import ServiceWizardClient from './ServiceWizardClient';
import ServiceImageDeck from '@/components/ServiceImageDeck';
import InlineHeader from '@/components/InlineHeader';
import { readServices, readServicesFile } from '@/lib/content';
import { getLocale } from '@/lib/i18n';
import { pick } from '@/lib/i18n-client';
import { SERVICE_IMAGE } from '@/lib/deck-images';

export const metadata: Metadata = {
  title: 'Request Marine Electrical Service — 1-Hour Callback | Levent Marine',
  description:
    'Three quick questions — port, when, contact. Our next available technician will contact you within 1 hour. 24/7 worldwide.',
  alternates: { canonical: '/service-wizard' }
};

export default function Page() {
  const file = readServicesFile();
  const services = readServices();
  const locale = getLocale();

  const deckItems = services
    .filter((s) => SERVICE_IMAGE[s.slug])
    .map((s) => ({
      slug: s.slug,
      image: SERVICE_IMAGE[s.slug],
      name: pick(s, 'name', locale),
      kicker: pick(s, 'kicker', locale)
    }));

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,30%)]">
      {/* Left — inline header (matches /services and /supply, fixed) + request
          form that scrolls inside. The right artwork runs full bleed. */}
      <div
        className="flex h-full flex-col min-w-0 min-h-0"
        style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
      >
        <div className="shrink-0 bg-white px-5 md:px-10">
          <InlineHeader locale={locale} />
        </div>

        <div
          className="flex-1 overflow-y-auto min-h-0 px-5 pb-5 md:px-10 md:pb-8"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 2rem)' }}
        >
          <Suspense fallback={<div className="text-ink-subtle font-mono text-sm">Loading wizard…</div>}>
            <ServiceWizardClient
              services={services}
              usPorts={file.us_ports}
              locale={locale}
            />
          </Suspense>
        </div>
      </div>

      {/* Right — cycling service photos, edge to edge top→bottom. The
          TopBar floats transparently over the top of the artwork. */}
      <aside className="hidden lg:block h-screen">
        <ServiceImageDeck items={deckItems} locale={locale} fillParent />
      </aside>
    </div>
  );
}
