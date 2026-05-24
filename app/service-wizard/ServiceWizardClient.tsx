'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ServiceContent } from '@/lib/content';
import { whatsappUrl } from '@/lib/whatsapp';
import SystemPicker from './SystemPicker';

type WizardWindow = { id: string; label_en: string; label_tr: string };
type WizardCopy = {
  step_port: { title_en: string; title_tr: string; hint_en: string; hint_tr: string };
  step_when: { title_en: string; title_tr: string; options: WizardWindow[] };
  step_contact: {
    title_en: string; title_tr: string;
    name_en: string; name_tr: string;
    email_en: string; email_tr: string;
    phone_en: string; phone_tr: string;
    vessel_en: string; vessel_tr: string;
    imo_en: string; imo_tr: string;
  };
  submit_en: string; submit_tr: string;
  promise_en: string; promise_tr: string;
  received_en: string; received_tr: string;
  ref_en: string; ref_tr: string;
};

/**
 * 3-step service request wizard (DECISIONS.md S4, S5).
 *
 *   Step 1 — Port (autocomplete US ports + free text)
 *   Step 2 — When (Now / 24h / Week / Planned date)
 *   Step 3 — Contact (name, email, phone + optional vessel/IMO)
 *
 * On submit → POST /api/service-request → success screen with
 * the literal S5 promise:
 *
 *   "Our next available technician will contact you within 1 hour."
 *
 * System is preselected via ?system=<slug>. Customer can still change
 * it from a small inline selector on every step.
 */
