# Setup Guide — JOEX Teacher Website

Connect the site to its persistent Supabase database. **Until you add the keys, the site runs in preview mode** (bundled demo content + a dismissible banner). Adding the keys switches it to the real database — no code changes needed.

## 1. Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Name it e.g. `joex-teacher`, choose a strong database password, pick a region close to Egypt (Frankfurt works well), and create.

## 2. Run the migrations (the database)

In the Supabase dashboard open **SQL Editor** → **New query**, paste the contents of:

- `supabase/migrations/0001_schema.sql` → **Run** (creates all tables, security rules, storage buckets)
- `supabase/migrations/0002_seed.sql` → **Run** (loads the demo content — courses, exams, materials, FAQs)

> If you use the Supabase CLI instead: `supabase link --project-ref <ref>` then `supabase db push`.

## 3. Copy the API keys

In the dashboard: **Project Settings → API**.

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never in the browser)

Create a `.env.local` file in the project root (copy from `.env.example`) and fill the three values.

## 4. Auth settings (recommended for the demo)

**Authentication → Sign In / Up → Email**:
- Turn **OFF** "Confirm email" while demoing (students can log in instantly). Turn it back ON for production.

## 5. Make the teacher account

1. Register a normal account on the site (`/en/register`).
2. In Supabase: **Table Editor → profiles** → find your new row → change `role` to `teacher`.
3. Log out and back in → **Teacher Panel** appears in the navbar.

Now manage everything from the dashboard: courses, lessons, materials (upload PDFs), exams & questions, bookings, announcements, testimonials, messages, and site settings (teacher identity, stats, WhatsApp number, demo badges).

## 6. Storage

The buckets `materials`, `course-images` and `avatars` are created by the migration and are publicly readable — uploads from the dashboard work immediately.

## 7. Go live

- Deploy to Vercel/Netlify/any Node host: build command `npm run build`, output `.next`.
- Set the same 4 environment variables in the host.
- Replace `NEXT_PUBLIC_SITE_URL` with the real domain (used for sitemap, canonical URLs, OG tags).
- Update the site's WhatsApp number and contact details in **Teacher Panel → Settings**.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Banner still showing | Keys missing or `.env.local` not loaded — restart `npm run dev` |
| Log in says wrong credentials | Email confirmation is ON — check the inbox, or disable it (step 4) |
| Uploads fail | Storage policies missing — re-run `0001_schema.sql` |
| Admin says "not teacher" | Set `role = teacher` on your profile row (step 5) |
