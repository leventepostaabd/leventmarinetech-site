import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function Logout() {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  redirect('/');
}
