import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isSupabaseConfigured } from "@/lib/db/config";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/data/dashboard";
import { AdminNav } from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/primitives";

/**
 * Teacher dashboard guard:
 * - Preview mode (no Supabase): read-only preview with a notice.
 * - Configured: requires a signed-in user with role "teacher".
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;

  let authorized = false;
  let preview = false;

  if (!isSupabaseConfigured()) {
    preview = true;
    authorized = true; // read-only preview of the admin UI
  } else {
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (user) {
      const profile = await getUserProfile(user.id);
      authorized = profile?.role === "teacher";
    }
    if (!authorized) redirect(`${prefix}/login`);
  }

  return (
    <section className="section section--tight">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBlockEnd: "var(--sp-2)" }}>
          <h1 className="dash__title" style={{ marginBlockEnd: 0 }}>{dict.admin.title}</h1>
          <a href={prefix} className="link-underline" style={{ fontSize: "var(--fs-sm)" }}>
            {dict.admin.backToSite}
          </a>
        </div>
        <p className="dash__subtitle">{dict.admin.subtitle}</p>
        {preview ? (
          <Badge tone="demo" style={{ marginBlockEnd: "var(--sp-5)" }}>{dict.admin.previewNotice}</Badge>
        ) : null}
        <div className="dash">
          <AdminNav locale={locale} dict={dict} />
          <div style={{ minWidth: 0 }}>{children}</div>
        </div>
      </div>
    </section>
  );
}
