import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';
import QuoteDocument, { type QuotePdfData } from '@/components/pdf/QuoteDocument';
import type { LineKind } from '@/lib/billing';

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
  const { data: q, error } = await s
    .from('quotes')
    .select('*, companies(name, billing_address), vessels(name, imo_no)')
    .eq('id', params.id)
    .single();
  if (error || !q) return new NextResponse('Not found', { status: 404 });

  const { data: lines } = await s
    .from('quote_lines')
    .select('kind, description, qty, unit_price_usd, line_total, is_optional')
    .eq('quote_id', params.id)
    .order('sort_order');

  const data: QuotePdfData = {
    number: q.number,
    revision: q.revision ?? 1,
    created_at: q.created_at,
    valid_until: q.valid_until,
    currency: q.currency ?? 'USD',
    incoterm: q.incoterm,
    po_reference: q.po_reference,
    notes: q.notes,
    subtotal: Number(q.subtotal ?? 0),
    tax: Number(q.tax ?? 0),
    total: Number(q.total ?? 0),
    company: q.companies ?? null,
    vessel: q.vessels ?? null,
    lines: (lines ?? []).map((l) => ({
      kind: l.kind as LineKind,
      description: l.description,
      qty: Number(l.qty),
      unit_price_usd: Number(l.unit_price_usd),
      line_total: Number(l.line_total),
      is_optional: l.is_optional ?? false
    }))
  };

  const buffer = await renderToBuffer(<QuoteDocument data={data} />);
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${q.number}.pdf"`,
      'Cache-Control': 'no-store'
    }
  });
}
