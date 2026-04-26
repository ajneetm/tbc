"use client";

import { Survey } from "@/app/libs/api/survey";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import { useEffect, useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import clockBackground from "../../../public/images/dashboard/chat/clock-bg.png";
import Link from "next/link";

const reportTitles: Record<string, Record<string, string>> = {
  ar: {
    explorers: "اختبار قياس جاهزية مستكشف السوق",
    entrepreneurs: "اختبار قياس القوة التجارية",
    companies: "اختبار قياس الأداء المؤسسي",
  },
  en: {
    explorers: "Market Explorer Readiness Assessment",
    entrepreneurs: "Business Strength Assessment",
    companies: "Institutional Performance Assessment",
  },
};

const participantLabels: Record<string, Record<string, string>> = {
  ar: {
    explorers: "مستكشف السوق",
    entrepreneurs: "رائد أعمال",
    companies: "شركة قائمة",
  },
  en: {
    explorers: "Market Explorer",
    entrepreneurs: "Entrepreneur",
    companies: "Established Company",
  },
};

function SurveyReport({
  survey,
  language,
  aiAnalysis,
  isLoading,
}: {
  survey: Survey;
  language?: "ar" | "en";
  aiAnalysis?: string;
  isLoading?: boolean;
}) {
  const { score, data } = survey;
  const { user } = useSupabaseAuth();

  const isRtl = language === "ar";
  const dir = isRtl ? "rtl" : "ltr";
  const lang = language ?? "ar";
  const type = survey.type || "entrepreneurs";
  const reportTitle = reportTitles[lang]?.[type] ?? reportTitles.ar.entrepreneurs;
  const participantLabel = participantLabels[lang]?.[type] ?? participantLabels.ar.entrepreneurs;
  const modalRatio = ((Number(score) / 360) * 100).toFixed(2);

  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailTo, setEmailTo] = useState(user?.email || "");

  useEffect(() => {
    if (user?.email && !emailTo) setEmailTo(user.email);
  }, [user]);
  const [emailSending, setEmailSending] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [emailError, setEmailError] = useState("");

  const chartData = useMemo(() => {
    const elements: { modalId: string; score: number }[] = [];
    data.forEach((item) => {
      const existing = elements.find((i) => i.modalId === item.modalId);
      if (existing) {
        existing.score = (Number(existing.score) + Number(item.score)) / 2;
      } else {
        elements.push({ ...item, score: Number(item.score) });
      }
    });
    return elements;
  }, [data]);

  const handleSendEmail = async () => {
    if (!emailTo) return;
    setEmailSending(true);
    setEmailError("");
    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          totalScore: score,
          percentage: modalRatio,
          language,
          aiContent: aiAnalysis || "",
        }),
      });
      if (res.ok) {
        setEmailDone(true);
      } else {
        setEmailError(isRtl
          ? "تعذّر إرسال التقرير، يرجى التواصل مع الإدارة على info@thebusinessclock.com"
          : "Failed to send report, please contact us at info@thebusinessclock.com");
      }
    } catch {
      setEmailError(isRtl
        ? "تعذّر إرسال التقرير، يرجى التواصل مع الإدارة على info@thebusinessclock.com"
        : "Failed to send report, please contact us at info@thebusinessclock.com");
    }
    setEmailSending(false);
  };

  const btnClass = "rounded-xl border-2 border-black bg-white px-7 py-3 text-black text-sm font-semibold hover:bg-black hover:text-white transition-colors shadow-sm";

  return (
    <div dir={dir} className="min-h-screen bg-gray-50 font-[Tajawal] print:bg-white">
      <style>{`
        @media print {
          /* Override the global print-result.css that hides body * */
          #report-area,
          #report-area * { visibility: visible !important; }
          #report-area { position: static !important; transform: none !important; }

          .no-print { display: none !important; visibility: hidden !important; }
          header, .header, nav, footer, .sticky-navbar,
          [class*="sticky-navbar"], [class*="Navbar"] { display: none !important; visibility: hidden !important; }
          body { background: white !important; margin: 0 !important; }
          .min-h-screen { min-height: unset !important; }
          .max-w-4xl { max-width: 100% !important; padding: 0 16px !important; }
          .rounded-2xl, .rounded-xl { border-radius: 8px !important; }
          .shadow-sm, .shadow-md { box-shadow: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .ai-report h2 { font-size: 1.1rem; font-weight: 700; margin: 1.25rem 0 0.5rem; color: #1f2937; }
        .ai-report p  { color: #374151; line-height: 1.85; margin-bottom: 0.75rem; font-size: 0.95rem; }
        .ai-report ul, .ai-report ol { padding-inline-start: 1.5rem; margin-bottom: 0.75rem; }
        .ai-report li { color: #374151; line-height: 1.75; font-size: 0.95rem; }
        .ai-report strong { color: #111827; }
      `}</style>

      <div id="report-area" className="max-w-4xl mx-auto px-4 py-8 space-y-6 print:px-6 print:py-4">

        {/* ── Report Header ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            {isRtl ? "تقرير تقييم جاهزية الأعمال" : "Business Readiness Assessment Report"}
          </p>
          <h1 className="text-xl font-bold text-gray-900 mb-3">{reportTitle}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            <span>
              <span className="font-semibold text-gray-800">{isRtl ? "المشارك: " : "Participant: "}</span>
              {participantLabel}
            </span>
            <span>
              <span className="font-semibold text-gray-800">{isRtl ? "الدرجة الإجمالية: " : "Overall Score: "}</span>
              {score} {isRtl ? "من 360" : "/ 360"} ({modalRatio}%)
            </span>
          </div>
        </div>

        {/* ── Score Hero ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6">
            <div className="flex-shrink-0">
              <div
                className="size-[220px] p-[12px]"
                style={{ backgroundImage: `url(${clockBackground.src})`, backgroundSize: "cover" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData}>
                    <PolarAngleAxis dataKey="modalId" tick={false} />
                    <PolarRadiusAxis domain={[0, 30]} tick={false} axisLine={false} />
                    <Radar dataKey="score" fill="#F04438" fillOpacity={0.6} animationDuration={700} dot={{ r: 3, fillOpacity: 1 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[140px] bg-black text-white rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold">{score}</p>
                  <p className="text-sm text-gray-300 mt-1">{isRtl ? "من 360" : "out of 360"}</p>
                </div>
                <div className="flex-1 min-w-[140px] bg-gray-900 text-white rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold">{modalRatio}%</p>
                  <p className="text-sm text-gray-300 mt-1">{isRtl ? "النسبة المئوية" : "Percentage"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Report ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              <p className="text-sm">{isRtl ? "جارٍ إنشاء تقريرك..." : "Generating your report..."}</p>
            </div>
          ) : aiAnalysis ? (
            <div className="ai-report" dangerouslySetInnerHTML={{ __html: aiAnalysis }} />
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">
              {isRtl ? "لم يتم إنشاء التقرير" : "Report could not be generated"}
            </p>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="no-print pb-6">
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => window.print()} className={btnClass}>
              {isRtl ? "طباعة الاختبار" : "Print Report"}
            </button>
            {!user && (
              <Link href="/auth/signup" className={btnClass}>
                {isRtl ? "للحصول على المزيد من الخدمات" : "Get More Services"}
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SurveyReport;
