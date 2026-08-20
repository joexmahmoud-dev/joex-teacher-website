"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import { isSupabaseConfigured } from "@/lib/db/config";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/primitives";
import { IconBook, IconClose, IconGrid, IconMenu, IconUser } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface NavItem {
  key: keyof Dictionary["nav"];
  href: string;
}

export function Navbar({
  locale,
  dict,
  brandName,
}: {
  locale: Locale;
  dict: Dictionary;
  brandName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const prefix = `/${locale}`;
  const isActive = (href: string) => {
    if (href === "/") return pathname === prefix || pathname === `${prefix}/`;
    return pathname === `${prefix}${href}` || pathname.startsWith(`${prefix}${href}/`);
  };

  const navItems: NavItem[] = [
    { key: "home", href: "/" },
    { key: "courses", href: "/courses" },
    { key: "materials", href: "/materials" },
    { key: "exams", href: "/exams" },
    { key: "about", href: "/about" },
    { key: "testimonials", href: "/testimonials" },
    { key: "contact", href: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let alive = true;
    import("@/lib/supabase/client").then(async ({ createClient }) => {
      const sb = createClient();
      const { data } = await sb.auth.getSession();
      if (alive) setHasSession(Boolean(data.session));
    });
    return () => {
      alive = false;
    };
  }, [pathname]);

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={cn("nav", scrolled && "is-scrolled")}>
      <div className="container nav__inner">
        <Link href={prefix} className="nav__brand" aria-label={brandName}>
          <span className="nav__brand-mark">
            <IconBook />
          </span>
          <span>{brandName}</span>
        </Link>

        <nav className="nav__links" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`${prefix}${item.href === "/" ? "" : item.href}`}
              className="nav__link"
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {dict.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <LanguageSwitcher locale={locale} />
          <Button href={`${prefix}/book`} size="sm" icon={<IconBook />}>
            {dict.nav.bookCta}
          </Button>
          {hasSession ? (
            <Button href={`${prefix}/dashboard`} variant="ghost" size="sm" icon={<IconGrid />}>
              {dict.nav.dashboard}
            </Button>
          ) : (
            <Button href={`${prefix}/login`} variant="ghost" size="sm" icon={<IconUser />}>
              {dict.nav.login}
            </Button>
          )}
          <button
            className="nav__burger"
            onClick={() => setOpen(true)}
            aria-label={dict.nav.openMenu}
            aria-expanded={open}
          >
            <IconMenu />
          </button>
        </div>
      </div>

      {open ? (
        <>
          <div className="drawer-overlay" onClick={() => setOpen(false)} />
          <div className="drawer" role="dialog" aria-modal="true" aria-label={dict.nav.openMenu}>
            <div className="drawer__head">
              <span className="nav__brand">
                <span className="nav__brand-mark">
                  <IconBook />
                </span>
                {brandName}
              </span>
              <button
                className="modal__close"
                onClick={() => setOpen(false)}
                aria-label={dict.nav.closeMenu}
              >
                <IconClose />
              </button>
            </div>
            <nav className="drawer__nav" aria-label="Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={`${prefix}${item.href === "/" ? "" : item.href}`}
                  className="drawer__link"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {dict.nav[item.key]}
                </Link>
              ))}
              {hasSession ? (
                <Link href={`${prefix}/dashboard`} className="drawer__link">
                  {dict.nav.dashboard}
                </Link>
              ) : (
                <Link href={`${prefix}/login`} className="drawer__link">
                  {dict.nav.login}
                </Link>
              )}
            </nav>
            <div className="drawer__foot">
              <LanguageSwitcher locale={locale} />
              <Button
                href={`${prefix}/book`}
                block
                icon={<IconBook />}
                onClick={() => router.push(`${prefix}/book`)}
              >
                {dict.nav.bookCta}
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
