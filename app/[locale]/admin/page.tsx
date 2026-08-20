import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatNumber, formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  getAllCourses,
  getAllMaterials,
  getAllExams,
  getTestimonials,
  getSiteConfig,
} from "@/lib/data/server";
import {
  getAdminBookings,
  getAdminMessages,
  getAdminOverviewCounts,
} from "@/lib/data/admin-server";
import { Badge } from "@/components/ui/primitives";
import { IconBook, IconCalendar, IconClipboard, IconDoc, IconMessage, IconUsers } from "@/components/ui/icons";

export default async function AdminOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const a = dict.admin;

  const [courses, materials, exams, testimonials, config, bookings, messages, counts] =
    await Promise.all([
      getAllCourses(),
      getAllMaterials(),
      getAllExams(),
      getTestimonials(),
      getSiteConfig(),
      getAdminBookings(),
      getAdminMessages(),
      getAdminOverviewCounts(),
    ]);

  const tiles = [
    { label: a.overviewStats.courses, value: counts?.courses ?? courses.length, icon: <IconBook /> },
    { label: a.overviewStats.students, value: counts?.students ?? 0, icon: <IconUsers /> },
    { label: a.overviewStats.materials, value: counts?.materials ?? materials.length, icon: <IconDoc /> },
    { label: a.overviewStats.exams, value: counts?.exams ?? exams.length, icon: <IconClipboard /> },
    { label: a.overviewStats.bookings, value: counts?.bookings ?? 0, icon: <IconCalendar /> },
    { label: a.overviewStats.messages, value: counts?.messages ?? 0, icon: <IconMessage /> },
  ];

  const statusTone = (s: string) =>
    s === "confirmed" ? "green" : s === "pending" ? "gold" : s === "cancelled" ? "red" : "gray";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      <div className="grid grid--3" style={{ gap: "var(--sp-5)" }}>
        {tiles.map((tile) => (
          <div key={tile.label} className="stat-tile">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="stat-tile__label">{tile.label}</span>
              <span style={{ color: "var(--c-primary)" }}>{tile.icon}</span>
            </div>
            <span className="stat-tile__num">{formatNumber(tile.value, locale)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid--2" style={{ gap: "var(--sp-5)" }}>
        <div className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">{a.bookings}</h3>
          </div>
          {bookings.length === 0 ? (
            <p className="text-muted">{a.empty}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {bookings.slice(0, 6).map((b) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ fontSize: "var(--fs-sm)", display: "block" }}>
                      {b.name} · <span dir="ltr">{b.booking_time}</span>
                    </strong>
                    <span className="text-faint" style={{ fontSize: "var(--fs-xs)" }}>
                      {formatDate(b.booking_date, locale)}
                    </span>
                  </div>
                  <Badge tone={statusTone(b.status) as "green" | "gold" | "red" | "gray"}>{b.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">{a.messages}</h3>
          </div>
          {messages.length === 0 ? (
            <p className="text-muted">{a.noMessages}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {messages.slice(0, 6).map((m) => (
                <div key={m.id}>
                  <strong style={{ fontSize: "var(--fs-sm)", display: "block" }}>{m.name}</strong>
                  <p className="text-faint" style={{ fontSize: "var(--fs-xs)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
