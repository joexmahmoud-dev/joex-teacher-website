import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { CourseForm } from "@/components/admin/CourseForm";
import { Card } from "@/components/ui/primitives";

export default async function NewCourse({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);

  return (
    <Card className="dash-card">
      <div className="dash-card__head">
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.admin.add}</h2>
      </div>
      <CourseForm dict={dict} locale={locale} course={null} cancelHref={`/${locale}/admin/courses`} />
    </Card>
  );
}
