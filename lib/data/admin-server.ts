/**
 * Teacher-dashboard reads (server side). RLS grants the teacher role
 * full read access; in preview mode these return seed data or empty lists.
 */
import { isSupabaseConfigured } from "@/lib/db/config";
import { createClient } from "@/lib/supabase/server";
import type { Booking, ContactMessage, Profile } from "@/lib/db/types";

export interface StudentWithProgress extends Profile {
  avg_progress: number;
}

export async function getAdminBookings(): Promise<Booking[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = await createClient();
  const { data, error } = await sb
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return data as Booking[];
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = await createClient();
  const { data, error } = await sb
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return data as ContactMessage[];
}

export async function getAdminStudents(): Promise<StudentWithProgress[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = await createClient();
  const { data, error } = await sb
    .from("profiles")
    .select("*, enrollments(progress_pct)")
    .eq("role", "student")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return data.map((row) => ({
    ...(row as unknown as Profile),
    avg_progress:
      (row.enrollments as { progress_pct: number }[] | undefined)?.length
        ? Math.round(
            ((row.enrollments as { progress_pct: number }[]).reduce(
              (sum, e) => sum + e.progress_pct,
              0
            ) /
              (row.enrollments as { progress_pct: number }[]).length) *
              10
          ) / 10
        : 0,
  }));
}

export async function getAdminOverviewCounts() {
  if (!isSupabaseConfigured()) return null;
  const sb = await createClient();
  const [courses, students, materials, exams, bookings, messages] = await Promise.all([
    sb.from("courses").select("id", { count: "exact", head: true }),
    sb.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    sb.from("materials").select("id", { count: "exact", head: true }),
    sb.from("exams").select("id", { count: "exact", head: true }),
    sb.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);
  return {
    courses: courses.count ?? 0,
    students: students.count ?? 0,
    materials: materials.count ?? 0,
    exams: exams.count ?? 0,
    bookings: bookings.count ?? 0,
    messages: messages.count ?? 0,
  };
}
