import type { Metadata } from 'next';
import { readPopularServices, readServices, readServicesFile } from '@/lib/content';
import { getLocale } from '@/lib/i18n';
import { SERVICE_IMAGE } from '@/lib/deck-images';
import ServicesBrowser from './ServicesBrowser';
import ServiceImageDeck from '@/components/ServiceImageDeck';
import InlineHeader from '@/components/InlineHeader';

export const metadata: Metadata = {
  title: 'Marine Electrical Service — 19 Systems, 24/7 Worldwide | Levent Marine',
  description:
    'Pick the system that has the problem — generator, BWTS, fire alarm, bridge nav, PLC, crane, and 13 more. Three quick questions, then our next available technician calls you within 1 hour.',
  alternates: { canonical: '/services' }
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

  const heroLine = locale === 'tr'
    ? 'Florida merkezli marine elektrik servisi. Her ABD limanına 7/24.'
    : 'Florida-based marine electrical service. Every US port, 24/7.';
  const heroSub = locale === 'tr'
    ? '24/7 — Wyoming LLC, Florida operasyon. Hangi sistem arızalı?'
    : '24/7 — Wyoming LLC, Florida ops. Which system has the problem?';

  return (
    <div className="lm-screen-hero grid bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,30%)]">
      {/* Left — inline header + soft hero + browser. */}
      <div
        className="min-w-0 flex flex-col px-5 pb-5 md:px-10 md:pb-8"
        style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
      >
        <InlineHeader locale={locale} />

        <section className="mt-2 md:mt-4 max-w-3xl">
          <h1 className="font-head text-[28px] md:text-[40px] lg:text-[44px] font-extrabold leading-[1.1] tracking-[-0.01em] text-ink">
            {heroLine}
          </h1>
          <p className="mt-3 md:mt-4 text-[15px] md:text-[16.5px] leading-relaxed text-ink-muted max-w-2xl">
            {heroSub}
          </p>
        </section>

        <ServicesBrowser services={all} popular={popular} ui={ui} locale={locale} />
      </div>

      {/* Right — full-bleed cycling deck, edge to edge top→bottom. */}
      <aside className="hidden lg:block">
        <ServiceImageDeck items={deckItems} locale={locale} fillParent />
      </aside>
    </div>
  );
}
