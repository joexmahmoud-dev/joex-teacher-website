import type { Testimonial } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { pick } from "@/lib/i18n/content";
import { Avatar, Card, DemoBadge, Rating } from "@/components/ui/primitives";

export function TestimonialCard({
  testimonial,
  locale,
  dict,
}: {
  testimonial: Testimonial;
  locale: Locale;
  dict: Dictionary;
}) {
  const name = pick(locale, testimonial.student_name_ar, testimonial.student_name_en);
  const review = pick(locale, testimonial.review_ar, testimonial.review_en);

  return (
    <Card hover className="testimonial">
      <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <Rating value={testimonial.rating} />
          {testimonial.is_demo ? <DemoBadge label={dict.testimonials.demoBadge} /> : null}
        </div>
        <blockquote className="testimonial__quote">{review}</blockquote>
        <div className="testimonial__person">
          <Avatar name={name} size="md" />
          <div>
            <div className="testimonial__name">{name}</div>
            <div className="testimonial__grade">{testimonial.grade}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
