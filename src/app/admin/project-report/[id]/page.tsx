"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CRIT = ["purpose", "return", "obtainability", "design", "users", "competition", "timeline"] as const;
const CRIT_LABELS: Record<string, string> = {
  purpose: "الغرض", return: "العائد", obtainability: "التمكن",
  design: "التصميم", users: "المستخدمون", competition: "المنافسون", timeline: "الخط الزمني",
};

export default function ProjectReportPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [evals, setEvals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailTo, setEmailTo] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [projRes, evalsRes] = await Promise.all([
        supabase.from("projects").select("*").eq("id", id).single(),
        supabase.from("project_evaluations").select("*").eq("project_id", id),
      ]);
      if (projRes.data) {
        setProject(projRes.data);
        if (projRes.data.owner_id) {
          const usersRes = await fetch("/api/admin/users").then((r) => r.json()).catch(() => ({ users: [] }));
          const owner = (usersRes.users || []).find((u: any) => u.id === projRes.data.owner_id);
          if (owner?.email) setEmailTo(owner.email);
        }
      }
      setEvals(evalsRes.data || []);
      setLoading(false);
    };
    load();
  }, [id]);

  const avg = (key: string): string => {
    const vals = evals.map((e) => e[`${key}_rating`]).filter((v) => v != null);
    return vals.length ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : "—";
  };

  const allVals = evals.flatMap((e) => CRIT.map((k) => e[`${k}_rating`]).filter((v) => v != null));
  const overall = allVals.length ? (allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(1) : "—";

  const averages = Object.fromEntries(CRIT.map((k) => [k, avg(k)]));

  const notes = Object.fromEntries(
    CRIT.map((k) => [
      k,
      evals.map((e) => e[`${k}_notes`]).filter((n): n is string => !!n?.trim()),
    ])
  );

  const handleSendEmail = async () => {
    if (!emailTo.trim() || !project) return;
    setSending(true);
    try {
      await fetch("/api/admin/project-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo.trim(),
          projectName: project.title,
          personName: project.owner_name || null,
          averages,
          overall,
          notes,
        }),
      });
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  if (!project) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-400">المشروع غير موجود</p>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">

      {/* Action bar — hidden on print */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
        <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-black">← رجوع</button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={emailTo}
              onChange={(e) => { setEmailTo(e.target.value); setSent(false); }}
              placeholder="إرسال إلى البريد..."
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black w-56"
            />
            <button
              onClick={handleSendEmail}
              disabled={sending || !emailTo.trim()}
              className="px-4 py-1.5 bg-black text-white text-sm font-bold rounded-lg disabled:opacity-40 hover:bg-gray-800 transition"
            >
              {sending ? "جاري..." : sent ? "✓ أُرسل" : "إرسال"}
            </button>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition"
          >
            طباعة
          </button>
        </div>
      </div>

      {/* Report content */}
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

          {/* Header */}
          <div className="bg-black px-8 py-7">
            <p className="text-gray-400 text-xs mb-1">تقرير تقييم مشروع</p>
            <h1 className="text-white text-2xl font-bold">{project.title}</h1>
            {project.owner_name && (
              <p className="text-gray-400 text-sm mt-2">{project.owner_name}</p>
            )}
            <p className="text-gray-500 text-xs mt-3">{evals.length} مقيِّم</p>
          </div>

          {evals.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400">لا توجد تقييمات بعد</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">

              {/* Overall */}
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <p className="text-gray-500 text-sm mb-1">المتوسط الكلي</p>
                <p className="text-5xl font-black text-gray-900">{overall}</p>
                <p className="text-gray-400 text-sm mt-1">من 10</p>
              </div>

              {/* Per-criterion */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-3">التفاصيل</p>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                  {CRIT.map((k) => (
                    <div key={k} className="px-5 py-3.5 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{CRIT_LABELS[k]}</span>
                        <span className="font-bold text-gray-900 text-sm">{avg(k)}/10</span>
                      </div>
                      {notes[k]?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {notes[k].map((n, i) => (
                            <li key={i} className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5">
                              {n}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 text-center">
            <p className="text-gray-300 text-xs">The Business Clock — تقييم المشاريع</p>
          </div>
        </div>
      </div>

    </div>
  );
}
