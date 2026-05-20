import Link from 'next/link';
import { SITE, NAV } from '@/lib/site';
import { SpotlightTrigger } from '@/components/Spotlight';
import LocaleToggle from '@/components/LocaleToggle';
import { getLocale, getTranslator } from '@/lib/i18n';

export default function Header() {
  const locale = getLocale();
  const t = getTranslator(locale);
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-line">
      <div className="container-x flex items-center justify-between h-[var(--header-h)] gap-5">
        <Link href="/" aria-label="Levent Marine — home" className="flex items-center gap-3 no-underline">
          <span aria-hidden="true" className="w-10 h-10 grid place-items-center text-navy-700">
            <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="currentColor" d="M12 8v34h22v6H6V8z" />
              <circle cx="46" cy="14" r="4" fill="#F5A524" />
            </svg>
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-head font-bold text-[15px] tracking-tight text-ink">Levent Marine</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-subtle">Electro-Tech Services</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden xl:flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`px-3.5 py-2 rounded-md text-[14px] font-medium no-underline transition ${n.primary ? 'text-ink hover:bg-navy-50' : 'text-ink-muted hover:text-ink hover:bg-navy-50'}`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SpotlightTrigger />
          <LocaleToggle current={locale} />
          {/*
            Emergency CTA placeholder — Agent E owns the EmergencyModal.
            For now this links to the contact page; Agent E will wire the modal.
          */}
          <Link
            href="/contact#emergency"
            data-emergency-trigger
            aria-label={t('common.emergency')}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 font-mono text-[12px] font-semibold text-red-600 no-underline hover:bg-red-500 hover:text-white hover:border-red-500 transition"
          >
            <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{t('common.emergency')}</span>
          </Link>
          <a href={`tel:${SITE.phoneUS.replace(/\s/g, '')}`} aria-label="Call 24/7" className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-navy-50 font-mono text-[12px] font-semibold text-ink no-underline hover:bg-amber hover:text-navy-700 hover:border-amber transition">
            <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="hidden lg:inline">{SITE.phoneUS}</span>
            <span className="lg:hidden">24/7</span>
          </a>
          <Link href="/service-wizard" className="btn-primary btn-sm">Request</Link>
        </div>
      </div>
    </header>
  );
}
