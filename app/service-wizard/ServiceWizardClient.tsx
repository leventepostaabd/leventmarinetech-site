'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ServiceContent } from '@/lib/content';
import { ct, pick } from '@/lib/i18n-client';
import { whatsappUrl } from '@/lib/whatsapp';
import SystemPicker from './SystemPicker';

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
 *
 * All UI copy is resolved through the i18n dictionaries (en/tr/el/es/de)
 * via `ct`, and system names via `pick`, so every locale is honoured.
 */
const WHEN_OPTIONS = [
  { id: 'now', key: 'wizard.whenNow' },
  { id: '24h', key: 'wizard.when24h' },
  { id: 'week', key: 'wizard.whenWeek' },
  { id: 'planned', key: 'wizard.whenPlanned' }
] as const;

export default function ServiceWizardClient({
  services,
  defaultSystem,
  usPorts,
  locale = 'en'
}: {
  services: ServiceContent[];
  defaultSystem?: string;
  usPorts: string[];
  locale?: Locale;
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

  const t = (key: string) => ct(locale, key);

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
    if (step === 0) return systemSlug ? null : t('wizard.errPickSystem');
    if (step === 1) return port.trim() ? null : t('wizard.errPort');
    if (step === 2) {
      if (!whenWindow) return t('wizard.errWhen');
      if (whenWindow === 'planned' && !plannedDate) return t('wizard.errPlanned');
      return null;
    }
    if (step === 3) {
      if (!name.trim()) return t('wizard.errName');
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return t('wizard.errEmail');
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
          system_name: system ? pick(system, 'name', locale) : undefined,
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
      setErr(e2?.message ?? t('wizard.errSubmit'));
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
            {t('wizard.received')}
          </div>
          <h2 className="mb-3 text-balance">
            {t('wizard.promise')}
          </h2>
          <p className="text-ink-muted text-[14.5px] leading-relaxed">
            {t('wizard.ref')}:{' '}
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
              {t('wizard.callNow')}
            </a>
            <Link href="/services" className="btn-ghost btn-md">
              {t('wizard.backToServices')}
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
    t('wizard.system'),
    t('wizard.portTitle'),
    t('wizard.whenTitle'),
    t('wizard.contactTitle')
  ];

  const popular = services.filter((s) => s.popular).slice(0, 6);

  return (
    <div className="flex h-full flex-col">
      {/* Thin top progress strip — replaces the bulky sidebar */}
      <div className="shrink-0 mb-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-subtle">
            {t('wizard.step')} {stepNumber} / {totalSteps} · {stepTitles[step]}
          </span>
          {system && step > 0 && (
            <button
              type="button"
              onClick={() => setStep(0)}
              className="font-mono text-[11px] text-amber-600 hover:underline"
            >
              {pick(system, 'name', locale)} · {t('wizard.change')}
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
              {t('wizard.step')} 2 — {t('wizard.port')}
            </div>
            <h2 className="mb-2 text-[26px]">{t('wizard.portTitle')}</h2>
            <p className="text-ink-muted mb-6 text-[14.5px]">
              {t('wizard.portHint')}
            </p>
            <div className="relative">
              <input
                type="text"
                value={port}
                onFocus={() => setPortOpen(true)}
                onBlur={() => setTimeout(() => setPortOpen(false), 120)}
                onChange={(e) => { setPort(e.target.value); setPortOpen(true); }}
                placeholder={t('wizard.portPlaceholder')}
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
                      {t('wizard.portOther')}
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
              {t('wizard.step')} 3 — {t('wizard.when')}
            </div>
            <h2 className="mb-6 text-[26px]">{t('wizard.whenTitle')}</h2>
            <div className="grid gap-2">
              {WHEN_OPTIONS.map((opt) => {
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
                    <div className="font-semibold">{t(opt.key)}</div>
                  </button>
                );
              })}
            </div>
            {whenWindow === 'planned' && (
              <div className="mt-4">
                <label className="field-label">{t('wizard.plannedDate')}</label>
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
              {t('wizard.step')} 4 — {t('wizard.contact')}
            </div>
            <h2 className="mb-6 text-[26px]">
              {t('wizard.contactTitle')}
            </h2>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="field-label">
                    {t('wizard.name')} *
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
                    {t('wizard.phone')}
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
                  {t('wizard.email')} *
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
                    {t('wizard.vessel')}
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
                    {t('wizard.imo')}
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
                  {t('wizard.notes')}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="field-input min-h-[80px]"
                  placeholder={t('wizard.notesPlaceholder')}
                />
              </div>
            </div>

            <p className="mt-5 text-[12px] text-ink-subtle">
              {t('wizard.promise')}
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
            {t('wizard.back')}
          </button>
          {step === 3 ? (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn-accent btn-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? t('wizard.submitting') : t('wizard.submit')}
            </button>
          ) : (
            <button type="button" onClick={goNext} className="btn-primary btn-md">
              {t('wizard.continue')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
