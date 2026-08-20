"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Course, Lesson } from "@/lib/db/types";
import { pick } from "@/lib/i18n/content";
import { Field, Input, Textarea, Select } from "@/components/ui/fields";
import { Button } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/overlay";
import { SaveBar, FileUpload } from "@/components/admin/AdminFormKit";
import { IconPlus, IconTrash } from "@/components/ui/icons";
import { slugify } from "@/lib/utils";

interface LessonDraft {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  duration_minutes: number;
}

const emptyLesson = (): LessonDraft => ({
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  duration_minutes: 45,
});

export function CourseForm({
  dict,
  locale,
  course,
  cancelHref,
}: {
  dict: Dictionary;
  locale: "ar" | "en";
  course: Course | null;
  cancelHref: string;
}) {
  const a = dict.admin.courseFields;
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [titleAr, setTitleAr] = useState(course?.title_ar ?? "");
  const [titleEn, setTitleEn] = useState(course?.title_en ?? "");
  const [subjectAr, setSubjectAr] = useState(course?.subject_ar ?? "");
  const [subjectEn, setSubjectEn] = useState(course?.subject_en ?? "");
  const [descAr, setDescAr] = useState(course?.description_ar ?? "");
  const [descEn, setDescEn] = useState(course?.description_en ?? "");
  const [learnAr, setLearnAr] = useState((course?.what_you_learn_ar ?? []).join("\n"));
  const [learnEn, setLearnEn] = useState((course?.what_you_learn_en ?? []).join("\n"));
  const [grade, setGrade] = useState(course?.grade ?? "الصف الأول الثانوي");
  const [price, setPrice] = useState(course?.price ?? 250);
  const [durationWeeks, setDurationWeeks] = useState(course?.duration_weeks ?? 10);
  const [imageUrl, setImageUrl] = useState(course?.image_url ?? "");
  const [slug, setSlug] = useState(course?.slug ?? "");
  const [status, setStatus] = useState<"published" | "draft">(course?.status ?? "published");
  const [featured, setFeatured] = useState(course?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(course?.sort_order ?? 1);
  const [lessons, setLessons] = useState<LessonDraft[]>(
    (course?.lessons ?? [])
      .sort((x: Lesson, y: Lesson) => x.sort_order - y.sort_order)
      .map((l) => ({
        title_ar: l.title_ar,
        title_en: l.title_en,
        description_ar: l.description_ar,
        description_en: l.description_en,
        duration_minutes: l.duration_minutes,
      }))
  );

  const setLesson = (i: number, key: keyof LessonDraft, value: string | number) =>
    setLessons((prev) => prev.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)));

  const save = async () => {
    if (!titleAr.trim() || !titleEn.trim()) {
      toast("error", dict.common.error);
      return;
    }
    setSaving(true);
    try {
      const { saveCourse } = await import("@/lib/data/admin");
      const res = await saveCourse({
        id: course?.id,
        slug: slug.trim() || slugify(pick(locale, titleAr, titleEn)),
        subject_ar: subjectAr,
        subject_en: subjectEn,
        title_ar: titleAr,
        title_en: titleEn,
        description_ar: descAr,
        description_en: descEn,
        what_you_learn_ar: learnAr.split("\n").map((s) => s.trim()).filter(Boolean),
        what_you_learn_en: learnEn.split("\n").map((s) => s.trim()).filter(Boolean),
        grade,
        price: Number(price) || 0,
        duration_weeks: Number(durationWeeks) || 1,
        image_url: imageUrl || null,
        status,
        featured,
        sort_order: Number(sortOrder) || 1,
        lessons: lessons.map((l, i) => ({ ...l, sort_order: i + 1 })),
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="grid grid--2" style={{ gap: "0 1.5rem" }}>
        <Field label={a.titleAr} required htmlFor="c-title-ar">
          <Input id="c-title-ar" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
        </Field>
        <Field label={a.titleEn} required htmlFor="c-title-en">
          <Input id="c-title-en" dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </Field>
        <Field label={a.subjectAr} htmlFor="c-sub-ar">
          <Input id="c-sub-ar" value={subjectAr} onChange={(e) => setSubjectAr(e.target.value)} />
        </Field>
        <Field label={a.subjectEn} htmlFor="c-sub-en">
          <Input id="c-sub-en" dir="ltr" value={subjectEn} onChange={(e) => setSubjectEn(e.target.value)} />
        </Field>
        <Field label={a.descriptionAr} htmlFor="c-desc-ar">
          <Textarea id="c-desc-ar" value={descAr} onChange={(e) => setDescAr(e.target.value)} />
        </Field>
        <Field label={a.descriptionEn} htmlFor="c-desc-en">
          <Textarea id="c-desc-en" dir="ltr" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
        </Field>
        <Field label={a.whatYouLearnAr} htmlFor="c-learn-ar">
          <Textarea id="c-learn-ar" value={learnAr} onChange={(e) => setLearnAr(e.target.value)} />
        </Field>
        <Field label={a.whatYouLearnEn} htmlFor="c-learn-en">
          <Textarea id="c-learn-en" dir="ltr" value={learnEn} onChange={(e) => setLearnEn(e.target.value)} />
        </Field>
        <Field label={a.grade} htmlFor="c-grade">
          <Input id="c-grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
        </Field>
        <Field label={a.slug} hint={a.slugAuto} htmlFor="c-slug">
          <Input id="c-slug" dir="ltr" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </Field>
        <Field label={a.price} htmlFor="c-price">
          <Input id="c-price" type="number" dir="ltr" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </Field>
        <Field label={a.durationWeeks} htmlFor="c-dur">
          <Input id="c-dur" type="number" dir="ltr" value={durationWeeks} onChange={(e) => setDurationWeeks(Number(e.target.value))} />
        </Field>
        <Field label={locale === "ar" ? "الترتيب" : "Sort"} htmlFor="c-sort">
          <Input id="c-sort" type="number" dir="ltr" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        </Field>
        <Field label={dict.admin.status} htmlFor="c-status">
          <Select id="c-status" value={status} onChange={(e) => setStatus(e.target.value as "published" | "draft")}>
            <option value="published">{dict.admin.published}</option>
            <option value="draft">{dict.admin.draft}</option>
          </Select>
        </Field>
      </div>

      <label className="checkbox" style={{ marginBlock: "0.5rem" }}>
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        {dict.admin.featured}
      </label>

      <div style={{ marginBlock: "var(--sp-4)" }}>
        <FileUpload
          dict={dict}
          label={a.image}
          value={imageUrl}
          onChange={setImageUrl}
          bucket="course-images"
          preview
          accept="image/*"
        />
      </div>

      {/* Lessons */}
      <div style={{ marginBlockStart: "var(--sp-4)" }}>
        <h3 style={{ fontSize: "var(--fs-lg)", marginBlockEnd: "var(--sp-4)" }}>{a.lessons}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {lessons.map((lesson, i) => (
            <div key={i} className="card card--inset" style={{ padding: "var(--sp-5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "0.75rem" }}>
                <strong>
                  {locale === "ar" ? "الدرس" : "Lesson"} {i + 1}
                </strong>
                <Button variant="ghost" size="sm" onClick={() => setLessons((prev) => prev.filter((_, idx) => idx !== i))} icon={<IconTrash />}>
                  {dict.common.delete}
                </Button>
              </div>
              <div className="grid grid--2" style={{ gap: "0 1.25rem" }}>
                <Field label={a.lessonTitleAr} htmlFor={`l-${i}-ar`}>
                  <Input id={`l-${i}-ar`} value={lesson.title_ar} onChange={(e) => setLesson(i, "title_ar", e.target.value)} />
                </Field>
                <Field label={a.lessonTitleEn} htmlFor={`l-${i}-en`}>
                  <Input id={`l-${i}-en`} dir="ltr" value={lesson.title_en} onChange={(e) => setLesson(i, "title_en", e.target.value)} />
                </Field>
                <Field label={a.lessonDescAr} htmlFor={`l-${i}-d-ar`}>
                  <Textarea id={`l-${i}-d-ar`} value={lesson.description_ar} onChange={(e) => setLesson(i, "description_ar", e.target.value)} />
                </Field>
                <Field label={a.lessonDescEn} htmlFor={`l-${i}-d-en`}>
                  <Textarea id={`l-${i}-d-en`} dir="ltr" value={lesson.description_en} onChange={(e) => setLesson(i, "description_en", e.target.value)} />
                </Field>
                <Field label={a.lessonMinutes} htmlFor={`l-${i}-min`}>
                  <Input id={`l-${i}-min`} type="number" dir="ltr" value={lesson.duration_minutes} onChange={(e) => setLesson(i, "duration_minutes", Number(e.target.value))} />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" style={{ marginBlockStart: "var(--sp-4)" }} onClick={() => setLessons((prev) => [...prev, emptyLesson()])} icon={<IconPlus />}>
          {a.addLesson}
        </Button>
      </div>

      <SaveBar dict={dict} onSave={save} onCancel={() => router.push(cancelHref)} saving={saving} />
    </div>
  );
}
