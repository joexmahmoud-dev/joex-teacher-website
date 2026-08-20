"use client";

import { useMemo, useState } from "react";
import type { Course } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { pick } from "@/lib/i18n/content";
import { formatNumber } from "@/lib/i18n/config";
import { CourseCard } from "@/components/courses/CourseCard";
import { EmptyState } from "@/components/ui/primitives";
import { Input, Select } from "@/components/ui/fields";
import { IconSearch } from "@/components/ui/icons";

export function CourseFilters({
  courses,
  locale,
  dict,
  prefix,
}: {
  courses: Course[];
  locale: Locale;
  dict: Dictionary;
  prefix: string;
}) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [grade, setGrade] = useState("all");

  const subjects = useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach((c) => map.set(pick(locale, c.subject_ar, c.subject_en), pick(locale, c.subject_ar, c.subject_en)));
    return Array.from(map.values()).sort();
  }, [courses, locale]);

  const grades = useMemo(() => Array.from(new Set(courses.map((c) => c.grade))).sort(), [courses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const title = pick(locale, c.title_ar, c.title_en).toLowerCase();
      const desc = pick(locale, c.description_ar, c.description_en).toLowerCase();
      const s = pick(locale, c.subject_ar, c.subject_en);
      if (subject !== "all" && s !== subject) return false;
      if (grade !== "all" && c.grade !== grade) return false;
      if (q && !title.includes(q) && !desc.includes(q)) return false;
      return true;
    });
  }, [courses, locale, query, subject, grade]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
      <div className="filter-bar">
        <Input
          id="course-q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.courses.filters.search}
          aria-label={dict.courses.filters.search}
        />
        <Select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label={dict.courses.filters.subject}>
          <option value="all">{dict.courses.filters.allSubjects}</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select value={grade} onChange={(e) => setGrade(e.target.value)} aria-label={dict.courses.filters.grade}>
          <option value="all">{dict.courses.filters.allGrades}</option>
          {grades.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </Select>
      </div>

      <p className="text-faint">
        {formatNumber(filtered.length, locale)} {dict.courses.filters.results}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconSearch />}
          title={dict.courses.empty}
          message={dict.courses.emptyHint}
        />
      ) : (
        <div className="grid grid--3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} locale={locale} dict={dict} prefix={prefix} />
          ))}
        </div>
      )}
    </div>
  );
}
