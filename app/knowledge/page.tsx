import type { Metadata } from 'next';
import Link from 'next/link';
import { readKnowledgePosts } from './_lib';
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
  const posts = readKnowledgePosts();
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
    <article>
      <section className="bg-navy-700 text-white py-20">
        <div className="container-x">
          <div className="kicker text-white/70 mb-3">Knowledge base</div>
          <h1 className="text-white text-balance max-w-4xl">
            Working-ETO field notes.
          </h1>
          <p className="mt-5 text-[17px] text-white/75 max-w-3xl leading-relaxed">
            Long-form technical articles written from the deckplate, not from
            a marketing desk. Diagnostics, class survey preparation, emergency
            dispatch playbooks, equivalent-part hunting. New article roughly
            once a month — bookmark and circulate to the engineers who need it.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-x">
          {posts.length === 0 ? (
            <p className="text-ink-muted">No articles published yet.</p>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/knowledge/${p.slug}`}
                    className="card no-underline h-full flex flex-col group hover:border-amber"
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
                        {new Date(p.datePublished).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span>{p.readingTimeMin} min read</span>
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
          <h2 className="text-[24px] mb-3">Need this fixed, not just explained?</h2>
          <p className="text-ink-muted max-w-2xl mx-auto mb-6 text-[15px] leading-relaxed">
            Every article above is grounded in a real attendance. If the symptom
            on the article matches the symptom on your vessel, the wizard puts
            an engineer on it before the next watch change.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/service-wizard" className="btn-primary btn-md no-underline">
              Request service
            </Link>
            <Link href="/supply-wizard" className="btn-accent btn-md no-underline">
              Request a quote
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
  );
}
