import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createManualLead } from '@/app/admin/_actions';

export const dynamic = 'force-dynamic';

export default function NewLeadPage() {
  async function submit(formData: FormData) {
    'use server';
    const input = {
      track:          String(formData.get('track') ?? 'service'),
      company_name:   String(formData.get('company_name') ?? '').trim(),
      vessel_name:    String(formData.get('vessel_name') ?? '').trim() || undefined,
      imo:            String(formData.get('imo') ?? '').trim() || undefined,
      contact_email:  String(formData.get('contact_email') ?? '').trim() || undefined,
      contact_phone:  String(formData.get('contact_phone') ?? '').trim() || undefined,
      port:           String(formData.get('port') ?? '').trim() || undefined,
      system:         String(formData.get('system') ?? '').trim() || undefined,
      brand:          String(formData.get('brand') ?? '').trim() || undefined,
      part_number:    String(formData.get('part_number') ?? '').trim() || undefined,
      priority_score: Number(formData.get('priority_score') ?? 50),
      draft_message:  String(formData.get('draft_message') ?? '') || undefined,
      note:           String(formData.get('note') ?? '') || undefined
    };
    const { lead_id } = await createManualLead(input);
    redirect(`/admin/leads/${lead_id}`);
  }

  return (
    <div className="max-w-3xl space-y-5">
      <header>
        <Link href="/admin/leads" className="font-mono text-[12px] text-ink-subtle hover:text-ink no-underline">
          ← Back to leads
        </Link>
        <h2 className="text-[22px] mt-2">New manual lead</h2>
        <p className="text-ink-muted text-[13.5px] mt-1">
          Use this to enter a vessel you found on Equasis or a PSC report.
          Public data only — no personal contacts.
        </p>
      </header>

      <form action={submit} className="grid gap-4">
        <div className="grid gap-1">
          <label className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">Track *</label>
          <select name="track" required className="rounded-md bg-white px-3 py-2 ring-1 ring-line text-[14px]">
            <option value="service">Service</option>
            <option value="supply">Supply</option>
          </select>
        </div>

        <fieldset className="grid sm:grid-cols-2 gap-3">
          <Field label="Company / operator *" name="company_name" required />
          <Field label="Vessel name" name="vessel_name" />
          <Field label="IMO no" name="imo" placeholder="7-digit" />
          <Field label="Port" name="port" />
          <Field label="Contact email" name="contact_email" type="email" />
          <Field label="Contact phone" name="contact_phone" />
        </fieldset>

        <fieldset className="grid sm:grid-cols-3 gap-3">
          <Field label="System (service)" name="system" placeholder="e.g. AVR, BWTS" />
          <Field label="Brand (supply)" name="brand" />
          <Field label="Part number (supply)" name="part_number" />
        </fieldset>

        <div className="grid gap-1">
          <label className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">Priority score 0–100</label>
          <input
            type="number"
            name="priority_score"
            defaultValue={50}
            min={0}
            max={100}
            className="rounded-md bg-white px-3 py-2 ring-1 ring-line text-[14px] w-32"
          />
        </div>

        <div className="grid gap-1">
          <label className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">Draft outreach message</label>
          <textarea
            name="draft_message"
            rows={6}
            placeholder="Initial outreach you intend to send by WhatsApp or email. Not auto-sent."
            className="rounded-md bg-white px-3 py-2 ring-1 ring-line text-[14px] leading-relaxed font-sans"
          />
        </div>

        <div className="grid gap-1">
          <label className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">Internal note</label>
          <textarea
            name="note"
            rows={3}
            placeholder="Why this lead — fleet age, recent US PSC, etc."
            className="rounded-md bg-white px-3 py-2 ring-1 ring-line text-[14px] font-sans"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-accent btn-md">Create lead</button>
          <Link href="/admin/leads" className="btn-ghost btn-md no-underline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, name, type = 'text', placeholder, required
}: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div className="grid gap-1">
      <label className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="rounded-md bg-white px-3 py-2 ring-1 ring-line text-[14px]"
      />
    </div>
  );
}
