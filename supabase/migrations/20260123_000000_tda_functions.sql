-- Sprint 4: Now / Focus / Parking helpers

create or replace function public.tasks_get_next_now_task(user_id uuid)
returns table (
  id uuid,
  title text,
  due timestamptz,
  status text
) language sql stable as $$
  select id, title, start_time as due, status
  from public.tasks
  where user_id = $1
    and status in ('todo','paused')
  order by est_minutes desc nulls last, created_at asc
  limit 1;
$$;

create or replace function public.focus_start_session(p_user_id uuid, task_id uuid, focus_type text default 'now')
returns table (
  id uuid,
  task_id uuid,
  started_at timestamptz
) language plpgsql security definer set search_path = public as $$
declare
  existing uuid;
begin
  select id into existing
  from public.focus_sessions
  where user_id = p_user_id
    and ended_at is null;

  if existing is not null then
  raise exception 'focus session already running';
end if;

  insert into public.focus_sessions(user_id, task_id, started_at)
  values (p_user_id, task_id, now())
  returning id, task_id, started_at;
end;
$$;

create or replace function public.focus_end_session(session_id uuid, p_outcome text default 'done')
returns void language plpgsql secure definer as $$
begin
  update public.focus_sessions
  set ended_at = now(), outcome = p_outcome
  where id = session_id
    and ended_at is null;
end;
$$;

create or replace function public.parking_add_item(user_id uuid, note text)
returns table(id uuid, note text, created_at timestamptz) language plpgsql security definer as $$
begin
  insert into public.parking(user_id, note)
  values (user_id, note)
  returning id, note, created_at;
end;
$$;

grant execute on function public.tasks_get_next_now_task(uuid) to authenticated;
grant execute on function public.focus_start_session(uuid,uuid,text) to authenticated;
grant execute on function public.focus_end_session(uuid,text) to authenticated;
grant execute on function public.parking_add_item(uuid,text) to authenticated;
