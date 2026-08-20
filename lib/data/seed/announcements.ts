import type { Announcement } from "@/lib/db/types";

export const seedAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title_ar: "استئناف الحصص بعد إجازة نصف العام",
    title_en: "Lessons resume after the mid-year break",
    content_ar:
      "أهلًا بالجميع 👋 نستأنف الحصص يوم السبت القادم بنفس الجداول. تم تحديث مواعيد المجموعات في صفحة الحجز، وراجعوا صفحة المذكرات لتحميل ملخصات الوحدات الجديدة قبل بداية الشرح.",
    content_en:
      "Welcome back 👋 Lessons resume next Saturday on the same schedule. Group times have been updated on the booking page — check the Materials page to download the new unit summaries before we begin.",
    is_published: true,
    published_at: "2026-08-15T09:00:00Z",
  },
  {
    id: "ann-2",
    title_ar: "امتحان جديد على المنصة",
    title_en: "New exam available on the platform",
    content_ar:
      "تمت إضافة امتحان «التفاضل والتكامل — الصف الثالث الثانوي» على صفحة الامتحانات. الامتحان بوقت محدد ٣٠ دقيقة، ويصوّب تلقائيًا فور التسليم. بالتوفيق!",
    content_en:
      "The “Calculus — 3rd Secondary” exam is now live on the Exams page. It's timed (30 minutes) and auto-graded on submission. Good luck!",
    is_published: true,
    published_at: "2026-08-10T09:00:00Z",
  },
  {
    id: "ann-3",
    title_ar: "مراجعات ما قبل امتحانات نهاية العام",
    title_en: "Final exam revision sessions",
    content_ar:
      "تبدأ مراجعات نهاية العام يوم الأحد القادم: مراجعة شاملة لكل صفوف الثانوية مع امتحانات تجريبية على المنصة. أماكن المجموعات محدودة — احجز مبكرًا.",
    content_en:
      "Final revision sessions start next Sunday: full reviews for all secondary grades with mock exams on the platform. Group spots are limited — book early.",
    is_published: true,
    published_at: "2026-07-28T09:00:00Z",
  },
];
