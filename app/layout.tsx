import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/db/config";
import { ToastProvider } from "@/components/ui/overlay";
import "../styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Mr. Karim Hassan — Mathematics",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e5a4b",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The locale cookie is set by middleware, so the html element gets the
  // correct lang/dir during SSR (RTL for Arabic, LTR for English).
  const cookieStore = await cookies();
  const locale: Locale = isLocale(cookieStore.get("x-locale")?.value ?? "")
    ? (cookieStore.get("x-locale")!.value as Locale)
    : "ar";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
