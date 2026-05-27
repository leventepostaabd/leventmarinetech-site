import type { Metadata } from 'next';
import { getLocale, getTranslator } from '@/lib/i18n';
import { getProducts } from '@/lib/products-db';
import { SUPPLY_IMAGE } from '@/lib/deck-images';
import Link from 'next/link';
import EbayCatalogGrid from './EbayCatalogGrid';
import SourcingChannelTabs from './SourcingChannelTabs';
import ServiceImageDeck from '@/components/ServiceImageDeck';
import InlineHeader from '@/components/InlineHeader';

export const metadata: Metadata = {
  title: 'Marine Technical Supply — Live Quote-Only Catalog',
  description:
    'Find any marine electrical or mechanical part — live supplier-network search. Quote-only, no public prices. Marine Electric, General Electric, General Marine.',
  alternates: { canonical: '/supply' }
};

// Right-column deck: vertical brochure-style category images (user-prepared,
// captions on the artwork). Each item links into /supply/category/<slug>.
const SUPPLY_DECK: Array<{
  slug: string;
  image: string;
  name_en: string;
  name_tr: string;
  kicker_en: string;
  kicker_tr: string;
}> = [
  {
    slug: 'cables-glands',
    image: SUPPLY_IMAGE['cables-glands']!,
    name_en: 'Cables & Glands',
    name_tr: 'Kablo & Rakor',
    kicker_en: 'Lapp Olflex Marine · Hawke ATEX',
    kicker_tr: 'Lapp Olflex Marine · Hawke ATEX'
  },
  {
    slug: 'deck-mechanical',
    image: SUPPLY_IMAGE['deck-mechanical']!,
    name_en: 'Crane & Deck Hardware',
    name_tr: 'Vinç & Güverte Donanımı',
    kicker_en: 'MacGregor · NMF · Liebherr deck spares',
    kicker_tr: 'MacGregor · NMF · Liebherr güverte yedek'
  },
  {
    slug: 'engine-room-consumables',
    image: SUPPLY_IMAGE['engine-room-consumables']!,
    name_en: 'Engine Room Consumables',
    name_tr: 'Makine Dairesi Sarf',
    kicker_en: 'Level switches · gaskets · sealing kits',
    kicker_tr: 'Seviye anahtarı · conta · sızdırmazlık'
  },
  {
    slug: 'msb-components',
    image: SUPPLY_IMAGE['msb-components']!,
    name_en: 'MSB / ESB Components',
    name_tr: 'MSB / ESB Bileşenleri',
    kicker_en: 'AVR · ACB trip units · sync panels',
    kicker_tr: 'AVR · ACB trip ünitesi · senkron paneli'
  },
  {
    slug: 'motors-drives',
    image: SUPPLY_IMAGE['motors-drives']!,
    name_en: 'Motors & Drives (VFD)',
    name_tr: 'Motor & Sürücüler (VFD)',
    kicker_en: 'ABB M3BP · Vacon · Danfoss FC marine',
    kicker_tr: 'ABB M3BP · Vacon · Danfoss FC marine'
  },
  {
    slug: 'radar-navigation',
    image: SUPPLY_IMAGE['radar-navigation']!,
    name_en: 'Radar & Bridge Navigation',
    name_tr: 'Radar & Köprü Üstü Seyir',
    kicker_en: 'Furuno · JRC · Sperry — magnetrons, ECDIS',
    kicker_tr: 'Furuno · JRC · Sperry — magnetron, ECDIS'
  },
  {
    slug: 'automation-plc',
    image: SUPPLY_IMAGE['automation-plc']!,
    name_en: 'PLC & Automation',
    name_tr: 'PLC & Otomasyon',
    kicker_en: 'Siemens S7 · Allen-Bradley · Omron I/O',
    kicker_tr: 'Siemens S7 · Allen-Bradley · Omron I/O'
  },
  {
    slug: 'marine-sensors',
    image: SUPPLY_IMAGE['marine-sensors']!,
    name_en: 'Marine Sensors & Transmitters',
    name_tr: 'Denizcilik Sensör & Transmitter',
    kicker_en: 'Pressure · level · temperature · vibration',
    kicker_tr: 'Basınç · seviye · sıcaklık · titreşim'
  }
];

/**
 * /supply — live supplier catalog.
 *
 * Layout (2026-05-23):
 *   - Left column: fixed-top heading + 3 sourcing-channel tabs (sticky) over
 *     a scrolling eBay catalog grid.
 *   - Right column (lg+ only): vertical brochure deck mirroring /services —
 *     auto-cycles through 8 supply categories with deep-link to each.
 *   - SourcingChannelTabs registers a window-level drag-drop listener so a
 *     file dropped anywhere on the page opens the Upload-List modal with
 *     the file already attached.
 */
export const dynamic = 'force-dynamic';

export default async function SupplyIndex() {
  const locale = getLocale();
  const t = getTranslator(locale);

  const heroLine = t('supply.heroLine');
  const heroSub = t('supply.heroSub');

  const deckItems = SUPPLY_DECK.map((d) => ({
    slug: d.slug,
    image: d.image,
    name: t(`supply.deck.${d.slug}`),
    kicker: d.kicker_en
  }));

  // Our hand-curated marine catalog — the products we choose to sell. Shown
  // as the default grid and filtered client-side; the distributor live search
  // (Mouser etc.) is a separate fallback. Sourcing channel stays internal.
  const catalog = (await getProducts()).map((p) => ({
    slug: p.slug,
    name: (locale === 'tr' ? p.name_tr : p.name_en) ?? p.name,
    brand: p.brand ?? '',
    partNumber: p.partNumber ?? '',
    description:
      (locale === 'tr' ? p.description_tr : p.description_en) ?? p.shortDescription ?? '',
    image: p.image ?? '',
    in_stock: p.in_stock ?? p.availability === 'in-stock',
    price: p.price ?? null
  }));

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,30%)]">
      {/* LEFT — inline header + soft hero + channels + scrolling grid. */}
      <div
        className="flex h-full flex-col min-w-0 min-h-0"
        style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
      >
        {/* Fixed top — header, hero copy, action tiles. */}
        <div className="shrink-0 bg-white px-5 pb-3 md:px-10 md:pb-4">
          <InlineHeader locale={locale} />

          <section className="mt-1 mb-4 max-w-3xl md:mt-3 md:mb-5">
            <h1 className="font-head text-[26px] md:text-[36px] lg:text-[40px] font-extrabold leading-[1.1] tracking-[-0.01em] text-ink">
              {heroLine}
            </h1>
            <p className="mt-2.5 md:mt-3 text-[14.5px] md:text-[16px] leading-relaxed text-ink-muted max-w-2xl">
              {heroSub}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-muted">
              <span>{t('bridge.needService')}</span>
              <Link href="/service-wizard" className="font-semibold text-amber-600 no-underline hover:text-amber">
                {t('bridge.requestService')}
              </Link>
            </p>
          </section>

          <SourcingChannelTabs locale={locale} />
        </div>

        {/* Live grid (scrolls inside). */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 md:px-10 md:py-5"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 4.5rem)' }}
        >
          <EbayCatalogGrid locale={locale} catalog={catalog} />
        </div>
      </div>

      {/* RIGHT — full-bleed cycling deck (lg+ only). Runs edge-to-edge
          ceiling to floor; the transparent TopBar floats over the top of
          the artwork instead of pushing it down. */}
      <aside className="hidden lg:block h-screen">
        <ServiceImageDeck
          items={deckItems}
          locale={locale}
          fillParent
          ctaEnabled={false}
        />
      </aside>
    </div>
  );
}
