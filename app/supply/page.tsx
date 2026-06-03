import type { Metadata } from 'next';
import { getLocale, getTranslator } from '@/lib/i18n';
import { getProducts } from '@/lib/products-db';
import { SUPPLY_IMAGE } from '@/lib/deck-images';
import SupplyShell from './SupplyShell';
import SupplyCategoryAside, { type CatItem } from './SupplyCategoryAside';

export const metadata: Metadata = {
  title: 'Marine Technical Supply — Live Quote-Only Catalog',
  description:
    'Find any marine electrical or mechanical part — live supplier-network search across our stock plus Mouser and Digi-Key. Quote-only, no public prices.',
  alternates: { canonical: '/supply' }
};

// Categories shown in the soft rotating aside (deep-link into each listing).
const SUPPLY_CATS: { slug: string; name_en: string; name_tr: string; makers: string }[] = [
  { slug: 'cables-glands',            name_en: 'Cables & Glands',              name_tr: 'Kablo & Rakor',                  makers: 'Lapp Ölflex Marine · Hawke ATEX' },
  { slug: 'msb-components',           name_en: 'MSB / ESB Components',          name_tr: 'MSB / ESB Bileşenleri',           makers: 'AVR · ACB trip units · sync panels' },
  { slug: 'motors-drives',           name_en: 'Motors & Drives (VFD)',         name_tr: 'Motor & Sürücüler (VFD)',         makers: 'ABB M3BP · Vacon · Danfoss FC' },
  { slug: 'automation-plc',          name_en: 'PLC & Automation',              name_tr: 'PLC & Otomasyon',                 makers: 'Siemens S7 · Allen-Bradley · Omron' },
  { slug: 'marine-sensors',          name_en: 'Marine Sensors & Transmitters', name_tr: 'Denizcilik Sensör & Transmitter', makers: 'Pressure · level · temperature' },
  { slug: 'radar-navigation',        name_en: 'Radar & Bridge Navigation',     name_tr: 'Radar & Köprü Üstü Seyir',        makers: 'Furuno · JRC · Sperry — ECDIS' },
  { slug: 'deck-mechanical',         name_en: 'Crane & Deck Hardware',         name_tr: 'Vinç & Güverte Donanımı',         makers: 'MacGregor · NMF · Liebherr' },
  { slug: 'engine-room-consumables', name_en: 'Engine Room Consumables',       name_tr: 'Makine Dairesi Sarf',             makers: 'Level switches · gaskets · seals' }
];

// Catalog is admin-managed in Supabase — render on demand.
export const dynamic = 'force-dynamic';

export default async function SupplyIndex() {
  const locale = getLocale();
  const t = getTranslator(locale);
  const tr = locale === 'tr';

  const heroLine = t('supply.heroLine');

  const catalog = (await getProducts()).map((p) => ({
    slug: p.slug,
    name: (locale === 'tr' ? p.name_tr : p.name_en) ?? p.name,
    brand: p.brand ?? '',
    partNumber: p.partNumber ?? '',
    description: (locale === 'tr' ? p.description_tr : p.description_en) ?? p.shortDescription ?? '',
    image: p.image ?? '',
    in_stock: p.in_stock ?? p.availability === 'in-stock',
    price: p.price ?? null
  }));

  const cats: CatItem[] = SUPPLY_CATS.map((c) => ({
    slug: c.slug,
    name: tr ? c.name_tr : c.name_en,
    makers: c.makers,
    cta: tr ? 'Parçalara bak' : 'Browse parts',
    href: `/supply/category/${c.slug}`,
    imageSrcs: [`/supply/stage/${c.slug}.webp`, SUPPLY_IMAGE[c.slug]].filter(Boolean) as string[]
  }));

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,34%)]">
      {/* LEFT (wider) — live search + instant results grid. */}
      <SupplyShell locale={locale} catalog={catalog} heroLine={heroLine} />

      {/* RIGHT (narrower) — soft rotating category panel, blends into the search. */}
      <aside className="relative hidden h-full overflow-hidden lg:block">
        <SupplyCategoryAside
          items={cats}
          kicker={tr ? 'Kategoriler' : 'Categories'}
        />
      </aside>
    </div>
  );
}
