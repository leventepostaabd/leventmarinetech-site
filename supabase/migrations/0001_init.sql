-- =====================================================================
-- LEVENT MARINE PLATFORM — initial schema
-- Run against your Supabase project in order. Postgres 15+.
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================
-- ENUMS
-- =====================================================================
create type rfq_kind        as enum ('supply', 'equivalent', 'unlisted');
create type rfq_status      as enum (
  'new', 'reviewing', 'supplier_checking', 'quoted',
  'waiting_approval', 'ordered', 'delivered', 'closed', 'cancelled'
);
create type service_status  as enum (
  'new', 'reviewing', 'scheduled', 'on_attendance',
  'reporting', 'closed', 'cancelled'
);
create type urgency_level   as enum ('aog', 'urgent', 'planned');
create type availability    as enum ('in-stock', 'available-supplier', 'rfq-required');
create type user_role       as enum ('admin', 'company', 'class', 'guest');
create type delivery_mode   as enum ('vessel', 'agent', 'hotel_crew', 'warehouse_consolidate', 'repack_reissue', 'local_urgent');

-- =====================================================================
-- PRODUCTS (catalog)
-- Public-readable, admin-writable. No prices stored here.
-- =====================================================================
create table if not exists products (
  id                      text primary key,
  slug                    text not null unique,
  name                    text not null,
  brand                   text,
  part_number             text,
  category                text not null,
  short_description       text,
  long_description        text,
  specs                   jsonb default '{}'::jsonb,
  applications            text[] default '{}',
  compatible_systems      text[] default '{}',
  availability            availability default 'rfq-required',
  delivery_estimate       text,
  datasheet_url           text,
  image_url               text,
  image_hint              text,
  tags                    text[] default '{}',
  disclaimer              text default 'Final compatibility must be confirmed by maker/model/nameplate and vessel technical team.',
  published               boolean default true,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

create index if not exists products_category_idx on products (category) where published = true;
create index if not exists products_brand_idx    on products (brand)    where published = true;
create index if not exists products_search_idx   on products using gin (
  to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(brand,'') || ' ' || coalesce(part_number,'') || ' ' || coalesce(short_description,''))
);

-- Cross-reference / alternative parts
create table if not exists product_alternatives (
  id                   uuid primary key default uuid_generate_v4(),
  product_id           text not null references products(id) on delete cascade,
  alt_brand            text,
  alt_part_number      text not null,
  compatibility_note   text,
  created_at           timestamptz default now()
);
create index if not exists product_alternatives_product_idx on product_alternatives (product_id);

