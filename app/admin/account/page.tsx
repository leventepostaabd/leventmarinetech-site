import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';
import AccountClient from './AccountClient';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const service = createServiceSupabase();
  const { data: users } = await service
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at');

  return (
    <AccountClient
      meId={user?.id ?? ''}
      meEmail={user?.email ?? ''}
      users={(users ?? []) as { id: string; email: string | null; full_name: string | null; role: string; created_at: string }[]}
    />
  );
}
