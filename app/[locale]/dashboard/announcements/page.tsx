import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPublishedAnnouncements } from "@/lib/data/server";
import { pick } from "@/lib/i18n/content";
import { Card, EmptyState } from "@/components/ui/primitives";
import { IconBell } from "@/components/ui/icons";

export default async function DashboardAnnouncements({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const announcements = await getPublishedAnnouncements();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.announcements.title}</h2>
      {announcements.length === 0 ? (
        <EmptyState icon={<IconBell />} title={dict.announcements.empty} message={dict.announcements.emptyHint} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {announcements.map((a) => (
            <Card key={a.id} className="dash-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "var(--fs-lg)" }}>{pick(locale, a.title_ar, a.title_en)}</h3>
                <span className="text-faint" style={{ fontSize: "var(--fs-xs)", whiteSpace: "nowrap" }}>
                  {dict.announcements.publishedOn} {formatDate(a.published_at, locale)}
                </span>
              </div>
              <p className="text-muted" style={{ lineHeight: 1.8, marginBlockStart: "0.75rem" }}>
                {pick(locale, a.content_ar, a.content_en)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
