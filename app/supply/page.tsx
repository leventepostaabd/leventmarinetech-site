import type { Metadata } from 'next';
import { getLocale } from '@/lib/i18n';
import { SUPPLY_IMAGE } from '@/lib/deck-images';
import EbayCatalogGrid from './EbayCatalogGrid';
import SourcingChannelTabs from './SourcingChannelTabs';
import ServiceImageDeck from '@/components/ServiceImageDeck';

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
export default function SupplyIndex() {
  const locale = getLocale();
  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  return (
    <div className="lm-screen bg-navy-50 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,30%)]">
      {/* LEFT — heading + tabs + scrolling grid */}
      <div className="flex flex-col min-w-0 min-h-0">
        {/* Fixed top — compact on phone, fuller on desktop. */}
        <div className="shrink-0 bg-white border-b border-line px-3 pt-3 pb-2 md:px-8 md:pt-5 md:pb-4">
          <div className="hidden md:block">
            <div className="kicker mb-1">
              {t('Marine technical supply', 'Marine teknik tedarik')}
            </div>
            <h1 className="text-[20px] md:text-[24px] leading-tight font-bold mb-2">
              {t(
                'Find any marine part — live supplier search.',
                'Her marine parça — canlı tedarik araması.'
              )}
            </h1>
          </div>

          <SourcingChannelTabs locale={locale} />
        </div>

        {/* Live grid (scrolls inside) */}
        <div className="lm-screen-body px-3 py-3 md:px-8 md:py-5">
          <EbayCatalogGrid locale={locale} />
        </div>
      </div>

      {/* RIGHT — full-bleed cycling deck (lg+ only). */}
      <aside className="hidden lg:block">
        <ServiceImageDeck
          items={SUPPLY_DECK}
          locale={locale}
          fillParent
          hrefPrefix="/supply/category/"
          readMoreLabel={{ en: 'Browse category', tr: 'Kategoriye git' }}
        />
      </aside>
    </div>
  );
}
