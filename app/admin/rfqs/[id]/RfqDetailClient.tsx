'use client';

import { useState, useTransition } from 'react';
import { updateRfqStatus, saveRfqAdminFields } from '../../_actions';

const STATUSES = [
  'new',
  'reviewing',
  'supplier_checking',
  'quoted',
  'waiting_approval',
  'ordered',
  'delivered',
  'closed',
  'cancelled'
] as const;

const STATUS_TONE: Record<string, string> = {
  new: 'bg-amber/10 text-amber-700 border-amber/30',
  reviewing: 'bg-navy-50 text-ink border-line',
  supplier_checking: 'bg-navy-50 text-ink border-line',
  quoted: 'bg-blue-50 text-blue-700 border-blue-200',
  waiting_approval: 'bg-amber/10 text-amber-700 border-amber/30',
  ordered: 'bg-green-50 text-green-700 border-green-200',
  delivered: 'bg-green-100 text-green-700 border-green-300',
  closed: 'bg-navy-50 text-ink-subtle border-line',
  cancelled: 'bg-red-50 text-red-700 border-red-200'
};

// Display-only Turkish labels — underlying slug values are unchanged.
const STATUS_LABEL: Record<string, string> = {
  new: 'Yeni',
  reviewing: 'İnceleniyor',
  supplier_checking: 'Tedarikçi kontrolü',
  quoted: 'Teklif verildi',
  waiting_approval: 'Onay bekliyor',
  ordered: 'Sipariş verildi',
  delivered: 'Teslim edildi',
  closed: 'Kapatıldı',
  cancelled: 'İptal edildi'
};

const URGENCY_LABEL: Record<string, string> = {
  aog: 'AOG',
  urgent: 'Acil',
  planned: 'Planlı'
};

type Rfq = Record<string, any>;
type Attachment = { name: string; path: string; url: string | null; size?: number };

