import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import type { SiteConfig } from "@/lib/db/types";
import { whatsappLink } from "@/lib/utils";
import { IconBook, IconGraduation, IconMail, IconMapPin, IconPhone, IconWhatsApp } from "@/components/ui/icons";

export function Footer({
  locale,
  dict,
  config,
}: {
  locale: Locale;
  dict: Dictionary;
  config: SiteConfig;
}) {
  const prefix = `/${locale}`;
  const name = locale === "ar" ? config.teacher_name_ar : config.teacher_name_en;
  const subject = locale === "ar" ? config.subject_ar : config.subject_en;

  const quickLinks = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.courses, href: "/courses" },
    { label: dict.nav.materials, href: "/materials" },
    { label: dict.nav.exams, href: "/exams" },
    { label: dict.nav.about, href: "/about" },
    { label: dict.nav.testimonials, href: "/testimonials" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  const courses = [
    { label: dict.nav.courses, href: "/courses" },
    { label: dict.nav.materials, href: "/materials" },
    { label: dict.nav.exams, href: "/exams" },
    { label: dict.nav.bookCta, href: "/book" },
  ];

  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <span className="footer__brand-mark">
                <IconGraduation />
              </span>
              <span>{name}</span>
            </div>
            <p style={{ maxWidth: "20rem", lineHeight: 1.8 }}>{dict.footer.description}</p>
          </div>

          <div>
            <h4>{dict.footer.quickLinks}</h4>
            <ul>
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={`${prefix}${l.href === "/" ? "" : l.href}`}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{dict.footer.courses}</h4>
            <ul>
              {courses.map((l) => (
                <li key={l.href}>
                  <Link href={`${prefix}${l.href}`}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{dict.footer.contact}</h4>
            <ul className="footer__contact">
              <li>
                <IconPhone />
                <a href={`tel:${config.phone}`} dir="ltr">
                  {config.phone}
                </a>
              </li>
              <li>
                <IconWhatsApp />
                <a href={whatsappLink(config.whatsapp, dict.whatsapp.hello)} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <IconMail />
                <a href={`mailto:${config.email}`} dir="ltr">
                  {config.email}
                </a>
              </li>
              <li>
                <IconMapPin />
                <span>{locale === "ar" ? config.address_ar : config.address_en}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>
          © {new Date().getFullYear()} {name} — {subject} · {dict.footer.rights}
        </span>
        <span>{dict.footer.madeBy}</span>
      </div>
    </footer>
  );
}
