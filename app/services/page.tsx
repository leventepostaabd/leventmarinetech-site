import type { Metadata } from 'next';
import { readPopularServices, readServices, readServicesFile } from '@/lib/content';
import { getLocale } from '@/lib/i18n';
import ServicesBrowser from './ServicesBrowser';
import ServiceImageDeck from '@/components/ServiceImageDeck';

export const metadata: Metadata = {
  title: 'Marine Electrical Service — 19 Systems, 24/7 Worldwide | Levent Marine',
  description:
    'Pick the system that has the problem — generator, BWTS, fire alarm, bridge nav, PLC, crane, and 13 more. Three quick questions, then our next available technician calls you within 1 hour.',
  alternates: { canonical: '/services' }
};

// Maps system slug → vertical brochure-style deck image (user-prepared,
// captions already on the artwork). Eight systems covered; the rest of the
// 22 services are skipped from the deck and rely on the search/grid.
const SERVICE_IMAGE: Record<string, string> = {
  'bwts':                 '/services/bwts.webp',
  'engine-room-alarm':    '/services/condition.webp',
  'crane-deck-machinery': '/services/cranes.webp',
  'fire-alarm':           '/services/firealarm.webp',
  'generator':            '/services/gensyc.webp',
  'ac-dc-motor':          '/services/motor.webp',
  'plc-automation':       '/services/plc.webp',
  'switchboard':          '/services/thermal.webp'
};

export default function ServicesIndex() {
  const file = readServicesFile();
  const all = readServices();
  const popular = readPopularServices();
  const locale = getLocale();

  const ui = {
    search_placeholder:
      (locale === 'tr' ? file.ui.search_placeholder_tr : file.ui.search_placeholder_en) ??
      (locale === 'tr' ? 'Hangi sistemde sorun var?' : 'Which system has the problem?'),
    popular:
      (locale === 'tr' ? file.ui.popular_tr : file.ui.popular_en) ??
      (locale === 'tr' ? 'En sık talep' : 'Most requested'),
    see_all:
      (locale === 'tr' ? file.ui.see_all_tr : file.ui.see_all_en) ??
      (locale === 'tr' ? '19 sistemin tümünü gör' : 'See all 19 systems'),
    close: (locale === 'tr' ? file.ui.close_tr : file.ui.close_en) ?? (locale === 'tr' ? 'Kapat' : 'Close'),
    no_matches:
      (locale === 'tr' ? file.ui.no_matches_tr : file.ui.no_matches_en) ??
      (locale === 'tr' ? 'Eşleşen sistem yok.' : 'No system matches that search.')
  };

  const deckItems = all
    .filter((s) => SERVICE_IMAGE[s.slug])
    .map((s) => ({
      slug: s.slug,
      image: SERVICE_IMAGE[s.slug],
      name_en: s.name_en,
      name_tr: s.name_tr,
      kicker_en: s.kicker_en,
      kicker_tr: s.kicker_tr
    }));

  return (
    <div className="lm-screen-hero grid bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,30%)]">
      {/* Left — search + popular + see-all. No internal scroll. */}
      <div
        className="min-w-0 flex flex-col px-5 pb-5 md:px-10 md:pb-8"
        style={{ paddingTop: 'calc(var(--lm-topbar-h, 56px) + env(safe-area-inset-top, 0) + 1rem)' }}
      >
        <ServicesBrowser services={all} popular={popular} ui={ui} locale={locale} />
      </div>

      {/* Right — full-bleed cycling deck. */}
      <aside className="hidden lg:block">
        <ServiceImageDeck items={deckItems} locale={locale} fillParent />
      </aside>
    </div>
  );
}
