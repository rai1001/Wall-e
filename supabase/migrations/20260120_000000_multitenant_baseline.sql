-- Sprint 0 baseline: multitenant Supabase schema with RLS helpers
create extension if not exists pgcrypto;

-- Drop legacy tables to guarantee a clean start
drop table if exists public.tasks cascade;
drop table if exists public.focus_sessions cascade;
drop table if exists public.parking cascade;
drop table if exists public.calendar_connections cascade;
drop table if exists public.calendar_calendars cascade;
drop table if exists public.calendar_events cascade;
drop table if exists public.calendar_event_mappings cascade;
drop table if exists public.calendar_sync_state cascade;
drop table if exists public.calendar_change_queue cascade;
drop table if exists public.assistant_suggestions cascade;

-- Tenancy helpers
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  billing_tier text not null default 'startup',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('owner','admin','manager','staff')) default 'staff',
  is_admin boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_members_org_user_idx
  on public.organization_members (organization_id, user_id);

create or replace function public.set_updated_at_column()
returns trigger language plpgsql volatile as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.current_org_id()
returns uuid language sql stable as $$
  select (nullif(current_setting('request.jwt.claims.organization_id', true), ''))::uuid;
$$;

create or replace function public.is_org_member(org_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.organization_members
    where organization_members.organization_id = org_id
      and organization_members.user_id = auth.uid()
  );
$$;

-- Calendar core
create table if not exists public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  provider text not null check (provider in ('google','microsoft','ical','supabase')),
  external_account text not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists calendar_connections_org_idx on public.calendar_connections (organization_id);

