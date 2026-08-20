/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Build a WhatsApp deep link with a pre-filled message. */
export function whatsappLink(phone: string, text: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Human-readable file size from bytes or KB. */
export function formatFileSize(kilobytes: number): string {
  if (!kilobytes || kilobytes <= 0) return "—";
  if (kilobytes < 1024) return `${Math.round(kilobytes)} KB`;
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

/** First letters of an Arabic/English name, for avatar fallbacks. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Slugify a string for URLs (ASCII fallback + Arabic-aware Latin map). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Percentage with 0 decimals, clamped to 0–100. */
export function toPercent(value: number, total: number): number {
  if (!total) return 0;
  return clamp(Math.round((value / total) * 100), 0, 100);
}