export default function ServiceWizardClient({
  services,
  defaultSystem,
  usPorts,
  copy,
  locale = 'en'
}: {
  services: ServiceContent[];
  defaultSystem?: string;
  usPorts: string[];
  copy: WizardCopy;
  locale?: 'en' | 'tr';
}) {
  const params = useSearchParams();
  const initialSystem = params.get('system') ?? defaultSystem ?? '';

  const [systemSlug, setSystemSlug] = useState(initialSystem);
  const [step, setStep] = useState(initialSystem ? 1 : 0);

  // form state
  const [port, setPort] = useState('');
  const [portOpen, setPortOpen] = useState(false);
  const [whenWindow, setWhenWindow] = useState<string>('');
  const [plannedDate, setPlannedDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [imo, setImo] = useState('');
  const [notes, setNotes] = useState('');

  // submit state
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ ref: string } | null>(null);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  const system = useMemo(
    () => services.find((s) => s.slug === systemSlug),
    [services, systemSlug]
  );

  const portMatches = useMemo(() => {
    const q = port.trim().toLowerCase();
    if (!q) return usPorts.slice(0, 8);
    return usPorts.filter((p) => p.toLowerCase().includes(q)).slice(0, 8);
  }, [port, usPorts]);

  // If the system slug changes via URL during navigation, keep state in sync.
  useEffect(() => {
    const fromParam = params.get('system');
    if (fromParam && fromParam !== systemSlug) {
      setSystemSlug(fromParam);
      setStep((s) => (s === 0 ? 1 : s));
    }
  }, [params, systemSlug]);

  function canAdvance(): string | null {
    if (step === 0) return systemSlug ? null : t('Pick a system.', 'Bir sistem seçin.');
    if (step === 1) return port.trim() ? null : t('Add the port.', 'Limanı ekleyin.');
    if (step === 2) {
      if (!whenWindow) return t('Pick a time window.', 'Bir zaman aralığı seçin.');
      if (whenWindow === 'planned' && !plannedDate) return t('Pick a planned date.', 'Planlı bir tarih seçin.');
      return null;
    }
    if (step === 3) {
      if (!name.trim()) return t('Your name is required.', 'Adınız gerekli.');
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return t('Valid email required.', 'Geçerli e-posta gerekli.');
      }
      return null;
    }
    return null;
  }

  function goNext() {
    const e = canAdvance();
    if (e) { setErr(e); return; }
    setErr(null);
    setStep((s) => Math.min(s + 1, 3));
  }

  function goBack() {
    setErr(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    const e = canAdvance();
    if (e) { setErr(e); return; }
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_slug: systemSlug,
          system_name: locale === 'tr' ? system?.name_tr : system?.name_en,
          port,
          when: whenWindow,
          planned_date: whenWindow === 'planned' ? plannedDate : undefined,
          contact: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
            vessel_name: vesselName.trim() || undefined,
            imo: imo.trim() || undefined
          },
          notes: notes.trim() || undefined,
          locale
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setDone({ ref: data?.id ?? '—' });
    } catch (e2: any) {
      setErr(e2?.message ?? t('Submission failed. Please WhatsApp us.', 'Gönderim başarısız. Lütfen WhatsApp ile yazın.'));
    } finally {
      setSubmitting(false);
    }
  }

  // ============ SUCCESS SCREEN — the "1 hour" promise (S5) ============
  if (done) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card border-l-4 border-l-green-600">
          <div className="kicker mb-3 !text-green-700 before:!bg-green-600">
            {t(copy.received_en, copy.received_tr)}
          </div>
          <h2 className="mb-3 text-balance">
            {t(copy.promise_en, copy.promise_tr)}
          </h2>
          <p className="text-ink-muted text-[14.5px] leading-relaxed">
            {t(copy.ref_en, copy.ref_tr)}:{' '}
            <span className="font-mono text-ink">{done.ref}</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappUrl({
                locale,
                intent: 'service',
                description: done.ref ? (locale === 'tr' ? `Az önce talep gönderdim, referans: ${done.ref}` : `Just submitted a request, reference: ${done.ref}`) : undefined
              })}
              target="_blank"
              rel="noopener"
              className="btn-accent btn-md"
            >
              WhatsApp US (+1 619 384 0403)
            </a>
            <a href="tel:+16193840403" className="btn-ghost btn-md">
              {t('Call now', 'Şimdi ara')}
            </a>
            <Link href="/services" className="btn-ghost btn-md">
              {t('Back to services', 'Servislere dön')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============ WIZARD ============
  const totalSteps = 4; // System (0), Port (1), When (2), Contact (3)
  const stepNumber = step + 1;
  const progress = ((step + 1) / totalSteps) * 100;
  const stepTitles = [
    t('System', 'Sistem'),
    t(copy.step_port.title_en, copy.step_port.title_tr),
    t(copy.step_when.title_en, copy.step_when.title_tr),
    t(copy.step_contact.title_en, copy.step_contact.title_tr)
  ];

  const popular = services.filter((s) => s.popular).slice(0, 6);

  return (
    <div className="flex h-full flex-col">
      {/* Thin top progress strip — replaces the bulky sidebar */}
      <div className="shrink-0 mb-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-subtle">
            {t('Step', 'Adım')} {stepNumber} / {totalSteps} · {stepTitles[step]}
          </span>
          {system && step > 0 && (
            <button
              type="button"
              onClick={() => setStep(0)}
              className="font-mono text-[11px] text-amber-600 hover:underline"
            >
              {locale === 'tr' ? system.name_tr : system.name_en} · {t('change', 'değiştir')}
            </button>
          )}
        </div>
        <div className="h-1 bg-line rounded-full overflow-hidden">
          <div className="h-full bg-amber transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step body */}
      <div className="flex-1 min-h-0">
        {/* STEP 0 — System pick (compact: 6 popular + "see all" overlay) */}
        {step === 0 && (
          <SystemPicker
            services={services}
            popular={popular}
            value={systemSlug}
            onChange={setSystemSlug}
            locale={locale}
          />
        )}

        {/* STEP 1 — Port */}
        {step === 1 && (
          <div>
            <div className="kicker mb-3">
              {t('Step', 'Adım')} 2 — {t('Port', 'Liman')}
            </div>
            <h2 className="mb-2 text-[26px]">{t(copy.step_port.title_en, copy.step_port.title_tr)}</h2>
            <p className="text-ink-muted mb-6 text-[14.5px]">
              {t(copy.step_port.hint_en, copy.step_port.hint_tr)}
            </p>
            <div className="relative">
              <input
                type="text"
                value={port}
                onFocus={() => setPortOpen(true)}
                onBlur={() => setTimeout(() => setPortOpen(false), 120)}
                onChange={(e) => { setPort(e.target.value); setPortOpen(true); }}
                placeholder={t('e.g. Houston, TX', 'örn. Houston, TX')}
                className="field-input"
                autoFocus
                autoComplete="off"
              />
              {portOpen && portMatches.length > 0 && (
                <ul
                  role="listbox"
                  className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md border border-line bg-white shadow-lg"
                >
                  {portMatches.map((p) => (
                    <li key={p}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setPort(p); setPortOpen(false); }}
                        className="block w-full text-left px-3 py-2 text-[13.5px] hover:bg-amber/10"
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPortOpen(false)}
                      className="block w-full text-left px-3 py-2 text-[12px] text-ink-subtle border-t border-line italic"
                    >
                      {t('Other / not listed — keep typing', 'Diğer / liste dışı — yazmaya devam edin')}
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}

        {/* STEP 2 — When */}
        {step === 2 && (
          <div>
            <div className="kicker mb-3">
              {t('Step', 'Adım')} 3 — {t('When', 'Zaman')}
            </div>
            <h2 className="mb-6 text-[26px]">{t(copy.step_when.title_en, copy.step_when.title_tr)}</h2>
            <div className="grid gap-2">
              {copy.step_when.options.map((opt) => {
                const on = whenWindow === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWhenWindow(opt.id)}
                    className={`text-left p-4 rounded-md border transition ${
                      on
                        ? 'bg-navy-700 text-white border-navy-700'
                        : 'border-line bg-white text-ink hover:border-amber'
                    }`}
                  >
                    <div className="font-semibold">{t(opt.label_en, opt.label_tr)}</div>
                  </button>
                );
              })}
            </div>
            {whenWindow === 'planned' && (
              <div className="mt-4">
                <label className="field-label">{t('Planned date', 'Planlı tarih')}</label>
                <input
                  type="date"
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                  className="field-input"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Contact */}
        {step === 3 && (
          <div>
            <div className="kicker mb-3">
              {t('Step', 'Adım')} 4 — {t('Contact', 'İletişim')}
            </div>
            <h2 className="mb-6 text-[26px]">
              {t(copy.step_contact.title_en, copy.step_contact.title_tr)}
            </h2>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="field-label">
                    {t(copy.step_contact.name_en, copy.step_contact.name_tr)} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field-input"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="field-label">
                    {t(copy.step_contact.phone_en, copy.step_contact.phone_tr)}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="field-input"
                    placeholder="+1 ..."
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div>
                <label className="field-label">
                  {t(copy.step_contact.email_en, copy.step_contact.email_tr)} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input"
                  autoComplete="email"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="field-label">
                    {t(copy.step_contact.vessel_en, copy.step_contact.vessel_tr)}
                  </label>
                  <input
                    type="text"
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                    className="field-input"
                    placeholder="MV …"
                  />
                </div>
                <div>
                  <label className="field-label">
                    {t(copy.step_contact.imo_en, copy.step_contact.imo_tr)}
                  </label>
                  <input
                    type="text"
                    value={imo}
                    onChange={(e) => setImo(e.target.value)}
                    className="field-input"
                    placeholder="7 digits"
                  />
                </div>
              </div>
              <div>
                <label className="field-label">
                  {t('Anything else? (optional)', 'Eklemek istediğiniz? (opsiyonel)')}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="field-input min-h-[80px]"
                  placeholder={t(
                    'Symptoms, error codes, what the bridge reported — anything helps.',
                    'Belirtiler, hata kodları, köprüden gelen bilgi — ne biliyorsanız.'
                  )}
                />
              </div>
            </div>

            <p className="mt-5 text-[12px] text-ink-subtle">
              {t(copy.promise_en, copy.promise_tr)}
            </p>
          </div>
        )}

        {err && (
          <div role="alert" className="mt-4 text-[13px] font-mono text-red-600">
            {err}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || submitting}
            className="btn-ghost btn-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← {t('Back', 'Geri')}
          </button>
          {step === 3 ? (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn-accent btn-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? t('Sending…', 'Gönderiliyor…') : t(copy.submit_en, copy.submit_tr)}
            </button>
          ) : (
            <button type="button" onClick={goNext} className="btn-primary btn-md">
              {t('Continue', 'Devam')} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
