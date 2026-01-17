const fs = require('fs');
const path = require('path');

const migrationPath = path.join(
  __dirname,
  '..',
  'supabase',
  'migrations',
  '20260120_000000_multitenant_baseline.sql'
);

const fixtures = fs.readFileSync(migrationPath, 'utf8');

const requiredSnippets = [
  'create table if not exists public.organizations',
  'create or replace function public.current_org_id',
  'create or replace function public.is_org_member',
  'create table if not exists public.calendar_events',
  'create table if not exists public.tasks',
  'create table if not exists public.plan_assistant_suggestions',
  'enable row level security',
];

requiredSnippets.forEach((snippet) => {
  if (!fixtures.includes(snippet)) {
    throw new Error(`Migration missing expected snippet: ${snippet}`);
  }
});

console.log('✅ Multitenant baseline migration includes required tables and helpers.');
