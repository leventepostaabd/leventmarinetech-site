import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';
import ServiceReportDocument from '@/components/pdf/ServiceReportDocument';
import type { ServiceReportData, CompanySettings, TestRow } from '@/lib/billing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function isAdmin(): Promise<boolean> {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const service = createServiceSupabase();
  const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single();
  return profile?.role === 'admin';
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return new NextResponse('Forbidden', { status: 403 });

  const s = createServiceSupabase();
  const { data: r, error } = await s
    .from('service_reports')
    .select('*, companies(name), vessels(name, imo_no, flag)')
    .eq('id', params.id)
    .single();
  if (error || !r) return new NextResponse('Not found', { status: 404 });

  const { data: settings } = await s.from('company_settings').select('*').eq('id', 1).single();

  const data: ServiceReportData = {
    number: r.number,
    attended_on: r.attended_on,
    created_at: r.created_at,
    port: r.port,
    po_reference: r.po_reference,
    class_format: r.class_format,
    findings: r.findings,
    work_performed: r.work_performed,
    parts_used: r.parts_used,
    outstanding: r.outstanding,
    engineer_name: r.engineer_name,
    ce_name: r.ce_name,
    ce_rank: r.ce_rank,
    test_results: Array.isArray(r.test_results) ? (r.test_results as TestRow[]) : [],
    company: r.companies ?? null,
    vessel: r.vessels ?? null
  };

  const buffer = await renderToBuffer(<ServiceReportDocument data={data} seller={(settings as CompanySettings) ?? undefined} />);
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${r.number}.pdf"`,
      'Cache-Control': 'no-store'
    }
  });
}
