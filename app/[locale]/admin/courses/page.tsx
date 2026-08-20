import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatPrice } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAllCourses } from "@/lib/data/server";
import { pick } from "@/lib/i18n/content";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/admin/AdminFormKit";
import { IconBook, IconEdit, IconPlus } from "@/components/ui/icons";
import Link from "next/link";

export default async function AdminCourses({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}/admin/courses`;
  const a = dict.admin;
  const courses = await getAllCourses();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{a.courses}</h2>
        <Button href={`${prefix}/new`} size="sm" icon={<IconPlus />}>{a.add}</Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState icon={<IconBook />} title={a.empty} message={a.emptyHint} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{a.courseFields.titleEn}</th>
                <th>{a.courseFields.grade}</th>
                <th>{a.courseFields.price}</th>
                <th>{a.status}</th>
                <th>{a.actions}</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{pick(locale, c.title_ar, c.title_en)}</strong>
                    <span className="text-faint" style={{ display: "block", fontSize: "var(--fs-xs)" }}>
                      {pick(locale, c.subject_ar, c.subject_en)} · {c.slug}
                    </span>
                  </td>
                  <td>{c.grade}</td>
                  <td>{formatPrice(c.price, locale)}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      <Badge tone={c.status === "published" ? "green" : "gray"}>
                        {c.status === "published" ? a.published : a.draft}
                      </Badge>
                      {c.featured ? <Badge tone="gold">{a.featured}</Badge> : null}
                    </div>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`${prefix}/${c.id}/edit`} className="icon-btn" aria-label={a.edit}>
                        <IconEdit />
                      </Link>
                      <DeleteButton dict={dict} table="courses" id={c.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
