import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getExamWithQuestions } from "@/lib/data/server";
import { seoMetadata } from "@/lib/seo";
import { isSupabaseConfigured } from "@/lib/db/config";
import { ExamRunner } from "@/components/exams/ExamRunner";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const exam = await getExamWithQuestions(id);
  if (!exam) return {};
  const title = locale === "ar" ? exam.title_ar : exam.title_en;
  return seoMetadata({
    locale,
    path: `/exams/${exam.id}`,
    title: `${title} | ${dict.exams.title}`,
    description: `${title} — ${dict.exams.subtitle}`,
  });
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;

  const exam = await getExamWithQuestions(id);
  if (!exam || !exam.is_available) notFound();

  let canSave = false;
  if (isSupabaseConfigured()) {
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    canSave = Boolean(user);
  }

  return (
    <div className="page-hero" style={{ paddingBlockEnd: "clamp(1.5rem, 4vw, 2.5rem)" }}>
      <div className="container" style={{ maxWidth: "52rem" }}>
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href={`${prefix}/exams`}>{dict.exams.title}</a>
          <span>/</span>
          <span>{locale === "ar" ? exam.title_ar : exam.title_en}</span>
        </nav>
        <ExamRunner exam={exam} locale={locale} dict={dict} prefix={prefix} canSave={canSave} />
      </div>
    </div>
  );
}
