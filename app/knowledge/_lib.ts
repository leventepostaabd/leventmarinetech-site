import fs from 'node:fs';
import path from 'node:path';

export type KnowledgePostSection = {
  h: string;
  p: string[];
  /** Optional Turkish heading. Falls back to `h` when absent. */
  h_tr?: string;
  /** Optional Turkish body paragraphs. Falls back to `p` when absent. */
  body_tr?: string[];
};
export type KnowledgeFaqItem = {
  question: string;
  answer: string;
  question_tr?: string;
  answer_tr?: string;
};

export type KnowledgePost = {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  datePublished: string;
  dateModified?: string;
  readingTimeMin: number;
  wordCount: number;
  category: string;
  keywords: string[];
  relatedServices: string[];
  relatedSupply: string[];
  heroAlt: string;
  sections: KnowledgePostSection[];
  cta: {
    service: { slug: string; label: string; label_tr?: string };
    supply:  { slug: string; label: string; label_tr?: string };
  };
  faq: KnowledgeFaqItem[];

  // --- Optional Turkish fields (bilingual convention `<base>_tr`). ---
  // English fields above are always present; the `_tr` variants are added
  // post-translation and degrade gracefully to English when missing.
  title_tr?: string;
  description_tr?: string;
  kicker_tr?: string;
  category_tr?: string;
  heroAlt_tr?: string;
};

/**
 * A fully resolved post for one locale. Every text field is a plain string /
 * string[] with the locale already applied, so the rendering layer never has
 * to branch on locale or know about `_tr` suffixes.
 */
export type LocalizedKnowledgePost = {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  datePublished: string;
  dateModified?: string;
  readingTimeMin: number;
  wordCount: number;
  category: string;
  keywords: string[];
  relatedServices: string[];
  relatedSupply: string[];
  heroAlt: string;
  sections: { h: string; p: string[] }[];
  cta: {
    service: { slug: string; label: string };
    supply:  { slug: string; label: string };
  };
  faq: { question: string; answer: string }[];
};

type PostsFile = { version: string; generated: string; posts: KnowledgePost[] };

const POSTS_FILE = path.join(process.cwd(), 'content', 'knowledge', 'posts.json');

function loadAll(): KnowledgePost[] {
  try {
    if (!fs.existsSync(POSTS_FILE)) return [];
    const raw = fs.readFileSync(POSTS_FILE, 'utf8');
    const data = JSON.parse(raw) as PostsFile;
    return Array.isArray(data.posts) ? data.posts : [];
  } catch {
    return [];
  }
}

export function readKnowledgePosts(): KnowledgePost[] {
  return loadAll().sort((a, b) =>
    (b.datePublished || '').localeCompare(a.datePublished || '')
  );
}

export function readKnowledgePost(slug: string): KnowledgePost | undefined {
  return loadAll().find((p) => p.slug === slug);
}

export function knowledgeSlugs(): string[] {
  return loadAll().map((p) => p.slug);
}

/** True when the active locale should pull `_tr` fields. */
function isTr(locale: Locale): boolean {
  return locale === 'tr';
}

/**
 * Resolve a post into a single-locale view. For `tr` it prefers each `_tr`
 * field and falls back to the English field when a translation is absent; for
 * every other locale it returns the English content unchanged.
 *
 * Only `tr` is translated today — other locales degrade to English, matching
 * the site-wide `<base>_<locale>` fallback behaviour in lib/i18n-client.ts.
 */
export function localizeKnowledgePost(
  post: KnowledgePost,
  locale: Locale
): LocalizedKnowledgePost {
  const tr = isTr(locale);
  const useTr = (en: string, t?: string) => (tr && t ? t : en);

  return {
    slug: post.slug,
    title: useTr(post.title, post.title_tr),
    description: useTr(post.description, post.description_tr),
    kicker: useTr(post.kicker, post.kicker_tr),
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    readingTimeMin: post.readingTimeMin,
    wordCount: post.wordCount,
    category: useTr(post.category, post.category_tr),
    keywords: post.keywords,
    relatedServices: post.relatedServices,
    relatedSupply: post.relatedSupply,
    heroAlt: useTr(post.heroAlt, post.heroAlt_tr),
    sections: post.sections.map((s) => ({
      h: useTr(s.h, s.h_tr),
      p: tr && s.body_tr && s.body_tr.length > 0 ? s.body_tr : s.p
    })),
    cta: {
      service: {
        slug: post.cta.service.slug,
        label: useTr(post.cta.service.label, post.cta.service.label_tr)
      },
      supply: {
        slug: post.cta.supply.slug,
        label: useTr(post.cta.supply.label, post.cta.supply.label_tr)
      }
    },
    faq: (post.faq ?? []).map((q) => ({
      question: useTr(q.question, q.question_tr),
      answer: useTr(q.answer, q.answer_tr)
    }))
  };
}
