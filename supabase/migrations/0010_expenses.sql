-- =====================================================================
-- LEVENT MARINE — Expenses (run the books from our own panel for now)
-- Income lives in invoices/payments; this is the expense side so the owner
-- gets a real profit/loss without an external tool yet. Receipts go to the
-- private billing-docs bucket. Admin-only.
-- =====================================================================
create table if not exists expenses (
  id             uuid primary key default uuid_generate_v4(),
  spent_on       date not null default current_date,
  vendor         text,
  category       text not null default 'other',
  description    text,
  amount_usd     numeric(12,2) not null default 0,
  payment_method text,                       -- card | wire | ach | cash | other
  job_id         uuid references jobs(id) on delete set null,
  rebillable     boolean not null default false,
  receipt_path   text,                        -- storage path of the receipt scan/photo
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists expenses_date_idx on expenses (spent_on desc);
create index if not exists expenses_category_idx on expenses (category);

alter table expenses enable row level security;
drop policy if exists bill_admin_expenses on expenses;
create policy bill_admin_expenses on expenses for all
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
