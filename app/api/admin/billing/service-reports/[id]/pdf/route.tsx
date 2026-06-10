import { NextResponse } from 'next/server';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';
import { renderServiceReportPdf } from '@/lib/pdf-render';

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
  const r = await renderServiceReportPdf(params.id);
  if (!r) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(r.buffer as unknown as BodyInit, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${r.number}.pdf"`, 'Cache-Control': 'no-store' }
  });
}
