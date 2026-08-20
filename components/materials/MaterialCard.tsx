import type { Material } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { pick } from "@/lib/i18n/content";
import { formatDate, formatNumber } from "@/lib/i18n/config";
import { formatFileSize } from "@/lib/utils";
import { Card, Badge, Button } from "@/components/ui/primitives";
import {
  IconDoc,
  IconDownload,
  IconFile,
  IconLayers,
  IconVideo,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function materialIcon(type: Material["file_type"]) {
  switch (type) {
    case "doc":
      return { icon: <IconDoc />, cls: "material-icon--word" };
    case "slides":
      return { icon: <IconLayers />, cls: "material-icon--slides" };
    case "video":
      return { icon: <IconVideo />, cls: "material-icon--video" };
    case "image":
      return { icon: <IconFile />, cls: "material-icon--sheet" };
    default:
      return { icon: <IconFile />, cls: "material-icon--sheet" };
  }
}

export function MaterialCard({
  material,
  locale,
  dict,
}: {
  material: Material;
  locale: Locale;
  dict: Dictionary;
}) {
  const title = pick(locale, material.title_ar, material.title_en);
  const subject = pick(locale, material.subject_ar, material.subject_en);
  const description = pick(locale, material.description_ar, material.description_en);
  const { icon, cls } = materialIcon(material.file_type);
  const isDemo = material.file_url.startsWith("/demo-files/");

  return (
    <Card hover className="material-card">
      <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <span className={cn("material-icon", cls)}>{icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="course-card__title" style={{ fontSize: "var(--fs-md)" }}>
              {title}
            </h3>
            <p className="course-card__desc">{description}</p>
          </div>
        </div>
        <div className="course-card__meta">
          <span>{subject}</span>
          <span>{material.grade}</span>
          <span>{dict.materials.fileType}: {material.file_type.toUpperCase()}</span>
        </div>
        <div className="course-card__meta">
          <span>{dict.materials.size}: {formatFileSize(material.file_size_kb)}</span>
          <span>{dict.materials.uploadDate}: {formatDate(material.upload_date, locale)}</span>
          <span>
            {formatNumber(material.downloads, locale)} {dict.materials.downloads}
          </span>
        </div>
        {isDemo ? <Badge tone="demo">{dict.materials.demoNote}</Badge> : null}
        <div style={{ marginBlockStart: "auto" }}>
          <Button
            href={material.file_url}
            variant="outline"
            block
            icon={<IconDownload />}
            download={!material.file_url.includes("http")}
            target={material.file_url.includes("http") ? "_blank" : undefined}
            rel={material.file_url.includes("http") ? "noopener noreferrer" : undefined}
          >
            {dict.materials.download}
          </Button>
        </div>
      </div>
    </Card>
  );
}
