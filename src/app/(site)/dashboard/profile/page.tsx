"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import {
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import clockBackground from "../../../../../public/images/dashboard/chat/clock-bg.png";

const SESSION_STORAGE_SCORE_KEY = "modalScore";
const SURVEY_SCORE = "surveyScore";
const SURVEY_TYPE = "surveyType";
const SESSION_SURVEY_DATA = "SESSION_SURVEY_DATA";

export default function ProfilePage() {
  const { user, loading, signOut } = useSupabaseAuth();
  const { push } = useRouter();
  const [reportData, setReportData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load last report from sessionStorage
    const modalScoreRaw = sessionStorage.getItem(SESSION_STORAGE_SCORE_KEY);
    const totalScore = sessionStorage.getItem(SURVEY_SCORE);
    const surveyType = sessionStorage.getItem(SURVEY_TYPE);
    const formDataRaw = sessionStorage.getItem(SESSION_SURVEY_DATA);

    if (modalScoreRaw && totalScore) {
      const modalScore = JSON.parse(modalScoreRaw);
      const formData = formDataRaw ? JSON.parse(formDataRaw) : {};
      const percentage = ((Number(totalScore) / 360) * 100).toFixed(1);

      const chartData = modalScore.map((item: any) => ({
        modalId: item.modalId,
        score: Number(item.modalScore),
      }));

      const sorted = [...chartData].sort((a: any, b: any) => b.score - a.score);
      const thirdSize = Math.ceil(sorted.length / 3);

      setReportData({
        totalScore,
        percentage,
        surveyType,
        language: formData.language || "ar",
        chartData,
        strengths: sorted.slice(0, thirdSize),
        weaknesses: sorted.slice(-thirdSize),
      });
    }
  }, []);

  if (loading || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const name = user?.user_metadata?.full_name || user?.email || "";
  const firstName = user?.user_metadata?.first_name || name.split(" ")[0] || "";
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const areaLabels: Record<string, string> = {
    "explorers-modal-1": "تحليل المشاكل",
    "explorers-modal-2": "تحديد الأهداف",
    "explorers-modal-3": "التنظيم والتخطيط",
    "explorers-modal-4": "الهوية التجارية",
    "explorers-modal-5": "المعرفة القانونية",
    "explorers-modal-6": "الشبكات والموارد",
    "explorers-modal-7": "صنع القرار",
    "explorers-modal-8": "إدارة المهام",
    "explorers-modal-9": "التسويق",
    "explorers-modal-10": "الإدارة المالية",
    "explorers-modal-11": "التحليل المالي",
    "explorers-modal-12": "التطوير الذاتي",
    "companies-modal-1": "البحث عن الفرص",
    "companies-modal-2": "الميزة التنافسية",
    "companies-modal-3": "التخطيط",
    "companies-modal-4": "العلامة التجارية",
    "companies-modal-5": "الامتثال القانوني",
    "companies-modal-6": "إدارة الموارد",
    "companies-modal-7": "القرارات الاستراتيجية",
    "companies-modal-8": "التميز التشغيلي",
    "companies-modal-9": "استراتيجية التسويق",
    "companies-modal-10": "التحكم المالي",
    "companies-modal-11": "تحليل الأداء",
    "companies-modal-12": "التحسين المستمر",
    "entrepreneurs-modal-1": "تقييم الفرص",
    "entrepreneurs-modal-2": "التفكير الاستراتيجي",
    "entrepreneurs-modal-3": "تخطيط العمل",
    "entrepreneurs-modal-4": "تصميم العلامة",
    "entrepreneurs-modal-5": "الفهم القانوني",
    "entrepreneurs-modal-6": "إدارة الموارد",
    "entrepreneurs-modal-7": "صنع القرار",
    "entrepreneurs-modal-8": "إدارة العمليات",
    "entrepreneurs-modal-9": "اختراق السوق",
    "entrepreneurs-modal-10": "العمليات المالية",
    "entrepreneurs-modal-11": "المراقبة المالية",
    "entrepreneurs-modal-12": "تطوير الأعمال",
  };

  return (
    <section className="min-h-screen bg-gray-50 pt-[120px] pb-16 font-[Tajawal]" dir="rtl">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header Card */}
        <div className="bg-black text-white rounded-2xl p-8 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold mb-3">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold">مرحباً، {firstName}</h1>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
            {joinDate && <p className="text-gray-500 text-xs mt-1">عضو منذ {joinDate}</p>}
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/assessment"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition"
            >
              ابدأ تقييماً جديداً
            </Link>
            <button
              onClick={async () => { await signOut(); push("/"); }}
              className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              خروج
            </button>
          </div>
        </div>

        {reportData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
              <p className="text-gray-400 text-sm mb-2">النتيجة الكلية</p>
              <p className="text-5xl font-bold text-black">{reportData.totalScore}</p>
              <p className="text-gray-400 text-sm mt-1">من 360</p>
              <div className="mt-4 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${reportData.percentage}%` }}
                />
              </div>
              <p className="text-primary font-bold text-xl mt-2">{reportData.percentage}%</p>
            </div>

            {/* Radar Chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center justify-center">
              <div
                className="size-[200px] p-[11px]"
                style={{
                  backgroundImage: `url(${clockBackground.src})`,
                  backgroundSize: "cover",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={reportData.chartData}>
                    <PolarAngleAxis dataKey="modalId" tick={false} />
                    <PolarRadiusAxis domain={[0, 30]} tick={false} axisLine={false} />
                    <Radar dataKey="score" fill="#F04438" fillOpacity={0.6} animationDuration={700} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-3">
              <p className="font-bold text-gray-800 mb-1">إجراءات سريعة</p>
              <Link
                href="/report"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm hover:bg-gray-50 transition"
              >
                <span>📄</span> عرض التقرير الكامل
              </Link>
              <Link
                href="/dashboard/chatbot"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm hover:bg-gray-50 transition"
              >
                <span>💬</span> تحدث مع المستشار
              </Link>
              <Link
                href="/dashboard/assessment"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm hover:bg-gray-50 transition"
              >
                <span>📊</span> إعادة التقييم
              </Link>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                نقاط القوة
              </h2>
              <ul className="space-y-2">
                {reportData.strengths.map((item: any, i: number) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{areaLabels[item.modalId] || item.modalId}</span>
                    <span className="font-bold text-green-600">{item.score.toFixed(0)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                مجالات التطوير
              </h2>
              <ul className="space-y-2">
                {reportData.weaknesses.map((item: any, i: number) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{areaLabels[item.modalId] || item.modalId}</span>
                    <span className="font-bold text-red-500">{item.score.toFixed(0)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-gray-800 mb-2">هل تريد استشارة؟</h2>
                <p className="text-gray-500 text-sm">احجز ساعة مجانية مع أحد مستشارينا لمناقشة نتائجك</p>
              </div>
              <a
                href="tel:41415555"
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800 transition"
              >
                📞 41415555
              </a>
            </div>

          </div>
        ) : (
          // No report yet
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">لم تُجرِ تقييماً بعد</h2>
            <p className="text-gray-500 text-sm mb-6">ابدأ تقييم الفجوة التجارية لاكتشاف نقاط قوتك وفرص تطويرك</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link
                href="/dashboard/assessment"
                className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary/90 transition"
              >
                ابدأ التقييم الآن
              </Link>
              <Link
                href="/dashboard/chatbot"
                className="rounded-lg border border-gray-300 px-8 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                تحدث مع المستشار
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
