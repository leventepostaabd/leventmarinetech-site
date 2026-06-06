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
const PROMO: { slug: string; en: string; tr: string; en_d: string; tr_d: string; href: string }[] = [
  {
    slug: 'USPortsWeServe',
    en: 'Serving U.S. Ports', tr: 'ABD Limanlarına Hizmet',
    en_d: 'Fast access to major commercial ports and marine facilities.',
    tr_d: 'Büyük ticari limanlara ve deniz tesislerine hızlı erişim.',
    href: '/ports'
  },
  {
    slug: 'PortAccessCertified',
    en: 'Port Access Ready', tr: 'Liman Erişimine Hazır',
    en_d: 'Authorized access for terminals, shipyards and restricted facilities.',
    tr_d: 'Terminaller, tersaneler ve kısıtlı tesislere yetkili erişim.',
    href: '/ports'
  },
  {
    slug: 'SmartProductsforVessels',
    en: 'Smart Marine Technologies', tr: 'Akıllı Denizcilik Teknolojileri',
    en_d: 'Automation, networking and control solutions for modern vessels.',
    tr_d: 'Modern gemiler için otomasyon, ağ ve kontrol çözümleri.',
    href: '/supply'
  },
  {
    slug: 'QualityAssuredSupply',
    en: 'Quality Assured Supply', tr: 'Kalite Güvenceli Tedarik',
    en_d: 'Every component verified before delivery.',
    tr_d: 'Her bileşen teslimattan önce doğrulanır.',
    href: '/supply'
  },
  {
    slug: 'ReplacementCrossReference',
    en: 'Obsolete Part?', tr: 'Obsolet Parça mı?',
    en_d: 'We identify the right replacement and supply the solution.',
    tr_d: 'Doğru muadili bulur, çözümü tedarik ederiz.',
    href: '/supply/equivalent-part-finder'
  }
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
    description: tr ? p.tr_d : p.en_d,
    href: p.href,
    imageSrcs: [
      `/supply/stage/${p.slug}.webp`,
      `/supply/stage/${p.slug}.png`,
      `/supply/stage/${p.slug}.jpg`
    ]
  }));

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#EFF4FB] lg:grid lg:grid-cols-[minmax(0,35%)_minmax(0,65%)]">
      {/* LEFT — promo showcase, with the header floating over the photo. */}
      <aside className="relative hidden h-full overflow-hidden lg:block">
        <SupplyCategoryAside items={promo} />

        <div className="absolute inset-x-0 top-0 z-30">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/95 via-white/60 to-transparent backdrop-blur-[2px]"
          />
          <div className="relative px-3 md:px-5">
            <InlineHeader locale={locale} variant="stage" />
          </div>
        </div>
      </aside>

      {/* RIGHT — live search + instant results grid. */}
      <SupplyShell locale={locale} catalog={catalog} heroLine={heroLine} />
    </div>
  );
}
