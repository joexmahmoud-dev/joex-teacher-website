/**
 * Client-side data writes — used by interactive components (booking wizard,
 * exam runner, auth flows, admin forms). Uses the browser Supabase client,
 * so RLS governs every write. In preview mode writes report `preview: true`
 * and the UI shows the corresponding notice.
 */
import { isSupabaseConfigured } from "@/lib/db/config";
import { createClient } from "@/lib/supabase/client";
import { previewBlocked, previewOk, type WriteResult } from "@/lib/data/result";
import type { BookingStatus } from "@/lib/db/types";

const previewError = (message: string): WriteResult => ({ ok: false, error: message, preview: true });

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  const sb = createClient();
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}

/* ── Bookings ──────────────────────────────────────────────────────────── */

export interface BookingInput {
  service: string;
  booking_date: string;
  booking_time: string;
  name: string;
  phone: string;
  email?: string | null;
  grade?: string | null;
  notes?: string | null;
}

export async function createBooking(input: BookingInput): Promise<WriteResult> {
  if (!isSupabaseConfigured()) {
    // Preview: booking is handed off via WhatsApp — never silently dropped.
    return { ok: true, preview: true };
  }
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  const { data, error } = await sb
    .from("bookings")
    .insert({
      user_id: user?.id ?? null,
      service: input.service,
      booking_date: input.booking_date,
      booking_time: input.booking_time,
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      grade: input.grade ?? null,
      notes: input.notes ?? null,
      status: "pending",
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id };
}

/* ── Exam attempts ─────────────────────────────────────────────────────── */

export interface AttemptInput {
  examId: string;
  score: number;
  total: number;
  correctCount: number;
  wrongCount: number;
  answers: (number | null)[];
}

export async function saveExamAttempt(input: AttemptInput): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewOk();
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, error: "auth_required", preview: true };
  const { error } = await sb.from("exam_attempts").insert({
    user_id: user.id,
    exam_id: input.examId,
    score: input.score,
    total: input.total,
    correct_count: input.correctCount,
    wrong_count: input.wrongCount,
    answers: input.answers,
    completed_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/* ── Enrollment ────────────────────────────────────────────────────────── */

export async function enrollUser(courseId: string): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, error: "auth_required" };
  const { error } = await sb.from("enrollments").insert({
    user_id: user.id,
    course_id: courseId,
    progress_pct: 0,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateEnrollmentProgress(courseId: string, pct: number): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewOk();
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, error: "auth_required" };
  const { error } = await sb
    .from("enrollments")
    .update({ progress_pct: Math.round(Math.min(100, Math.max(0, pct))) })
    .eq("user_id", user.id)
    .eq("course_id", courseId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/* ── Profile ───────────────────────────────────────────────────────────── */

export interface ProfileInput {
  fullNameAr?: string;
  fullNameEn?: string;
  grade?: string;
  phone?: string;
}

export async function updateProfile(input: ProfileInput): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, error: "auth_required" };
  const { error } = await sb
    .from("profiles")
    .update({
      full_name_ar: input.fullNameAr ?? null,
      full_name_en: input.fullNameEn ?? null,
      grade: input.grade ?? null,
      phone: input.phone ?? null,
    })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/* ── Contact messages ──────────────────────────────────────────────────── */

export interface MessageInput {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}

export async function createMessage(input: MessageInput): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewOk();
  const sb = createClient();
  const { error } = await sb.from("messages").insert({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    message: input.message,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/* ── Admin: bookings ───────────────────────────────────────────────────── */

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const { error } = await sb.from("bookings").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/* ── Admin: generic delete (RLS restricts to teacher role) ─────────────── */

export async function deleteRow(table: string, id: string): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return previewBlocked();
  const sb = createClient();
  const { error } = await sb.from(table).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
