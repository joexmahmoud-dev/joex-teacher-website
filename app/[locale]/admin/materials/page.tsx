import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAllMaterials } from "@/lib/data/server";
import { pick } from "@/lib/i18n/content";
import { formatFileSize } from "@/lib/utils";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/admin/AdminFormKit";
import { IconDoc, IconEdit, IconPlus } from "@/components/ui/icons";
import Link from "next/link";

export default async function AdminMaterials({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "ar";
  const dict = getDictionary(locale);
  const prefix = `/${locale}/admin/materials`;
  const a = dict.admin;
  const materials = await getAllMaterials();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "var(--fs-xl)" }}>{a.materials}</h2>
        <Button href={`${prefix}/new`} size="sm" icon={<IconPlus />}>{a.add}</Button>
      </div>

      {materials.length === 0 ? (
        <EmptyState icon={<IconDoc />} title={a.empty} message={a.emptyHint} />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{a.materialFields.titleEn}</th>
                <th>{a.materialFields.grade}</th>
                <th>{dict.materials.fileType}</th>
                <th>{dict.materials.size}</th>
                <th>{a.status}</th>
                <th>{a.actions}</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id}>
                  <td>
                    <strong>{pick(locale, m.title_ar, m.title_en)}</strong>
                    <span className="text-faint" style={{ display: "block", fontSize: "var(--fs-xs)" }}>
                      {pick(locale, m.subject_ar, m.subject_en)}
                    </span>
                  </td>
                  <td>{m.grade}</td>
                  <td><Badge tone="red">{m.file_type.toUpperCase()}</Badge></td>
                  <td>{formatFileSize(m.file_size_kb)}</td>
                  <td>
                    <Badge tone={m.status === "published" ? "green" : "gray"}>
                      {m.status === "published" ? a.published : a.draft}
                    </Badge>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`${prefix}/${m.id}/edit`} className="icon-btn" aria-label={a.edit}>
                        <IconEdit />
                      </Link>
                      <DeleteButton dict={dict} table="materials" id={m.id} />
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
