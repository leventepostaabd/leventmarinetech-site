import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { attachmentSignedUrl } from '../../_actions';
import ServiceDetailClient from './ServiceDetailClient';

export const dynamic = 'force-dynamic';

export default async function AdminServiceDetail({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const { data: req } = await supabase
    .from('service_requests')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!req) notFound();

  const attachments: Array<{ name: string; path: string; url: string | null; size?: number }> =
    Array.isArray(req.attachments)
      ? await Promise.all(
          (req.attachments as Array<{ name: string; path: string; size?: number }>).map(async (a) => ({
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
        href={`/admin/service${req.status === 'new' ? '?status=new' : ''}`}
        className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-amber-600 no-underline hover:text-amber"
      >
        ← Back to service requests
      </Link>

      <ServiceDetailClient req={req} attachments={attachments} />
    </div>
  );
}
