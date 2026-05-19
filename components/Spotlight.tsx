'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Command } from 'cmdk';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type SearchItem = {
  id: string;
  type: 'service' | 'product' | 'region' | 'page';
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
  category: string;
  priority: number;
};

const TYPE_ICON: Record<string, string> = {
  service:  '▣',
  product:  '◇',
  region:   '◉',
  page:     '›',
  wizard:   '▶'
};

const TYPE_LABEL: Record<string, string> = {
  service:  'Service',
  product:  'Product',
  region:   'USA',
  page:     'Page',
  wizard:   'Action'
};

export default function Spotlight() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);

  // Lazy-load the search index on first open
  useEffect(() => {
    if (!open || items.length) return;
    fetch('/api/search-index')
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, [open, items.length]);

  // Keyboard: Cmd/Ctrl+K to toggle, Esc to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fuse = useMemo(() => new Fuse(items, {
    keys: [
      { name: 'title',    weight: 0.5 },
      { name: 'subtitle', weight: 0.3 },
      { name: 'keywords', weight: 0.2 }
    ],
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: true
  }), [items]);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Empty query → show featured (wizards + popular pages first)
      return [...items]
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 12);
    }
    return fuse.search(query).slice(0, 20).map((r) => r.item);
  }, [query, items, fuse]);

  const grouped = useMemo(() => {
    const g: Record<string, SearchItem[]> = {};
    for (const r of results) {
      const k = r.category || r.type;
      (g[k] = g[k] || []).push(r);
    }
    return g;
  }, [results]);

  const select = useCallback((href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  }, [router]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          className="fixed inset-0 z-[200] bg-navy-900/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute left-1/2 top-[12vh] -translate-x-1/2 w-[min(640px,calc(100vw-32px))]"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="bg-white rounded-xl shadow-xl border border-line-strong overflow-hidden" loop>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-subtle">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                </svg>
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search part number, maker, vessel system, service…"
                  autoFocus
                  className="flex-1 outline-none text-[15px] text-ink placeholder:text-ink-subtle bg-transparent"
                />
                <kbd className="font-mono text-[10px] text-ink-subtle bg-navy-50 px-1.5 py-0.5 rounded border border-line">ESC</kbd>
              </div>

              <Command.List className="max-h-[min(60vh,460px)] overflow-y-auto px-2 py-2">
                {!items.length && (
                  <div className="px-3 py-8 text-center text-[13px] font-mono text-ink-subtle">Loading index…</div>
                )}
                {items.length > 0 && !results.length && (
                  <Command.Empty className="px-3 py-8 text-center">
                    <div className="text-ink-muted text-[14px] mb-2">No match for "<span className="text-ink font-semibold">{query}</span>".</div>
                    <button onClick={() => select(`/supply-wizard?q=${encodeURIComponent(query)}`)} className="text-amber-600 font-mono text-[12px] hover:underline">Ask us to source it →</button>
                  </Command.Empty>
                )}
                {Object.entries(grouped).map(([group, list]) => (
                  <Command.Group key={group} heading={(TYPE_LABEL[group] ?? group).toUpperCase()} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:tracking-[0.12em] [&_[cmdk-group-heading]]:text-ink-subtle">
                    {list.map((item) => (
                      <Command.Item
                        key={item.id}
                        value={`${item.title} ${item.subtitle} ${item.keywords}`}
                        onSelect={() => select(item.href)}
                        className="px-3 py-2 rounded-md cursor-pointer data-[selected=true]:bg-navy-50 hover:bg-navy-50 flex items-start gap-3"
                      >
                        <span className="text-amber font-mono text-[13px] w-4 mt-0.5">{TYPE_ICON[item.type] ?? '·'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-medium text-ink truncate">{item.title}</div>
                          <div className="text-[12px] text-ink-muted truncate">{item.subtitle}</div>
                        </div>
                        <span className="text-ink-subtle text-[11px] font-mono mt-1">↵</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>

              <div className="border-t border-line px-4 py-2.5 flex items-center justify-between font-mono text-[10.5px] text-ink-subtle">
                <div className="flex items-center gap-3">
                  <span><kbd className="bg-navy-50 px-1 rounded">↑↓</kbd> navigate</span>
                  <span><kbd className="bg-navy-50 px-1 rounded">↵</kbd> open</span>
                </div>
                <span>Cmd / Ctrl + K to toggle</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Trigger button for the spotlight — usable in header. */
export function SpotlightTrigger() {
  const [_, force] = useState(0);
  const open = useCallback(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true } as any));
    force((n) => n + 1);
  }, []);
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open search"
      className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-line bg-white hover:border-line-strong hover:bg-navy-50 text-ink-subtle text-[13px] transition"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
      </svg>
      <span>Search</span>
      <kbd className="font-mono text-[10px] bg-navy-50 px-1.5 py-0.5 rounded border border-line ml-2">⌘K</kbd>
    </button>
  );
}
