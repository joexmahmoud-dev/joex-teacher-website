import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAdminBookings } from "@/lib/data/admin-server";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { BookingActions } from "@/components/admin/BookingActions";
import { IconCalendar } from "@/components/ui/icons";

export default async function AdminBookings({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const a = dict.admin;
  const bookings = await getAdminBookings();

  const statusTone = (s: string) =>
    s === "confirmed" ? "green" : s === "pending" ? "gold" : s === "cancelled" ? "red" : "gray";
  const statusLabel = (s: string) =>
    s === "confirmed"
      ? dict.dashboard.confirmed
      : s === "pending"
      ? dict.dashboard.pending
      : s === "cancelled"
      ? dict.dashboard.cancelled
      : dict.dashboard.statusCompleted;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{a.bookings}</h2>
      {bookings.length === 0 ? (
        <EmptyState icon={<IconCalendar />} title={a.empty} message={a.emptyHint} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{a.bookingFields.name}</th>
                <th>{a.bookingFields.service}</th>
                <th>{a.bookingFields.date}</th>
                <th>{a.bookingFields.time}</th>
                <th>{a.bookingFields.status}</th>
                <th>{a.actions}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.name}</strong>
                    <span className="text-faint" style={{ display: "block", fontSize: "var(--fs-xs)" }} dir="ltr">
                      {b.phone}
                    </span>
                  </td>
                  <td>{dict.booking.services.find((s) => s.id === b.service)?.label ?? b.service}</td>
                  <td>{formatDate(b.booking_date, locale)}</td>
                  <td dir="ltr">{b.booking_time}</td>
                  <td>
                    <Badge tone={statusTone(b.status) as "green" | "gold" | "red" | "gray"}>
                      {statusLabel(b.status)}
                    </Badge>
                  </td>
                  <td>
                    <BookingActions dict={dict} id={b.id} status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
