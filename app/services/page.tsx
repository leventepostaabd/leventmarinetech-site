import type { Metadata } from 'next';
import { readPopularServices, readServices, readServicesFile } from '@/lib/content';
import { getLocale, getTranslator } from '@/lib/i18n';
import { pick } from '@/lib/i18n-client';
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

  const t = getTranslator(locale);
  const ui = {
    search_placeholder: t('services.searchPlaceholder'),
    popular: t('services.mostRequested'),
    see_all: t('services.seeAll'),
    close: t('services.close'),
    no_matches: t('services.noMatches')
  };

  const deckItems = all
    .filter((s) => SERVICE_IMAGE[s.slug])
    .map((s) => ({
      slug: s.slug,
      image: SERVICE_IMAGE[s.slug],
      name: pick(s, 'name', locale),
      kicker: pick(s, 'kicker', locale)
    }));

  const heroLine = t('services.heroLine');
  const heroSub = t('services.heroSub');

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,30%)]">
      {/* Left — inline header + soft hero (fixed) + scrolling browser. */}
      <div
        className="flex h-full flex-col min-w-0 min-h-0"
        style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
      >
        {/* Fixed top — header + hero copy stay put while the list scrolls. */}
        <div className="shrink-0 bg-white px-5 pb-3 md:px-10 md:pb-4">
          <InlineHeader locale={locale} />

          <section className="mt-2 mb-1 max-w-3xl md:mt-3 md:mb-2">
            <h1 className="font-head text-[26px] md:text-[36px] lg:text-[40px] font-extrabold leading-[1.1] tracking-[-0.01em] text-ink">
              {heroLine}
            </h1>
            <p className="mt-2.5 md:mt-3 text-[14.5px] md:text-[16px] leading-relaxed text-ink-muted max-w-2xl">
              {heroSub}
            </p>
          </section>
        </div>

        {/* Browser (scrolls inside). */}
        <div
          className="flex-1 overflow-y-auto min-h-0 px-5 pb-5 md:px-10 md:pb-8"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 2rem)' }}
        >
          <ServicesBrowser services={all} popular={popular} ui={ui} locale={locale} />
        </div>
      </div>

      {/* Right — full-bleed cycling deck, edge to edge top→bottom. */}
      <aside className="hidden lg:block h-screen">
        <ServiceImageDeck items={deckItems} locale={locale} fillParent />
      </aside>
    </div>
  );
}