-- =====================================================================
-- RFQ REQUESTS (supply, equivalent, unlisted)
-- =====================================================================
create table if not exists rfq_requests (
  id                  uuid primary key default uuid_generate_v4(),
  kind                rfq_kind not null,
  status              rfq_status default 'new',

  -- product reference (nullable for unlisted/equivalent)
  product_id          text references products(id) on delete set null,

  -- request data (denormalized for unlisted/equivalent where product_id is null)
  brand               text,
  part_number         text,
  alternative_for     text,   -- original part the customer wants equivalent of
  equipment_type      text,
  description         text,
  quantity            integer default 1,
  specifications      jsonb default '{}'::jsonb,

  -- vessel & logistics
  vessel_name         text,
  imo_number          text,
  vessel_type         text,
  current_port        text,
  next_port           text,
  eta                 timestamptz,
  delivery_mode       delivery_mode default 'vessel',
  required_by         date,
  urgency             urgency_level default 'planned',

  -- customer
  contact_name        text,
  contact_email       text,
  contact_phone       text,
  contact_whatsapp    text,
  company             text,

  -- uploads (jsonb of storage paths)
  attachments         jsonb default '[]'::jsonb,

  -- internal (hidden from customer)
  internal_notes      text,
  draft_quote         text,

  source              text default 'web',
  meta                jsonb default '{}'::jsonb,

  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
create index if not exists rfq_requests_status_idx     on rfq_requests (status);
create index if not exists rfq_requests_urgency_idx    on rfq_requests (urgency);
create index if not exists rfq_requests_kind_idx       on rfq_requests (kind);
create index if not exists rfq_requests_created_at_idx on rfq_requests (created_at desc);

-- =====================================================================
-- SERVICE REQUESTS (attendance / repair)
-- =====================================================================
create table if not exists service_requests (
  id                  uuid primary key default uuid_generate_v4(),
  status              service_status default 'new',
  problem_category    text,
  symptoms            text[] default '{}',
  notes               text,

  vessel_name         text,
  imo_number          text,
  vessel_type         text,
  class_society       text,
  port                text,
  eta                 timestamptz,

  urgency             urgency_level default 'planned',
  contact_name        text,
  contact_email       text,
  contact_phone       text,
  contact_whatsapp    text,
  company             text,

  attachments         jsonb default '[]'::jsonb,
  internal_notes      text,
  source              text default 'web',
  meta                jsonb default '{}'::jsonb,

  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
create index if not exists service_requests_status_idx     on service_requests (status);
create index if not exists service_requests_urgency_idx    on service_requests (urgency);
create index if not exists service_requests_created_at_idx on service_requests (created_at desc);

-- =====================================================================
-- SUPPLIER SOURCES (internal — strict admin-only, never customer-facing)
-- =====================================================================
create table if not exists supplier_sources (
  id                  uuid primary key default uuid_generate_v4(),
  rfq_id              uuid references rfq_requests(id) on delete cascade,
  product_id          text references products(id)    on delete set null,
  supplier_name       text not null,
  supplier_url        text,
  supplier_part_number text,
  supplier_price      numeric(12,2),
  currency            text default 'USD',
  availability        text,
  lead_time_days      integer,
  last_checked        timestamptz default now(),
  internal_notes      text,
  created_at          timestamptz default now()
);
create index if not exists supplier_sources_rfq_idx on supplier_sources (rfq_id);

-- =====================================================================
-- USER PROFILES (for portal)
-- =====================================================================
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text unique,
  full_name    text,
  company      text,
  role         user_role default 'guest',
  vessels      jsonb default '[]'::jsonb,  -- [{name, imo, class, flag}]
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- ROW-LEVEL SECURITY
-- =====================================================================
alter table products             enable row level security;
alter table product_alternatives enable row level security;
alter table rfq_requests         enable row level security;
alter table service_requests     enable row level security;
alter table supplier_sources     enable row level security;
alter table profiles             enable row level security;

-- Products: public read for published, admin write
drop policy if exists "products public read" on products;
create policy "products public read" on products
  for select using (published = true);

drop policy if exists "products admin write" on products;
create policy "products admin write" on products
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

drop policy if exists "alts public read" on product_alternatives;
create policy "alts public read" on product_alternatives for select using (true);

drop policy if exists "alts admin write" on product_alternatives;
create policy "alts admin write" on product_alternatives
  for all using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

-- RFQ requests: anyone can insert (form submission). Read = own or admin.
drop policy if exists "rfq insert public" on rfq_requests;
create policy "rfq insert public" on rfq_requests for insert with check (true);

drop policy if exists "rfq read own or admin" on rfq_requests;
create policy "rfq read own or admin" on rfq_requests for select using (
  contact_email = auth.jwt() ->> 'email'
  or exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

drop policy if exists "rfq admin write" on rfq_requests;
create policy "rfq admin write" on rfq_requests for update using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Service requests: same pattern
drop policy if exists "service insert public" on service_requests;
create policy "service insert public" on service_requests for insert with check (true);

drop policy if exists "service read own or admin" on service_requests;
create policy "service read own or admin" on service_requests for select using (
  contact_email = auth.jwt() ->> 'email'
  or exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

drop policy if exists "service admin write" on service_requests;
create policy "service admin write" on service_requests for update using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Supplier sources: admin only (NEVER customer-readable)
drop policy if exists "supplier admin only" on supplier_sources;
create policy "supplier admin only" on supplier_sources for all using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Profiles: each user reads/updates own; admin reads all
drop policy if exists "profile self read" on profiles;
create policy "profile self read" on profiles for select using (
  id = auth.uid()
  or exists (select 1 from profiles p2 where p2.id = auth.uid() and p2.role = 'admin')
);

drop policy if exists "profile self write" on profiles;
create policy "profile self write" on profiles for update using (id = auth.uid());

-- =====================================================================
-- TRIGGERS for updated_at
-- =====================================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists products_touch on products;
create trigger products_touch before update on products
  for each row execute function public.touch_updated_at();

drop trigger if exists rfq_touch on rfq_requests;
create trigger rfq_touch before update on rfq_requests
  for each row execute function public.touch_updated_at();

drop trigger if exists service_touch on service_requests;
create trigger service_touch before update on service_requests
  for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch on profiles;
create trigger profiles_touch before update on profiles
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- STORAGE BUCKETS (run manually in dashboard or via API)
-- 1) public 'product-images'  — for catalog images
-- 2) private 'attachments'    — for RFQ/service uploads (photos, datasheets)
-- 3) private 'reports'        — for vessel test reports (customer portal)
-- =====================================================================