export default function RfqDetailClient({ rfq, attachments }: { rfq: Rfq; attachments: Attachment[] }) {
  const [status, setStatus] = useState<string>(rfq.status ?? 'new');
  const [internalNotes, setInternalNotes] = useState<string>(rfq.internal_notes ?? '');
  const [draftQuote, setDraftQuote] = useState<string>(rfq.draft_quote ?? '');
  const [savedTick, setSavedTick] = useState<number>(0);
  const [pending, startTransition] = useTransition();

  function handleStatus(next: string) {
    setStatus(next);
    startTransition(async () => {
      try {
        await updateRfqStatus(rfq.id, next);
        setSavedTick((n) => n + 1);
      } catch (e) {
        // Revert on failure
        setStatus(rfq.status ?? 'new');
        alert((e as Error).message);
      }
    });
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveRfqAdminFields(rfq.id, { internal_notes: internalNotes, draft_quote: draftQuote });
        setSavedTick((n) => n + 1);
      } catch (e) {
        alert((e as Error).message);
      }
    });
  }

  // Pre-fill an email reply with the full RFQ context.
  const mailSubject = encodeURIComponent(
    `Re: ${rfq.brand || ''} ${rfq.part_number || ''}`.trim() || 'Levent Marine — your RFQ'
  );
  const mailBody = encodeURIComponent(
    `Hi ${rfq.contact_name || ''},\n\n` +
    `Thank you for your request. Here is our quote:\n\n` +
    `Brand: ${rfq.brand || '—'}\n` +
    `Part: ${rfq.part_number || '—'}\n` +
    `Qty: ${rfq.quantity ?? 1}\n` +
    `Vessel: ${rfq.vessel_name || '—'} (IMO ${rfq.imo_number || '—'})\n` +
    `Port: ${rfq.current_port || '—'}\n\n` +
    `Price: \n` +
    `Lead time: \n` +
    `Compatibility: \n\n` +
    `Best regards,\nLevent Marine`
  );
  const mailUrl = rfq.contact_email
    ? `mailto:${rfq.contact_email}?subject=${mailSubject}&body=${mailBody}`
    : null;

  // WhatsApp deep link — use phone if available, otherwise our own number
  // (admin can paste the customer's contact in chat).
  const waPhone = (rfq.contact_whatsapp || rfq.contact_phone || '').replace(/\D/g, '');
  const waText = encodeURIComponent(
    `Hi ${rfq.contact_name || ''}, regarding your RFQ for ${rfq.brand || ''} ${rfq.part_number || ''}: `
  );
  const waUrl = waPhone ? `https://wa.me/${waPhone}?text=${waText}` : null;

  const urgencyTone =
    rfq.urgency === 'aog' ? 'bg-red-600 text-white'
    : rfq.urgency === 'urgent' ? 'bg-amber text-navy-700'
    : 'bg-navy-50 text-ink';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] mt-6">
      {/* Left column — customer-facing data */}
      <div className="space-y-5">
        <div className="card">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-1">
                {rfq.kind} · oluşturuldu {new Date(rfq.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
              </div>
              <h2 className="text-[20px] font-bold leading-tight">
                {rfq.brand ? `${rfq.brand} ` : ''}{rfq.part_number || rfq.description?.slice(0, 60) || 'Başlıksız teklif talebi'}
              </h2>
            </div>
            <span className={`font-mono text-[10.5px] uppercase tracking-wider px-2 py-1 rounded ${urgencyTone}`}>
              {URGENCY_LABEL[rfq.urgency] ?? rfq.urgency}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-[13px]">
            <Row label="Marka"      value={rfq.brand} />
            <Row label="Parça No"   value={rfq.part_number} mono />
            <Row label="Adet"       value={rfq.quantity} />
            <Row label="Ekipman"    value={rfq.equipment_type} />
            <Row label="Gemi"       value={rfq.vessel_name} />
            <Row label="IMO"        value={rfq.imo_number} mono />
            <Row label="Mevcut liman" value={rfq.current_port} />
            <Row label="Sonraki liman" value={rfq.next_port} />
            <Row label="ETA"           value={rfq.eta ? new Date(rfq.eta).toLocaleString('en-US') : null} />
            <Row label="Son tarih"     value={rfq.required_by} />
          </div>
        </div>

        {rfq.description && (
          <div className="card">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-2">
              Müşteri açıklaması
            </div>
            <pre className="whitespace-pre-wrap font-sans text-[13.5px] text-ink leading-relaxed">
              {rfq.description}
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
                    <span className="font-mono text-[11px] uppercase text-red-600 ml-3 shrink-0">
                      Dosya eksik
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Internal block — never sent to customer */}
        <div className="card border-l-4 border-l-amber">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber-700 mb-2">
            Dahili · yalnızca admin
          </div>

          <label className="field-label">Taslak teklif / fiyatlandırma</label>
          <textarea
            value={draftQuote}
            onChange={(e) => setDraftQuote(e.target.value)}
            rows={4}
            placeholder="Ürün fiyatı · nakliye · ETA · uyumluluk notu — buraya yapıştırın, yanıta kopyalayın"
            className="field-input font-mono text-[12.5px]"
          />

          <label className="field-label mt-3">Dahili notlar</label>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={3}
            placeholder="Tedarikle ilgili her şey — müşteriyle paylaşılmaz"
            className="field-input text-[13px]"
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="btn-primary btn-md disabled:opacity-60"
            >
              {pending ? 'Kaydediliyor…' : 'Admin alanlarını kaydet'}
            </button>
            {savedTick > 0 && !pending && (
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-green-700">
                ✓ Kaydedildi
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right column — actions */}
      <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        <div className="card">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-2">
            Müşteri
          </div>
          <div className="text-[15px] font-semibold text-ink">{rfq.contact_name || '—'}</div>
          {rfq.company && <div className="text-[13px] text-ink-muted">{rfq.company}</div>}
          {rfq.contact_email && (
            <div className="mt-2 font-mono text-[12px] text-ink truncate">{rfq.contact_email}</div>
          )}
          {(rfq.contact_phone || rfq.contact_whatsapp) && (
            <div className="font-mono text-[12px] text-ink-muted">
              {rfq.contact_phone || rfq.contact_whatsapp}
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

        <div className="card">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-2">
            Üst Veri
          </div>
          <div className="text-[12px] font-mono space-y-0.5 text-ink-muted">
            <div>Ref: <span className="text-ink">{(rfq.meta?.reference) || rfq.id.slice(0, 8)}</span></div>
            <div>Kanal: {rfq.meta?.channel || rfq.source || 'web'}</div>
            <div>Oluşturuldu: {new Date(rfq.created_at).toLocaleString('en-US')}</div>
            <div>Güncellendi: {new Date(rfq.updated_at ?? rfq.created_at).toLocaleString('en-US')}</div>
          </div>
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
