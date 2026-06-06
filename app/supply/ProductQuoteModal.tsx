'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { addToBasket } from '@/lib/rfq-basket';

export type ModalProduct = {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
  partNumber?: string;
  description?: string;
  image?: string;
  /** Raw supplier (eBay) unit price in USD — used for live estimate calc. */
  priceRaw?: number | null;
  /** Manufacturer detail / listing URL (distributor). */
  url?: string;
  /** Manufacturer datasheet (PDF) URL. */
  datasheetUrl?: string;
  /** Distributor category label. */
  category?: string;
  /** Technical attributes for the spec table. */
  specs?: { name: string; value: string }[];
};

/**
 * Single-product quote modal — restructured per 2026-05-21 part 2.
 *
 * Show item price (with our markup) up front. Do NOT show shipping —
 * marine shipping depends on weight, port, carrier, vessel position;
 * pretending to give a baseline misleads the customer. Instead set
 * expectation: "Shipping calculated once you submit company + delivery
 * location. Full quote returns today."
 *
 * Two primary paths now: "Add to RFQ" or "Continue browsing". Direct
 * contact (WhatsApp / Email) stays as a side channel.
 */
export default function ProductQuoteModal({
  product,
  open,
  onClose,
  onAdded,
  locale
}: {
  product: ModalProduct | null;
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
  locale: Locale;
}) {
  const [qty, setQty] = useState(1);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  useEffect(() => {
    if (open && product) setQty(1);
  }, [open, product]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!product) return null;

  const waText = encodeURIComponent(
    `Hi Levent Marine,\n\n` +
    `Could you quote this part?\n` +
    `Brand: ${product.brand || '—'}\n` +
    `Model: ${product.partNumber || '—'}\n` +
    `Item: ${product.name}\n` +
    `Qty: ${qty}\n`
  );
  const waUrl = `https://wa.me/16193840403?text=${waText}`;
  const mailSubject = encodeURIComponent(`Quote request: ${product.brand || ''} ${product.partNumber || product.name}`.trim());
  const mailBody = decodeURIComponent(waText);
  const mailUrl = `mailto:rfq@leventmarinetech.com?subject=${mailSubject}&body=${encodeURIComponent(mailBody)}`;

  function handleAddToBasket() {
    if (!product) return;
    addToBasket({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      partNumber: product.partNumber,
      image: product.image,
      priceRaw: product.priceRaw ?? null,
      quantity: qty
    });
    onAdded?.();
    onClose();
  }

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            key="lm-pq-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="lm-pq-panel"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ maxHeight: 'min(760px, 92vh)' }}
            className="relative w-[min(640px,94vw)] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl pointer-events-auto"
            role="dialog"
            aria-modal="true"
            aria-label={t('Add to RFQ', "RFQ'ye ekle")}
          >
            {/* Header */}
            <div className="shrink-0 flex items-start gap-3.5 border-b border-line p-4 bg-white">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-lg object-cover bg-navy-50 shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-navy-700 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-600 mb-1">
                  {product.brand || t('Brand on request', 'Marka teklifle')}
                </div>
                <h2 className="text-[15.5px] font-bold leading-tight text-navy-700 line-clamp-2">{product.name}</h2>
                {product.partNumber && (
                  <div className="font-mono text-[11.5px] text-ink-subtle mt-0.5">{product.partNumber}</div>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('Close', 'Kapat')}
                className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 hover:bg-navy-100"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Large product image */}
              {product.image && (
                <div className="mb-4 overflow-hidden rounded-xl bg-navy-50 ring-1 ring-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="mx-auto h-52 w-full object-contain p-4"
                    onError={(e) => { (e.target as HTMLImageElement).closest('div')!.style.display = 'none'; }}
                  />
                </div>
              )}

              {/* Category + full description */}
              {(product.category || product.description) && (
                <div className="mb-4">
                  {product.category && (
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
                      {product.category}
                    </div>
                  )}
                  {product.description && (
                    <p className="line-clamp-4 text-[13px] leading-relaxed text-ink-muted">
                      {product.description}
                    </p>
                  )}
                </div>
              )}

              {/* Technical specifications (from Mouser / Digi-Key) */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-4">
                  <div className="kicker mb-2">{t('Specifications', 'Teknik özellikler')}</div>
                  <dl className="divide-y divide-line/70 overflow-hidden rounded-lg ring-1 ring-line">
                    {product.specs.map((s) => (
                      <div key={s.name} className="grid grid-cols-[42%_58%] gap-2 px-3 py-2 odd:bg-navy-50/40">
                        <dt className="text-[12px] text-ink-subtle">{s.name}</dt>
                        <dd className="text-[12px] font-medium text-ink">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Datasheet + manufacturer detail */}
              {(product.datasheetUrl || product.url) && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {product.datasheetUrl && (
                    <a
                      href={product.datasheetUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-[12.5px] font-semibold text-navy-700 no-underline transition hover:border-amber hover:text-amber-700"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" />
                      </svg>
                      {t('Datasheet', 'Teknik föy')}
                    </a>
                  )}
                  {product.url && (
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-[12.5px] font-semibold text-navy-700 no-underline transition hover:border-amber hover:text-amber-700"
                    >
                      {t('Full technical detail', 'Tüm teknik detay')}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7" /><path d="M7 7h10v10" />
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {/* Quote-only banner — no item price, no shipping math.
                  Item + shipping + lead time all travel through the RFQ
                  reply (decision F3 / T3 — no public prices). */}
              <div className="mb-4 rounded-lg border border-amber/40 bg-amber/5 px-4 py-3">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-700 mb-1.5">
                  {t('Quote-only request', 'Sadece teklif')}
                </div>
                <p className="text-[13px] text-ink leading-relaxed">
                  {t(
                    'Submit your delivery port + vessel and we reply with item price, shipping and lead time the same business day. Most quotes within 30 minutes.',
                    'Teslim limanı + gemi bilgisi gönderin, aynı iş günü içinde ürün fiyatı, kargo ve teslim süresiyle dönelim. Çoğu teklif 30 dk içinde.'
                  )}
                </p>
              </div>

              {/* Quantity */}
              <div className="mb-5 flex items-center gap-4">
                <label className="field-label !mb-0 shrink-0 w-20 text-[13px]">
                  {t('Quantity', 'Adet')}
                </label>
                <div className="inline-flex items-center rounded-md border border-line-strong">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-1.5 text-[16px] font-bold text-ink-muted hover:text-ink"
                    aria-label={t('Decrease', 'Azalt')}
                  >−</button>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                    className="w-16 text-center text-[14px] py-1.5 border-0 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="px-3 py-1.5 text-[16px] font-bold text-ink-muted hover:text-ink"
                    aria-label={t('Increase', 'Artır')}
                  >+</button>
                </div>
              </div>

              {/* Direct channels */}
              <div className="mt-5 pt-4 border-t border-line">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-subtle mb-2.5 text-center">
                  {t('or contact us directly', 'veya doğrudan iletişim')}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-3.5 py-2 text-white text-[12.5px] font-semibold no-underline hover:opacity-95"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.5 3.5A11 11 0 0 0 12 0a11 11 0 0 0-9.5 16.5L0 24l7.7-2.5A11 11 0 1 0 20.5 3.5zM12 21.6a9.6 9.6 0 0 1-4.9-1.4l-.4-.2-4.6 1.5 1.5-4.5-.2-.3a9.6 9.6 0 1 1 8.6 5z" />
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href={mailUrl}
                    className="inline-flex items-center gap-2 rounded-md bg-navy-700 px-3.5 py-2 text-white text-[12.5px] font-semibold no-underline hover:bg-navy-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22 6 12 13 2 6" />
                    </svg>
                    Email
                  </a>
                </div>
              </div>
            </div>

            {/* Footer actions — primary buttons stick to the bottom */}
            <div className="shrink-0 border-t border-line px-4 py-3 bg-white grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleAddToBasket}
                className="btn-accent btn-md"
              >
                + {t('Add to RFQ', "RFQ'ye ekle")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost btn-md"
              >
                {t('Continue browsing', 'Aramaya devam')} →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(content, document.body) : null;
}
