"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Material } from "@/lib/db/types";
import { Field, Input, Textarea, Select } from "@/components/ui/fields";
import { useToast } from "@/components/ui/overlay";
import { SaveBar, FileUpload } from "@/components/admin/AdminFormKit";

export function MaterialForm({
  dict,
  material,
  cancelHref,
}: {
  dict: Dictionary;
  material: Material | null;
  cancelHref: string;
}) {
  const a = dict.admin.materialFields;
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [titleAr, setTitleAr] = useState(material?.title_ar ?? "");
  const [titleEn, setTitleEn] = useState(material?.title_en ?? "");
  const [descAr, setDescAr] = useState(material?.description_ar ?? "");
  const [descEn, setDescEn] = useState(material?.description_en ?? "");
  const [subjectAr, setSubjectAr] = useState(material?.subject_ar ?? "");
  const [subjectEn, setSubjectEn] = useState(material?.subject_en ?? "");
  const [grade, setGrade] = useState(material?.grade ?? "الصف الأول الثانوي");
  const [fileUrl, setFileUrl] = useState(material?.file_url ?? "");
  const [fileType, setFileType] = useState(material?.file_type ?? "pdf");
  const [fileSizeKb, setFileSizeKb] = useState(material?.file_size_kb ?? 0);
  const [status, setStatus] = useState<"published" | "draft">(material?.status ?? "published");

  const save = async () => {
    if (!titleAr.trim() || !titleEn.trim() || !fileUrl) {
      toast("error", dict.common.error);
      return;
    }
    setSaving(true);
    try {
      const { saveMaterial } = await import("@/lib/data/admin");
      const res = await saveMaterial({
        id: material?.id,
        title_ar: titleAr,
        title_en: titleEn,
        description_ar: descAr,
        description_en: descEn,
        subject_ar: subjectAr,
        subject_en: subjectEn,
        grade,
        file_url: fileUrl,
        file_type: fileType,
        file_size_kb: Number(fileSizeKb) || 0,
        status,
      });
      if (res.ok) {
        toast("success", dict.admin.saved);
        router.push(cancelHref);
        router.refresh();
      } else {
        toast("error", res.error === "preview_mode" ? dict.admin.previewNotice : dict.admin.saveFailed);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="grid grid--2" style={{ gap: "0 1.5rem" }}>
        <Field label={a.titleAr} required htmlFor="m-title-ar">
          <Input id="m-title-ar" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
        </Field>
        <Field label={a.titleEn} required htmlFor="m-title-en">
          <Input id="m-title-en" dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </Field>
        <Field label={a.descriptionAr} htmlFor="m-desc-ar">
          <Textarea id="m-desc-ar" value={descAr} onChange={(e) => setDescAr(e.target.value)} />
        </Field>
        <Field label={a.descriptionEn} htmlFor="m-desc-en">
          <Textarea id="m-desc-en" dir="ltr" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
        </Field>
        <Field label={a.subjectAr} htmlFor="m-sub-ar">
          <Input id="m-sub-ar" value={subjectAr} onChange={(e) => setSubjectAr(e.target.value)} />
        </Field>
        <Field label={a.subjectEn} htmlFor="m-sub-en">
          <Input id="m-sub-en" dir="ltr" value={subjectEn} onChange={(e) => setSubjectEn(e.target.value)} />
        </Field>
        <Field label={a.grade} htmlFor="m-grade">
          <Input id="m-grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
        </Field>
        <Field label={dict.admin.status} htmlFor="m-status">
          <Select id="m-status" value={status} onChange={(e) => setStatus(e.target.value as "published" | "draft")}>
            <option value="published">{dict.admin.published}</option>
            <option value="draft">{dict.admin.draft}</option>
          </Select>
        </Field>
        <Field label={dict.materials.fileType} htmlFor="m-type">
          <Select id="m-type" value={fileType} onChange={(e) => setFileType(e.target.value as Material["file_type"])}>
            <option value="pdf">PDF</option>
            <option value="doc">DOC</option>
            <option value="slides">SLIDES</option>
            <option value="video">VIDEO</option>
            <option value="image">IMAGE</option>
            <option value="other">OTHER</option>
          </Select>
        </Field>
        <Field label={`${dict.materials.size} (KB)`} htmlFor="m-size">
          <Input id="m-size" type="number" dir="ltr" value={fileSizeKb} onChange={(e) => setFileSizeKb(Number(e.target.value))} />
        </Field>
      </div>

      <div style={{ marginBlock: "var(--sp-4)" }}>
        <FileUpload dict={dict} label={a.file} value={fileUrl} onChange={setFileUrl} bucket="materials" />
      </div>

      <SaveBar dict={dict} onSave={save} onCancel={() => router.push(cancelHref)} saving={saving} />
    </div>
  );
}
