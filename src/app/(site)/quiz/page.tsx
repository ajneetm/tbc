"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, Lock, Star, Trophy, ThumbsUp, TrendingUp } from "lucide-react";

type Question = { q: string; options: string[]; correct: number };
type DayQuestions = Question[];

const QUIZ_DATA: Record<number, DayQuestions> = {
  1: [
    { q: "ما هي الفرصة التجارية؟", options: ["فكرة إبداعية", "حاجة أو رغبة لدى العملاء", "تحسين منتج موجود", "تقليد مشروع مشابه ناجح"], correct: 1 },
    { q: "أي من الخيارات التالية تعد سببًا شائعًا لفشل المشاريع الجديدة؟", options: ["شراء الامتيازات التجارية", "الإبداع المفرط", "التركيز الزائد على الإدارة", "ضعف خطط الأعمال"], correct: 3 },
    { q: "أي من الخيارات التالية ليس لتحويل الأفكار إلى فرص؟", options: ["شراء مشروع مستقل", "بدء مشروع جديد", "إغلاق مشروع ناجح", "شراء امتياز تجاري"], correct: 2 },
    { q: "في أي ربع من ساعة العمل يحدث التشغيل الفعال والتسويق؟", options: ["الصياغة Draft", "الملاحة Navigate", "التوليد Generate", "التأسيس Incorporate"], correct: 1 },
    { q: "ما الذي يحول الفكرة إلى فرصة تجارية؟", options: ["الابتكار دون إجراء بحث سوقي", "الإبداع وحده", "خيال المخترع", "دراسة متكاملة تشمل تحليل المخاطر"], correct: 3 },
    { q: "ما هي الخاصية الأساسية للفرصة التجارية الناجحة؟", options: ["تجاهل المنافسين", "الاعتماد على الإحساس", "التوقيت المناسب", "الحظ والصدفة"], correct: 2 },
    { q: 'ماذا يمثل الحرف "T" في نموذج المنتج (Product Model)؟', options: ["الجدول الزمني", "المنتج كمدخل إلى السوق", "العميل لتحسين استهداف السوق", "الربحية لتحقيق نمو الأعمال"], correct: 0 },
    { q: "أي من الخيارات التالية تعد سمة رئيسية للفرصة التجارية الجيدة؟", options: ["تقديم منتج مشابه لمنافسك دون تميز", "الاعتماد فقط على الأساليب التقليدية", "تجاهل تحليل المخاطر", "تقديم قيمة مضافة للعميل"], correct: 3 },
    { q: "ما هي الخطوة الأولى في تحديد فجوات السوق؟", options: ["إطلاق الفكرة دون التحقق من صحتها", "استخدام الابتكار الشخصي دون بحث", "إجراء أبحاث السوق لاكتشاف الاحتياجات غير الملباة", "جمع آراء الأصدقاء والعائلة"], correct: 2 },
    { q: 'ما دور مرحلة التأسيس "Incorporate" في ساعة العمل؟', options: ["مجرد التفكير في أفكار إبداعية", "الهوية والموارد والبنية الأساسية", "تحقيق الإيرادات فورًا", "الاعتماد فقط على الأفكار دون تنفيذ"], correct: 1 },
  ],
  2: [
    { q: "ما هو الأساس الذي يُبنى عليه منتجك؟", options: ["هدف واضح ومقنع", "اسم جذاب", "شعار ملفت للنظر", "عدد الميزات التي يحتويها"], correct: 0 },
    { q: 'ما هي "نقطة الألم" Pain Point في سياق الأعمال التجارية؟', options: ["استراتيجية تسويق الشركة", "ميزة منتج المنافس", "مشكلة أو تحدي يواجهه العملاء", "سعر المنتج"], correct: 2 },
    { q: 'ماذا تعني "القيمة المضافة" في المنتج؟', options: ["تكلفة المنتج", "الميزات الفريدة التي لا يقدمها المنافسون", "المواد المستخدمة في التغليف", "مقدار الإنفاق على تسويق المنتج"], correct: 1 },
    { q: "أي من الخيارات التالية يُعد مثالاً على التكاليف الثابتة؟", options: ["عدد المنتجات المباعة", "تكلفة المواد الخام", "عدد الموظفين", "إيجار موقع العمل التجاري"], correct: 3 },
    { q: 'ماذا يمثل الحرف "P" في نموذج المنتج PRODUCT MODEL؟', options: ["الغرض، وهو الأساس الذي يُبنى عليه المنتج", "الترويج عبر الحملات التسويقية", "الربح، لتحقيق الدخل", "الدفع، لإتمام المعاملات مع العملاء"], correct: 0 },
    { q: "ما هي نقطة التعادل في العمل التجاري؟", options: ["اللحظة التي ينسحب فيها جميع المنافسين من السوق", "اللحظة التي تتلقى فيها أول دفعة مالية", "عدد سداد جميع التكاليف الثابتة", "نقطة تساوي الإيرادات مع التكاليف"], correct: 3 },
    { q: 'ما الذي يركز عليه مكون "العائد" في نموذج المنتج PRODUCT MODEL؟', options: ["قياس رضا العملاء", "تصميم ميزات المنتج", "تحليل الربحية من خلال مقارنة التكاليف والإيرادات بمرور الوقت", "استراتيجيات التسويق للترويج للمنتج"], correct: 2 },
    { q: "ما الذي يمنح منتجك ميزة تنافسية فريدة؟", options: ["حملة إعلانية", "تكلفة منخفضة", "عدد الألوان المتوفرة", "الميزات أو الابتكارات الفريدة التي تميزه عن المنافسين"], correct: 3 },
    { q: 'ما هو الهدف الأساسي لمكون "الغرض" في نموذج المنتج PRODUCT MODEL؟', options: ["تحديد المهمة الأساسية للمنتج", "اختيار أفضل منصة تسويقية", "تقدير تكاليف الإنتاج", "إنشاء شعار جذاب للمنتج"], correct: 0 },
    { q: 'ما هو الهدف من المكون الثاني "العائد" في نموذج المنتج PRODUCT MODEL؟', options: ["تحسين تصميم المنتج", "تقييم عملاء المنتج", "تقييم الجدوى المالية والأرباح المتوقعة للمنتج", "تحليل استراتيجية التوزيع"], correct: 2 },
  ],
  3: [
    { q: 'ما هو الهدف الأساسي لمكون "الإمكانية" (OBTAINABILITY) في نموذج المنتج؟', options: ["القدرة في الحصول على الموارد", "خفض تكاليف الإنتاج", "توسيع نطاق السوق", "زيادة تنوع المنتجات"], correct: 0 },
    { q: "أي من العوامل التالية يعد ضرورياً لتقييم قدراتك على تنفيذ المشروع بنجاح؟", options: ["تحليل المهارات والموارد والظروف الشخصية المتاحة", "إعداد استراتيجية تسويق تفصيلية", "وضع نموذج تسعير", "إجراء استطلاعات رأي العملاء"], correct: 0 },
    { q: "كيف يمكنك سد أي فجوات مهارية يحتاجها مشروعك؟", options: ["طلب المساعدة من الأصدقاء", "تقليص نطاق المشروع", "الاعتماد على المتطوعين", "توظيف مختصين أو تطوير مهاراتك من خلال التدريب"], correct: 3 },
    { q: "عند التخطيط للموارد المالية، ما السؤال الأول الذي ينبغي أن تطرحه على نفسك؟", options: ["كيف يمكنني خفض تكاليف الإنتاج؟", "هل أملك موارد مالية كافية لبدء المشروع؟", "ما هي استراتيجيات التسويق التي يجب أن أعتمدها؟", "من هم المنافسون في السوق؟"], correct: 1 },
    { q: 'ما هو الهدف الأساسي الذي يركز عليه "مكون الإمكانية" (OBTAINABILITY) في نموذج المنتج؟', options: ["تقييم القيمة الفريدة والفوائد التي يقدمها منتجك", "فهم احتياجات السوق ونقاط الضعف لدى العملاء", "قياس القدرة على تنفيذ المشروع بالحصول على الموارد", "تحليل الجدوى المالية وإمكانات الربح للمشروع"], correct: 2 },
    { q: 'ما هو الهدف الرئيسي لمكون "التصميم" (DESIGN) في نموذج المنتج؟', options: ["تطوير عرض بيع فريد للمنتج", "فهم خصائص العملاء واتجاهات السوق", "تحليل التوقعات المالية والعوائد المحتملة", "تحويل الفكرة إلى فرصة مادية بكل مكوناتها"], correct: 0 },
    { q: "لماذا يعد تقييم العملاء مهماً أثناء عملية التصميم؟", options: ["يساعد في خفض تكاليف الإنتاج وزيادة هامش الربح", "يضمن أن المنتج النهائي يتوافق مع تفضيلات العملاء واحتياجاتهم", "يساعد في اختيار المواد الأكثر كفاءة من حيث التكلفة", "يلغي الحاجة إلى نموذج أولي قبل إطلاق المنتج"], correct: 1 },
    { q: "كيف يمكن أن يؤثر اختيار المواد على تصميم المنتج؟", options: ["تحدد المواد جودة المنتج ومتانته وقيمته الإجمالية", "ليس للمواد تأثير جوهري على نجاح المنتج", "يؤثر اختيار المواد فقط على مظهر المنتج وليس على وظيفته", "يمكن تغيير المواد بعد إطلاق المنتج دون أي تأثير سلبي"], correct: 0 },
    { q: "ما هو الهدف من إنشاء رسم تخطيطي لفكرتك أثناء عملية التصميم؟", options: ["يتيح الإنتاج الفوري للمنتج النهائي دون خطوات إضافية", "مجرد خطوة أولية ليس لها قيمة فعلية في التطوير", "يساعد على تصور وتخطيط الخطوات اللازمة لإنشاء منتج", "يركز على استراتيجيات التسويق أكثر من مواصفات التصميم"], correct: 2 },
    { q: 'ما هو الغرض الرئيسي لمكون "التصميم" في نموذج PRODUCT MODEL؟', options: ["تحديد القيمة الفريدة والغرض الأساسي من المنتج", "تحويل الفكرة إلى منتج يلبي احتياجات العملاء وتوقعاتهم", "تقييم المهارات والموارد اللازمة لتنفيذ المشروع بنجاح", "تحليل الربحية والعوائد المتوقعة من المشروع بمرور الوقت"], correct: 1 },
  ],
  4: [
    { q: 'ما هو الهدف الأساسي لمكون "المستخدمين" (USERS) في نموذج المنتج؟', options: ["تقييم الموارد والمهارات المتاحة لتنفيذ المشروع", "تحديد الفئة المستهدفة وحجمها", "تحليل الجوانب المالية وربحية المنتج", "تصميم وتطوير الميزات التي تلبي احتياجات العملاء"], correct: 1 },
    { q: "ما الذي يشمله رسم خريطة رحلة العميل؟", options: ["تصور جميع مراحل تفاعل العميل مع المنتج", "تحليل استراتيجيات تفاعل العملاء لدى المنافسين", "التركيز فقط على قرار الشراء النهائي", "تحديد الموردين المحتملين للإنتاج"], correct: 0 },
    { q: "كيف يمكن تحسين تجربة العميل مع المنتج؟", options: ["تقديم خصومات متكررة دون دراسة احتياجات العملاء", "تقليل تكاليف الإنتاج", "زيادة ميزانية الإعلانات فقط", "تقييم مرحلة العميل بعناية"], correct: 3 },
    { q: "ما أهمية أن يكون رائد الأعمال على دراية بجمهوره المستهدف؟", options: ["يساعد في تصميم منتج ويزيد من فرص النجاح في السوق", "يقلل من تكاليف الإنتاج", "يوفر الوقت في تطوير المنتج", "يضمن التوزيع الجغرافي الفعال للمنتج"], correct: 0 },
    { q: "من الذي يشكل جمهور منتجك؟", options: ["فقط الأفراد الذين لديهم اهتمام مباشر بالمنتج", "أي شخص يعيش في المنطقة الجغرافية المحيطة", "الأفراد أو الشركات أو أي من الكيانات الأخرى", "مستخدمو المنتجات المنافسة فقط"], correct: 0 },
    { q: "ما الهدف الأساسي من فهم المنافسين؟", options: ["تقليد استراتيجياتهم تماماً", "تحديد كيفية التميز في السوق وتحقيق ميزة تنافسية", "تجنب متابعة أنشطة المنافسين", "التركيز فقط على العمليات الداخلية"], correct: 1 },
    { q: "لماذا من المهم معرفة المنافسين الرئيسيين؟", options: ["لتجنب المنافسة تماماً", "يصبح هذا مهماً فقط بعد إطلاق المنتج", "لرفع سعر المنتج", "لمعرفة كيفية التفوق عليهم وتمييز أنفسنا عن الآخرين"], correct: 3 },
    { q: "كيف يمكنك التفوق على منافسيك؟", options: ["من خلال تطوير استراتيجيات مبتكرة وتقديم ميزات فريدة", "بتقليد جميع تحركاتهم", "بزيادة الأسعار دون تقديم أي تحسينات", "بخفض جودة المنتج لتقليل التكاليف"], correct: 0 },
    { q: 'ما الهدف الأساسي لمكون "المنافسة" (COMPETITION) في نموذج المنتج؟', options: ["فهم الجمهور المستهدف واحتياجاته", "تحديد مقدار العائد المتوقع من المشروع", "تقييم المنافسين والابتكار للتفوق عليهم", "تحديد القيمة الفريدة التي يقدمها المنتج للسوق"], correct: 2 },
    { q: 'ما هو الغرض الرئيسي لمكون "التصميم" في نموذج PRODUCT MODEL؟', options: ["تحديد القيمة الفريدة من المنتج أو الخدمة المقدمة", "تحويل الفكرة إلى منتج أو خدمة ملموسة", "تقييم المهارات والموارد والعلاقات اللازمة لتنفيذ المشروع", "تحليل الربحية والعوائد المتوقعة من المشروع بمرور الوقت"], correct: 1 },
  ],
  5: [
    { q: 'ما هو الهدف الأساسي لمكون "الخط الزمني"؟', options: ["تنظيم مراحل تطوير المنتج وإطلاقه", "تحديد ميزانية المشروع", "تقييم أداء الفريق", "تحليل المنافسين"], correct: 0 },
    { q: 'ما فائدة "الخط الزمني"؟', options: ["يقلل تكاليف الإنتاج", "يساعد في وضع أهداف واضحة إلى دخول السوق", "يحدد أسعار المنتجات", "يساعد في اختيار الموردين"], correct: 1 },
    { q: "أي من المراحل التالية تُعد مرحلة رئيسية في دورة حياة المنتج؟", options: ["التسويق", "التمويل", "التصميم", "التوزيع"], correct: 2 },
    { q: "في أي مرحلة من دورة حياة المنتج يزداد نصيب السوق؟", options: ["التقديم", "النضج", "الانحدار", "النمو"], correct: 3 },
    { q: "على ماذا يجب التركيز في مرحلة النضج؟", options: ["تقليل الأسعار بشكل كبير", "إيقاف الإنتاج تدريجياً", "الحفاظ على الجودة والاستمرار في الابتكار", "التوسع في أسواق جديدة فقط"], correct: 2 },
    { q: "لماذا يُعد الخط الزمني مهماً للمستثمرين؟", options: ["يضمن الأرباح الفورية", "يقلل من المخاطر المالية تماماً", "يزيد من مصداقية المشروع", "يحدد حصة المستثمر في الأرباح"], correct: 2 },
    { q: 'ماذا يمثل الحرف "T" في PRODUCT؟', options: ["Target (الهدف)", "Trade (التجارة)", "Transfer (النقل)", "Timeline (الخط الزمني)"], correct: 3 },
    { q: "أي كلمة تمثل نموذج الفرصة؟", options: ["PROCESS", "PROJECT", "PROFIT", "PRODUCT"], correct: 3 },
    { q: "ماذا تمثل أحرف PRODUCT؟", options: ["P: Price, R: Revenue, O: Operations, D: Distribution, U: Users, C: Customers, T: Timeline", "P: Planning, R: Resources, O: Objectives, D: Development, U: Understanding, C: Control, T: Testing", "P: Purpose, R: Return, O: Obtainability, D: Design, U: Users, C: Competition, T: Timeline", "P: Profit, R: Risk, O: Opportunity, D: Demand, U: Utility, C: Cost, T: Target"], correct: 2 },
    { q: "إذا انطبقت جميع مكونات PRODUCT MODEL على فكرتك؟", options: ["يجب إعادة دراستها من البداية", "فكرتي فرصة حقيقية وقابلة للتطبيق ويجب أن لا أهملها", "يجب البحث عن شريك أعمال", "فكرتي تحتاج إلى تمويل خارجي"], correct: 1 },
  ],
};

