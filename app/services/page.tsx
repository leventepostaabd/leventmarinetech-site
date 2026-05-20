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

/**
 * Map service slug → public image path for systems whose Gemini photo
 * has landed. Slugs without an entry fall back to a placeholder bg in
 * the deck (they're filtered out below to keep the deck cinematic).
 */
const SERVICE_IMAGE: Record<string, string> = {
  generator: '/services/01-generator.jpg',
  'main-engine-electrical': '/services/02-main-engine.jpg',
  'fire-alarm': '/services/04-fire-alarm.jpg',
  'engine-room-alarm': '/services/05-er-alarm.jpg',
  'bridge-navigation': '/services/06-bridge-nav.jpg',
  'gmdss-communication': '/services/07-gmdss.jpg',
  'crane-deck-machinery': '/services/09-crane.jpg',
  'shaft-earthing': '/services/11-shaft-earthing.jpg',
  'plc-automation': '/services/12-plc-automation.jpg',
  'lighting-nav-lights': '/services/13-lighting.jpg',
  'ac-dc-motor': '/services/17-ac-dc-motor.jpg',
  'hvac-automation': '/services/18-hvac-automation.jpg'
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
    popular: (locale === 'tr' ? file.ui.popular_tr : file.ui.popular_en) ?? (locale === 'tr' ? 'En sık talep' : 'Most requested'),
    see_all: (locale === 'tr' ? file.ui.see_all_tr : file.ui.see_all_en) ?? (locale === 'tr' ? '19 sistemin tümünü gör' : 'See all 19 systems'),
    close: (locale === 'tr' ? file.ui.close_tr : file.ui.close_en) ?? (locale === 'tr' ? 'Kapat' : 'Close'),
    no_matches: (locale === 'tr' ? file.ui.no_matches_tr : file.ui.no_matches_en) ?? (locale === 'tr' ? 'Eşleşen sistem yok.' : 'No system matches that search.')
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
    <div className="container-x py-12 md:py-16">
      <div className="kicker mb-3">{locale === 'tr' ? 'Servis kataloğu' : 'Service catalog'}</div>
      <h1 className="mb-3 text-balance max-w-3xl">
        {locale === 'tr'
          ? 'Denizcilik elektrik servisi — 19 sistem, tek arama.'
          : 'Marine electrical service — 19 systems, one call.'}
      </h1>
      <p className="text-ink-muted max-w-2xl text-[16px] leading-relaxed">
        {locale === 'tr'
          ? 'Sorun olan sistemi seç. Üç hızlı soru — liman, ne zaman, iletişim — sonra ilk müsait teknisyenimiz 1 saat içinde seni arar.'
          : 'Pick the system that has the problem. Three quick questions — port, when, contact — and our next available technician will call you within 1 hour.'}
      </p>

      {/* Two-column layout: browser left, image deck right (desktop). */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="min-w-0">
          <ServicesBrowser services={all} popular={popular} ui={ui} locale={locale} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="kicker mb-3 text-amber-600">
              {locale === 'tr' ? 'Sahadan' : 'From the field'}
            </div>
            <ServiceImageDeck items={deckItems} locale={locale} />
            <p className="mt-4 text-[12.5px] text-ink-subtle leading-relaxed">
              {locale === 'tr'
                ? 'Her sistemde gerçek iş — class‑uyumlu rapor, ETO standardında müdahale.'
                : 'Real work on every system — class-compliant reports, ETO-standard intervention.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
