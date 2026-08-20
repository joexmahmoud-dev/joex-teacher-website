import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Button } from "@/components/ui/primitives";
import { IconHome } from "@/components/ui/icons";
import { seoMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  return seoMetadata({
    locale,
    path: "/404",
    title: dict.meta.notFoundTitle,
    description: dict.common.notFoundMsg,
  });
}

export default async function LocaleNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Params can be undefined during prerender — guard before use.
  const { locale: raw } = (await params) ?? {};
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;

  return (
    <div className="container" style={{ paddingBlock: "clamp(4rem, 10vw, 8rem)" }}>
      <div className="state">
        <span className="state__icon">
          <span style={{ fontSize: "1.6rem", fontWeight: 800 }}>404</span>
        </span>
        <h1 style={{ fontSize: "var(--h1)" }}>{dict.common.notFoundTitle}</h1>
        <p>{dict.common.notFoundMsg}</p>
        <div className="state__action">
          <Button href={prefix} icon={<IconHome />}>
            {dict.common.goHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
