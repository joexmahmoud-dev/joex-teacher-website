import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import type { SiteConfig } from "@/lib/db/types";
import { whatsappLink } from "@/lib/utils";
import { Button } from "@/components/ui/primitives";
import { IconBook, IconWhatsApp } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/motion";

export function FinalCta({
  locale,
  dict,
  config,
}: {
  locale: Locale;
  dict: Dictionary;
  config: SiteConfig;
}) {
  const prefix = `/${locale}`;
  return (
    <section className="section section--dark" style={{ position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(40rem 20rem at 85% 0%, rgba(201,146,59,0.14), transparent 60%)",
        }}
      />
      <div className="container" style={{ position: "relative", textAlign: "center", maxWidth: "44rem" }}>
        <Reveal>
          <h2 style={{ fontSize: "var(--h2)", color: "#fff", marginBlockEnd: "var(--sp-4)" }}>
            {dict.cta.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBlockEnd: "var(--sp-8)" }}>
            {dict.cta.subtitle}
          </p>
          <div className="hero__ctas" style={{ justifyContent: "center" }}>
            <Button href={`${prefix}/book`} variant="accent" size="lg" icon={<IconBook />}>
              {dict.cta.primary}
            </Button>
            <Button
              href={whatsappLink(config.whatsapp, dict.whatsapp.hello)}
              variant="light"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              icon={<IconWhatsApp />}
            >
              {dict.cta.secondary}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
