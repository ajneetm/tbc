"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const surveyTypeLabel = (t: string) =>
  t === "explorers" ? "مستكشف" : t === "entrepreneurs" ? "رائد أعمال" : "صاحب شركة / مدير تنفيذي";

const surveyTypeColor = (t: string) =>
  t === "explorers"
    ? { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" }
    : t === "entrepreneurs"
    ? { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" }
    : { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" };

const scoreColor = (pct: number) =>
  pct >= 80 ? "text-green-600" : pct >= 60 ? "text-amber-500" : "text-red-500";

const scoreLabel = (pct: number) =>
  pct >= 80 ? "ممتاز" : pct >= 60 ? "جيد" : pct >= 40 ? "متوسط" : "يحتاج تطوير";

export default function MyReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.replace("/auth/signin"); return; }

      const meta = session.user.user_metadata || {};
      setUserName(meta.first_name || meta.full_name?.split(" ")[0] || "");

      const { data } = await supabase
        .from("survey_results")
        .select("id, survey_type, total_score, language, created_at, ai_analysis")
        .or(`user_id.eq.${session.user.id},email.ilike.${session.user.email}`)
        .order("created_at", { ascending: false });

      setReports(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>
  );

  const latest = reports[0];
  const rest = reports.slice(1);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-[Tajawal]">
      {/* Header */}
      <div className="bg-black text-white px-5 py-5 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs mb-0.5">مرحباً{userName ? `، ${userName}` : ""}</p>
          <h1 className="font-bold text-lg">تقاريرك</h1>
        </div>
        <Link
          href="/user"
          className="text-gray-400 hover:text-white text-sm transition flex items-center gap-1.5"
        >
          <span>←</span> الداشبورد
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {reports.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📊</p>
            <p className="font-bold text-gray-700 text-lg mb-2">ما في تقارير بعد</p>
            <p className="text-gray-400 text-sm mb-6">أكمل اختبار &quot;اختبر عملك&quot; لتظهر تقاريرك هنا</p>
            <Link
              href="/dashboard/chatbot"
              className="inline-block bg-black text-white text-sm font-bold px-6 py-3 rounded-2xl hover:bg-gray-800 transition"
            >
              ابدأ الاختبار ←
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Latest — big card */}
            {latest && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-black px-6 py-4 flex items-center justify-between">
                  <span className="text-gray-400 text-xs">أحدث تقرير</span>
                  {latest.ai_analysis && (
                    <span className="flex items-center gap-1.5 text-green-400 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                      تحليل ذكاء اصطناعي جاهز
                    </span>
                  )}
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${surveyTypeColor(latest.survey_type).bg} ${surveyTypeColor(latest.survey_type).text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${surveyTypeColor(latest.survey_type).dot}`} />
                        {surveyTypeLabel(latest.survey_type)}
                      </span>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(latest.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className={`text-4xl font-black ${scoreColor(Math.round((latest.total_score / 360) * 100))}`}>
                        {Math.round((latest.total_score / 360) * 100)}%
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">{latest.total_score} / 360</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
                    <div
                      className={`h-2 rounded-full transition-all ${Math.round((latest.total_score / 360) * 100) >= 80 ? "bg-green-500" : Math.round((latest.total_score / 360) * 100) >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                      style={{ width: `${Math.round((latest.total_score / 360) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${scoreColor(Math.round((latest.total_score / 360) * 100))}`}>
                      {scoreLabel(Math.round((latest.total_score / 360) * 100))}
                    </span>
                    <Link
                      href={`/my-report/${latest.id}`}
                      className="bg-black text-white text-sm font-bold px-5 py-2.5 rounded-2xl hover:bg-gray-800 transition"
                    >
                      عرض التقرير الكامل ←
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Older reports */}
            {rest.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 font-medium px-1 mb-3">التقارير السابقة</p>
                <div className="space-y-2">
                  {rest.map((r, i) => {
                    const pct = Math.round((r.total_score / 360) * 100);
                    const color = surveyTypeColor(r.survey_type);
                    return (
                      <Link
                        key={r.id}
                        href={`/my-report/${r.id}`}
                        className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition group"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color.bg}`}>
                          <span className={`font-bold text-sm ${color.text}`}>{reports.length - 1 - i}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800">{surveyTypeLabel(r.survey_type)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(r.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <div className="text-left flex-shrink-0 flex items-center gap-3">
                          <div>
                            <p className={`font-black text-lg ${scoreColor(pct)}`}>{pct}%</p>
                            <p className="text-xs text-gray-400">{r.total_score}/360</p>
                          </div>
                          <span className="text-gray-300 group-hover:text-gray-600 transition text-lg">←</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
