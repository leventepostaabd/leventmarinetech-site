'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string };
type Group = { group: string; items: Item[] };

const NAV: Group[] = [
  {
    group: 'Operasyon',
    items: [
      { href: '/admin', label: 'Genel Bakış' },
      { href: '/admin/leads', label: 'Müşteri Adayları' },
      { href: '/admin/rfqs', label: 'Teklif Talepleri' },
      { href: '/admin/service', label: 'Servis' },
      { href: '/admin/products', label: 'Ürünler' }
    ]
  },
  {
    group: 'Evrak & Finans',
    items: [
      { href: '/admin/billing', label: 'Özet' },
      { href: '/admin/billing/quotes', label: 'Teklifler' },
      { href: '/admin/billing/invoices', label: 'Faturalar' },
      { href: '/admin/billing/service-reports', label: 'Servis Raporları' },
      { href: '/admin/billing/expenses', label: 'Giderler' },
      { href: '/admin/billing/price-book', label: 'Fiyat Kitabı' },
      { href: '/admin/billing/settings', label: 'Ayarlar' }
    ]
  },
  {
    group: 'Sistem',
    items: [{ href: '/admin/account', label: 'Hesap & Kullanıcılar' }]
  }
];

const EXACT = new Set(['/admin', '/admin/billing']);
function useActive() {
  const pathname = usePathname();
  return (href: string) => (EXACT.has(href) ? pathname === href : pathname === href || pathname.startsWith(href + '/'));
}

export default function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const isActive = useActive();
  const [open, setOpen] = useState(false);

  const nav = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-5">
      {NAV.map((g) => (
        <div key={g.group}>
          <div className="px-3 mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">{g.group}</div>
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active = isActive(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={onNavigate}
                    className={`block rounded-lg px-3 py-2 text-[13.5px] no-underline transition ${
                      active ? 'bg-amber text-navy-900 font-semibold shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="lm-admin min-h-screen bg-[#EEF1F7] text-ink">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col bg-navy-800 px-3 py-5 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2 no-underline">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber font-head text-[15px] font-extrabold text-navy-900">L</span>
          <span className="font-head text-[15px] font-bold text-white">Levent Marine<span className="text-amber-400"> · Admin</span></span>
        </Link>
        <div className="flex-1 overflow-y-auto">{nav()}</div>
        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="px-3 text-[11px] text-white/50 truncate">{email}</div>
          <Link href="/admin/logout" className="mt-1 block rounded-lg px-3 py-2 text-[13px] text-white/70 no-underline transition hover:bg-white/10 hover:text-white">Çıkış yap</Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-navy-800 px-4 py-3 text-white lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 no-underline">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-amber font-head text-[13px] font-extrabold text-navy-900">L</span>
          <span className="font-head text-[14px] font-bold text-white">Admin</span>
        </Link>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Menü" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[min(280px,82vw)] overflow-y-auto bg-navy-800 px-3 py-5">
            <div className="mb-5 px-2 font-head text-[15px] font-bold text-white">Levent Marine<span className="text-amber-400"> · Admin</span></div>
            {nav(() => setOpen(false))}
            <div className="mt-5 border-t border-white/10 pt-3">
              <div className="px-3 text-[11px] text-white/50 truncate">{email}</div>
              <Link href="/admin/logout" onClick={() => setOpen(false)} className="mt-1 block rounded-lg px-3 py-2 text-[13px] text-white/70 no-underline hover:bg-white/10">Çıkış yap</Link>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="lg:ml-60">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
