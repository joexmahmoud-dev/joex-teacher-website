import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPublishedCourses } from "@/lib/data/server";
import { seoMetadata, breadcrumbSchema } from "@/lib/seo";
import { CourseFilters } from "@/components/courses/CourseFilters";

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
    path: "/courses",
    title: dict.meta.coursesTitle,
    description: dict.meta.coursesDescription,
  });
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const courses = await getPublishedCourses();

  const breadcrumb = breadcrumbSchema(
    [{ name: dict.nav.home, path: "/" }, { name: dict.nav.courses, path: "/courses" }],
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
            <span>{dict.nav.courses}</span>
          </nav>
          <p className="eyebrow">{dict.nav.courses}</p>
          <h1>{dict.courses.title}</h1>
          <p className="lead">{dict.courses.subtitle}</p>
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          <CourseFilters courses={courses} locale={locale} dict={dict} prefix={prefix} />
        </div>
      </section>
    </>
  );
}
