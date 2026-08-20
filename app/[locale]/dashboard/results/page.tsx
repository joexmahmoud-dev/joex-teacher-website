import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatNumber, formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { getAttemptsWithExam } from "@/lib/data/dashboard";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { IconTrendingUp } from "@/components/ui/icons";

export default async function DashboardResults({
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
  const attempts = await getAttemptsWithExam(user.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{d.results}</h2>
      {attempts.length === 0 ? (
        <EmptyState
          icon={<IconTrendingUp />}
          title={d.noResults}
          message={d.noResultsHint}
          action={<Button href={`${prefix}/exams`}>{dict.exams.takeExam}</Button>}
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{dict.exams.date}</th>
                <th>{dict.exams.score}</th>
                <th>{dict.examRunner.percentage}</th>
                <th>{dict.examRunner.correct}</th>
                <th>{dict.examRunner.wrong}</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td>{formatDate(a.completed_at, locale)}</td>
                  <td>
                    <strong>{formatNumber(a.score, locale)} / {formatNumber(a.total, locale)}</strong>
                  </td>
                  <td>
                    <Badge tone={a.score / a.total >= 0.65 ? "green" : "gold"}>
                      {formatNumber(Math.round((a.score / a.total) * 100), locale)}%
                    </Badge>
                  </td>
                  <td>{formatNumber(a.correct_count, locale)}</td>
                  <td>{formatNumber(a.wrong_count, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
