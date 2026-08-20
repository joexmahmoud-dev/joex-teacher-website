import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSiteConfig } from "@/lib/data/server";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Card } from "@/components/ui/primitives";

export default async function AdminSettings({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const config = await getSiteConfig();

  return (
    <Card className="dash-card">
      <div className="dash-card__head">
        <div>
          <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.admin.settingsTitle}</h2>
          <p className="text-faint">{dict.admin.settingsHint}</p>
        </div>
      </div>
      <SettingsForm dict={dict} config={config} />
    </Card>
  );
}
