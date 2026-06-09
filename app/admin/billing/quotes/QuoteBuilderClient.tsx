'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LINE_KINDS, LINE_KIND_LABEL, computeTotals, money,
  type LineKind, type PriceBookItem, type QuoteLine
} from '@/lib/billing';
import { saveQuote, createCompany, createVessel, type QuoteInput } from '../_actions';

type Company = { id: string; name: string };
type Vessel = { id: string; name: string; imo_no: string | null; company_id: string | null };

const emptyLine = (): QuoteLine => ({
  item_id: null, kind: 'service', description: '', qty: 1, unit_price_usd: 0, cost_usd: null, is_optional: false, line_total: 0
});

export default function QuoteBuilderClient({
  companies, vessels, priceBook, initial
}: {
  companies: Company[];
  vessels: Vessel[];
  priceBook: PriceBookItem[];
  initial?: Partial<QuoteInput> & { id?: string };
}) {
  const router = useRouter();
  const [head, setHead] = useState({
    company_id: initial?.company_id ?? '',
    vessel_id: initial?.vessel_id ?? '',
    po_reference: initial?.po_reference ?? '',
    currency: initial?.currency ?? 'USD',
    incoterm: initial?.incoterm ?? '',
    valid_until: initial?.valid_until ?? '',
    tax_rate_pct: initial?.tax_rate_pct ?? 0,
    notes: initial?.notes ?? ''
  });
  const [lines, setLines] = useState<QuoteLine[]>(initial?.lines?.length ? (initial.lines as QuoteLine[]) : [emptyLine()]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState<{ number: string } | null>(null);

  // Manual entry — not every customer came through the website.
  const [companyList, setCompanyList] = useState<Company[]>(companies);
  const [vesselList, setVesselList] = useState<Vessel[]>(vessels);
  const [newCo, setNewCo] = useState<{ name: string; billing_address: string } | null>(null);
  const [newVe, setNewVe] = useState<{ name: string; imo_no: string } | null>(null);

  const vesselOptions = useMemo(
    () => (head.company_id ? vesselList.filter((v) => v.company_id === head.company_id || !v.company_id) : vesselList),
    [vesselList, head.company_id]
  );

  async function addCompany() {
    if (!newCo?.name.trim()) return;
    setErr('');
    try {
      const c = await createCompany({ name: newCo.name, billing_address: newCo.billing_address });
      setCompanyList((l) => [...l, c]);
      setHead((h) => ({ ...h, company_id: c.id, vessel_id: '' }));
      setNewCo(null);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Hata'); }
  }
  async function addVessel() {
    if (!newVe?.name.trim()) return;
    setErr('');
    try {
      const v = await createVessel({ name: newVe.name, imo_no: newVe.imo_no, company_id: head.company_id || null });
      setVesselList((l) => [...l, v]);
      setHead((h) => ({ ...h, vessel_id: v.id }));
      setNewVe(null);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Hata'); }
  }

  const totals = useMemo(() => computeTotals(lines, Number(head.tax_rate_pct) || 0), [lines, head.tax_rate_pct]);

  function patchLine(i: number, patch: Partial<QuoteLine>) {
    setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }
  function applyPriceItem(i: number, itemId: string) {
    const it = priceBook.find((p) => p.id === itemId);
    if (!it) { patchLine(i, { item_id: null }); return; }
    patchLine(i, {
      item_id: it.id, kind: it.kind,
      description: it.name_en, unit_price_usd: it.default_price_usd ?? 0, cost_usd: it.default_cost_usd ?? null
    });
  }

  async function submit() {
    setBusy(true); setErr('');
    try {
      const input: QuoteInput = {
        id: initial?.id,
        company_id: head.company_id || null,
        vessel_id: head.vessel_id || null,
        po_reference: head.po_reference,
        currency: head.currency,
        incoterm: head.incoterm,
        valid_until: head.valid_until || null,
        tax_rate_pct: Number(head.tax_rate_pct) || 0,
        notes: head.notes,
        lines: lines.filter((l) => l.description.trim()).map((l) => ({
          item_id: l.item_id ?? null, kind: l.kind, description: l.description,
          qty: l.qty, unit_price_usd: l.unit_price_usd, cost_usd: l.cost_usd ?? null, is_optional: l.is_optional
        }))
      };
      const res = await saveQuote(input);
      setDone({ number: res.number });
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Hata');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card max-w-lg border-l-4 border-l-green-600">
        <h2 className="text-[18px] font-bold text-navy-700">Teklif kaydedildi: <span className="font-mono">{done.number}</span></h2>
        <p className="text-[13.5px] text-ink-muted mt-1">Şimdi PDF üretip gönderebilir veya teklifler listesinden takip edebilirsiniz.</p>
        <div className="mt-4 flex gap-2">
          <a href="/admin/billing/quotes" className="btn-accent btn-md no-underline">Tekliflere git</a>
          <button className="btn-ghost btn-md" onClick={() => { setDone(null); setLines([emptyLine()]); }}>Yeni teklif</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="kicker">Evrak & Finans</div>
        <h2 className="text-[20px] mt-0.5">Yeni teklif</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-5">
        <div className="block">
          <span className="field-label">Müşteri</span>
          <select className="lm-input" aria-label="Müşteri" value={head.company_id} onChange={(e) => setHead({ ...head, company_id: e.target.value, vessel_id: '' })}>
            <option value="">—</option>
            {companyList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {newCo ? (
            <div className="mt-2 rounded-md bg-navy-50/50 p-2 ring-1 ring-line">
              <input className="lm-input !mt-0 mb-1" placeholder="Firma adı *" value={newCo.name} onChange={(e) => setNewCo({ ...newCo, name: e.target.value })} />
              <input className="lm-input !mt-0 mb-1.5" placeholder="Fatura adresi (opsiyonel)" value={newCo.billing_address} onChange={(e) => setNewCo({ ...newCo, billing_address: e.target.value })} />
              <div className="flex gap-1.5">
                <button type="button" className="btn-accent btn-sm" onClick={addCompany}>Ekle</button>
                <button type="button" className="btn-ghost btn-sm" onClick={() => setNewCo(null)}>İptal</button>
              </div>
            </div>
          ) : (
            <button type="button" className="mt-1 font-mono text-[11px] uppercase tracking-wide text-amber-700 hover:text-amber-600" onClick={() => setNewCo({ name: '', billing_address: '' })}>+ Yeni müşteri</button>
          )}
        </div>
        <div className="block">
          <span className="field-label">Gemi</span>
          <select className="lm-input" aria-label="Gemi" value={head.vessel_id} onChange={(e) => setHead({ ...head, vessel_id: e.target.value })}>
            <option value="">—</option>
            {vesselOptions.map((v) => <option key={v.id} value={v.id}>{v.name}{v.imo_no ? ` · IMO ${v.imo_no}` : ''}</option>)}
          </select>
          {newVe ? (
            <div className="mt-2 rounded-md bg-navy-50/50 p-2 ring-1 ring-line">
              <input className="lm-input !mt-0 mb-1" placeholder="Gemi adı *" value={newVe.name} onChange={(e) => setNewVe({ ...newVe, name: e.target.value })} />
              <input className="lm-input !mt-0 mb-1.5" placeholder="IMO no (opsiyonel)" value={newVe.imo_no} onChange={(e) => setNewVe({ ...newVe, imo_no: e.target.value })} />
              <div className="flex gap-1.5">
                <button type="button" className="btn-accent btn-sm" onClick={addVessel}>Ekle</button>
                <button type="button" className="btn-ghost btn-sm" onClick={() => setNewVe(null)}>İptal</button>
              </div>
            </div>
          ) : (
            <button type="button" className="mt-1 font-mono text-[11px] uppercase tracking-wide text-amber-700 hover:text-amber-600" onClick={() => setNewVe({ name: '', imo_no: '' })}>+ Yeni gemi</button>
          )}
        </div>
        <label className="block">
          <span className="field-label">PO referansı</span>
          <input className="lm-input" value={head.po_reference} onChange={(e) => setHead({ ...head, po_reference: e.target.value })} />
        </label>
        <label className="block">
          <span className="field-label">Para birimi</span>
          <input className="lm-input" value={head.currency} onChange={(e) => setHead({ ...head, currency: e.target.value.toUpperCase().slice(0, 3) })} />
        </label>
        <label className="block">
          <span className="field-label">Incoterm</span>
          <input className="lm-input" placeholder="DAP / FOB / EXW…" value={head.incoterm} onChange={(e) => setHead({ ...head, incoterm: e.target.value })} />
        </label>
        <label className="block">
          <span className="field-label">Geçerlilik tarihi</span>
          <input className="lm-input" type="date" value={head.valid_until} onChange={(e) => setHead({ ...head, valid_until: e.target.value })} />
        </label>
      </div>

      {/* Line grid */}
      <div className="overflow-x-auto rounded-lg ring-1 ring-line">
        <table className="w-full min-w-[760px] text-[13px]">
          <thead className="bg-navy-50/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-ink-subtle">
            <tr>
              <th className="px-2 py-2 w-[120px]">Tür</th>
              <th className="px-2 py-2">Açıklama</th>
              <th className="px-2 py-2 w-[70px] text-right">Adet</th>
              <th className="px-2 py-2 w-[110px] text-right">Birim fiyat</th>
              <th className="px-2 py-2 w-[110px] text-right">Toplam</th>
              <th className="px-2 py-2 w-[40px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {lines.map((l, i) => (
              <tr key={i} className="align-top">
                <td className="px-2 py-1.5">
                  <select className="lm-input !mt-0" value={l.kind} onChange={(e) => patchLine(i, { kind: e.target.value as LineKind })}>
                    {LINE_KINDS.map((k) => <option key={k} value={k}>{LINE_KIND_LABEL[k].tr}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  {priceBook.length > 0 && (
                    <select className="lm-input !mt-0 mb-1 text-[12px]" value={l.item_id ?? ''} onChange={(e) => applyPriceItem(i, e.target.value)}>
                      <option value="">— Fiyat kitabından seç —</option>
                      {priceBook.map((p) => <option key={p.id} value={p.id}>{p.name_en}</option>)}
                    </select>
                  )}
                  <input className="lm-input !mt-0" placeholder="Açıklama" value={l.description} onChange={(e) => patchLine(i, { description: e.target.value })} />
                  <label className="mt-1 flex items-center gap-1.5 text-[11.5px] text-ink-subtle">
                    <input type="checkbox" checked={!!l.is_optional} onChange={(e) => patchLine(i, { is_optional: e.target.checked })} />
                    Opsiyonel (toplama dahil değil)
                  </label>
                </td>
                <td className="px-2 py-1.5 text-right">
                  <input className="lm-input !mt-0 text-right" type="number" step="0.01" value={l.qty} onChange={(e) => patchLine(i, { qty: Number(e.target.value) })} />
                </td>
                <td className="px-2 py-1.5 text-right">
                  <input className="lm-input !mt-0 text-right" type="number" step="0.01" value={l.unit_price_usd} onChange={(e) => patchLine(i, { unit_price_usd: Number(e.target.value) })} />
                </td>
                <td className="px-2 py-1.5 text-right font-mono">{money(l.qty * l.unit_price_usd, head.currency)}</td>
                <td className="px-2 py-1.5 text-right">
                  <button className="text-red-600 hover:text-red-700" onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))} aria-label="Sil">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-ghost btn-sm mt-2" onClick={() => setLines((ls) => [...ls, emptyLine()])}>+ Satır ekle</button>

      {/* Totals + notes */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Notlar</span>
          <textarea className="lm-input" rows={4} value={head.notes} onChange={(e) => setHead({ ...head, notes: e.target.value })} />
        </label>
        <div className="rounded-lg bg-navy-50/50 p-4 ring-1 ring-line">
          <Row label="Ara toplam" value={money(totals.subtotal, head.currency)} />
          <div className="mt-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[13px] text-ink-muted">
              Vergi %
              <input className="lm-input !mt-0 w-16 text-right" type="number" step="0.1" value={head.tax_rate_pct} onChange={(e) => setHead({ ...head, tax_rate_pct: Number(e.target.value) })} />
            </span>
            <span className="font-mono text-[13px]">{money(totals.tax, head.currency)}</span>
          </div>
          <div className="mt-3 border-t border-line pt-3">
            <Row label="Genel toplam" value={money(totals.total, head.currency)} strong />
          </div>
        </div>
      </div>

      {err && <p className="mt-3 text-[13px] text-red-700">{err}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <a href="/admin/billing/quotes" className="btn-ghost btn-md no-underline">Vazgeç</a>
        <button className="btn-accent btn-md" onClick={submit} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Teklifi kaydet'}</button>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[13px] ${strong ? 'font-bold text-navy-700' : 'text-ink-muted'}`}>{label}</span>
      <span className={`font-mono ${strong ? 'text-[16px] font-bold text-navy-700' : 'text-[13px]'}`}>{value}</span>
    </div>
  );
}
