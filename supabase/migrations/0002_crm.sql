-- =====================================================================
-- LEVENT MARINE — CRM / Lead Pipeline (Wave 6 Phase 1)
-- Six tables for unified inbound (form submissions) + outbound (pipeline
-- generated) leads. RLS limits all access to admin users via profiles.role.
--
-- Architecture decisions: see DECISIONS.md Session 2 (C1-C8).
--   C2 single leads table, source field distinguishes inbound vs pipeline
--   C3 minimal stage values
--   C4 inbound_messages separate table (email/form/WA body + attachments)
--   C5 priority_reason jsonb (score components for re-scoring)
--   C6 assigned_to uuid FK to auth.users
-- =====================================================================

create extension if not exists "uuid-ossp";

-- =====================================================================
-- ENUMS
-- =====================================================================
do $$ begin
  create type lead_source as enum (
    'pipeline', 'service_wizard', 'supply_rfq', 'manual', 'email'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_track as enum ('service', 'supply');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_stage as enum (
    'new', 'contacted', 'replied', 'quoting', 'won', 'lost'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type inbound_channel as enum ('email', 'form', 'whatsapp');
exception when duplicate_object then null; end $$;

-- =====================================================================
-- COMPANIES — operator / DOC holder
-- =====================================================================
create table if not exists companies (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  country         text,             -- 'TR' is the priority filter for Phase 2
  imo_company_no  text,             -- IMO company / registered owner no
  website         text,
  contact_email   text,
  contact_phone   text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists companies_country_idx on companies (country);
create index if not exists companies_name_idx    on companies (lower(name));
create index if not exists companies_imo_idx     on companies (imo_company_no);

-- =====================================================================
-- VESSELS — keyed by IMO number
-- =====================================================================
create table if not exists vessels (
  id           uuid primary key default uuid_generate_v4(),
  company_id   uuid references companies(id) on delete set null,
  name         text not null,
  imo_no       text unique,          -- primary upsert key
  vessel_type  text,                  -- bulk carrier, tanker, container, ...
  year_built   int,
  flag         text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists vessels_company_idx on vessels (company_id);
create index if not exists vessels_imo_idx     on vessels (imo_no);
create index if not exists vessels_name_idx    on vessels (lower(name));

-- =====================================================================
-- LEADS — heart of the CRM. Inbound + outbound merged here.
-- =====================================================================
create table if not exists leads (
  id              uuid primary key default uuid_generate_v4(),
  company_id      uuid references companies(id) on delete set null,
  vessel_id       uuid references vessels(id)   on delete set null,
  source          lead_source not null,
  track           lead_track  not null,
  stage           lead_stage  not null default 'new',
  priority_score  int not null default 0,        -- 0-100
  priority_reason jsonb not null default '{}'::jsonb,  -- score components (C5)
  draft_message   text,
  assigned_to     uuid references auth.users(id) on delete set null,  -- C6
  -- Free-form quick context for inbound (port, system, urgency, etc.)
  context         jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists leads_stage_idx     on leads (stage);
create index if not exists leads_track_idx     on leads (track);
create index if not exists leads_source_idx    on leads (source);
create index if not exists leads_priority_idx  on leads (priority_score desc);
create index if not exists leads_created_idx   on leads (created_at desc);
create index if not exists leads_company_idx   on leads (company_id);
create index if not exists leads_vessel_idx    on leads (vessel_id);

-- =====================================================================
-- LEAD_NOTES — free-form notes attached to a lead
-- =====================================================================
create table if not exists lead_notes (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid not null references leads(id) on delete cascade,
  author      text,
  body        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists lead_notes_lead_idx on lead_notes (lead_id, created_at desc);

-- =====================================================================
-- LEAD_EVENTS — auto-timeline (stage change, message sent, rfq received)
-- =====================================================================
create table if not exists lead_events (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid not null references leads(id) on delete cascade,
  event_type  text not null,           -- 'stage_change' | 'message_sent' | 'rfq_received' | 'note_added' | ...
  detail      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists lead_events_lead_idx on lead_events (lead_id, created_at desc);

-- =====================================================================
-- INBOUND_MESSAGES — full email/form/WhatsApp bodies (C4)
-- Separate from leads because messages have a different lifecycle
-- and threading needs (one lead can accrue many messages).
-- =====================================================================
create table if not exists inbound_messages (
  id           uuid primary key default uuid_generate_v4(),
  lead_id      uuid references leads(id) on delete set null,
  channel      inbound_channel not null,
  subject      text,
  body         text,
  attachments  jsonb not null default '[]'::jsonb,
  received_at  timestamptz not null default now()
);
create index if not exists inbound_messages_lead_idx on inbound_messages (lead_id, received_at desc);
create index if not exists inbound_messages_channel_idx on inbound_messages (channel, received_at desc);

-- =====================================================================
-- updated_at triggers
-- =====================================================================
create or replace function crm_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_companies_updated_at on companies;
create trigger trg_companies_updated_at
  before update on companies
  for each row execute function crm_set_updated_at();

drop trigger if exists trg_vessels_updated_at on vessels;
create trigger trg_vessels_updated_at
  before update on vessels
  for each row execute function crm_set_updated_at();

drop trigger if exists trg_leads_updated_at on leads;
create trigger trg_leads_updated_at
  before update on leads
  for each row execute function crm_set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY — admin-only access for all CRM tables.
-- Reuses the existing `profiles.role = 'admin'` pattern from 0001.
-- Service-role / server-side writes from /api routes bypass RLS using
-- SUPABASE_SERVICE_ROLE_KEY (already configured in lib/supabase/server).
-- =====================================================================
alter table companies          enable row level security;
alter table vessels            enable row level security;
alter table leads              enable row level security;
alter table lead_notes         enable row level security;
alter table lead_events        enable row level security;
alter table inbound_messages   enable row level security;

drop policy if exists crm_admin_companies on companies;
create policy crm_admin_companies on companies for all
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  )
  with check (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

drop policy if exists crm_admin_vessels on vessels;
create policy crm_admin_vessels on vessels for all
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  )
  with check (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

drop policy if exists crm_admin_leads on leads;
create policy crm_admin_leads on leads for all
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  )
  with check (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

drop policy if exists crm_admin_lead_notes on lead_notes;
create policy crm_admin_lead_notes on lead_notes for all
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  )
  with check (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

drop policy if exists crm_admin_lead_events on lead_events;
create policy crm_admin_lead_events on lead_events for all
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  )
  with check (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

drop policy if exists crm_admin_inbound on inbound_messages;
create policy crm_admin_inbound on inbound_messages for all
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  )
  with check (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );
