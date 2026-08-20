import type { Material } from "@/lib/db/types";

export const seedMaterials: Material[] = [
  {
    id: "m-1",
    title_ar: "ملخص الجبر الشامل — الصف الأول الثانوي",
    title_en: "Complete Algebra Summary — 1st Secondary",
    description_ar:
      "ملخص مركّز لكل أبواب الجبر: القوانين الأساسية، أمثلة محلولة، وأسئلة تدريبية بإجاباتها.",
    description_en:
      "A condensed summary of all algebra chapters: key laws, worked examples and practice questions with answers.",
    subject_ar: "الجبر",
    subject_en: "Algebra",
    grade: "الصف الأول الثانوي",
    file_url: "/demo-files/algebra-summary-1st.pdf",
    file_type: "pdf",
    file_size_kb: 2458,
    upload_date: "2026-07-12",
    downloads: 184,
    status: "published",
  },
  {
    id: "m-2",
    title_ar: "إجابات نموذجية — امتحان التفاضل",
    title_en: "Model Answers — Calculus Exam",
    description_ar:
      "الإجابات النموذجية لامتحان التفاضل والتكامل مع شرح خطوات الحل الكاملة لكل سؤال.",
    description_en:
      "Model answers for the calculus exam with full step-by-step solutions for every question.",
    subject_ar: "التفاضل والتكامل",
    subject_en: "Calculus",
    grade: "الصف الثالث الثانوي",
    file_url: "/demo-files/calculus-model-answers.pdf",
    file_type: "pdf",
    file_size_kb: 1875,
    upload_date: "2026-07-20",
    downloads: 241,
    status: "published",
  },
  {
    id: "m-3",
    title_ar: "قوانين حساب المثلثات — ورقة شاملة",
    title_en: "Trigonometry Laws — Complete Sheet",
    description_ar:
      "كل قوانين حساب المثلثات في ورقة واحدة: النسب، المتطابقات، وقوانين حل المثلث.",
    description_en:
      "Every trigonometry law on a single sheet: ratios, identities and triangle-solving rules.",
    subject_ar: "حساب المثلثات",
    subject_en: "Trigonometry",
    grade: "الصف الأول الثانوي",
    file_url: "/demo-files/trig-laws-sheet.pdf",
    file_type: "pdf",
    file_size_kb: 924,
    upload_date: "2026-07-05",
    downloads: 312,
    status: "published",
  },
  {
    id: "m-4",
    title_ar: "مراجعة ليلة الامتحان — الصف الثالث",
    title_en: "Exam-Night Review — 3rd Secondary",
    description_ar:
      "الملخص الأخير قبل الامتحان: أهم القوانين والنقاط الحرجة والأخطاء الشائعة التي يجب تجنبها.",
    description_en:
      "The final review before the exam: key laws, critical points and common mistakes to avoid.",
    subject_ar: "الرياضيات",
    subject_en: "Mathematics",
    grade: "الصف الثالث الثانوي",
    file_url: "/demo-files/exam-night-review.pdf",
    file_type: "pdf",
    file_size_kb: 3180,
    upload_date: "2026-07-28",
    downloads: 428,
    status: "published",
  },
  {
    id: "m-5",
    title_ar: "تمارين الدوال — مع الحلول الكاملة",
    title_en: "Functions Exercises — With Full Solutions",
    description_ar:
      "بنك تمارين على الدوال الحقيقية وتمثيلها البياني، مصنف حسب الصعوبة مع الحلول.",
    description_en:
      "An exercise bank on real functions and their graphs, graded by difficulty with solutions.",
    subject_ar: "الجبر",
    subject_en: "Algebra",
    grade: "الصف الثاني الثانوي",
    file_url: "/demo-files/functions-exercises.pdf",
    file_type: "pdf",
    file_size_kb: 1240,
    upload_date: "2026-07-18",
    downloads: 156,
    status: "published",
  },
  {
    id: "m-6",
    title_ar: "جداول مراجعة منتصف العام",
    title_en: "Mid-Year Revision Schedule",
    description_ar:
      "خطة مراجعة منظمة لامتحانات منتصف العام: ماذا تراجع كل يوم وكيف توزع وقتك.",
    description_en:
      "An organized revision plan for mid-year exams: what to review each day and how to manage your time.",
    subject_ar: "الرياضيات",
    subject_en: "Mathematics",
    grade: "كل الصفوف",
    file_url: "/demo-files/midyear-schedule.pdf",
    file_type: "pdf",
    file_size_kb: 742,
    upload_date: "2026-06-30",
    downloads: 203,
    status: "published",
  },
];
