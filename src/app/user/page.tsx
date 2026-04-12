"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Tab = "profile" | "workshops" | "certificates" | "results" | "discounts";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

const surveyTypeLabel = (t: string) =>
  t === "explorers" ? "مستكشف" : t === "entrepreneurs" ? "رائد أعمال" : "صاحب شركة/مدير تنفيذي";

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);

  // Profile
  const [profile, setProfile] = useState({ firstName: "", lastName: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Workshops
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [workshopMaterials, setWorkshopMaterials] = useState<any[]>([]);
  const [quizCurrentDay, setQuizCurrentDay] = useState(0);

  // Certificates
  const [certificates, setCertificates] = useState<any[]>([]);

  // Results
  const [surveyResults, setSurveyResults] = useState<any[]>([]);
  const [quizProgress, setQuizProgress] = useState<any>(null);

  // Discounts
  const [discounts, setDiscounts] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { router.replace("/auth/signin"); return; }

      const email = user.email?.toLowerCase() || "";
      if (ADMIN_EMAILS.includes(email)) { router.replace("/quiz/admin"); return; }

      const { data: trainer } = await supabase.from("trainers").select("status").ilike("email", email).single();
      if (trainer?.status === "active") { router.replace("/trainer"); return; }

      setAuthUser(user);
      const meta = user.user_metadata || {};
      const fullName = meta.full_name || "";
      const parts = fullName.split(" ");
      setProfile({
        firstName: meta.first_name || parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        phone: meta.phone || "",
      });

      const [wsRes, certsRes, resultsRes, quizRes, progressRes, discountsRes] = await Promise.all([
        supabase.from("workshop_enrollments").select("workshop_id, workshops(id, name, description, created_at)").ilike("user_email", email),
        supabase.from("certificates").select("*").ilike("trainee_email", email).order("issued_at", { ascending: false }),
        supabase.from("survey_results").select("*").ilike("email", email).order("created_at", { ascending: false }),
        supabase.from("quiz_settings").select("current_day").eq("id", 1).single(),
        supabase.from("quiz_progress").select("*").eq("user_id", user.id).single(),
        supabase.from("discounts").select("*").order("created_at", { ascending: false }),
      ]);

      if (wsRes.data) setWorkshops(wsRes.data.map((r: any) => r.workshops).filter(Boolean));
      if (certsRes.data) setCertificates(certsRes.data);
      if (resultsRes.data) setSurveyResults(resultsRes.data);
      if (quizRes.data) setQuizCurrentDay(quizRes.data.current_day);
      if (progressRes.data) setQuizProgress(progressRes.data);
      if (discountsRes.data) setDiscounts(discountsRes.data);
      setLoading(false);
    };
    init();
  }, []);

  const openWorkshop = async (workshop: any) => {
    setSelectedWorkshop(workshop);
    const { data } = await supabase.from("workshop_materials").select("*").eq("workshop_id", workshop.id).order("created_at");
    setWorkshopMaterials(data || []);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, first_name: profile.firstName, phone: profile.phone },
    });
    setProfileMsg(error ? "حدث خطأ أثناء الحفظ" : "تم حفظ التغييرات ✓");
    setProfileSaving(false);
    setTimeout(() => setProfileMsg(""), 3000);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "profile",      label: "الملف الشخصي",  icon: "👤" },
    { key: "workshops",    label: "الدورات",         icon: "🎓" },
    { key: "certificates", label: "الشهادات",       icon: "🏅" },
    { key: "results",      label: "النتائج",        icon: "📈" },
    { key: "discounts",    label: "الخصومات",       icon: "🎁" },
  ];

  const name = profile.firstName || authUser?.email?.split("@")[0] || "";
  const activeTabObj = tabs.find(t => t.key === activeTab)!;

  return (
    <div dir="rtl" className="h-screen overflow-hidden bg-gray-100 font-[Tajawal] flex">

      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-black flex flex-col h-full overflow-y-auto">
        {/* Brand + home link */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-4 transition">
            <span>←</span>
            <span>الصفحة الرئيسية</span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg mb-2">
            {name.charAt(0).toUpperCase()}
          </div>
          <p className="text-white font-bold text-sm leading-tight truncate">{profile.firstName} {profile.lastName}</p>
          <p className="text-gray-400 text-xs mt-0.5 truncate">{authUser?.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedWorkshop(null); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-right ${
                activeTab === tab.key ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}>
              <span className="flex-shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.key === "workshops" && workshops.length > 0 && (
                <span className="mr-auto bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{workshops.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <span>🚪</span><span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-full">
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedWorkshop && (
              <button onClick={() => setSelectedWorkshop(null)} className="text-gray-400 hover:text-black text-sm ml-2">← رجوع</button>
            )}
            <h1 className="font-bold text-gray-900">
              {selectedWorkshop ? `🎓 ${selectedWorkshop.name}` : `${activeTabObj.icon} ${activeTabObj.label}`}
            </h1>
          </div>
        </div>

        <div className="p-8">

          {/* ── الملف الشخصي ── */}
          {activeTab === "profile" && (
            <div className="max-w-xl">
              <form onSubmit={saveProfile} className="bg-white rounded-2xl border border-gray-200 p-7 space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{profile.firstName} {profile.lastName}</p>
                    <p className="text-sm text-gray-400">{authUser?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">الاسم الأول</label>
                    <input type="text" value={profile.firstName}
                      onChange={(e) => setProfile(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">الاسم الأخير</label>
                    <input type="text" value={profile.lastName}
                      onChange={(e) => setProfile(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">البريد الإلكتروني</label>
                  <input type="email" value={authUser?.email} disabled
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">رقم الهاتف</label>
                  <input type="text" value={profile.phone} dir="ltr"
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+974 XXXX XXXX"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button type="submit" disabled={profileSaving}
                    className="bg-black text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition">
                    {profileSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </button>
                  {profileMsg && <p className={`text-sm font-medium ${profileMsg.includes("خطأ") ? "text-red-500" : "text-green-600"}`}>{profileMsg}</p>}
                </div>
              </form>
            </div>
          )}

          {/* ── الورش ── */}
          {activeTab === "workshops" && !selectedWorkshop && (
            <div className="space-y-4">
              {workshops.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
                  <p className="text-4xl mb-3">🎓</p>
                  <p className="font-bold text-gray-700 mb-1">لم تُضف إلى أي دورة بعد</p>
                  <p className="text-gray-400 text-sm">سيتم إضافتك من قِبل الإدارة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workshops.map((ws) => (
                    <button key={ws.id} onClick={() => openWorkshop(ws)}
                      className="bg-white rounded-2xl border border-gray-200 p-6 text-right hover:shadow-md hover:border-black/20 transition group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-lg flex-shrink-0">🎓</div>
                        <span className="text-xs text-gray-400">{new Date(ws.created_at).toLocaleDateString("ar-SA")}</span>
                      </div>
                      <h3 className="font-bold text-base mb-1">{ws.name}</h3>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {ws.category && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{ws.category}</span>}
                        {ws.duration && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">⏱ {ws.duration}</span>}
                      </div>
                      {ws.description && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{ws.description}</p>}
                      <p className="text-xs text-primary mt-3 group-hover:underline">فتح الدورة ←</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── داخل الورشة ── */}
          {activeTab === "workshops" && selectedWorkshop && (
            <div className="space-y-5 max-w-3xl">

              {/* Materials */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold">📎 ملازم الورشة</h2>
                  <span className="text-xs text-gray-400">{workshopMaterials.length} ملف</span>
                </div>
                {workshopMaterials.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-10">لا توجد ملازم متاحة بعد</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {workshopMaterials.map((m) => {
                      const typeIcon = m.content_type === "quiz" ? "📝" : m.content_type === "video" ? "🎬" : m.content_type === "link" ? "🔗" : "📄";
                      const typeBg = m.content_type === "quiz" ? "bg-purple-100" : m.content_type === "video" ? "bg-blue-100" : m.content_type === "link" ? "bg-gray-100" : "bg-orange-100";
                      const actionLabel = m.content_type === "quiz" ? "ابدأ ←" : m.content_type === "video" ? "مشاهدة ▶" : m.content_type === "link" ? "فتح ←" : "تنزيل ↓";
                      return (
                        <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${typeBg}`}>{typeIcon}</div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{m.name}</p>
                          </div>
                          <span className="text-xs text-blue-600 group-hover:underline flex-shrink-0">{actionLabel}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Daily quizzes */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold">📅 الاختبارات اليومية</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {quizCurrentDay === 0 ? "لم يُفتح أي اختبار بعد" : `مفتوح حتى اليوم ${quizCurrentDay}`}
                  </p>
                </div>
                <div className="p-6">
                  {quizCurrentDay === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-3xl mb-3">🔒</p>
                      <p className="text-gray-500 text-sm">الاختبارات اليومية ستُفتح قريباً من قِبل الإدارة</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((day) => {
                        const unlocked = day <= quizCurrentDay;
                        const done = quizProgress?.submitted?.[day - 1] === true;
                        return (
                          <div key={day} className={`flex items-center justify-between rounded-xl px-4 py-3 border ${unlocked ? "border-black/10 bg-gray-50" : "border-gray-100 opacity-50"}`}>
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{done ? "✅" : unlocked ? "🟡" : "🔒"}</span>
                              <div>
                                <span className="font-medium text-sm">اليوم {day}</span>
                                {done && <span className="text-xs text-green-600 mr-2">مكتمل</span>}
                              </div>
                            </div>
                            {unlocked ? (
                              <Link href="/quiz" className="text-xs bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition font-medium">
                                {done ? "إعادة" : "ابدأ"}
                              </Link>
                            ) : (
                              <span className="text-xs text-gray-400">مقفل</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ── الشهادات ── */}
          {activeTab === "certificates" && (
            <div className="space-y-4">
              {certificates.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
                  <p className="text-4xl mb-3">🏅</p>
                  <p className="font-bold text-gray-700 mb-1">لا توجد شهادات بعد</p>
                  <p className="text-gray-400 text-sm">ستظهر شهاداتك هنا بعد إتمام الدورات المعتمدة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-md transition">
                      <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl">🏅</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{cert.trainee_name}</h3>
                      <p className="text-xs text-gray-400 mb-3">بإشراف: {cert.trainer_name}</p>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">تاريخ الإصدار</p>
                        <p className="text-sm font-bold mt-0.5">{new Date(cert.issued_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── النتائج ── */}
          {activeTab === "results" && (
            <div className="space-y-8 max-w-3xl">

              {/* اختبر عملك — Main assessment */}
              <div>
                <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm flex-shrink-0">📊</span>
                  نتائج اختبر عملك
                </h2>
                {surveyResults.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                    <p className="text-3xl mb-2">📊</p>
                    <p className="font-bold text-gray-700 mb-1">لم تُجرِ اختبار قياس الجاهزية بعد</p>
                    <p className="text-gray-400 text-sm">يمكنك الوصول للاختبار من القائمة الرئيسية</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {surveyResults.map((r, i) => (
                      <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="flex items-center gap-5 flex-wrap">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 flex-shrink-0">
                            {surveyResults.length - i}
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
                            <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${r.percentage}%` }} />
                            </div>
                          </div>
                          <Link href="/report" className="text-xs text-primary hover:underline font-medium flex-shrink-0">
                            التقرير ←
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Daily quiz results — per workshop */}
              <div>
                <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm flex-shrink-0">📅</span>
                  نتائج الاختبارات اليومية
                </h2>
                {workshops.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                    <p className="text-3xl mb-2">📅</p>
                    <p className="font-bold text-gray-700 mb-1">لم تُضف إلى أي دورة بعد</p>
                    <p className="text-gray-400 text-sm">ستظهر نتائج اختباراتك اليومية هنا</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workshops.map((ws) => {
                      const doneCount = (quizProgress?.submitted as boolean[] | null)?.filter(Boolean).length ?? 0;
                      return (
                        <div key={ws.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-bold">{ws.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">الاختبارات اليومية للدورة</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold">{doneCount}<span className="text-base text-gray-400 font-normal">/5</span></p>
                              <p className="text-xs text-gray-400">أيام مكتملة</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3, 4].map((i) => {
                              const done = quizProgress?.submitted?.[i] === true;
                              const unlocked = (i + 1) <= quizCurrentDay;
                              return (
                                <div key={i} className={`flex-1 rounded-xl py-2 text-center text-xs font-bold border ${
                                  done ? "bg-green-50 border-green-200 text-green-700" :
                                  unlocked ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
                                  "bg-gray-50 border-gray-100 text-gray-300"
                                }`}>
                                  <p className="text-base mb-0.5">{done ? "✅" : unlocked ? "🟡" : "🔒"}</p>
                                  <p>يوم {i + 1}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── الخصومات ── */}
          {activeTab === "discounts" && (
            <div className="space-y-4 max-w-3xl">
              {discounts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
                  <p className="text-4xl mb-3">🎁</p>
                  <p className="font-bold text-gray-700 mb-1">لا توجد خصومات متاحة حالياً</p>
                  <p className="text-gray-400 text-sm">ترقّب العروض والخصومات الحصرية من الإدارة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {discounts.map((d) => (
                    <div key={d.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-lg flex-shrink-0">🎁</div>
                        {d.discount_percent && (
                          <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                            خصم {d.discount_percent}%
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base mb-1">{d.title}</h3>
                      {d.description && <p className="text-gray-500 text-sm leading-relaxed mb-3">{d.description}</p>}
                      {d.code && (
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-2.5 flex items-center justify-between">
                          <span className="text-xs text-gray-400">كود الخصم</span>
                          <span className="font-mono font-bold text-sm text-black tracking-widest" dir="ltr">{d.code}</span>
                        </div>
                      )}
                      {d.expires_at && (
                        <p className="text-xs text-gray-400 mt-2">
                          صالح حتى: {new Date(d.expires_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
