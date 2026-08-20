import type { SiteConfig } from "@/lib/db/types";

/**
 * Demo teacher identity — clearly replaceable via the admin dashboard
 * (Settings → Site Settings). demo_mode: true shows demo badges in the UI.
 * All stats are placeholders provided for preview only.
 */
export const seedSiteConfig: SiteConfig = {
  teacher_name_ar: "أ/ كريم حسن",
  teacher_name_en: "Mr. Karim Hassan",
  teacher_title_ar: "مدرس رياضيات للمرحلة الثانوية",
  teacher_title_en: "Secondary School Mathematics Teacher",
  subject_ar: "الرياضيات",
  subject_en: "Mathematics",
  city_ar: "القاهرة",
  city_en: "Cairo",
  whatsapp: "+201001234567",
  phone: "+201001234567",
  email: "karim.hassan@joex-teacher.example",
  address_ar: "القاهرة — مدينة نصر",
  address_en: "Cairo — Nasr City",
  bio_ar:
    "أكثر من ٨ سنوات في تدريس الرياضيات لطلاب المرحلة الثانوية، أؤمن أن الرياضيات تُفهم ولا تُحفظ. أعتمد في الشرح على ربط الأفكار ببعضها والتدريب المنظم، مع متابعة مستمرة لكل طالب حتى يصل إلى أعلى مستوياته. (هذه نبذة تجريبية — يمكن تحديثها من لوحة التحكم)",
  bio_en:
    "More than 8 years teaching mathematics to secondary school students. I believe mathematics is understood, not memorized — my lessons connect ideas, build from fundamentals, and follow each student with structured practice until they reach their full potential. (Demo bio — update from the dashboard)",
  photo_url: "/images/teacher-portrait.png",
  facebook: null,
  youtube: null,
  tiktok: null,
  students_count: 2500,
  years_experience: 8,
  success_rate: 95,
  exams_count: 120,
  demo_mode: true,
};
