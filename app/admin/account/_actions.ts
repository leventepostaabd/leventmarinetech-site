'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const service = createServiceSupabase();
  const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Not admin');
  return { user, supabase };
}

/** Change the currently signed-in admin's own password. */
export async function changeOwnPassword(newPassword: string) {
  const { supabase } = await requireAdmin();
  if (!newPassword || newPassword.length < 8) throw new Error('Şifre en az 8 karakter olmalı');
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

/** Create a new panel user with an initial password + role (admin/guest). */
export async function createUser(input: { email: string; password: string; full_name?: string; role: 'admin' | 'guest' }) {
  await requireAdmin();
  const email = input.email.trim().toLowerCase();
  if (!/.+@.+\..+/.test(email)) throw new Error('Geçerli bir e-posta girin');
  if (!input.password || input.password.length < 8) throw new Error('Şifre en az 8 karakter olmalı');

  const service = createServiceSupabase();
  const { data, error } = await service.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true // no confirmation email needed — admin sets it
  });
  if (error) throw new Error(error.message);

  // The handle_new_user trigger inserts the profile row; set its role/name.
  const { error: pErr } = await service
    .from('profiles')
    .update({ role: input.role, full_name: input.full_name?.trim() || null, email })
    .eq('id', data.user!.id);
  if (pErr) throw new Error(pErr.message);

  revalidatePath('/admin/account');
}

export async function setUserRole(userId: string, role: 'admin' | 'guest') {
  const { user } = await requireAdmin();
  if (userId === user.id && role !== 'admin') throw new Error('Kendi admin rolünüzü kaldıramazsınız');
  const service = createServiceSupabase();
  const { error } = await service.from('profiles').update({ role }).eq('id', userId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/account');
}

export async function setUserPassword(userId: string, newPassword: string) {
  await requireAdmin();
  if (!newPassword || newPassword.length < 8) throw new Error('Şifre en az 8 karakter olmalı');
  const service = createServiceSupabase();
  const { error } = await service.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) throw new Error(error.message);
}

export async function deleteUser(userId: string) {
  const { user } = await requireAdmin();
  if (userId === user.id) throw new Error('Kendinizi silemezsiniz');
  const service = createServiceSupabase();
  const { error } = await service.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/account');
}
