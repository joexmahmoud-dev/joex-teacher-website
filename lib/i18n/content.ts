import type { Locale } from "./config";

/** Pick the localized string from AR/EN pairs. */
export const pick = (locale: Locale, ar: string, en: string): string =>
  locale === "ar" ? ar : en;

/** Pick a localized list (what-you-learn, options, …). */
export const pickList = (locale: Locale, ar: string[], en: string[]): string[] =>
  locale === "ar" ? ar : en;

export const pickNullable = (locale: Locale, ar: string | null, en: string | null): string | null =>
  locale === "ar" ? ar : en;