export default function QuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [submitted, setSubmitted] = useState<boolean[]>([false, false, false, false, false]);
  const [scores, setScores] = useState<(number | null)[]>([null, null, null, null, null]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.replace("/auth/signin"); return; }

      const uid = session.user.id;
      setUserId(uid);

      const [settingsRes, progressRes] = await Promise.all([
        supabase.from("quiz_settings").select("current_day").eq("id", 1).single(),
        supabase.from("quiz_progress").select("submitted, scores").eq("user_id", uid).maybeSingle(),
      ]);

      const day = settingsRes.data?.current_day ?? 0;
      const sub: boolean[] = progressRes.data?.submitted ?? [false, false, false, false, false];
      const sc: (number | null)[] = progressRes.data?.scores ?? [null, null, null, null, null];
      setCurrentDay(day);
      setSubmitted(sub);
      setScores(sc);
      setLoading(false);
    };
    init();
  }, []);

  const activeDay = (() => {
    for (let d = 1; d <= currentDay; d++) {
      if (!submitted[d - 1]) return d;
    }
    return currentDay;
  })();

  const alreadyDoneAll = currentDay > 0 && submitted.slice(0, currentDay).every(Boolean);
  const questions = QUIZ_DATA[activeDay] ?? [];

  const handleSubmit = async () => {
    if (!userId) return;
    if (Object.keys(answers).length < questions.length) return;
    setSubmitting(true);

    const score = questions.filter((q, i) => answers[i] === q.correct).length;
    const newSubmitted = [...submitted];
    newSubmitted[activeDay - 1] = true;
    const newScores = [...scores];
    newScores[activeDay - 1] = score;

    const existing = await supabase.from("quiz_progress").select("id").eq("user_id", userId).maybeSingle();
    if (existing.data) {
      await supabase.from("quiz_progress").update({ submitted: newSubmitted, scores: newScores, updated_at: new Date().toISOString() }).eq("user_id", userId);
    } else {
      await supabase.from("quiz_progress").insert({ user_id: userId, submitted: newSubmitted, scores: newScores, updated_at: new Date().toISOString() });
    }

    setSubmitted(newSubmitted);
    setScores(newScores);
    setResult({ score, total: questions.length });
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center pt-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">نموذج القياس المعرفي</h1>
          <div className="flex gap-2 mt-3">
            {[1, 2, 3, 4, 5].map((d) => {
              const unlocked = d <= currentDay;
              const done = submitted[d - 1];
              return (
                <div key={d} className={`flex-1 rounded-xl py-2 text-center text-xs font-bold border ${
                  done ? "bg-green-50 border-green-200 text-green-700" :
                  unlocked ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
                  "bg-gray-50 border-gray-200 text-gray-300"
                }`}>
                  <span className="flex justify-center mb-0.5">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : unlocked ? (
                      <Circle className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </span>
                  يوم {d}
                </div>
              );
            })}
          </div>
        </div>

        {/* Locked */}
        {currentDay === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-16 h-16 text-gray-300" />
            </div>
            <p className="font-bold text-gray-700 text-lg mb-1">الاختبار مقفل حالياً</p>
            <p className="text-gray-400 text-sm">سيُفتح قريباً من قِبل الإدارة</p>
          </div>
        )}

        {/* All done */}
        {currentDay > 0 && alreadyDoneAll && !result && (
          <div className="bg-white rounded-2xl border border-green-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <Star className="w-16 h-16 text-green-500 fill-green-400" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">أحسنت! أكملت جميع الأيام المتاحة</p>
            <p className="text-gray-400 text-sm">تابع الداشبورد لمعرفة متى يُفتح اليوم التالي</p>
            <button onClick={() => router.push("/user")}
              className="mt-6 bg-black text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-gray-800 transition">
              الداشبورد ←
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl border border-green-200 p-10 text-center">
            <div className="flex justify-center mb-4">
              {result.score === result.total ? (
                <Trophy className="w-16 h-16 text-yellow-500 fill-yellow-400" />
              ) : result.score >= result.total / 2 ? (
                <ThumbsUp className="w-16 h-16 text-blue-500 fill-blue-100" />
              ) : (
                <TrendingUp className="w-16 h-16 text-orange-400" />
              )}
            </div>
            <p className="font-bold text-gray-900 text-3xl mb-1">{result.score} / {result.total}</p>
            <p className="text-gray-500 text-sm mb-6">
              {result.score === result.total ? "ممتاز! إجاباتك كلها صحيحة" :
               result.score >= result.total / 2 ? "جيد! استمر في التحسن" : "واصل المحاولة، يمكنك التحسن"}
            </p>
            <button onClick={() => router.push("/user")}
              className="bg-black text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-gray-800 transition">
              العودة للداشبورد ←
            </button>
          </div>
        )}

        {/* Quiz */}
        {currentDay > 0 && !alreadyDoneAll && !result && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 px-5 py-3 flex items-center justify-between">
              <span className="font-bold text-sm">اليوم {activeDay}</span>
              <span className="text-xs text-gray-400">{questions.length} أسئلة</span>
            </div>

            {questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="font-bold text-sm text-gray-900 mb-4">{idx + 1}. {q.q}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const selected = answers[idx] === oi;
                    return (
                      <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [idx]: oi }))}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-right transition ${
                          selected ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400 bg-gray-50"
                        }`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          selected ? "bg-white text-black" : "bg-gray-200 text-gray-600"
                        }`}>
                          {["أ","ب","ج","د"][oi]}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {Object.keys(answers).length < questions.length && (
              <p className="text-center text-xs text-gray-400">
                {questions.length - Object.keys(answers).length} سؤال متبقي
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < questions.length}
              className="w-full bg-black text-white font-bold py-3.5 rounded-2xl hover:bg-gray-800 disabled:opacity-40 transition text-sm">
              {submitting ? "جاري الحفظ..." : "تسليم الاختبار ←"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
