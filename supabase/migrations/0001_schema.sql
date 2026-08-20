-- ═══════════════════════════════════════════════════════════════════════════
-- JOEX Teacher Website — schema
-- Run in the Supabase SQL editor (or: supabase db push).
-- Content tables use TEXT primary keys so seeds stay human-readable and
-- match the bundled TS seed data exactly. RLS enabled everywhere.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Helper: is the current user the teacher? ──────────────────────────────
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  );
$$;

-- ── Profiles (extends auth.users) ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'teacher')),
  full_name_ar text default '',
  full_name_en text default '',
  grade text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row on signup (copies signup metadata).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name_ar, full_name_en, grade, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name_ar', ''),
    coalesce(new.raw_user_meta_data ->> 'full_name_en', ''),
    coalesce(new.raw_user_meta_data ->> 'grade', null),
    coalesce(new.raw_user_meta_data ->> 'phone', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Site config (single row, id = 1) ─────────────────────────────────────
create table if not exists public.site_config (
  id int primary key default 1 check (id = 1),
  teacher_name_ar text not null default '',
  teacher_name_en text not null default '',
  teacher_title_ar text not null default '',
  teacher_title_en text not null default '',
  subject_ar text not null default '',
  subject_en text not null default '',
  city_ar text not null default '',
  city_en text not null default '',
  whatsapp text not null default '',
  phone text not null default '',
  email text not null default '',
  address_ar text not null default '',
  address_en text not null default '',
  bio_ar text not null default '',
  bio_en text not null default '',
  photo_url text,
  facebook text,
  youtube text,
  tiktok text,
  students_count int not null default 0,
  years_experience int not null default 0,
  success_rate int not null default 0,
  exams_count int not null default 0,
  demo_mode boolean not null default true,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_config_updated on public.site_config;
create trigger site_config_updated
  before update on public.site_config
  for each row execute function public.set_updated_at();

-- ── Content tables ────────────────────────────────────────────────────────

create table if not exists public.courses (
  id text primary key,
  slug text not null unique,
  subject_ar text not null default '',
  subject_en text not null default '',
  title_ar text not null default '',
  title_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  what_you_learn_ar jsonb not null default '[]'::jsonb,
  what_you_learn_en jsonb not null default '[]'::jsonb,
  grade text not null default '',
  price numeric(10, 2) not null default 0,
  duration_weeks int not null default 1,
  image_url text,
  status text not null default 'published' check (status in ('published', 'draft')),
  featured boolean not null default false,
  sort_order int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id text primary key,
  course_id text not null references public.courses (id) on delete cascade,
  title_ar text not null default '',
  title_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  duration_minutes int not null default 45,
  sort_order int not null default 1
);
create index if not exists lessons_course_idx on public.lessons (course_id);

create table if not exists public.materials (
  id text primary key,
  title_ar text not null default '',
  title_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  subject_ar text not null default '',
  subject_en text not null default '',
  grade text not null default '',
  file_url text not null default '',
  file_type text not null default 'pdf',
  file_size_kb int not null default 0,
  upload_date date not null default current_date,
  downloads int not null default 0,
  status text not null default 'published' check (status in ('published', 'draft'))
);

create table if not exists public.exams (
  id text primary key,
  title_ar text not null default '',
  title_en text not null default '',
  subject_ar text not null default '',
  subject_en text not null default '',
  grade text not null default '',
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  duration_minutes int not null default 20,
  is_available boolean not null default false,
  sort_order int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.exam_questions (
  id text primary key,
  exam_id text not null references public.exams (id) on delete cascade,
  question_ar text not null default '',
  question_en text not null default '',
  options_ar jsonb not null default '[]'::jsonb,
  options_en jsonb not null default '[]'::jsonb,
  correct_index int not null default 0,
  explanation_ar text not null default '',
  explanation_en text not null default '',
  sort_order int not null default 1
);
create index if not exists exam_questions_exam_idx on public.exam_questions (exam_id);

create table if not exists public.testimonials (
  id text primary key,
  student_name_ar text not null default '',
  student_name_en text not null default '',
  grade text not null default '',
  review_ar text not null default '',
  review_en text not null default '',
  rating int not null default 5 check (rating between 1 and 5),
  is_featured boolean not null default false,
  is_demo boolean not null default true,
  sort_order int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id text primary key,
  question_ar text not null default '',
  question_en text not null default '',
  answer_ar text not null default '',
  answer_en text not null default '',
  sort_order int not null default 1
);

create table if not exists public.announcements (
  id text primary key,
  title_ar text not null default '',
  title_en text not null default '',
  content_ar text not null default '',
  content_en text not null default '',
  is_published boolean not null default false,
  published_at timestamptz not null default now()
);

-- ── User-scoped tables ────────────────────────────────────────────────────

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id text not null references public.courses (id) on delete cascade,
  progress_pct int not null default 0 check (progress_pct between 0 and 100),
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index if not exists enrollments_user_idx on public.enrollments (user_id);

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  exam_id text not null references public.exams (id) on delete cascade,
  score int not null default 0,
  total int not null default 0,
  correct_count int not null default 0,
  wrong_count int not null default 0,
  answers jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz not null default now()
);
create index if not exists attempts_user_idx on public.exam_attempts (user_id);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  service text not null default '',
  booking_date date not null,
  booking_time time not null,
  name text not null default '',
  phone text not null default '',
  email text,
  grade text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_user_idx on public.bookings (user_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null default '',
  phone text,
  message text not null default '',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists messages_created_idx on public.messages (created_at desc);

-- ═══════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.site_config enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.materials enable row level security;
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.announcements enable row level security;
alter table public.enrollments enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;

-- profiles: own row for students, everything for the teacher
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (id = auth.uid() or public.is_teacher());

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (id = auth.uid() or public.is_teacher());

-- site_config: readable by everyone, editable by the teacher only
drop policy if exists "site_config_select" on public.site_config;
create policy "site_config_select" on public.site_config
  for select to anon, authenticated using (true);

drop policy if exists "site_config_update" on public.site_config;
create policy "site_config_update" on public.site_config
  for update to authenticated using (public.is_teacher());

-- Public content: published rows for everyone, everything for the teacher
drop policy if exists "courses_select_public" on public.courses;
create policy "courses_select_public" on public.courses
  for select to anon, authenticated using (status = 'published');

drop policy if exists "courses_select_teacher" on public.courses;
create policy "courses_select_teacher" on public.courses
  for select to authenticated using (public.is_teacher());

drop policy if exists "courses_write" on public.courses;
create policy "courses_write" on public.courses
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "lessons_select" on public.lessons;
create policy "lessons_select" on public.lessons
  for select to anon, authenticated using (
    exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
    or public.is_teacher()
  );

drop policy if exists "lessons_write" on public.lessons;
create policy "lessons_write" on public.lessons
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "materials_select_public" on public.materials;
create policy "materials_select_public" on public.materials
  for select to anon, authenticated using (status = 'published');

drop policy if exists "materials_write" on public.materials;
create policy "materials_write" on public.materials
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "exams_select_public" on public.exams;
create policy "exams_select_public" on public.exams
  for select to anon, authenticated using (is_available = true);

drop policy if exists "exams_select_teacher" on public.exams;
create policy "exams_select_teacher" on public.exams
  for select to authenticated using (public.is_teacher());

drop policy if exists "exams_write" on public.exams;
create policy "exams_write" on public.exams
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "questions_select" on public.exam_questions;
create policy "questions_select" on public.exam_questions
  for select to anon, authenticated using (
    exists (select 1 from public.exams e where e.id = exam_id and e.is_available = true)
    or public.is_teacher()
  );

drop policy if exists "questions_write" on public.exam_questions;
create policy "questions_write" on public.exam_questions
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "testimonials_select" on public.testimonials;
create policy "testimonials_select" on public.testimonials
  for select to anon, authenticated using (true);

drop policy if exists "testimonials_write" on public.testimonials;
create policy "testimonials_write" on public.testimonials
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "faqs_select" on public.faqs;
create policy "faqs_select" on public.faqs
  for select to anon, authenticated using (true);

drop policy if exists "faqs_write" on public.faqs;
create policy "faqs_write" on public.faqs
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "announcements_select_public" on public.announcements;
create policy "announcements_select_public" on public.announcements
  for select to anon, authenticated using (is_published = true);

drop policy if exists "announcements_select_teacher" on public.announcements;
create policy "announcements_select_teacher" on public.announcements
  for select to authenticated using (public.is_teacher());

drop policy if exists "announcements_write" on public.announcements;
create policy "announcements_write" on public.announcements
  for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

-- enrollments: own rows for students, all for the teacher
drop policy if exists "enrollments_select" on public.enrollments;
create policy "enrollments_select" on public.enrollments
  for select using (user_id = auth.uid() or public.is_teacher());

drop policy if exists "enrollments_insert" on public.enrollments;
create policy "enrollments_insert" on public.enrollments
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "enrollments_update" on public.enrollments;
create policy "enrollments_update" on public.enrollments
  for update using (user_id = auth.uid() or public.is_teacher());

-- exam_attempts: own rows, insert own, teacher sees all
drop policy if exists "attempts_select" on public.exam_attempts;
create policy "attempts_select" on public.exam_attempts
  for select using (user_id = auth.uid() or public.is_teacher());

drop policy if exists "attempts_insert" on public.exam_attempts;
create policy "attempts_insert" on public.exam_attempts
  for insert to authenticated with check (user_id = auth.uid());

-- bookings: anonymous or own inserts, own selects, teacher manages all
drop policy if exists "bookings_insert" on public.bookings;
create policy "bookings_insert" on public.bookings
  for insert to anon, authenticated with check (user_id is null or user_id = auth.uid());

drop policy if exists "bookings_select" on public.bookings;
create policy "bookings_select" on public.bookings
  for select using (user_id = auth.uid() or public.is_teacher());

drop policy if exists "bookings_update" on public.bookings;
create policy "bookings_update" on public.bookings
  for update to authenticated using (public.is_teacher());

-- messages: anyone can send, only the teacher reads
drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages
  for insert to anon, authenticated with check (true);

drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages
  for select to authenticated using (public.is_teacher());

-- ═══════════════════════════════════════════════════════════════════════════
-- Storage buckets (public read, authenticated write)
-- ═══════════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('materials', 'materials', true),
       ('course-images', 'course-images', true),
       ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "materials_upload" on storage.objects;
create policy "materials_upload" on storage.objects
  for insert to authenticated with check (bucket_id in ('materials', 'course-images', 'avatars'));

drop policy if exists "materials_update" on storage.objects;
create policy "materials_update" on storage.objects
  for update to authenticated using (bucket_id in ('materials', 'course-images', 'avatars'));

drop policy if exists "materials_delete" on storage.objects;
create policy "materials_delete" on storage.objects
  for delete to authenticated using (bucket_id in ('materials', 'course-images', 'avatars'));
