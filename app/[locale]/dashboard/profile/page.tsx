import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/data/dashboard";
import { Card } from "@/components/ui/primitives";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default async function DashboardProfile({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const d = dict.dashboard;

  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const profile = await getUserProfile(user.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{d.profileTitle}</h2>
      <p className="text-muted" style={{ marginBlockEnd: 0 }}>{d.profileSubtitle}</p>
      <Card className="dash-card" style={{ maxWidth: "30rem" }}>
        <ProfileForm profile={profile} email={user.email ?? ""} dict={dict} />
      </Card>
      {profile ? (
        <p className="text-faint">
          {d.memberSince}: {formatDate(profile.created_at, locale)}
        </p>
      ) : null}
    </div>
  );
}
