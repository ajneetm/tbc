"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ClipboardList } from "lucide-react";

const CRITERIA = [
  { id: "purpose",       label: "الغرض" },
  { id: "return",        label: "العائد" },
  { id: "obtainability", label: "التمكن" },
  { id: "design",        label: "التصميم" },
  { id: "users",         label: "المستخدمون" },
  { id: "competition",   label: "المنافسون" },
  { id: "timeline",      label: "الخط الزمني" },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  const [myProject, setMyProject] = useState<any>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [myEvaluations, setMyEvaluations] = useState<Set<string>>(new Set());

  const [evaluatingProject, setEvaluatingProject] = useState<any>(null);
  const [evalProjectName, setEvalProjectName] = useState("");
  const [evalPersonName, setEvalPersonName] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [evalSubmitting, setEvalSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.replace("/auth/signin"); return; }

      const uid = session.user.id;
      setUserId(uid);
      const meta = session.user.user_metadata || {};
      setUserName(meta.first_name || meta.full_name?.split(" ")[0] || "");

      const [myProjRes, projsRes, evalsRes] = await Promise.all([
        supabase.from("projects").select("*").eq("owner_id", uid).maybeSingle(),
        supabase.from("projects").select("id, title, description, is_active").eq("is_active", true),
        supabase.from("project_evaluations").select("project_id").eq("evaluator_id", uid),
      ]);

      if (myProjRes.data) setMyProject(myProjRes.data);
      if (projsRes.data) setProjects(projsRes.data.filter((p: any) => p.owner_id !== uid));
      if (evalsRes.data) setMyEvaluations(new Set(evalsRes.data.map((e: any) => e.project_id)));
      setLoading(false);
    };
    init();
  }, []);

  const submitProject = async () => {
    if (!userId || !projectTitle.trim()) return;
    setSubmitting(true);
    const { data } = await supabase.from("projects").insert({
      title: projectTitle.trim(),
      description: projectDesc.trim() || null,
      owner_id: userId,
      owner_name: userName || null,
    }).select().single();
    if (data) setMyProject(data);
    setSubmitDone(true);
    setSubmitting(false);
  };

  const openEval = (project: any) => {
    setEvaluatingProject(project);
    setEvalProjectName(project.title);
    setEvalPersonName(userName);
    setRatings({});
    setNotes({});
  };

  const allRated = CRITERIA.every((c) => ratings[c.id] >= 1);

  const submitEvaluation = async () => {
    if (!userId || !evaluatingProject || !allRated) return;
    setEvalSubmitting(true);

    const payload: any = {
      project_id: evaluatingProject.id,
      evaluator_id: userId,
      project_name: evalProjectName.trim() || evaluatingProject.title,
      person_name: evalPersonName.trim() || null,
    };
    CRITERIA.forEach((c) => {
      payload[`${c.id}_rating`] = ratings[c.id];
      payload[`${c.id}_notes`]  = notes[c.id]?.trim() || null;
    });

    await supabase.from("project_evaluations").insert(payload);
    setMyEvaluations((prev) => new Set([...prev, evaluatingProject.id]));
    setEvaluatingProject(null);
    setEvalSubmitting(false);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center pt-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="mx-auto max-w-xl space-y-5">

        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">تقييم المشاريع</h1>
          <p className="text-gray-400 text-sm mt-1">قدّم مشروعك وقيّم مشاريع زملائك</p>
        </div>

        {/* My project */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-sm text-gray-800 mb-3">مشروعي</h2>
          {myProject ? (
            <div className={`rounded-xl px-4 py-3 text-sm border ${myProject.is_active ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
              <p className="font-bold text-gray-900">{myProject.title}</p>
              {myProject.description && <p className="text-gray-500 text-xs mt-1 leading-relaxed">{myProject.description}</p>}
              <p className={`text-xs font-medium mt-2 ${myProject.is_active ? "text-green-600" : "text-yellow-700"}`}>
                {myProject.is_active ? "✓ مشروعك مرئي للمشاركين للتقييم" : "⏳ بانتظار موافقة الإدارة"}
              </p>
            </div>
          ) : submitDone ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
              <p className="font-bold text-green-700">تم إرسال مشروعك بنجاح</p>
              <p className="text-green-600 text-xs mt-1">سيظهر للمشاركين بعد موافقة الإدارة</p>
            </div>
          ) : (
            <div className="space-y-3">
              <input type="text" value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="اسم المشروع *"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50"
              />
              <textarea value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                rows={3}
                placeholder="وصف مختصر للمشروع (اختياري)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50 resize-none"
              />
              <button onClick={submitProject}
                disabled={submitting || !projectTitle.trim()}
                className="w-full bg-black text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-40 transition text-sm">
                {submitting ? "جاري الإرسال..." : "إرسال المشروع ←"}
              </button>
            </div>
          )}
        </div>

        {/* Projects list */}
        <div>
          <h2 className="font-bold text-sm text-gray-700 mb-3">مشاريع الزملاء</h2>
          {projects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">لا توجد مشاريع متاحة للتقييم حالياً</p>
              <p className="text-gray-400 text-xs mt-1">ستظهر المشاريع هنا بعد موافقة الإدارة عليها</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => {
                const evaluated = myEvaluations.has(project.id);
                return (
                  <div key={project.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{project.title}</p>
                        {project.description && (
                          <p className="text-gray-500 text-xs mt-1 leading-relaxed">{project.description}</p>
                        )}
                      </div>
                      {evaluated ? (
                        <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                          تم التقييم ✓
                        </span>
                      ) : (
                        <button onClick={() => openEval(project)}
                          className="bg-black text-white text-xs font-bold px-4 py-1.5 rounded-xl hover:bg-gray-800 transition flex-shrink-0">
                          قيّم ←
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Evaluation modal */}
      {evaluatingProject && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 space-y-5">

              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">نموذج التقييم</h3>
                <button onClick={() => setEvaluatingProject(null)}
                  className="text-gray-400 hover:text-black text-2xl leading-none w-8 h-8 flex items-center justify-center">×</button>
              </div>

              {/* اسم المشروع */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المشروع</label>
                <input
                  type="text"
                  value={evalProjectName}
                  onChange={(e) => setEvalProjectName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>

              {/* اسم الشخص */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الشخص</label>
                <input
                  type="text"
                  value={evalPersonName}
                  onChange={(e) => setEvalPersonName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>

              {/* Criteria */}
              {CRITERIA.map((cat) => (
                <div key={cat.id} className="border border-gray-100 rounded-2xl p-4 space-y-3">
                  <p className="font-bold text-sm text-gray-800">{cat.label}</p>

                  {/* 1-10 buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => {
                      const selected = ratings[cat.id] === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRatings((p) => ({ ...p, [cat.id]: val }))}
                          className={`w-9 h-9 rounded-xl text-sm font-bold transition border ${
                            selected
                              ? "bg-black text-white border-black"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>

                  {/* Notes */}
                  <textarea
                    rows={2}
                    value={notes[cat.id] || ""}
                    onChange={(e) => setNotes((p) => ({ ...p, [cat.id]: e.target.value }))}
                    placeholder="ملاحظة..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50 resize-none"
                  />
                </div>
              ))}

              {!allRated && (
                <p className="text-center text-xs text-gray-400">
                  {CRITERIA.filter((c) => !ratings[c.id]).length} معيار لم يُقيَّم بعد
                </p>
              )}

              <div className="flex gap-3 pb-1">
                <button onClick={submitEvaluation}
                  disabled={evalSubmitting || !allRated}
                  className="flex-1 bg-black text-white font-bold py-3 rounded-2xl hover:bg-gray-800 disabled:opacity-40 transition text-sm">
                  {evalSubmitting ? "جاري الإرسال..." : "إرسال التقييم ←"}
                </button>
                <button onClick={() => setEvaluatingProject(null)}
                  className="px-5 border border-gray-300 text-gray-600 text-sm font-medium rounded-2xl hover:bg-gray-50 transition">
                  إلغاء
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
