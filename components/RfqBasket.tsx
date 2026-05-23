'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type BasketItem,
  clearBasket,
  getBasket,
  onBasketChange,
  removeFromBasket,
  updateQuantity
} from '@/lib/rfq-basket';
import { MARKUP_RATE, fmt } from '@/lib/pricing';

type Urgency = 'aog' | 'urgent' | 'planned';
type View = 'list' | 'sent';

/**
 * Floating RFQ basket — anchored to the bottom-right corner so it
 * doesn't fight the TopBar. Only mounted on /supply* routes (we don't
 * want a stray cart icon haunting the rest of the site).
 *
 * Click the badge → side drawer with all collected items, quantity
 * editors, single contact form, single submit. Backend reuses
 * /api/quote-request with kind='supply' and one POST per item.
 */
export default function RfqBasket({ locale = 'en' as 'en' | 'tr' } = {}) {
  const pathname = usePathname() || '/';
  const [items, setItems] = useState<BasketItem[]>([]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('list');
  const [urgency, setUrgency] = useState<Urgency>('planned');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vessel, setVessel] = useState('');
  const [port, setPort] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [refs, setRefs] = useState<string[]>([]);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);
  const showOn = pathname.startsWith('/supply');

  useEffect(() => {
    setItems(getBasket());
    const off = onBasketChange(() => setItems(getBasket()));
    return off;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Portal mount flag — needed because we render the floating button +
  // drawer through document.body to escape any transformed parent.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!showOn || items.length === 0 || !mounted) return null;

  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

  /** Item-only subtotal (markup applied) — we deliberately do NOT show
      shipping/AOG here. Those depend on weight + port + carrier and only
      get computed once the customer submits and we generate the quote. */
  const itemSubtotal = useMemo(() => {
    const priced = items.filter((it) => typeof it.priceRaw === 'number');
    if (priced.length === 0) return null;
    return priced.reduce(
      (sum, it) => sum + (it.priceRaw as number) * (1 + MARKUP_RATE) * Math.max(1, it.quantity),
      0
    );
  }, [items]);

  async function handleSubmit() {
    setErr(null);
    if (!name.trim()) {
      setErr(t('Your name is required.', 'Adınız gerekli.'));
      return;
    }
    if (!email.trim() || !/.+@.+\..+/.test(email)) {
      setErr(t('Valid email required.', 'Geçerli e-posta gerekli.'));
      return;
    }
    setSubmitting(true);
    try {
      // One POST per item — backend already accepts this; admin sees the
      // batch grouped by contact email + submission window.
      const collected: string[] = [];
      for (const it of items) {
        const res = await fetch('/api/quote-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'supply',
            product: it.name,
            brand: it.brand,
            partNumber: it.partNumber,
            quantity: it.quantity,
            urgency,
            vesselName: vessel || undefined,
            port: port || undefined,
            contactName: name,
            contactEmail: email,
            notes: notes ? `[Batch RFQ · ${items.length} items] ${notes}` : `[Batch RFQ · ${items.length} items]`
          }),
          cache: 'no-store'
        });
        if (res.ok) {
          const d = await res.json().catch(() => ({}));
          collected.push(d?.reference || ('LM-' + Math.random().toString(36).slice(2, 8).toUpperCase()));
        }
      }
      if (collected.length === 0) {
        setErr(t('Could not submit. Try WhatsApp from the home button.', 'Gönderilemedi. Ana sayfadaki WhatsApp butonunu dene.'));
        return;
      }
      setRefs(collected);
      setView('sent');
      clearBasket();
    } catch {
      setErr(t('Network error. Try again.', 'Ağ hatası. Tekrar dene.'));
    } finally {
      setSubmitting(false);
    }
  }

  const ui = (
    <>
      {/* Floating badge */}
      <button
        type="button"
        onClick={() => { setOpen(true); setView('list'); }}
        aria-label={t('Open RFQ basket', 'RFQ sepetini aç')}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2.5 text-navy-700 font-semibold shadow-[0_12px_32px_-8px_rgba(245,165,36,0.5)] ring-1 ring-amber/70 hover:bg-amber-600 transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 3h2l3.6 12.59A2 2 0 0 0 10.55 17h7.45a2 2 0 0 0 1.95-1.57L21 8H6" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
        </svg>
        <span className="font-head text-[13px] uppercase tracking-[0.14em]">
          {t('RFQ', 'RFQ')} · {totalItems}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="lm-rfq-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              key="lm-rfq-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
              className="fixed right-0 top-0 z-50 flex h-screen w-[min(440px,94vw)] flex-col bg-white text-ink"
              role="dialog"
              aria-modal="true"
              aria-label={t('RFQ basket', 'RFQ sepeti')}
            >
              <div className="shrink-0 flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-600">
                    {t('RFQ basket', 'RFQ sepeti')}
                  </div>
                  <div className="font-head font-bold text-[15px] text-navy-700">
                    {items.length} {t('parts', 'parça')} · {totalItems} {t('items', 'adet')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('Close', 'Kapat')}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 hover:bg-navy-100"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {view === 'sent' ? (
                  <div className="text-center py-8">
                    <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-[18px] font-bold mb-2 text-navy-700">
                      {t("Sent. We'll reply with prices today.", 'Gönderildi. Bugün içinde fiyatlarla döneriz.')}
                    </h3>
                    <p className="text-ink-muted text-[13.5px] mb-3">
                      {t(
                        'Same-day turnaround. Most batch quotes within 1 hour.',
                        'Aynı iş günü içinde. Çoğu toplu teklif 1 saat içinde döner.'
                      )}
                    </p>
                    <div className="font-mono text-[12px] text-ink-subtle">
                      {t('References', 'Referanslar')}:
                      <div className="mt-1 text-ink">{refs.join(' · ')}</div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Items */}
                    <ul className="divide-y divide-line mb-5">
                      {items.map((it) => (
                        <li key={it.id} className="py-3 flex gap-3">
                          {it.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={it.image}
                              alt={it.name}
                              className="h-14 w-14 rounded-md object-cover bg-navy-50 shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-md bg-navy-700 shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-amber-600 mb-0.5 truncate">
                              {it.brand || t('Brand on request', 'Marka teklifle')}
                            </div>
                            <div className="text-[13px] font-semibold leading-tight text-ink line-clamp-2">
                              {it.name}
                            </div>
                            {it.partNumber && (
                              <div className="font-mono text-[11px] text-ink-subtle">{it.partNumber}</div>
                            )}
                            <div className="mt-1.5 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-md border border-line">
                                <button
                                  type="button"
                                  onClick={() => setItems(updateQuantity(it.id, it.quantity - 1))}
                                  className="px-2 py-0.5 text-[14px] font-bold text-ink-muted hover:text-ink"
                                >−</button>
                                <span className="w-8 text-center text-[12.5px]">{it.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => setItems(updateQuantity(it.id, it.quantity + 1))}
                                  className="px-2 py-0.5 text-[14px] font-bold text-ink-muted hover:text-ink"
                                >+</button>
                              </div>
                              <button
                                type="button"
                                onClick={() => setItems(removeFromBasket(it.id))}
                                className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle hover:text-red-600"
                              >
                                {t('remove', 'çıkar')}
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Item-only subtotal — no shipping baseline shown */}
                    {itemSubtotal != null && (
                      <div className="mb-3 rounded-lg border border-amber/40 bg-amber/5 px-3.5 py-2.5">
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-700">
                            {t('Items subtotal', 'Ürün toplamı')}
                          </span>
                          <span className="font-head font-extrabold text-[20px] text-navy-700">
                            {fmt(itemSubtotal, locale)}
                          </span>
                        </div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-700">
                          + {t('shipping after delivery info', 'kargo bilgi sonrası')}
                        </div>
                      </div>
                    )}

                    {/* Promise */}
                    <div className="mb-4 rounded-lg bg-amber/10 border border-amber/30 px-3.5 py-2.5">
                      <div className="text-[12.5px] leading-relaxed">
                        <strong className="text-amber-700">{t('Same-day quote.', 'Aynı gün içinde teklif.')}</strong>{' '}
                        {t(
                          'Submit company + delivery location below; we reply with the full price including shipping the same business day.',
                          'Aşağıya firma + teslim yerini gir; tüm fiyatı (kargo dahil) aynı iş günü içinde döneriz.'
                        )}
                      </div>
                    </div>

                    {/* Urgency */}
                    <label className="field-label">{t('When?', 'Ne zaman?')}</label>
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      {([
                        { id: 'aog',     en: 'AOG',     tr: 'AOG' },
                        { id: 'urgent',  en: 'Urgent',  tr: 'Acil' },
                        { id: 'planned', en: 'Planned', tr: 'Planlı' }
                      ] as const).map((opt) => {
                        const on = urgency === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setUrgency(opt.id)}
                            className={`p-2 rounded-md border text-[12px] font-mono uppercase tracking-[0.1em] transition ${
                              on
                                ? opt.id === 'aog'
                                  ? 'bg-red-600 text-white border-red-600'
                                  : opt.id === 'urgent'
                                    ? 'bg-amber text-navy-700 border-amber'
                                    : 'bg-navy-700 text-white border-navy-700'
                                : 'bg-white text-ink border-line hover:border-amber'
                            }`}
                          >
                            {t(opt.en, opt.tr)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 gap-2.5 mb-3">
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('Name *', 'İsim *')} className="field-input" autoComplete="name" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('Email *', 'E-posta *')} className="field-input" autoComplete="email" />
                      <input type="text" value={vessel} onChange={(e) => setVessel(e.target.value)} placeholder={t('Vessel (optional)', 'Gemi (opsiyonel)')} className="field-input" />
                      <input type="text" value={port} onChange={(e) => setPort(e.target.value)} placeholder={t('Port (optional)', 'Liman (opsiyonel)')} className="field-input" />
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder={t('Notes (optional)', 'Notlar (opsiyonel)')} className="field-input" />
                    </div>

                    {err && (
                      <div role="alert" className="mb-3 text-[13px] font-mono text-red-600">{err}</div>
                    )}
                  </>
                )}
              </div>

              {view === 'list' && (
                <div className="shrink-0 border-t border-line px-5 py-4 bg-white">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-accent btn-lg w-full disabled:opacity-60"
                  >
                    {submitting
                      ? t('Sending…', 'Gönderiliyor…')
                      : t(`Request quote for ${items.length} parts — same day`, `${items.length} parça için teklif al — aynı gün`)}
                  </button>
                  <button
                    type="button"
                    onClick={() => { clearBasket(); setOpen(false); }}
                    className="mt-2 w-full text-center font-mono text-[11px] uppercase tracking-[0.12em] text-ink-subtle hover:text-ink"
                  >
                    {t('clear basket', 'sepeti boşalt')}
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(ui, document.body);
}
