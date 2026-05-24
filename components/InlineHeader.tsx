'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import LocaleToggle from './LocaleToggle';
import LeventLogo from './LeventLogo';
import { whatsappUrl } from '@/lib/whatsapp';

/**
 * InlineHeader — page-internal top strip used by /services and /supply.
 *
 * Instead of the global fixed TopBar these two pages own their own header
 * that sits at the top of the LEFT column (where the controls live). The
 * RIGHT column on those pages is the artwork deck and runs ceiling to
 * floor without anything covering it.
 *
 * Carries hamburger menu → drawer, brand lockup, and locale toggle. The
 * drawer markup is intentionally duplicated from TopBar so the two
 * placements stay independent.
 */

const NAV: { href: string; en: string; tr: string }[] = [
  { href: '/',              en: 'Home',      tr: 'Ana sayfa' },
  { href: '/services',      en: 'Service',   tr: 'Servis' },
  { href: '/supply',        en: 'Supply',    tr: 'Tedarik' },
  { href: '/about',         en: 'About',     tr: 'Hakkımızda' },
  { href: '/contact',       en: 'Contact',   tr: 'İletişim' },
  { href: '/knowledge',     en: 'Knowledge', tr: 'Bilgi' }
];

export default function InlineHeader({ locale }: { locale: 'en' | 'tr' }) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  return (
    <>
      <div className="flex items-center gap-3 py-3 md:py-4">
        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t('Open menu', 'Menüyü aç')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 text-ink-muted ring-1 ring-line transition hover:bg-navy-100 hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Brand lockup — left aligned */}
        <Link
          href="/"
          aria-label="Levent Marine — home"
          className="inline-flex items-center gap-2.5 no-underline transition hover:opacity-80"
        >
          <LeventLogo size={26} />
          <span className="font-head text-[15px] font-extrabold tracking-[0.04em] text-ink">
            Levent Marine
          </span>
        </Link>

        {/* Locale toggle — right */}
        <div className="ml-auto">
          <LocaleToggle current={locale} />
        </div>
      </div>

      {/* Drawer — mirrors TopBar's drawer markup */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="lm-inh-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              key="lm-inh-panel"
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
