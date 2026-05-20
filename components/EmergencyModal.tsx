'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE } from '@/lib/site';

export type EmergencyModalProps = {
  open: boolean;
  onClose: () => void;
  locale: 'en' | 'tr';
};

type FormState = {
  vessel: string;
  imo: string;
  port: string;
  system: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const COPY = {
  en: {
    title: 'Emergency dispatch',
    sub: '24/7 worldwide marine electrical response. Pick the fastest channel.',
    call: 'Call Now',
    callSub: 'Direct line — answered immediately.',
    wa: 'WhatsApp',
    waSub: 'Text + photos. Reply within minutes.',
    form: '10-sec Form',
    formSub: 'Vessel · IMO · Port · System.',
    vessel: 'Vessel name',
    imo: 'IMO',
    port: 'Port / Location',
    system: 'System / Symptom',
    submit: 'Send — call me back',
    submitting: 'Sending…',
    success: "We've got it. Calling you back within 10 minutes.",
    error: 'Could not send. Please use Call or WhatsApp above.',
    close: 'Close',
    or: 'or fill the 10-second form',
    required: 'Required'
  },
  tr: {
    title: 'Acil müdahale',
    sub: '7/24 worldwide marine elektrik müdahalesi. En hızlı kanalı seç.',
    call: 'Hemen Ara',
    callSub: 'Direkt hat — anında cevap.',
    wa: 'WhatsApp',
    waSub: 'Yazı + fotoğraf. Dakikalar içinde dönüş.',
    form: '10 sn Form',
    formSub: 'Gemi · IMO · Liman · Sistem.',
    vessel: 'Gemi adı',
    imo: 'IMO',
    port: 'Liman / Konum',
    system: 'Sistem / Belirti',
    submit: 'Gönder — beni geri ara',
    submitting: 'Gönderiliyor…',
    success: 'Aldık. 10 dakika içinde sizi geri arıyoruz.',
    error: 'Gönderilemedi. Lütfen Ara veya WhatsApp seçeneklerini kullanın.',
    close: 'Kapat',
    or: 'veya 10 saniyelik formu doldur',
    required: 'Zorunlu'
  }
} as const;

export default function EmergencyModal({ open, onClose, locale }: EmergencyModalProps) {
  const t = COPY[locale];
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLAnchorElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>({ vessel: '', imo: '', port: '', system: '' });
  const [status, setStatus] = useState<Status>('idle');

  const close = useCallback(() => {
    setShowForm(false);
    setStatus('idle');
    setForm({ vessel: '', imo: '', port: '', system: '' });
    onClose();
  }, [onClose]);

  // Escape key + lock scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') trapFocus(e, dialogRef.current);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into dialog on mount
    setTimeout(() => firstFocusRef.current?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vessel || !form.port || !form.system) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Emergency-modal contract (spec):
          source: 'emergency',
          vessel: form.vessel,
          imo: form.imo,
          port: form.port,
          system: form.system,
          contact_required: true,
          // Also pass shapes the current zod schema understands so today's
          // endpoint still accepts the payload before Agent B updates it.
          vesselName: form.vessel,
          problemCategory: form.system,
          urgency: 'aog',
          contactName: form.vessel || 'Emergency caller',
          contactEmail: 'emergency@leventmarinetech.com'
        })
      });
      if (!res.ok) throw new Error('non-2xx');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const callHref = `tel:${SITE.phoneUS.replace(/\s+/g, '')}`;
  const waHref = SITE.whatsappUS;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/75 backdrop-blur-sm px-4 py-6"
          aria-hidden={!open}
          onMouseDown={(e) => {
            // click on backdrop closes; clicks inside dialog don't bubble
            if (e.target === overlayRef.current) close();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="emergency-title"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl"
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label={t.close}
              className="absolute right-3 top-3 rounded-md p-2 text-ink-muted transition hover:bg-navy-50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="border-b border-line px-7 pb-5 pt-7">
              <div className="kicker mb-2">EMERGENCY · 24/7</div>
              <h2 id="emergency-title" className="text-2xl md:text-3xl">
                {t.title}
              </h2>
              <p className="mt-2 text-[14.5px] text-ink-muted">{t.sub}</p>
            </div>

            {/* Three buttons */}
            <div className="grid grid-cols-1 gap-3 px-7 pt-6 md:grid-cols-3">
              <a
                ref={firstFocusRef}
                href={callHref}
                className="group flex flex-col items-start gap-1 rounded-lg border-2 border-red-600 bg-red-600 px-4 py-4 text-white no-underline transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
              >
                <div className="flex items-center gap-2 font-head text-lg font-bold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {t.call}
                </div>
                <div className="text-[12px] text-white/90">{t.callSub}</div>
                <div className="mt-1 font-mono text-[12.5px] text-white/95">{SITE.phoneUS}</div>
              </a>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-start gap-1 rounded-lg border-2 border-green-600 bg-white px-4 py-4 text-green-700 no-underline transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
              >
                <div className="flex items-center gap-2 font-head text-lg font-bold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.825 9.825 0 0 1 6.991 2.898 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.889 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.453 3.488z" />
                  </svg>
                  {t.wa}
                </div>
                <div className="text-[12px] text-ink-muted">{t.waSub}</div>
                <div className="mt-1 font-mono text-[12.5px] text-green-700">{SITE.phoneUS}</div>
              </a>

              <button
                type="button"
                onClick={() => setShowForm((v) => !v)}
                aria-expanded={showForm}
                aria-controls="emergency-form"
                className="group flex flex-col items-start gap-1 rounded-lg border-2 border-navy-700 bg-white px-4 py-4 text-navy-700 transition hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
              >
                <div className="flex items-center gap-2 font-head text-lg font-bold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  {t.form}
                </div>
                <div className="text-[12px] text-ink-muted">{t.formSub}</div>
              </button>
            </div>

            {/* Form / status panel */}
            <div className="px-7 pb-7 pt-5">
              {status === 'success' ? (
                <div className="rounded-lg border border-green-300 bg-green-50 px-5 py-4 text-green-800">
                  <div className="font-head text-base font-bold">{t.success}</div>
                </div>
              ) : (
                <>
                  {!showForm ? (
                    <p className="text-[13px] text-ink-subtle">
                      <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="underline decoration-dotted underline-offset-4 hover:text-amber-600"
                      >
                        {t.or}
                      </button>
                    </p>
                  ) : (
                    <form id="emergency-form" onSubmit={submitForm} className="grid gap-3 sm:grid-cols-2" noValidate>
                      <div>
                        <label className="field-label" htmlFor="em-vessel">{t.vessel}</label>
                        <input
                          id="em-vessel"
                          required
                          value={form.vessel}
                          onChange={(e) => setForm((f) => ({ ...f, vessel: e.target.value }))}
                          className="field-input"
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="em-imo">{t.imo}</label>
                        <input
                          id="em-imo"
                          value={form.imo}
                          onChange={(e) => setForm((f) => ({ ...f, imo: e.target.value }))}
                          className="field-input"
                          autoComplete="off"
                          inputMode="numeric"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="em-port">{t.port}</label>
                        <input
                          id="em-port"
                          required
                          value={form.port}
                          onChange={(e) => setForm((f) => ({ ...f, port: e.target.value }))}
                          className="field-input"
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="em-system">{t.system}</label>
                        <input
                          id="em-system"
                          required
                          value={form.system}
                          onChange={(e) => setForm((f) => ({ ...f, system: e.target.value }))}
                          className="field-input"
                          autoComplete="off"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={status === 'submitting'}
                          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 font-head text-[14.5px] font-bold text-white transition hover:bg-red-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                        >
                          {status === 'submitting' ? t.submitting : t.submit}
                        </button>
                        {status === 'error' ? (
                          <span className="text-[13px] text-red-600">{t.error}</span>
                        ) : null}
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Minimal focus trap — keeps Tab inside the dialog. */
function trapFocus(e: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return;
  const focusable = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}
