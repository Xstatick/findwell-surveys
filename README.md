# Findwell Discovery Surveys

Two anonymous surveys for early-stage discovery research - one for therapists, one for patients/clients.

## Routes

- `/` - Landing page with links to both surveys
- `/therapist` - Therapist discovery survey
- `/patient` - Patient discovery survey (with branching logic)
- `/thank-you` - Post-submission page with optional contact opt-in

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Find your credentials at: Supabase Dashboard > Project Settings > API

- `NEXT_PUBLIC_SUPABASE_URL` - your project URL (e.g. `https://abc123.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - your anon/public key

### 3. Set up the database

Open the Supabase SQL Editor and paste the contents of `supabase/schema.sql`. Run it.

This creates two tables and configures Row Level Security so respondents can insert but not read data.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Schema

Both tables share the same structure:

### `therapist_responses` / `patient_responses`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Auto-generated primary key |
| `responses` | jsonb | All survey answers, keyed by question ID |
| `contact_optin` | jsonb (nullable) | Optional contact info: `{name, email, phone}` |
| `submitted_at` | timestamptz | When the respondent submitted |
| `created_at` | timestamptz | Row creation time |

### Querying responses

The `responses` JSONB column stores answers keyed by question ID. Example:

```json
{
  "t1": "solo",
  "t2": "Finding clients who are a good fit is hard.",
  "t3": "word-of-mouth"
}
```

To query specific answers:

```sql
-- All therapists in solo practice
select * from therapist_responses
where responses->>'t1' = 'solo';

-- All responses with contact info
select id, contact_optin, submitted_at
from therapist_responses
where contact_optin is not null;

-- Count responses by a specific answer
select responses->>'t1' as practice_type, count(*)
from therapist_responses
group by responses->>'t1';
```

### Row Level Security

RLS is enabled on both tables. Anonymous users (the `anon` role used by the Supabase client) can:
- **INSERT** new responses
- **UPDATE** only rows where `contact_optin` is null (for the post-submission opt-in)
- **Cannot SELECT or DELETE** any rows

To read data, use the Supabase dashboard, the service role key, or a tool like the Claude MCP Supabase connector.

## Deployment

This project is configured for Vercel. Push to the `main` branch and Vercel will deploy automatically once connected.

Make sure to add your Supabase environment variables in Vercel's project settings under Environment Variables.
