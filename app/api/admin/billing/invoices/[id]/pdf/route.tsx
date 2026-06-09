import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';
import InvoiceDocument, { type InvoicePdfData } from '@/components/pdf/InvoiceDocument';
import type { LineKind, CompanySettings } from '@/lib/billing';

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
  const { data: inv, error } = await s
    .from('invoices')
    .select('*, companies(name, billing_address), vessels(name, imo_no)')
    .eq('id', params.id)
    .single();
  if (error || !inv) return new NextResponse('Not found', { status: 404 });

  const { data: lines } = await s
    .from('invoice_lines')
    .select('kind, description, qty, unit_price_usd, line_total')
    .eq('invoice_id', params.id)
    .order('sort_order');

  const data: InvoicePdfData = {
    number: inv.number,
    type: inv.type,
    created_at: inv.created_at,
    issue_date: inv.issue_date,
    due_date: inv.due_date,
    currency: inv.currency ?? 'USD',
    incoterm: inv.incoterm,
    po_reference: inv.po_reference,
    notes: inv.notes,
    subtotal: Number(inv.subtotal ?? 0),
    tax: Number(inv.tax ?? 0),
    total: Number(inv.total ?? 0),
    amount_paid: Number(inv.amount_paid ?? 0),
    company: inv.companies ?? null,
    vessel: inv.vessels ?? null,
    lines: (lines ?? []).map((l) => ({
      kind: l.kind as LineKind,
      description: l.description,
      qty: Number(l.qty),
      unit_price_usd: Number(l.unit_price_usd),
      line_total: Number(l.line_total)
    }))
  };

  const buffer = await renderToBuffer(<InvoiceDocument data={data} />);
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${inv.number}.pdf"`,
      'Cache-Control': 'no-store'
    }
  });
}
