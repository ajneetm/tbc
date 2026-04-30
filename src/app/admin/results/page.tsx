"use client";
import { useEffect, useState } from "react";

const CRIT = ["purpose", "return", "obtainability", "design", "users", "competition", "timeline"] as const;
const CRIT_LABELS: Record<string, string> = {
  purpose: "الغرض", return: "العائد", obtainability: "التمكن",
  design: "التصميم", users: "المستخدمون", competition: "المنافسون", timeline: "الخط الزمني",
};

type RankedProject = {
  id: string;
  title: string;
  owner_name: string | null;
  evalCount: number;
  overall: number | null;
  byCategory: Record<string, number | null>;
};

const GOLD   = "#C9A84C";
const SILVER = "#9CA3AF";
const BRONZE = "#B45309";

export default function ResultsPage() {
  const [ranked, setRanked] = useState<RankedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    const [projRes, evalsRes] = await Promise.all([
      fetch("/api/admin/projects-data").then((r) => r.json()).catch(() => ({ projects: [] })),
      fetch("/api/admin/projects-evals").then((r) => r.json()).catch(() => ({ evals: [] })),
    ]);

    const projects: any[] = projRes.projects || [];
    const evals: any[] = evalsRes.evals || [];

    const results: RankedProject[] = projects.map((p) => {
      const pEvals = evals.filter((e) => e.project_id === p.id);
      const byCategory: Record<string, number | null> = {};
      CRIT.forEach((k) => {
        const vals = pEvals.map((e: any) => e[`${k}_rating`]).filter((v: any) => v != null);
        byCategory[k] = vals.length ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : null;
      });
      const allVals = Object.values(byCategory).filter((v) => v != null) as number[];
      const overall = allVals.length ? allVals.reduce((a, b) => a + b, 0) / allVals.length : null;
      return { id: p.id, title: p.title, owner_name: p.owner_name, evalCount: pEvals.length, overall, byCategory };
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

  const ScoreBar = ({ value, color = "#000" }: { value: number | null; color?: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
      {value != null && (
        <div className="rounded-full h-1.5 transition-all" style={{ width: `${(value / 10) * 100}%`, backgroundColor: color }} />
      )}
    </div>
  );

  const CriteriaGrid = ({ byCategory, accent = "#000" }: { byCategory: Record<string, number | null>; accent?: string }) => (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-4">
      {CRIT.map((k) => (
        <div key={k} className="bg-gray-50 border border-gray-100 rounded-xl p-2 text-center">
          <p className="text-sm font-black" style={{ color: byCategory[k] != null ? accent : "#d1d5db" }}>
            {byCategory[k] != null ? byCategory[k]!.toFixed(1) : "—"}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{CRIT_LABELS[k]}</p>
        </div>
      ))}
    </div>
  );

  const first  = ranked[0] ?? null;
  const second = ranked[1] ?? null;
  const third  = ranked[2] ?? null;
  const rest   = ranked.slice(3);

  return (
    <div dir="rtl" className="min-h-screen bg-white font-[Tajawal]">

      {/* Top bar */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <a href="/admin" className="text-xs text-gray-400 hover:text-gray-700 transition flex items-center gap-1">
          ← لوحة التحكم
        </a>
        <div className="flex items-center gap-2">
          {lastUpdated && <span className="text-xs text-gray-300">{lastUpdated.toLocaleTimeString("ar-SA")}</span>}
          <button onClick={load} disabled={loading}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-40">
            {loading ? "..." : "تحديث"}
          </button>
          <button onClick={() => window.print()}
            className="px-3 py-1.5 text-xs bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition">
            طباعة
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 pt-20 pb-16 print:pt-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">The Business Clock</p>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">نتائج تقييم المشاريع</h1>
          <div className="w-16 h-1 bg-black mx-auto mt-4 rounded-full" />
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
          </div>
        ) : ranked.length === 0 ? (
          <p className="text-center text-gray-400 py-32">لا توجد مشاريع بعد</p>
        ) : (
          <div className="space-y-5">

            {/* #1 Winner */}
            {first && (
              <div className="rounded-3xl border-2 overflow-hidden" style={{ borderColor: GOLD }}>
                <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: GOLD }}>
                  <span className="text-white text-xs font-black tracking-widest uppercase">🥇 المركز الأول</span>
                  <span className="mr-auto text-white/70 text-xs">{first.evalCount} مقيِّم</span>
                </div>
                <div className="px-8 py-6 bg-white">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-3xl font-black text-gray-900 leading-tight">{first.title}</h2>
                      {first.owner_name && <p className="text-gray-500 text-sm mt-1">{first.owner_name}</p>}
                    </div>
                    <div className="flex-shrink-0 text-center">
                      {first.overall != null ? (
                        <>
                          <p className="text-7xl font-black leading-none" style={{ color: GOLD }}>{first.overall.toFixed(1)}</p>
                          <p className="text-gray-400 text-xs mt-1">من 10</p>
                        </>
                      ) : <p className="text-gray-400">—</p>}
                    </div>
                  </div>
                  <ScoreBar value={first.overall} color={GOLD} />
                  <CriteriaGrid byCategory={first.byCategory} accent={GOLD} />
                </div>
              </div>
            )}

            {/* #2 and #3 */}
            {(second || third) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([second, third] as (RankedProject | null)[]).map((proj, idx) => {
                  const color = idx === 0 ? SILVER : BRONZE;
                  const label = idx === 0 ? "🥈 المركز الثاني" : "🥉 المركز الثالث";
                  if (!proj) return null;
                  return (
                    <div key={proj.id} className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: color }}>
                      <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: color }}>
                        <span className="text-white text-xs font-black">{label}</span>
                        <span className="mr-auto text-white/70 text-xs">{proj.evalCount} مقيِّم</span>
                      </div>
                      <div className="px-6 py-5 bg-white">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-xl text-gray-900 leading-tight">{proj.title}</p>
                            {proj.owner_name && <p className="text-gray-500 text-xs mt-0.5">{proj.owner_name}</p>}
                          </div>
                          {proj.overall != null && (
                            <p className="text-4xl font-black flex-shrink-0" style={{ color }}>
                              {proj.overall.toFixed(1)}
                            </p>
                          )}
                        </div>
                        <ScoreBar value={proj.overall} color={color} />
                        <CriteriaGrid byCategory={proj.byCategory} accent={color} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">المراكز التالية</p>
                </div>
                {rest.map((proj, idx) => (
                  <div key={proj.id} className="px-5 py-5 border-b border-gray-100 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 font-black text-gray-400 text-sm">
                        {idx + 4}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-gray-900">{proj.title}</p>
                            {proj.owner_name && <p className="text-gray-500 text-xs mt-0.5">{proj.owner_name}</p>}
                            <p className="text-gray-400 text-xs mt-0.5">{proj.evalCount} تقييم</p>
                          </div>
                          {proj.overall != null && (
                            <p className="text-3xl font-black text-gray-800 flex-shrink-0">
                              {proj.overall.toFixed(1)}<span className="text-gray-400 text-sm font-normal mr-0.5">/10</span>
                            </p>
                          )}
                        </div>
                        <ScoreBar value={proj.overall} color="#111" />
                        <CriteriaGrid byCategory={proj.byCategory} accent="#111" />
                      </div>
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
