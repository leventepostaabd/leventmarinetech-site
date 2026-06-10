'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EXPENSE_CATEGORIES, expenseCatLabel, money, type ExpenseRow } from '@/lib/billing';
import { saveExpense, uploadReceipt, signedDocUrl, type ExpenseInput } from '../_actions';
import ConfirmDeleteButton from '../ConfirmDeleteButton';
import { deleteExpense } from '../_actions';

const blank = (): ExpenseInput => ({ spent_on: new Date().toISOString().slice(0, 10), category: 'other', amount_usd: 0, vendor: '', description: '', payment_method: 'card', rebillable: false, receipt_path: null, notes: '' });

const METHODS = [['card', 'Kart'], ['wire', 'Wire'], ['ach', 'ACH'], ['cash', 'Nakit'], ['other', 'Diğer']];

export default function ExpensesClient({ initial }: { initial: ExpenseRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ExpenseInput | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const total = useMemo(() => initial.reduce((s, e) => s + Number(e.amount_usd ?? 0), 0), [initial]);
  const thisYear = new Date().getFullYear();
  const yearTotal = useMemo(() => initial.filter((e) => (e.spent_on ?? '').startsWith(String(thisYear))).reduce((s, e) => s + Number(e.amount_usd ?? 0), 0), [initial, thisYear]);

  async function save() {
    if (!editing) return;
    setBusy(true); setErr('');
    try { await saveExpense(editing); setEditing(null); router.refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Hata'); }
    finally { setBusy(false); }
  }
  async function onReceipt(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setBusy(true);
    try { const fd = new FormData(); fd.append('file', file); const { path } = await uploadReceipt(fd); setEditing({ ...editing, receipt_path: path }); }
    catch (err2) { setErr(err2 instanceof Error ? err2.message : 'Yüklenemedi'); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ''; }
  }
  async function viewReceipt(path: string) {
    try { const { url } = await signedDocUrl(path); window.open(url, '_blank'); }
    catch (e) { alert(e instanceof Error ? e.message : 'Açılamadı'); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="kicker">Evrak & Finans</div>
          <h2 className="text-[20px] mt-0.5">Giderler</h2>
          <p className="text-[12.5px] text-ink-muted mt-0.5">Her gideri + fişi buraya kaydet — yıl sonu kâr/zarar buradan çıkar.</p>
        </div>
        <button type="button" className="btn-accent btn-sm" onClick={() => setEditing(blank())}>+ Yeni gider</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-5">
        <div className="card"><div className="kicker text-ink-subtle">Bu yıl ({thisYear}) toplam gider</div><div className="mt-1 font-head text-[22px] font-extrabold text-navy-700">{money(yearTotal)}</div></div>
        <div className="card"><div className="kicker text-ink-subtle">Tüm kayıt toplamı</div><div className="mt-1 font-head text-[22px] font-extrabold text-navy-700">{money(total)}</div></div>
      </div>

      {initial.length === 0 ? (
        <p className="text-[13px] text-ink-muted">Henüz gider yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-line">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead className="bg-navy-50/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-ink-subtle">
              <tr><th className="px-3 py-2">Tarih</th><th className="px-3 py-2">Kategori</th><th className="px-3 py-2">Açıklama / Satıcı</th><th className="px-3 py-2 text-right">Tutar</th><th className="px-3 py-2 text-right">İşlemler</th></tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {initial.map((e) => (
                <tr key={e.id} className="hover:bg-navy-50/40">
                  <td className="px-3 py-2 font-mono text-[12px]">{e.spent_on}</td>
                  <td className="px-3 py-2"><span className="inline-flex rounded-full bg-navy-50 px-2 py-0.5 font-mono text-[10.5px] text-navy-700 ring-1 ring-line">{expenseCatLabel(e.category)}</span></td>
                  <td className="px-3 py-2">
                    <div className="text-ink">{e.description ?? '—'}</div>
                    <div className="text-[11.5px] text-ink-subtle">{e.vendor ?? ''}{e.rebillable ? ' · müşteriye yansıtılır' : ''}{e.receipt_path ? ' · 📎 fiş' : ''}</div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{money(Number(e.amount_usd ?? 0))}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap justify-end gap-1">
                      {e.receipt_path && <button type="button" className="btn-ghost btn-sm" onClick={() => viewReceipt(e.receipt_path!)}>Fiş</button>}
                      <button type="button" className="btn-ghost btn-sm" onClick={() => setEditing({ id: e.id, spent_on: e.spent_on, vendor: e.vendor ?? '', category: e.category, description: e.description ?? '', amount_usd: Number(e.amount_usd ?? 0), payment_method: e.payment_method ?? 'card', rebillable: e.rebillable, receipt_path: e.receipt_path, notes: e.notes ?? '' })}>Düzenle</button>
                      <ConfirmDeleteButton id={e.id} action={deleteExpense} heading="Gideri sil" details={[{ k: 'Tarih', v: e.spent_on }, { k: 'Kategori', v: expenseCatLabel(e.category) }, { k: 'Tutar', v: money(Number(e.amount_usd ?? 0)) }]} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-[min(520px,95vw)] rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-[17px] font-bold mb-3">{editing.id ? 'Gideri düzenle' : 'Yeni gider'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="field-label">Tarih</span><input className="lm-input" type="date" value={editing.spent_on} onChange={(e) => setEditing({ ...editing, spent_on: e.target.value })} /></label>
              <label className="block"><span className="field-label">Tutar (USD) *</span><input className="lm-input" type="number" step="0.01" value={editing.amount_usd} onChange={(e) => setEditing({ ...editing, amount_usd: Number(e.target.value) })} /></label>
              <label className="block"><span className="field-label">Kategori</span>
                <select className="lm-input" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>{EXPENSE_CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.tr}</option>)}</select>
              </label>
              <label className="block"><span className="field-label">Ödeme</span>
                <select className="lm-input" value={editing.payment_method} onChange={(e) => setEditing({ ...editing, payment_method: e.target.value })}>{METHODS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
              </label>
              <label className="block col-span-2"><span className="field-label">Açıklama</span><input className="lm-input" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
              <label className="block col-span-2"><span className="field-label">Satıcı (kimden)</span><input className="lm-input" value={editing.vendor} onChange={(e) => setEditing({ ...editing, vendor: e.target.value })} /></label>
              <label className="col-span-2 flex items-center gap-2 pt-1"><input type="checkbox" checked={!!editing.rebillable} onChange={(e) => setEditing({ ...editing, rebillable: e.target.checked })} /><span className="text-[13px]">Müşteriye yansıtılacak (rebillable)</span></label>
              <div className="col-span-2">
                <span className="field-label">Fiş (foto/PDF)</span>
                <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={onReceipt} aria-label="Fiş yükle" />
                <div className="flex items-center gap-2">
                  <button type="button" className="btn-ghost btn-sm" disabled={busy} onClick={() => fileRef.current?.click()}>{editing.receipt_path ? 'Fişi değiştir' : 'Fiş yükle'}</button>
                  {editing.receipt_path && <span className="text-[12px] text-green-700">📎 yüklendi</span>}
                </div>
              </div>
            </div>
            {err && <p className="mt-2 text-[13px] text-red-700">{err}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-ghost btn-md" onClick={() => setEditing(null)}>Vazgeç</button>
              <button type="button" className="btn-accent btn-md" onClick={save} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Kaydet'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
