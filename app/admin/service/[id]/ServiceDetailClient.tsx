'use client';

import { useState, useTransition } from 'react';
import { updateServiceStatus, saveServiceAdminFields } from '../../_actions';

const STATUSES = [
  'new',
  'reviewing',
  'scheduled',
  'on_attendance',
  'reporting',
  'closed',
  'cancelled'
] as const;

const STATUS_TONE: Record<string, string> = {
  new: 'bg-amber/10 text-amber-700 border-amber/30',
  reviewing: 'bg-navy-50 text-ink border-line',
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  on_attendance: 'bg-amber/10 text-amber-700 border-amber/30',
  reporting: 'bg-blue-50 text-blue-700 border-blue-200',
  closed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200'
};

// Display-only Turkish labels — underlying slug values are unchanged.
const STATUS_LABEL: Record<string, string> = {
  new: 'Yeni',
  reviewing: 'İnceleniyor',
  scheduled: 'Planlandı',
  on_attendance: 'Serviste',
  reporting: 'Raporlanıyor',
  closed: 'Kapatıldı',
  cancelled: 'İptal edildi'
};

const URGENCY_LABEL: Record<string, string> = {
  aog: 'AOG',
  urgent: 'Acil',
  planned: 'Planlı'
};

type Req = Record<string, any>;
type Attachment = { name: string; path: string; url: string | null; size?: number };

