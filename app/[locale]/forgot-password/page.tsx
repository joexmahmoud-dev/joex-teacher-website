import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { seoMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/primitives";
import { ForgotForm } from "@/components/auth/AuthForms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  return seoMetadata({
    locale,
    path: "/forgot-password",
    title: dict.meta.loginTitle,
    description: dict.auth.resetSubtitle,
  });
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const t = dict.auth;

  return (
    <div className="auth-wrap">
      <div className="container" style={{ display: "grid", placeItems: "center" }}>
        <Card className="auth-card dash-card">
          <div className="auth-card__head">
            <h1>{t.resetTitle}</h1>
            <p>{t.resetSubtitle}</p>
          </div>
          <ForgotForm locale={locale} dict={dict} />
          <p className="text-muted" style={{ textAlign: "center", marginBlockStart: "var(--sp-5)", fontSize: "var(--fs-sm)" }}>
            <Link href={`${prefix}/login`} className="link-underline">
              {t.backToLogin}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
