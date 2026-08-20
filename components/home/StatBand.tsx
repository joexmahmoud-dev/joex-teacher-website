"use client";

import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import type { SiteConfig } from "@/lib/db/types";
import { CountUp, Reveal } from "@/components/ui/motion";

export function StatBand({
  locale,
  dict,
  config,
}: {
  locale: Locale;
  dict: Dictionary;
  config: SiteConfig;
}) {
  const stats = [
    { value: config.students_count, prefix: "+", suffix: "", label: dict.stats.students },
    { value: config.years_experience, prefix: "+", suffix: "", label: dict.stats.yearsExperience },
    { value: config.success_rate, prefix: "", suffix: "%", label: dict.stats.successRate },
    { value: config.exams_count, prefix: "+", suffix: "", label: dict.stats.exams },
  ];

  return (
    <section className="stats-band">
      <div className="container">
        <div className="stats-band__grid">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="stat">
                <div className="stat__num">
                  <CountUp
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    locale={locale}
                  />
                </div>
                <div className="stat__label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
        {config.demo_mode ? <p className="stats-note">{dict.stats.note}</p> : null}
      </div>
    </section>
  );
}
