import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Language-aware routing.
 *
 * - Already-localized paths (/ar, /en) pass through (trailing slash normalized).
 * - The root path "/" redirects to the visitor's language when detectable
 *   (Accept-Language), defaulting to Arabic (ar) — the primary audience.
 * - Any other path (e.g. /courses) is redirected with a 308 to its
 *   localized counterpart (/ar/courses), keeping URLs canonical per language.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Let static assets and framework internals pass through untouched.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Already localized: normalize trailing slashes, then proceed.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    if (pathname.length > 3 && pathname.endsWith("/")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/\/+$/, "");
      const res = NextResponse.redirect(url, 308);
      res.cookies.set("x-locale", segments[0], { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return res;
    }
    const res = NextResponse.next();
    res.cookies.set("x-locale", segments[0], { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  // Detect the visitor's preferred language.
  const accept = request.headers.get("accept-language") ?? "";
  const lower = accept.toLowerCase();
  let locale = defaultLocale;
  if (lower.includes("ar")) locale = "ar";
  else if (lower.includes("en")) locale = "en";

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  const res = NextResponse.redirect(url, 308);
  res.cookies.set("x-locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|css|js|txt|pdf|xml|json|mp4|webm)$).*)",
  ],
};
