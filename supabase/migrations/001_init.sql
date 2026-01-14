-- Enable extensions if needed
create extension if not exists pgcrypto;

-- TASKS
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('work','home','pet','personal')),
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','paused','done')),
  est_minutes int,
  energy text check (energy in ('low','medium','high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_status_idx on public.tasks(user_id, status);

-- Ensure only 1 in_progress per user (WIP=1)
create unique index if not exists one_in_progress_per_user
on public.tasks(user_id)
where status = 'in_progress';

-- FOCUS SESSIONS
create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  outcome text check (outcome in ('done','paused','stuck'))
);

create index if not exists focus_sessions_user_started_idx on public.focus_sessions(user_id, started_at desc);

-- PARKING
create table if not exists public.parking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

-- UPDATED_AT trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- RLS
alter table public.tasks enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.parking enable row level security;

-- Policies: user can access own rows
drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own" on public.tasks
for select using (auth.uid() = user_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own" on public.tasks
for insert with check (auth.uid() = user_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own" on public.tasks
for update using (auth.uid() = user_id);

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own" on public.tasks
for delete using (auth.uid() = user_id);

drop policy if exists "focus_select_own" on public.focus_sessions;
create policy "focus_select_own" on public.focus_sessions
for select using (auth.uid() = user_id);

drop policy if exists "focus_insert_own" on public.focus_sessions;
create policy "focus_insert_own" on public.focus_sessions
for insert with check (auth.uid() = user_id);

drop policy if exists "focus_update_own" on public.focus_sessions;
create policy "focus_update_own" on public.focus_sessions
for update using (auth.uid() = user_id);

drop policy if exists "parking_select_own" on public.parking;
create policy "parking_select_own" on public.parking
for select using (auth.uid() = user_id);

drop policy if exists "parking_insert_own" on public.parking;
create policy "parking_insert_own" on public.parking
for insert with check (auth.uid() = user_id);

drop policy if exists "parking_delete_own" on public.parking;
create policy "parking_delete_own" on public.parking
for delete using (auth.uid() = user_id);
