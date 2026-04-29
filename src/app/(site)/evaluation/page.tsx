"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, CheckCircle2, ClipboardList } from "lucide-react";

const CATEGORIES = [
  { id: "trainer_rating",      label: "أداء المدرب والتمكن من المادة" },
  { id: "interaction_rating",  label: "التفاعل والمشاركة الجماعية" },
  { id: "content_rating",      label: "جودة المحتوى التدريبي" },
  { id: "facilities_rating",   label: "التجهيزات والبيئة التدريبية" },
  { id: "benefit_rating",      label: "مدى الاستفادة من هذه الورشة" },
];

const SCORE_LABELS: Record<number, string> = {
  1: "ضعيف",
  2: "مقبول",
  3: "متوسط",
  4: "جيد جداً",
  5: "ممتاز",
};

export default function EvaluationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [userName, setUserName] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.replace("/auth/signin"); return; }

      const uid = session.user.id;
      setUserId(uid);

      const meta = session.user.user_metadata || {};
      const name = meta.first_name || meta.full_name?.split(" ")[0] || "";
      setUserName(name);

      const [settingsRes, submittedRes] = await Promise.all([
        supabase.from("evaluation_settings").select("is_open").eq("id", 1).single(),
        supabase.from("workshop_evaluations").select("id").eq("user_id", uid).maybeSingle(),
      ]);

      setIsOpen(settingsRes.data?.is_open ?? false);
      setAlreadySubmitted(!!submittedRes.data);
      setLoading(false);
    };
    init();
  }, []);

  const allRated = CATEGORIES.every((c) => ratings[c.id] >= 1);

  const handleSubmit = async () => {
    if (!userId || !allRated) return;
    setSubmitting(true);

    const res = await fetch("/api/submit-evaluation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        user_name: userName || null,
        trainer_rating:     ratings["trainer_rating"],
        interaction_rating: ratings["interaction_rating"],
        content_rating:     ratings["content_rating"],
        facilities_rating:  ratings["facilities_rating"],
        benefit_rating:     ratings["benefit_rating"],
        comments: comments.trim() || null,
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      setDone(true);
    } else {
      const { error } = await res.json().catch(() => ({}));
      alert("حدث خطأ أثناء الإرسال: " + (error || "يرجى المحاولة مجدداً"));
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center pt-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">تقييم الورشة التدريبية</h1>
          <p className="text-gray-400 text-sm mt-1">رأيك يساعدنا على التطوير والتحسين المستمر</p>
        </div>

        {/* Locked */}
        {!isOpen && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-16 h-16 text-gray-300" />
            </div>
            <p className="font-bold text-gray-700 text-lg mb-1">التقييم مقفل حالياً</p>
            <p className="text-gray-400 text-sm">سيُفتح من قِبل الإدارة في نهاية الورشة</p>
          </div>
        )}

        {/* Already submitted */}
        {isOpen && (alreadySubmitted || done) && (
          <div className="bg-white rounded-2xl border border-green-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">شكراً على تقييمك!</p>
            <p className="text-gray-400 text-sm mb-6">تم استلام تقييمك بنجاح</p>
            <button onClick={() => router.push("/user")}
              className="bg-black text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-gray-800 transition">
              العودة للداشبورد ←
            </button>
          </div>
        )}

        {/* Form */}
        {isOpen && !alreadySubmitted && !done && (
          <div className="space-y-4">

            {/* Optional name */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <label className="block text-sm font-semibold text-gray-700 mb-3">الاسم الكامل (اختياري)</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="اتركه فارغاً إذا كنت تفضل الخصوصية"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50"
              />
            </div>

            {/* Rating categories */}
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="font-semibold text-sm text-gray-800 mb-4">{cat.label}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const selected = ratings[cat.id] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRatings((p) => ({ ...p, [cat.id]: val }))}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-bold transition ${
                          selected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-400"
                        }`}
                      >
                        <span className="text-base font-extrabold">{val}</span>
                        <span className={`text-[10px] leading-tight text-center ${selected ? "text-gray-200" : "text-gray-400"}`}>
                          {SCORE_LABELS[val]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Comments */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <label className="block text-sm font-semibold text-gray-700 mb-3">ملاحظات إضافية (اختياري)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="أخبرنا كيف يمكننا أن نصبح أفضل..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black bg-gray-50 resize-none"
              />
            </div>

            {!allRated && (
              <p className="text-center text-xs text-gray-400">
                {CATEGORIES.filter((c) => !ratings[c.id]).length} تقييم متبقي
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !allRated}
              className="w-full bg-black text-white font-bold py-3.5 rounded-2xl hover:bg-gray-800 disabled:opacity-40 transition text-sm"
            >
              {submitting ? "جاري الإرسال..." : "إرسال التقييم ←"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
