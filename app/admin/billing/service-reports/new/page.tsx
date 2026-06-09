import { createServiceSupabase } from '@/lib/supabase/server';
import ServiceReportBuilderClient from '../ServiceReportBuilderClient';

export const dynamic = 'force-dynamic';

export default async function NewServiceReportPage() {
  const s = createServiceSupabase();
  let companies: { id: string; name: string }[] = [];
  let vessels: { id: string; name: string; imo_no: string | null; company_id: string | null }[] = [];
  try {
    const [c, v] = await Promise.all([
      s.from('companies').select('id, name').order('name'),
      s.from('vessels').select('id, name, imo_no, company_id').order('name')
    ]);
    companies = (c.data ?? []) as typeof companies;
    vessels = (v.data ?? []) as typeof vessels;
  } catch {
    /* not migrated */
  }
  return <ServiceReportBuilderClient companies={companies} vessels={vessels} />;
}
