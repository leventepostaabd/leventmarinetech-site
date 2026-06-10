import Link from 'next/link';
import { createServiceSupabase } from '@/lib/supabase/server';
import SignedReportUpload from './SignedReportUpload';
import ConfirmDeleteButton from '../ConfirmDeleteButton';
import { deleteServiceReport } from '../_actions';

export const dynamic = 'force-dynamic';

export default async function ServiceReportsPage() {
  const s = createServiceSupabase();
  let rows: any[] = [];
  try {
    const { data } = await s
      .from('service_reports')
      .select('id, number, attended_on, port, created_at, status, signed_pdf_path, companies(name), vessels(name, imo_no)')
      .order('created_at', { ascending: false })
      .limit(100);
    rows = data ?? [];
  } catch {
    /* not migrated */
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="kicker">Evrak & Finans</div>
          <h2 className="text-[20px] mt-0.5">Servis / Attendance Raporları</h2>
          <p className="text-[12.5px] text-ink-muted mt-0.5">Gemide CE/Master imzalı + kaşeli rapor — faturanın dayanağı.</p>
        </div>
        <Link href="/admin/billing/service-reports/new" className="btn-accent btn-sm no-underline">+ Yeni rapor</Link>
      </div>
      {rows.length === 0 ? (
        <p className="text-[13px] text-ink-muted">Henüz rapor yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-line">
          <table className="w-full min-w-[680px] text-[13px]">
            <thead className="bg-navy-50/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-ink-subtle">
              <tr><th className="px-3 py-2">No</th><th className="px-3 py-2">Gemi / Müşteri</th><th className="px-3 py-2">Liman</th><th className="px-3 py-2">Durum</th><th className="px-3 py-2 text-right">İşlemler</th></tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-navy-50/40">
                  <td className="px-3 py-2 font-mono">{r.number}</td>
                  <td className="px-3 py-2">
                    <div className="text-ink">{r.vessels?.name ?? '—'}{r.vessels?.imo_no ? ` · IMO ${r.vessels.imo_no}` : ''}</div>
                    <div className="text-[11.5px] text-ink-subtle">{r.companies?.name ?? '—'}</div>
                  </td>
                  <td className="px-3 py-2">{r.port ?? '—'}</td>
                  <td className="px-3 py-2">
                    {r.signed_pdf_path ? (
                      <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 font-mono text-[10.5px] uppercase text-green-700">İmzalı ✓</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 font-mono text-[10.5px] uppercase text-amber-700">İmza bekliyor</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap justify-end gap-1">
                      <a href={`/api/admin/billing/service-reports/${r.id}/pdf`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm no-underline">PDF (yazdır)</a>
                      <SignedReportUpload id={r.id} signed={!!r.signed_pdf_path} />
                      <ConfirmDeleteButton
                        id={r.id}
                        action={deleteServiceReport}
                        heading="Servis raporunu sil"
                        details={[
                          { k: 'No', v: r.number },
                          { k: 'Gemi', v: r.vessels?.name ?? '—' },
                          { k: 'Müşteri', v: r.companies?.name ?? '—' }
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
