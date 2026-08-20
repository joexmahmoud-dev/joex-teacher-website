import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSiteConfig } from "@/lib/data/server";
import { seoMetadata, breadcrumbSchema } from "@/lib/seo";
import { pick } from "@/lib/i18n/content";
import { whatsappLink } from "@/lib/utils";
import { Card } from "@/components/ui/primitives";
import { ContactForm } from "@/components/contact/ContactForm";
import { IconClock, IconMail, IconMapPin, IconPhone, IconWhatsApp } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/motion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  return seoMetadata({
    locale,
    path: "/contact",
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}`;
  const config = await getSiteConfig();
  const t = dict.contact;

  const items = [
    {
      icon: <IconPhone />,
      title: t.phoneLabel,
      node: <a href={`tel:${config.phone}`} dir="ltr">{config.phone}</a>,
    },
    {
      icon: <IconWhatsApp />,
      title: t.whatsappLabel,
      node: (
        <a href={whatsappLink(config.whatsapp, dict.whatsapp.hello)} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      ),
    },
    {
      icon: <IconMail />,
      title: t.emailLabel,
      node: <a href={`mailto:${config.email}`} dir="ltr">{config.email}</a>,
    },
    {
      icon: <IconMapPin />,
      title: t.locationLabel,
      node: <span>{pick(locale, config.address_ar, config.address_en)}</span>,
    },
  ];

  const breadcrumb = breadcrumbSchema(
    [{ name: dict.nav.home, path: "/" }, { name: dict.nav.contact, path: "/contact" }],
    locale
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={prefix}>{dict.nav.home}</a>
            <span>/</span>
            <span>{dict.nav.contact}</span>
          </nav>
          <p className="eyebrow">{t.getInTouch}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.subtitle}</p>
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "var(--sp-8)" }}>
            <div className="contact-strip">
              {items.map((item, i) => (
                <Reveal key={item.title} delay={i * 70}>
                  <div className="contact-item">
                    <span className="icon-wrap">{item.icon}</span>
                    <div>
                      <h3>{item.title}</h3>
                      {item.node}
                    </div>
                  </div>
                </Reveal>
              ))}
              <div className="contact-item">
                <span className="icon-wrap" style={{ background: "var(--c-accent-soft)", color: "var(--c-accent-strong)" }}>
                  <IconClock />
                </span>
                <div>
                  <h3>{t.hoursLabel}</h3>
                  <p>{t.hours}</p>
                </div>
              </div>
            </div>

            <Reveal>
              <Card className="dash-card" style={{ maxWidth: "42rem" }}>
                <div className="dash-card__head">
                  <h2 className="dash-card__title">{t.formTitle}</h2>
                </div>
                <ContactForm dict={dict} config={config} />
              </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
