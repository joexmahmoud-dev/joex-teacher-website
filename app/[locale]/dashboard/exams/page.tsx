import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAvailableExams } from "@/lib/data/server";
import { pick } from "@/lib/i18n/content";
import { Button, Card } from "@/components/ui/primitives";
import { IconArrow, IconClipboard } from "@/components/ui/icons";

export default async function DashboardExams({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const exams = await getAvailableExams();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.dashboard.exams}</h2>
      <p className="text-muted" style={{ marginBlockEnd: 0 }}>{dict.exams.subtitle}</p>
      {exams.length === 0 ? (
        <p className="text-muted">{dict.exams.empty}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {exams.map((exam) => (
            <Card key={exam.id} className="dash-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <span className="material-icon">
                  <IconClipboard />
                </span>
                <div>
                  <h3 style={{ fontSize: "var(--fs-base)" }}>{pick(locale, exam.title_ar, exam.title_en)}</h3>
                  <span className="text-faint" style={{ fontSize: "var(--fs-xs)" }}>
                    {exam.grade} · {exam.duration_minutes} {dict.exams.minutes.many}
                  </span>
                </div>
              </div>
              <Button href={`${prefix}/exams/${exam.id}`} size="sm" icon={<IconArrow />}>
                {dict.exams.startExam}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
