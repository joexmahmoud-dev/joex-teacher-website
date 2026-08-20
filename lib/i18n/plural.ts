import type { Locale } from "./config";
import { formatNumber } from "./config";

export interface PluralForms {
  one: string;
  two?: string;
  many: string;
}

/** Arabic-aware pluralization: 1 → one, 2 → dual, 3+ → many. */
export function pluralize(locale: Locale, forms: PluralForms, n: number): string {
  if (locale === "ar") {
    if (n === 1) return forms.one;
    if (n === 2) return forms.two ?? forms.many;
    return forms.many;
  }
  return n === 1 ? forms.one : forms.many;
}

/** "8 Lessons" / "٨ دروس" — localized count + plural noun. */
export function countLabel(
  locale: Locale,
  forms: PluralForms,
  n: number
): string {
  return `${formatNumber(n, locale)} ${pluralize(locale, forms, n)}`;
}
