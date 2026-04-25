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
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [projRes, evalsRes] = await Promise.all([
      supabase.from("projects").select("id, title, owner_name"),
      supabase.from("project_evaluations").select("project_id, purpose_rating, return_rating, obtainability_rating, design_rating, users_rating, competition_rating, timeline_rating"),
    ]);

    if (projRes.error || evalsRes.error) {
      setDebugInfo(`خطأ — projects: ${projRes.error?.message || "ok"} | evals: ${evalsRes.error?.message || "ok"}`);
      setLoading(false);
      return;
    }

    const projects = projRes.data || [];
    const evals = evalsRes.data || [];
    setDebugInfo(`مشاريع: ${projects.length} | تقييمات: ${evals.length}`);

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

  const first  = ranked[0] ?? null;
  const second = ranked[1] ?? null;
  const third  = ranked[2] ?? null;
  const rest   = ranked.slice(3);

  const ScoreBar = ({ overall }: { overall: number | null }) => {
    if (overall == null) return null;
    const pct = (overall / 10) * 100;
    return (
      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
        <div className="bg-white rounded-full h-1.5 transition-all" style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0c0c0c] text-white">

      {/* Top bar */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-10 bg-[#0c0c0c]/90 backdrop-blur-sm border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <a href="/admin" className="text-xs text-gray-600 hover:text-gray-400 transition">← لوحة التحكم</a>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-700">{lastUpdated.toLocaleTimeString("ar-SA")}</span>
          )}
          <button onClick={load} disabled={loading}
            className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition disabled:opacity-30">
            {loading ? "..." : "تحديث"}
          </button>
          <button onClick={() => window.print()}
            className="px-3 py-1.5 text-xs bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition">
            طباعة
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-20 pb-16 print:pt-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-gray-600 text-xs tracking-widest uppercase mb-3">The Business Clock</p>
          <h1 className="text-3xl font-black tracking-tight">نتائج تقييم المشاريع</h1>
          {debugInfo && (
            <p className="text-xs text-gray-700 mt-4">{debugInfo}</p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        ) : ranked.length === 0 ? (
          <p className="text-center text-gray-600 py-32">لا توجد مشاريع بعد</p>
        ) : (
          <div className="space-y-10">

            {/* #1 Winner */}
            {first && (
              <div className="relative rounded-3xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="px-8 py-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-yellow-500 text-xs font-bold tracking-widest uppercase">المركز الأول</span>
                      <h2 className="text-2xl font-black mt-1 leading-tight">{first.title}</h2>
                      {first.owner_name && (
                        <p className="text-gray-400 text-sm mt-1">{first.owner_name}</p>
                      )}
                      <p className="text-gray-600 text-xs mt-2">{first.evalCount} مقيِّم</p>
                    </div>
                    <div className="flex-shrink-0 text-center">
                      {first.overall != null ? (
                        <>
                          <p className="text-6xl font-black text-yellow-400 leading-none">{first.overall.toFixed(1)}</p>
                          <p className="text-gray-600 text-xs mt-1">من 10</p>
                        </>
                      ) : (
                        <p className="text-gray-600 text-sm">—</p>
                      )}
                    </div>
                  </div>
                  <ScoreBar overall={first.overall} />
                </div>
              </div>
            )}

            {/* #2 and #3 side by side */}
            {(second || third) && (
              <div className="grid grid-cols-2 gap-3">
                {[second, third].map((proj, idx) => proj && (
                  <div key={proj.id} className="rounded-2xl border border-white/8 bg-white/3 px-5 py-5">
                    <span className={`text-xs font-bold tracking-wide ${idx === 0 ? "text-gray-400" : "text-amber-600"}`}>
                      {idx === 0 ? "المركز الثاني" : "المركز الثالث"}
                    </span>
                    <p className="font-bold mt-1 leading-tight text-sm">{proj.title}</p>
                    {proj.owner_name && (
                      <p className="text-gray-500 text-xs mt-0.5">{proj.owner_name}</p>
                    )}
                    <div className="flex items-end justify-between mt-3">
                      {proj.overall != null ? (
                        <p className="text-3xl font-black">{proj.overall.toFixed(1)}</p>
                      ) : (
                        <p className="text-gray-600 text-sm">—</p>
                      )}
                      <p className="text-gray-600 text-xs mb-1">{proj.evalCount} تقييم</p>
                    </div>
                    <ScoreBar overall={proj.overall} />
                  </div>
                ))}
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="rounded-2xl border border-white/8 overflow-hidden">
                {rest.map((proj, idx) => (
                  <div key={proj.id} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0">
                    <span className="text-gray-600 text-sm w-5 text-center flex-shrink-0">{idx + 4}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{proj.title}</p>
                      {proj.owner_name && <p className="text-gray-600 text-xs mt-0.5">{proj.owner_name}</p>}
                    </div>
                    <div className="flex-shrink-0 text-left">
                      {proj.overall != null ? (
                        <p className="font-bold text-lg">{proj.overall.toFixed(1)}<span className="text-gray-600 text-xs font-normal ml-0.5">/10</span></p>
                      ) : (
                        <p className="text-gray-600 text-sm">—</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
