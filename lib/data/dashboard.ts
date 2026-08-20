/**
 * Student-dashboard data — user-scoped reads via the server client (RLS
 * limits results to the signed-in user's own rows).
 */
import { isSupabaseConfigured } from "@/lib/db/config";
import { createClient } from "@/lib/supabase/server";
import type { Booking, Course, Enrollment, ExamAttempt, Profile } from "@/lib/db/types";

export interface EnrolledCourse {
  enrollment: Enrollment;
  course: Course;
}

export async function getEnrolledCourses(userId: string): Promise<EnrolledCourse[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = await createClient();
  const { data, error } = await sb
    .from("enrollments")
    .select("*, course:courses(*)")
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => ({
    enrollment: row as unknown as Enrollment,
    course: row.course as Course,
  }));
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = await createClient();
  const { data, error } = await sb
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("booking_date", { ascending: false });
  if (error || !data) return [];
  return data as Booking[];
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = await createClient();
  const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

export async function getAttemptsWithExam(userId: string): Promise<ExamAttempt[]> {
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
