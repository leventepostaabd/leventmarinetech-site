import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { attachmentSignedUrl } from '../../_actions';
import RfqDetailClient from './RfqDetailClient';

export const dynamic = 'force-dynamic';

export default async function AdminRfqDetail({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const { data: rfq } = await supabase
    .from('rfq_requests')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!rfq) notFound();

  // Pre-sign attachment URLs (1h) so admin can download files without
  // exposing the raw bucket path on the client. The list ships down to
  // the client component as part of the initial payload.
  const attachments: Array<{ name: string; path: string; url: string | null; size?: number }> =
    Array.isArray(rfq.attachments)
      ? await Promise.all(
          (rfq.attachments as Array<{ name: string; path: string; size?: number }>).map(async (a) => ({
            name: a.name,
            path: a.path,
            size: a.size,
            url: a.path && a.path !== '(upload-failed)' ? await attachmentSignedUrl(a.path) : null
          }))
        )
      : [];

  return (
    <div>
      <Link
        href={`/admin/rfqs${rfq.status === 'new' ? '?status=new' : ''}`}
        className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-amber-600 no-underline hover:text-amber"
      >
        ← Back to RFQs
      </Link>

      <RfqDetailClient rfq={rfq} attachments={attachments} />
    </div>
  );
}
