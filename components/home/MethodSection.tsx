import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { IconBook, IconClipboard, IconEdit } from "@/components/ui/icons";

const stepIcons = [<IconBook key="1" />, <IconEdit key="2" />, <IconClipboard key="3" />];

export function MethodSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          center
          eyebrow={dict.brand.role}
          title={dict.method.title}
          lead={dict.method.subtitle}
        />
        <div className="grid grid--3">
          {dict.method.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 110}>
              <div
                className="card card--inset"
                style={{
                  padding: "var(--sp-8) var(--sp-6)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  height: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    className="material-icon"
                    style={{ background: "var(--c-primary)", color: "#fff" }}
                  >
                    {stepIcons[i]}
                  </span>
                  <span style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--c-line-strong)", lineHeight: 1 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 style={{ fontSize: "var(--fs-xl)" }}>{step.title}</h3>
                <p className="text-muted" style={{ lineHeight: 1.8 }}>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
