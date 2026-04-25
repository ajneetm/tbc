"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2 } from "lucide-react";

const CRITERIA = [
  { id: "purpose",       label: "الغرض" },
  { id: "return",        label: "العائد" },
  { id: "obtainability", label: "التمكن" },
  { id: "design",        label: "التصميم" },
  { id: "users",         label: "المستخدمون" },
  { id: "competition",   label: "المنافسون" },
  { id: "timeline",      label: "الخط الزمني" },
];

export default function EvaluatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [personName, setPersonName] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace(`/auth/signin?redirect=/evaluate/${id}`);
        return;
      }
      const uid = session.user.id;
      setUserId(uid);
      const meta = session.user.user_metadata || {};
      setPersonName(meta.first_name || meta.full_name?.split(" ")[0] || "");

      const [projRes, evalRes] = await Promise.all([
        supabase.from("projects").select("id, title, description").eq("id", id).single(),
        supabase.from("project_evaluations").select("id").eq("project_id", id).eq("evaluator_id", uid).maybeSingle(),
      ]);

      if (!projRes.data) { setLoading(false); return; }
      setProject(projRes.data);
      setProjectName(projRes.data.title || "");
      setAlreadySubmitted(!!evalRes.data);
      setLoading(false);
    };
    init();
  }, [id]);

  const allRated = CRITERIA.every((c) => ratings[c.id] >= 1);

  const handleSubmit = async () => {
    if (!userId || !project || !allRated) return;
    setSubmitting(true);

    const payload: any = {
      project_id: project.id,
      evaluator_id: userId,
      project_name: projectName.trim() || project.title,
      person_name: personName.trim() || null,
    };
    CRITERIA.forEach((c) => {
      payload[`${c.id}_rating`] = ratings[c.id];
      payload[`${c.id}_notes`]  = notes[c.id]?.trim() || null;
    });

    await supabase.from("project_evaluations").insert(payload);
    setDone(true);
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center pt-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  if (!project) return (
    <div className="flex min-h-screen items-center justify-center pt-24">
      <p className="text-gray-500">المشروع غير موجود</p>
    </div>
  );

  if (alreadySubmitted || done) return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gray-50 pt-24 px-4">
      <div className="bg-white rounded-2xl border border-green-200 p-12 text-center max-w-sm w-full">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="font-bold text-gray-900 text-lg mb-1">شكراً على تقييمك!</p>
        <p className="text-gray-400 text-sm">تم استلام تقييمك لمشروع</p>
        <p className="font-bold text-gray-800 mt-1">{project.title}</p>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="mx-auto max-w-lg space-y-5">

        <div>
          <p className="text-xs text-gray-400 mb-1">تقييم مشروع</p>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          {project.description && <p className="text-gray-500 text-sm mt-1">{project.description}</p>}
        </div>

        {/* اسم المشروع + الشخص — read only */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">اسم المشروع</p>
            <p className="font-bold text-gray-900 text-sm">{projectName}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">المقيِّم</p>
            <p className="font-bold text-gray-900 text-sm">{personName || "—"}</p>
          </div>
        </div>

        {/* Criteria */}
        {CRITERIA.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
            <p className="font-bold text-sm text-gray-800">{cat.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => {
                const selected = ratings[cat.id] === val;
                return (
                  <button key={val} type="button"
                    onClick={() => setRatings((p) => ({ ...p, [cat.id]: val }))}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition border ${
                      selected ? "bg-black text-white border-black" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}>
                    {val}
                  </button>
                );
              })}
            </div>
            <textarea rows={2} value={notes[cat.id] || ""}
              onChange={(e) => setNotes((p) => ({ ...p, [cat.id]: e.target.value }))}
              placeholder="ملاحظة..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50 resize-none" />
          </div>
        ))}

        {!allRated && (
          <p className="text-center text-xs text-gray-400">
            {CRITERIA.filter((c) => !ratings[c.id]).length} معيار لم يُقيَّم بعد
          </p>
        )}

        <button onClick={handleSubmit} disabled={submitting || !allRated}
          className="w-full bg-black text-white font-bold py-3.5 rounded-2xl hover:bg-gray-800 disabled:opacity-40 transition text-sm">
          {submitting ? "جاري الإرسال..." : "إرسال التقييم ←"}
        </button>

      </div>
    </div>
  );
}
