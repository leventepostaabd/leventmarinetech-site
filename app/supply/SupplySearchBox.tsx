'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Suggestion = {
  slug: string;
  name: string;
  brand: string;
  partNumber: string;
  in_stock: boolean;
  source: string;
  /** True for live external (eBay) results — no local product page exists. */
  live?: boolean;
};

function suggestionHref(s: Suggestion) {
  // Live external results have no static /supply/product/{slug} page — route
  // them to the quote wizard with brand + part pre-filled.
  if (s.live) {
    const params = new URLSearchParams({
      q: [s.brand, s.partNumber, s.name].filter(Boolean).join(' '),
      brand: s.brand,
      part: s.partNumber
    });
    return `/supply-wizard?${params.toString()}`;
  }
  return `/supply/product/${s.slug}`;
}

/**
 * Catalog-wide search box with live-completion against the local index.
 * Future (Wave 4): hits /api/supply-search which proxies Amazon Business + eBay.
 */
export default function SupplySearchBox({
  placeholder,
  hint,
  locale
}: {
  placeholder: string;
  hint?: string;
  locale: Locale;
}) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced fetch — uses public /content/products.json via dynamic import fallback,
  // or the existing search-index when present.
  useEffect(() => {
    if (!q || q.length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        // Cheap client-side filter — fetches the static products list
        const res = await fetch('/api/supply-search?q=' + encodeURIComponent(q), { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data?.results) ? data.results.slice(0, 8) : []);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
        setOpen(true);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push('/supply-wizard?q=' + encodeURIComponent(q.trim()));
  }

  const tNoMatches = locale === 'tr' ? 'Eşleşme yok — yine de teklif iste' : 'No matches — request a quote anyway';
  const tUpload = locale === 'tr' ? 'Fotoğraf yükle' : 'Upload photo';
  const tBrowse = locale === 'tr' ? 'Kategorilere göz at' : 'Browse categories';

  return (
    <div ref={boxRef} className="relative">
      <form onSubmit={submit} className="relative">
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.length >= 2 && setOpen(true)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full bg-white text-ink placeholder:text-ink-subtle border border-white/20 rounded-lg pl-12 pr-32 py-4 text-[15.5px] focus:border-amber focus:ring-2 focus:ring-amber/30 focus:outline-none shadow-lg"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-accent btn-md"
        >
          {locale === 'tr' ? 'Ara' : 'Search'}
        </button>
      </form>

      {hint && !open && (
        <div className="mt-3 text-[12.5px] text-white/60 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{hint}</span>
          <Link href="/supply/unlisted-request" className="text-amber hover:text-amber-600 no-underline">{tUpload} →</Link>
          <span className="opacity-40">·</span>
          <Link href="/supply/categories" className="text-amber hover:text-amber-600 no-underline">{tBrowse} →</Link>
        </div>
      )}

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-lg border border-line shadow-xl overflow-hidden text-ink">
          {loading ? (
            <div className="px-4 py-4 text-[13px] font-mono text-ink-subtle">
              {locale === 'tr' ? 'Aranıyor…' : 'Searching…'}
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-4">
              <div className="text-[13px] text-ink-muted mb-3">{tNoMatches}</div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/supply-wizard?q=${encodeURIComponent(q)}`} className="btn-accent btn-sm no-underline">{locale === 'tr' ? 'Teklif iste' : 'Get quote'}</Link>
                <Link href={`/supply/unlisted-request?q=${encodeURIComponent(q)}`} className="btn-ghost btn-sm no-underline">{tUpload}</Link>
                <Link href={`/supply/equivalent-part-finder?q=${encodeURIComponent(q)}`} className="btn-ghost btn-sm no-underline">{locale === 'tr' ? 'Eşdeğer' : 'Equivalent'}</Link>
              </div>
            </div>
          ) : (
            <ul>
              {items.map((it) => (
                <li key={it.slug}>
                  <Link
                    href={suggestionHref(it)}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-navy-50 no-underline border-b border-line last:border-0"
                    onClick={() => setOpen(false)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold text-ink truncate">{it.name}</div>
                      <div className="font-mono text-[11.5px] text-ink-subtle">{it.brand} · {it.partNumber}</div>
                    </div>
                    <span className={`font-mono text-[10.5px] uppercase tracking-wider shrink-0 ${it.live ? 'text-amber-600' : it.in_stock ? 'text-green-700' : 'text-amber-600'}`}>
                      {it.live
                        ? (locale === 'tr' ? 'Teklif al →' : 'Get quote →')
                        : it.in_stock
                          ? '● ' + (locale === 'tr' ? 'Stokta' : 'In Stock')
                          : (locale === 'tr' ? 'Teklif' : 'Quote')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
