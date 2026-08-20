import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSiteConfig } from "@/lib/data/server";
import { seoMetadata, breadcrumbSchema } from "@/lib/seo";
import { pick } from "@/lib/i18n/content";
import { Badge, Button, DemoBadge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { MethodSection } from "@/components/home/MethodSection";
import { IconBook, IconQuote, IconTrendingUp } from "@/components/ui/icons";
import { formatNumber } from "@/lib/i18n/config";

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
    path: "/about",
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const config = await getSiteConfig();

  const name = pick(locale, config.teacher_name_ar, config.teacher_name_en);
  const title = pick(locale, config.teacher_title_ar, config.teacher_title_en);
  const bio = pick(locale, config.bio_ar, config.bio_en);
  const city = pick(locale, config.city_ar, config.city_en);
  const subject = pick(locale, config.subject_ar, config.subject_en);
  const portrait =
    config.photo_url?.startsWith("http")
      ? config.photo_url
      : config.photo_url ?? "/images/teacher-portrait.png";

  // Clearly-marked demo milestones — replaced once real details are provided.
  const milestones = [
    {
      year: locale === "ar" ? "منذ ٨ سنوات" : "8 years ago",
      text: locale === "ar" ? "بدأ رحلة التدريس في القاهرة (بيانات تجريبية)" : "Started the teaching journey in Cairo (demo entry)",
    },
    {
      year: locale === "ar" ? "اليوم" : "Today",
      text: locale === "ar" ? "دروس أونلاين وحضوري + امتحانات تصحيح فوري (بيانات تجريبية)" : "Online & in-person lessons plus instant-graded exams (demo entry)",
    },
  ];

  const breadcrumb = breadcrumbSchema(
    [{ name: dict.nav.home, path: "/" }, { name: dict.nav.about, path: "/about" }],
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
            <span>{dict.nav.about}</span>
          </nav>
          <p className="eyebrow">{subject} · {city}</p>
          <h1>{dict.about.title}</h1>
          <p className="lead">{dict.about.subtitle}</p>
          {config.demo_mode ? <DemoBadge label={dict.about.demoNote} /> : null}
        </div>
      </div>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="hero__grid">
            <Reveal variant="right">
              <div className="hero__visual">
                <div className="hero__frame" aria-hidden="true" />
                <div className="hero__portrait">
                  <Image src={portrait} alt={name} fill sizes="(max-width: 1024px) 82vw, 24rem" />
                </div>
              </div>
            </Reveal>
            <Reveal variant="left">
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <p className="eyebrow">{dict.about.sections.story}</p>
                <h2 style={{ fontSize: "var(--h2)" }}>{name}</h2>
                <p className="lead" style={{ marginBlockEnd: 0 }}>{title}</p>
                <p className="text-muted" style={{ lineHeight: 1.9 }}>{bio}</p>
                <div className="course-card__meta" style={{ fontSize: "var(--fs-sm)" }}>
                  <Badge tone="green">
                    <IconTrendingUp /> {formatNumber(config.years_experience, locale)}+ {dict.about.experience}
                  </Badge>
                  <Badge tone="gold">
                    {formatNumber(config.students_count, locale)}+ {dict.about.studentsTaught}
                  </Badge>
                </div>
                <div className="hero__ctas">
                  <Button href={`${prefix}/book`} icon={<IconBook />}>{dict.about.cta}</Button>
                  <Button href={`${prefix}/courses`} variant="outline">{dict.about.ctaSecondary}</Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <MethodSection locale={locale} dict={dict} />

      {/* Philosophy */}
      <section className="section section--dark">
        <div className="container" style={{ maxWidth: "46rem", textAlign: "center" }}>
          <Reveal>
            <span
              className="material-icon"
              style={{ background: "rgba(255,255,255,0.12)", color: "var(--c-accent)", margin: "0 auto 1.5rem" }}
            >
              <IconQuote />
            </span>
            <h2 style={{ fontSize: "var(--h2)", color: "#fff", lineHeight: 1.5 }}>
              {dict.about.heroLine}
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Milestones (demo-marked) */}
      <section className="section">
        <div className="container" style={{ maxWidth: "44rem" }}>
          <h3 style={{ fontSize: "var(--fs-xl)", marginBlockEnd: "var(--sp-6)" }}>
            {dict.about.sections.achievements}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {milestones.map((m) => (
              <Reveal key={m.year}>
                <div className="card card--inset" style={{ padding: "var(--sp-5) var(--sp-6)", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 800, color: "var(--c-primary)", whiteSpace: "nowrap", minWidth: "6rem" }}>{m.year}</span>
                  <div>
                    <p>{m.text}</p>
                    {config.demo_mode ? <DemoBadge label={dict.common.demo} /> : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
