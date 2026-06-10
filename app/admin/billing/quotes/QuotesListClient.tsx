'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { money, QUOTE_STATUS_LABEL, type QuoteRow, type QuoteStatus } from '@/lib/billing';
import { setQuoteStatus, convertQuoteToInvoice, deleteQuote } from '../_actions';
import ConfirmDeleteButton from '../ConfirmDeleteButton';

const STATUS_STYLE: Record<QuoteStatus, string> = {
  draft: 'bg-navy-50 text-ink-muted',
  sent: 'bg-blue-50 text-blue-700',
  accepted: 'bg-green-50 text-green-700',
  declined: 'bg-red-50 text-red-700',
  expired: 'bg-amber-50 text-amber-700'
};

export default function QuotesListClient({ rows }: { rows: QuoteRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function status(id: string, st: QuoteStatus) {
    setBusy(id);
    try {
      let reason: string | undefined;
      if (st === 'declined') reason = prompt('Kayıp nedeni (opsiyonel):') ?? undefined;
      await setQuoteStatus(id, st, reason);
      router.refresh();
    } finally { setBusy(null); }
  }

  async function toInvoice(id: string) {
    setBusy(id);
    try {
      const res = await convertQuoteToInvoice(id);
      alert(`Fatura oluşturuldu: ${res.number}`);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Hata');
    } finally { setBusy(null); }
  }

  if (rows.length === 0) {
    return <p className="text-[13px] text-ink-muted">Henüz teklif yok. İlk teklifi oluşturun.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-line">
      <table className="w-full min-w-[820px] text-[13px]">
        <thead className="bg-navy-50/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-ink-subtle">
          <tr>
            <th className="px-3 py-2">No</th>
            <th className="px-3 py-2">Müşteri / Gemi</th>
            <th className="px-3 py-2">Durum</th>
            <th className="px-3 py-2 text-right">Tutar</th>
            <th className="px-3 py-2 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {rows.map((q) => (
            <tr key={q.id} className="align-top hover:bg-navy-50/40">
              <td className="px-3 py-2 font-mono">
                {q.number}{q.revision > 1 ? ` · R${q.revision}` : ''}
                <div className="text-[11px] text-ink-subtle">{new Date(q.created_at).toISOString().slice(0, 10)}</div>
              </td>
              <td className="px-3 py-2">
                <div className="text-ink">{q.companies?.name ?? '—'}</div>
                <div className="text-[11.5px] text-ink-subtle">{q.vessels?.name ?? '—'}{q.vessels?.imo_no ? ` · IMO ${q.vessels.imo_no}` : ''}</div>
              </td>
              <td className="px-3 py-2">
                <span className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wide ${STATUS_STYLE[q.status]}`}>
                  {QUOTE_STATUS_LABEL[q.status]}
                </span>
              </td>
              <td className="px-3 py-2 text-right font-mono">{money(Number(q.total ?? 0), q.currency)}</td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap justify-end gap-1">
                  <a href={`/api/admin/billing/quotes/${q.id}/pdf`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm no-underline">PDF</a>
                  {q.status === 'draft' && <button className="btn-ghost btn-sm" disabled={busy === q.id} onClick={() => status(q.id, 'sent')}>Gönderildi</button>}
                  {(q.status === 'draft' || q.status === 'sent') && (
                    <>
                      <button className="btn-ghost btn-sm text-green-700" disabled={busy === q.id} onClick={() => status(q.id, 'accepted')}>Kabul</button>
                      <button className="btn-ghost btn-sm text-red-600" disabled={busy === q.id} onClick={() => status(q.id, 'declined')}>Ret</button>
                    </>
                  )}
                  {q.status === 'accepted' && (
                    <button className="btn-accent btn-sm" disabled={busy === q.id} onClick={() => toInvoice(q.id)}>Faturaya çevir →</button>
                  )}
                  <ConfirmDeleteButton
                    id={q.id}
                    action={deleteQuote}
                    heading="Teklifi sil"
                    details={[
                      { k: 'No', v: `${q.number}${q.revision > 1 ? ` · R${q.revision}` : ''}` },
                      { k: 'Müşteri', v: q.companies?.name ?? '—' },
                      { k: 'Gemi', v: q.vessels?.name ?? '—' },
                      { k: 'Tutar', v: money(Number(q.total ?? 0), q.currency) }
                    ]}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
