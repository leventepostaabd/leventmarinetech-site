import type { Metadata } from 'next';
import { getLocale, getTranslator } from '@/lib/i18n';
import { getProducts } from '@/lib/products-db';
import InlineHeader from '@/components/InlineHeader';
import SupplyShell from './SupplyShell';
import SupplyCategoryAside, { type CatItem } from './SupplyCategoryAside';

export const metadata: Metadata = {
  title: 'Marine Technical Supply — Live Quote-Only Catalog',
  description:
    'Find any marine electrical or mechanical part — live supplier-network search across our stock plus Mouser and Digi-Key. Quote-only, no public prices.',
  alternates: { canonical: '/supply' }
};

/**
 * Left showcase — promo slides (ports served, new arrivals, smart marine
 * products, own brand). Owner-produced artwork drops into
 * /public/supply/promo/<slug>.{webp,png,jpg}; a soft placeholder shows until then.
 */
const PROMO: { slug: string; en: string; tr: string; href: string }[] = [
  { slug: 'ports-served', en: 'US Ports We Serve',          tr: 'Hizmet Verdiğimiz Limanlar',  href: '/ports' },
  { slug: 'new-arrivals', en: 'New Marine Arrivals',        tr: 'Yeni Denizcilik Ürünleri',    href: '/supply' },
  { slug: 'smart-marine', en: 'Smart Products for Vessels', tr: 'Gemiler İçin Akıllı Ürünler', href: '/supply' },
  { slug: 'own-brand',    en: 'Levent Marine Own Line',     tr: 'Levent Marine Ürünleri',      href: '/supply' }
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

  const promo: CatItem[] = PROMO.map((p) => ({
    slug: p.slug,
    name: tr ? p.tr : p.en,
    makers: '',
    cta: '',
    href: p.href,
    imageSrcs: [
      `/supply/promo/${p.slug}.webp`,
      `/supply/promo/${p.slug}.png`,
      `/supply/promo/${p.slug}.jpg`
    ]
  }));

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#EFF4FB] lg:grid lg:grid-cols-[minmax(0,35%)_minmax(0,65%)]">
      {/* LEFT — promo showcase, with the header floating over the photo. */}
      <aside className="relative hidden h-full overflow-hidden lg:block">
        <SupplyCategoryAside items={promo} kicker={tr ? 'Vitrin' : 'Showcase'} />

        <div className="absolute inset-x-0 top-0 z-30">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/95 via-white/60 to-transparent backdrop-blur-[2px]"
          />
          <div className="relative px-3 md:px-5">
            <InlineHeader locale={locale} large />
          </div>
        </div>
      </aside>

      {/* RIGHT — live search + instant results grid. */}
      <SupplyShell locale={locale} catalog={catalog} heroLine={heroLine} />
    </div>
  );
}
