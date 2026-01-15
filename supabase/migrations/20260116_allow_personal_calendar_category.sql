-- Allow the calendar_events category constraint to accept the Personal bucket
alter table public.calendar_events drop constraint if exists calendar_events_category_check;
alter table public.calendar_events add constraint calendar_events_category_check check (category in ('work','home','personal'));
