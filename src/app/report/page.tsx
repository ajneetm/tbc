"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyReport from ".";
import { Survey } from "@/app/libs/api/survey";
import {
  SESSION_STORAGE_SCORE_KEY,
  SURVEY_SCORE,
  SURVEY_TYPE,
} from "@/components/dashboard/chatbot/MessageTemplates/constents";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Send, X, FileText } from "lucide-react";

const SESSION_SURVEY_DATA = "SESSION_SURVEY_DATA";

const businessAreaMappings: Record<string, Record<string, string>> = {
  en: {
    "explorers-modal-1": "Problem Analysis & Financial Understanding",
    "explorers-modal-2": "Goal Setting & Vision",
    "explorers-modal-3": "Organization & Planning",
    "explorers-modal-4": "Brand Identity & Naming",
    "explorers-modal-5": "Legal Knowledge & Company Forms",
    "explorers-modal-6": "Networking & Resources",
    "explorers-modal-7": "Decision Making & Risk Analysis",
    "explorers-modal-8": "Task Management & Execution",
    "explorers-modal-9": "Marketing Channels & Methods",
    "explorers-modal-10": "Financial Management",
    "explorers-modal-11": "Financial Analysis & Ratios",
    "explorers-modal-12": "Self-Development & Business Improvement",
    "companies-modal-1": "Opportunity Seeking & Growth",
    "companies-modal-2": "Competitive Advantage",
    "companies-modal-3": "Planning & Organization",
    "companies-modal-4": "Brand Development",
    "companies-modal-5": "Legal Compliance",
    "companies-modal-6": "Resource Management",
    "companies-modal-7": "Strategic Decision Making",
    "companies-modal-8": "Operational Excellence",
    "companies-modal-9": "Marketing Strategy",
    "companies-modal-10": "Financial Control",
    "companies-modal-11": "Performance Analytics",
    "companies-modal-12": "Continuous Improvement",
    "entrepreneurs-modal-1": "Experience & Opportunity Assessment",
    "entrepreneurs-modal-2": "Strategic Thinking & Growth",
    "entrepreneurs-modal-3": "Action Planning & Execution",
    "entrepreneurs-modal-4": "Brand Design & Identity",
    "entrepreneurs-modal-5": "Legal Understanding & Compliance",
    "entrepreneurs-modal-6": "Resource Assessment & Management",
    "entrepreneurs-modal-7": "Decision Making & Evaluation",
    "entrepreneurs-modal-8": "Process Management",
    "entrepreneurs-modal-9": "Market Penetration",
    "entrepreneurs-modal-10": "Financial Operations",
    "entrepreneurs-modal-11": "Financial Monitoring",
    "entrepreneurs-modal-12": "Business Development",
  },
  ar: {
    "explorers-modal-1": "تحليل المشاكل والفهم المالي",
    "explorers-modal-2": "تحديد الأهداف والرؤية",
    "explorers-modal-3": "التنظيم والتخطيط",
    "explorers-modal-4": "الهوية التجارية والتسمية",
    "explorers-modal-5": "المعرفة القانونية وأشكال الشركات",
    "explorers-modal-6": "الشبكات والموارد",
    "explorers-modal-7": "صنع القرار وتحليل المخاطر",
    "explorers-modal-8": "إدارة المهام والتنفيذ",
    "explorers-modal-9": "قنوات وطرق التسويق",
    "explorers-modal-10": "الإدارة المالية",
    "explorers-modal-11": "التحليل المالي والنسب",
    "explorers-modal-12": "التطوير الذاتي وتحسين الأعمال",
    "companies-modal-1": "البحث عن الفرص والنمو",
    "companies-modal-2": "الميزة التنافسية",
    "companies-modal-3": "التخطيط والتنظيم",
    "companies-modal-4": "تطوير العلامة التجارية",
    "companies-modal-5": "الامتثال القانوني",
    "companies-modal-6": "إدارة الموارد",
    "companies-modal-7": "صنع القرارات الاستراتيجية",
    "companies-modal-8": "التميز التشغيلي",
    "companies-modal-9": "استراتيجية التسويق",
    "companies-modal-10": "التحكم المالي",
    "companies-modal-11": "تحليل الأداء",
    "companies-modal-12": "التحسين المستمر",
    "entrepreneurs-modal-1": "تقييم الخبرة والفرص",
    "entrepreneurs-modal-2": "التفكير الاستراتيجي والنمو",
    "entrepreneurs-modal-3": "تخطيط العمل والتنفيذ",
    "entrepreneurs-modal-4": "تصميم العلامة التجارية والهوية",
    "entrepreneurs-modal-5": "الفهم القانوني والامتثال",
    "entrepreneurs-modal-6": "تقييم وإدارة الموارد",
    "entrepreneurs-modal-7": "صنع القرار والتقييم",
    "entrepreneurs-modal-8": "إدارة العمليات",
    "entrepreneurs-modal-9": "اختراق السوق",
    "entrepreneurs-modal-10": "العمليات المالية",
    "entrepreneurs-modal-11": "المراقبة المالية",
    "entrepreneurs-modal-12": "تطوير الأعمال",
  },
};

