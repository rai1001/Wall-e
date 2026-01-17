-- Sprint 5: Calendar toggles + queue processing clarity

alter table public.calendar_change_queue
  drop constraint if exists calendar_change_queue_action_check;

alter table public.calendar_change_queue
  add constraint calendar_change_queue_action_check
    check (action in ('create','update','delete','toggle'));

alter table public.calendar_change_queue
  add column if not exists processed_at timestamptz;

create or replace function calendar.toggle_calendar_enabled(
  calendar_id uuid,
  enabled boolean,
  idempotency_key text default null
) returns table (
  calendar_id uuid,
  is_enabled boolean
) language plpgsql security definer set search_path = public, calendar as $$
declare
  org uuid := public.current_org_id();
  actor uuid := auth.uid();
  cal record;
  queue_id uuid;
begin
  if org is null then
    raise exception 'organization_id claim missing';
  end if;

  select *
  from public.calendar_calendars
  where id = calendar_id
    and organization_id = org
  into cal;

  if not found then
    raise exception 'calendar_not_found';
  end if;

  if idempotency_key is not null then
    select id into queue_id
    from public.calendar_change_queue
    where organization_id = org
      and idempotency_key = idempotency_key
      and action = 'toggle'
    limit 1;
    if found then
      return query
      select id as calendar_id, is_enabled
      from public.calendar_calendars
      where id = calendar_id;
    end if;
  end if;

  update public.calendar_calendars
  set is_enabled = enabled
  where id = calendar_id;

  queue_id := calendar.queue_payload(
    'toggle',
    jsonb_build_object('calendar_id', calendar_id, 'enabled', enabled),
    org,
    calendar_id,
    actor,
    idempotency_key
  );

  return query
  select id as calendar_id, is_enabled
  from public.calendar_calendars
  where id = calendar_id;
end;
$$;

grant execute on function calendar.toggle_calendar_enabled(uuid, boolean, text) to authenticated;
