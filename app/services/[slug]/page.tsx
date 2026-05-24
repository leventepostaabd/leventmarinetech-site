import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getService, readServices } from '@/lib/content';
import { serviceImage } from '@/lib/deck-images';
import { SITE } from '@/lib/site';
import { serviceSchema, breadcrumbSchema, faqSchema } from '@/lib/schema-org';
import { getLocale, getTranslator } from '@/lib/i18n';

/** Per-system SEO landing page (Wave 1 / Agent B). One page per slug. */

export function generateStaticParams() {
  return readServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = getService(params.slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    keywords: s.seo_keywords,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      url: `${SITE.url}/services/${s.slug}`
    }
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();

  const locale = getLocale();
  const t = getTranslator(locale);
  const tr = locale === 'tr';

  const name    = tr ? s.name_tr    : s.name_en;
  const kicker  = tr ? s.kicker_tr  : s.kicker_en;
  const summary = tr ? s.summary_tr : s.summary_en;

  const url = `${SITE.url}/services/${s.slug}`;
  const requestHref = `/service-wizard?system=${encodeURIComponent(s.slug)}`;
  const heroImage = serviceImage(s.slug);

  return (
    <article>
      {/* HERO — two-column on lg: text + dedicated artwork on the right. */}
      <header className="bg-navy-700 text-white">
        <div className="container-x py-10 md:py-14">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-4 py-2 text-[13px] font-mono uppercase tracking-[0.14em] text-white no-underline transition hover:border-amber hover:bg-amber hover:text-navy-700 mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            {t('serviceDetail.backToServices')}
          </Link>

          <nav className="text-[12px] font-mono text-white/55 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-amber no-underline">{t('serviceDetail.breadcrumbHome')}</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-amber no-underline">{t('serviceDetail.breadcrumbServices')}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{name}</span>
          </nav>

          <div className={heroImage ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] items-start' : ''}>
            <div className="min-w-0">
              <div className="kicker text-white/70 mb-3">{kicker}</div>
              <h1 className="text-white text-balance max-w-4xl">{name}</h1>
              <p className="mt-5 text-[17px] text-white/75 max-w-3xl leading-relaxed">{summary}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={requestHref} className="btn-accent btn-lg">
                  {t('serviceDetail.requestService')} →
                </Link>
                <a
                  href={SITE.whatsappUS}
                  target="_blank"
                  rel="noopener"
                  className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10"
                >
                  {t('serviceDetail.whatsappUs')}
                </a>
              </div>
              <p className="mt-6 text-[13px] text-white/55 font-mono">
                {t('serviceDetail.promiseLine')}
              </p>
            </div>

            {heroImage && (
              <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-navy-900 shadow-xl lg:max-w-[320px]">
                <Image
                  src={heroImage}
                  alt={name}
                  width={1080}
                  height={1920}
                  priority
                  sizes="(min-width: 1024px) 320px, 100vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SYMPTOMS + COMMON CAUSES (technical strings are EN-only in services.json) */}
      {(s.symptoms.length > 0 || s.common_causes.length > 0) && (
        <section className="py-14 md:py-16 bg-white">
          <div className="container-x grid gap-12 md:grid-cols-2">
            {s.symptoms.length > 0 && (
              <div>
                <div className="kicker mb-3">{t('serviceDetail.symptomsKicker')}</div>
                <h2 className="mb-4 text-[26px]">{t('serviceDetail.symptomsH2')}</h2>
                <ul className="space-y-2.5">
                  {s.symptoms.map((sym) => (
                    <li key={sym} className="flex items-start gap-3 text-ink-muted text-[14.5px] leading-relaxed">
                      <span className="text-amber font-bold mt-1.5 leading-none">›</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.common_causes.length > 0 && (
              <div>
                <div className="kicker mb-3">{t('serviceDetail.causesKicker')}</div>
                <h2 className="mb-4 text-[26px]">{t('serviceDetail.causesH2')}</h2>
                <ul className="space-y-2.5">
                  {s.common_causes.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-ink-muted text-[14.5px] leading-relaxed">
                      <span className="text-amber font-bold mt-1.5 leading-none">›</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TOOLS / EQUIPMENT */}
      {s.tools.length > 0 && (
        <section className="py-14 md:py-16 bg-navy-50">
          <div className="container-x">
            <div className="kicker mb-3">{t('serviceDetail.equipmentKicker')}</div>
            <h2 className="mb-6 text-[26px] max-w-3xl">{t('serviceDetail.equipmentH2')}</h2>
            <ul className="flex flex-wrap gap-2">
              {s.tools.map((tool) => (
                <li key={tool} className="chip">{tool}</li>
              ))}
            </ul>
            <p className="mt-6 text-[13px] text-ink-subtle max-w-3xl">
              {t('serviceDetail.equipmentNote')}
            </p>
          </div>
        </section>
      )}

      {/* RELATED SUPPLY */}
      {s.related_supply_categories.length > 0 && (
        <section className="py-14 md:py-16 bg-white">
          <div className="container-x">
            <div className="kicker mb-3">{t('serviceDetail.relatedKicker')}</div>
            <h2 className="mb-6 text-[26px] max-w-3xl">{t('serviceDetail.relatedH2')}</h2>
            <ul className="flex flex-wrap gap-2">
              {s.related_supply_categories.map((cat) => (
                <li key={cat} className="chip">{cat.replace(/-/g, ' ')}</li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href={`/supply?ref=${encodeURIComponent(s.slug)}`} className="btn-ghost btn-md">
                {t('serviceDetail.browseSupply')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ — bilingual content; FAQPage schema emitted in EN for crawlers. */}
      {s.faqs && s.faqs.length > 0 && (
        <section className="py-14 md:py-16 bg-navy-50 border-y border-line">
          <div className="container-x">
            <div className="kicker mb-3">{t('serviceDetail.faqKicker')}</div>
            <h2 className="mb-6 text-[26px] max-w-3xl">{t('serviceDetail.faqH2')}</h2>
            <dl className="max-w-3xl space-y-5">
              {s.faqs.map((f) => (
                <div key={f.question_en} className="rounded-2xl bg-white ring-1 ring-line/60 p-5 md:p-6 shadow-sm">
                  <dt className="font-head font-bold text-ink text-[16px] md:text-[17px] mb-2">
                    {tr ? f.question_tr : f.question_en}
                  </dt>
                  <dd className="text-ink-muted text-[14.5px] leading-relaxed">
                    {tr ? f.answer_tr : f.answer_en}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 md:py-16 bg-navy-700 text-white">
        <div className="container-x text-center">
          <h2 className="text-white mb-3 text-balance">{t('serviceDetail.ctaH2')}</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-7">{t('serviceDetail.ctaLead')}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={requestHref} className="btn-accent btn-lg">
              {t('serviceDetail.requestService')} →
            </Link>
            <a
              href={SITE.whatsappUS}
              target="_blank"
              rel="noopener"
              className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10"
            >
              {t('serviceDetail.whatsappUs')}
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema({ name: s.name_en, description: s.summary_en, url }))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: SITE.url },
              { name: 'Services', url: `${SITE.url}/services` },
              { name: s.name_en, url }
            ])
          )
        }}
      />
      {s.faqs && s.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              faqSchema(s.faqs.map((f) => ({ question: f.question_en, answer: f.answer_en })))
            )
          }}
        />
      )}
    </article>
  );
}
