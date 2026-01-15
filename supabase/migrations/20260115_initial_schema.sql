-- Create calendar_events table
create table if not exists public.calendar_events (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null,
  description text null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_all_day boolean default false,
  category text check (category in ('work', 'home')) not null default 'work',
  location text null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint calendar_events_pkey primary key (id),
  constraint calendar_events_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade
);

-- Enable RLS
alter table public.calendar_events enable row level security;

-- Policies
drop policy if exists "Users can view their own events" on public.calendar_events;
create policy "Users can view their own events" 
  on public.calendar_events for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own events" on public.calendar_events;
create policy "Users can insert their own events" 
  on public.calendar_events for insert 
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own events" on public.calendar_events;
create policy "Users can update their own events" 
  on public.calendar_events for update 
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own events" on public.calendar_events;
create policy "Users can delete their own events" 
  on public.calendar_events for delete 
  using (auth.uid() = user_id);
