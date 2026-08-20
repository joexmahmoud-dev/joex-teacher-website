import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/db/config";
import { getPublishedCourses, getAvailableExams } from "@/lib/data/server";
import { locales } from "@/lib/i18n/config";

/**
 * Multilingual sitemap — every public page in both languages with hreflang
 * alternates (Next renders <xhtml:link rel="alternate"> automatically from
 * the `alternates` field).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, exams] = await Promise.all([getPublishedCourses(), getAvailableExams()]);

  const staticPaths = [
    "",
    "/courses",
    "/materials",
    "/exams",
    "/about",
    "/testimonials",
    "/book",
    "/contact",
    "/login",
    "/register",
    "/forgot-password",
  ];

  const dynamicPaths = [
    ...courses.map((c) => `/courses/${c.slug}`),
    ...exams.map((e) => `/exams/${e.id}`),
  ];

  const allPaths = [...staticPaths, ...dynamicPaths];
  const now = new Date();

  return allPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "/courses" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteUrl}/${l}${path}`])
        ),
      },
    }))
  );
}
