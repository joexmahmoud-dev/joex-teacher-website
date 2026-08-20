/**
 * Admin data operations — called from Teacher Dashboard client components.
 * Every write is guarded by RLS (teacher role). In preview mode all writes
 * are blocked with a clear `preview: true` result.
 */
import { isSupabaseConfigured } from "@/lib/db/config";
import { createClient } from "@/lib/supabase/client";
import { previewBlocked, type WriteResult } from "@/lib/data/result";
import type { SiteConfig, Difficulty } from "@/lib/db/types";

/* ── Courses + lessons ─────────────────────────────────────────────────── */

export interface LessonDraft {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  duration_minutes: number;
  sort_order: number;
}

export interface CourseDraft {
  id?: string;
  slug: string;
  subject_ar: string;
  subject_en: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  what_you_learn_ar: string[];
  what_you_learn_en: string[];
  grade: string;
  price: number;
  duration_weeks: number;
  image_url: string | null;
  status: "published" | "draft";
  featured: boolean;
  sort_order: number;
  lessons: LessonDraft[];
}

export async function saveCourse(draft: CourseDraft): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const payload = {
    slug: draft.slug,
    subject_ar: draft.subject_ar,
    subject_en: draft.subject_en,
    title_ar: draft.title_ar,
    title_en: draft.title_en,
    description_ar: draft.description_ar,
    description_en: draft.description_en,
    what_you_learn_ar: draft.what_you_learn_ar,
    what_you_learn_en: draft.what_you_learn_en,
    grade: draft.grade,
    price: draft.price,
    duration_weeks: draft.duration_weeks,
    image_url: draft.image_url,
    status: draft.status,
    featured: draft.featured,
    sort_order: draft.sort_order,
  };

  let courseId = draft.id ?? "";
  if (draft.id) {
    const { error } = await sb.from("courses").update(payload).eq("id", draft.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await sb.from("courses").insert(payload).select("id").single();
    if (error) return { ok: false, error: error.message };
    courseId = data.id;
  }

  // Replace lessons (simple, idempotent at admin scale).
  const { error: delError } = await sb.from("lessons").delete().eq("course_id", courseId);
  if (delError) return { ok: false, error: delError.message };
  if (draft.lessons.length) {
    const { error: insError } = await sb.from("lessons").insert(
      draft.lessons.map((l) => ({ ...l, course_id: courseId }))
    );
    if (insError) return { ok: false, error: insError.message };
  }
  return { ok: true, id: courseId };
}

/* ── Materials ─────────────────────────────────────────────────────────── */

export interface MaterialDraft {
  id?: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  subject_ar: string;
  subject_en: string;
  grade: string;
  file_url: string;
  file_type: string;
  file_size_kb: number;
  status: "published" | "draft";
}

export async function saveMaterial(draft: MaterialDraft): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const payload = {
    title_ar: draft.title_ar,
    title_en: draft.title_en,
    description_ar: draft.description_ar,
    description_en: draft.description_en,
    subject_ar: draft.subject_ar,
    subject_en: draft.subject_en,
    grade: draft.grade,
    file_url: draft.file_url,
    file_type: draft.file_type,
    file_size_kb: draft.file_size_kb,
    status: draft.status,
  };
  if (draft.id) {
    const { error } = await sb.from("materials").update(payload).eq("id", draft.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: draft.id };
  }
  const { data, error } = await sb.from("materials").insert(payload).select("id").single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id };
}

/* ── Exams + questions ─────────────────────────────────────────────────── */

export interface QuestionDraft {
  question_ar: string;
  question_en: string;
  options_ar: string[];
  options_en: string[];
  correct_index: number;
  explanation_ar: string;
  explanation_en: string;
  sort_order: number;
}

export interface ExamDraft {
  id?: string;
  title_ar: string;
  title_en: string;
  subject_ar: string;
  subject_en: string;
  grade: string;
  difficulty: Difficulty;
  duration_minutes: number;
  is_available: boolean;
  sort_order: number;
  questions: QuestionDraft[];
}

export async function saveExam(draft: ExamDraft): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const payload = {
    title_ar: draft.title_ar,
    title_en: draft.title_en,
    subject_ar: draft.subject_ar,
    subject_en: draft.subject_en,
    grade: draft.grade,
    difficulty: draft.difficulty,
    duration_minutes: draft.duration_minutes,
    is_available: draft.is_available,
    sort_order: draft.sort_order,
  };
  let examId = draft.id ?? "";
  if (draft.id) {
    const { error } = await sb.from("exams").update(payload).eq("id", draft.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await sb.from("exams").insert(payload).select("id").single();
    if (error) return { ok: false, error: error.message };
    examId = data.id;
  }

  const { error: delError } = await sb.from("exam_questions").delete().eq("exam_id", examId);
  if (delError) return { ok: false, error: delError.message };
  if (draft.questions.length) {
    const { error: insError } = await sb.from("exam_questions").insert(
      draft.questions.map((q) => ({ ...q, exam_id: examId }))
    );
    if (insError) return { ok: false, error: insError.message };
  }
  return { ok: true, id: examId };
}

/* ── Announcements ─────────────────────────────────────────────────────── */

export interface AnnouncementDraft {
  id?: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
}

export async function saveAnnouncement(draft: AnnouncementDraft): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const payload = {
    title_ar: draft.title_ar,
    title_en: draft.title_en,
    content_ar: draft.content_ar,
    content_en: draft.content_en,
    is_published: draft.is_published,
    published_at: new Date().toISOString(),
  };
  if (draft.id) {
    const { error } = await sb.from("announcements").update(payload).eq("id", draft.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: draft.id };
  }
  const { data, error } = await sb.from("announcements").insert(payload).select("id").single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id };
}

/* ── Testimonials ──────────────────────────────────────────────────────── */

export interface TestimonialDraft {
  id?: string;
  student_name_ar: string;
  student_name_en: string;
  grade: string;
  review_ar: string;
  review_en: string;
  rating: number;
  is_featured: boolean;
  is_demo: boolean;
  sort_order: number;
}

export async function saveTestimonial(draft: TestimonialDraft): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const payload = {
    student_name_ar: draft.student_name_ar,
    student_name_en: draft.student_name_en,
    grade: draft.grade,
    review_ar: draft.review_ar,
    review_en: draft.review_en,
    rating: draft.rating,
    is_featured: draft.is_featured,
    is_demo: draft.is_demo,
    sort_order: draft.sort_order,
  };
  if (draft.id) {
    const { error } = await sb.from("testimonials").update(payload).eq("id", draft.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: draft.id };
  }
  const { data, error } = await sb.from("testimonials").insert(payload).select("id").single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id };
}

/* ── Site config ───────────────────────────────────────────────────────── */

export async function saveSiteConfig(fields: Partial<SiteConfig>): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const { error } = await sb.from("site_config").update(fields).eq("id", 1);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/* ── Storage uploads ───────────────────────────────────────────────────── */

export type Bucket = "materials" | "course-images" | "avatars";

export async function uploadFile(
  bucket: Bucket,
  file: File,
  folder = ""
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "preview_mode" };
  const sb = createClient();
  const stamp = Date.now();
  const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const path = [folder, `${stamp}-${safe}`].filter(Boolean).join("/");
  const { error } = await sb.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) return { ok: false, error: error.message };
  const { data } = sb.storage.from(bucket).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
