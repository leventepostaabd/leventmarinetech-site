import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';

export const metadata: Metadata = { robots: { index: false, follow: false }, title: 'Admin · Levent Marine' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/admin');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const role = profile?.role as string | undefined;

  if (role !== 'admin') {
    return (
      <div className="container-x py-20">
        <div className="card border-l-4 border-l-red-600 max-w-xl">
          <h1 className="text-2xl mb-2">Admin access required</h1>
          <p className="text-ink-muted mb-3">Your account exists but isn't marked admin. Ask the system owner to set <span className="font-mono">role = 'admin'</span> on your profile row in Supabase.</p>
          <a href="/" className="btn-primary btn-md">Back to site</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 min-h-[calc(100dvh-var(--header-h))]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <div className="kicker">Admin</div>
          <h1 className="text-3xl mt-1">Operations dashboard</h1>
        </div>
        <nav className="flex flex-wrap gap-1 text-[13px] font-mono">
          <Link href="/admin"           className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">Overview</Link>
          <Link href="/admin/rfqs"      className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">RFQs</Link>
          <Link href="/admin/service"   className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">Service</Link>
          <Link href="/admin/products"  className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">Products</Link>
          <Link href="/admin/logout"    className="px-3 py-1.5 rounded-md hover:bg-navy-50 no-underline">Sign out</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
