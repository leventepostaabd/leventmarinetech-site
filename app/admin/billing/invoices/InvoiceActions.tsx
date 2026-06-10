'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { emailInvoice, deleteInvoice } from '../_actions';
import ConfirmDeleteButton from '../ConfirmDeleteButton';

export default function InvoiceActions({
  id, email, emailedTo, number, company, amount
}: {
  id: string; email: string | null; emailedTo: string | null;
  number: string; company: string; amount: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function mail() {
    const to = email || prompt('Müşteri e-postası:') || '';
    if (!to.trim()) return;
    if (!confirm(`Fatura ${to} adresine gönderilsin mi?\n(Varsa atıf yapılan teklif + imzalı servis raporu otomatik eklenir.)`)) return;
    setBusy(true);
    try {
      const r = await emailInvoice(id, to);
      alert(r.warning ? `Gönderildi (${r.to}).\n\nNot: ${r.warning}` : `Gönderildi: ${r.to}`);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Hata');
    } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-wrap justify-end gap-1">
      <a href={`/api/admin/billing/invoices/${id}/pdf`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm no-underline">PDF / Çıktı</a>
      <button type="button" className="btn-accent btn-sm" disabled={busy} onClick={mail}>{busy ? '…' : emailedTo ? 'Tekrar mail at' : 'Mail at'}</button>
      <ConfirmDeleteButton
        id={id}
        action={deleteInvoice}
        heading="Faturayı sil"
        details={[{ k: 'No', v: number }, { k: 'Müşteri', v: company }, { k: 'Tutar', v: amount }]}
      />
    </div>
  );
}
