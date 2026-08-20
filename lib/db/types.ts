/**
 * Database row types — mirror the Supabase schema in
 * supabase/migrations/0001_schema.sql. Used by both the Supabase data layer
 * and the preview-mode seed fallback.
 */

export type Role = "student" | "teacher";

export interface Profile {
  id: string;
  role: Role;
  full_name_ar: string | null;
  full_name_en: string | null;
  grade: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface SiteConfig {
  teacher_name_ar: string;
  teacher_name_en: string;
  teacher_title_ar: string;
  teacher_title_en: string;
  subject_ar: string;
  subject_en: string;
  city_ar: string;
  city_en: string;
  whatsapp: string;
  phone: string;
  email: string;
  address_ar: string;
  address_en: string;
  bio_ar: string;
  bio_en: string;
  photo_url: string | null;
  facebook: string | null;
  youtube: string | null;
  tiktok: string | null;
  students_count: number;
  years_experience: number;
  success_rate: number;
  exams_count: number;
  demo_mode: boolean;
}

export interface Course {
  id: string;
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
  created_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  course_id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  duration_minutes: number;
  sort_order: number;
}

export interface Material {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  subject_ar: string;
  subject_en: string;
  grade: string;
  file_url: string;
  file_type: "pdf" | "doc" | "slides" | "video" | "image" | "other";
  file_size_kb: number;
  upload_date: string;
  downloads: number;
  status: "published" | "draft";
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Exam {
  id: string;
  title_ar: string;
  title_en: string;
  subject_ar: string;
  subject_en: string;
  grade: string;
  difficulty: Difficulty;
  duration_minutes: number;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  questions?: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_ar: string;
  question_en: string;
  options_ar: string[];
  options_en: string[];
  correct_index: number; // 0-based
  explanation_ar: string;
  explanation_en: string;
  sort_order: number;
}

export interface ExamAttempt {
  id: string;
  user_id: string | null;
  exam_id: string;
  score: number;
  total: number;
  correct_count: number;
  wrong_count: number;
  answers: number[] | null;
  started_at: string;
  completed_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress_pct: number;
  enrolled_at: string;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  user_id: string | null;
  service: string;
  booking_date: string; // YYYY-MM-DD
  booking_time: string; // HH:mm
  name: string;
  phone: string;
  email: string | null;
  grade: string | null;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
}

export interface Announcement {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  is_published: boolean;
  published_at: string;
}

export interface Testimonial {
  id: string;
  student_name_ar: string;
  student_name_en: string;
  grade: string;
  review_ar: string;
  review_en: string;
  rating: number;
  is_featured: boolean;
  is_demo: boolean;
  sort_order: number;
  created_at: string;
}

export interface Faq {
  id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}
