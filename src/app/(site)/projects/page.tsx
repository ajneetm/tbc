"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Clock } from "lucide-react";

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

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.replace("/auth/signin"); return; }

      const uid = session.user.id;
      setUserId(uid);
      const meta = session.user.user_metadata || {};
      setUserName(meta.first_name || meta.full_name?.split(" ")[0] || "");

      const { data } = await supabase.from("projects").select("*").eq("owner_id", uid).maybeSingle();
      if (data) setMyProject(data);
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

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center pt-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="mx-auto max-w-lg space-y-5">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">تسجيل المشروع</h1>
          <p className="text-gray-400 text-sm mt-1">سجّل مشروعك ليتم عرضه وتقييمه</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {myProject ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {myProject.is_active
                  ? <CheckCircle2 className="w-14 h-14 text-green-500" />
                  : <Clock className="w-14 h-14 text-yellow-500" />}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{myProject.title}</p>
                {myProject.description && <p className="text-gray-500 text-sm mt-1">{myProject.description}</p>}
              </div>
              <div className={`rounded-xl px-4 py-2.5 text-sm font-medium ${myProject.is_active ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                {myProject.is_active ? "✓ مشروعك مسجّل وجاهز للتقييم" : "⏳ بانتظار موافقة الإدارة"}
              </div>
            </div>
          ) : submitDone ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
              <p className="font-bold text-green-700">تم إرسال مشروعك بنجاح</p>
              <p className="text-gray-400 text-sm">سيظهر للتقييم بعد موافقة الإدارة</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المشروع *</label>
                <input type="text" value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="أدخل اسم مشروعك"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">وصف مختصر (اختياري)</label>
                <textarea value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  rows={3}
                  placeholder="فكرة عن مشروعك..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50 resize-none"
                />
              </div>
              <button onClick={submitProject}
                disabled={submitting || !projectTitle.trim()}
                className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-40 transition text-sm">
                {submitting ? "جاري الإرسال..." : "تسجيل المشروع ←"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
