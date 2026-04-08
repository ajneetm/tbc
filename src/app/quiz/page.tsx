"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";


// ─── Types ───────────────────────────────────────────────────────────────────
interface Question {
  text: string;
  choices: string[];
  correct: number; // index of correct choice
}

interface Day {
  title: string;
  questions: Question[];
}

// ─── Quiz Data ────────────────────────────────────────────────────────────────
const days: Day[] = [
  // ── اليوم الأول ──
  {
    title: "اليوم الأول – الفرص التجارية",
    questions: [
      {
        text: "ما هي الفرصة التجارية؟",
        choices: [
          "فكرة إبداعية",
          "حاجة أو رغبة لدى العملاء",
          "تحسين منتج موجود",
          "تقليد مشروع مشابه ناجح",
        ],
        correct: 1,
      },
      {
        text: "أي من الخيارات التالية تعد سببًا شائعًا لفشل المشاريع الجديدة؟",
        choices: [
          "شراء الامتيازات التجارية",
          "الإبداع المفرط",
          "التركيز الزائد على الإدارة",
          "ضعف خطط الأعمال",
        ],
        correct: 3,
      },
      {
        text: "أي من الخيارات التالية ليس لتحويل الأفكار إلى فرص؟",
        choices: [
          "شراء مشروع مستقل",
          "بدء مشروع جديد",
          "إغلاق مشروع ناجح",
          "شراء امتياز تجاري",
        ],
        correct: 2,
      },
      {
        text: 'في أي ربع من ساعة العمل يحدث التشغيل الفعال والتسويق؟',
        choices: [
          "الصياغة Draft",
          "الملاحة Navigate",
          "التوليد Generate",
          "التأسيس Incorporate",
        ],
        correct: 1,
      },
      {
        text: "ما الذي يحول الفكرة إلى فرصة تجارية؟",
        choices: [
          "الابتكار دون إجراء بحث سوقي",
          "الإبداع وحده",
          "خيال المخترع",
          "دراسة متكاملة تشمل تحليل المخاطر",
        ],
        correct: 3,
      },
      {
        text: "ما هي الخاصية الأساسية للفرصة التجارية الناجحة؟",
        choices: [
          "تجاهل المنافسين",
          "الاعتماد على الإحساس",
          "التوقيت المناسب",
          "الحظ والصدفة",
        ],
        correct: 2,
      },
      {
        text: 'ماذا يمثل الحرف "T" في نموذج المنتج (Product Model)؟',
        choices: [
          "الجدول الزمني",
          "المنتج كمدخل إلى السوق",
          "العميل لتحسين استهداف السوق",
          "الربحية لتحقيق نمو الأعمال",
        ],
        correct: 0,
      },
      {
        text: "أي من الخيارات التالية تعد سمة رئيسية للفرصة التجارية الجيدة؟",
        choices: [
          "تقديم منتج مشابه لمنافسك دون تميز",
          "الاعتماد فقط على الأساليب التقليدية",
          "تجاهل تحليل المخاطر",
          "تقديم قيمة مضافة للعميل",
        ],
        correct: 3,
      },
      {
        text: "ما هي الخطوة الأولى في تحديد فجوات السوق؟",
        choices: [
          "إطلاق الفكرة دون التحقق من صحتها",
          "استخدام الابتكار الشخصي دون بحث",
          "إجراء أبحاث السوق لاكتشاف الاحتياجات غير الملباة",
          "جمع آراء الأصدقاء والعائلة",
        ],
        correct: 2,
      },
      {
        text: 'ما دور مرحلة التأسيس "Incorporate" في ساعة العمل؟',
        choices: [
          "مجرد التفكير في أفكار إبداعية",
          "الهوية والموارد والبنية الأساسية",
          "تحقيق الإيرادات فورًا",
          "الاعتماد فقط على الأفكار دون تنفيذ",
        ],
        correct: 1,
      },
    ],
  },

  // ── اليوم الثاني ──
  {
    title: "اليوم الثاني – نموذج المنتج (P & R)",
    questions: [
      {
        text: "ما هو الأساس الذي يُبنى عليه منتجك؟",
        choices: [
          "هدف واضح ومقنع",
          "اسم جذاب",
          "شعار ملفت للنظر",
          "عدد الميزات التي يحتويها",
        ],
        correct: 0,
      },
      {
        text: 'ما هي "نقطة الألم" Pain Point في سياق الأعمال التجارية؟',
        choices: [
          "استراتيجية تسويق الشركة",
          "ميزة منتج المنافس",
          "مشكلة أو تحدي يواجهه العملاء",
          "سعر المنتج",
        ],
        correct: 2,
      },
      {
        text: 'ماذا تعني "القيمة المضافة" في المنتج؟',
        choices: [
          "تكلفة المنتج",
          "الميزات الفريدة التي لا يقدمها المنافسون",
          "المواد المستخدمة في التغليف",
          "مقدار الإنفاق على تسويق المنتج",
        ],
        correct: 1,
      },
      {
        text: "أي من الخيارات التالية يُعد مثالاً على التكاليف الثابتة؟",
        choices: [
          "عدد المنتجات المباعة",
          "تكلفة المواد الخام",
          "عدد الموظفين",
          "إيجار موقع العمل التجاري",
        ],
        correct: 3,
      },
      {
        text: 'ماذا يمثل الحرف "P" في نموذج المنتج PRODUCT MODEL؟',
        choices: [
          "الغرض، وهو الأساس الذي يُبنى عليه المنتج",
          "الترويج عبر الحملات التسويقية",
          "الربح، لتحقيق الدخل",
          "الدفع، لإتمام المعاملات مع العملاء",
        ],
        correct: 0,
      },
      {
        text: "ما هي نقطة التعادل في العمل التجاري؟",
        choices: [
          "اللحظة التي ينسحب فيها جميع المنافسين من السوق",
          "اللحظة التي تتلقى فيها أول دفعة مالية",
          "عدد سداد جميع التكاليف الثابتة",
          "نقطة تساوي الإيرادات مع التكاليف",
        ],
        correct: 3,
      },
      {
        text: 'ما الذي يركز عليه مكون "العائد" في نموذج المنتج PRODUCT MODEL؟',
        choices: [
          "قياس رضا العملاء",
          "تصميم ميزات المنتج",
          "تحليل الربحية من خلال مقارنة التكاليف والإيرادات بمرور الوقت",
          "استراتيجيات التسويق للترويج للمنتج",
        ],
        correct: 2,
      },
      {
        text: "ما الذي يمنح منتجك ميزة تنافسية فريدة؟",
        choices: [
          "حملة إعلانية",
          "تكلفة منخفضة",
          "عدد الألوان المتوفرة",
          "الميزات أو الابتكارات الفريدة التي تميزه عن المنافسين",
        ],
        correct: 3,
      },
      {
        text: 'ما هو الهدف الأساسي لمكون "الغرض" في نموذج المنتج PRODUCT MODEL؟',
        choices: [
          "تحديد المهمة الأساسية للمنتج",
          "اختيار أفضل منصة تسويقية",
          "تقدير تكاليف الإنتاج",
          "إنشاء شعار جذاب للمنتج",
        ],
        correct: 0,
      },
      {
        text: 'ما هو الهدف من المكون الثاني "العائد" في نموذج المنتج PRODUCT MODEL؟',
        choices: [
          "تحسين تصميم المنتج",
          "تقييم عملاء المنتج",
          "تقييم الجدوى المالية والأرباح المتوقعة للمنتج",
          "تحليل استراتيجية التوزيع",
        ],
        correct: 2,
      },
    ],
  },

  // ── اليوم الثالث ──
  {
    title: "اليوم الثالث – الإمكانية والتصميم (O & D)",
    questions: [
      {
        text: 'ما هو الهدف الأساسي لمكون "الإمكانية" (OBTAINABILITY COMPONENT) في نموذج المنتج (PRODUCT MODEL)؟',
        choices: [
          "القدرة في الحصول على الموارد",
          "خفض تكاليف الإنتاج",
          "توسيع نطاق السوق",
          "زيادة تنوع المنتجات",
        ],
        correct: 0,
      },
      {
        text: "أي من العوامل التالية يعد ضرورياً لتقييم قدراتك على تنفيذ المشروع بنجاح؟",
        choices: [
          "تحليل المهارات والموارد والظروف الشخصية المتاحة",
          "إعداد استراتيجية تسويق تفصيلية",
          "وضع نموذج تسعير",
          "إجراء استطلاعات رأي العملاء",
        ],
        correct: 0,
      },
      {
        text: "كيف يمكنك سد أي فجوات مهارية يحتاجها مشروعك؟",
        choices: [
          "طلب المساعدة من الأصدقاء",
          "تقليص نطاق المشروع",
          "الاعتماد على المتطوعين",
          "توظيف مختصين أو تطوير مهاراتك من خلال التدريب",
        ],
        correct: 3,
      },
      {
        text: "عند التخطيط للموارد المالية، ما السؤال الأول الذي ينبغي أن تطرحه على نفسك؟",
        choices: [
          "كيف يمكنني خفض تكاليف الإنتاج؟",
          "هل أملك موارد مالية كافية لبدء المشروع؟",
          "ما هي استراتيجيات التسويق التي يجب أن أعتمدها؟",
          "من هم المنافسون في السوق؟",
        ],
        correct: 1,
      },
      {
        text: 'ما هو الهدف الأساسي الذي يركز عليه "مكون الإمكانية" (OBTAINABILITY COMPONENT) في نموذج المنتج (PRODUCT MODEL)؟',
        choices: [
          "تقييم القيمة الفريدة والفوائد التي يقدمها منتجك أو خدمتك",
          "فهم احتياجات السوق ونقاط الضعف لدى العملاء",
          "قياس القدرة على تنفيذ المشروع بالحصول على الموارد",
          "تحليل الجدوى المالية وإمكانات الربح للمشروع",
        ],
        correct: 2,
      },
      {
        text: 'ما هو الهدف الرئيسي لمكون "التصميم" (DESIGN) في نموذج المنتج (PRODUCT MODEL)؟',
        choices: [
          "تطوير عرض بيع فريد للمنتج",
          "فهم خصائص العملاء واتجاهات السوق",
          "تحليل التوقعات المالية والعوائد المحتملة",
          "تحويل الفكرة إلى فرصة مادية بكل مكوناتها",
        ],
        correct: 0,
      },
      {
        text: "لماذا يعد تقييم العملاء مهماً أثناء عملية التصميم؟",
        choices: [
          "يساعد في خفض تكاليف الإنتاج وزيادة هامش الربح",
          "يضمن أن المنتج النهائي يتوافق مع تفضيلات العملاء واحتياجاتهم",
          "يساعد في اختيار المواد الأكثر كفاءة من حيث التكلفة للإنتاج",
          "يلغي الحاجة إلى نموذج أولي قبل إطلاق المنتج",
        ],
        correct: 1,
      },
      {
        text: "كيف يمكن أن يؤثر اختيار المواد على تصميم المنتج؟",
        choices: [
          "تحدد المواد جودة المنتج ومتانته وقيمته الإجمالية",
          "ليس للمواد تأثير جوهري على نجاح المنتج",
          "يؤثر اختيار المواد فقط على مظهر المنتج وليس على وظيفته",
          "يمكن تغيير المواد بعد إطلاق المنتج دون أي تأثير سلبي",
        ],
        correct: 0,
      },
      {
        text: "ما هو الهدف من إنشاء رسم تخطيطي لفكرتك أثناء عملية التصميم؟",
        choices: [
          "يتيح الإنتاج الفوري للمنتج النهائي دون الحاجة إلى خطوات إضافية",
          "مجرد خطوة أولية ليس لها قيمة فعلية في تطوير المنتج",
          "يساعد على تصور وتخطيط الخطوات اللازمة لإنشاء منتج",
          "يركز على استراتيجيات التسويق أكثر من مواصفات التصميم",
        ],
        correct: 2,
      },
      {
        text: "ما هو الغرض الرئيسي لمكون التصميم في نموذج PRODUCT MODEL؟",
        choices: [
          "تحديد القيمة الفريدة والغرض الأساسي من المنتج",
          "تحويل الفكرة إلى منتج يلبي احتياجات العملاء وتوقعاتهم",
          "تقييم المهارات والموارد والعلاقات اللازمة لتنفيذ المشروع بنجاح",
          "تحليل الربحية والعوائد المتوقعة من المشروع بمرور الوقت",
        ],
        correct: 1,
      },
    ],
  },

  // ── اليوم الرابع ──
  {
    title: "اليوم الرابع – المستخدمون والمنافسة (U & C)",
    questions: [
      {
        text: 'ما هو الهدف الأساسي لمكون "المستخدمين" (USERS) في نموذج المنتج (PRODUCT MODEL)؟',
        choices: [
          "تقييم الموارد والمهارات المتاحة لتنفيذ المشروع",
          "تحديد الفئة المستهدفة وحجمها",
          "تحليل الجوانب المالية وربحية المنتج",
          "تصميم وتطوير الميزات التي تلبي احتياجات العملاء",
        ],
        correct: 1,
      },
      {
        text: "ما الذي يشمله رسم خريطة رحلة العميل؟",
        choices: [
          "تصور جميع مراحل تفاعل العميل مع المنتج",
          "تحليل استراتيجيات تفاعل العملاء لدى المنافسين",
          "التركيز فقط على قرار الشراء النهائي",
          "تحديد الموردين المحتملين للإنتاج",
        ],
        correct: 0,
      },
      {
        text: "كيف يمكن تحسين تجربة العميل مع المنتج؟",
        choices: [
          "تقديم خصومات متكررة دون دراسة احتياجات العملاء",
          "تقليل تكاليف الإنتاج",
          "زيادة ميزانية الإعلانات فقط",
          "تقييم مرحلة العميل بعناية",
        ],
        correct: 3,
      },
      {
        text: "ما أهمية أن يكون رائد الأعمال على دراية بجمهوره المستهدف؟",
        choices: [
          "يساعد في تصميم منتج ويزيد من فرص النجاح في السوق",
          "يقلل من تكاليف الإنتاج",
          "يوفر الوقت في تطوير المنتج",
          "يضمن التوزيع الجغرافي الفعال للمنتج",
        ],
        correct: 0,
      },
      {
        text: "من الذي يشكل جمهور منتجك؟",
        choices: [
          "فقط الأفراد الذين لديهم اهتمام مباشر بالمنتج",
          "أي شخص يعيش في المنطقة الجغرافية المحيطة",
          "الأفراد أو الشركات أو أي من الكيانات الأخرى",
          "مستخدمو المنتجات المنافسة فقط",
        ],
        correct: 0,
      },
      {
        text: "ما الهدف الأساسي من فهم المنافسين؟",
        choices: [
          "تقليد استراتيجياتهم تماماً",
          "تحديد كيفية التميز في السوق وتحقيق ميزة تنافسية",
          "تجنب متابعة أنشطة المنافسين",
          "التركيز فقط على العمليات الداخلية",
        ],
        correct: 1,
      },
      {
        text: "لماذا من المهم معرفة المنافسين الرئيسيين؟",
        choices: [
          "لتجنب المنافسة تماماً",
          "يصبح هذا مهماً فقط بعد إطلاق المنتج",
          "لرفع سعر المنتج",
          "لمعرفة كيفية التفوق عليهم وكيفية تمييز أنفسنا عن الآخرين",
        ],
        correct: 3,
      },
      {
        text: "كيف يمكنك التفوق على منافسيك؟",
        choices: [
          "من خلال تطوير استراتيجيات مبتكرة، وتقديم ميزات فريدة",
          "بتقليد جميع تحركاتهم",
          "بزيادة الأسعار دون تقديم أي تحسينات",
          "بخفض جودة المنتج لتقليل التكاليف",
        ],
        correct: 0,
      },
      {
        text: 'ما الهدف الأساسي لمكون "المنافسة" (COMPETITION) في نموذج المنتج (PRODUCT MODEL)؟',
        choices: [
          "فهم الجمهور المستهدف واحتياجاته",
          "تحديد مقدار العائد المتوقع من المشروع",
          "تقييم المنافسين والابتكار للتفوق عليهم",
          "تحديد القيمة الفريدة التي يقدمها المنتج للسوق",
        ],
        correct: 2,
      },
      {
        text: "ما هو الغرض الرئيسي لمكون التصميم في نموذج PRODUCT MODEL؟",
        choices: [
          "تحديد القيمة الفريدة من المنتج أو الخدمة المقدمة",
          "تحويل الفكرة إلى منتج أو خدمة ملموسة",
          "تقييم المهارات والموارد والعلاقات اللازمة لتنفيذ المشروع",
          "تحليل الربحية والعوائد المتوقعة من المشروع بمرور الوقت",
        ],
        correct: 1,
      },
    ],
  },

  // ── اليوم الخامس ──
  {
    title: "اليوم الخامس – الخط الزمني ونموذج PRODUCT (T)",
    questions: [
      {
        text: 'ما هو الهدف الأساسي لمكون "الخط الزمني"؟',
        choices: [
          "تنظيم مراحل تطوير المنتج وإطلاقه",
          "تحديد تكاليف المشروع",
          "تحليل احتياجات العملاء",
          "تقييم المنافسين في السوق",
        ],
        correct: 0,
      },
      {
        text: 'ما فائدة "الخط الزمني"؟',
        choices: [
          "يحدد سعر المنتج النهائي",
          "يحدد هوية العلامة التجارية",
          "يساعد في وضع أهداف واضحة إلى دخول السوق",
          "يقيّم مهارات الفريق",
        ],
        correct: 2,
      },
      {
        text: "أي من المراحل التالية تُعد مرحلة رئيسية في دورة حياة المنتج؟",
        choices: [
          "التفاوض",
          "التصميم",
          "الإعلان",
          "التوريد",
        ],
        correct: 1,
      },
      {
        text: "في أي مرحلة من دورة حياة المنتج يزداد نصيب السوق؟",
        choices: [
          "الانحدار",
          "النضج",
          "التقديم",
          "النمو",
        ],
        correct: 3,
      },
      {
        text: "على ماذا يجب التركيز في مرحلة النضج؟",
        choices: [
          "تخفيض سعر المنتج بشكل كبير",
          "وقف الإنتاج والبحث عن منتج جديد",
          "الحفاظ على الجودة والاستمرار في الابتكار",
          "تجاهل المنافسين والتركيز على التوسع",
        ],
        correct: 2,
      },
      {
        text: "لماذا يُعد الخط الزمني مهماً للمستثمرين؟",
        choices: [
          "يقلل من تكاليف الإنتاج",
          "يزيد من مصداقية المشروع",
          "يضمن ربحية المشروع فوراً",
          "يحدد هوية العلامة التجارية",
        ],
        correct: 1,
      },
      {
        text: 'ماذا يمثل الحرف "T" في PRODUCT؟',
        choices: [
          "Target (الهدف)",
          "Team (الفريق)",
          "Trading (التجارة)",
          "Timeline (الخط الزمني)",
        ],
        correct: 3,
      },
      {
        text: "أي كلمة تمثل نموذج الفرصة؟",
        choices: [
          "PROFIT",
          "PRODUCT",
          "PROCESS",
          "PROJECT",
        ],
        correct: 1,
      },
      {
        text: "ماذا تمثل أحرف PRODUCT؟",
        choices: [
          "P=Profit, R=Risk, O=Operations, D=Distribution, U=Utility, C=Cost, T=Technology",
          "P=Planning, R=Resources, O=Objectives, D=Delivery, U=Understanding, C=Customers, T=Training",
          "P=Purpose, R=Return, O=Obtainability, D=Design, U=Users, C=Competition, T=Timeline",
          "P=Process, R=Research, O=Opportunities, D=Development, U=Utility, C=Competition, T=Timeline",
        ],
        correct: 2,
      },
      {
        text: "إذا انطبقت جميع مكونات PRODUCT MODEL على فكرتك، فماذا يعني ذلك؟",
        choices: [
          "يجب الانتظار سنوات قبل التنفيذ",
          "لا يزال هناك ما يكفي من الشك لتجاهل الفكرة",
          "يجب البحث عن فكرة أخرى أفضل",
          "فكرتي فرصة حقيقية وقابلة للتطبيق ويجب أن لا أهملها",
        ],
        correct: 3,
      },
    ],
  },
];

