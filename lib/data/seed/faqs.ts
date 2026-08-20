import type { Faq } from "@/lib/db/types";

/** FAQ content — also used for FAQPage structured data. */
export const seedFaqs: Faq[] = [
  {
    id: "faq-grades",
    question_ar: "ما الصفوف التي تُدرّسها؟",
    question_en: "Which grades do you teach?",
    answer_ar:
      "أُدرّس مادة الرياضيات للصفوف الثلاثة من المرحلة الثانوية (الأول والثاني والثالث الثانوي)، في نظامي العربي والدولي، مع تركيز خاص على الاستعداد للامتحانات.",
    answer_en:
      "I teach mathematics across all three secondary grades (1st, 2nd and 3rd), in both the Egyptian and international curricula, with a special focus on exam readiness.",
    sort_order: 1,
  },
  {
    id: "faq-format",
    question_ar: "هل الحصص أونلاين أم حضوري؟",
    question_en: "Are the lessons online or in person?",
    answer_ar:
      "الحصص متاحة بالطريقتين: أونلاين عبر منصات الفيديو (Zoom / Meet) مع شاشة تفاعلية، أو حضوريًا في القاهرة (مدينة نصر). اختر ما يناسبك عند الحجز.",
    answer_en:
      "Both. Lessons are available online via video platforms (Zoom / Meet) with an interactive whiteboard, or in person in Cairo (Nasr City). Choose whichever suits you when booking.",
    sort_order: 2,
  },
  {
    id: "faq-book",
    question_ar: "كيف أحجز حصة؟",
    question_en: "How do I book a lesson?",
    answer_ar:
      "من صفحة «احجز حصتك» اختر الخدمة واليوم والموعد وأدخل بياناتك ثم أكّد الحجز — سأصلك رسالة على واتساب لتأكيد الموعد وترتيب التفاصيل.",
    answer_en:
      "From the “Book a Lesson” page, choose a service, date and time, enter your details and confirm — you'll receive a WhatsApp message to finalize the booking.",
    sort_order: 3,
  },
  {
    id: "faq-fees",
    question_ar: "ما هي أسعار الحصص؟",
    question_en: "What are the fees?",
    answer_ar:
      "تختلف الأسعار حسب نوع الحصة (خاصة / مجموعة / مراجعات / اشتراك شهري). تظهر الأسعار التفصيلية في صفحات الكورسات، ويمكنك التواصل على واتساب للتعرف على العروض الحالية.",
    answer_en:
      "Fees vary by lesson type (private / group / revision / monthly package). Detailed prices are shown on the course pages, and you can contact me on WhatsApp for current offers.",
    sort_order: 4,
  },
  {
    id: "faq-materials",
    question_ar: "هل المذكرات والملفات مشمولة؟",
    question_en: "Are the materials included?",
    answer_ar:
      "نعم، يحصل كل طالب على مذكرات الشرح وملخصات المراجعة وإجابات النماذج بصيغة PDF من صفحة «المذكرات»، بالإضافة إلى الوصول للامتحانات الأونلاين وتصحيحها الفوري.",
    answer_en:
      "Yes. Every student gets lesson notes, revision summaries and model answers as PDFs from the Materials page, plus access to online exams with instant grading.",
    sort_order: 5,
  },
  {
    id: "faq-examprep",
    question_ar: "هل تقدم مراجعات قبل الامتحانات؟",
    question_en: "Do you offer exam revision?",
    answer_ar:
      "أوفر مراجعات مكثفة قبل امتحانات نصف العام والنهاية، مع امتحانات تجريبية شاملة على المنصة وشرح نموذج الإجابة بالتفصيل.",
    answer_en:
      "Yes — intensive revision sessions before mid-year and final exams, plus full mock exams on the platform with detailed answer walkthroughs.",
    sort_order: 6,
  },
  {
    id: "faq-reschedule",
    question_ar: "هل يمكنني تغيير موعد الحصة؟",
    question_en: "Can I reschedule a lesson?",
    answer_ar:
      "يمكنك تأجيل الحصة قبل موعدها بـ ٢٤ ساعة على الأقل عبر واتساب، وسيتم ترتيب موعد بديل يناسبك.",
    answer_en:
      "You can reschedule up to 24 hours before the lesson via WhatsApp, and we'll arrange a new time that suits you.",
    sort_order: 7,
  },
  {
    id: "faq-examsonline",
    question_ar: "كيف تعمل الامتحانات الأونلاين؟",
    question_en: "How do the online exams work?",
    answer_ar:
      "الامتحانات بوقت محدد وتصحيح فوري: تبدأ الامتحان، وتُجيب على الأسئلة، وبعد التسليم تظهر درجتك ونسبة إجاباتك الصحيحة مع تقييم لأدائك. النتائج تُحفظ في حسابك إن كان لديك حساب.",
    answer_en:
      "Exams are timed and auto-graded: start the exam, answer the questions, and upon submission you instantly see your score, accuracy and performance summary. Results are saved to your account when logged in.",
    sort_order: 8,
  },
];
