import Link from "next/link";
import type { Exam } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { pick } from "@/lib/i18n/content";
import { countLabel } from "@/lib/i18n/plural";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { IconArrow, IconClock, IconClipboard, IconTimer } from "@/components/ui/icons";

const difficultyTone: Record<Exam["difficulty"], "green" | "gold" | "red"> = {
  easy: "green",
  medium: "gold",
  hard: "red",
};

export function ExamCard({
  exam,
  locale,
  dict,
  prefix,
}: {
  exam: Exam;
  locale: Locale;
  dict: Dictionary;
  prefix: string;
}) {
  const title = pick(locale, exam.title_ar, exam.title_en);
  const subject = pick(locale, exam.subject_ar, exam.subject_en);
  const questionsCount = exam.questions?.length ?? 0;
  const href = `${prefix}/exams/${exam.id}`;

  return (
    <Card hover className="exam-card">
      <div className="card__body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="exam-card__head">
          <div>
            <h3 className="course-card__title" style={{ fontSize: "var(--fs-lg)" }}>
              {title}
            </h3>
            <span className="course-card__grade">{subject} · {exam.grade}</span>
          </div>
          <Badge tone={difficultyTone[exam.difficulty]}>
            {dict.exams.difficulty[exam.difficulty]}
          </Badge>
        </div>

        <div className="exam-card__meta">
          <span className="exam-meta-item">
            <IconClipboard />
            {countLabel(locale, dict.exams.questions, questionsCount)}
          </span>
          <span className="exam-meta-item">
            <IconTimer />
            {countLabel(locale, dict.exams.minutes, exam.duration_minutes)}
          </span>
        </div>

        <div className="course-card__foot" style={{ marginBlockStart: 0 }}>
          <Badge tone={exam.is_available ? "green" : "gray"}>
            {exam.is_available ? dict.exams.available : dict.exams.unavailable}
          </Badge>
          {exam.is_available ? (
            <Button href={href} size="sm" icon={<IconArrow />}>
              {dict.exams.startExam}
            </Button>
          ) : (
            <span className="text-faint">
              <IconClock style={{ width: "0.95rem", height: "0.95rem", display: "inline", marginInlineEnd: "0.3rem" }} />
              {dict.exams.unavailable}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export function ExamListEmpty({
  locale,
  dict,
  prefix,
}: {
  locale: Locale;
  dict: Dictionary;
  prefix: string;
}) {
  return (
    <div className="state">
      <span className="state__icon">
        <IconClipboard />
      </span>
      <h3>{dict.exams.empty}</h3>
      <p>{dict.exams.emptyHint}</p>
      <div className="state__action">
        <Button href={`${prefix}/courses`} variant="outline">
          {dict.nav.courses}
        </Button>
      </div>
    </div>
  );
}

export function ExamLink({ exam, locale }: { exam: Exam; locale: Locale }) {
  return (
    <Link href={`/${locale}/exams/${exam.id}`}>
      {pick(locale, exam.title_ar, exam.title_en)}
    </Link>
  );
}
