import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatNumber, formatDate } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAdminStudents } from "@/lib/data/admin-server";
import { Avatar, Badge, EmptyState } from "@/components/ui/primitives";
import { IconUsers } from "@/components/ui/icons";
import { ProgressBar } from "@/components/ui/motion";

export default async function AdminStudents({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const a = dict.admin;
  const students = await getAdminStudents();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <h2 style={{ fontSize: "var(--fs-xl)" }}>{a.students}</h2>
      {students.length === 0 ? (
        <EmptyState icon={<IconUsers />} title={a.empty} message={a.emptyHint} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{a.studentList.name}</th>
                <th>{a.studentList.grade}</th>
                <th>{a.studentList.joined}</th>
                <th>{a.studentList.progress}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const name = s.full_name_ar || s.full_name_en || "—";
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Avatar name={name} />
                        <span>
                          <strong>{name}</strong>
                          <span className="text-faint" style={{ display: "block", fontSize: "var(--fs-xs)" }} dir="ltr">
                            {s.id.slice(0, 8)}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td>{s.grade || "—"}</td>
                    <td>{formatDate(s.created_at, locale)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <ProgressBar value={s.avg_progress} style={{ flex: 1 }} />
                        <Badge tone="green">{formatNumber(s.avg_progress, locale)}%</Badge>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
