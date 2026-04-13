"use client";

import { Survey } from "@/app/libs/api/survey";
import { useSelector } from "@/store/hooks";
import Image from "next/image";
import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import clockBackground from "../../../public/images/dashboard/chat/clock-bg.png";
import { StructuredReport } from "./generateReportText";

function SurveyReport({
  survey,
  reportData,
  aiAnalysis,
}: {
  survey: Survey;
  reportData?: StructuredReport | null;
  aiAnalysis?: string;
}) {
  const { score, data, name } = survey;
  const { language } = useSelector((state) => state.assessmentForm);

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

  const modalRatio = ((Number(score) / 360) * 100).toFixed(2);
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

  const isRtl = language === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  const reportTitle =
    survey.type === "entrepreneurs"
      ? isRtl ? "ملخص تقييم القوة التجارية" : "Business Strength Assessment"
      : survey.type === "companies"
      ? isRtl ? "ملخص تقييم الأداء المؤسسي" : "Institutional Performance Assessment"
      : isRtl ? "ملخص تقييم الجاهزية التجارية" : "Business Readiness Assessment";

  return (
    <div dir={dir} className="min-h-screen bg-gray-50 font-[Tajawal] print:bg-white">
      {/* ── Print styles ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { font-family: 'Tajawal', Arial, sans-serif; }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-black text-white py-4 px-6 flex items-center justify-between print:py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/images/brands/Ajnee-business-hub-black.svg"
            alt="Ajnee"
            width={70}
            height={40}
            className="invert"
          />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold leading-tight">{reportTitle}</h1>
          {name && <p className="text-sm text-gray-300 mt-0.5">{isRtl ? `مُعدّ لـ: ${name}` : `Prepared for: ${name}`}</p>}
        </div>
        <div className="text-sm text-gray-400">{formattedDate}</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 print:px-6 print:py-4">

        {/* ── Score Hero ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6">
            {/* Radar chart */}
            <div className="flex-shrink-0">
              <div
                className="size-[220px] p-[12px]"
                style={{
                  backgroundImage: `url(${clockBackground.src})`,
                  backgroundSize: "cover",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData}>
                    <PolarAngleAxis dataKey="modalId" tick={false} />
                    <PolarRadiusAxis domain={[0, 30]} tick={false} axisLine={false} />
                    <Radar
                      dataKey="score"
                      fill="#F04438"
                      fillOpacity={0.6}
                      animationDuration={700}
                      dot={{ r: 3, fillOpacity: 1 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score info */}
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
              {reportData && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">{isRtl ? "التقدير" : "Level"}</p>
                  <p className="text-gray-800 text-sm leading-relaxed">{reportData.level}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Intro ── */}
        {reportData && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-700 leading-loose text-[15px]">{reportData.intro}</p>
          </div>
        )}

        {/* ── Strengths ── */}
        {reportData && reportData.strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✅</span>
              <h2 className="text-lg font-bold text-gray-800">
                {isRtl ? "أولاً: نقاط القوة (المكتسبات الحالية)" : "Strengths"}
              </h2>
            </div>
            <div className="space-y-3">
              {reportData.strengths.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden"
                >
                  <div className="flex items-stretch">
                    <div className="w-1 bg-green-500 flex-shrink-0" />
                    <div className="p-4 flex-1">
                      <p className="font-semibold text-green-800 mb-1">{item.title}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Weaknesses / Development ── */}
        {reportData && reportData.weaknesses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚡</span>
              <h2 className="text-lg font-bold text-gray-800">
                {isRtl ? "ثانياً: جوانب التطوير (المهارات المطلوبة)" : "Development Areas"}
              </h2>
            </div>
            <div className="space-y-3">
              {reportData.weaknesses.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden"
                >
                  <div className="flex items-stretch">
                    <div className="w-1 bg-amber-500 flex-shrink-0" />
                    <div className="p-4 flex-1">
                      <p className="font-semibold text-amber-800 mb-1">{item.title}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Summary ── */}
        {reportData && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="bg-blue-600 px-6 py-3">
              <h2 className="text-white font-bold text-base">
                {isRtl ? "ثالثاً: الخلاصة" : "Summary"}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-loose text-[15px]">{reportData.summary}</p>
            </div>
          </div>
        )}

        {/* ── Recommendations ── */}
        {reportData && (
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="bg-indigo-700 px-6 py-3">
              <h2 className="text-white font-bold text-base">
                {isRtl ? "رابعاً: التوصيات المقترحة" : "Recommendations"}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-loose text-[15px]">{reportData.recs}</p>
            </div>
          </div>
        )}

        {/* ── Fallback: plain text (English or no structured data) ── */}
        {!reportData && aiAnalysis && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div
              className="text-gray-700 leading-loose text-[15px]"
              dangerouslySetInnerHTML={{ __html: aiAnalysis }}
            />
          </div>
        )}

        {/* ── Footer ── */}
        <div className="bg-black text-white rounded-2xl p-6 text-center space-y-1 text-sm">
          <p className="font-bold text-base">أجني لدعم الأعمال</p>
          <p><span className="font-medium">ajnee</span> BUSINESS SUPPORT</p>
          <p className="text-gray-400">The Gate Mall, Tower 2, Floor 12</p>
          <p className="text-gray-400">Tel. 41415555 — P.O. Box 55994</p>
          <p className="text-gray-300">info@Ajnee.com — www.Ajnee.com</p>
        </div>

        {/* ── Print button ── */}
        <div className="flex justify-center pb-4 no-print">
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-black px-10 py-3 text-white font-semibold hover:bg-gray-800 transition-colors shadow-md"
          >
            {isRtl ? "طباعة التقرير" : "Print Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SurveyReport;
