import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAllAnnouncements } from "@/lib/data/server";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { Card } from "@/components/ui/primitives";

export default async function EditAnnouncement({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const announcements = await getAllAnnouncements();
  const announcement = announcements.find((x) => x.id === id) ?? null;
  if (!announcement) notFound();
  return (
    <Card className="dash-card">
      <div className="dash-card__head">
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.admin.edit}</h2>
      </div>
      <AnnouncementForm dict={dict} announcement={announcement} cancelHref={`/${locale}/admin/announcements`} />
    </Card>
  );
}
