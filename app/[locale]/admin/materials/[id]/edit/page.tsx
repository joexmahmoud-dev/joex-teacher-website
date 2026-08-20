import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAllMaterials } from "@/lib/data/server";
import { MaterialForm } from "@/components/admin/MaterialForm";
import { Card } from "@/components/ui/primitives";

export default async function EditMaterial({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const materials = await getAllMaterials();
  const material = materials.find((m) => m.id === id) ?? null;
  if (!material) notFound();

  return (
    <Card className="dash-card">
      <div className="dash-card__head">
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.admin.edit}</h2>
      </div>
      <MaterialForm dict={dict} material={material} cancelHref={`/${locale}/admin/materials`} />
    </Card>
  );
}
