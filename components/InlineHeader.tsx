'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import LocaleToggle from './LocaleToggle';
import LeventLogo from './LeventLogo';
import { whatsappUrl } from '@/lib/whatsapp';
import { ct } from '@/lib/i18n-client';

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

const NAV: { href: string; key: string }[] = [
  { href: '/',          key: 'home' },
  { href: '/services',  key: 'service' },
  { href: '/supply',    key: 'supply' },
  { href: '/ports',     key: 'ports' },
  { href: '/about',     key: 'about' },
  { href: '/contact',   key: 'contact' },
  { href: '/knowledge', key: 'knowledge' }
];

export default function InlineHeader({ locale, variant = 'inline' }: { locale: Locale; variant?: 'inline' | 'stage' }) {
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
      {variant === 'stage' ? (
        /* Over-photo header: small hamburger + vertical flags on the left, the
           full "Levent Marine Tech" lockup to the right. */
        <div className="flex items-center justify-between gap-3 py-3">
          <Link
            href="/"
            aria-label="Levent Marine Tech — home"
            className="inline-flex items-center gap-3 no-underline transition hover:opacity-90"
          >
            <LeventLogo size={34} />
            <span className="flex flex-col leading-none">
              <span className="font-head text-[23px] font-extrabold tracking-[-0.01em] text-navy-700">
                Levent Marine <span className="text-amber-500">Tech</span>
              </span>
              <span aria-hidden className="mt-1.5 h-px w-full bg-amber/70" />
              <span lang="en" className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.26em] text-ink-subtle">
                Electro-Technical Solutions
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t('Open menu', 'Menüyü aç')}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink ring-1 ring-line shadow-sm transition hover:bg-navy-50 hover:text-navy-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
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

          {/* Brand lockup — full web set (language lives in the drawer on mobile) */}
          <Link
            href="/"
            aria-label="Levent Marine Tech — home"
            className="ml-1 inline-flex items-center gap-2.5 no-underline transition hover:opacity-80"
          >
            <LeventLogo size={32} />
            <span className="flex flex-col leading-none">
              <span className="whitespace-nowrap font-head text-[16px] font-extrabold tracking-[-0.01em] text-navy-700">
                Levent Marine <span className="text-amber-500">Tech</span>
              </span>
              <span aria-hidden className="mt-1 h-px w-full bg-amber/70" />
              <span lang="en" className="mt-1 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.18em] text-ink-subtle">
                Electro-Technical Solutions
              </span>
            </span>
          </Link>
        </div>
      )}

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

              <div className="border-b border-white/10 px-6 py-4">
                <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45">
                  {t('Language', 'Dil')}
                </div>
                <LocaleToggle current={locale} />
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
