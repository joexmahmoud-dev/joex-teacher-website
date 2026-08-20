import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { pick } from "@/lib/i18n/content";
import { formatNumber, formatPrice } from "@/lib/i18n/config";
import { countLabel } from "@/lib/i18n/plural";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { IconArrow, IconBook, IconClock } from "@/components/ui/icons";

export function CourseCard({
  course,
  locale,
  dict,
  prefix,
}: {
  course: Course;
  locale: Locale;
  dict: Dictionary;
  prefix: string;
}) {
  const title = pick(locale, course.title_ar, course.title_en);
  const subject = pick(locale, course.subject_ar, course.subject_en);
  const description = pick(locale, course.description_ar, course.description_en);
  const lessonsCount = course.lessons?.length ?? 0;
  const href = `${prefix}/courses/${course.slug}`;

  return (
    <Card hover className="course-card">
      <div className="card__media course-card__media">
        <Badge tone="green" className="course-card__subject">
          {subject}
        </Badge>
        {course.image_url ? (
          <Image
            src={course.image_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="card__body course-card__body">
        <div>
          <span className="course-card__grade">{course.grade}</span>
          <h3 className="course-card__title">
            <Link href={href}>{title}</Link>
          </h3>
        </div>
        <p className="course-card__desc">{description}</p>
        <div className="course-card__meta">
          <span>
            <IconBook />
            {countLabel(locale, dict.courses.lessons, lessonsCount)}
          </span>
          <span>
            <IconClock />
            {countLabel(locale, dict.courses.weeks, course.duration_weeks)}
          </span>
        </div>
        <div className="course-card__foot">
          <span className="course-card__price">
            {formatPrice(course.price, locale)}
          </span>
          <Button href={href} size="sm" icon={<IconArrow />}>
            {dict.courses.viewCourse}
          </Button>
        </div>
      </div>
    </Card>
  );
}
