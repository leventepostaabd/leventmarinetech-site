'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TestRow } from '@/lib/billing';
import { saveServiceReport, createCompany, createVessel, type ServiceReportInput } from '../_actions';

type Company = { id: string; name: string };
type Vessel = { id: string; name: string; imo_no: string | null; company_id: string | null };

const emptyTest = (): TestRow => ({ point: '', value: '', unit: '', threshold: '', instrument: '', cal_due: '' });

export default function ServiceReportBuilderClient({ companies, vessels }: { companies: Company[]; vessels: Vessel[] }) {
  const router = useRouter();
  const [f, setF] = useState({
    company_id: '', vessel_id: '', po_reference: '', port: '', attended_on: '', class_format: '',
    findings: '', work_performed: '', parts_used: '', outstanding: 'NIL',
    engineer_name: '', ce_name: '', ce_rank: 'Chief Engineer'
  });
  const [tests, setTests] = useState<TestRow[]>([emptyTest()]);
  const [companyList, setCompanyList] = useState(companies);
  const [vesselList, setVesselList] = useState(vessels);
  const [newCo, setNewCo] = useState<{ name: string; billing_address: string } | null>(null);
  const [newVe, setNewVe] = useState<{ name: string; imo_no: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState<{ id: string; number: string } | null>(null);

  const vesselOptions = useMemo(
    () => (f.company_id ? vesselList.filter((v) => v.company_id === f.company_id || !v.company_id) : vesselList),
    [vesselList, f.company_id]
  );

  async function addCompany() {
    if (!newCo?.name.trim()) return;
    try { const c = await createCompany({ name: newCo.name, billing_address: newCo.billing_address }); setCompanyList((l) => [...l, c]); setF((p) => ({ ...p, company_id: c.id, vessel_id: '' })); setNewCo(null); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Hata'); }
  }
  async function addVessel() {
    if (!newVe?.name.trim()) return;
    try { const v = await createVessel({ name: newVe.name, imo_no: newVe.imo_no, company_id: f.company_id || null }); setVesselList((l) => [...l, v]); setF((p) => ({ ...p, vessel_id: v.id })); setNewVe(null); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Hata'); }
  }
  function patchTest(i: number, patch: Partial<TestRow>) { setTests((ts) => ts.map((t, idx) => (idx === i ? { ...t, ...patch } : t))); }

  async function submit() {
    setBusy(true); setErr('');
    try {
      const input: ServiceReportInput = { ...f, test_results: tests };
      const res = await saveServiceReport(input);
      setDone(res);
      router.refresh();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Hata'); } finally { setBusy(false); }
  }

  if (done) {
    return (
      <div className="card max-w-lg border-l-4 border-l-green-600">
        <h2 className="text-[18px] font-bold text-navy-700">Rapor kaydedildi: <span className="font-mono">{done.number}</span></h2>
        <p className="text-[13.5px] text-ink-muted mt-1">PDF&apos;i yazdır, gemide CE/Master&apos;a imzalat + kaşelet, imzalı sayfanın fotoğrafını çek.</p>
        <div className="mt-4 flex gap-2">
          <a href={`/api/admin/billing/service-reports/${done.id}/pdf`} target="_blank" rel="noreferrer" className="btn-accent btn-md no-underline">PDF aç</a>
          <a href="/admin/billing/service-reports" className="btn-ghost btn-md no-underline">Raporlara git</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="kicker">Evrak & Finans</div>
      <h2 className="text-[20px] mt-0.5 mb-4">Yeni servis / attendance raporu</h2>

      <div className="grid gap-3 sm:grid-cols-3 mb-4">
        <div className="block">
          <span className="field-label">Müşteri</span>
          <select className="lm-input" aria-label="Müşteri" value={f.company_id} onChange={(e) => setF({ ...f, company_id: e.target.value, vessel_id: '' })}>
            <option value="">—</option>
            {companyList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
          <select className="lm-input" aria-label="Gemi" value={f.vessel_id} onChange={(e) => setF({ ...f, vessel_id: e.target.value })}>
            <option value="">—</option>
            {vesselOptions.map((v) => <option key={v.id} value={v.id}>{v.name}{v.imo_no ? ` · IMO ${v.imo_no}` : ''}</option>)}
          </select>
          {newVe ? (
            <div className="mt-2 rounded-md bg-navy-50/50 p-2 ring-1 ring-line">
              <input className="lm-input !mt-0 mb-1" placeholder="Gemi adı *" value={newVe.name} onChange={(e) => setNewVe({ ...newVe, name: e.target.value })} />
              <input className="lm-input !mt-0 mb-1.5" placeholder="IMO no" value={newVe.imo_no} onChange={(e) => setNewVe({ ...newVe, imo_no: e.target.value })} />
              <div className="flex gap-1.5"><button type="button" className="btn-accent btn-sm" onClick={addVessel}>Ekle</button><button type="button" className="btn-ghost btn-sm" onClick={() => setNewVe(null)}>İptal</button></div>
            </div>
          ) : <button type="button" className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-amber-400/50 bg-amber/10 px-2.5 py-1 text-[12px] font-semibold text-amber-700 transition hover:bg-amber/20" onClick={() => setNewVe({ name: '', imo_no: '' })}>+ Yeni gemi</button>}
        </div>
        <T label="PO referansı" v={f.po_reference} on={(v) => setF({ ...f, po_reference: v })} />
        <T label="Liman" v={f.port} on={(v) => setF({ ...f, port: v })} />
        <label className="block"><span className="field-label">Müdahale tarihi</span><input className="lm-input" type="date" value={f.attended_on} onChange={(e) => setF({ ...f, attended_on: e.target.value })} /></label>
        <T label="Class formatı" v={f.class_format} on={(v) => setF({ ...f, class_format: v })} ph="DNV / ABS / BV…" />
      </div>

      <TA label="Bildirilen arıza / bulgular" v={f.findings} on={(v) => setF({ ...f, findings: v })} />
      <TA label="Yapılan iş" v={f.work_performed} on={(v) => setF({ ...f, work_performed: v })} />
      <TA label="Kullanılan parçalar (parça no / seri)" v={f.parts_used} on={(v) => setF({ ...f, parts_used: v })} />

      {/* Test table */}
      <div className="mt-4">
        <div className="field-label">Test & ölçüm (cihaz + kalibrasyon ile)</div>
        <div className="overflow-x-auto rounded-lg ring-1 ring-line">
          <table className="w-full min-w-[720px] text-[12.5px]">
            <thead className="bg-navy-50/60 text-left font-mono text-[10px] uppercase tracking-wide text-ink-subtle">
              <tr><th className="px-2 py-1.5">Nokta</th><th className="px-2 py-1.5">Değer</th><th className="px-2 py-1.5">Birim</th><th className="px-2 py-1.5">Eşik</th><th className="px-2 py-1.5">Cihaz</th><th className="px-2 py-1.5">Kal. son</th><th></th></tr>
            </thead>
            <tbody>
              {tests.map((t, i) => (
                <tr key={i}>
                  {(['point', 'value', 'unit', 'threshold', 'instrument', 'cal_due'] as (keyof TestRow)[]).map((k) => (
                    <td key={k} className="px-1 py-1"><input className="lm-input !mt-0" value={t[k]} onChange={(e) => patchTest(i, { [k]: e.target.value })} aria-label={k} /></td>
                  ))}
                  <td className="px-1 text-right"><button type="button" className="text-red-600" onClick={() => setTests((ts) => ts.filter((_, idx) => idx !== i))} aria-label="Sil">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn-ghost btn-sm mt-2" onClick={() => setTests((ts) => [...ts, emptyTest()])}>+ Test satırı</button>
      </div>

      <div className="mt-4"><T label="Açık kalan işler (yoksa NIL)" v={f.outstanding} on={(v) => setF({ ...f, outstanding: v })} /></div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <T label="Mühendis (bizim)" v={f.engineer_name} on={(v) => setF({ ...f, engineer_name: v })} />
        <T label="Gemide imzalayan (ad)" v={f.ce_name} on={(v) => setF({ ...f, ce_name: v })} ph="Chief Engineer adı" />
        <T label="Rütbe" v={f.ce_rank} on={(v) => setF({ ...f, ce_rank: v })} />
      </div>
      <p className="mt-2 text-[12px] text-ink-subtle">Islak imza + gemi kaşesi PDF üzerinde gemide alınır; imzalı sayfanın fotoğrafını çek.</p>

      {err && <p className="mt-3 text-[13px] text-red-700">{err}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <a href="/admin/billing/service-reports" className="btn-ghost btn-md no-underline">Vazgeç</a>
        <button type="button" className="btn-accent btn-md" onClick={submit} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Raporu kaydet'}</button>
      </div>
    </div>
  );
}

function T({ label, v, on, ph }: { label: string; v: string; on: (v: string) => void; ph?: string }) {
  return <label className="block"><span className="field-label">{label}</span><input className="lm-input" value={v} placeholder={ph} onChange={(e) => on(e.target.value)} /></label>;
}
function TA({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return <div className="mt-3"><div className="field-label">{label}</div><textarea className="lm-input min-h-[70px]" value={v} onChange={(e) => on(e.target.value)} /></div>;
}
