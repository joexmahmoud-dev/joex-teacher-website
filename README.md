# JOEX Teacher Website

Premium bilingual (Arabic RTL / English LTR) website for an Egyptian mathematics teacher — built by **JOEX** as a commercial product with an ongoing content-management service model.

- **Stack:** Next.js 15 (App Router) · React 19 · TypeScript · custom CSS design system · Supabase (PostgreSQL + Auth + Storage)
- **i18n:** `/ar` + `/en` full path-based locales, middleware routing, per-locale metadata/hreflang/JSON-LD
- **No mock database in production:** the site reads/writes a persistent Supabase PostgreSQL database. Until Supabase keys are added it runs in an explicitly-flagged preview mode on bundled seed data.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000 (redirects to /ar)
```

Add Supabase keys in `.env.local` (see [SETUP.md](SETUP.md)) to switch from preview mode to the persistent database.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` / `build` / `start` | Standard Next.js |
| `npm run fonts` | Re-download self-hosted Cairo + Inter fonts |
| `npm run demo-files` | Regenerate demo PDF files |
| `npm run assets` | Regenerate covers, OG image, app icons |

## Architecture

```
app/
  [locale]/            All public pages (home, courses, materials, exams,
                       about, testimonials, book, contact, auth, dashboard,
                       admin) — lang/dir set per locale
  sitemap.ts robots.ts manifest.ts
components/
  ui/                  Design-system primitives (Button, Card, fields, modal,
                       toasts, motion) — logical properties, RTL-native
  layout/              Navbar, Footer, language switcher, preview banner
  home courses materials exams booking dashboard admin
lib/
  i18n/                dictionaries (typed AR/EN parity), pluralization
  db/                  types + env config
  supabase/            server (cookie/RLS) + browser + admin clients
  data/                server.ts (public reads) · writes.ts (client writes)
                       admin.ts (CRUD) · dashboard.ts (user-scoped reads)
  data/seed/           demo content (also the preview-mode fallback)
  seo.ts               metadata, hreflang, canonical, JSON-LD builders
supabase/migrations/   0001 schema+RLS+storage · 0002 demo seed
```

### Data flow

Server Components → `lib/data/server.ts` → Supabase (RLS) or seed fallback.
Interactive components → `lib/data/writes.ts` / `admin.ts` → Supabase client (RLS guards every write). When Supabase is not configured, writes return `preview: true` and the UI shows the corresponding notice — data is never silently dropped.

### Security

- All secrets live in environment variables (`.env.example` documents them).
- Row Level Security on every table: public reads limited to published content; students only their own rows; **teacher-only** writes via an `is_teacher()` policy helper.
- Admin routes are guarded server-side (session + `profiles.role = 'teacher'`).
- Auth uses Supabase email/password with cookie sessions (`@supabase/ssr`).

## JOEX content-management model (no redeploys)

The teacher never edits code. Content changes happen in the **Teacher Panel** and appear on the public site immediately because every page reads from the database:

| Teacher does | JOEX / dashboard does | Website |
| --- | --- | --- |
| Sends a new PDF | Upload in **Materials → Add** (goes to Supabase Storage) | New card appears on `/materials` |
| Wants a new course | Create course + lessons (AR + EN) in **Courses → Add** | New card + full detail page |
| Wants a new exam | Create exam + questions in **Exams → Add** | Live on `/exams` with instant grading |
| Changes phone / prices / bio | **Settings** page | Hero, footer, contact, structured data update |
| Wants a new section | JOEX implements it (one-time code work) | — |

To change a section of the website itself (layout, new feature), JOEX implements it once — afterwards the teacher manages content independently.

## Placeholders to replace before launch

- `NEXT_PUBLIC_SITE_URL` in `.env.example` / hosting env
- Teacher identity, WhatsApp number, stats, bio → **Teacher Panel → Settings** (demo badges stay visible until `demo_mode` is off)
- Testimonials marked *demo* in the dashboard
- `karim.hassan@joex-teacher.example` email
- Demo PDFs in `public/demo-files/`
- Teacher portrait `public/images/teacher-portrait.png` (illustration, clearly demo)

## Content conventions

- All content tables carry `_ar` / `_en` columns; the site picks per locale (additional languages = add two columns per table).
- Exams are fully self-contained: questions, options (JSONB), correct answer and explanations — graded instantly in the browser, results saved to `exam_attempts` when signed in.
