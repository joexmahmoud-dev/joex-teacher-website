"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Testimonial } from "@/lib/db/types";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { useToast } from "@/components/ui/overlay";
import { SaveBar } from "@/components/admin/AdminFormKit";

export function TestimonialForm({
  dict,
  testimonial,
  cancelHref,
}: {
  dict: Dictionary;
  testimonial: Testimonial | null;
  cancelHref: string;
}) {
  const a = dict.admin.testimonialFields;
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [nameAr, setNameAr] = useState(testimonial?.student_name_ar ?? "");
  const [nameEn, setNameEn] = useState(testimonial?.student_name_en ?? "");
  const [grade, setGrade] = useState(testimonial?.grade ?? "");
  const [reviewAr, setReviewAr] = useState(testimonial?.review_ar ?? "");
  const [reviewEn, setReviewEn] = useState(testimonial?.review_en ?? "");
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [demo, setDemo] = useState(testimonial?.is_demo ?? true);
  const [featured, setFeatured] = useState(testimonial?.is_featured ?? false);
  const [sortOrder, setSortOrder] = useState(testimonial?.sort_order ?? 1);

  const save = async () => {
    if (!nameAr.trim() || !reviewAr.trim()) {
      toast("error", dict.common.error);
      return;
    }
    setSaving(true);
    try {
      const { saveTestimonial } = await import("@/lib/data/admin");
      const res = await saveTestimonial({
        id: testimonial?.id,
        student_name_ar: nameAr,
        student_name_en: nameEn,
        grade,
        review_ar: reviewAr,
        review_en: reviewEn,
        rating: Math.min(5, Math.max(1, rating)),
        is_featured: featured,
        is_demo: demo,
        sort_order: Number(sortOrder) || 1,
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
        <Field label={a.nameAr} required htmlFor="t-n-ar">
          <Input id="t-n-ar" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
        </Field>
        <Field label={a.nameEn} htmlFor="t-n-en">
          <Input id="t-n-en" dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        </Field>
        <Field label={a.grade} htmlFor="t-grade">
          <Input id="t-grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
        </Field>
        <Field label={a.rating} htmlFor="t-rating">
          <Input id="t-rating" type="number" dir="ltr" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        </Field>
        <Field label={a.reviewAr} required htmlFor="t-rev-ar">
          <Textarea id="t-rev-ar" value={reviewAr} onChange={(e) => setReviewAr(e.target.value)} />
        </Field>
        <Field label={a.reviewEn} htmlFor="t-rev-en">
          <Textarea id="t-rev-en" dir="ltr" value={reviewEn} onChange={(e) => setReviewEn(e.target.value)} />
        </Field>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", marginBlock: "0.75rem", flexWrap: "wrap" }}>
        <label className="checkbox">
          <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} />
          {a.isDemo}
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          {a.isFeatured}
        </label>
      </div>
      <SaveBar dict={dict} onSave={save} onCancel={() => router.push(cancelHref)} saving={saving} />
    </div>
  );
}
