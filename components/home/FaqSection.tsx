"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import type { Faq } from "@/lib/db/types";
import { pick } from "@/lib/i18n/content";
import { SectionHeading } from "@/components/ui/primitives";
import { IconChevronDown } from "@/components/ui/icons";

export function FaqSection({
  locale,
  dict,
  faqs,
}: {
  locale: Locale;
  dict: Dictionary;
  faqs: Faq[];
}) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section className="section section--alt">
      <div className="container" style={{ maxWidth: "48rem" }}>
        <SectionHeading
          center
          eyebrow={dict.common.search}
          title={dict.contact.subtitle}
        />
        <div>
          {faqs.map((faq) => {
            const isOpen = open === faq.id;
            return (
              <div className="faq-item" data-open={isOpen} key={faq.id}>
                <button
                  className="faq-item__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                >
                  <span>{pick(locale, faq.question_ar, faq.question_en)}</span>
                  <IconChevronDown
                    style={{
                      width: "1.1rem",
                      height: "1.1rem",
                      flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.3s var(--ease)",
                    }}
                  />
                </button>
                <div className="faq-item__a">
                  <div className="faq-item__a-inner">
                    <p>{pick(locale, faq.answer_ar, faq.answer_en)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
