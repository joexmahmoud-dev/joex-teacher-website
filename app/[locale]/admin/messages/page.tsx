import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAdminMessages } from "@/lib/data/admin-server";
import { Avatar, EmptyState } from "@/components/ui/primitives";
import { IconMessage } from "@/components/ui/icons";

export default async function AdminMessages({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const a = dict.admin;
  const messages = await getAdminMessages();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{a.messages}</h2>
      {messages.length === 0 ? (
        <EmptyState icon={<IconMessage />} title={a.noMessages} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {messages.map((m) => (
            <div key={m.id} className="dash-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBlockEnd: "0.6rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Avatar name={m.name} />
                  <div>
                    <strong>{m.name}</strong>
                    <span className="text-faint" style={{ display: "block", fontSize: "var(--fs-xs)" }} dir="ltr">
                      {m.email}
                      {m.phone ? ` · ${m.phone}` : ""}
                    </span>
                  </div>
                </div>
                <span className="text-faint" style={{ fontSize: "var(--fs-xs)" }}>
                  {formatDate(m.created_at, locale)}
                </span>
              </div>
              <p className="text-muted" style={{ lineHeight: 1.8 }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
