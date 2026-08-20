import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatNumber, formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAvailableExams, getAttemptsForUser } from "@/lib/data/server";
import { seoMetadata, breadcrumbSchema } from "@/lib/seo";
import { isSupabaseConfigured } from "@/lib/db/config";
import { ExamCard, ExamListEmpty } from "@/components/exams/ExamCard";
import { Badge, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { createClient } from "@/lib/supabase/server";
import { IconClipboard, IconTrendingUp } from "@/components/ui/icons";

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
    path: "/exams",
    title: dict.meta.examsTitle,
    description: dict.meta.examsDescription,
  });
}

export default async function ExamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const exams = await getAvailableExams();

  // Results for the signed-in student (only when Supabase is configured).
  let attempts: Awaited<ReturnType<typeof getAttemptsForUser>> = [];
  if (isSupabaseConfigured()) {
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (user) attempts = await getAttemptsForUser(user.id);
  }

  const breadcrumb = breadcrumbSchema(
    [{ name: dict.nav.home, path: "/" }, { name: dict.nav.exams, path: "/exams" }],
    locale
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={prefix}>{dict.nav.home}</a>
            <span>/</span>
            <span>{dict.nav.exams}</span>
          </nav>
          <p className="eyebrow">{dict.nav.exams}</p>
          <h1>{dict.exams.title}</h1>
          <p className="lead">{dict.exams.subtitle}</p>
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          {exams.length === 0 ? (
            <ExamListEmpty locale={locale} dict={dict} prefix={prefix} />
          ) : (
            <div className="grid grid--3">
              {exams.map((exam, i) => (
                <Reveal key={exam.id} delay={i * 70}>
                  <ExamCard exam={exam} locale={locale} dict={dict} prefix={prefix} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results history */}
      <section className="section section--tight" style={{ paddingBlockStart: 0 }}>
        <div className="container">
          <h2 style={{ fontSize: "var(--h3)", marginBlockEnd: "var(--sp-5)" }}>
            {dict.exams.yourResults}
          </h2>
          {attempts.length === 0 ? (
            <p className="text-muted">{dict.exams.noResults}</p>
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
                  {attempts.slice(0, 10).map((a) => (
                    <tr key={a.id}>
                      <td>{formatDate(a.completed_at, locale)}</td>
                      <td>
                        <strong>
                          {formatNumber(a.score, locale)} / {formatNumber(a.total, locale)}
                        </strong>
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
          {!isSupabaseConfigured() ? (
            <div style={{ marginBlockStart: "var(--sp-5)" }}>
              <Badge tone="demo">
                <IconTrendingUp /> {dict.auth.previewNotice}
              </Badge>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
