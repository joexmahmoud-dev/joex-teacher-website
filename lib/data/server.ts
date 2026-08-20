/**
 * Server-side data access — used by Server Components for public reads.
 * When Supabase is not configured these return bundled seed content
 * (preview mode); otherwise they query the persistent database.
 */
import { isSupabaseConfigured } from "@/lib/db/config";
import type {
  Announcement,
  Course,
  Exam,
  ExamAttempt,
  ExamQuestion,
  Faq,
  Material,
  SiteConfig,
  Testimonial,
} from "@/lib/db/types";
import { seedCourses } from "@/lib/data/seed/courses";
import { seedMaterials } from "@/lib/data/seed/materials";
import { seedExams } from "@/lib/data/seed/exams";
import { seedTestimonials } from "@/lib/data/seed/testimonials";
import { seedFaqs } from "@/lib/data/seed/faqs";
import { seedAnnouncements } from "@/lib/data/seed/announcements";
import { seedSiteConfig } from "@/lib/data/seed/site-config";
import { createClient } from "@/lib/supabase/server";

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export async function getSiteConfig(): Promise<SiteConfig> {
  if (!isSupabaseConfigured()) return clone(seedSiteConfig);
  const sb = await createClient();
  const { data, error } = await sb.from("site_config").select("*").limit(1).maybeSingle();
  if (error || !data) return clone(seedSiteConfig);
  return data as SiteConfig;
}

export async function getPublishedCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) {
    return clone(seedCourses)
      .filter((c: Course) => c.status === "published")
      .sort((a: Course, b: Course) => a.sort_order - b.sort_order);
  }
  const sb = await createClient();
  const { data, error } = await sb
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Course[];
}

export async function getAllCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) return clone(seedCourses);
  const sb = await createClient();
  const { data, error } = await sb.from("courses").select("*").order("sort_order");
  if (error || !data) return [];
  const courses = data as Course[];
  const { data: lessons } = await sb
    .from("lessons")
    .select("*")
    .in("course_id", courses.map((c) => c.id))
    .order("sort_order", { ascending: true });
  const byCourse = new Map<string, Course["lessons"]>();
  (lessons ?? []).forEach((l) => {
    const list = byCourse.get(l.course_id) ?? [];
    list.push(l);
    byCourse.set(l.course_id, list);
  });
  courses.forEach((c) => {
    c.lessons = byCourse.get(c.id) ?? [];
  });
  return courses;
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (!isSupabaseConfigured()) {
    const course = clone(seedCourses).find((c: Course) => c.slug === slug);
    return course ?? null;
  }
  const sb = await createClient();
  const { data, error } = await sb.from("courses").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  const course = data as Course;
  const { data: lessons } = await sb
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });
  course.lessons = (lessons ?? []) as Course["lessons"];
  return course;
}

export async function getPublishedMaterials(): Promise<Material[]> {
  if (!isSupabaseConfigured()) {
    return clone(seedMaterials).filter((m: Material) => m.status === "published");
  }
  const sb = await createClient();
  const { data, error } = await sb
    .from("materials")
    .select("*")
    .eq("status", "published")
    .order("upload_date", { ascending: false });
  if (error || !data) return [];
  return data as Material[];
}

export async function getAllMaterials(): Promise<Material[]> {
  if (!isSupabaseConfigured()) return clone(seedMaterials);
  const sb = await createClient();
  const { data, error } = await sb.from("materials").select("*").order("upload_date", { ascending: false });
  if (error || !data) return [];
  return data as Material[];
}

export async function getAvailableExams(): Promise<Exam[]> {
  if (!isSupabaseConfigured()) {
    return clone(seedExams)
      .filter((e: Exam) => e.is_available)
      .sort((a: Exam, b: Exam) => a.sort_order - b.sort_order);
  }
  const sb = await createClient();
  const { data, error } = await sb
    .from("exams")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Exam[];
}

export async function getAllExams(): Promise<Exam[]> {
  if (!isSupabaseConfigured()) return clone(seedExams);
  const sb = await createClient();
  const { data, error } = await sb.from("exams").select("*").order("sort_order");
  if (error || !data) return [];
  return data as Exam[];
}

export async function getExamWithQuestions(id: string): Promise<Exam | null> {
  if (!isSupabaseConfigured()) {
    const exam = clone(seedExams).find((e: Exam) => e.id === id);
    return exam ?? null;
  }
  const sb = await createClient();
  const { data, error } = await sb.from("exams").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  const exam = data as Exam;
  const { data: questions } = await sb
    .from("exam_questions")
    .select("*")
    .eq("exam_id", id)
    .order("sort_order", { ascending: true });
  exam.questions = (questions ?? []) as ExamQuestion[];
  return exam;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return clone(seedTestimonials).sort(
      (a: Testimonial, b: Testimonial) =>
        Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order
    );
  }
  const sb = await createClient();
  const { data, error } = await sb
    .from("testimonials")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Testimonial[];
}

export async function getFaqs(): Promise<Faq[]> {
  if (!isSupabaseConfigured()) return clone(seedFaqs);
  const sb = await createClient();
  const { data, error } = await sb.from("faqs").select("*").order("sort_order");
  if (error || !data) return [];
  return data as Faq[];
}

export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) {
    return clone(seedAnnouncements)
      .filter((a: Announcement) => a.is_published)
      .sort((a: Announcement, b: Announcement) => (a.published_at < b.published_at ? 1 : -1));
  }
  const sb = await createClient();
  const { data, error } = await sb
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data as Announcement[];
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) return clone(seedAnnouncements);
  const sb = await createClient();
  const { data, error } = await sb.from("announcements").select("*").order("published_at", { ascending: false });
  if (error || !data) return [];
  return data as Announcement[];
}

/** Exam attempts for a user (their results). */
export async function getAttemptsForUser(userId: string): Promise<ExamAttempt[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = await createClient();
  const { data, error } = await sb
    .from("exam_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });
  if (error || !data) return [];
  return data as ExamAttempt[];
}
