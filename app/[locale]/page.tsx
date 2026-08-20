import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  getSiteConfig,
  getPublishedCourses,
  getTestimonials,
  getFaqs,
  getPublishedMaterials,
} from "@/lib/data/server";
import { seoMetadata, faqSchema } from "@/lib/seo";
import { HeroSection } from "@/components/home/HeroSection";
import { StatBand } from "@/components/home/StatBand";
import { MethodSection } from "@/components/home/MethodSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";
import { CourseCard } from "@/components/courses/CourseCard";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { SectionHeading, Button } from "@/components/ui/primitives";
import { IconArrow } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/motion";

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
    path: "/",
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;

  const [config, courses, testimonials, faqs, materials] = await Promise.all([
    getSiteConfig(),
    getPublishedCourses(),
    getTestimonials(),
    getFaqs(),
    getPublishedMaterials(),
  ]);

  const featuredCourses = courses.slice(0, 6);
  const previewMaterials = materials.slice(0, 3);
  const previewTestimonials = testimonials.slice(0, 3);
  const faqJsonLd = faqSchema(faqs, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <HeroSection locale={locale} dict={dict} config={config} testimonials={testimonials} />
      <StatBand locale={locale} dict={dict} config={config} />

      {/* Courses */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow={dict.nav.courses}
            title={dict.courses.title}
            lead={dict.courses.subtitle}
          />
          <div className="grid grid--3">
            {featuredCourses.map((course, i) => (
              <Reveal key={course.id} delay={i * 80}>
                <CourseCard course={course} locale={locale} dict={dict} prefix={prefix} />
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginBlockStart: "var(--sp-8)" }}>
            <Button href={`${prefix}/courses`} variant="outline" icon={<IconArrow />}>
              {dict.courses.viewAll}
            </Button>
          </div>
        </div>
      </section>

      <MethodSection locale={locale} dict={dict} />

      {/* Materials */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading
            eyebrow={dict.nav.materials}
            title={dict.materials.title}
            lead={dict.materials.subtitle}
          />
          <div className="grid grid--3">
            {previewMaterials.map((material, i) => (
              <Reveal key={material.id} delay={i * 80}>
                <MaterialCard material={material} locale={locale} dict={dict} />
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginBlockStart: "var(--sp-8)" }}>
            <Button href={`${prefix}/materials`} variant="outline" icon={<IconArrow />}>
              {dict.common.viewAll}
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <SectionHeading
            center
            eyebrow={dict.nav.testimonials}
            title={dict.testimonials.title}
            lead={dict.testimonials.subtitle}
          />
          <div className="grid grid--3">
            {previewTestimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <TestimonialCard testimonial={t} locale={locale} dict={dict} />
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginBlockStart: "var(--sp-8)" }}>
            <Button href={`${prefix}/testimonials`} variant="ghost">
              {dict.common.viewAll}
            </Button>
          </div>
        </div>
      </section>

      <FaqSection locale={locale} dict={dict} faqs={faqs} />
      <FinalCta locale={locale} dict={dict} config={config} />
    </>
  );
}
