import fs from 'node:fs';
import path from 'node:path';

export type KnowledgePostSection = { h: string; p: string[] };
export type KnowledgeFaqItem = { question: string; answer: string };

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
    service: { slug: string; label: string };
    supply:  { slug: string; label: string };
  };
  faq: KnowledgeFaqItem[];
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
