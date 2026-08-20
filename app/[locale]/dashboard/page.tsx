import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatNumber, formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isSupabaseConfigured } from "@/lib/db/config";
import { createClient } from "@/lib/supabase/server";
import {
  getEnrolledCourses,
  getUserBookings,
  getUserProfile,
  getAttemptsWithExam,
} from "@/lib/data/dashboard";
import { getPublishedAnnouncements } from "@/lib/data/server";
import { seoMetadata } from "@/lib/seo";
import { pick } from "@/lib/i18n/content";
import { Badge, Button, Card, EmptyState } from "@/components/ui/primitives";
import { ProgressBar } from "@/components/ui/motion";
import { IconArrow, IconBell, IconCalendar, IconTrendingUp } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  return seoMetadata({
    locale,
    path: "/dashboard",
    title: dict.meta.dashboardTitle,
    description: dict.meta.dashboardDescription,
  });
}

export default async function DashboardOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const d = dict.dashboard;

  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  const [profile, enrolled, bookings, attempts, announcements] = await Promise.all([
    getUserProfile(user.id),
    getEnrolledCourses(user.id),
    getUserBookings(user.id),
    getAttemptsWithExam(user.id),
    getPublishedAnnouncements(),
  ]);

  const firstName = profile?.full_name_ar || profile?.full_name_en || user.email?.split("@")[0] || "";
  const statusTone = (s: string) =>
    s === "confirmed" ? "green" : s === "pending" ? "gold" : s === "cancelled" ? "red" : "gray";
  const statusLabel = (s: string) =>
    s === "confirmed" ? d.confirmed : s === "pending" ? d.pending : s === "cancelled" ? d.cancelled : d.statusCompleted;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      <div>
        <h2 style={{ fontSize: "var(--fs-xl)" }}>
          {d.greeting}, {firstName} 👋
        </h2>
      </div>

      <div className="grid grid--2" style={{ gap: "var(--sp-5)" }}>
        {/* Courses */}
        <Card className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">{d.myCourses}</h3>
            <Link href={`${prefix}/dashboard/courses`} className="link-underline" style={{ fontSize: "var(--fs-sm)" }}>
              {d.viewAll}
            </Link>
          </div>
          {enrolled.length === 0 ? (
            <EmptyState title={d.noCourses} message={d.noCoursesHint} action={
              <Button href={`${prefix}/courses`} size="sm" icon={<IconArrow />}>{d.exploreCourses}</Button>
            } />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {enrolled.slice(0, 3).map(({ enrollment, course }) => {
                const title = pick(locale, course.title_ar, course.title_en);
                return (
                  <div key={enrollment.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBlockEnd: "0.45rem" }}>
                      <strong style={{ fontSize: "var(--fs-sm)" }}>{title}</strong>
                      <span className="text-faint" style={{ fontSize: "var(--fs-xs)", whiteSpace: "nowrap" }}>
                        {formatNumber(enrollment.progress_pct, locale)}% {d.completed}
                      </span>
                    </div>
                    <ProgressBar value={enrollment.progress_pct} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Latest results */}
        <Card className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">{d.latestResults}</h3>
            <Link href={`${prefix}/dashboard/results`} className="link-underline" style={{ fontSize: "var(--fs-sm)" }}>
              {d.viewAll}
            </Link>
          </div>
          {attempts.length === 0 ? (
            <EmptyState title={d.noResults} message={d.noResultsHint} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {attempts.slice(0, 4).map((a) => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span className="material-icon" style={{ width: "2.4rem", height: "2.4rem" }}>
                      <IconTrendingUp />
                    </span>
                    <div>
                      <strong style={{ fontSize: "var(--fs-sm)", display: "block" }}>
                        {formatNumber(a.score, locale)} / {formatNumber(a.total, locale)}
                      </strong>
                      <span className="text-faint" style={{ fontSize: "var(--fs-xs)" }}>
                        {formatDate(a.completed_at, locale)}
                      </span>
                    </div>
                  </div>
                  <Badge tone={a.score / a.total >= 0.65 ? "green" : "gold"}>
                    {formatNumber(Math.round((a.score / a.total) * 100), locale)}%
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Bookings */}
        <Card className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">{d.upcomingBookings}</h3>
            <Link href={`${prefix}/dashboard/bookings`} className="link-underline" style={{ fontSize: "var(--fs-sm)" }}>
              {d.viewAll}
            </Link>
          </div>
          {bookings.length === 0 ? (
            <EmptyState title={d.noBookings} message={d.noBookingsHint} action={
              <Button href={`${prefix}/book`} size="sm" icon={<IconCalendar />}>{d.bookNow}</Button>
            } />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                  <div>
                    <strong style={{ fontSize: "var(--fs-sm)", display: "block" }}>
                      {formatDate(b.booking_date, locale)} · <span dir="ltr">{b.booking_time}</span>
                    </strong>
                    <span className="text-faint" style={{ fontSize: "var(--fs-xs)" }}>
                      {dict.booking.services.find((s) => s.id === b.service)?.label ?? b.service}
                    </span>
                  </div>
                  <Badge tone={statusTone(b.status) as "green" | "gold" | "red" | "gray"}>
                    {statusLabel(b.status)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Announcements */}
        <Card className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">{d.recentAnnouncements}</h3>
            <Link href={`${prefix}/dashboard/announcements`} className="link-underline" style={{ fontSize: "var(--fs-sm)" }}>
              {d.viewAll}
            </Link>
          </div>
          {announcements.length === 0 ? (
            <EmptyState title={d.noAnnouncements} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {announcements.slice(0, 3).map((a) => (
                <div key={a.id} className={cn("card", "card--inset")} style={{ padding: "var(--sp-4)" }}>
                  <strong style={{ fontSize: "var(--fs-sm)", display: "block", marginBlockEnd: "0.3rem" }}>
                    {pick(locale, a.title_ar, a.title_en)}
                  </strong>
                  <p className="text-faint" style={{ fontSize: "var(--fs-xs)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <IconBell style={{ width: "0.9rem", height: "0.9rem" }} />
                    {formatDate(a.published_at, locale)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
