import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatNumber } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { getEnrolledCourses } from "@/lib/data/dashboard";
import { pick } from "@/lib/i18n/content";
import { Button, Card, EmptyState } from "@/components/ui/primitives";
import { ProgressBar } from "@/components/ui/motion";
import { IconArrow, IconBook } from "@/components/ui/icons";

export default async function DashboardCourses({
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
  const enrolled = await getEnrolledCourses(user.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{d.myCourses}</h2>
      {enrolled.length === 0 ? (
        <EmptyState
          icon={<IconBook />}
          title={d.noCourses}
          message={d.noCoursesHint}
          action={<Button href={`${prefix}/courses`} icon={<IconArrow />}>{d.exploreCourses}</Button>}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {enrolled.map(({ enrollment, course }) => {
            const title = pick(locale, course.title_ar, course.title_en);
            const pct = enrollment.progress_pct;
            return (
              <Card key={enrollment.id} className="dash-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontSize: "var(--fs-lg)" }}>{title}</h3>
                    <span className="course-card__grade">{course.grade}</span>
                  </div>
                  <span className="text-faint">
                    {formatNumber(pct, locale)}% {d.completed}
                  </span>
                </div>
                <ProgressBar value={pct} />
                <div>
                  {pct === 0 ? (
                    <Button href={`${prefix}/courses/${course.slug}`} size="sm" icon={<IconArrow />}>
                      {d.startCourse}
                    </Button>
                  ) : (
                    <Button href={`${prefix}/courses/${course.slug}`} size="sm" variant="outline" icon={<IconArrow />}>
                      {d.continueLearning}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
