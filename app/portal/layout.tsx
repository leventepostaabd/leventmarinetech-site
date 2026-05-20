import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';

export const metadata: Metadata = { robots: { index: false }, title: 'Portal · Levent Marine' };

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/portal');

  return (
    <div className="container-x py-10 min-h-[calc(100dvh-var(--header-h))]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <div className="kicker">My portal</div>
          <h1 className="text-3xl mt-1">Welcome, <span className="text-amber-600">{user.email}</span></h1>
        </div>
        <nav className="flex flex-wrap gap-1 text-[13px] font-mono">
          <Link href="/portal"             className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">Overview</Link>
          <Link href="/portal/rfqs"        className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">My RFQs</Link>
          <Link href="/portal/service"     className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">My service jobs</Link>
          <Link href="/portal/vessels"     className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">My vessels</Link>
          <Link href="/admin/logout"       className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">Sign out</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
