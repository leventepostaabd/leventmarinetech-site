-- =====================================================================
-- LEVENT MARINE — Billing settings (single-row company/seller config)
-- Holds seller identity, bank/remittance details, EIN and the default
-- quote/invoice terms shown on PDFs. Kept in the DB (NOT in git) so bank
-- details / EIN never land in the public repo. Admin-only.
-- =====================================================================
create table if not exists company_settings (
  id                    int primary key default 1 check (id = 1),
  legal_name            text,
  address               text,
  ein                   text,
  email                 text,
  phone                 text,
  website               text,
  bank_beneficiary      text,
  bank_name             text,
  bank_account          text,
  bank_routing          text,
  bank_swift            text,
  bank_address          text,
  default_payment_terms text default 'Net 30',
  default_incoterm      text,
  quote_terms           text,
  invoice_terms         text,
  updated_at            timestamptz not null default now()
);

insert into company_settings (id, legal_name, address, email, phone, website,
  bank_beneficiary, default_payment_terms,
  quote_terms, invoice_terms)
values (1,
  'Levent Marine Electro Technical Services LLC',
  '32 N Gould St, Sheridan, WY 82801, USA',
  'info@leventmarinetech.com',
  '+1 619 384 04 03',
  'www.leventmarinetech.com',
  'Levent Marine Electro Technical Services LLC',
  'Net 30',
  'This quotation is valid until the date shown above. Prices are in USD and exclude freight, duties and taxes unless stated. Availability and price are confirmed on receipt of a written purchase order. Work and parts are supplied subject to our standard terms of business.',
  'Payment is due within the stated terms by bank wire in USD; please quote the invoice number on your transfer. Title to all goods remains with the seller until payment is received in full. Overdue balances accrue interest at 1.5% per month. Any claim relating to the work or goods must be raised in writing within 7 days of delivery. This invoice is governed by the laws of the State of Wyoming, USA.'
)
on conflict (id) do nothing;

alter table company_settings enable row level security;
drop policy if exists bill_admin_company_settings on company_settings;
create policy bill_admin_company_settings on company_settings for all
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
