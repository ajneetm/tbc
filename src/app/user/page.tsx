"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Tab =
  | "progress"
  | "courses"
  | "materials"
  | "assessments"
  | "results"
  | "certificates"
  | "consultation"
  | "discounts";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "progress",     label: "التقدم",               icon: "📊" },
  { key: "courses",      label: "الدورات",              icon: "🎓" },
  { key: "materials",    label: "الملازم",              icon: "📎" },
  { key: "assessments",  label: "الاختبارات",           icon: "📋" },
  { key: "results",      label: "نتائج الاختبارات",     icon: "📈" },
  { key: "certificates", label: "الشهادات",             icon: "🏅" },
  { key: "consultation", label: "حجز استشارة",          icon: "📅" },
  { key: "discounts",    label: "خصومات العضوية",       icon: "🎁" },
];

const surveyTypeLabel = (t: string) =>
  t === "explorers" ? "مستكشف" : t === "entrepreneurs" ? "رائد أعمال" : "صاحب شركة/مدير تنفيذي";

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("progress");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  // Consultation form
  const [consultation, setConsultation] = useState({ topic: "", date: "", notes: "" });
  const [consultLoading, setConsultLoading] = useState(false);
  const [consultMsg, setConsultMsg] = useState({ text: "", ok: true });
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const authUser = session?.user;
      if (!authUser) { router.replace("/auth/signin"); return; }

      const email = authUser.email?.toLowerCase() || "";
      if (ADMIN_EMAILS.includes(email)) { router.replace("/quiz/admin"); return; }

      // If trainer, redirect to trainer dashboard
      const { data: trainer } = await supabase.from("trainers").select("status").ilike("email", email).single();
      if (trainer?.status === "active") { router.replace("/trainer"); return; }

      setUser(authUser);

      const [programsRes, resultsRes, certsRes, consultsRes] = await Promise.all([
        supabase.from("programs").select("*").eq("status", "active").order("created_at", { ascending: false }),
        supabase.from("survey_results").select("*").ilike("email", email).order("created_at", { ascending: false }),
        supabase.from("certificates").select("*").ilike("trainee_email", email).order("issued_at", { ascending: false }),
        supabase.from("consultations").select("*").eq("user_email", email).order("created_at", { ascending: false }),
      ]);

      if (programsRes.data) setPrograms(programsRes.data);
      if (resultsRes.data) setResults(resultsRes.data);
      if (certsRes.data) setCertificates(certsRes.data);
      if (consultsRes.data) setConsultations(consultsRes.data);
      setLoading(false);
    };
    init();
  }, []);

  const bookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultLoading(true);
    const { error } = await supabase.from("consultations").insert({
      user_email: user.email,
      user_name: user.user_metadata?.full_name || user.email,
      topic: consultation.topic,
      preferred_date: consultation.date,
      notes: consultation.notes,
      status: "pending",
    });
    if (!error) {
      setConsultMsg({ text: "تم إرسال طلب الاستشارة بنجاح ✓", ok: true });
      setConsultation({ topic: "", date: "", notes: "" });
      const { data } = await supabase.from("consultations").select("*").eq("user_email", user.email).order("created_at", { ascending: false });
      if (data) setConsultations(data);
    } else {
      setConsultMsg({ text: "حدث خطأ، حاول مرة أخرى", ok: false });
    }
    setConsultLoading(false);
    setTimeout(() => setConsultMsg({ text: "", ok: true }), 4000);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  const name = user?.user_metadata?.first_name || user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";
  const activeTabObj = tabs.find(t => t.key === activeTab)!;
  const latestResult = results[0];
  const coursesWithMaterial = programs.filter(p => p.material_url);
  const completedAssessments = results.length;
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long" }) : "";

  return (
    <div dir="rtl" className="h-screen overflow-hidden bg-gray-100 font-[Tajawal] flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-black flex flex-col h-full overflow-y-auto">

        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight truncate">{name}</p>
              <p className="text-gray-400 text-xs mt-0.5 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-right ${
                activeTab === tab.key ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base flex-shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <span>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto h-full">

        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <h1 className="font-bold text-gray-900">{activeTabObj.icon} {activeTabObj.label}</h1>
          <p className="text-xs text-gray-400">عضو منذ {joinDate}</p>
        </div>

        <div className="p-8">

          {/* ── التقدم ── */}
          {activeTab === "progress" && (
            <div className="space-y-6 max-w-4xl">

              {/* Welcome */}
              <div className="bg-black text-white rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold">مرحباً، {name} 👋</h2>
                  <p className="text-gray-400 text-sm mt-1">هذه لوحة تقدمك في رحلة التطوير</p>
                </div>
                <Link href="/dashboard/assessment"
                  className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition">
                  ابدأ اختباراً جديداً
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "الاختبارات المُجراة", value: completedAssessments, icon: "📋", color: "bg-blue-50 text-blue-700" },
                  { label: "الشهادات", value: certificates.length, icon: "🏅", color: "bg-yellow-50 text-yellow-700" },
                  { label: "الدورات المتاحة", value: programs.length, icon: "🎓", color: "bg-green-50 text-green-700" },
                  { label: "الملازم", value: coursesWithMaterial.length, icon: "📎", color: "bg-purple-50 text-purple-700" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-2xl p-5 ${s.color} border border-current/10`}>
                    <p className="text-2xl mb-1">{s.icon}</p>
                    <p className="text-3xl font-bold">{s.value}</p>
                    <p className="text-xs mt-1 opacity-70 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Latest result */}
              {latestResult && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-bold mb-4">آخر نتيجة اختبار</h3>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-black">{latestResult.total_score}</p>
                      <p className="text-xs text-gray-400 mt-1">من 360</p>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">{surveyTypeLabel(latestResult.survey_type)}</span>
                        <span className="font-bold text-primary">{latestResult.percentage}%</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${latestResult.percentage}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{new Date(latestResult.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                    <Link href="/report" className="text-sm text-primary hover:underline font-medium">عرض التقرير ←</Link>
                  </div>
                </div>
              )}

              {/* No result yet */}
              {!latestResult && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                  <p className="text-4xl mb-3">📊</p>
                  <p className="text-gray-500 text-sm">لم تُجرِ أي اختبار بعد</p>
                  <Link href="/dashboard/assessment" className="inline-block mt-4 bg-black text-white text-sm px-6 py-2.5 rounded-xl hover:bg-gray-800 transition">ابدأ الآن</Link>
                </div>
              )}
            </div>
          )}

          {/* ── الدورات ── */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm mb-2">الدورات المتاحة: <span className="font-bold text-black">{programs.length}</span></p>
              {programs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-3">🎓</p>
                  <p className="text-gray-400">لا توجد دورات متاحة حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programs.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-base leading-snug">{p.name}</h3>
                        {p.category && <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 mr-2 flex-shrink-0">{p.category}</span>}
                      </div>
                      {p.description && <p className="text-gray-500 text-sm mb-3 leading-relaxed">{p.description}</p>}
                      <div className="flex items-center justify-between mt-3">
                        {p.duration && <p className="text-xs text-gray-400">⏱ {p.duration}</p>}
                        {p.material_url && (
                          <a href={p.material_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition font-medium">
                            📎 الملزمة
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── الملازم ── */}
          {activeTab === "materials" && (
            <div className="space-y-4">
              {coursesWithMaterial.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-3">📎</p>
                  <p className="text-gray-400">لا توجد ملازم متاحة حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coursesWithMaterial.map((p) => (
                    <a key={p.id} href={p.material_url} target="_blank" rel="noopener noreferrer"
                      className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">📎</div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-sm truncate">{p.name}</p>
                        {p.category && <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>}
                        {p.duration && <p className="text-xs text-gray-400">⏱ {p.duration}</p>}
                      </div>
                      <span className="text-xs text-blue-600 font-medium flex-shrink-0">فتح ←</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── الاختبارات ── */}
          {activeTab === "assessments" && (
            <div className="space-y-4 max-w-2xl">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <p className="text-5xl mb-4">📋</p>
                <h2 className="text-lg font-bold text-gray-800 mb-2">اختبار قياس الجاهزية التجارية</h2>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">اكتشف مستوى جاهزيتك التجارية من خلال اختبارنا الشامل واحصل على تقرير مفصّل بنقاط قوتك وفرص تطويرك</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Link href="/dashboard/assessment"
                    className="bg-black text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition">
                    ابدأ الاختبار
                  </Link>
                  {results.length > 0 && (
                    <Link href="/report"
                      className="border border-gray-200 text-gray-700 text-sm font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition">
                      عرض آخر تقرير
                    </Link>
                  )}
                </div>
              </div>
              {results.length > 0 && (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
                  <p className="text-sm text-gray-500">أجريت <span className="font-bold text-black">{results.length}</span> اختبار حتى الآن</p>
                </div>
              )}
            </div>
          )}

          {/* ── نتائج الاختبارات ── */}
          {activeTab === "results" && (
            <div className="space-y-4">
              {results.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-3">📈</p>
                  <p className="text-gray-400 text-sm">لم تُجرِ أي اختبار بعد</p>
                  <Link href="/dashboard/assessment" className="inline-block mt-4 bg-black text-white text-sm px-6 py-2.5 rounded-xl hover:bg-gray-800 transition">
                    ابدأ الاختبار
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((r, i) => (
                    <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-5 flex-wrap">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                        {results.length - i}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{surveyTypeLabel(r.survey_type)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(r.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</p>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <p className="text-2xl font-bold">{r.total_score}</p>
                        <p className="text-xs text-gray-400">/ 360</p>
                      </div>
                      <div className="flex-shrink-0 text-center">
                        <p className="text-xl font-bold text-primary">{r.percentage}%</p>
                      </div>
                      <Link href="/report" className="text-xs text-primary hover:underline font-medium flex-shrink-0">
                        عرض التقرير
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── الشهادات ── */}
          {activeTab === "certificates" && (
            <div className="space-y-4">
              {certificates.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-5xl mb-4">🏅</p>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">لا توجد شهادات بعد</h2>
                  <p className="text-gray-400 text-sm">ستظهر شهاداتك هنا بعد إتمام الدورات المعتمدة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-md transition">
                      <p className="text-4xl mb-3">🏅</p>
                      <h3 className="font-bold text-gray-900">{cert.trainee_name}</h3>
                      <p className="text-xs text-gray-400 mt-1">مدرب: {cert.trainer_name}</p>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">تاريخ الإصدار</p>
                        <p className="text-sm font-medium mt-0.5">{new Date(cert.issued_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── حجز استشارة ── */}
          {activeTab === "consultation" && (
            <div className="space-y-5 max-w-2xl">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-lg mb-1">احجز استشارة مع الإدارة</h2>
                <p className="text-gray-400 text-sm mb-5">سيتواصل معك فريق أجني لتأكيد الموعد</p>
                <form onSubmit={bookConsultation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">موضوع الاستشارة <span className="text-red-500">*</span></label>
                    <input required type="text" value={consultation.topic}
                      onChange={(e) => setConsultation(p => ({ ...p, topic: e.target.value }))}
                      placeholder="مثال: مراجعة نتائج الاختبار، استراتيجية العمل..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">التاريخ المفضّل</label>
                    <input type="date" value={consultation.date}
                      onChange={(e) => setConsultation(p => ({ ...p, date: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ملاحظات إضافية</label>
                    <textarea value={consultation.notes}
                      onChange={(e) => setConsultation(p => ({ ...p, notes: e.target.value }))}
                      rows={3} placeholder="أي تفاصيل تريد إضافتها..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black resize-none" />
                  </div>
                  <div className="flex items-center gap-4">
                    <button type="submit" disabled={consultLoading}
                      className="bg-black text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition">
                      {consultLoading ? "جاري الإرسال..." : "إرسال الطلب"}
                    </button>
                    {consultMsg.text && (
                      <p className={`text-sm font-medium ${consultMsg.ok ? "text-green-600" : "text-red-500"}`}>{consultMsg.text}</p>
                    )}
                  </div>
                </form>
              </div>

              {/* Previous requests */}
              {consultations.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100">
                    <h3 className="font-bold text-sm">طلباتي السابقة</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {consultations.map((c) => (
                      <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">{c.topic}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(c.created_at).toLocaleDateString("ar-SA")}{c.preferred_date ? ` · مفضّل: ${new Date(c.preferred_date).toLocaleDateString("ar-SA")}` : ""}</p>
                        </div>
                        <span className={`text-xs rounded-full px-2.5 py-1 font-medium flex-shrink-0 ${
                          c.status === "confirmed" ? "bg-green-100 text-green-700" :
                          c.status === "rejected"  ? "bg-red-100 text-red-600" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {c.status === "confirmed" ? "مؤكد" : c.status === "rejected" ? "مرفوض" : "قيد المراجعة"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── خصومات العضوية ── */}
          {activeTab === "discounts" && (
            <div className="space-y-4 max-w-3xl">
              <div className="bg-black text-white rounded-2xl p-6 mb-2">
                <p className="text-2xl mb-1">🎁</p>
                <h2 className="text-xl font-bold">خصومات العضوية</h2>
                <p className="text-gray-400 text-sm mt-1">استمتع بمزايا حصرية لأعضاء منصة أجني</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "خصم على الدورات التدريبية", desc: "احصل على خصم 20% على جميع الدورات المعتمدة عند التسجيل كعضو نشط", badge: "20%", color: "bg-blue-50 border-blue-100" },
                  { title: "جلسة استشارة مجانية", desc: "ساعة مجانية مع أحد مستشارينا المعتمدين لمناقشة خطتك التجارية", badge: "مجاني", color: "bg-green-50 border-green-100" },
                  { title: "تقرير تفصيلي موسّع", desc: "احصل على نسخة موسّعة من تقريرك مع توصيات مخصصة من الخبراء", badge: "حصري", color: "bg-purple-50 border-purple-100" },
                  { title: "الوصول لمكتبة الملازم", desc: "وصول غير محدود لجميع الملازم والمواد التدريبية المحدّثة", badge: "مفتوح", color: "bg-orange-50 border-orange-100" },
                ].map((item) => (
                  <div key={item.title} className={`rounded-2xl border p-5 ${item.color}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{item.title}</h3>
                      <span className="text-xs bg-black text-white rounded-full px-2.5 py-0.5 font-bold flex-shrink-0 mr-2">{item.badge}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 text-center">
                <p className="text-sm text-gray-500">للاستفسار عن العضوية المميزة</p>
                <a href="tel:41415555" className="inline-block mt-3 bg-black text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition">
                  📞 تواصل معنا
                </a>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
