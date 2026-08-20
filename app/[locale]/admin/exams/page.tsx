import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAllExams } from "@/lib/data/server";
import { pick } from "@/lib/i18n/content";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/admin/AdminFormKit";
import { IconClipboard, IconEdit, IconPlus } from "@/components/ui/icons";
import Link from "next/link";

export default async function AdminExams({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}/admin/exams`;
  const a = dict.admin;
  const exams = await getAllExams();

  const diffTone: Record<string, "green" | "gold" | "red"> = { easy: "green", medium: "gold", hard: "red" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{a.exams}</h2>
        <Button href={`${prefix}/new`} size="sm" icon={<IconPlus />}>{a.add}</Button>
      </div>

      {exams.length === 0 ? (
        <EmptyState icon={<IconClipboard />} title={a.empty} message={a.emptyHint} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{a.examFields.titleEn}</th>
                <th>{a.examFields.grade}</th>
                <th>{a.examFields.difficulty}</th>
                <th>{a.examFields.durationMinutes}</th>
                <th>{a.status}</th>
                <th>{a.actions}</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e) => (
                <tr key={e.id}>
                  <td>
                    <strong>{pick(locale, e.title_ar, e.title_en)}</strong>
                    <span className="text-faint" style={{ display: "block", fontSize: "var(--fs-xs)" }}>
                      {pick(locale, e.subject_ar, e.subject_en)}
                    </span>
                  </td>
                  <td>{e.grade}</td>
                  <td><Badge tone={diffTone[e.difficulty]}>{dict.exams.difficulty[e.difficulty]}</Badge></td>
                  <td>{e.duration_minutes}</td>
                  <td>
                    <Badge tone={e.is_available ? "green" : "gray"}>
                      {e.is_available ? dict.exams.available : dict.exams.unavailable}
                    </Badge>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`${prefix}/${e.id}/edit`} className="icon-btn" aria-label={a.edit}>
                        <IconEdit />
                      </Link>
                      <DeleteButton dict={dict} table="exams" id={e.id} />
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