export default function ReportPage() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [autoSentTo, setAutoSentTo] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const sentRef = useRef(false);
  const { push } = useRouter();
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const modalScoreRaw = sessionStorage.getItem(SESSION_STORAGE_SCORE_KEY);
    const totalScore = sessionStorage.getItem(SURVEY_SCORE);
    const surveyType = sessionStorage.getItem(SURVEY_TYPE);
    const formDataRaw = sessionStorage.getItem(SESSION_SURVEY_DATA);

    if (!modalScoreRaw || !totalScore) {
      push("/dashboard/chatbot");
      return;
    }

    const modalScore: { modalScore: number; modalId: string; label: string }[] =
      JSON.parse(modalScoreRaw);
    const formData = formDataRaw ? JSON.parse(formDataRaw) : {};
    const language: "ar" | "en" = formData.language || "en";
    setLanguage(language);

    // Map modalScore to SurveyItem[] for the report component
    const data = modalScore.map((item, index) => ({
      id: String(index),
      question: item.label || item.modalId,
      score: String(item.modalScore),
      rate: "1",
      answerId: "",
      modalId: item.modalId,
      questionId: String(index),
    }));

    const surveyData: Survey = {
      id: "local",
      score: totalScore,
      photo: "",
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      type: surveyType || formData.surveyType || "",
      business_type: formData.businessType || "",
      age: formData.age || "",
      capital: formData.capital || "",
      project_age: formData.projectAge || "",
      staff_count: formData.staffCount || "",
      data,
    };

    setSurvey(surveyData);

    // Generate AI report
    const type = surveyType || formData.surveyType || "explorers";
    fetch("/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surveyType: type,
        totalScore: Number(totalScore),
        modalScores: modalScore.map((i) => ({ modalId: i.modalId, score: i.modalScore })),
        language,
      }),
    })
      .then((r) => r.json())
      .then(async (res) => {
        if (res.content) {
          const html = (await remark().use(remarkHtml).process(res.content)).toString();
          setAiAnalysis(html);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [push]);

  // إرسال تلقائي بعد ما يكون الـ AI والمستخدم جاهزين
  useEffect(() => {
    if (!aiAnalysis || !survey || sentRef.current) return;
    const toEmail = user?.email || survey.email;
    if (!toEmail) return;
    sentRef.current = true;
    setAutoSentTo(toEmail);

    const payload = {
      totalScore: Number(survey.score),
      percentage: ((Number(survey.score) / 360) * 100).toFixed(1),
      language,
      aiContent: aiAnalysis,
    };

    // إرسال للمستخدم
    fetch("/api/send-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, to: toEmail }),
    }).catch(() => {});

    // نسخة للأدمن
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (adminEmail && adminEmail !== toEmail) {
      fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, to: adminEmail }),
      }).catch(() => {});
    }

    // حفظ التقرير في Supabase
    if (user) {
      supabase
        .from("survey_results")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data?.id) {
            supabase
              .from("survey_results")
              .update({ ai_analysis: aiAnalysis })
              .eq("id", data.id)
              .then(() => {});
          }
        });
    }
  }, [aiAnalysis, user, survey, language]);

  const generatePdfBase64 = async (): Promise<string | null> => {
    try {
      const el = document.getElementById("report-area");
      if (!el) return null;
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, backgroundColor: "#f9fafb" });
      const imgData = canvas.toDataURL("image/jpeg", 0.85);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * pageW) / canvas.width;
      let y = 0;
      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, -y, imgW, imgH);
        y += pageH;
      }
      return pdf.output("datauristring").split(",")[1];
    } catch { return null; }
  };

  const handleManualSend = async () => {
    if (!emailInput.trim() || !survey || !aiAnalysis) return;
    setEmailSending(true);
    const pdfBase64 = await generatePdfBase64();
    await fetch("/api/send-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: emailInput.trim(),
        totalScore: Number(survey.score),
        percentage: ((Number(survey.score) / 360) * 100).toFixed(1),
        language,
        aiContent: aiAnalysis,
        pdfBase64,
      }),
    }).catch(() => {});
    setEmailSent(true);
    setEmailSending(false);
  };

  if (!survey) return null;

  const isAr = language === "ar";

  return (
    <div>
      <SurveyReport survey={survey} language={language} aiAnalysis={aiAnalysis} isLoading={isLoading} />

      {/* زر فتح المودال */}
      {!isLoading && aiAnalysis && (
        <div className="flex justify-center pb-20">
          <button
            onClick={() => { setShowModal(true); setEmailSent(false); setEmailInput(autoSentTo ? "" : (user?.email || "")); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition"
          >
            <FileText className="w-4 h-4" />
            {isAr ? "إرسال التقرير PDF" : "Send Report as PDF"}
          </button>
        </div>
      )}

      {/* المودال */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            dir={isAr ? "rtl" : "ltr"}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {isAr ? "إرسال التقرير PDF" : "Send PDF Report"}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {isAr ? "سيصلك التقرير كاملاً بصيغة PDF" : "You'll receive the full report as PDF"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {emailSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-9 h-9 text-green-500" />
                </div>
                <p className="font-bold text-gray-900 text-lg mb-1">
                  {isAr ? "تم الإرسال!" : "Sent!"}
                </p>
                <p className="text-gray-400 text-sm" dir="ltr">{emailInput}</p>
                <button
                  onClick={() => { setEmailSent(false); setEmailInput(""); }}
                  className="mt-5 text-sm text-gray-400 hover:text-black underline transition"
                >
                  {isAr ? "إرسال إلى بريد آخر" : "Send to another email"}
                </button>
              </div>
            ) : (
              <>
                {autoSentTo && (
                  <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2 mb-4 text-sm text-green-800">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />
                    {isAr ? "أُرسل تلقائياً إلى" : "Auto-sent to"} <span className="font-bold" dir="ltr">{autoSentTo}</span>
                  </div>
                )}
                <div className="space-y-3">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={isAr ? "البريد الإلكتروني" : "email@example.com"}
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    onClick={handleManualSend}
                    disabled={emailSending || !emailInput.trim()}
                    className="w-full bg-black text-white text-sm font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    {emailSending
                      ? <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {isAr ? "جاري التجهيز..." : "Preparing..."}</>
                      : <><Send className="w-4 h-4" /> {isAr ? "إرسال PDF" : "Send PDF"}</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

