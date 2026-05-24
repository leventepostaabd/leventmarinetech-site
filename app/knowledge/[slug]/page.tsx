import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readKnowledgePost, knowledgeSlugs } from '../_lib';
import { SITE } from '@/lib/site';
import {
  blogPostingSchema,
  breadcrumbSchema,
  faqSchema
} from '@/lib/schema-org';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return knowledgeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = readKnowledgePost(params.slug);
  if (!p) return { title: 'Article not found' };
  return {
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: `/knowledge/${p.slug}` },
    openGraph: {
      type: 'article',
      title: p.title,
      description: p.description,
      publishedTime: p.datePublished,
      modifiedTime: p.dateModified ?? p.datePublished
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.description
    }
  };
}

export default function KnowledgePost({ params }: Params) {
  const post = readKnowledgePost(params.slug);
  if (!post) notFound();

  const breadcrumb = breadcrumbSchema([
    { name: 'Home',      url: `${SITE.url}/` },
    { name: 'Knowledge', url: `${SITE.url}/knowledge` },
    { name: post.title,  url: `${SITE.url}/knowledge/${post.slug}` }
  ]);
  const blogSchema = blogPostingSchema({
    title:        post.title,
    description:  post.description,
    slug:         post.slug,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    wordCount:    post.wordCount,
    keywords:     post.keywords
  });
  const faqs = post.faq && post.faq.length > 0 ? faqSchema(post.faq) : null;

  const dateLabel = new Date(post.datePublished).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="lm-screen bg-white">
      <article className="lm-screen-body">
      {/* HERO */}
      <section className="bg-navy-700 text-white pt-16 pb-12">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55 mb-4">
            <Link href="/knowledge" className="hover:text-amber no-underline">Knowledge</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="text-white/80">{post.category}</span>
          </nav>
          <div className="kicker text-white/70 mb-3">{post.kicker}</div>
          <h1 className="text-white text-balance max-w-4xl leading-[1.1]">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] font-mono text-white/65">
            <time dateTime={post.datePublished}>{dateLabel}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTimeMin} min read</span>
            <span aria-hidden="true">·</span>
            <span>{post.category}</span>
          </div>
        </div>
      </section>

      {/* HERO IMAGE PLACEHOLDER */}
      <section className="bg-white">
        <div className="container-x -mt-6">
          <div
            className="aspect-[16/7] w-full rounded-lg bg-navy-700 border border-navy-600 grid place-items-center text-white/30"
            aria-label={post.heroAlt}
            role="img"
          >
            <svg viewBox="0 0 64 64" className="w-16 h-16 text-amber/70" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 50 L24 30 L36 42 L48 24 L60 38 V56 H8 Z" />
              <circle cx="20" cy="18" r="4" />
            </svg>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="py-12 bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_280px]">
          {/* Article */}
          <div className="prose-body max-w-3xl">
            <p className="text-[18px] leading-relaxed text-ink mb-10 font-head font-medium">
              {post.description}
            </p>

            {post.sections.map((s, i) => (
              <section key={i} className="mb-10">
                <h2 className="text-[24px] font-head font-bold tracking-tight mt-12 mb-4 first:mt-0">
                  {s.h}
                </h2>
                {s.p.map((para, j) => (
                  <p
                    key={j}
                    className="text-[15.5px] leading-[1.75] text-ink-muted mb-5"
                  >
                    {para}
                  </p>
                ))}
              </section>
            ))}

            {/* FAQ */}
            {post.faq && post.faq.length > 0 && (
              <section className="mt-16 border-t border-line pt-10">
                <h2 className="text-[24px] font-head font-bold tracking-tight mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {post.faq.map((q, i) => (
                    <div key={i} className="border-l-2 border-amber pl-4">
                      <dt className="font-head font-bold text-ink text-[16px] mb-1.5">
                        {q.question}
                      </dt>
                      <dd className="text-ink-muted text-[14.5px] leading-relaxed">
                        {q.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* CTAs */}
            <section className="mt-16 border-t border-line pt-10 grid gap-4 md:grid-cols-2">
              <Link
                href={`/services/${post.cta.service.slug}`}
                className="card no-underline group hover:border-amber"
              >
                <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber mb-1">
                  Related service
                </div>
                <h3 className="text-[17px] mb-1 group-hover:text-amber-600">
                  {post.cta.service.label}
                </h3>
                <p className="text-ink-subtle text-[12.5px] font-mono">
                  /services/{post.cta.service.slug}
                </p>
              </Link>
              <Link
                href="/supply"
                className="card no-underline group hover:border-amber"
              >
                <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber mb-1">
                  Related supply
                </div>
                <h3 className="text-[17px] mb-1 group-hover:text-amber-600">
                  {post.cta.supply.label}
                </h3>
                <p className="text-ink-subtle text-[12.5px] font-mono">
                  /supply
                </p>
              </Link>
            </section>

            <p className="mt-12 pt-6 border-t border-line text-[12px] font-mono uppercase tracking-[0.12em] text-ink-subtle">
              Published by Levent Marine &mdash; Florida-based, Wyoming LLC &mdash; 24/7 worldwide
            </p>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start space-y-6">
            <div className="card">
              <div className="kicker mb-3">Need this fixed</div>
              <p className="text-ink-muted text-[13.5px] leading-relaxed mb-4">
                Request an engineer attendance or RFQ. Email and WhatsApp acknowledgement
                within minutes.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/service-wizard" className="btn-primary btn-sm no-underline">
                  Request service
                </Link>
                <Link href="/supply-wizard" className="btn-accent btn-sm no-underline">
                  Request a quote
                </Link>
              </div>
            </div>

            {post.relatedServices.length > 0 && (
              <div className="card">
                <div className="kicker mb-3">Related services</div>
                <ul className="space-y-2 text-[13px]">
                  {post.relatedServices.map((s) => (
                    <li key={s}>
                      <Link href={`/services/${s}`} className="text-ink hover:text-amber-600 no-underline capitalize">
                        {s.replace(/-/g, ' ')}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {post.relatedSupply.length > 0 && (
              <div className="card">
                <div className="kicker mb-3">Related supply</div>
                <ul className="space-y-2 text-[13px]">
                  {post.relatedSupply.map((s) => (
                    <li key={s} className="capitalize text-ink-muted">
                      {s.replace(/-/g, ' ')}
                    </li>
                  ))}
                </ul>
                <Link href="/supply" className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-[0.12em] text-amber hover:text-amber-600 no-underline">
                  Browse supply →
                </Link>
              </div>
            )}

            {post.keywords.length > 0 && (
              <div className="card">
                <div className="kicker mb-3">Topics</div>
                <ul className="flex flex-wrap gap-1.5">
                  {post.keywords.map((k) => (
                    <li key={k} className="chip text-[10.5px]">{k}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {faqs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqs) }}
        />
      )}
      </article>
    </div>
  );
}