create table if not exists public.calendar_calendars (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  connection_id uuid not null references public.calendar_connections(id) on delete cascade,
  external_calendar_id text not null,
  display_name text not null,
  provider text not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists calendar_calendars_org_idx on public.calendar_calendars (organization_id);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  calendar_id uuid not null references public.calendar_calendars(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'confirmed',
  source text not null default 'internal',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists calendar_events_org_idx on public.calendar_events (organization_id, start_time);

create table if not exists public.calendar_event_mappings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.calendar_events(id) on delete cascade,
  provider text not null,
  provider_event_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists calendar_event_mapping_unique
  on public.calendar_event_mappings (provider, provider_event_id);

create table if not exists public.calendar_sync_state (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  calendar_id uuid not null references public.calendar_calendars(id) on delete cascade,
  provider text not null,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create unique index if not exists calendar_sync_state_unique on public.calendar_sync_state (organization_id, calendar_id);

create table if not exists public.calendar_change_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  calendar_id uuid not null references public.calendar_calendars(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  action text not null check (action in ('create','update','delete')),
  payload jsonb not null,
  status text not null default 'pending',
  idempotency_key text,
  enqueued_at timestamptz not null default now()
);

create unique index if not exists calendar_change_queue_idempotency
  on public.calendar_change_queue (organization_id, idempotency_key)
  where idempotency_key is not null;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  title text not null,
  type text not null check (type in ('work','home','pet','personal')),
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','paused','done')),
  est_minutes int,
  energy text check (energy in ('low','medium','high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  task_id uuid not null references public.tasks(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  outcome text check (outcome in ('done','paused','stuck'))
);

create table if not exists public.parking (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.plan_assistant_suggestions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan_id uuid not null,
  suggestion text not null,
  status text not null default 'proposed',
  prompt text,
  metadata jsonb not null default '{}'::jsonb,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

-- Triggers
create trigger organizations_set_updated_at
  before update on public.organizations
  for each row
  execute procedure public.set_updated_at_column();

create trigger calendar_events_set_updated_at
  before update on public.calendar_events
  for each row
  execute procedure public.set_updated_at_column();

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row
  execute procedure public.set_updated_at_column();

-- Enable RLS
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.calendar_connections enable row level security;
alter table public.calendar_calendars enable row level security;
alter table public.calendar_events enable row level security;
alter table public.calendar_event_mappings enable row level security;
alter table public.calendar_sync_state enable row level security;
alter table public.calendar_change_queue enable row level security;
alter table public.tasks enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.parking enable row level security;
alter table public.plan_assistant_suggestions enable row level security;

-- Policies
create policy "organizations_member_select"
  on public.organizations
  for select
  using (
    public.is_org_member(id)
  );

create policy "organization_members_self"
  on public.organization_members
  for select using (organization_id = public.current_org_id());

create policy "organization_members_insert"
  on public.organization_members
  for insert
  with check (
    organization_id = public.current_org_id()
      and public.is_org_member(organization_id)
  );

create policy "organization_members_update"
  on public.organization_members
  for update
  using (
    organization_id = public.current_org_id()
  )
  with check (
    organization_id = public.current_org_id()
  );

create policy "tenant_tables_select"
  on public.calendar_connections
  for select
  using (
    organization_id = public.current_org_id()
  );

create policy "tenant_tables_insert"
  on public.calendar_connections
  for insert
  with check (
    organization_id = public.current_org_id()
  );

create policy "tenant_tables_update"
  on public.calendar_connections
  for update
  using (
    organization_id = public.current_org_id()
  )
  with check (
    organization_id = public.current_org_id()
  );

-- reuse tenant policies for each table to keep snippet short
create policy "calendar_calendars_member"
  on public.calendar_calendars
  for all
  using (organization_id = public.current_org_id())
  with check (organization_id = public.current_org_id());

create policy "calendar_events_member"
  on public.calendar_events
  for all
  using (organization_id = public.current_org_id())
  with check (organization_id = public.current_org_id());

create policy "calendar_event_mappings_member"
  on public.calendar_event_mappings
  for select using (
    exists (
      select 1
      from public.calendar_events e
      where e.id = event_id
        and e.organization_id = public.current_org_id()
    )
  );

create policy "calendar_event_mappings_update"
  on public.calendar_event_mappings
  for update
  using (
    exists (
      select 1
      from public.calendar_events e
      where e.id = event_id
        and e.organization_id = public.current_org_id()
    )
  )
  with check (
    exists (
      select 1
      from public.calendar_events e
      where e.id = event_id
        and e.organization_id = public.current_org_id()
    )
  );

create policy "calendar_event_mappings_insert"
  on public.calendar_event_mappings
  for insert
  with check (
    exists (
      select 1
      from public.calendar_events e
      where e.id = event_id
        and e.organization_id = public.current_org_id()
    )
  );

create policy "calendar_sync_state_member"
  on public.calendar_sync_state
  for all
  using (
    organization_id = public.current_org_id()
  )
  with check (
    organization_id = public.current_org_id()
  );

create policy "calendar_change_queue_member"
  on public.calendar_change_queue
  for all
  using (
    organization_id = public.current_org_id()
  )
  with check (
    organization_id = public.current_org_id()
  );

create policy "tasks_member"
  on public.tasks
  for all
  using (
    organization_id = public.current_org_id()
  )
  with check (
    organization_id = public.current_org_id()
  );

create policy "focus_member"
  on public.focus_sessions
  for all
  using (
    organization_id = public.current_org_id()
  )
  with check (
    organization_id = public.current_org_id()
  );

create policy "parking_member"
  on public.parking
  for all
  using (
    organization_id = public.current_org_id()
  )
  with check (
    organization_id = public.current_org_id()
  );

create policy "assistant_suggestions_member"
  on public.plan_assistant_suggestions
  for all
  using (
    organization_id = public.current_org_id()
  )
  with check (
    organization_id = public.current_org_id()
  );

grant select on public.organizations to authenticated;
grant select on public.calendar_events to authenticated;
grant update on public.calendar_events to authenticated;
grant select, insert, update on public.calendar_connections to authenticated;
grant select, insert, update on public.calendar_calendars to authenticated;
grant select on public.calendar_event_mappings to authenticated;
grant select, insert on public.calendar_change_queue to authenticated;
grant select, insert, update on public.tasks to authenticated;
grant select, insert, update on public.focus_sessions to authenticated;
grant select, insert on public.parking to authenticated;
