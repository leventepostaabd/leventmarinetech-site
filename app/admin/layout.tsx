import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Admin · Levent Marine'
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/admin');

  // Use the service-role client to look up the profile row — the user-session
  // client occasionally gets blocked by RLS during the first SSR render after
  // a fresh login (the session cookie is set but Supabase hasn't propagated
  // auth.uid() to the row yet). auth.getUser() above already JWT-verified
  // the caller, so trusting user.id here is safe.
  const service = createServiceSupabase();
  const { data: profile } = await service
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  const role = profile?.role as string | undefined;

  if (role !== 'admin') {
    return (
      <div className="container-x py-20" style={{ paddingTop: 'calc(var(--lm-topbar-h, 56px) + 4rem)' }}>
        <div className="card border-l-4 border-l-red-600 max-w-xl">
          <h1 className="text-2xl mb-2">Admin access required</h1>
          <p className="text-ink-muted mb-3">
            Your account exists but isn&apos;t marked admin. Ask the system owner to set{' '}
            <span className="font-mono">role = &apos;admin&apos;</span> on your profile row in Supabase.
          </p>
          <a href="/" className="btn-primary btn-md">Back to site</a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-x"
      style={{
        paddingTop: 'calc(var(--lm-topbar-h, 56px) + 1.5rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 3rem)'
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-line">
        <div>
          <div className="kicker">Admin · {user.email}</div>
          <h1 className="text-2xl mt-1">Operations dashboard</h1>
        </div>
        <nav className="flex flex-wrap gap-1 text-[12.5px] font-mono">
          <NavLink href="/admin">Overview</NavLink>
          <NavLink href="/admin/rfqs">RFQs</NavLink>
          <NavLink href="/admin/service">Service</NavLink>
          <NavLink href="/admin/products">Products</NavLink>
          <Link
            href="/admin/logout"
            className="px-3 py-1.5 rounded-md text-ink-subtle hover:bg-navy-50 no-underline"
          >
            Sign out
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3 py-1.5 rounded-md text-ink hover:bg-navy-50 no-underline">
      {children}
    </Link>
  );
}
