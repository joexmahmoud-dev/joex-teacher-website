import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { getUserBookings } from "@/lib/data/dashboard";
import { Badge, Button, Card, EmptyState } from "@/components/ui/primitives";
import { IconCalendar } from "@/components/ui/icons";

export default async function DashboardBookings({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const d = dict.dashboard;

  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const bookings = await getUserBookings(user.id);

  const statusTone = (s: string) =>
    s === "confirmed" ? "green" : s === "pending" ? "gold" : s === "cancelled" ? "red" : "gray";
  const statusLabel = (s: string) =>
    s === "confirmed" ? d.confirmed : s === "pending" ? d.pending : s === "cancelled" ? d.cancelled : d.statusCompleted;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{d.bookings}</h2>
      {bookings.length === 0 ? (
        <EmptyState
          icon={<IconCalendar />}
          title={d.noBookings}
          message={d.noBookingsHint}
          action={<Button href={`${prefix}/book`}>{d.bookNow}</Button>}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((b) => (
            <Card key={b.id} className="dash-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <strong style={{ fontSize: "var(--fs-base)" }}>
                  {formatDate(b.booking_date, locale)} · <span dir="ltr">{b.booking_time}</span>
                </strong>
                <span className="text-faint" style={{ display: "block", fontSize: "var(--fs-xs)", marginBlockStart: "0.25rem" }}>
                  {dict.booking.services.find((s) => s.id === b.service)?.label ?? b.service}
                  {b.notes ? ` — ${b.notes}` : ""}
                </span>
              </div>
              <Badge tone={statusTone(b.status) as "green" | "gold" | "red" | "gray"}>
                {statusLabel(b.status)}
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
