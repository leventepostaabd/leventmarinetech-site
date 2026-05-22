'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createBrowserSupabase } from '@/lib/supabase/browser';

/**
 * List RFQ modal — the "send us your spec sheet" path.
 *
 * The customer drops one or more files (Excel / Word / PDF / image)
 * and/or pastes a free-form list, fills out a short form (company,
 * contact, email, vessel, urgency, notes), and submits. The backend
 * stores the files in Supabase Storage and notifies admin via email +
 * WhatsApp with everything inline.
 *
 * Same-day quote promise applies; for long lists we promise within
 * 24 hours (consolidated quote).
 */
const ACCEPT =
  '.xlsx,.xls,.csv,.doc,.docx,.pdf,.txt,.png,.jpg,.jpeg,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,text/plain,image/*';

type Uploaded = { path: string; name: string; size: number };

export default function ListRfqModal({
  open,
  onClose,
  locale
}: {
  open: boolean;
  onClose: () => void;
  locale: 'en' | 'tr';
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [files, setFiles] = useState<Uploaded[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pastedList, setPastedList] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vessel, setVessel] = useState('');
  const [port, setPort] = useState('');
  const [urgency, setUrgency] = useState<'aog' | 'urgent' | 'planned'>('planned');
  const [notes, setNotes] = useState('');
  const [view, setView] = useState<'form' | 'sent'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    // Reset state when opening fresh
    setView('form');
    setErr(null);
    setRef(null);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  async function uploadOne(file: File): Promise<Uploaded | null> {
    try {
      const supabase = createBrowserSupabase();
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `list-rfq/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safe}`;
      const { error } = await supabase.storage.from('attachments').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined
      });
      if (error) {
        // Fallback: keep file metadata only — admin notification still has the
        // pasted-list + filename so they can ask for resend.
        return { path: '(upload-failed)', name: file.name, size: file.size };
      }
      return { path, name: file.name, size: file.size };
    } catch {
      return { path: '(upload-failed)', name: file.name, size: file.size };
    }
  }

  async function handleFiles(list: FileList | File[] | null) {
    if (!list || list.length === 0) return;
    setUploading(true);
    const next: Uploaded[] = [];
    for (const f of Array.from(list)) {
      if (f.size > 25 * 1024 * 1024) continue; // 25 MB hard cap
      const up = await uploadOne(f);
      if (up) next.push(up);
    }
    setFiles((prev) => [...prev, ...next]);
    setUploading(false);
  }

  async function handleSubmit() {
    setErr(null);
    if (!company.trim()) return setErr(t('Company is required.', 'Firma adı gerekli.'));
    if (!name.trim()) return setErr(t('Your name is required.', 'İsim gerekli.'));
    if (!email.trim() || !/.+@.+\..+/.test(email)) return setErr(t('Valid email required.', 'Geçerli e-posta gerekli.'));
    if (files.length === 0 && !pastedList.trim()) {
      return setErr(t('Upload a file or paste your list.', 'Bir dosya yükleyin veya listenizi yapıştırın.'));
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/list-rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          contactName: name,
          contactEmail: email,
          contactPhone: phone || undefined,
          vessel: vessel || undefined,
          port: port || undefined,
          urgency,
          notes: notes || undefined,
          pastedList: pastedList || undefined,
          attachments: files
        })
      });
      if (!res.ok) {
        setErr(t('Could not send. Email us at rfq@leventmarinetech.com instead.', 'Gönderilemedi. rfq@leventmarinetech.com adresinden e-posta atın.'));
        setSubmitting(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setRef(data?.reference || 'LM-' + Math.random().toString(36).slice(2, 8).toUpperCase());
      setView('sent');
    } catch {
      setErr(t('Network error. Retry in a moment.', 'Ağ hatası. Biraz sonra tekrar dene.'));
    } finally {
      setSubmitting(false);
    }
  }

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="lm-list-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-navy-900/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="lm-list-panel"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed left-1/2 top-1/2 z-[60] w-[min(720px,94vw)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="shrink-0 flex items-center justify-between border-b border-line px-5 py-4 bg-white">
              <div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-amber-700 mb-0.5">
                  {t('Send us your spec sheet', 'Spec listeni gönder')}
                </div>
                <h2 className="font-head font-bold text-[18px] text-navy-700">
                  {t('Upload list — consolidated quote', 'Liste yükle — konsolide teklif')}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('Close', 'Kapat')}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 hover:bg-navy-100"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {view === 'sent' && ref ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-[19px] font-bold mb-2 text-navy-700">
                    {t('Got your list. Consolidated quote on the way.', 'Listeni aldık. Konsolide teklif yolda.')}
                  </h3>
                  <p className="text-ink-muted text-[13.5px] max-w-md mx-auto">
                    {t(
                      'Short lists go back within 30 minutes; long lists within the same business day. We email a single quote covering every line.',
                      'Kısa listeler 30 dk içinde, uzun listeler aynı iş günü içinde döner. Tek bir mailde tüm kalemlerin teklifini gönderiyoruz.'
                    )}
                  </p>
                  <p className="font-mono text-[12.5px] text-ink-subtle mt-3">
                    {t('Reference', 'Referans')}: <span className="text-ink">{ref}</span>
                  </p>
                </div>
              ) : (
                <>
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center mb-3 transition ${
                      dragOver
                        ? 'border-amber bg-amber/10'
                        : 'border-line bg-navy-50 hover:border-amber/60 hover:bg-amber/5'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ACCEPT}
                      onChange={(e) => handleFiles(e.target.files)}
                      className="hidden"
                    />
                    <svg className="mx-auto mb-2 text-ink-subtle" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <div className="font-head font-bold text-[14px] text-navy-700 mb-1">
                      {t('Drop your spec sheet here', 'Spec listesini buraya bırak')}
                    </div>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle">
                      Excel · Word · PDF · CSV · {t('photo', 'foto')} · {t('up to 25 MB each', 'her biri 25 MB max')}
                    </div>
                  </div>

                  {/* Already-uploaded files */}
                  {files.length > 0 && (
                    <ul className="mb-3 space-y-1.5">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between rounded-md bg-navy-50 px-3 py-1.5 text-[12.5px]">
                          <span className="truncate">📎 {f.name}</span>
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((_, j) => j !== i))}
                            className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-subtle hover:text-red-600 ml-3 shrink-0"
                          >
                            {t('remove', 'çıkar')}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {uploading && (
                    <div className="mb-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-amber-600">
                      {t('Uploading…', 'Yükleniyor…')}
                    </div>
                  )}

                  {/* Or paste */}
                  <details className="mb-4 rounded-md border border-line bg-white">
                    <summary className="cursor-pointer px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-600 hover:text-amber select-none">
                      {t('— or paste a quick list →', '— veya hızlı liste yapıştır →')}
                    </summary>
                    <div className="p-3">
                      <textarea
                        value={pastedList}
                        onChange={(e) => setPastedList(e.target.value)}
                        rows={5}
                        placeholder={t(
                          'One part per line, e.g.\nABB A16-30-10 220VAC × 2\nFuruno MG5436 magnetron × 1\nStamford AVR MX341',
                          'Her satıra bir parça, örn.\nABB A16-30-10 220VAC × 2\nFuruno MG5436 magnetron × 1\nStamford AVR MX341'
                        )}
                        className="field-input min-h-[110px] font-mono text-[12.5px]"
                      />
                    </div>
                  </details>

                  {/* Contact form */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="field-label">{t('Company', 'Firma')} *</label>
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="field-input" autoComplete="organization" />
                    </div>
                    <div>
                      <label className="field-label">{t('Your name', 'İsim')} *</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="field-input" autoComplete="name" />
                    </div>
                    <div>
                      <label className="field-label">{t('Email', 'E-posta')} *</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" autoComplete="email" />
                    </div>
                    <div>
                      <label className="field-label">{t('Phone / WhatsApp (optional)', 'Telefon / WhatsApp (opsiyonel)')}</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="field-input" autoComplete="tel" />
                    </div>
                    <div>
                      <label className="field-label">{t('Vessel (optional)', 'Gemi (opsiyonel)')}</label>
                      <input type="text" value={vessel} onChange={(e) => setVessel(e.target.value)} className="field-input" placeholder="MV …" />
                    </div>
                    <div>
                      <label className="field-label">{t('Port (optional)', 'Liman (opsiyonel)')}</label>
                      <input type="text" value={port} onChange={(e) => setPort(e.target.value)} className="field-input" placeholder={t('e.g. Houston, TX', 'örn. Houston, TX')} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="field-label">{t('Urgency', 'Aciliyet')}</label>
                    <div className="grid grid-cols-3 gap-1.5">
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
                            className={`p-2 rounded-md border text-[12px] font-mono uppercase tracking-[0.12em] transition ${
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

                  <div className="mb-4">
                    <label className="field-label">{t('Notes (optional)', 'Notlar (opsiyonel)')}</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="field-input" placeholder={t('Anything we should know — compatibility, deadlines, special handling.', 'Bilmemiz gereken bir şey — uyumluluk, son tarih, özel taşıma.')} />
                  </div>

                  {err && <div role="alert" className="mb-3 text-[13px] font-mono text-red-600">{err}</div>}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || uploading}
                    className="btn-accent btn-lg w-full disabled:opacity-60"
                  >
                    {submitting
                      ? t('Sending…', 'Gönderiliyor…')
                      : t('Send list — same-day quote', 'Listeyi gönder — aynı gün teklif')}
                  </button>

                  <p className="mt-3 text-center text-[11.5px] font-mono uppercase tracking-[0.12em] text-ink-subtle">
                    {t('Short lists in 30 min · long lists same business day', 'Kısa listeler 30 dk · uzun listeler aynı gün')}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(content, document.body) : null;
}
