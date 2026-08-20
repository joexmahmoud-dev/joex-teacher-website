import type { Testimonial } from "@/lib/db/types";

/**
 * Demo testimonials — every entry is marked is_demo: true and shows a demo
 * badge in the UI until replaced with real feedback from the dashboard.
 * Names are clearly placeholder-style to avoid impersonation.
 */
export const seedTestimonials: Testimonial[] = [
  {
    id: "t-1",
    student_name_ar: "أحمد س.",
    student_name_en: "Ahmed S.",
    grade: "الصف الثالث الثانوي",
    review_ar:
      "كنت فاكر الرياضيات حفظ، لكن مع أ/ كريم فهمت الجبر لأول مرة. الشرح بيبدأ من الأساسيات خطوة بخطوة، والامتحانات الأونلاين ساعدتني أعرف مستواي الحقيقي قبل الامتحان.",
    review_en:
      "I used to think math was all memorization, but with Mr. Karim I finally understood algebra. The explanations build up step by step, and the online exams showed me exactly where I stood before the real exam.",
    rating: 5,
    is_featured: true,
    is_demo: true,
    sort_order: 1,
    created_at: "2026-07-20T09:00:00Z",
  },
  {
    id: "t-2",
    student_name_ar: "مريم ع.",
    student_name_en: "Mariam A.",
    grade: "الصف الثاني الثانوي",
    review_ar:
      "الحصص أونلاين منظمة جدًا، والمذكرات بتنزل بعد كل درس. حبيت إن في متابعة فعلية لحل الواجبات مش مجرد شرح وبس.",
    review_en:
      "The online lessons are very organized, and new materials are uploaded after every lesson. I love that homework is actually followed up on — it's not just explanations and done.",
    rating: 5,
    is_featured: true,
    is_demo: true,
    sort_order: 2,
    created_at: "2026-07-15T09:00:00Z",
  },
  {
    id: "t-3",
    student_name_ar: "عمر خ.",
    student_name_en: "Omar K.",
    grade: "الصف الأول الثانوي",
    review_ar:
      "أول مرة أحس إن المسائل ليها منطق مش أرقام عشوائية. امتحانات المنصة صعبة شوية بس بتخليك جاهز لأي سؤال.",
    review_en:
      "First time I felt like math problems actually have logic instead of random numbers. The platform exams are a bit challenging, but they prepare you for anything.",
    rating: 4,
    is_featured: false,
    is_demo: true,
    sort_order: 3,
    created_at: "2026-07-10T09:00:00Z",
  },
  {
    id: "t-4",
    student_name_ar: "سارة م.",
    student_name_en: "Sara M.",
    grade: "الصف الثالث الثانوي",
    review_ar:
      "مراجعة ليلة الامتحان كانت نقطة التحول — امتحانات تجريبية بوقت حقيقي وشرح للأخطاء بالتفصيل. وصلت لدرجة حلمت بيها.",
    review_en:
      "The exam-night revision was a turning point — timed mock exams and detailed explanations of every mistake. I reached the score I'd dreamed of.",
    rating: 5,
    is_featured: false,
    is_demo: true,
    sort_order: 4,
    created_at: "2026-06-30T09:00:00Z",
  },
  {
    id: "t-5",
    student_name_ar: "يوسف ر.",
    student_name_en: "Youssef R.",
    grade: "الصف الثاني الثانوي",
    review_ar:
      "الحجز كان سهل جدًا — اخترت اليوم والموعد وأكدت في دقيقة، ووصلني تأكيد على واتساب فورًا. تعامل راقي من البداية.",
    review_en:
      "Booking was super easy — I picked the day and time and confirmed within a minute, and got an instant confirmation on WhatsApp. Professional from the very start.",
    rating: 5,
    is_featured: false,
    is_demo: true,
    sort_order: 5,
    created_at: "2026-06-25T09:00:00Z",
  },
  {
    id: "t-6",
    student_name_ar: "ليلى ح.",
    student_name_en: "Laila H.",
    grade: "الصف الأول الثانوي",
    review_ar:
      "والدتي كانت قلقة من المادة، لكن بعد شهرين من الحصص بقيت بحل المسائل بثقة. الشرح بالعربي والإنجليزي ساعدني كتير في المصطلحات.",
    review_en:
      "My mother was worried about the subject, but after two months of lessons I solve problems with confidence. The Arabic and English explanations really helped with the terminology.",
    rating: 4,
    is_featured: false,
    is_demo: true,
    sort_order: 6,
    created_at: "2026-06-18T09:00:00Z",
  },
];
