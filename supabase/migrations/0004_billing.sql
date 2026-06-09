-- =====================================================================
-- LEVENT MARINE — Billing / Documents module (Admin "Evrak & Finans")
-- Quote → Proforma → Job → Service report → Invoice → Payment, plus a
-- price book, per-job cost capture, gapless document numbering and an
-- audit log. Hybrid accounting: documents live here, money exports to
-- QuickBooks via CSV. USD-primary, internationally-ready.
--
-- Architecture: see ADMIN-BILLING-SPEC.md + DECISIONS.md (Billing module).
-- Reuses companies (= customer) and vessels (IMO) from 0002_crm.
-- RLS: admin-only via profiles.role = 'admin' (same pattern as 0002).
-- Server writes use SUPABASE_SERVICE_ROLE_KEY and bypass RLS.
-- =====================================================================

create extension if not exists "uuid-ossp";

-- =====================================================================
-- ENUMS
-- =====================================================================
do $$ begin create type doc_line_kind as enum ('service','labour','part','freight','consumable'); exception when duplicate_object then null; end $$;
do $$ begin create type quote_status as enum ('draft','sent','accepted','declined','expired'); exception when duplicate_object then null; end $$;
do $$ begin create type job_status as enum ('scheduled','in_progress','completed','cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type invoice_status as enum ('draft','sent','partial','paid','overdue','void'); exception when duplicate_object then null; end $$;
do $$ begin create type invoice_type as enum ('full','deposit','progress','final'); exception when duplicate_object then null; end $$;
do $$ begin create type payment_method as enum ('ach','wire','card','other'); exception when duplicate_object then null; end $$;
do $$ begin create type job_cost_kind as enum ('parts','labour','travel','other'); exception when duplicate_object then null; end $$;

-- =====================================================================
-- EXTEND existing companies / vessels with billing fields
-- =====================================================================
alter table companies add column if not exists tax_id                text;
alter table companies add column if not exists billing_address       text;
alter table companies add column if not exists default_payment_terms text default 'Net 30';
alter table companies add column if not exists default_incoterm       text;
alter table companies add column if not exists w9_on_file            boolean not null default false;

alter table vessels add column if not exists class_society             text;          -- DNV/ABS/BV/LR/ClassNK/...
alter table vessels add column if not exists in_foreign_commerce       boolean not null default true; -- FL 12A-1.0641 lever
alter table vessels add column if not exists mileage_factor            numeric(5,4);  -- FL apportionment ratio (CPA-confirmed)
alter table vessels add column if not exists exemption_affidavit_path  text;          -- signed owner affidavit (Supabase Storage)

-- =====================================================================
-- DOCUMENT NUMBERING — gapless, concurrency-safe (Postgres, not app code)
-- =====================================================================
create table if not exists document_sequences (
  doc_type   text not null,          -- 'QT' | 'PF' | 'JOB' | 'SR' | 'INV'
  year       int  not null,
  last_value int  not null default 1000,
  primary key (doc_type, year)
);

create or replace function next_doc_number(p_type text, p_year int)
returns int
language plpgsql
as $$
declare v int;
begin
  insert into document_sequences (doc_type, year, last_value)
    values (p_type, p_year, 1001)
  on conflict (doc_type, year)
    do update set last_value = document_sequences.last_value + 1
  returning last_value into v;
  return v;
end $$;

-- =====================================================================
-- PRICE BOOK — reusable line items (the engine for fast "one-click" entry)
-- =====================================================================
create table if not exists price_book_items (
  id                uuid primary key default uuid_generate_v4(),
  kind              doc_line_kind not null default 'service',
  code              text,
  name_en           text not null,
  name_tr           text,
  default_price_usd numeric(12,2),
  default_cost_usd  numeric(12,2),     -- admin-only (never customer-facing, F4)
  unit              text default 'ea',
  taxable           boolean not null default true,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists pbi_kind_idx on price_book_items (kind);
create index if not exists pbi_name_idx on price_book_items (lower(name_en));

-- =====================================================================
-- QUOTES + LINES
-- =====================================================================
create table if not exists quotes (
  id            uuid primary key default uuid_generate_v4(),
  number        text not null,                 -- 'QT-2026-1001'
  revision      int  not null default 1,        -- R1, R2...
  company_id    uuid references companies(id) on delete set null,
  vessel_id     uuid references vessels(id)   on delete set null,
  po_reference  text,
  status        quote_status not null default 'draft',
  lost_reason   text,
  currency      text not null default 'USD',
  incoterm      text,
  valid_until   date,
  deposit_pct   numeric(5,2),
  subtotal      numeric(12,2) not null default 0,
  tax           numeric(12,2) not null default 0,
  total         numeric(12,2) not null default 0,
  notes         text,
  accepted_at   timestamptz,
  accepted_by   text,
  signature_ref text,
  pdf_path      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists quotes_status_idx  on quotes (status);
create index if not exists quotes_company_idx on quotes (company_id);
create index if not exists quotes_created_idx on quotes (created_at desc);

create table if not exists quote_lines (
  id             uuid primary key default uuid_generate_v4(),
  quote_id       uuid not null references quotes(id) on delete cascade,
  item_id        uuid references price_book_items(id) on delete set null,
  kind           doc_line_kind not null default 'service',
  description    text not null,
  qty            numeric(12,2) not null default 1,
  unit_price_usd numeric(12,2) not null default 0,
  cost_usd       numeric(12,2),                 -- admin-only
  line_total     numeric(12,2) not null default 0,
  is_optional    boolean not null default false,
  sort_order     int not null default 0
);
create index if not exists quote_lines_quote_idx on quote_lines (quote_id);

-- =====================================================================
-- JOBS + per-job COSTS (true gross margin)
-- =====================================================================
create table if not exists jobs (
  id             uuid primary key default uuid_generate_v4(),
  number         text not null,                 -- 'JOB-2026-1001'
  quote_id       uuid references quotes(id) on delete set null,
  company_id     uuid references companies(id) on delete set null,
  vessel_id      uuid references vessels(id) on delete set null,
  port           text,
  service_system text,                           -- 1-20 taxonomy slug
  status         job_status not null default 'scheduled',
  is_aog         boolean not null default false,
  dispatched_at  timestamptz,
  completed_at   timestamptz,
  summary        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists jobs_status_idx  on jobs (status);
create index if not exists jobs_company_idx on jobs (company_id);

create table if not exists job_costs (
  id          uuid primary key default uuid_generate_v4(),
  job_id      uuid not null references jobs(id) on delete cascade,
  kind        job_cost_kind not null default 'other',
  description text,
  amount_usd  numeric(12,2) not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists job_costs_job_idx on job_costs (job_id);

-- =====================================================================
-- INVOICES + LINES + PAYMENTS
-- =====================================================================
create table if not exists invoices (
  id           uuid primary key default uuid_generate_v4(),
  number       text not null,                  -- 'INV-2026-1001'
  type         invoice_type not null default 'full',
  progress_pct numeric(5,2),
  quote_id     uuid references quotes(id) on delete set null,
  job_id       uuid references jobs(id)   on delete set null,
  company_id   uuid references companies(id) on delete set null,
  vessel_id    uuid references vessels(id)   on delete set null,
  po_reference text,
  status       invoice_status not null default 'draft',
  currency     text not null default 'USD',
  incoterm     text,
  subtotal     numeric(12,2) not null default 0,
  tax          numeric(12,2) not null default 0,
  total        numeric(12,2) not null default 0,
  amount_paid  numeric(12,2) not null default 0,
  issue_date   date not null default current_date,
  due_date     date,
  notes        text,
  sent_at      timestamptz,
  pdf_path     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists invoices_status_idx  on invoices (status);
create index if not exists invoices_company_idx on invoices (company_id);
create index if not exists invoices_due_idx     on invoices (due_date);

create table if not exists invoice_lines (
  id             uuid primary key default uuid_generate_v4(),
  invoice_id     uuid not null references invoices(id) on delete cascade,
  item_id        uuid references price_book_items(id) on delete set null,
  kind           doc_line_kind not null default 'service',
  description    text not null,
  qty            numeric(12,2) not null default 1,
  unit_price_usd numeric(12,2) not null default 0,
  cost_usd       numeric(12,2),                 -- admin-only
  line_total     numeric(12,2) not null default 0,
  sort_order     int not null default 0
);
create index if not exists invoice_lines_invoice_idx on invoice_lines (invoice_id);

create table if not exists payments (
  id          uuid primary key default uuid_generate_v4(),
  invoice_id  uuid not null references invoices(id) on delete cascade,
  amount_usd  numeric(12,2) not null,
  method      payment_method not null default 'wire',
  received_at date not null default current_date,
  reference   text,
  created_at  timestamptz not null default now()
);
create index if not exists payments_invoice_idx on payments (invoice_id);

-- =====================================================================
-- SERVICE REPORTS (marine differentiator: photos + dual signature)
-- =====================================================================
create table if not exists service_reports (
  id              uuid primary key default uuid_generate_v4(),
  number          text not null,               -- 'SR-2026-1001'
  job_id          uuid references jobs(id) on delete set null,
  company_id      uuid references companies(id) on delete set null,
  vessel_id       uuid references vessels(id) on delete set null,
  po_reference    text,
  port            text,
  attended_on     date,
  findings        text,
  work_performed  text,
  parts_used      text,
  test_results    jsonb not null default '[]'::jsonb,  -- [{point,value,unit,threshold,instrument,cal_due}]
  class_format    text,                         -- DNV/ABS/BV/LR/ClassNK/...
  engineer_sign_ref text,
  vessel_sign_ref text,                         -- Chief Engineer onboard
  pdf_path        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists service_reports_job_idx on service_reports (job_id);

create table if not exists service_report_photos (
  id                uuid primary key default uuid_generate_v4(),
  service_report_id uuid not null references service_reports(id) on delete cascade,
  storage_path      text not null,
  caption           text,
  created_at        timestamptz not null default now()
);
create index if not exists srp_report_idx on service_report_photos (service_report_id);

-- =====================================================================
-- AUDIT LOG — immutable trail (money + class societies need traceability)
-- =====================================================================
create table if not exists audit_log (
  id         uuid primary key default uuid_generate_v4(),
  entity     text not null,
  entity_id  uuid,
  action     text not null,
  actor      text,
  diff_json  jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_entity_idx on audit_log (entity, entity_id);

-- =====================================================================
-- ROW LEVEL SECURITY — admin-only (mirrors 0002_crm)
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'price_book_items','quotes','quote_lines','jobs','job_costs',
    'invoices','invoice_lines','payments','service_reports',
    'service_report_photos','document_sequences','audit_log'
  ] loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists bill_admin_%1$s on %1$s;', t);
    execute format(
      'create policy bill_admin_%1$s on %1$s for all '
      'using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = ''admin'')) '
      'with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = ''admin''));',
      t
    );
  end loop;
end $$;
