'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LINE_KINDS, LINE_KIND_LABEL, money, type LineKind, type PriceBookItem } from '@/lib/billing';
import { savePriceItem, deletePriceItem, type PriceBookInput } from '../_actions';

const blank: PriceBookInput = { kind: 'service', name_en: '', taxable: true, active: true, unit: 'ea' };

export default function PriceBookClient({ initial }: { initial: PriceBookItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<PriceBookInput | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    if (!editing) return;
    setBusy(true);
    setErr('');
    try {
      await savePriceItem(editing);
      setEditing(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Hata');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Bu kalemi silmek istediğinize emin misiniz?')) return;
    await deletePriceItem(id);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="kicker">Evrak & Finans</div>
          <h2 className="text-[20px] mt-0.5">Fiyat Kitabı</h2>
          <p className="text-[12.5px] text-ink-muted mt-0.5">Tekrar kullanılan hizmet/işçilik/parça kalemleri — hızlı teklif girişinin motoru.</p>
        </div>
        <button className="btn-accent btn-sm" onClick={() => setEditing({ ...blank })}>+ Yeni kalem</button>
      </div>

      {initial.length === 0 ? (
        <p className="text-[13px] text-ink-muted">Henüz kalem yok. İlk kalemi ekleyin.</p>
      ) : (
        <div className="overflow-hidden rounded-lg ring-1 ring-line">
          <table className="w-full text-[13px]">
            <thead className="bg-navy-50/60 text-left font-mono text-[11px] uppercase tracking-wide text-ink-subtle">
              <tr>
                <th className="px-3 py-2">Tür</th>
                <th className="px-3 py-2">Ad</th>
                <th className="px-3 py-2">Kod</th>
                <th className="px-3 py-2 text-right">Fiyat</th>
                <th className="px-3 py-2 text-right">Maliyet</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {initial.map((it) => (
                <tr key={it.id} className="hover:bg-navy-50/40">
                  <td className="px-3 py-2"><KindChip kind={it.kind} /></td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-ink">{it.name_en}</div>
                    {it.name_tr && <div className="text-[11.5px] text-ink-subtle">{it.name_tr}</div>}
                  </td>
                  <td className="px-3 py-2 font-mono text-[12px] text-ink-muted">{it.code ?? '—'}</td>
                  <td className="px-3 py-2 text-right font-mono">{it.default_price_usd != null ? money(it.default_price_usd) : '—'}</td>
                  <td className="px-3 py-2 text-right font-mono text-ink-subtle">{it.default_cost_usd != null ? money(it.default_cost_usd) : '—'}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <button className="btn-ghost btn-sm" onClick={() => setEditing({
                      id: it.id, kind: it.kind, code: it.code ?? '', name_en: it.name_en, name_tr: it.name_tr ?? '',
                      default_price_usd: it.default_price_usd, default_cost_usd: it.default_cost_usd,
                      unit: it.unit ?? 'ea', taxable: it.taxable, active: it.active
                    })}>Düzenle</button>
                    <button className="btn-ghost btn-sm text-red-600" onClick={() => remove(it.id)}>Sil</button>
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
            <h3 className="text-[17px] font-bold mb-3">{editing.id ? 'Kalemi düzenle' : 'Yeni kalem'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="field-label">Tür</span>
                <select className="lm-input" value={editing.kind} onChange={(e) => setEditing({ ...editing, kind: e.target.value as LineKind })}>
                  {LINE_KINDS.map((k) => <option key={k} value={k}>{LINE_KIND_LABEL[k].tr}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Kod</span>
                <input className="lm-input" value={editing.code ?? ''} onChange={(e) => setEditing({ ...editing, code: e.target.value })} />
              </label>
              <label className="block col-span-2">
                <span className="field-label">Ad (EN) *</span>
                <input className="lm-input" value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
              </label>
              <label className="block col-span-2">
                <span className="field-label">Ad (TR)</span>
                <input className="lm-input" value={editing.name_tr ?? ''} onChange={(e) => setEditing({ ...editing, name_tr: e.target.value })} />
              </label>
              <label className="block">
                <span className="field-label">Fiyat (USD)</span>
                <input className="lm-input" type="number" step="0.01" value={editing.default_price_usd ?? ''} onChange={(e) => setEditing({ ...editing, default_price_usd: e.target.value === '' ? null : Number(e.target.value) })} />
              </label>
              <label className="block">
                <span className="field-label">Maliyet (USD) <span className="text-ink-subtle">· gizli</span></span>
                <input className="lm-input" type="number" step="0.01" value={editing.default_cost_usd ?? ''} onChange={(e) => setEditing({ ...editing, default_cost_usd: e.target.value === '' ? null : Number(e.target.value) })} />
              </label>
              <label className="block">
                <span className="field-label">Birim</span>
                <input className="lm-input" value={editing.unit ?? 'ea'} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
              </label>
              <label className="flex items-center gap-2 self-end pb-2">
                <input type="checkbox" checked={editing.taxable ?? true} onChange={(e) => setEditing({ ...editing, taxable: e.target.checked })} />
                <span className="text-[13px]">Vergiye tabi</span>
              </label>
            </div>
            {err && <p className="mt-3 text-[13px] text-red-700">{err}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost btn-md" onClick={() => setEditing(null)}>Vazgeç</button>
              <button className="btn-accent btn-md" onClick={save} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Kaydet'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KindChip({ kind }: { kind: LineKind }) {
  return (
    <span className="inline-flex rounded-full bg-navy-50 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wide text-navy-700 ring-1 ring-line">
      {LINE_KIND_LABEL[kind].tr}
    </span>
  );
}
