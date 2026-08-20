import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getTestimonials } from "@/lib/data/server";
import { pick } from "@/lib/i18n/content";
import { Badge, Button, EmptyState, Rating } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/admin/AdminFormKit";
import { IconEdit, IconPlus, IconStar } from "@/components/ui/icons";
import Link from "next/link";

export default async function AdminTestimonials({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}/admin/testimonials`;
  const a = dict.admin;
  const testimonials = await getTestimonials();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{a.testimonials}</h2>
        <Button href={`${prefix}/new`} size="sm" icon={<IconPlus />}>{a.add}</Button>
      </div>

      {testimonials.length === 0 ? (
        <EmptyState icon={<IconStar />} title={a.empty} message={a.emptyHint} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {testimonials.map((t) => (
            <div key={t.id} className="dash-card" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <strong style={{ display: "block" }}>
                  {pick(locale, t.student_name_ar, t.student_name_en)}
                </strong>
                <Rating value={t.rating} />
                <p className="text-faint" style={{ fontSize: "var(--fs-xs)", marginBlockStart: "0.3rem" }}>
                  {pick(locale, t.review_ar, t.review_en).slice(0, 90)}…
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {t.is_demo ? <Badge tone="demo">{dict.common.demo}</Badge> : null}
                {t.is_featured ? <Badge tone="gold">{a.featured}</Badge> : null}
                <Link href={`${prefix}/${t.id}/edit`} className="icon-btn" aria-label={a.edit}>
                  <IconEdit />
                </Link>
                <DeleteButton dict={dict} table="testimonials" id={t.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
