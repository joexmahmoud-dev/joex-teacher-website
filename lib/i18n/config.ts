export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeNames: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return value === "ar" || value === "en";
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Locale-aware number formatting used across the site (Latin digits for EG web). */
export function formatNumber(value: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-US").format(value);
  } catch {
    return String(value);
  }
}

/** Format an EGP price: 250 EGP / ٢٥٠ ج.م */
export function formatPrice(value: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-US", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} EGP`;
  }
}

/** Format a date in the locale's calendar style. */
export function formatDate(value: string | Date, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}
