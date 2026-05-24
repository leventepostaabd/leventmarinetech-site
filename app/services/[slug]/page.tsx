import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getService, readServices } from '@/lib/content';
import { serviceImage } from '@/lib/deck-images';
import { SITE } from '@/lib/site';
import { serviceSchema, breadcrumbSchema, faqSchema } from '@/lib/schema-org';

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

  const url = `${SITE.url}/services/${s.slug}`;
  const requestHref = `/service-wizard?system=${encodeURIComponent(s.slug)}`;
  const heroImage = serviceImage(s.slug);

  return (
    <article>
      {/* HERO — two-column on lg: text + dedicated artwork on the right. */}
      <header className="bg-navy-700 text-white">
        <div className="container-x py-10 md:py-14">
          {/* Prominent back button — stands above the breadcrumb so the reader
              always sees how to step out of this detail page. */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-4 py-2 text-[13px] font-mono uppercase tracking-[0.14em] text-white no-underline transition hover:border-amber hover:bg-amber hover:text-navy-700 mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to services
          </Link>

          <nav className="text-[12px] font-mono text-white/55 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-amber no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-amber no-underline">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{s.name_en}</span>
          </nav>

          <div className={heroImage ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] items-start' : ''}>
            <div className="min-w-0">
              <div className="kicker text-white/70 mb-3">{s.kicker_en}</div>
              <h1 className="text-white text-balance max-w-4xl">{s.name_en}</h1>
              <p className="mt-5 text-[17px] text-white/75 max-w-3xl leading-relaxed">{s.summary_en}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={requestHref} className="btn-accent btn-lg">Request service →</Link>
                <a
                  href={SITE.whatsappUS}
                  target="_blank"
                  rel="noopener"
                  className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10"
                >
                  WhatsApp US
                </a>
              </div>
              <p className="mt-6 text-[13px] text-white/55 font-mono">
                Service available at all US ports — 24/7 worldwide. Our next available technician contacts you within 1 hour.
              </p>
            </div>

            {heroImage && (
              <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-navy-900 shadow-xl lg:max-w-[320px]">
                <Image
                  src={heroImage}
                  alt={s.name_en}
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

      {/* SYMPTOMS + COMMON CAUSES */}
      {(s.symptoms.length > 0 || s.common_causes.length > 0) && (
        <section className="py-14 md:py-16 bg-white">
          <div className="container-x grid gap-12 md:grid-cols-2">
            {s.symptoms.length > 0 && (
              <div>
                <div className="kicker mb-3">Symptom checklist</div>
                <h2 className="mb-4 text-[26px]">What we hear from the bridge.</h2>
                <ul className="space-y-2.5">
                  {s.symptoms.map((sym) => (
                    <li
                      key={sym}
                      className="flex items-start gap-3 text-ink-muted text-[14.5px] leading-relaxed"
                    >
                      <span className="text-amber font-bold mt-1.5 leading-none">›</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.common_causes.length > 0 && (
              <div>
                <div className="kicker mb-3">Likely root causes</div>
                <h2 className="mb-4 text-[26px]">Where the fault usually lives.</h2>
                <ul className="space-y-2.5">
                  {s.common_causes.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-3 text-ink-muted text-[14.5px] leading-relaxed"
                    >
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
            <div className="kicker mb-3">Equipment we bring</div>
            <h2 className="mb-6 text-[26px] max-w-3xl">Calibrated test equipment, class-acceptable reports.</h2>
            <ul className="flex flex-wrap gap-2">
              {s.tools.map((t) => (
                <li key={t} className="chip">{t}</li>
              ))}
            </ul>
            <p className="mt-6 text-[13px] text-ink-subtle max-w-3xl">
              Reports compatible with DNV · BV · ABS · Lloyd&apos;s · TL · RINA · ClassNK · IRS.
            </p>
          </div>
        </section>
      )}

      {/* RELATED SUPPLY (kept generic — supply categories owned by Agent C) */}
      {s.related_supply_categories.length > 0 && (
        <section className="py-14 md:py-16 bg-white">
          <div className="container-x">
            <div className="kicker mb-3">Often needed together</div>
            <h2 className="mb-6 text-[26px] max-w-3xl">Parts most often requested with this service.</h2>
            <ul className="flex flex-wrap gap-2">
              {s.related_supply_categories.map((cat) => (
                <li key={cat} className="chip">{cat.replace(/-/g, ' ')}</li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href={`/supply?ref=${encodeURIComponent(s.slug)}`} className="btn-ghost btn-md">
                Browse supply →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ — bilingual stored, rendered EN here (matches page locale).
          Also emitted as schema.org FAQPage below for rich-snippet eligibility. */}
      {s.faqs && s.faqs.length > 0 && (
        <section className="py-14 md:py-16 bg-navy-50 border-y border-line">
          <div className="container-x">
            <div className="kicker mb-3">FAQ</div>
            <h2 className="mb-6 text-[26px] max-w-3xl">Common questions for this system.</h2>
            <dl className="max-w-3xl space-y-5">
              {s.faqs.map((f) => (
                <div key={f.question_en} className="rounded-2xl bg-white ring-1 ring-line/60 p-5 md:p-6 shadow-sm">
                  <dt className="font-head font-bold text-ink text-[16px] md:text-[17px] mb-2">
                    {f.question_en}
                  </dt>
                  <dd className="text-ink-muted text-[14.5px] leading-relaxed">
                    {f.answer_en}
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
          <h2 className="text-white mb-3 text-balance">Have a vessel calling?</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-7">
            Three quick questions — port, when, contact. Our next available technician will contact you within 1 hour.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={requestHref} className="btn-accent btn-lg">Request service →</Link>
            <a
              href={SITE.whatsappUS}
              target="_blank"
              rel="noopener"
              className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10"
            >
              WhatsApp US
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
