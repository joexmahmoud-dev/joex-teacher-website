"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/types";
import type { Exam, ExamQuestion } from "@/lib/db/types";
import { Field, Input, Select } from "@/components/ui/fields";
import { Button } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/overlay";
import { SaveBar } from "@/components/admin/AdminFormKit";
import { IconPlus, IconTrash } from "@/components/ui/icons";

interface QuestionDraft {
  question_ar: string;
  question_en: string;
  options_ar: string[];
  options_en: string[];
  correct_index: number;
  explanation_ar: string;
  explanation_en: string;
}

const emptyQuestion = (): QuestionDraft => ({
  question_ar: "",
  question_en: "",
  options_ar: ["", "", "", ""],
  options_en: ["", "", "", ""],
  correct_index: 0,
  explanation_ar: "",
  explanation_en: "",
});

export function ExamForm({
  dict,
  exam,
  cancelHref,
}: {
  dict: Dictionary;
  exam: Exam | null;
  cancelHref: string;
}) {
  const a = dict.admin.examFields;
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [titleAr, setTitleAr] = useState(exam?.title_ar ?? "");
  const [titleEn, setTitleEn] = useState(exam?.title_en ?? "");
  const [subjectAr, setSubjectAr] = useState(exam?.subject_ar ?? "");
  const [subjectEn, setSubjectEn] = useState(exam?.subject_en ?? "");
  const [grade, setGrade] = useState(exam?.grade ?? "الصف الأول الثانوي");
  const [difficulty, setDifficulty] = useState<Exam["difficulty"]>(exam?.difficulty ?? "medium");
  const [duration, setDuration] = useState(exam?.duration_minutes ?? 20);
  const [available, setAvailable] = useState(exam?.is_available ?? true);
  const [sortOrder, setSortOrder] = useState(exam?.sort_order ?? 1);
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    (exam?.questions ?? [])
      .sort((x: ExamQuestion, y: ExamQuestion) => x.sort_order - y.sort_order)
      .map((q) => ({
        question_ar: q.question_ar,
        question_en: q.question_en,
        options_ar: [...q.options_ar],
        options_en: [...q.options_en],
        correct_index: q.correct_index,
        explanation_ar: q.explanation_ar,
        explanation_en: q.explanation_en,
      }))
  );

  const setQ = (i: number, key: keyof QuestionDraft, value: unknown) =>
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, [key]: value } : q)));
  const setOption = (qi: number, oi: number, lang: "ar" | "en", value: string) =>
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === qi ? { ...q, [`options_${lang}`]: q[`options_${lang}`].map((o, i2) => (i2 === oi ? value : o)) } : q
      )
    );

  const save = async () => {
    if (!titleAr.trim() || !titleEn.trim() || questions.some((q) => !q.question_ar.trim() || !q.question_en.trim())) {
      toast("error", dict.common.error);
      return;
    }
    setSaving(true);
    try {
      const { saveExam } = await import("@/lib/data/admin");
      const res = await saveExam({
        id: exam?.id,
        title_ar: titleAr,
        title_en: titleEn,
        subject_ar: subjectAr,
        subject_en: subjectEn,
        grade,
        difficulty: difficulty as Exam["difficulty"],
        duration_minutes: Number(duration) || 10,
        is_available: available,
        sort_order: Number(sortOrder) || 1,
        questions: questions.map((q, i) => ({
          ...q,
          sort_order: i + 1,
        })),
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
        <Field label={a.titleAr} required htmlFor="e-title-ar">
          <Input id="e-title-ar" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
        </Field>
        <Field label={a.titleEn} required htmlFor="e-title-en">
          <Input id="e-title-en" dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </Field>
        <Field label={a.subjectAr} htmlFor="e-sub-ar">
          <Input id="e-sub-ar" value={subjectAr} onChange={(e) => setSubjectAr(e.target.value)} />
        </Field>
        <Field label={a.subjectEn} htmlFor="e-sub-en">
          <Input id="e-sub-en" dir="ltr" value={subjectEn} onChange={(e) => setSubjectEn(e.target.value)} />
        </Field>
        <Field label={a.grade} htmlFor="e-grade">
          <Input id="e-grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
        </Field>
        <Field label={a.difficulty} htmlFor="e-diff">
          <Select id="e-diff" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Exam["difficulty"])}>
            <option value="easy">{dict.exams.difficulty.easy}</option>
            <option value="medium">{dict.exams.difficulty.medium}</option>
            <option value="hard">{dict.exams.difficulty.hard}</option>
          </Select>
        </Field>
        <Field label={a.durationMinutes} htmlFor="e-dur">
          <Input id="e-dur" type="number" dir="ltr" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </Field>
        <Field label="Sort" htmlFor="e-sort">
          <Input id="e-sort" type="number" dir="ltr" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        </Field>
      </div>

      <label className="checkbox" style={{ marginBlock: "0.75rem" }}>
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
        {a.isAvailable}
      </label>

      {/* Questions */}
      <div style={{ marginBlockStart: "var(--sp-4)" }}>
        <h3 style={{ fontSize: "var(--fs-lg)", marginBlockEnd: "var(--sp-4)" }}>{a.questions}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {questions.map((q, qi) => (
            <div key={qi} className="card card--inset" style={{ padding: "var(--sp-5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "0.75rem" }}>
                <strong>{dict.examRunner.question} {qi + 1}</strong>
                <Button variant="ghost" size="sm" onClick={() => setQuestions((prev) => prev.filter((_, i2) => i2 !== qi))} icon={<IconTrash />}>
                  {dict.common.delete}
                </Button>
              </div>
              <div className="grid grid--2" style={{ gap: "0 1.25rem" }}>
                <Field label={a.questionAr} htmlFor={`q-${qi}-ar`}>
                  <Input id={`q-${qi}-ar`} value={q.question_ar} onChange={(e) => setQ(qi, "question_ar", e.target.value)} />
                </Field>
                <Field label={a.questionEn} htmlFor={`q-${qi}-en`}>
                  <Input id={`q-${qi}-en`} dir="ltr" value={q.question_en} onChange={(e) => setQ(qi, "question_en", e.target.value)} />
                </Field>
              </div>
              <div className="grid grid--2" style={{ gap: "0 1.25rem" }}>
                <Field label={a.optionsAr} htmlFor={`q-${qi}-opts-ar`}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {q.options_ar.map((opt, oi) => (
                      <Input
                        key={oi}
                        value={opt}
                        placeholder={`${String.fromCharCode(65 + oi)} — عربي`}
                        onChange={(e) => setOption(qi, oi, "ar", e.target.value)}
                      />
                    ))}
                  </div>
                </Field>
                <Field label={a.optionsEn} htmlFor={`q-${qi}-opts-en`}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {q.options_en.map((opt, oi) => (
                      <Input
                        key={oi}
                        dir="ltr"
                        value={opt}
                        placeholder={`${String.fromCharCode(65 + oi)} — English`}
                        onChange={(e) => setOption(qi, oi, "en", e.target.value)}
                      />
                    ))}
                  </div>
                </Field>
                <Field label={a.correctIndex} htmlFor={`q-${qi}-correct`}>
                  <Input
                    id={`q-${qi}-correct`}
                    type="number"
                    dir="ltr"
                    min={1}
                    max={4}
                    value={q.correct_index + 1}
                    onChange={(e) => setQ(qi, "correct_index", Math.min(4, Math.max(1, Number(e.target.value))) - 1)}
                  />
                </Field>
                <Field label={a.explanationAr} htmlFor={`q-${qi}-exp-ar`}>
                  <Input id={`q-${qi}-exp-ar`} value={q.explanation_ar} onChange={(e) => setQ(qi, "explanation_ar", e.target.value)} />
                </Field>
                <Field label={a.explanationEn} htmlFor={`q-${qi}-exp-en`}>
                  <Input id={`q-${qi}-exp-en`} dir="ltr" value={q.explanation_en} onChange={(e) => setQ(qi, "explanation_en", e.target.value)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" style={{ marginBlockStart: "var(--sp-4)" }} onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])} icon={<IconPlus />}>
          {a.addQuestion}
        </Button>
      </div>

      <SaveBar dict={dict} onSave={save} onCancel={() => router.push(cancelHref)} saving={saving} />
    </div>
  );
}
