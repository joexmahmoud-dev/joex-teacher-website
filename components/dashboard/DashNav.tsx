"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import {
  IconBook,
  IconCalendar,
  IconClipboard,
  IconGrid,
  IconBell,
  IconDoc,
  IconTrendingUp,
  IconUser,
} from "@/components/ui/icons";

export function DashNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const prefix = `/${locale}/dashboard`;
  const d = dict.dashboard;

  const items = [
    { href: `${prefix}`, label: d.overview, icon: <IconGrid />, exact: true },
    { href: `${prefix}/courses`, label: d.myCourses, icon: <IconBook /> },
    { href: `${prefix}/exams`, label: d.exams, icon: <IconClipboard /> },
    { href: `${prefix}/results`, label: d.results, icon: <IconTrendingUp /> },
    { href: `${prefix}/materials`, label: d.materials, icon: <IconDoc /> },
    { href: `${prefix}/bookings`, label: d.bookings, icon: <IconCalendar /> },
    { href: `${prefix}/announcements`, label: d.announcements, icon: <IconBell /> },
    { href: `${prefix}/profile`, label: d.profile, icon: <IconUser /> },
  ];

  const isActive = (item: (typeof items)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <nav className="dash__side" aria-label={d.title}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="dash__link"
          aria-current={isActive(item) ? "page" : undefined}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
