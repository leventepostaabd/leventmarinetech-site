import { createServiceSupabase } from '@/lib/supabase/server';
import { DEFAULT_SETTINGS, type CompanySettings } from '@/lib/billing';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const s = createServiceSupabase();
  let settings: CompanySettings = DEFAULT_SETTINGS;
  try {
    const { data } = await s.from('company_settings').select('*').eq('id', 1).single();
    if (data) settings = data as CompanySettings;
  } catch {
    /* not migrated yet */
  }
  return <SettingsClient initial={settings} />;
}
