"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Announcement } from "@/lib/db/types";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { useToast } from "@/components/ui/overlay";
import { SaveBar } from "@/components/admin/AdminFormKit";

export function AnnouncementForm({
  dict,
  announcement,
  cancelHref,
}: {
  dict: Dictionary;
  announcement: Announcement | null;
  cancelHref: string;
}) {
  const a = dict.admin.announcementFields;
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [titleAr, setTitleAr] = useState(announcement?.title_ar ?? "");
  const [titleEn, setTitleEn] = useState(announcement?.title_en ?? "");
  const [contentAr, setContentAr] = useState(announcement?.content_ar ?? "");
  const [contentEn, setContentEn] = useState(announcement?.content_en ?? "");
  const [publish, setPublish] = useState(announcement?.is_published ?? true);

  const save = async () => {
    if (!titleAr.trim() || !titleEn.trim()) {
      toast("error", dict.common.error);
      return;
    }
    setSaving(true);
    try {
      const { saveAnnouncement } = await import("@/lib/data/admin");
      const res = await saveAnnouncement({
        id: announcement?.id,
        title_ar: titleAr,
        title_en: titleEn,
        content_ar: contentAr,
        content_en: contentEn,
        is_published: publish,
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
        <Field label={a.titleAr} required htmlFor="an-t-ar">
          <Input id="an-t-ar" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
        </Field>
        <Field label={a.titleEn} required htmlFor="an-t-en">
          <Input id="an-t-en" dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </Field>
        <Field label={a.contentAr} htmlFor="an-c-ar">
          <Textarea id="an-c-ar" value={contentAr} onChange={(e) => setContentAr(e.target.value)} />
        </Field>
        <Field label={a.contentEn} htmlFor="an-c-en">
          <Textarea id="an-c-en" dir="ltr" value={contentEn} onChange={(e) => setContentEn(e.target.value)} />
        </Field>
      </div>
      <label className="checkbox" style={{ marginBlock: "0.75rem" }}>
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
        {a.publish}
      </label>
      <SaveBar dict={dict} onSave={save} onCancel={() => router.push(cancelHref)} saving={saving} />
    </div>
  );
}
