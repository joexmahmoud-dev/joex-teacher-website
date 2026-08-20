import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSiteConfig } from "@/lib/data/server";
import { siteUrl } from "@/lib/db/config";
import { personSchema, orgSchema } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PreviewBanner } from "@/components/layout/PreviewBanner";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { isSupabaseConfigured } from "@/lib/db/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);

  return {
    title: {
      default: dict.meta.homeTitle,
      template: `%s`,
    },
    description: dict.meta.homeDescription,
    keywords: [
      "math teacher cairo",
      "مدرس رياضيات",
      "مدرس رياضيات القاهرة",
      "secondary math",
      "online math lessons egypt",
      "حصة رياضيات أونلاين",
      "algebra calculus teacher",
    ],
    icons: {
      icon: "/app-icon.svg",
      apple: "/icon-192.png",
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      siteName: dict.brand.role,
      images: [{ url: `${siteUrl}/images/og.png`, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        ar: `${siteUrl}/ar`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/ar`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const config = await getSiteConfig();
  const brandName = locale === "ar" ? config.teacher_name_ar : config.teacher_name_en;

  const jsonLd = [personSchema(config), orgSchema(config)];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar locale={locale} dict={dict} brandName={brandName} />
      <PreviewBanner message={dict.common.previewMode} />
      <main>{children}</main>
      <Footer locale={locale} dict={dict} config={config} />
      <WhatsAppFab phone={config.whatsapp} message={dict.whatsapp.hello} />
    </>
  );
}
