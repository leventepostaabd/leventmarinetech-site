import type { Metadata } from 'next';
import Link from 'next/link';
import { readKnowledgePosts, localizeKnowledgePost } from './_lib';
import { getLocale } from '@/lib/i18n';
import { SITE } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema-org';

/**
 * /knowledge — Knowledge base landing.
 *
 * Per decision Y3: not in main navigation, footer-linked only. SEO-tuned;
 * grid of long-form working-ETO articles. Each post lives at /knowledge/[slug].
 */
export const metadata: Metadata = {
  title: 'Knowledge Base — Marine Electrical Service Field Notes',
  description:
    'Working-ETO field notes on BWTS, AVR, AOG-equivalent dispatch, class survey preparation and marine electrical diagnostics. Long-form technical articles for technical superintendents.',
  alternates: { canonical: '/knowledge' },
  openGraph: {
    title: 'Levent Marine Knowledge Base — Working-ETO field notes',
    description:
      'Long-form technical articles on marine electrical diagnostics, class survey preparation and emergency dispatch.',
    type: 'website'
  }
};

export default function KnowledgeIndex() {
  const locale = getLocale();
  const dateLocale = locale === 'tr' ? 'tr-TR' : 'en-US';
  const minRead = locale === 'tr' ? 'dk okuma' : 'min read';
  const kickerLabel = locale === 'tr' ? 'Bilgi merkezi' : 'Knowledge base';
  const h1 = locale === 'tr' ? 'Saha mühendisinin notları.' : 'Working-ETO field notes.';
  const intro =
    locale === 'tr'
      ? 'Pazarlama masasından değil, gemi güvertesinden yazılmış uzun teknik makaleler. Arıza teşhisi, klas survey hazırlığı, acil müdahale rehberleri, muadil parça araştırması. Yaklaşık ayda bir yeni makale — yer imine ekleyin ve ihtiyacı olan mühendislere iletin.'
      : 'Long-form technical articles written from the deckplate, not from a marketing desk. Diagnostics, class survey preparation, emergency dispatch playbooks, equivalent-part hunting. New article roughly once a month — bookmark and circulate to the engineers who need it.';
  const ctaH = locale === 'tr' ? 'Sadece açıklama değil, çözüm mü gerekiyor?' : 'Need this fixed, not just explained?';
  const ctaP =
    locale === 'tr'
      ? 'Yukarıdaki her makale gerçek bir saha müdahalesine dayanır. Makaledeki belirti geminizdeki belirtiyle örtüşüyorsa, sihirbaz bir sonraki vardiya değişiminden önce bir mühendisi göreve atar.'
      : 'Every article above is grounded in a real attendance. If the symptom on the article matches the symptom on your vessel, the wizard puts an engineer on it before the next watch change.';
  const reqService = locale === 'tr' ? 'Servis talep et' : 'Request service';
  const reqQuote = locale === 'tr' ? 'Teklif iste' : 'Request a quote';
  const emptyLabel = locale === 'tr' ? 'Henüz yayınlanmış makale yok.' : 'No articles published yet.';

  const posts = readKnowledgePosts().map((p) => localizeKnowledgePost(p, locale));
  const breadcrumb = breadcrumbSchema([
    { name: 'Home',      url: `${SITE.url}/` },
    { name: 'Knowledge', url: `${SITE.url}/knowledge` }
  ]);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Levent Marine Knowledge Base',
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE.url}/knowledge/${p.slug}`,
      name: p.title
    }))
  };

  return (
    <div className="lm-screen bg-white">
      <article className="lm-screen-body">
      <section className="bg-navy-700 text-white py-20">
        <div className="container-x">
          <div className="kicker text-white/70 mb-3">{kickerLabel}</div>
          <h1 className="text-white text-balance max-w-4xl">
            {h1}
          </h1>
          <p className="mt-5 text-[17px] text-white/75 max-w-3xl leading-relaxed">
            {intro}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-x">
          {posts.length === 0 ? (
            <p className="text-ink-muted">{emptyLabel}</p>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <li
                  key={p.slug}
                  className="motion-safe:animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 60, 360)}ms`, animationFillMode: 'backwards' }}
                >
                  <Link
                    href={`/knowledge/${p.slug}`}
                    className="card no-underline h-full flex flex-col group hover:border-amber transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber mb-2">
                      {p.category}
                    </div>
                    <h2 className="text-[19px] mb-2 leading-tight group-hover:text-amber-600 font-head font-bold">
                      {p.title}
                    </h2>
                    <p className="text-ink-muted text-[13.5px] leading-relaxed line-clamp-4">
                      {p.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[11.5px] font-mono text-ink-subtle">
                      <span>
                        {new Date(p.datePublished).toLocaleDateString(dateLocale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span>{p.readingTimeMin} {minRead}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="py-16 bg-navy-50 border-y border-line">
        <div className="container-x text-center">
          <h2 className="text-[24px] mb-3">{ctaH}</h2>
          <p className="text-ink-muted max-w-2xl mx-auto mb-6 text-[15px] leading-relaxed">
            {ctaP}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/service-wizard" className="btn-primary btn-md no-underline">
              {reqService}
            </Link>
            <Link href="/supply-wizard" className="btn-accent btn-md no-underline">
              {reqQuote}
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      </article>
    </div>
  );
}