export default function ServiceDetailClient({ req, attachments }: { req: Req; attachments: Attachment[] }) {
  const [status, setStatus] = useState<string>(req.status ?? 'new');
  const [internalNotes, setInternalNotes] = useState<string>(req.internal_notes ?? '');
  const [savedTick, setSavedTick] = useState<number>(0);
  const [pending, startTransition] = useTransition();

  function handleStatus(next: string) {
    setStatus(next);
    startTransition(async () => {
      try {
        await updateServiceStatus(req.id, next);
        setSavedTick((n) => n + 1);
      } catch (e) {
        setStatus(req.status ?? 'new');
        alert((e as Error).message);
      }
    });
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveServiceAdminFields(req.id, { internal_notes: internalNotes });
        setSavedTick((n) => n + 1);
      } catch (e) {
        alert((e as Error).message);
      }
    });
  }

  const mailSubject = encodeURIComponent(
    `Re: ${req.problem_category || 'service request'} — ${req.vessel_name || ''}`.trim()
  );
  const mailBody = encodeURIComponent(
    `Hi ${req.contact_name || ''},\n\n` +
    `Thank you for the service request. Here is our plan:\n\n` +
    `System: ${req.problem_category || '—'}\n` +
    `Vessel: ${req.vessel_name || '—'} (IMO ${req.imo_number || '—'})\n` +
    `Port: ${req.port || '—'}\n\n` +
    `Engineer ETA: \n` +
    `Scope: \n` +
    `Notes: \n\n` +
    `Best regards,\nLevent Marine`
  );
  const mailUrl = req.contact_email
    ? `mailto:${req.contact_email}?subject=${mailSubject}&body=${mailBody}`
    : null;

  const waPhone = (req.contact_whatsapp || req.contact_phone || '').replace(/\D/g, '');
  const waText = encodeURIComponent(
    `Hi ${req.contact_name || ''}, regarding your service request for ${req.vessel_name || 'your vessel'}: `
  );
  const waUrl = waPhone ? `https://wa.me/${waPhone}?text=${waText}` : null;

  const urgencyTone =
    req.urgency === 'aog' ? 'bg-red-600 text-white'
    : req.urgency === 'urgent' ? 'bg-amber text-navy-700'
    : 'bg-navy-50 text-ink';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] mt-6">
      <div className="space-y-5">
        <div className="card">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-1">
                servis · oluşturuldu {new Date(req.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
              </div>
              <h2 className="text-[20px] font-bold leading-tight">
                {req.problem_category || 'Servis talebi'} — {req.vessel_name || 'isimsiz gemi'}
              </h2>
            </div>
            <span className={`font-mono text-[10.5px] uppercase tracking-wider px-2 py-1 rounded ${urgencyTone}`}>
              {URGENCY_LABEL[req.urgency] ?? req.urgency}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-[13px]">
            <Row label="Sistem"        value={req.problem_category} />
            <Row label="Gemi"          value={req.vessel_name} />
            <Row label="IMO"           value={req.imo_number} mono />
            <Row label="Gemi tipi"     value={req.vessel_type} />
            <Row label="Klas kuruluşu" value={req.class_society} />
            <Row label="Liman"         value={req.port} />
            <Row label="ETA"           value={req.eta ? new Date(req.eta).toLocaleString('en-US') : null} />
          </div>
        </div>

        {Array.isArray(req.symptoms) && req.symptoms.length > 0 && (
          <div className="card">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-2">
              Belirtiler ({req.symptoms.length})
            </div>
            <ul className="space-y-1 text-[13.5px] text-ink leading-relaxed">
              {req.symptoms.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {req.notes && (
          <div className="card">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-2">
              Müşteri notları
            </div>
            <pre className="whitespace-pre-wrap font-sans text-[13.5px] text-ink leading-relaxed">
              {req.notes}
            </pre>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="card">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-3">
              Ekler ({attachments.length})
            </div>
            <ul className="space-y-1.5">
              {attachments.map((a, i) => (
                <li key={i} className="flex items-center justify-between rounded-md bg-navy-50 px-3 py-2 text-[13px]">
                  <span className="truncate">📎 {a.name}{a.size ? ` · ${formatSize(a.size)}` : ''}</span>
                  {a.url ? (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 hover:text-amber no-underline ml-3 shrink-0"
                    >
                      İndir
                    </a>
                  ) : (
                    <span className="font-mono text-[11px] uppercase text-red-600 ml-3 shrink-0">Dosya eksik</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="card border-l-4 border-l-amber">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber-700 mb-2">
            Dahili · yalnızca admin
          </div>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={4}
            placeholder="Mühendis notları, kapsam, sipariş edilen parçalar, takip hatırlatmaları…"
            className="field-input text-[13px]"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="btn-primary btn-md disabled:opacity-60"
            >
              {pending ? 'Kaydediliyor…' : 'Notları Kaydet'}
            </button>
            {savedTick > 0 && !pending && (
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-green-700">
                ✓ Kaydedildi
              </span>
            )}
          </div>
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        <div className="card">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-2">
            Müşteri
          </div>
          <div className="text-[15px] font-semibold text-ink">{req.contact_name || '—'}</div>
          {req.company && <div className="text-[13px] text-ink-muted">{req.company}</div>}
          {req.contact_email && (
            <div className="mt-2 font-mono text-[12px] text-ink truncate">{req.contact_email}</div>
          )}
          {(req.contact_phone || req.contact_whatsapp) && (
            <div className="font-mono text-[12px] text-ink-muted">
              {req.contact_phone || req.contact_whatsapp}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            {mailUrl && (
              <a href={mailUrl} className="btn-primary btn-sm no-underline text-center">
                ✉ E-posta yanıtı
              </a>
            )}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-[#25D366] px-3 py-1.5 text-white text-[13px] font-semibold text-center no-underline hover:opacity-95"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="card">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-2">
            Durum
          </div>
          <div className={`mb-3 inline-flex items-center px-3 py-1.5 rounded-md border text-[12.5px] font-mono uppercase tracking-wider ${STATUS_TONE[status] ?? STATUS_TONE.new}`}>
            {STATUS_LABEL[status] ?? status}
          </div>
          <ul className="space-y-1">
            {STATUSES.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => handleStatus(s)}
                  disabled={pending || s === status}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[12.5px] font-mono uppercase tracking-wider transition ${
                    s === status
                      ? 'bg-navy-700 text-white cursor-default'
                      : 'bg-white text-ink hover:bg-navy-50'
                  }`}
                >
                  {STATUS_LABEL[s] ?? s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: any; mono?: boolean }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-subtle">{label}</div>
      <div className={`text-ink ${mono ? 'font-mono' : ''}`}>{String(value)}</div>
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
