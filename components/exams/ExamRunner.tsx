"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Exam } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { pick, pickList } from "@/lib/i18n/content";
import { formatNumber } from "@/lib/i18n/config";
import { countLabel } from "@/lib/i18n/plural";
import { Button, Badge, Card } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/overlay";
import { ProgressRing } from "@/components/ui/motion";
import { IconArrow, IconCheckCircle, IconClipboard, IconClock, IconTimer } from "@/components/ui/icons";
import { cn, toPercent } from "@/lib/utils";

const OPTION_KEYS = ["A", "B", "C", "D", "E", "F"];

type Phase = "intro" | "running" | "done";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExamRunner({
  exam,
  locale,
  dict,
  prefix,
  canSave,
}: {
  exam: Exam;
  locale: Locale;
  dict: Dictionary;
  prefix: string;
  canSave: boolean;
}) {
  const t = dict.examRunner;
  const questions = exam.questions ?? [];
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedNote, setSavedNote] = useState<"saved" | "anonymous" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const title = pick(locale, exam.title_ar, exam.title_en);
  const answeredCount = answers.filter((a) => a !== null).length;

  const [result, setResult] = useState<{ correct: number; wrong: number; percentage: number } | null>(null);

  const submit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phase !== "running") return;
    setSubmitting(true);
    setConfirmOpen(false);

    let correct = 0;
    answers.forEach((answer, i) => {
      if (answer !== null && answer === questions[i].correct_index) correct += 1;
    });
    const wrong = answeredCount - correct;
    const percentage = toPercent(correct, questions.length);

    if (canSave) {
      const { saveExamAttempt } = await import("@/lib/data/writes");
      const res = await saveExamAttempt({
        examId: exam.id,
        score: correct,
        total: questions.length,
        correctCount: correct,
        wrongCount: wrong,
        answers,
      });
      if (res.ok && !res.preview) setSavedNote("saved");
      else setSavedNote("anonymous");
    } else {
      setSavedNote("anonymous");
    }

    setPhase("done");
    setSubmitting(false);
    setResult({ correct, wrong, percentage });
  };

  const start = () => {
    setPhase("running");
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
  };

  // Auto-submit when the timer reaches zero.
  useEffect(() => {
    if (phase === "running" && timeLeft === 0) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const summary = useMemo(() => {
    if (!result) return "";
    if (result.percentage >= 85) return t.summaryExcellent;
    if (result.percentage >= 65) return t.summaryGood;
    if (result.percentage >= 45) return t.summaryFair;
    return t.summaryPoor;
  }, [result, t]);

  const selectAnswer = (optionIndex: number) => {
    if (phase !== "running") return;
    setAnswers((prev) => prev.map((a, i) => (i === current ? optionIndex : a)));
  };

  const jumpTo = (i: number) => setCurrent(i);

  const retake = () => {
    setAnswers(questions.map(() => null));
    setCurrent(0);
    setTimeLeft(exam.duration_minutes * 60);
    setResult(null);
    setSavedNote(null);
    setPhase("intro");
  };

  const dangerTime = timeLeft <= 30;

  /* ── Intro ─────────────────────────────────────────────────────────── */
  if (phase === "intro") {
    return (
      <div className="exam-runner">
        <Card className="dash-card" style={{ textAlign: "center", padding: "var(--sp-10)" }}>
          <span className="material-icon" style={{ margin: "0 auto 1.25rem" }}>
            <IconClipboard />
          </span>
          <h2 style={{ fontSize: "var(--h3)", marginBlockEnd: "var(--sp-3)" }}>{title}</h2>
          <div className="exam-card__meta" style={{ maxWidth: "26rem", margin: "0 auto var(--sp-6)" }}>
            <span className="exam-meta-item">
              <IconTimer />
              {countLabel(locale, dict.exams.minutes, exam.duration_minutes)}
            </span>
            <span className="exam-meta-item">
              <IconClipboard />
              {countLabel(locale, dict.exams.questions, questions.length)}
            </span>
          </div>
          <p className="text-muted" style={{ maxWidth: "26rem", margin: "0 auto var(--sp-6)" }}>
            {t.startHint}
          </p>
          <Button size="lg" onClick={start} icon={<IconArrow />}>
            {dict.exams.startExam}
          </Button>
        </Card>
      </div>
    );
  }

  /* ── Results ───────────────────────────────────────────────────────── */
  if (phase === "done" && result) {
    return (
      <div className="exam-runner">
        <div className="result-hero">
          <p className="eyebrow" style={{ justifyContent: "center", marginBlockEnd: "var(--sp-3)" }}>
            {t.resultTitle}
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginBlockEnd: "var(--sp-6)" }}>
            <ProgressRing value={result.percentage} size={150} stroke={12} />
          </div>
          <div className="result-score">{formatNumber(result.percentage, locale)}%</div>
          <p className="text-muted" style={{ marginBlockStart: "var(--sp-2)" }}>
            {result.correct} {t.outOf} {questions.length} {t.correct}
          </p>
        </div>

        <div className="result-stats" style={{ marginBlockEnd: "var(--sp-6)" }}>
          <div className="result-stat result-stat--correct">
            <div className="result-stat__num">{formatNumber(result.correct, locale)}</div>
            <div className="text-faint">{t.correct}</div>
          </div>
          <div className="result-stat result-stat--wrong">
            <div className="result-stat__num">{formatNumber(result.wrong, locale)}</div>
            <div className="text-faint">{t.wrong}</div>
          </div>
          <div className="result-stat">
            <div className="result-stat__num">{formatNumber(answeredCount, locale)}</div>
            <div className="text-faint">{t.answered}</div>
          </div>
        </div>

        <Card className="dash-card" style={{ marginBlockEnd: "var(--sp-6)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <IconCheckCircle style={{ color: "var(--c-success)", flexShrink: 0, marginBlockStart: "0.2rem" }} />
            <div>
              <h3 style={{ fontSize: "var(--fs-lg)", marginBlockEnd: "0.35rem" }}>{t.performance}</h3>
              <p className="text-muted">{summary}</p>
            </div>
          </div>
          {savedNote === "saved" ? (
            <Badge tone="green" style={{ marginBlockStart: "var(--sp-4)" }}>{t.saved}</Badge>
          ) : savedNote === "anonymous" ? (
            <Badge tone="demo" style={{ marginBlockStart: "var(--sp-4)" }}>{t.anonymousNote}</Badge>
          ) : null}
        </Card>

        <div className="exam-nav" style={{ justifyContent: "center" }}>
          <Button onClick={retake} variant="outline">{t.retake}</Button>
          <Button href={`${prefix}/exams`}>{t.backToExams}</Button>
          {canSave ? <Button href={`${prefix}/dashboard`} variant="ghost">{dict.nav.dashboard}</Button> : null}
        </div>

        {/* Review */}
        <div style={{ marginBlockStart: "var(--sp-8)" }}>
          <h3 style={{ fontSize: "var(--fs-xl)", marginBlockEnd: "var(--sp-4)" }}>{t.resultTitle} — {t.performance}</h3>
          {questions.map((q, qi) => {
            const userAnswer = answers[qi];
            const correct = q.correct_index;
            const isRight = userAnswer === correct;
            return (
              <div key={q.id} className="question">
                <p className="question__num">
                  {t.question} {qi + 1} {t.of} {questions.length}
                </p>
                <p className="question__text">{pick(locale, q.question_ar, q.question_en)}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {pickList(locale, q.options_ar, q.options_en).map((opt, oi) => (
                    <div
                      key={oi}
                      className={cn(
                        "option",
                        oi === correct && "option--correct",
                        userAnswer === oi && oi !== correct && "option--wrong"
                      )}
                      aria-pressed={userAnswer === oi}
                    >
                      <span className="option__key">{OPTION_KEYS[oi]}</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
                <p className="text-faint" style={{ marginBlockStart: "0.9rem", lineHeight: 1.7 }}>
                  {isRight ? "✓ " : "✗ "}
                  {pick(locale, q.explanation_ar, q.explanation_en)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Running ───────────────────────────────────────────────────────── */
  const question = questions[current];

  return (
    <div className="exam-runner">
      <div className="exam-runner__bar">
        <span className="timer">
          <IconClock />
          {t.timeRemaining}:{" "}
          <span className={cn(dangerTime && "timer--danger")} style={{ direction: "ltr" }}>
            {formatTime(timeLeft)}
          </span>
        </span>
        <span className="text-faint">
          {t.answered}: {formatNumber(answeredCount, locale)} / {formatNumber(questions.length, locale)}
        </span>
      </div>

      <div className="question">
        <p className="question__num">
          {t.question} {current + 1} {t.of} {questions.length}
        </p>
        <p className="question__text">{pick(locale, question.question_ar, question.question_en)}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {pickList(locale, question.options_ar, question.options_en).map((opt, oi) => (
            <button
              key={oi}
              className="option"
              aria-pressed={answers[current] === oi}
              onClick={() => selectAnswer(oi)}
            >
              <span className="option__key">{OPTION_KEYS[oi]}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="exam-nav">
        <Button
          variant="ghost"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          icon={<IconArrow style={{ transform: "scaleX(-1)" }} />}
        >
          {t.previous}
        </Button>
        {current < questions.length - 1 ? (
          <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} icon={<IconArrow />}>
            {t.next}
          </Button>
        ) : (
          <Button variant="accent" onClick={() => setConfirmOpen(true)}>
            {t.finish}
          </Button>
        )}
      </div>

      <div className="answer-dots" role="group" aria-label={t.answered}>
        {questions.map((q, i) => (
          <button
            key={q.id}
            className="answer-dot"
            data-state={answers[i] !== null ? "answered" : i === current ? "current" : undefined}
            onClick={() => jumpTo(i)}
            aria-label={`${t.question} ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title={t.submitConfirmTitle}>
        <p className="text-muted" style={{ marginBlockEnd: "var(--sp-5)" }}>{t.submitConfirmMsg}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>{t.continueExam}</Button>
          <Button variant="accent" onClick={submit} loading={submitting}>{t.submitAnyway}</Button>
        </div>
      </Modal>
    </div>
  );
}
