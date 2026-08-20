import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getExamWithQuestions } from "@/lib/data/server";
import { ExamForm } from "@/components/admin/ExamForm";
import { Card } from "@/components/ui/primitives";

export default async function EditExam({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const exam = await getExamWithQuestions(id);
  if (!exam) notFound();

  return (
    <Card className="dash-card">
      <div className="dash-card__head">
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.admin.edit}</h2>
      </div>
      <ExamForm dict={dict} exam={exam} cancelHref={`/${locale}/admin/exams`} />
    </Card>
  );
}
