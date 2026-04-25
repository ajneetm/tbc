"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const CRIT = ["purpose", "return", "obtainability", "design", "users", "competition", "timeline"] as const;

type RankedProject = {
  id: string;
  title: string;
  owner_name: string | null;
  evalCount: number;
  overall: number | null;
};

export default function ResultsPage() {
  const [ranked, setRanked] = useState<RankedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    const [projRes, evalsRes] = await Promise.all([
      supabase.from("projects").select("id, title, owner_name, is_active"),
      supabase.from("project_evaluations").select("project_id, purpose_rating, return_rating, obtainability_rating, design_rating, users_rating, competition_rating, timeline_rating"),
    ]);

    const projects = projRes.data || [];
    const evals = evalsRes.data || [];

    const results: RankedProject[] = projects.map((p) => {
      const pEvals = evals.filter((e) => e.project_id === p.id);
      const allVals = pEvals.flatMap((e) =>
        CRIT.map((k) => e[`${k}_rating`]).filter((v) => v != null)
      );
      const overall = allVals.length
        ? allVals.reduce((a, b) => a + b, 0) / allVals.length
        : null;
      return { id: p.id, title: p.title, owner_name: p.owner_name, evalCount: pEvals.length, overall };
    });

    results.sort((a, b) => {
      if (a.overall == null && b.overall == null) return 0;
      if (a.overall == null) return 1;
      if (b.overall == null) return -1;
      return b.overall - a.overall;
    });

    setRanked(results);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white">

      {/* Controls — hidden on print */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <a href="/admin" className="text-sm text-gray-400 hover:text-white transition">← لوحة التحكم</a>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              آخر تحديث: {lastUpdated.toLocaleTimeString("ar-SA")}
            </span>
          )}
          <button
            onClick={() => { setLoading(true); load(); }}
            disabled={loading}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition disabled:opacity-40"
          >
            {loading ? "..." : "تحديث"}
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-100 transition"
          >
            طباعة
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 print:pt-8">

        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-gray-500 text-sm mb-2">The Business Clock</p>
          <h1 className="text-4xl font-black">نتائج تقييم المشاريع</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        ) : ranked.length === 0 ? (
          <p className="text-center text-gray-500 py-24">لا توجد مشاريع بعد</p>
        ) : (
          <div className="space-y-3">
            {ranked.map((proj, i) => (
              <div
                key={proj.id}
                className={`rounded-2xl p-5 flex items-center gap-5 transition ${
                  i === 0
                    ? "bg-yellow-400 text-black"
                    : i === 1
                    ? "bg-gray-300 text-black"
                    : i === 2
                    ? "bg-amber-700 text-white"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {/* Rank */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${
                  i < 3 ? "bg-black/10" : "bg-white/10 text-white"
                }`}>
                  {getMedal(i)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-lg leading-tight ${i < 3 ? "" : "text-white"}`}>{proj.title}</p>
                  {proj.owner_name && (
                    <p className={`text-sm mt-0.5 ${i < 3 ? "opacity-70" : "text-gray-400"}`}>{proj.owner_name}</p>
                  )}
                  <p className={`text-xs mt-1 ${i < 3 ? "opacity-60" : "text-gray-500"}`}>{proj.evalCount} تقييم</p>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-center">
                  {proj.overall != null ? (
                    <>
                      <p className={`text-4xl font-black ${i < 3 ? "" : "text-white"}`}>
                        {proj.overall.toFixed(1)}
                      </p>
                      <p className={`text-xs ${i < 3 ? "opacity-60" : "text-gray-500"}`}>من 10</p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">لا تقييمات</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
