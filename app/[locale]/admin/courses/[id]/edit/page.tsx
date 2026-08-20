import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAllCourses } from "@/lib/data/server";
import { CourseForm } from "@/components/admin/CourseForm";
import { Card } from "@/components/ui/primitives";

export default async function EditCourse({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const courses = await getAllCourses();
  const course = courses.find((c) => c.id === id) ?? null;
  if (!course) notFound();

  return (
    <Card className="dash-card">
      <div className="dash-card__head">
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.admin.edit}</h2>
      </div>
      <CourseForm dict={dict} locale={locale} course={course} cancelHref={`/${locale}/admin/courses`} />
    </Card>
  );
}
