import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPublishedMaterials } from "@/lib/data/server";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { EmptyState } from "@/components/ui/primitives";
import { IconDoc } from "@/components/ui/icons";

export default async function DashboardMaterials({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const materials = await getPublishedMaterials();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.dashboard.materials}</h2>
      {materials.length === 0 ? (
        <EmptyState icon={<IconDoc />} title={dict.materials.empty} message={dict.materials.emptyHint} />
      ) : (
        <div className="grid grid--2" style={{ gap: "var(--sp-5)" }}>
          {materials.map((m) => (
            <MaterialCard key={m.id} material={m} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
