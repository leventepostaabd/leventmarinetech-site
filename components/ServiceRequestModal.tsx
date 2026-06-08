'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export type ServiceItem = {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
};

type WhenWindow = 'now' | '24h' | 'week' | 'planned';

/**
 * In-page service request — opens over /services when a system card is tapped.
 * Shows the system, collects the essentials and posts to /api/service-request.
 * No navigation; the whole exchange happens in the same place.
 */
export default function ServiceRequestModal({
  item,
  open,
  onClose,
  locale
}: {
  item: ServiceItem | null;
  open: boolean;
  onClose: () => void;
  locale: Locale;
}) {
  const tr = locale === 'tr';
  const t = (en: string, trv: string) => (tr ? trv : en);

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', vessel: '', imo: '', port: '', when: '24h' as WhenWindow, notes: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) { setState('idle'); setForm((f) => ({ ...f, notes: '' })); }
  }, [open, item]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!item) return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSend = form.name.trim() && /.+@.+\..+/.test(form.email) && form.port.trim() && state !== 'sending';

  async function submit() {
    if (!canSend || !item) return;
    setState('sending');
    try {
      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_slug: item.slug,
          system_name: item.name,
          port: form.port,
          when: form.when,
          contact: {
            name: form.name,
            email: form.email,
            phone: form.phone || undefined,
            vessel_name: form.vessel || undefined,
            imo: form.imo || undefined
          },
          notes: form.notes || undefined,
          locale: tr ? 'tr' : 'en'
        })
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  const whenOpts: { v: WhenWindow; en: string; tr: string }[] = [
    { v: 'now', en: 'Now / AOG', tr: 'Şimdi / AOG' },
    { v: '24h', en: 'Within 24h', tr: '24 saat içinde' },
    { v: 'week', en: 'This week', tr: 'Bu hafta' },
    { v: 'planned', en: 'Planned', tr: 'Planlı' }
  ];

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            key="srm-scrim"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="srm-panel"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ maxHeight: 'min(640px, 92vh)' }}
            className="relative flex w-[min(560px,95vw)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog" aria-modal="true" aria-label={item.name}
          >
            {/* Header */}
            <div className="shrink-0 border-b border-line bg-navy-700 px-5 py-4 text-white">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber">{item.kicker}</div>
              <h2 className="mt-0.5 text-[18px] font-extrabold leading-tight">{item.name}</h2>
              <p className="mt-1 line-clamp-2 text-[12.5px] text-white/70">{item.summary}</p>
              <button
                type="button" onClick={onClose} aria-label={t('Close', 'Kapat')}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {state === 'done' ? (
              <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-700">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <h3 className="text-[17px] font-bold text-navy-700">{t('Request received', 'Talebiniz alındı')}</h3>
                <p className="max-w-sm text-[13.5px] text-ink-muted">
                  {t('Our next available technician will reply shortly — usually within the hour.', 'Bir sonraki müsait teknisyenimiz kısa süre içinde dönecek — genellikle 1 saat içinde.')}
                </p>
                <button type="button" onClick={onClose} className="btn-primary btn-md mt-2">{t('Done', 'Tamam')}</button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label={t('Your name', 'Adınız') + ' *'} value={form.name} onChange={set('name')} />
                  <Field label={t('Email', 'E-posta') + ' *'} value={form.email} onChange={set('email')} type="email" />
                  <Field label={t('Phone / WhatsApp', 'Telefon / WhatsApp')} value={form.phone} onChange={set('phone')} />
                  <Field label={t('Port', 'Liman') + ' *'} value={form.port} onChange={set('port')} />
                  <Field label={t('Vessel', 'Gemi')} value={form.vessel} onChange={set('vessel')} />
                  <Field label="IMO" value={form.imo} onChange={set('imo')} />
                </div>

                <div className="mt-4">
                  <div className="field-label">{t('When', 'Ne zaman')}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {whenOpts.map((o) => (
                      <button
                        key={o.v} type="button"
                        onClick={() => setForm((f) => ({ ...f, when: o.v }))}
                        className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                          form.when === o.v ? 'bg-amber text-navy-700 ring-1 ring-amber' : 'bg-navy-50 text-ink-muted ring-1 ring-line hover:bg-navy-100'
                        }`}
                      >
                        {tr ? o.tr : o.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="field-label">{t('Fault / notes', 'Arıza / not')}</div>
                  <textarea
                    value={form.notes} onChange={set('notes')} rows={3}
                    placeholder={t('Symptoms, system details, anything that helps…', 'Belirtiler, sistem detayı, yardımcı olacak her şey…')}
                    className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] outline-none focus:border-amber focus:ring-2 focus:ring-amber/40"
                  />
                </div>

                {state === 'error' && (
                  <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
                    {t('Could not send — please try WhatsApp or email.', 'Gönderilemedi — WhatsApp veya e-posta deneyin.')}
                  </p>
                )}
              </div>
            )}

            {state !== 'done' && (
              <div className="shrink-0 border-t border-line bg-white px-5 py-3">
                <button
                  type="button" onClick={submit} disabled={!canSend}
                  className="btn-accent btn-md w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {state === 'sending' ? t('Sending…', 'Gönderiliyor…') : t('Request service', 'Servis iste')} →
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(content, document.body) : null;
}

function Field({
  label, value, onChange, type = 'text'
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        type={type} value={value} onChange={onChange}
        className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] outline-none focus:border-amber focus:ring-2 focus:ring-amber/40"
      />
    </label>
  );
}
