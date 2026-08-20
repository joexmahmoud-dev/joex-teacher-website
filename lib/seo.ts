import type { Metadata } from "next";
import { siteUrl } from "@/lib/db/config";
import type { Locale } from "@/lib/i18n/config";
import type { Course, Faq, SiteConfig } from "@/lib/db/types";

/** Relative page path inside a locale, e.g. "/courses" (no locale prefix). */
export function localizedUrl(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}/${locale}${clean === "/" ? "" : clean}`;
}

/** Per-locale metadata with canonical + hreflang + OG. */
export function seoMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const ogImage = image ?? `${siteUrl}/images/og.png`;
  return {
    title,
    description,
    alternates: {
      canonical: localizedUrl(locale, path),
      languages: {
        ar: localizedUrl("ar", path),
        en: localizedUrl("en", path),
        "x-default": localizedUrl("ar", path),
      },
    },
    openGraph: {
      title,
      description,
      url: localizedUrl(locale, path),
      siteName: "Mr. Karim Hassan | Mathematics",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/* ── JSON-LD builders (only emit fields that exist) ────────────────────── */

export function personSchema(cfg: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: cfg.teacher_name_en,
    alternateName: cfg.teacher_name_ar,
    jobTitle: cfg.teacher_title_en,
    knowsAbout: [cfg.subject_en],
    address: { "@type": "PostalAddress", addressLocality: cfg.city_en, addressCountry: "EG" },
    ...(cfg.phone ? { telephone: cfg.phone } : {}),
    ...(cfg.email ? { email: cfg.email } : {}),
    ...(cfg.photo_url
      ? { image: cfg.photo_url.startsWith("http") ? cfg.photo_url : `${siteUrl}${cfg.photo_url}` }
      : {}),
    ...(cfg.bio_en ? { description: cfg.bio_en } : {}),
  };
}

export function orgSchema(cfg: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: cfg.teacher_name_en,
    alternateName: cfg.teacher_name_ar,
    url: siteUrl,
    address: { "@type": "PostalAddress", addressLocality: cfg.city_en, addressCountry: "EG" },
    ...(cfg.phone ? { telephone: cfg.phone } : {}),
  };
}

export function courseSchema(course: Course, locale: Locale, cfg: SiteConfig) {
  const title = locale === "ar" ? course.title_ar : course.title_en;
  const description = locale === "ar" ? course.description_ar : course.description_en;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description,
    url: localizedUrl(locale, `/courses/${course.slug}`),
    ...(course.image_url ? { image: course.image_url.startsWith("http") ? course.image_url : `${siteUrl}${course.image_url}` } : {}),
    ...(course.price ? { offers: { "@type": "Offer", price: course.price, priceCurrency: "EGP" } } : {}),
    provider: {
      "@type": "Person",
      name: cfg.teacher_name_en,
      jobTitle: cfg.teacher_title_en,
      knowsAbout: [cfg.subject_en],
    },
    ...(course.lessons?.length
      ? {
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Online",
            courseWorkload: `PT${(course.lessons?.length ?? 0) * 60}M`,
          },
        }
      : {}),
  };
}

export function faqSchema(faqs: Faq[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: locale === "ar" ? f.question_ar : f.question_en,
      acceptedAnswer: {
        "@type": "Answer",
        text: locale === "ar" ? f.answer_ar : f.answer_en,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}
