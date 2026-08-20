import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAllAnnouncements } from "@/lib/data/server";
import { pick } from "@/lib/i18n/content";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/admin/AdminFormKit";
import { IconBell, IconEdit, IconPlus } from "@/components/ui/icons";
import Link from "next/link";

export default async function AdminAnnouncements({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}/admin/announcements`;
  const a = dict.admin;
  const announcements = await getAllAnnouncements();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{a.announcements}</h2>
        <Button href={`${prefix}/new`} size="sm" icon={<IconPlus />}>{a.add}</Button>
      </div>

      {announcements.length === 0 ? (
        <EmptyState icon={<IconBell />} title={a.empty} message={a.emptyHint} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {announcements.map((ann) => (
            <div key={ann.id} className="dash-card" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <strong style={{ display: "block" }}>{pick(locale, ann.title_ar, ann.title_en)}</strong>
                <span className="text-faint" style={{ fontSize: "var(--fs-xs)" }}>
                  {formatDate(ann.published_at, locale)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Badge tone={ann.is_published ? "green" : "gray"}>
                  {ann.is_published ? a.published : a.draft}
                </Badge>
                <Link href={`${prefix}/${ann.id}/edit`} className="icon-btn" aria-label={a.edit}>
                  <IconEdit />
                </Link>
                <DeleteButton dict={dict} table="announcements" id={ann.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
