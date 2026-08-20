import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MaterialForm } from "@/components/admin/MaterialForm";
import { Card } from "@/components/ui/primitives";

export default async function NewMaterial({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);

  return (
    <Card className="dash-card">
      <div className="dash-card__head">
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.admin.add}</h2>
      </div>
      <MaterialForm dict={dict} material={null} cancelHref={`/${locale}/admin/materials`} />
    </Card>
  );
}
