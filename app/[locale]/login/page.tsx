import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { seoMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/primitives";
import { LoginForm } from "@/components/auth/AuthForms";

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
    path: "/login",
    title: dict.meta.loginTitle,
    description: dict.meta.loginDescription,
  });
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ registered?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const { registered } = await searchParams;
  const t = dict.auth;

  return (
    <div className="auth-wrap">
      <div className="container" style={{ display: "grid", placeItems: "center" }}>
        <Card className="auth-card dash-card">
          <div className="auth-card__head">
            <h1>{t.loginTitle}</h1>
            <p>{t.loginSubtitle}</p>
            {registered ? (
              <p className="field__hint" style={{ marginBlockStart: "0.75rem", color: "var(--c-success)", fontWeight: 700 }}>
                {t.resetSentTitle} — {t.resetSentMsg}
              </p>
            ) : null}
          </div>
          <LoginForm locale={locale} dict={dict} />
          <p className="text-muted" style={{ textAlign: "center", marginBlockStart: "var(--sp-5)", fontSize: "var(--fs-sm)" }}>
            {t.noAccount}{" "}
            <Link href={`${prefix}/register`} className="link-underline">
              {t.createOne}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
