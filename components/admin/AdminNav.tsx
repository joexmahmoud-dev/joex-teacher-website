"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import {
  IconBell,
  IconBook,
  IconCalendar,
  IconClipboard,
  IconDoc,
  IconGrid,
  IconMessage,
  IconSettings,
  IconStar,
  IconUsers,
} from "@/components/ui/icons";

export function AdminNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const prefix = `/${locale}/admin`;
  const a = dict.admin;

  const items = [
    { href: `${prefix}`, label: a.overview, icon: <IconGrid />, exact: true },
    { href: `${prefix}/courses`, label: a.courses, icon: <IconBook /> },
    { href: `${prefix}/materials`, label: a.materials, icon: <IconDoc /> },
    { href: `${prefix}/exams`, label: a.exams, icon: <IconClipboard /> },
    { href: `${prefix}/bookings`, label: a.bookings, icon: <IconCalendar /> },
    { href: `${prefix}/announcements`, label: a.announcements, icon: <IconBell /> },
    { href: `${prefix}/testimonials`, label: a.testimonials, icon: <IconStar /> },
    { href: `${prefix}/students`, label: a.students, icon: <IconUsers /> },
    { href: `${prefix}/messages`, label: a.messages, icon: <IconMessage /> },
    { href: `${prefix}/settings`, label: a.settings, icon: <IconSettings /> },
  ];

  const isActive = (item: (typeof items)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <nav className="dash__side" aria-label={a.title}>
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
