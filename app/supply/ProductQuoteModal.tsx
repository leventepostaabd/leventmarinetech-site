'use client';

import { useEffect, useRef, useState } from 'react';
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
};

type Urgency = 'aog' | 'urgent' | 'planned';
type View = 'form' | 'sent';

/**
 * Single-product quote modal — hybrid of paths C and D from the
 * 2026-05-21 UX conversation:
 *   1. Quick quote form  (qty + urgency + email + optional vessel/port)
 *   2. Add to RFQ basket (collect multiple items, submit together later)
 *   3. WhatsApp / Email direct contact (pre-filled message)
 *
 * Hard rule: prices are never shown anywhere. Promise: same-day quote.
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
  const [urgency, setUrgency] = useState<Urgency>('planned');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [vessel, setVessel] = useState('');
  const [port, setPort] = useState('');
  const [notes, setNotes] = useState('');
  const [view, setView] = useState<View>('form');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  // Reset every time a different product opens
  useEffect(() => {
    if (open && product) {
      setQty(1);
      setUrgency('planned');
      setEmail('');
      setName('');
      setVessel('');
      setPort('');
      setNotes('');
      setView('form');
      setErr(null);
      setRef(null);
      setTimeout(() => emailRef.current?.focus(), 60);
    }
  }, [open, product]);

  // Esc to close
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
    `Qty: ${qty}\n` +
    (vessel ? `Vessel: ${vessel}\n` : '') +
    (port ? `Port: ${port}\n` : '')
  );
  const waUrl = `https://wa.me/16193840403?text=${waText}`;
  const mailSubject = encodeURIComponent(`Quote request: ${product.brand || ''} ${product.partNumber || product.name}`.trim());
  const mailBody = decodeURIComponent(waText);
  const mailUrl = `mailto:rfq@leventmarinetech.com?subject=${mailSubject}&body=${encodeURIComponent(mailBody)}`;

  function genRef() {
    return 'LM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function handleAddToBasket() {
    if (!product) return;
    addToBasket({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      partNumber: product.partNumber,
      image: product.image,
      quantity: qty
    });
    onAdded?.();
    onClose();
  }

  async function handleSubmit() {
    if (!product) return;
    setErr(null);
    if (!email.trim() || !/.+@.+\..+/.test(email)) {
      setErr(t('Valid email required.', 'Geçerli e-posta gerekli.'));
      return;
    }
    if (!name.trim()) {
      setErr(t('Your name is required.', 'Adınız gerekli.'));
      return;
    }
    setSubmitting(true);
    const payload = {
      kind: 'supply' as const,
      product: product.name,
      brand: product.brand,
      partNumber: product.partNumber,
      quantity: qty,
      urgency,
      vesselName: vessel || undefined,
      port: port || undefined,
      contactName: name,
      contactEmail: email,
      notes: notes || undefined
    };
    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store'
      });
      if (!res.ok) {
        setErr(t('Could not send. Try WhatsApp or email below.', 'Gönderilemedi. Aşağıdaki WhatsApp/e-posta yolu dene.'));
        setSubmitting(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setRef(data?.reference || genRef());
      setView('sent');
    } catch {
      setErr(t('Network error. Try WhatsApp or email below.', 'Ağ hatası. WhatsApp veya e-posta yolu dene.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
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
            className="fixed left-1/2 top-1/2 z-[60] w-[min(720px,94vw)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={t('Get quote for product', 'Ürün için teklif al')}
          >
            {/* Header */}
            <div className="shrink-0 flex items-start gap-4 border-b border-line p-5 bg-white">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-20 rounded-lg object-cover bg-navy-50 shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="h-20 w-20 rounded-lg bg-navy-700 shrink-0 flex items-center justify-center text-white/60 font-mono text-[10px]">
                  {t('no photo', 'foto yok')}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-600 mb-1">
                  {product.brand || t('Brand on request', 'Marka teklifle')}
                </div>
                <h2 className="text-[17px] font-bold leading-tight text-navy-700 line-clamp-2">{product.name}</h2>
                {product.partNumber && (
                  <div className="font-mono text-[12px] text-ink-subtle mt-0.5">{product.partNumber}</div>
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
            <div className="flex-1 overflow-y-auto p-5">
              {view === 'sent' && ref ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-bold mb-2 text-navy-700">
                    {t("Got it. We'll reply with a price today.", 'Aldık. Bugün içinde fiyatla döneriz.')}
                  </h3>
                  <p className="text-ink-muted text-[13.5px] mb-1">
                    {t(
                      'Your request is on the desk. Most quotes go back within 30 minutes; same business day at the latest.',
                      'Talebin masada. Çoğu teklif 30 dk içinde döner; en geç aynı iş günü içinde.'
                    )}
                  </p>
                  <p className="font-mono text-[12.5px] text-ink-subtle mt-2">
                    {t('Reference', 'Referans')}: <span className="text-ink">{ref}</span>
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <a href={waUrl} target="_blank" rel="noreferrer noopener" className="btn-accent btn-md no-underline">
                      WhatsApp
                    </a>
                    <button type="button" onClick={onClose} className="btn-ghost btn-md">
                      {t('Keep browsing', 'Aramaya devam')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Same-day promise banner */}
                  <div className="mb-5 rounded-lg bg-amber/10 border border-amber/30 px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      <div className="text-[13px] text-ink leading-relaxed">
                        <strong className="text-amber-700">
                          {t('Same-day quote.', 'Aynı gün içinde teklif.')}
                        </strong>{' '}
                        {t(
                          'Most requests go back within 30 minutes; never later than end of business day. Every quote includes US-port lead time + compatibility note. No prices shown here — we tailor it to your vessel.',
                          '30 dakika içinde dönüşün yapılır; en geç iş günü kapanmadan teklif elinde olur. Her teklif ABD-liman teslim süresi ve uyumluluk notu içerir. Burada fiyat yok — gemine özel hazırlıyoruz.'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-4 flex items-center gap-4">
                    <label className="field-label !mb-0 shrink-0 w-20">
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

                  {/* Urgency */}
                  <div className="mb-4">
                    <label className="field-label">{t('When do you need it?', 'Ne zaman lazım?')}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { id: 'aog',     en: 'AOG — vessel waiting',      tr: 'AOG — gemi bekliyor' },
                        { id: 'urgent',  en: 'Urgent — within 48h',       tr: 'Acil — 48 saat içinde' },
                        { id: 'planned', en: 'Planned',                    tr: 'Planlı' }
                      ] as const).map((opt) => {
                        const on = urgency === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setUrgency(opt.id)}
                            className={`text-left p-2.5 rounded-md border text-[12.5px] leading-tight transition ${
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
                  </div>

                  {/* Contact */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="field-label">{t('Name', 'İsim')} *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="field-input"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="field-label">{t('Email', 'E-posta')} *</label>
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="field-input"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="field-label">{t('Vessel (optional)', 'Gemi (opsiyonel)')}</label>
                      <input
                        type="text"
                        value={vessel}
                        onChange={(e) => setVessel(e.target.value)}
                        className="field-input"
                        placeholder="MV …"
                      />
                    </div>
                    <div>
                      <label className="field-label">{t('Port (optional)', 'Liman (opsiyonel)')}</label>
                      <input
                        type="text"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        className="field-input"
                        placeholder={t('e.g. Houston, TX', 'örn. Houston, TX')}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="field-label">{t('Anything we should know? (optional)', 'Eklemek istediğin? (opsiyonel)')}</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="field-input"
                      placeholder={t('Compatibility notes, alternative models, etc.', 'Uyumluluk notu, eşdeğer model, vs.')}
                    />
                  </div>

                  {err && (
                    <div role="alert" className="mb-3 text-[13px] font-mono text-red-600">{err}</div>
                  )}

                  {/* Primary actions */}
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn-accent btn-lg disabled:opacity-60"
                    >
                      {submitting
                        ? t('Sending…', 'Gönderiliyor…')
                        : t('Get quote — same day', 'Teklif al — aynı gün')}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddToBasket}
                      className="btn-ghost btn-lg"
                    >
                      + {t('Add to RFQ list', 'RFQ listesine ekle')}
                    </button>
                  </div>

                  {/* Direct channels */}
                  <div className="mt-5 pt-4 border-t border-line">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-subtle mb-2 text-center">
                      {t('or contact us directly', 'veya doğrudan iletişim')}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-white text-[13px] font-semibold no-underline hover:opacity-95"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M20.5 3.5A11 11 0 0 0 12 0a11 11 0 0 0-9.5 16.5L0 24l7.7-2.5A11 11 0 1 0 20.5 3.5zM12 21.6a9.6 9.6 0 0 1-4.9-1.4l-.4-.2-4.6 1.5 1.5-4.5-.2-.3a9.6 9.6 0 1 1 8.6 5z" />
                        </svg>
                        WhatsApp · +1 619 384 0403
                      </a>
                      <a
                        href={mailUrl}
                        className="inline-flex items-center gap-2 rounded-md bg-navy-700 px-4 py-2 text-white text-[13px] font-semibold no-underline hover:bg-navy-600"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22 6 12 13 2 6" />
                        </svg>
                        Email RFQ
                      </a>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="mt-5 pt-4 border-t border-line text-[12.5px] text-ink-muted leading-relaxed">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-subtle mb-1.5">
                      {t('How it works', 'Nasıl çalışır')}
                    </div>
                    <p>
                      <strong className="text-navy-700">{t('Pricing', 'Fiyat')}:</strong>{' '}
                      {t('every quote is vessel-specific — qty, port, urgency and compatibility verification all factor in. That is why we do not show numbers up front.', 'her teklif gemiye özel — adet, liman, aciliyet ve uyumluluk doğrulamasına göre değişir. Bu yüzden burada rakam göstermiyoruz.')}
                    </p>
                    <p className="mt-1.5">
                      <strong className="text-navy-700">{t('Delivery', 'Teslimat')}:</strong>{' '}
                      {t('24–72h to most US ports via Wyoming-LLC DDP, 3–7 days worldwide. Stock confirmed after supplier check.', 'ABD limanlarının çoğuna 24–72 saat (Wyoming LLC DDP), dünya çapı 3–7 gün. Stok tedarikçi onayından sonra netleşir.')}
                    </p>
                    <p className="mt-1.5">
                      <strong className="text-navy-700">{t('Order', 'Sipariş')}:</strong>{' '}
                      {t('quote → PO / proforma by email → wire or card → tracking via WhatsApp.', 'teklif → mail ile PO/proforma → wire transfer veya kart → WhatsApp ile takip.')}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
