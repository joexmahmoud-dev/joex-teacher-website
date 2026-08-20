import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSiteConfig } from "@/lib/data/server";
import { seoMetadata, breadcrumbSchema } from "@/lib/seo";
import { Badge } from "@/components/ui/primitives";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { isSupabaseConfigured } from "@/lib/db/config";

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
    path: "/book",
    title: dict.meta.bookingTitle,
    description: dict.meta.bookingDescription,
  });
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const config = await getSiteConfig();
  const t = dict.booking;

  const breadcrumb = breadcrumbSchema(
    [{ name: dict.nav.home, path: "/" }, { name: dict.nav.bookCta, path: "/book" }],
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
            <span>{dict.nav.bookCta}</span>
          </nav>
          <p className="eyebrow">{dict.nav.bookCta}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.subtitle}</p>
          {!isSupabaseConfigured() ? <Badge tone="demo">{t.previewNotice}</Badge> : null}
        </div>
      </div>

      <section className="section section--tight">
        <div className="container" style={{ maxWidth: "52rem" }}>
          <BookingWizard locale={locale} dict={dict} config={config} />
        </div>
      </section>
    </>
  );
}
