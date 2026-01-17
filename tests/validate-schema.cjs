const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const migrationFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

const fixtures = migrationFiles
  .map((file) => fs.readFileSync(path.join(migrationsDir, file), 'utf8'))
  .join('\n\n');

const requiredSnippets = [
  'create table if not exists public.organizations',
  'create or replace function public.current_org_id',
  'create or replace function public.is_org_member',
  'create table if not exists public.calendar_events',
  'create table if not exists public.tasks',
  'create table if not exists public.plan_assistant_suggestions',
  'enable row level security',
  'calendar.create_event',
  'calendar.update_event',
  'calendar.delete_event'
  , 'public.tasks_get_next_now_task'
  , 'public.focus_start_session'
  , 'public.focus_end_session'
  , 'public.parking_add_item'
];

requiredSnippets.forEach((snippet) => {
  if (!fixtures.includes(snippet)) {
    throw new Error(`Migration missing expected snippet: ${snippet}`);
  }
});

console.log('✅ Multitenant baseline migration includes required tables and helpers.');
