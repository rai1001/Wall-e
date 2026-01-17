-- Sprint 2: Calendar RPC and queue helpers
create schema if not exists calendar;

create or replace function calendar.ensure_calendar_in_org(calendar_id uuid, org_id uuid)
returns uuid language sql stable as $$
  select id
  from public.calendar_calendars
  where id = $1
    and organization_id = $2
  limit 1;
$$;

create or replace function calendar.queue_payload(action text, payload jsonb, org_id uuid, calendar_id uuid, user_id uuid, idempotency_key text)
returns uuid language plpgsql as $$
declare
  queue_id uuid;
begin
  insert into public.calendar_change_queue(
    organization_id,
    calendar_id,
    user_id,
    action,
    payload,
    status,
    idempotency_key
  ) values (
    org_id,
    calendar_id,
    user_id,
    action,
    payload,
    'pending',
    idempotency_key
  ) returning id into queue_id;
  return queue_id;
end;
$$;

create or replace function calendar.event_payload(event_id uuid, org_id uuid, calendar_id uuid, payload jsonb, idempotency_key text)
returns table(id uuid) language sql as $$
  select event_id as id
$$;

create or replace function calendar.create_event(
  calendar_id uuid,
  title text,
  start_time timestamptz,
  end_time timestamptz,
  metadata jsonb default '{}'::jsonb,
  idempotency_key text default null
) returns table (
  id uuid,
  title text,
  start_time timestamptz,
  end_time timestamptz,
  status text
) language plpgsql security definer set search_path = public, calendar as $$
declare
  org uuid := public.current_org_id();
  actor uuid := auth.uid();
  result record;
  queue_id uuid;
  existing_event uuid;
begin
  if org is null then
    raise exception 'organization_id claim missing';
  end if;

  select calendar.ensure_calendar_in_org(calendar_id, org) into existing_event;
  if existing_event is null then
    raise exception 'calendar_not_found';
  end if;

  if idempotency_key is not null then
    select id into result
    from public.calendar_change_queue
    where organization_id = org
      and idempotency_key = idempotency_key
      and action = 'create'
    limit 1;
    if found then
      return query
      select id, title, start_time, end_time, status
      from public.calendar_events
      where id = result.id;
    end if;
  end if;

  insert into public.calendar_events(
    organization_id,
    calendar_id,
    title,
    start_time,
    end_time,
    status,
    source,
    created_by
  ) values (
    org,
    calendar_id,
    title,
    start_time,
    end_time,
    'confirmed',
    'internal',
    actor
  )
  returning id, title, start_time, end_time, status into result;

  queue_id := calendar.queue_payload(
    'create',
    jsonb_build_object('event_id', result.id, 'metadata', metadata),
    org,
    calendar_id,
    actor,
    idempotency_key
  );

  return query
  select id, title, start_time, end_time, status
  from public.calendar_events
  where id = result.id;
end;
$$;

create or replace function calendar.update_event(
  event_id uuid,
  title text default null,
  start_time timestamptz default null,
  end_time timestamptz default null,
  metadata jsonb default '{}'::jsonb,
  idempotency_key text default null
) returns table (
  id uuid,
  title text,
  start_time timestamptz,
  end_time timestamptz,
  status text
) language plpgsql security definer set search_path = public, calendar as $$
declare
  org uuid := public.current_org_id();
  actor uuid := auth.uid();
  evt record;
  queue_id uuid;
begin
  if org is null then
    raise exception 'organization_id claim missing';
  end if;

  select *
  from public.calendar_events
  where id = event_id
    and organization_id = org
  into evt;

  if not found then
    raise exception 'event_not_found';
  end if;

  if idempotency_key is not null then
    select id into queue_id
    from public.calendar_change_queue
    where organization_id = org
      and idempotency_key = idempotency_key
      and action = 'update'
    limit 1;
    if found then
      return query
      select id, title, start_time, end_time, status
      from public.calendar_events
      where id = event_id;
    end if;
  end if;

  update public.calendar_events
  set
    title = coalesce(title, evt.title),
    start_time = coalesce(start_time, evt.start_time),
    end_time = coalesce(end_time, evt.end_time),
    updated_at = now()
  where id = event_id;

  queue_id := calendar.queue_payload(
    'update',
    jsonb_build_object('event_id', event_id, 'metadata', metadata),
    org,
    evt.calendar_id,
    actor,
    idempotency_key
  );

  return query
  select id, title, start_time, end_time, status
  from public.calendar_events
  where id = event_id;
end;
$$;

create or replace function calendar.delete_event(
  event_id uuid,
  idempotency_key text default null
) returns void language plpgsql security definer set search_path = public, calendar as $$
declare
  org uuid := public.current_org_id();
  actor uuid := auth.uid();
  evt record;
  queue_id uuid;
begin
  if org is null then
    raise exception 'organization_id claim missing';
  end if;

  select *
  from public.calendar_events
  where id = event_id
    and organization_id = org
  into evt;

  if not found then
    raise exception 'event_not_found';
  end if;

  if idempotency_key is not null then
    select id into queue_id
    from public.calendar_change_queue
    where organization_id = org
      and idempotency_key = idempotency_key
      and action = 'delete'
    limit 1;
    if found then
      return;
    end if;
  end if;

  delete from public.calendar_events where id = event_id;

  queue_id := calendar.queue_payload(
    'delete',
    jsonb_build_object('event_id', event_id),
    org,
    evt.calendar_id,
    actor,
    idempotency_key
  );
end;
$$;

grant execute on function calendar.create_event(uuid,text,timestamptz,timestamptz,jsonb,text) to authenticated;
grant execute on function calendar.update_event(uuid,text,timestamptz,timestamptz,jsonb,text) to authenticated;
grant execute on function calendar.delete_event(uuid,text) to authenticated;
