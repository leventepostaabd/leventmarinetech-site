'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { addToBasket } from '@/lib/rfq-basket';
import { MARKUP_RATE, fmt } from '@/lib/pricing';

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
  locale: 'en' | 'tr';
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

  const unitMarked = product.priceRaw != null ? product.priceRaw * (1 + MARKUP_RATE) : null;
  const itemTotal = unitMarked != null ? unitMarked * qty : null;

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
        <>
          <motion.div
            key="lm-pq-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-navy-900/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="lm-pq-panel"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ height: 'min(580px, 86vh)' }}
            className="fixed left-1/2 top-1/2 z-[60] w-[min(560px,94vw)] -translate-x-1/2 -translate-y-1/2 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
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
              {/* Estimated item price — clear, no shipping */}
              <div className="mb-4 rounded-lg border border-amber/40 bg-amber/5 px-4 py-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-700">
                    {t('Estimated item price', 'Tahmini ürün fiyatı')}
                  </span>
                  {itemTotal != null ? (
                    <span className="font-head font-extrabold text-[22px] text-navy-700">
                      {fmt(itemTotal, locale)}
                    </span>
                  ) : (
                    <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-amber-600">
                      {t('Quote on request', 'Talep üzerine teklif')}
                    </span>
                  )}
                </div>
                {unitMarked != null && qty > 1 && (
                  <div className="font-mono text-[11px] text-ink-muted mt-0.5">
                    {qty} × {fmt(unitMarked, locale)}
                  </div>
                )}
                <div className="mt-2.5 pt-2.5 border-t border-amber/30 text-[12px] text-ink-muted leading-relaxed">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber-700 block mb-1">
                    + {t('shipping calculated after delivery info', 'kargo bilgilerinizden sonra hesaplanır')}
                  </span>
                  {t(
                    'Once you submit your company info + delivery port, we reply with the full price (item + shipping + any vessel-specific compatibility) the same business day. Most quotes within 30 minutes.',
                    'Firma bilgisi + teslim limanını ilettiğinizde, tüm fiyatı (ürün + kargo + gemine özel uyumluluk varsa) aynı iş günü içinde döneriz. Çoğu teklif 30 dk içinde.'
                  )}
                </div>
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
        </>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(content, document.body) : null;
}
