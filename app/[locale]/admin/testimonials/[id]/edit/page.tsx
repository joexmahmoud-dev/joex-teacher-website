import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getTestimonials } from "@/lib/data/server";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { Card } from "@/components/ui/primitives";

export default async function EditTestimonial({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const testimonials = await getTestimonials();
  const testimonial = testimonials.find((t) => t.id === id) ?? null;
  if (!testimonial) notFound();
  return (
    <Card className="dash-card">
      <div className="dash-card__head">
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{dict.admin.edit}</h2>
      </div>
      <TestimonialForm dict={dict} testimonial={testimonial} cancelHref={`/${locale}/admin/testimonials`} />
    </Card>
  );
}
