import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isSupabaseConfigured } from "@/lib/db/config";
import { createClient } from "@/lib/supabase/server";
import { DashNav } from "@/components/dashboard/DashNav";

export default async function DashboardLayout({
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

  // Preview mode or missing session → login (login page explains activation).
  if (!isSupabaseConfigured()) {
    redirect(`${prefix}/login`);
  }
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    redirect(`${prefix}/login`);
  }

  return (
    <section className="section section--tight">
      <div className="container">
        <h1 className="dash__title">{dict.dashboard.title}</h1>
        <p className="dash__subtitle">{dict.dashboard.subtitle}</p>
        <div className="dash">
          <DashNav locale={locale} dict={dict} />
          <div style={{ minWidth: 0 }}>{children}</div>
        </div>
      </div>
    </section>
  );
}
