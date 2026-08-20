import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatNumber, formatPrice } from "@/lib/i18n/config";
import { countLabel } from "@/lib/i18n/plural";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getCourseBySlug, getSiteConfig, getTestimonials } from "@/lib/data/server";
import { seoMetadata, courseSchema, breadcrumbSchema } from "@/lib/seo";
import { pick, pickList } from "@/lib/i18n/content";
import { siteUrl } from "@/lib/db/config";
import { Badge, Button, Card, DemoBadge } from "@/components/ui/primitives";
import { Accordion } from "@/components/ui/overlay";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Reveal } from "@/components/ui/motion";
import {
  IconArrow,
  IconBook,
  IconCheck,
  IconClock,
  IconUsers,
  IconWhatsApp,
} from "@/components/ui/icons";
import { whatsappLink } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  const title = pick(locale, course.title_ar, course.title_en);
  const description = pick(locale, course.description_ar, course.description_en);
  return seoMetadata({
    locale,
    path: `/courses/${course.slug}`,
    title: `${title} | ${dict.brand.role}`,
    description,
    image: course.image_url ?? undefined,
  });
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const [course, config, testimonials] = await Promise.all([
    getCourseBySlug(slug),
    getSiteConfig(),
    getTestimonials(),
  ]);

  if (!course) notFound();

  const d = dict.courses.detail;
  const title = pick(locale, course.title_ar, course.title_en);
  const subject = pick(locale, course.subject_ar, course.subject_en);
  const description = pick(locale, course.description_ar, course.description_en);
  const learn = pickList(locale, course.what_you_learn_ar, course.what_you_learn_en);
  const teacherName = pick(locale, config.teacher_name_ar, config.teacher_name_en);
  const lessonsCount = course.lessons?.length ?? 0;

  const curriculumItems = (course.lessons ?? []).map((lesson, i) => ({
    id: lesson.id,
    title: (
      <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span className="step-num" style={{ background: "var(--c-primary-soft)", color: "var(--c-primary)" }}>
          {i + 1}
        </span>
        {pick(locale, lesson.title_ar, lesson.title_en)}
      </span>
    ),
    content: (
      <div>
        <p style={{ marginBlockEnd: "0.75rem" }}>{pick(locale, lesson.description_ar, lesson.description_en)}</p>
        <span className="text-faint" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          <IconClock style={{ width: "0.95rem", height: "0.95rem" }} />
          {countLabel(locale, dict.exams.minutes, lesson.duration_minutes)}
        </span>
      </div>
    ),
  }));

  const breadcrumb = breadcrumbSchema(
    [
      { name: dict.nav.home, path: "/" },
      { name: dict.nav.courses, path: "/courses" },
      { name: title, path: `/courses/${course.slug}` },
    ],
    locale
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema(course, locale, config)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={prefix}>{dict.nav.home}</a>
            <span>/</span>
            <a href={`${prefix}/courses`}>{dict.nav.courses}</a>
            <span>/</span>
            <span>{title}</span>
          </nav>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBlockEnd: "var(--sp-4)" }}>
            <Badge tone="green">{subject}</Badge>
            <Badge tone="gold">{course.grade}</Badge>
            {course.featured ? <Badge tone="dark">{dict.courses.popular}</Badge> : null}
          </div>
          <h1>{title}</h1>
          <p className="lead" style={{ maxWidth: "40rem" }}>{description}</p>
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          <div className="course-layout">
            <div style={{ minWidth: 0 }}>
              {/* Overview */}
              <div className="card card--inset" style={{ padding: "var(--sp-6)", marginBlockEnd: "var(--sp-6)" }}>
                <h2 style={{ fontSize: "var(--fs-xl)", marginBlockEnd: "var(--sp-3)" }}>{d.overview}</h2>
                <p className="text-muted" style={{ lineHeight: 1.9 }}>{description}</p>
                <p className="text-faint" style={{ marginBlockStart: "var(--sp-3)" }}>{d.startsWith}</p>
              </div>

              {/* What you'll learn */}
              <div style={{ marginBlockEnd: "var(--sp-6)" }}>
                <h2 style={{ fontSize: "var(--fs-xl)", marginBlockEnd: "var(--sp-4)" }}>{d.whatYouLearn}</h2>
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.7rem" }}>
                  {learn.map((item) => (
                    <li key={item} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <span style={{ display: "grid", placeItems: "center", width: "1.5rem", height: "1.5rem", borderRadius: "50%", background: "var(--c-primary-soft)", color: "var(--c-primary)", flexShrink: 0 }}>
                        <IconCheck style={{ width: "0.9rem", height: "0.9rem" }} />
                      </span>
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curriculum */}
              <div style={{ marginBlockEnd: "var(--sp-6)" }}>
                <h2 style={{ fontSize: "var(--fs-xl)", marginBlockEnd: "var(--sp-4)" }}>{d.curriculum}</h2>
                <Accordion items={curriculumItems} defaultOpen={curriculumItems.slice(0, 1).map((i) => i.id)} />
              </div>

              {/* Instructor */}
              <div className="card" style={{ display: "flex", gap: "var(--sp-5)", padding: "var(--sp-6)", alignItems: "center", flexWrap: "wrap" }}>
                <div className="hero__portrait" style={{ width: "5.5rem", aspectRatio: "1", border: "3px solid var(--c-surface)" }}>
                  {config.photo_url ? (
                    <Image
                      src={config.photo_url}
                      alt={teacherName}
                      fill
                      sizes="5.5rem"
                    />
                  ) : null}
                </div>
                <div style={{ flex: 1, minWidth: "12rem" }}>
                  <p className="eyebrow" style={{ marginBlockEnd: "0.35rem" }}>{d.instructor}</p>
                  <h3 style={{ fontSize: "var(--fs-lg)" }}>{teacherName}</h3>
                  <p className="text-faint">
                    {pick(locale, config.teacher_title_ar, config.teacher_title_en)}
                  </p>
                </div>
                <Button href={`${prefix}/about`} variant="outline" size="sm">
                  {dict.nav.about}
                </Button>
              </div>
            </div>

            {/* Enrollment card — sticky on desktop, block on mobile */}
            <div className="enroll-sticky">
              <Card className="dash-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {course.image_url ? (
                  <div className="card__media" style={{ aspectRatio: "16/9", borderRadius: "var(--r-md)" }}>
                    <Image src={course.image_url} alt={title} fill sizes="(max-width: 1024px) 100vw, 24rem" />
                  </div>
                ) : null}
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem" }}>
                  <span className="course-card__price">{formatPrice(course.price, locale)}</span>
                  <span className="text-faint">{formatNumber(course.price, locale)} EGP</span>
                </div>
                <div className="course-card__meta" style={{ fontSize: "var(--fs-sm)" }}>
                  <span>
                    <IconBook />
                    {countLabel(locale, dict.courses.lessons, lessonsCount)}
                  </span>
                  <span>
                    <IconClock />
                    {countLabel(locale, dict.courses.weeks, course.duration_weeks)}
                  </span>
                  <span>
                    <IconUsers />
                    {d.studentsEnrolled}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <EnrollButton courseId={course.id} locale={locale} dict={dict} prefix={prefix} />
                  <Button
                    href={whatsappLink(config.whatsapp, `${dict.whatsapp.hello} (${title})`)}
                    variant="outline"
                    block
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<IconWhatsApp />}
                  >
                    {d.whatsappEnroll}
                  </Button>
                  <Button href={`${prefix}/book`} variant="ghost" block icon={<IconArrow />}>
                    {dict.courses.bookLesson}
                  </Button>
                </div>
                {config.demo_mode ? <DemoBadge label={dict.materials.demoNote} /> : null}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {testimonials.length > 0 ? (
        <section className="section section--alt">
          <div className="container">
            <h2 style={{ fontSize: "var(--h3)", marginBlockEnd: "var(--sp-6)" }}>{d.reviews}</h2>
            <div className="grid grid--3">
              {testimonials.slice(0, 3).map((t, i) => (
                <Reveal key={t.id} delay={i * 70}>
                  <TestimonialCard testimonial={t} locale={locale} dict={dict} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
