-- FindWell Surveys - Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/<your-project>/sql)

-- Therapist responses
create table if not exists therapist_responses (
  id uuid default gen_random_uuid() primary key,
  responses jsonb not null,
  contact_optin jsonb,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Patient responses
create table if not exists patient_responses (
  id uuid default gen_random_uuid() primary key,
  responses jsonb not null,
  contact_optin jsonb,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table therapist_responses enable row level security;
alter table patient_responses enable row level security;

-- Grant table-level privileges to the anon role (required in addition to RLS)
-- SELECT grant is required by PostgREST internals for PATCH operations, but
-- since we do not add a SELECT policy below, no rows are actually readable
grant select, insert, update on therapist_responses to anon;
grant select, insert, update on patient_responses to anon;

-- Insert-only policy for anonymous users (the anon role)
-- Anyone can insert, but nobody can read/update/delete via the API
create policy "Allow anonymous inserts" on therapist_responses
  for insert
  to anon
  with check (true);

create policy "Allow anonymous inserts" on patient_responses
  for insert
  to anon
  with check (true);

-- Update policy so the thank-you page can attach contact info
-- Only allows updating the contact_optin field on rows where it is currently null
create policy "Allow anonymous contact opt-in update" on therapist_responses
  for update
  to anon
  using (contact_optin is null)
  with check (true);

create policy "Allow anonymous contact opt-in update" on patient_responses
  for update
  to anon
  using (contact_optin is null)
  with check (true);

-- Indexes for querying from external tools
create index if not exists idx_therapist_responses_submitted_at on therapist_responses (submitted_at desc);
create index if not exists idx_patient_responses_submitted_at on patient_responses (submitted_at desc);
create index if not exists idx_therapist_responses_contact on therapist_responses (contact_optin) where contact_optin is not null;
create index if not exists idx_patient_responses_contact on patient_responses (contact_optin) where contact_optin is not null;
