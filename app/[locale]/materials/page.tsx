import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPublishedMaterials } from "@/lib/data/server";
import { seoMetadata, breadcrumbSchema } from "@/lib/seo";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { EmptyState, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { IconDoc } from "@/components/ui/icons";

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
    path: "/materials",
    title: dict.meta.materialsTitle,
    description: dict.meta.materialsDescription,
  });
}

export default async function MaterialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const materials = await getPublishedMaterials();
  const hasDemoFiles = materials.some((m) => m.file_url.startsWith("/demo-files/"));

  const breadcrumb = breadcrumbSchema(
    [{ name: dict.nav.home, path: "/" }, { name: dict.nav.materials, path: "/materials" }],
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
            <span>{dict.nav.materials}</span>
          </nav>
          <p className="eyebrow">{dict.nav.materials}</p>
          <h1>{dict.materials.title}</h1>
          <p className="lead">{dict.materials.subtitle}</p>
          {hasDemoFiles ? <Badge tone="demo">{dict.materials.demoNote}</Badge> : null}
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          {materials.length === 0 ? (
            <EmptyState
              icon={<IconDoc />}
              title={dict.materials.empty}
              message={dict.materials.emptyHint}
            />
          ) : (
            <div className="grid grid--3">
              {materials.map((m, i) => (
                <Reveal key={m.id} delay={i * 70}>
                  <MaterialCard material={m} locale={locale} dict={dict} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
