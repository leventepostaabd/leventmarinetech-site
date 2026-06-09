'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CompanySettings } from '@/lib/billing';
import { saveSettings } from '../_actions';

export default function SettingsClient({ initial }: { initial: CompanySettings }) {
  const router = useRouter();
  const [f, setF] = useState<CompanySettings>(initial);
  const [state, setState] = useState<{ ok?: string; err?: string; busy?: boolean }>({});

  const set = (k: keyof CompanySettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function save() {
    setState({ busy: true });
    try {
      await saveSettings(f);
      setState({ ok: 'Ayarlar kaydedildi. Yeni teklif/fatura PDF’leri bunu kullanır.' });
      router.refresh();
    } catch (e) {
      setState({ err: e instanceof Error ? e.message : 'Hata' });
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="kicker">Evrak & Finans</div>
      <h2 className="text-[20px] mt-0.5 mb-1">Firma & Fatura Ayarları</h2>
      <p className="text-[12.5px] text-ink-muted mb-5">
        Bu bilgiler tüm teklif/fatura PDF’lerinde görünür. Banka/EIN burada saklanır — koda yazılmaz, sadece sende.
      </p>

      <Section title="Firma kimliği">
        <Field label="Yasal ünvan" v={f.legal_name} on={set('legal_name')} />
        <Field label="Adres (sadece USA)" v={f.address} on={set('address')} />
        <Field label="EIN (vergi no)" v={f.ein} on={set('ein')} placeholder="99-1234567" />
        <Field label="E-posta" v={f.email} on={set('email')} />
        <Field label="Telefon" v={f.phone} on={set('phone')} />
        <Field label="Web" v={f.website} on={set('website')} />
      </Section>

      <Section title="Banka / Havale (faturada görünür)">
        <Field label="Lehdar (beneficiary)" v={f.bank_beneficiary} on={set('bank_beneficiary')} />
        <Field label="Banka adı" v={f.bank_name} on={set('bank_name')} />
        <Field label="Banka adresi" v={f.bank_address} on={set('bank_address')} />
        <Field label="Hesap no" v={f.bank_account} on={set('bank_account')} />
        <Field label="Routing (ABA, 9 hane)" v={f.bank_routing} on={set('bank_routing')} />
        <Field label="SWIFT / BIC (uluslararası)" v={f.bank_swift} on={set('bank_swift')} />
      </Section>

      <Section title="Varsayılanlar">
        <Field label="Ödeme vadesi" v={f.default_payment_terms} on={set('default_payment_terms')} placeholder="Net 30" />
        <Field label="Incoterm (varsayılan)" v={f.default_incoterm} on={set('default_incoterm')} placeholder="DAP" />
      </Section>

      <div className="card mb-4">
        <h3 className="text-[15px] font-bold mb-1">Teklif şartları (TERMS — teklif PDF’inde)</h3>
        <textarea className="lm-input min-h-[90px]" value={f.quote_terms ?? ''} onChange={set('quote_terms')} />
      </div>
      <div className="card mb-4">
        <h3 className="text-[15px] font-bold mb-1">Fatura şartları (TERMS — fatura PDF’inde)</h3>
        <p className="text-[12px] text-ink-subtle mb-1">Ödemeyi güvenceye alan maddeler (mülkiyet saklı, gecikme faizi, itiraz süresi, yetkili mahkeme). Avukat onayı önerilir.</p>
        <textarea className="lm-input min-h-[120px]" value={f.invoice_terms ?? ''} onChange={set('invoice_terms')} />
      </div>

      {state.err && <p className="text-[13px] text-red-700">{state.err}</p>}
      {state.ok && <p className="text-[13px] text-green-700">{state.ok}</p>}
      <button className="btn-accent btn-md mt-2" onClick={save} disabled={state.busy}>Ayarları kaydet</button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card mb-4">
      <h3 className="text-[15px] font-bold mb-3">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, v, on, placeholder }: { label: string; v: string | null; on: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="lm-input" value={v ?? ''} onChange={on} placeholder={placeholder} />
    </label>
  );
}
