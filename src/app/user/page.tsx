"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Tab = "profile" | "workshops" | "certificates" | "consultations";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

const surveyTypeLabel = (t: string) =>
  t === "explorers" ? "مستكشف" : t === "entrepreneurs" ? "رائد أعمال" : "صاحب شركة/مدير تنفيذي";

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("workshops");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);

  // Profile
  const [profile, setProfile] = useState({ firstName: "", lastName: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Workshops
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [workshopMaterials, setWorkshopMaterials] = useState<any[]>([]);
  const [quizCurrentDay, setQuizCurrentDay] = useState(0);
  const [surveyResults, setSurveyResults] = useState<any[]>([]);
  const [quizProgress, setQuizProgress] = useState<any>(null);

  // Evaluation
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [evaluationSubmitted, setEvaluationSubmitted] = useState(false);

  // Certificates
  const [certificates, setCertificates] = useState<any[]>([]);

  // Consultations
  const [consultations, setConsultations] = useState<any[]>([]);
  const [newConsult, setNewConsult] = useState({ subject: "", message: "" });
  const [consultSending, setConsultSending] = useState(false);
  const [consultMsg, setConsultMsg] = useState({ text: "", ok: true });
  const [showConsultForm, setShowConsultForm] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { router.replace("/auth/signin"); return; }

      const email = user.email?.toLowerCase() || "";
      if (ADMIN_EMAILS.includes(email)) { router.replace("/admin"); return; }

      const { data: trainer } = await supabase.from("trainers").select("status").ilike("email", email).maybeSingle();
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

      const [allWsRes, enrollRes, certsRes, resultsRes, quizRes, progressRes, consultRes, evalSettingsRes, evalSubmittedRes] = await Promise.all([
        supabase.from("workshops").select("id, name, description, category, duration, discount_percent, discount_code, created_at").order("created_at", { ascending: false }),
        supabase.from("workshop_enrollments").select("workshop_id").ilike("user_email", email),
        supabase.from("certificates").select("*").ilike("trainee_email", email).order("issued_at", { ascending: false }),
        supabase.from("survey_results").select("*").ilike("email", email).order("created_at", { ascending: false }),
        supabase.from("quiz_settings").select("current_day").eq("id", 1).maybeSingle(),
        supabase.from("quiz_progress").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("consultations").select("*").ilike("user_email", email).order("created_at", { ascending: false }),
        supabase.from("evaluation_settings").select("is_open").eq("id", 1).maybeSingle(),
        supabase.from("workshop_evaluations").select("id").eq("user_id", user.id).maybeSingle(),
      ]);

      if (allWsRes.data) setWorkshops(allWsRes.data);
      if (enrollRes.data) setEnrolledIds(new Set(enrollRes.data.map((r: any) => r.workshop_id).filter(Boolean)));
      if (certsRes.data) setCertificates(certsRes.data);
      if (resultsRes.data) setSurveyResults(resultsRes.data);
      if (quizRes.data) setQuizCurrentDay(quizRes.data.current_day);
      if (progressRes.data) setQuizProgress(progressRes.data);
      if (consultRes.data) setConsultations(consultRes.data);
      setEvaluationOpen(evalSettingsRes.data?.is_open ?? false);
      setEvaluationSubmitted(!!evalSubmittedRes.data);

      // Auto-open workshop if enrolled in exactly one
      const enrolledWorkshopIds = new Set((enrollRes.data || []).map((r: any) => r.workshop_id).filter(Boolean));
      if (enrolledWorkshopIds.size === 1 && allWsRes.data) {
        const ws = allWsRes.data.find((w: any) => enrolledWorkshopIds.has(w.id));
        if (ws) {
          const { data: mats } = await supabase.from("workshop_materials").select("*").eq("workshop_id", ws.id).order("created_at");
          setSelectedWorkshop(ws);
          setWorkshopMaterials(mats || []);
        }
      }

      setLoading(false);
    };
    init();
  }, []);

  const enrollInWorkshop = async (workshopId: string) => {
    if (!authUser) return;
    setEnrollingId(workshopId);
    const email = authUser.email?.toLowerCase() || "";
    const { error } = await supabase.from("workshop_enrollments").insert({ workshop_id: workshopId, user_email: email });
    if (!error) setEnrolledIds(prev => new Set([...prev, workshopId]));
    setEnrollingId(null);
  };

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

  const submitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConsult.subject.trim() || !newConsult.message.trim()) return;
    setConsultSending(true);
    const email = authUser?.email?.toLowerCase() || "";
    const name = `${profile.firstName} ${profile.lastName}`.trim() || email;
    const { data, error } = await supabase.from("consultations").insert({
      user_email: email,
      user_name: name,
      subject: newConsult.subject,
      message: newConsult.message,
      status: "pending",
    }).select().single();
    if (error) {
      setConsultMsg({ text: "حدث خطأ أثناء الإرسال", ok: false });
    } else {
      setConsultations(prev => [data, ...prev]);
      setNewConsult({ subject: "", message: "" });
      setShowConsultForm(false);
      setConsultMsg({ text: "تم إرسال استشارتك بنجاح ✓", ok: true });
    }
    setConsultSending(false);
    setTimeout(() => setConsultMsg({ text: "", ok: true }), 4000);
  };

  const navigateTo = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedWorkshop(null);
    setSidebarOpen(false);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "profile",       label: "الملف الشخصي", icon: "👤" },
    { key: "workshops",     label: "الدورات",       icon: "🎓" },
    { key: "certificates",  label: "الشهادات",     icon: "🏅" },
    { key: "consultations", label: "الاستشارات",   icon: "💬" },
  ];

  const name = profile.firstName || authUser?.email?.split("@")[0] || "";
  const activeTabObj = tabs.find(t => t.key === activeTab)!;

  const statusLabel = (s: string) =>
    s === "replied" ? { text: "تم الرد", cls: "bg-green-50 text-green-700" } :
    s === "closed"  ? { text: "مغلق",   cls: "bg-gray-100 text-gray-500" } :
                      { text: "قيد المراجعة", cls: "bg-yellow-50 text-yellow-700" };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 font-[Tajawal] lg:flex lg:h-screen lg:overflow-hidden">

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-black flex flex-col transition-transform duration-300
        lg:static lg:w-60 lg:translate-x-0 lg:flex-shrink-0
        ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-4 transition">
            <span>←</span><span>الصفحة الرئيسية</span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg mb-2">
            {name.charAt(0).toUpperCase()}
          </div>
          <p className="text-white font-bold text-sm leading-tight truncate">{profile.firstName} {profile.lastName}</p>
          <p className="text-gray-400 text-xs mt-0.5 truncate">{authUser?.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => navigateTo(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-right ${
                activeTab === tab.key ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}>
              <span className="flex-shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.key === "workshops" && enrolledIds.size > 0 && (
                <span className="mr-auto bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{enrolledIds.size}</span>
              )}
              {tab.key === "consultations" && consultations.filter(c => c.status === "replied").length > 0 && (
                <span className="mr-auto bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {consultations.filter(c => c.status === "replied").length}
                </span>
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

      {/* ── Main ── */}
      <main className="flex-1 lg:overflow-y-auto lg:h-full">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedWorkshop && (
              <button onClick={() => setSelectedWorkshop(null)} className="text-gray-400 hover:text-black text-sm ml-2">← رجوع</button>
            )}
            <h1 className="font-bold text-gray-900 text-sm lg:text-base">
              {selectedWorkshop ? `🎓 ${selectedWorkshop.name}` : `${activeTabObj.icon} ${activeTabObj.label}`}
            </h1>
          </div>
          {/* Hamburger — mobile only */}
          <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition" onClick={() => setSidebarOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="p-4 lg:p-8 pb-24 lg:pb-8">

          {/* ── الملف الشخصي ── */}
          {activeTab === "profile" && (
            <div className="max-w-xl">
              <form onSubmit={saveProfile} className="bg-white rounded-2xl border border-gray-200 p-5 lg:p-7 space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-black flex items-center justify-center text-white text-xl lg:text-2xl font-bold flex-shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-base lg:text-lg">{profile.firstName} {profile.lastName}</p>
                    <p className="text-sm text-gray-400">{authUser?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Survey results — inside profile */}
              {surveyResults.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-sm">📊 نتائج اختبر عملك</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {surveyResults.map((r, i) => (
                      <div key={r.id} className="px-5 py-3 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs flex-shrink-0">
                          {surveyResults.length - i}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{surveyTypeLabel(r.survey_type)}</p>
                          <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("ar-SA")}</p>
                        </div>
                        <div className="text-left flex-shrink-0">
                          <p className="font-bold text-base">{r.percentage}%</p>
                          <p className="text-xs text-gray-400">{r.total_score}/360</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── الدورات ── */}
          {activeTab === "workshops" && !selectedWorkshop && (
            <div className="space-y-4">
              {workshops.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-3">🎓</p>
                  <p className="font-bold text-gray-700 mb-1">لا توجد دورات متاحة حالياً</p>
                  <p className="text-gray-400 text-sm">ترقّب الدورات القادمة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {workshops.map((ws) => {
                    const enrolled = enrolledIds.has(ws.id);
                    const enrolling = enrollingId === ws.id;
                    return (
                      <div key={ws.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-lg flex-shrink-0">🎓</div>
                          {enrolled
                            ? <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">✓ مسجّل</span>
                            : ws.discount_percent
                              ? <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">خصم {ws.discount_percent}%</span>
                              : <span className="text-xs text-gray-400">{new Date(ws.created_at).toLocaleDateString("ar-SA")}</span>
                          }
                        </div>
                        <h3 className="font-bold text-base mb-1">{ws.name}</h3>
                        <div className="flex gap-1.5 mb-2 flex-wrap">
                          {ws.category && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{ws.category}</span>}
                          {ws.duration && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">⏱ {ws.duration}</span>}
                        </div>
                        {ws.description && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{ws.description}</p>}
                        {ws.discount_code && !enrolled && (
                          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-1.5 flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-400">كود الخصم</span>
                            <span className="font-mono font-bold text-xs text-black tracking-widest" dir="ltr">{ws.discount_code}</span>
                          </div>
                        )}
                        <div className="mt-auto pt-3">
                          {enrolled ? (
                            <button onClick={() => openWorkshop(ws)}
                              className="w-full bg-black text-white text-xs font-bold py-2.5 rounded-xl hover:bg-gray-800 transition">
                              فتح الدورة ←
                            </button>
                          ) : (
                            <button onClick={() => enrollInWorkshop(ws.id)} disabled={enrolling}
                              className="w-full bg-black text-white text-xs font-bold py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition">
                              {enrolling ? "جاري التسجيل..." : "التسجيل في الدورة"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── داخل الدورة ── */}
          {activeTab === "workshops" && selectedWorkshop && (
            <div className="space-y-5 max-w-3xl">

              {/* Materials */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 lg:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-sm lg:text-base">📎 ملازم الدورة</h2>
                  <span className="text-xs text-gray-400">{workshopMaterials.length} ملف</span>
                </div>
                {workshopMaterials.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-10">لا توجد ملازم متاحة بعد</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {workshopMaterials.map((m) => {
                      const typeIcon = m.content_type === "quiz" ? "📝" : m.content_type === "video" ? "🎬" : m.content_type === "link" ? "🔗" : "📄";
                      const typeBg   = m.content_type === "quiz" ? "bg-purple-100" : m.content_type === "video" ? "bg-blue-100" : m.content_type === "link" ? "bg-gray-100" : "bg-orange-100";
                      const action   = m.content_type === "quiz" ? "ابدأ ←" : m.content_type === "video" ? "مشاهدة ▶" : m.content_type === "link" ? "فتح ←" : "تنزيل ↓";
                      return (
                        <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 lg:gap-4 px-5 lg:px-6 py-3 lg:py-4 hover:bg-gray-50 transition group">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${typeBg}`}>{typeIcon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{m.name}</p>
                          </div>
                          <span className="text-xs text-blue-600 group-hover:underline flex-shrink-0">{action}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Daily quizzes + results */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 lg:px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-sm lg:text-base">📅 الاختبارات اليومية</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {quizCurrentDay === 0 ? "لم يُفتح أي اختبار بعد" : `مفتوح حتى اليوم ${quizCurrentDay}`}
                  </p>
                </div>
                <div className="p-5 lg:p-6">
                  {quizCurrentDay === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-3xl mb-3">🔒</p>
                      <p className="text-gray-500 text-sm">الاختبارات اليومية ستُفتح قريباً من قِبل الإدارة</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((day) => {
                        const unlocked = day <= quizCurrentDay;
                        const done = quizProgress?.submitted?.[day - 1] === true;
                        return (
                          <div key={day} className={`flex flex-col items-center rounded-xl py-3 border gap-2 ${
                            done ? "bg-green-50 border-green-200" :
                            unlocked ? "bg-yellow-50 border-yellow-200" :
                            "bg-gray-50 border-gray-100 opacity-50"
                          }`}>
                            <span className="text-xl">{done ? "✅" : unlocked ? "🟡" : "🔒"}</span>
                            <p className="text-xs font-bold text-gray-700">يوم {day}</p>
                            {done && <span className="text-xs text-green-600 font-medium">مكتمل</span>}
                            {unlocked && !done && (
                              <Link href="/quiz" className="text-xs bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition font-medium">
                                ابدأ
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Project evaluation card */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 lg:px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-sm lg:text-base">🗂️ تقييم المشاريع</h2>
                  <p className="text-xs text-gray-400 mt-0.5">قدّم مشروعك وقيّم مشاريع زملائك</p>
                </div>
                <div className="p-5 lg:p-6 flex flex-col items-center gap-3 py-4">
                  <p className="text-gray-600 text-sm text-center">يمكنك رفع مشروعك وتقييم مشاريع المشاركين الآخرين.</p>
                  <Link href="/projects"
                    className="bg-black text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-gray-800 transition">
                    فتح تقييم المشاريع ←
                  </Link>
                </div>
              </div>

              {/* Workshop evaluation card */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 lg:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-sm lg:text-base">📝 تقييم الورشة</h2>
                    <p className="text-xs text-gray-400 mt-0.5">قيّم تجربتك في نهاية الورشة</p>
                  </div>
                  {evaluationSubmitted && (
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">تم التقييم ✓</span>
                  )}
                </div>
                <div className="p-5 lg:p-6">
                  {evaluationSubmitted ? (
                    <div className="text-center py-4">
                      <p className="text-3xl mb-2">✅</p>
                      <p className="text-gray-500 text-sm">شكراً على تقييمك! تم استلامه بنجاح.</p>
                    </div>
                  ) : !evaluationOpen ? (
                    <div className="text-center py-4">
                      <p className="text-3xl mb-2">🔒</p>
                      <p className="text-gray-500 text-sm">التقييم مقفل حالياً — سيُفتح من قِبل الإدارة في نهاية الورشة</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <p className="text-gray-600 text-sm text-center">التقييم متاح الآن! شاركنا رأيك في الورشة.</p>
                      <Link href="/evaluation"
                        className="bg-black text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-gray-800 transition">
                        ابدأ التقييم ←
                      </Link>
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
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
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

          {/* ── الاستشارات ── */}
          {activeTab === "consultations" && (
            <div className="max-w-2xl space-y-4">

              {/* Message */}
              {consultMsg.text && (
                <div className={`rounded-xl px-4 py-3 text-sm font-medium ${consultMsg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {consultMsg.text}
                </div>
              )}

              {/* New consultation button / form */}
              {!showConsultForm ? (
                <button onClick={() => setShowConsultForm(true)}
                  className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition text-sm">
                  + إرسال استشارة جديدة
                </button>
              ) : (
                <form onSubmit={submitConsultation} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm">استشارة جديدة</h3>
                    <button type="button" onClick={() => setShowConsultForm(false)} className="text-gray-400 hover:text-black text-lg leading-none">×</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">الموضوع *</label>
                    <input type="text" value={newConsult.subject} required
                      onChange={(e) => setNewConsult(p => ({ ...p, subject: e.target.value }))}
                      placeholder="موضوع الاستشارة"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">رسالتك *</label>
                    <textarea value={newConsult.message} required rows={4}
                      onChange={(e) => setNewConsult(p => ({ ...p, message: e.target.value }))}
                      placeholder="اكتب استشارتك أو سؤالك بالتفصيل..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={consultSending}
                      className="flex-1 bg-black text-white text-sm font-bold py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition">
                      {consultSending ? "جاري الإرسال..." : "إرسال الاستشارة"}
                    </button>
                    <button type="button" onClick={() => setShowConsultForm(false)}
                      className="px-5 border border-gray-300 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
                      إلغاء
                    </button>
                  </div>
                </form>
              )}

              {/* Consultations list */}
              {consultations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-3">💬</p>
                  <p className="font-bold text-gray-700 mb-1">لم ترسل أي استشارة بعد</p>
                  <p className="text-gray-400 text-sm">يمكنك إرسال استشارتك وسيرد عليك الفريق</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {consultations.map((c) => {
                    const st = statusLabel(c.status);
                    return (
                      <div key={c.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm mb-1">{c.subject}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{c.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(c.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</p>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${st.cls}`}>{st.text}</span>
                        </div>
                        {c.admin_reply && (
                          <div className="mx-4 mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                            <p className="text-xs font-bold text-blue-700 mb-1">رد الإدارة</p>
                            <p className="text-sm text-blue-800 leading-relaxed">{c.admin_reply}</p>
                            {c.replied_at && <p className="text-xs text-blue-500 mt-1">{new Date(c.replied_at).toLocaleDateString("ar-SA")}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 flex lg:hidden">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => navigateTo(tab.key)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition ${activeTab === tab.key ? "text-black" : "text-gray-400"}`}>
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className="text-[10px] font-medium leading-none">{tab.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
