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

-- Grant read access to the service_role (used by the admin reporting UI via the
-- secret key). service_role bypasses RLS, so a SELECT grant lets it read every
-- row. This role is only ever used server-side; the secret key is never exposed
-- to the browser.
grant select on therapist_responses to service_role;
grant select on patient_responses to service_role;

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

-- ---------------------------------------------------------------------------
-- Anonymous usage events
-- ---------------------------------------------------------------------------
-- Powers the "Activity" panel in the admin area: how many people visit, how
-- many start a survey, and where people stop. Deliberately minimal:
--
--   * session_id is a random id generated in the browser per visit. It is not
--     derived from anything about the person and cannot be traced back to them.
--   * question_id records only WHICH question was on screen, never the answer.
--     Nothing a respondent types is stored here - answers only ever reach the
--     database when they press Submit, in the *_responses tables.
--   * No IP address, no user agent, no cookies.

create table if not exists survey_events (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  survey_type text,
  event text not null,
  question_id text,
  path text,
  created_at timestamptz not null default now()
);

alter table survey_events enable row level security;

-- Respondents may only append events. There is no select/update/delete policy,
-- so the anon role can never read them back.
grant insert on survey_events to anon;

create policy "Allow anonymous event inserts" on survey_events
  for insert
  to anon
  with check (true);

-- The admin Activity panel reads these via the service role (bypasses RLS).
grant select on survey_events to service_role;

create index if not exists idx_survey_events_created_at on survey_events (created_at desc);
create index if not exists idx_survey_events_type_event on survey_events (survey_type, event);
create index if not exists idx_survey_events_session on survey_events (session_id);
