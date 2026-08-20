"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * العربية | English — swaps the locale segment of the current URL.
 */
export function LanguageSwitcher({
  locale,
  className,
  onSwitch,
}: {
  locale: Locale;
  className?: string;
  onSwitch?: () => void;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(ar|en)(\/|$)/, (m, _l, slash) => slash ?? "");

  const other: Locale = locale === "ar" ? "en" : "ar";

  return (
    <nav className={cn("lang-switch", className)} aria-label={localeNames[locale]}>
      {(["ar", "en"] as Locale[]).map((l) => (
        <Link
          key={l}
          href={`/${l}${rest === "/" || rest === "" ? "" : rest}`}
          aria-current={locale === l}
          onClick={onSwitch}
          hrefLang={l}
        >
          {localeNames[l]}
        </Link>
      ))}
    </nav>
  );
}
