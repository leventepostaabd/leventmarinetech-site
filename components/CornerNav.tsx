'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import LocaleToggle from './LocaleToggle';
import LeventLogo from './LeventLogo';

type Locale = 'en' | 'tr';

/**
 * Minimal corner navigation — replaces the persistent top header so the
 * site stays single-screen / no-scroll. A subtle "L" mark sits top-left
 * (always returns to /). A tiny hamburger button sits top-right and
 * opens a slide-in panel with the full nav + locale toggle.
 *
 * Designed to disappear visually until needed.
 */
const NAV: { href: string; en: string; tr: string }[] = [
  { href: '/',              en: 'Home',      tr: 'Ana sayfa' },
  { href: '/services',      en: 'Service',   tr: 'Servis' },
  { href: '/supply',        en: 'Supply',    tr: 'Tedarik' },
  { href: '/about',         en: 'About',     tr: 'Hakkımızda' },
  { href: '/contact',       en: 'Contact',   tr: 'İletişim' },
  { href: '/knowledge',     en: 'Knowledge', tr: 'Bilgi' }
];

export default function CornerNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Esc to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);
  const isDark = pathname === '/';

  return (
    <>
      {/* Floating lightning-bolt L mark (top-left) — returns to home, animated */}
      <Link
        href="/"
        aria-label="Levent Marine — home"
        className={`fixed left-5 top-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full backdrop-blur transition hover:scale-105 ${
          isDark
            ? 'bg-white/95 ring-1 ring-white/30 shadow-lg'
            : 'bg-white ring-1 ring-line shadow-sm hover:shadow-md'
        }`}
      >
        <LeventLogo size={26} tone="auto" />
      </Link>

      {/* Floating menu button (top-right) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('Open menu', 'Menüyü aç')}
        className={`fixed right-5 top-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition ${
          isDark
            ? 'bg-white/10 text-white hover:bg-white/20 ring-1 ring-white/20'
            : 'bg-white/85 text-navy-700 hover:bg-white ring-1 ring-line shadow-sm'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="fixed right-0 top-0 z-50 flex h-screen w-[min(360px,90vw)] flex-col bg-navy-700 text-white"
              role="dialog"
              aria-label={t('Main navigation', 'Ana menü')}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <span className="inline-flex items-center gap-3">
                  <LeventLogo size={28} tone="light" />
                  <span className="font-head text-[14px] font-bold uppercase tracking-[0.22em] text-white/80">
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

              <nav className="flex-1 px-6 py-6">
                <ul className="space-y-1.5">
                  {NAV.map((it) => {
                    const active = it.href === '/' ? pathname === '/' : pathname.startsWith(it.href);
                    return (
                      <li key={it.href}>
                        <Link
                          href={it.href}
                          className={`block rounded-md px-3 py-2 no-underline font-head text-[18px] transition ${
                            active
                              ? 'bg-amber/15 text-amber-300'
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {t(it.en, it.tr)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45 mb-2">
                    {t('Emergency', 'Acil')}
                  </div>
                  <div className="flex flex-col gap-2 text-[14px]">
                    <a href="tel:+16193840403" className="text-white no-underline hover:text-amber-300">
                      📞 +1 619 384 04 03
                    </a>
                    <a href="https://wa.me/16193840403" className="text-white no-underline hover:text-amber-300" target="_blank" rel="noreferrer noopener">
                      💬 WhatsApp · 24/7
                    </a>
                    <a href="mailto:info@leventmarinetech.com" className="text-white no-underline hover:text-amber-300">
                      ✉️  info@leventmarinetech.com
                    </a>
                  </div>
                </div>
              </nav>

              <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
                <LocaleToggle current={locale} />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                  Wyoming LLC · Florida ops
                </span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
