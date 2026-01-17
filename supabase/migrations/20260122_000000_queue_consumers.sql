-- Sprint 2 queue consumer helpers
create schema if not exists calendar_job;

create or replace function calendar_job.process_queue()
returns trigger language plpgsql as $$
declare
  job record;
begin
  select *
  from public.calendar_change_queue
  where status = 'pending'
    and organization_id = public.current_org_id()
  order by enqueued_at
  limit 1
  into job;

  if not found then
    return null;
  end if;

  -- placeholder: real push/pull via edge functions
  update public.calendar_change_queue
  set status = 'processing'
  where id = job.id;

  perform
    -- mark as done for now
    1;

  update public.calendar_change_queue
  set status = 'synced'
  where id = job.id;

  return job;
end;
$$;

grant execute on function calendar_job.process_queue() to authenticated;
