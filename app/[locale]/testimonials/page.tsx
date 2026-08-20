import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getTestimonials, getSiteConfig } from "@/lib/data/server";
import { seoMetadata } from "@/lib/seo";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { EmptyState } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { IconStar } from "@/components/ui/icons";

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
    path: "/testimonials",
    title: dict.meta.testimonialsTitle,
    description: dict.meta.testimonialsDescription,
  });
}

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const [testimonials, config] = await Promise.all([getTestimonials(), getSiteConfig()]);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={`/${locale}`}>{dict.nav.home}</a>
            <span>/</span>
            <span>{dict.nav.testimonials}</span>
          </nav>
          <p className="eyebrow">{dict.nav.testimonials}</p>
          <h1>{dict.testimonials.title}</h1>
          <p className="lead">{dict.testimonials.subtitle}</p>
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          {testimonials.length === 0 ? (
            <EmptyState
              icon={<IconStar />}
              title={dict.testimonials.empty}
              message={dict.testimonials.emptyHint}
            />
          ) : (
            <div className="grid grid--3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 70}>
                  <TestimonialCard testimonial={t} locale={locale} dict={dict} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