// ─── Supabase helpers ─────────────────────────────────────────────────────────
const emptyAnswers = () => days.map((d) => Array(d.questions.length).fill(null));
const emptySubmitted = () => Array(days.length).fill(false);
const emptyUnlocked = () => [true, ...Array(days.length - 1).fill(false)];

async function loadProgress(userId: string) {
  const { data } = await supabase
    .from("quiz_progress")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

async function saveProgress(userId: string, state: {
  answers: (number | null)[][];
  submitted: boolean[];
  unlocked: boolean[];
}) {
  const { data: existing } = await supabase
    .from("quiz_progress")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabase
      .from("quiz_progress")
      .update({ ...state, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  } else {
    await supabase
      .from("quiz_progress")
      .insert({ user_id: userId, ...state });
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { push } = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentDay, setCurrentDay] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[][]>(emptyAnswers());
  const [submitted, setSubmitted] = useState<boolean[]>(emptySubmitted());
  const [unlocked, setUnlocked] = useState<boolean[]>(emptyUnlocked());
  const [showDaySummary, setShowDaySummary] = useState(false);

  // Check auth and load progress on mount
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        push("/auth/signin");
        return;
      }
      setUser(user);

      // Fetch quiz settings + user progress in parallel
      const [settingsRes, progress] = await Promise.all([
        supabase.from("quiz_settings").select("current_day").eq("id", 1).single(),
        loadProgress(user.id),
      ]);

      const openUntilDay = settingsRes.data?.current_day ?? 1;
      const globalUnlocked = days.map((_, i) => i < openUntilDay);
      setUnlocked(globalUnlocked);

      if (progress) {
        setAnswers(progress.answers);
        setSubmitted(progress.submitted);
        // Navigate to last submitted day+1 if unlocked, else last unlocked day
        const lastSubmitted = (progress.submitted as boolean[]).lastIndexOf(true);
        let targetDay = 0;
        if (lastSubmitted >= 0) {
          const next = lastSubmitted + 1;
          targetDay = next < days.length && globalUnlocked[next] ? next : lastSubmitted;
        }
        setCurrentDay(targetDay);
        setShowDaySummary(progress.submitted[targetDay] ?? false);
      }
      setLoading(false);
    });
  }, [push]);

  const day = days[currentDay];
  const dayAnswers = answers[currentDay];
  const isSubmitted = submitted[currentDay];

  const persist = (newAnswers: (number | null)[][], newSubmitted: boolean[], newUnlocked: boolean[]) => {
    if (user) saveProgress(user.id, { answers: newAnswers, submitted: newSubmitted, unlocked: newUnlocked });
  };

  const handleSelect = (qIndex: number, cIndex: number) => {
    if (isSubmitted) return;
    const newAnswers = answers.map((a) => [...a]);
    newAnswers[currentDay][qIndex] = cIndex;
    setAnswers(newAnswers);
    persist(newAnswers, submitted, unlocked);
  };

  const handleSubmit = () => {
    const allAnswered = dayAnswers.every((a) => a !== null);
    if (!allAnswered) {
      alert("يرجى الإجابة على جميع الأسئلة قبل التسليم.");
      return;
    }
    const newSubmitted = [...submitted];
    newSubmitted[currentDay] = true;
    setSubmitted(newSubmitted);
    setShowDaySummary(true);
    persist(answers, newSubmitted, unlocked);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center font-[Tajawal]">
        <div className="text-center text-gray-400">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
          <p className="text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const dayScore = () => {
    let correct = 0;
    day.questions.forEach((q, i) => {
      if (dayAnswers[i] === q.correct) correct++;
    });
    return correct;
  };

  const totalScore = () => {
    let total = 0;
    days.forEach((d, di) => {
      if (submitted[di]) {
        d.questions.forEach((q, qi) => {
          if (answers[di][qi] === q.correct) total++;
        });
      }
    });
    return total;
  };

  const totalSubmitted = submitted.filter(Boolean).length;
  const allDone = totalSubmitted === days.length;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50 font-[Tajawal] text-gray-900"
      style={{ fontFamily: "Tajawal, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-black text-white py-4 px-6 flex items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold">اغتنم الفرص التجارية</h1>
          <p className="text-gray-400 mt-1 text-sm">نموذج القياس المعرفي – 5 أيام</p>
          {user && <p className="text-gray-500 text-xs mt-1">{user.email}</p>}
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); push("/auth/signin"); }}
          className="text-xs text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-lg px-3 py-1.5 flex-shrink-0"
        >
          خروج
        </button>
      </div>

      {/* Day Tabs */}
      <div className="flex overflow-x-auto bg-white border-b border-gray-200 px-2 pt-2 gap-1">
        {days.map((d, i) => {
          const isLocked = !unlocked[i];
          return (
            <button
              key={i}
              onClick={() => {
                if (isLocked) return;
                setCurrentDay(i);
                setShowDaySummary(submitted[i]);
              }}
              disabled={isLocked}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                isLocked
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : currentDay === i
                  ? "bg-black text-white"
                  : submitted[i]
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isLocked ? "🔒 " : submitted[i] ? "✓ " : ""}اليوم {i + 1}
            </button>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Day Title */}
        <h2 className="text-xl font-bold mb-6 text-center">{day.title}</h2>

        {/* Day Summary (after submit) */}
        {isSubmitted && showDaySummary && (
          <div className="mb-8 rounded-xl bg-white border border-gray-200 p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-black">{dayScore()} / {day.questions.length}</p>
            <p className="text-gray-500 mt-1">نتيجة اليوم {currentDay + 1}</p>
            <div className="mt-3 flex justify-center gap-4 text-sm">
              <span className="text-green-600 font-medium">✓ {dayScore()} صحيحة</span>
              <span className="text-red-600 font-medium">✗ {day.questions.length - dayScore()} خاطئة</span>
            </div>
            {allDone && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-lg font-bold">المجموع الكلي: {totalScore()} / {days.length * 10}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {Math.round((totalScore() / (days.length * 10)) * 100)}% نسبة الإجابات الصحيحة
                </p>
              </div>
            )}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {day.questions.map((q, qi) => {
            const selected = dayAnswers[qi];
            const isCorrect = selected === q.correct;
            return (
              <div
                key={qi}
                className={`rounded-xl bg-white border p-5 shadow-sm transition-colors ${
                  isSubmitted
                    ? isCorrect
                      ? "border-green-300"
                      : "border-red-300"
                    : "border-gray-200"
                }`}
              >
                <p className="font-medium mb-4 leading-relaxed">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-xs font-bold ml-2">
                    {qi + 1}
                  </span>
                  {q.text}
                </p>
                <div className="space-y-2">
                  {q.choices.map((choice, ci) => {
                    const isSelected = selected === ci;
                    const isCorrectChoice = ci === q.correct;

                    let choiceClass =
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ";

                    if (!isSubmitted) {
                      choiceClass += isSelected
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-400 hover:bg-gray-50";
                    } else {
                      if (isCorrectChoice) {
                        choiceClass += "border-green-500 bg-green-50 text-green-800";
                      } else if (isSelected && !isCorrectChoice) {
                        choiceClass += "border-red-400 bg-red-50 text-red-800";
                      } else {
                        choiceClass += "border-gray-200 text-gray-400";
                      }
                    }

                    return (
                      <div
                        key={ci}
                        className={choiceClass}
                        onClick={() => handleSelect(qi, ci)}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                            !isSubmitted
                              ? isSelected
                                ? "border-white bg-white text-black"
                                : "border-gray-400"
                              : isCorrectChoice
                              ? "border-green-500 bg-green-500 text-white"
                              : isSelected
                              ? "border-red-500 bg-red-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {!isSubmitted && isSelected ? "●" : ""}
                          {isSubmitted && isCorrectChoice ? "✓" : ""}
                          {isSubmitted && isSelected && !isCorrectChoice ? "✗" : ""}
                        </span>
                        <span className="text-sm leading-snug">{choice}</span>
                      </div>
                    );
                  })}
                </div>
                {isSubmitted && !isCorrect && (
                  <p className="mt-3 text-xs text-green-700 bg-green-50 rounded-lg p-2">
                    ✓ الإجابة الصحيحة: {q.choices[q.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit button */}
        {!isSubmitted && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              تسليم إجابات اليوم {currentDay + 1}
            </button>
          </div>
        )}

        {/* Next day locked notice */}
        {isSubmitted && currentDay < days.length - 1 && !unlocked[currentDay + 1] && (
          <div className="mt-8 rounded-xl bg-white border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-4xl mb-3">🔒</div>
            <p className="font-bold text-lg">اليوم {currentDay + 2} لم يُفتح بعد</p>
            <p className="text-gray-500 text-sm mt-1">سيتم فتحه من قِبل المدرب في الوقت المحدد</p>
          </div>
        )}

        {/* All done */}
        {allDone && (
          <div className="mt-8 rounded-xl bg-black text-white p-6 text-center shadow-sm">
            <p className="text-3xl font-bold">🎉 أكملت جميع الأيام!</p>
            <p className="mt-2 text-gray-300">مجموعك الكلي: {totalScore()} / {days.length * 10}</p>
            <p className="mt-1 text-gray-400 text-sm">{Math.round((totalScore() / (days.length * 10)) * 100)}% نسبة الإجابات الصحيحة</p>
          </div>
        )}
      </div>
    </div>
  );
}
