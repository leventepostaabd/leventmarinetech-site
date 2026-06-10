import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';
import AdminShell from './AdminShell';

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
          <h1 className="text-2xl mb-2">Admin erişimi gerekli</h1>
          <p className="text-ink-muted mb-3">
            Hesabınız mevcut ama admin olarak işaretli değil. Sistem sahibinden Supabase&apos;deki profil satırınızda{' '}
            <span className="font-mono">role = &apos;admin&apos;</span> ayarlamasını isteyin.
          </p>
          <a href="/" className="btn-primary btn-md">Siteye dön</a>
        </div>
      </div>
    );
  }

  return <AdminShell email={user.email ?? ''}>{children}</AdminShell>;
}
