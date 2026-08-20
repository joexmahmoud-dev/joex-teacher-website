import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/config";
import { formatNumber } from "@/lib/i18n/config";
import type { SiteConfig, Testimonial } from "@/lib/db/types";
import { Avatar, Button } from "@/components/ui/primitives";
import { IconBook, IconCheck, IconGraduation, IconTarget, IconTrophy } from "@/components/ui/icons";
import { pick } from "@/lib/i18n/content";

export function HeroSection({
  locale,
  dict,
  config,
  testimonials,
}: {
  locale: Locale;
  dict: Dictionary;
  config: SiteConfig;
  testimonials: Testimonial[];
}) {
  const prefix = `/${locale}`;
  const subject = pick(locale, config.subject_ar, config.subject_en);
  const city = pick(locale, config.city_ar, config.city_en);
  const portrait =
    config.photo_url?.startsWith("http")
      ? config.photo_url
      : config.photo_url ?? "/images/teacher-portrait.png";

  const floats = [
    {
      icon: <IconGraduation />,
      value: formatNumber(config.students_count, locale),
      prefix: "+",
      suffix: "",
      label: dict.hero.cards[0].label,
      cls: "hero__float--1 float-anim",
      dir: "ltr" as const,
    },
    {
      icon: <IconTrophy />,
      value: formatNumber(config.years_experience, locale),
      prefix: "+",
      suffix: "",
      label: dict.hero.cards[1].label,
      cls: "hero__float--2 float-anim float-anim--delay",
      dir: "ltr" as const,
    },
    {
      icon: <IconTarget />,
      value: formatNumber(config.success_rate, locale),
      prefix: "",
      suffix: "%",
      label: dict.hero.cards[2].label,
      cls: "hero__float--3 float-anim float-anim--delay-2",
      dir: "ltr" as const,
    },
  ];

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div>
          <p className="eyebrow hero__eyebrow">
            {subject} · {city}
          </p>
          <h1>
            {dict.hero.titleLine1} <span className="accent-word">{dict.hero.titleAccent}</span>
          </h1>
          <p className="hero__lead">{dict.hero.subtitle}</p>
          <div className="hero__ctas">
            <Button href={`${prefix}/book`} size="lg" icon={<IconBook />}>
              {dict.hero.ctaPrimary}
            </Button>
            <Button href={`${prefix}/courses`} variant="outline" size="lg">
              {dict.hero.ctaSecondary}
            </Button>
          </div>
          <div className="hero__proof">
            <span className="hero__avatars">
              {testimonials.slice(0, 3).map((t) => (
                <Avatar
                  key={t.id}
                  name={pick(locale, t.student_name_ar, t.student_name_en)}
                  className="avatar--sm"
                />
              ))}
            </span>
            <span>
              <IconCheck style={{ width: "0.95rem", height: "0.95rem", display: "inline", color: "var(--c-success)", marginInlineEnd: "0.25rem" }} />
              {dict.hero.proof}
            </span>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__frame" aria-hidden="true" />
          <div className="hero__portrait">
            <Image
              src={portrait}
              alt={pick(locale, config.teacher_name_ar, config.teacher_name_en)}
              fill
              priority
              sizes="(max-width: 1024px) 82vw, 24rem"
            />
          </div>
          {floats.map((f) => (
            <div key={f.label} className={`hero__float ${f.cls}`} dir={f.dir}>
              {f.icon}
              <span>
                {f.prefix}
                {f.value}
                {f.suffix}
                <small>{f.label}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
