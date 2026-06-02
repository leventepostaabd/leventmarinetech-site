'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import LocaleToggle from './LocaleToggle';
import LeventLogo from './LeventLogo';
import LogoLockup from './LogoLockup';
import { whatsappUrl } from '@/lib/whatsapp';
import { ct } from '@/lib/i18n-client';

/**
 * Top bar — the only persistent chrome on the entire site.
 *
 * Layout:
 *   ┌────────────────────────────────────────────────────────────────┐
 *   │ [☰]   [⚡L]  LEVENT MARINE ELECTROTECHNICAL SERVICE          │
 *   │              ↳ Marine Electrical Service & Parts Supply — 24/7│
 *   └────────────────────────────────────────────────────────────────┘
 *
 * Menu button (left) opens the slide-in drawer.
 * Logo + wordmark + slogan sit as one composition top-center.
 *
 * On the hero ("/"): transparent over the dark video/photo background.
 * On every other page: clean white with a thin border.
 */

const NAV: { href: string; key: string }[] = [
  { href: '/',          key: 'home' },
  { href: '/services',  key: 'service' },
  { href: '/supply',    key: 'supply' },
  { href: '/ports',     key: 'ports' },
  { href: '/about',     key: 'about' },
  { href: '/contact',   key: 'contact' },
  { href: '/knowledge', key: 'knowledge' }
];

export default function TopBar({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);
  // /services, /supply and /service-wizard now mount their own InlineHeader
  // inside the left column so the right artwork can run full bleed. Hide the
  // global TopBar entirely on those routes.
  if (pathname === '/services' || pathname === '/supply' || pathname === '/service-wizard') return null;
  // Pages where the right side carries a full-bleed dark photo deck and the
  // TopBar should float transparently over it (no white bar on top).
  const isHeroLike = pathname === '/';

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-40 flex h-14 items-center px-3 transition-colors md:h-16 md:px-6 ${
          isHeroLike
            ? 'bg-gradient-to-b from-navy-900/85 via-navy-900/55 to-transparent text-white'
            : 'bg-white/95 text-ink backdrop-blur border-b border-line'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
        aria-label="Levent Marine top bar"
      >
        {/* Menu button — left */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t('Open menu', 'Menüyü aç')}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 transition ${
            isHeroLike
              ? 'bg-white/10 text-white ring-white/20 hover:bg-white/20'
              : 'bg-white text-ink-muted ring-line hover:text-ink hover:ring-ink/40'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo lockup — center. Variant C (badge) pinned per user pick.
            Visit /brand-preview to compare A / B / C side-by-side. */}
        <Link
          href="/"
          aria-label="Levent Marine — home"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 no-underline transition hover:scale-[1.02]"
        >
          <span
            className={
              isHeroLike
                ? 'relative inline-flex items-center rounded-xl border border-white/25 bg-navy-900/30 px-4 py-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.35)] backdrop-blur-md'
                : 'inline-flex items-center'
            }
          >
            {isHeroLike && (
              <>
                <span aria-hidden className="pointer-events-none absolute left-1.5 top-1.5 h-3 w-3 border-l border-t border-amber/70" />
                <span aria-hidden className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 border-r border-t border-amber/70" />
                <span aria-hidden className="pointer-events-none absolute bottom-1.5 left-1.5 h-3 w-3 border-b border-l border-amber/70" />
                <span aria-hidden className="pointer-events-none absolute bottom-1.5 right-1.5 h-3 w-3 border-b border-r border-amber/70" />
              </>
            )}
            <LogoLockup variant="C" tone={isHeroLike ? 'light' : 'dark'} scale={0.82} />
          </span>
        </Link>

        {/* Locale toggle — right */}
        <div className="ml-auto">
          <LocaleToggle current={locale} />
        </div>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="lm-nav-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              key="lm-nav-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[min(360px,90vw)] flex-col bg-navy-700 text-white"
              role="dialog"
              aria-label={t('Main navigation', 'Ana menü')}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <span className="inline-flex items-center gap-3">
                  <LeventLogo size={28} tone="light" />
                  <span className="font-head text-[13px] font-bold uppercase tracking-[0.18em] text-white/80">
                    Levent Marine
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('Close menu', 'Menüyü kapat')}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-6 py-6 overflow-y-auto">
                <ul className="space-y-1.5">
                  {NAV.map((it) => {
                    const active = it.href === '/' ? pathname === '/' : pathname.startsWith(it.href);
                    return (
                      <li key={it.href}>
                        <Link
                          href={it.href}
                          className={`block rounded-md px-3 py-2 no-underline font-head text-[18px] transition ${
                            active ? 'bg-amber/15 text-amber-300' : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {ct(locale, `nav.${it.key}`)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45 mb-2">
                    {ct(locale, 'nav.emergency')}
                  </div>
                  <div className="flex flex-col gap-2 text-[14px]">
                    <a href="tel:+16193840403" className="text-white no-underline hover:text-amber-300">
                      📞 +1 619 384 04 03
                    </a>
                    <a href={whatsappUrl({ locale, intent: 'general' })} className="text-white no-underline hover:text-amber-300" target="_blank" rel="noreferrer noopener">
                      💬 WhatsApp · 24/7
                    </a>
                    <a href="mailto:info@leventmarinetech.com" className="text-white no-underline hover:text-amber-300">
                      ✉️  info@leventmarinetech.com
                    </a>
                  </div>
                </div>
              </nav>

              <div className="border-t border-white/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                Wyoming LLC · Florida ops · Worldwide
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
