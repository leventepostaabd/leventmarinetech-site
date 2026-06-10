'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LINE_KINDS, LINE_KIND_LABEL, computeTotals, money, type LineKind, type PriceBookItem, type QuoteLine } from '@/lib/billing';
import { saveInvoice, createCompany, createVessel, type InvoiceInput } from '../_actions';

type Company = { id: string; name: string };
type Vessel = { id: string; name: string; imo_no: string | null; company_id: string | null };
type Scope = 'both' | 'domestic' | 'international';

const emptyLine = (): QuoteLine => ({ item_id: null, kind: 'service', description: '', qty: 1, unit_price_usd: 0, cost_usd: null, line_total: 0 });

const SCOPES: { v: Scope; label: string; hint: string }[] = [
  { v: 'both', label: 'Her ikisi', hint: 'USA + uluslararası bilgileri başlıklı göster (önerilen)' },
  { v: 'domestic', label: 'Sadece USA-içi', hint: 'ACH + wire routing' },
  { v: 'international', label: 'Sadece Uluslararası', hint: 'SWIFT/BIC' }
];

type Report = { id: string; number: string; company_id: string | null; signed: boolean };

export default function InvoiceBuilderClient({ companies, vessels, priceBook, reports = [] }: { companies: Company[]; vessels: Vessel[]; priceBook: PriceBookItem[]; reports?: Report[] }) {
  const router = useRouter();
  const [head, setHead] = useState({
    company_id: '', vessel_id: '', service_report_id: '', po_reference: '', currency: 'USD', incoterm: '', due_date: '', tax_rate_pct: 0,
    payment_scope: 'both' as Scope, notes: ''
  });
  const [lines, setLines] = useState<QuoteLine[]>([emptyLine()]);
  const [companyList, setCompanyList] = useState(companies);
  const [vesselList, setVesselList] = useState(vessels);
  const [newCo, setNewCo] = useState<{ name: string; billing_address: string } | null>(null);
  const [newVe, setNewVe] = useState<{ name: string; imo_no: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState<{ id: string; number: string } | null>(null);

  const vesselOptions = useMemo(() => (head.company_id ? vesselList.filter((v) => v.company_id === head.company_id || !v.company_id) : vesselList), [vesselList, head.company_id]);
  const totals = useMemo(() => computeTotals(lines, Number(head.tax_rate_pct) || 0), [lines, head.tax_rate_pct]);

  function patchLine(i: number, patch: Partial<QuoteLine>) { setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l))); }
  function applyPriceItem(i: number, itemId: string) {
    const it = priceBook.find((p) => p.id === itemId);
    if (!it) { patchLine(i, { item_id: null }); return; }
    patchLine(i, { item_id: it.id, kind: it.kind, description: it.name_en, unit_price_usd: it.default_price_usd ?? 0, cost_usd: it.default_cost_usd ?? null });
  }
  async function addCompany() {
    if (!newCo?.name.trim()) return;
    try { const c = await createCompany({ name: newCo.name, billing_address: newCo.billing_address }); setCompanyList((l) => [...l, c]); setHead((h) => ({ ...h, company_id: c.id, vessel_id: '' })); setNewCo(null); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Hata'); }
  }
  async function addVessel() {
    if (!newVe?.name.trim()) return;
    try { const v = await createVessel({ name: newVe.name, imo_no: newVe.imo_no, company_id: head.company_id || null }); setVesselList((l) => [...l, v]); setHead((h) => ({ ...h, vessel_id: v.id })); setNewVe(null); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Hata'); }
  }

  async function submit() {
    setBusy(true); setErr('');
    try {
      const input: InvoiceInput = {
        company_id: head.company_id || null, vessel_id: head.vessel_id || null, service_report_id: head.service_report_id || null, po_reference: head.po_reference,
        currency: head.currency, incoterm: head.incoterm, due_date: head.due_date || null,
        tax_rate_pct: Number(head.tax_rate_pct) || 0, payment_scope: head.payment_scope, notes: head.notes,
        lines: lines.filter((l) => l.description.trim()).map((l) => ({ item_id: l.item_id ?? null, kind: l.kind, description: l.description, qty: l.qty, unit_price_usd: l.unit_price_usd, cost_usd: l.cost_usd ?? null }))
      };
      const res = await saveInvoice(input);
      setDone(res); router.refresh();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Hata'); } finally { setBusy(false); }
  }

  if (done) {
    return (
      <div className="card max-w-lg border-l-4 border-l-green-600">
        <h2 className="text-[18px] font-bold text-navy-700">Fatura oluşturuldu: <span className="font-mono">{done.number}</span></h2>
        <div className="mt-4 flex gap-2">
          <a href={`/api/admin/billing/invoices/${done.id}/pdf`} target="_blank" rel="noreferrer" className="btn-accent btn-md no-underline">PDF aç</a>
          <a href="/admin/billing/invoices" className="btn-ghost btn-md no-underline">Faturalara git</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4"><div className="kicker">Evrak & Finans</div><h2 className="text-[20px] mt-0.5">Yeni fatura</h2></div>

      <div className="grid gap-3 sm:grid-cols-3 mb-4">
        <div className="block">
          <span className="field-label">Müşteri</span>
          <select className="lm-input" aria-label="Müşteri" value={head.company_id} onChange={(e) => setHead({ ...head, company_id: e.target.value, vessel_id: '' })}>
            <option value="">—</option>{companyList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {newCo ? (
            <div className="mt-2 rounded-md bg-navy-50/50 p-2 ring-1 ring-line">
              <input className="lm-input !mt-0 mb-1" placeholder="Firma adı *" value={newCo.name} onChange={(e) => setNewCo({ ...newCo, name: e.target.value })} />
              <input className="lm-input !mt-0 mb-1.5" placeholder="Fatura adresi" value={newCo.billing_address} onChange={(e) => setNewCo({ ...newCo, billing_address: e.target.value })} />
              <div className="flex gap-1.5"><button type="button" className="btn-accent btn-sm" onClick={addCompany}>Ekle</button><button type="button" className="btn-ghost btn-sm" onClick={() => setNewCo(null)}>İptal</button></div>
            </div>
          ) : <button type="button" className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-amber-400/50 bg-amber/10 px-2.5 py-1 text-[12px] font-semibold text-amber-700 transition hover:bg-amber/20" onClick={() => setNewCo({ name: '', billing_address: '' })}>+ Yeni müşteri</button>}
        </div>
        <div className="block">
          <span className="field-label">Gemi</span>
          <select className="lm-input" aria-label="Gemi" value={head.vessel_id} onChange={(e) => setHead({ ...head, vessel_id: e.target.value })}>
            <option value="">—</option>{vesselOptions.map((v) => <option key={v.id} value={v.id}>{v.name}{v.imo_no ? ` · IMO ${v.imo_no}` : ''}</option>)}
          </select>
          {newVe ? (
            <div className="mt-2 rounded-md bg-navy-50/50 p-2 ring-1 ring-line">
              <input className="lm-input !mt-0 mb-1" placeholder="Gemi adı *" value={newVe.name} onChange={(e) => setNewVe({ ...newVe, name: e.target.value })} />
              <input className="lm-input !mt-0 mb-1.5" placeholder="IMO no" value={newVe.imo_no} onChange={(e) => setNewVe({ ...newVe, imo_no: e.target.value })} />
              <div className="flex gap-1.5"><button type="button" className="btn-accent btn-sm" onClick={addVessel}>Ekle</button><button type="button" className="btn-ghost btn-sm" onClick={() => setNewVe(null)}>İptal</button></div>
            </div>
          ) : <button type="button" className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-amber-400/50 bg-amber/10 px-2.5 py-1 text-[12px] font-semibold text-amber-700 transition hover:bg-amber/20" onClick={() => setNewVe({ name: '', imo_no: '' })}>+ Yeni gemi</button>}
        </div>
        <label className="block"><span className="field-label">PO referansı</span><input className="lm-input" value={head.po_reference} onChange={(e) => setHead({ ...head, po_reference: e.target.value })} /></label>
        <label className="block"><span className="field-label">Para birimi</span><input className="lm-input" value={head.currency} onChange={(e) => setHead({ ...head, currency: e.target.value.toUpperCase().slice(0, 3) })} /></label>
        <label className="block"><span className="field-label">Incoterm</span><input className="lm-input" placeholder="DAP / FOB…" value={head.incoterm} onChange={(e) => setHead({ ...head, incoterm: e.target.value })} /></label>
        <label className="block"><span className="field-label">Vade tarihi</span><input className="lm-input" type="date" value={head.due_date} onChange={(e) => setHead({ ...head, due_date: e.target.value })} /></label>
      </div>

      {/* Linked service report — the signed evidence behind this invoice */}
      {reports.length > 0 && (
        <div className="mb-4 max-w-md">
          <span className="field-label">Bağlı servis raporu (atıf)</span>
          <select className="lm-input" aria-label="Servis raporu" value={head.service_report_id} onChange={(e) => setHead({ ...head, service_report_id: e.target.value })}>
            <option value="">— Yok —</option>
            {reports.filter((r) => !head.company_id || r.company_id === head.company_id || !r.company_id).map((r) => (
              <option key={r.id} value={r.id}>{r.number}{r.signed ? ' · imzalı' : ' · imza bekliyor'}</option>
            ))}
          </select>
          <p className="mt-1 text-[12px] text-ink-subtle">Seçilirse faturada &quot;Ref: SR-…&quot; çıkar ve mail&apos;e imzalı rapor eklenir.</p>
        </div>
      )}

      {/* Payment scope toggle */}
      <div className="mb-4">
        <div className="field-label">Ödeme bilgileri (faturada görünür)</div>
        <div className="flex flex-wrap gap-1.5">
          {SCOPES.map((sc) => (
            <button key={sc.v} type="button" onClick={() => setHead({ ...head, payment_scope: sc.v })} title={sc.hint}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${head.payment_scope === sc.v ? 'bg-amber text-navy-700 ring-1 ring-amber' : 'bg-navy-50 text-ink-muted ring-1 ring-line hover:bg-navy-100'}`}>
              {sc.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-[12px] text-ink-subtle">{SCOPES.find((x) => x.v === head.payment_scope)?.hint}</p>
      </div>

      {/* Lines */}
      <div className="overflow-x-auto rounded-lg ring-1 ring-line">
        <table className="w-full min-w-[760px] text-[13px]">
          <thead className="bg-navy-50/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-ink-subtle">
            <tr><th className="px-2 py-2 w-[120px]">Tür</th><th className="px-2 py-2">Açıklama</th><th className="px-2 py-2 w-[70px] text-right">Adet</th><th className="px-2 py-2 w-[110px] text-right">Birim fiyat</th><th className="px-2 py-2 w-[110px] text-right">Toplam</th><th className="w-[40px]"></th></tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {lines.map((l, i) => (
              <tr key={i} className="align-top">
                <td className="px-2 py-1.5"><select className="lm-input !mt-0" aria-label="Tür" value={l.kind} onChange={(e) => patchLine(i, { kind: e.target.value as LineKind })}>{LINE_KINDS.map((k) => <option key={k} value={k}>{LINE_KIND_LABEL[k].tr}</option>)}</select></td>
                <td className="px-2 py-1.5">
                  {priceBook.length > 0 && (<select className="lm-input !mt-0 mb-1 text-[12px]" aria-label="Fiyat kitabı" value={l.item_id ?? ''} onChange={(e) => applyPriceItem(i, e.target.value)}><option value="">— Fiyat kitabından —</option>{priceBook.map((p) => <option key={p.id} value={p.id}>{p.name_en}</option>)}</select>)}
                  <input className="lm-input !mt-0" placeholder="Açıklama" value={l.description} onChange={(e) => patchLine(i, { description: e.target.value })} />
                </td>
                <td className="px-2 py-1.5"><input className="lm-input !mt-0 text-right" type="number" step="0.01" value={l.qty} onChange={(e) => patchLine(i, { qty: Number(e.target.value) })} aria-label="Adet" /></td>
                <td className="px-2 py-1.5"><input className="lm-input !mt-0 text-right" type="number" step="0.01" value={l.unit_price_usd} onChange={(e) => patchLine(i, { unit_price_usd: Number(e.target.value) })} aria-label="Birim fiyat" /></td>
                <td className="px-2 py-1.5 text-right font-mono">{money(l.qty * l.unit_price_usd, head.currency)}</td>
                <td className="px-2 py-1.5 text-right"><button type="button" className="text-red-600" onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))} aria-label="Sil">×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn-ghost btn-sm mt-2" onClick={() => setLines((ls) => [...ls, emptyLine()])}>+ Satır ekle</button>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="field-label">Notlar</span><textarea className="lm-input" rows={4} value={head.notes} onChange={(e) => setHead({ ...head, notes: e.target.value })} /></label>
        <div className="rounded-lg bg-navy-50/50 p-4 ring-1 ring-line">
          <div className="flex items-center justify-between"><span className="text-[13px] text-ink-muted">Ara toplam</span><span className="font-mono text-[13px]">{money(totals.subtotal, head.currency)}</span></div>
          <div className="mt-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[13px] text-ink-muted">Vergi %<input className="lm-input !mt-0 w-16 text-right" type="number" step="0.1" value={head.tax_rate_pct} onChange={(e) => setHead({ ...head, tax_rate_pct: Number(e.target.value) })} aria-label="Vergi yüzdesi" /></span>
            <span className="font-mono text-[13px]">{money(totals.tax, head.currency)}</span>
          </div>
          <div className="mt-3 border-t border-line pt-3 flex items-center justify-between"><span className="font-bold text-navy-700">Genel toplam</span><span className="font-mono text-[16px] font-bold text-navy-700">{money(totals.total, head.currency)}</span></div>
        </div>
      </div>

      {err && <p className="mt-3 text-[13px] text-red-700">{err}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <a href="/admin/billing/invoices" className="btn-ghost btn-md no-underline">Vazgeç</a>
        <button type="button" className="btn-accent btn-md" onClick={submit} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Faturayı oluştur'}</button>
      </div>
    </div>
  );
}
