-- =====================================================================
-- LEVENT MARINE — Invoice references + signed-document re-upload
-- Links an invoice to its evidence (quote + signed service report), tracks
-- the report's signing status, and stores the re-uploaded wet-signed scan
-- in a private storage bucket. See DOCUMENT-STANDARD.md §3-4.
-- =====================================================================
alter table invoices add column if not exists service_report_id uuid references service_reports(id) on delete set null;
alter table invoices add column if not exists emailed_at timestamptz;
alter table invoices add column if not exists emailed_to text;

-- Report signing lifecycle + the uploaded signed scan.
alter table service_reports add column if not exists signed_pdf_path text;  -- storage path of the wet-signed scan
alter table service_reports add column if not exists status text not null default 'draft'; -- draft | awaiting_signature | signed

-- Private bucket for re-uploaded signed documents (server-only access).
insert into storage.buckets (id, name, public) values ('billing-docs', 'billing-docs', false)
on conflict (id) do nothing;
