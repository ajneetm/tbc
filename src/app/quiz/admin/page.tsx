"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

type Tab = "overview" | "users" | "surveys" | "quiz-control" | "programs" | "trainers";

const surveyTypeLabel = (t: string) =>
  t === "explorers" ? "مستكشف" : t === "entrepreneurs" ? "رائد أعمال" : "صاحب شركة/مدير تنفيذي";

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Data
  const [siteUsers, setSiteUsers] = useState<any[]>([]);
  const [surveyResults, setSurveyResults] = useState<any[]>([]);
  const [quizProgress, setQuizProgress] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Quiz day control
  const [quizCurrentDay, setQuizCurrentDay] = useState(1);
  const [dayLoading, setDayLoading] = useState(false);
  const [dayMessage, setDayMessage] = useState("");

  // User management
  const [newUser, setNewUser] = useState({ email: "", password: "", name: "", phone: "" });
  const [userLoading, setUserLoading] = useState(false);
  const [userMessage, setUserMessage] = useState({ text: "", ok: true });
  const [showAddUser, setShowAddUser] = useState(false);
  const [impersonating, setImpersonating] = useState<string | null>(null);

  // Programs
  const [newProgram, setNewProgram] = useState({ name: "", description: "", category: "", duration: "", material_url: "" });
  const [programLoading, setProgramLoading] = useState(false);
  const [showAddProgram, setShowAddProgram] = useState(false);

  // Trainers
  const [newTrainer, setNewTrainer] = useState({ name: "", email: "", phone: "", specialty: "", bio: "" });
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [showAddTrainer, setShowAddTrainer] = useState(false);

  // ── Auth check ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const email = session?.user?.email?.toLowerCase() || "";
      if (ADMIN_EMAILS.includes(email)) {
        setAuthed(true);
      } else {
        router.replace("/auth/signin");
      }
      setAuthLoading(false);
    });
  }, []);

  const fetchAll = async () => {
    setLoadingData(true);
    const [usersRes, surveysRes, progressRes, settingsRes, programsRes, trainersRes] = await Promise.all([
      fetch("/api/admin/users").then((r) => r.json()).catch(() => ({ users: [] })),
      supabase.from("survey_results").select("*").order("created_at", { ascending: false }),
      supabase.from("quiz_progress").select("*").order("updated_at", { ascending: false }),
      supabase.from("quiz_settings").select("current_day").eq("id", 1).single(),
      supabase.from("programs").select("*").order("created_at", { ascending: false }),
      supabase.from("trainers").select("*").order("created_at", { ascending: false }),
    ]);
    if (usersRes.users) setSiteUsers(usersRes.users);
    if (surveysRes.data) setSurveyResults(surveysRes.data);
    if (progressRes.data) setQuizProgress(progressRes.data);
    if (settingsRes.data) setQuizCurrentDay(settingsRes.data.current_day);
    if (programsRes.data) setPrograms(programsRes.data);
    if (trainersRes.data) setTrainers(trainersRes.data);
    setLoadingData(false);
  };

  useEffect(() => { if (authed) fetchAll(); }, [authed]);

  // ── Quiz day ──
  const setQuizDay = async (day: number) => {
    setDayLoading(true);
    const { error } = await supabase.from("quiz_settings").update({ current_day: day, updated_at: new Date().toISOString() }).eq("id", 1);
    if (!error) { setQuizCurrentDay(day); setDayMessage(`تم فتح اليوم ${day} ✓`); }
    else setDayMessage("حدث خطأ");
    setDayLoading(false);
    setTimeout(() => setDayMessage(""), 3000);
  };

  // ── Users ──
  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);
    const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUser) });
    const data = await res.json();
    if (res.ok) { setUserMessage({ text: "تم إنشاء الحساب ✓", ok: true }); setNewUser({ email: "", password: "", name: "", phone: "" }); setShowAddUser(false); fetchAll(); }
    else setUserMessage({ text: data.error || "حدث خطأ", ok: false });
    setUserLoading(false);
    setTimeout(() => setUserMessage({ text: "", ok: true }), 4000);
  };

  const deleteUser = async (id: string, email: string) => {
    if (!confirm(`هل أنت متأكد من حذف ${email}؟`)) return;
    const res = await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) fetchAll(); else alert("فشل الحذف");
  };

  const impersonateUser = async (email: string) => {
    setImpersonating(email);
    const res = await fetch("/api/admin/impersonate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await res.json();
    setImpersonating(null);
    if (data.link) window.open(data.link, "_blank");
    else alert("فشل إنشاء الرابط");
  };

  // ── Programs ──
  const addProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setProgramLoading(true);
    await supabase.from("programs").insert(newProgram);
    setNewProgram({ name: "", description: "", category: "", duration: "", material_url: "" });
    setShowAddProgram(false);
    setProgramLoading(false);
    fetchAll();
  };

  const deleteProgram = async (id: string) => {
    if (!confirm("حذف البرنامج؟")) return;
    await supabase.from("programs").delete().eq("id", id);
    fetchAll();
  };

  const toggleProgramStatus = async (id: string, status: string) => {
    await supabase.from("programs").update({ status: status === "active" ? "inactive" : "active" }).eq("id", id);
    fetchAll();
  };

  // ── Trainers ──
  const addTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrainerLoading(true);
    await supabase.from("trainers").insert(newTrainer);
    setNewTrainer({ name: "", email: "", phone: "", specialty: "", bio: "" });
    setShowAddTrainer(false);
    setTrainerLoading(false);
    fetchAll();
  };

  const deleteTrainer = async (id: string) => {
    if (!confirm("حذف المدرب؟")) return;
    await supabase.from("trainers").delete().eq("id", id);
    fetchAll();
  };

  const toggleTrainerStatus = async (id: string, status: string) => {
    await supabase.from("trainers").update({ status: status === "active" ? "inactive" : "active" }).eq("id", id);
    fetchAll();
  };

  const approveTrainer = async (id: string) => {
    await supabase.from("trainers").update({ status: "active" }).eq("id", id);
    fetchAll();
  };

  const rejectTrainer = async (id: string) => {
    if (!confirm("رفض ومسح طلب المدرب؟")) return;
    await supabase.from("trainers").delete().eq("id", id);
    fetchAll();
  };

  // ── Excel ──
  const exportExcel = async () => {
    if (!surveyResults.length) { alert("لا توجد نتائج"); return; }
    const usersSheet = surveyResults.map((r) => ({
      "الاسم": r.name || "", "الإيميل": r.email || "", "الهاتف": r.phone || "",
      "نوع الاختبار": surveyTypeLabel(r.survey_type),
      "اللغة": r.language === "ar" ? "عربي" : "إنجليزي",
      "النتيجة": r.total_score || 0, "النسبة %": r.percentage || 0,
      "التاريخ": new Date(r.created_at).toLocaleDateString("ar-SA"),
    }));
    const answersSheet: any[] = [];
    surveyResults.forEach((r) => {
      (r.answers || []).forEach((a: any, i: number) => {
        answersSheet.push({ "الإيميل": r.email, "الاسم": r.name, "رقم السؤال": i + 1, "السؤال": a.question, "الدرجة": a.score, "المحور": a.modalId, "التاريخ": new Date(r.created_at).toLocaleDateString("ar-SA") });
      });
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(usersSheet), "نتائج المشاركين");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(answersSheet), "تفاصيل الإجابات");
    XLSX.writeFile(wb, `ajnee-results-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const byType = surveyResults.reduce((acc: any, r) => { acc[r.survey_type] = (acc[r.survey_type] || 0) + 1; return acc; }, {});

  const trainerEmails = new Set(trainers.map((t) => t.email?.toLowerCase()));
  const adminCount = siteUsers.filter((u) => ADMIN_EMAILS.includes(u.email?.toLowerCase())).length;
  const trainerCount = siteUsers.filter((u) => !ADMIN_EMAILS.includes(u.email?.toLowerCase()) && trainerEmails.has(u.email?.toLowerCase())).length;
  const regularCount = siteUsers.filter((u) => !ADMIN_EMAILS.includes(u.email?.toLowerCase()) && !trainerEmails.has(u.email?.toLowerCase())).length;

  // ── Auth screen ──
  if (authLoading || !authed) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
    </div>
  );

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview",     label: "نظرة عامة",       icon: "📊" },
    { key: "surveys",      label: "الاختبارات",       icon: "📋" },
    { key: "users",        label: "المستخدمون",       icon: "👥" },
    { key: "programs",     label: "الدورات المتاحة",  icon: "🎓" },
    { key: "trainers",     label: "المدربون",         icon: "🧑‍💼" },
    { key: "quiz-control", label: "الاختبار اليومي",  icon: "📅" },
  ];

  const activeTabObj = tabs.find(t => t.key === activeTab)!;

  return (
    <div dir="rtl" className="h-screen overflow-hidden bg-gray-100 font-[Tajawal] flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-black flex flex-col h-full overflow-y-auto">

        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-white font-bold text-sm leading-tight">لوحة تحكم المدير</p>
          <p className="text-gray-400 text-xs mt-1">أجني لدعم الأعمال</p>
        </div>

        {/* Nav */}
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

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <button
            onClick={exportExcel}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-green-400 hover:bg-white/10 hover:text-green-300 transition-all"
          >
            <span>⬇</span>
            <span>تصدير Excel</span>
          </button>
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

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <h1 className="font-bold text-gray-900">{activeTabObj.icon} {activeTabObj.label}</h1>
          {loadingData && <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />}
        </div>

      <div className="p-8">

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "إجمالي المستخدمين", value: siteUsers.length, color: "bg-blue-50 text-blue-700", icon: "👥" },
                { label: "إدارة", value: adminCount, color: "bg-red-50 text-red-700", icon: "🔑" },
                { label: "مدربون", value: trainerCount, color: "bg-purple-50 text-purple-700", icon: "🧑‍💼" },
                { label: "متدربون", value: regularCount, color: "bg-green-50 text-green-700", icon: "🎓" },
                { label: "إجمالي الاختبارات", value: surveyResults.length, color: "bg-indigo-50 text-indigo-700", icon: "📋" },
                { label: "اليوم المفتوح", value: `يوم ${quizCurrentDay}`, color: "bg-orange-50 text-orange-700", icon: "📅" },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl p-4 ${stat.color} border border-current/10`}>
                  <p className="text-xl mb-1">{stat.icon}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs mt-1 opacity-70 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Survey type breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-bold mb-4">توزيع الاختبارات حسب النوع</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { key: "explorers", label: "مستكشفون", color: "bg-blue-100 text-blue-800" },
                  { key: "entrepreneurs", label: "رواد أعمال", color: "bg-green-100 text-green-800" },
                  { key: "companies", label: "أصحاب شركات", color: "bg-purple-100 text-purple-800" },
                ].map((type) => (
                  <div key={type.key} className={`rounded-lg p-4 ${type.color}`}>
                    <p className="text-3xl font-bold">{byType[type.key] || 0}</p>
                    <p className="text-sm mt-1">{type.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest results */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100"><h2 className="font-bold">آخر الاختبارات</h2></div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="px-4 py-2 text-right">الاسم</th>
                    <th className="px-4 py-2 text-right">النوع</th>
                    <th className="px-4 py-2 text-right">النتيجة</th>
                    <th className="px-4 py-2 text-right">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {surveyResults.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{r.name || r.email}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{surveyTypeLabel(r.survey_type)}</span></td>
                      <td className="px-4 py-3 font-bold text-primary">{r.total_score}/360</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(r.created_at).toLocaleDateString("ar-SA")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Surveys ── */}
        {activeTab === "surveys" && (
          <div className="space-y-4">
            {selectedSurvey ? (
              <div>
                <button onClick={() => setSelectedSurvey(null)} className="mb-4 text-sm text-gray-500 hover:text-black flex items-center gap-1">← رجوع</button>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-bold text-lg mb-4">{selectedSurvey.name || selectedSurvey.email}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "الإيميل", value: selectedSurvey.email },
                      { label: "الهاتف", value: selectedSurvey.phone || "—" },
                      { label: "نوع الاختبار", value: surveyTypeLabel(selectedSurvey.survey_type) },
                      { label: "النتيجة", value: `${selectedSurvey.total_score}/360` },
                      { label: "النسبة", value: `${selectedSurvey.percentage}%` },
                      { label: "التاريخ", value: new Date(selectedSurvey.created_at).toLocaleDateString("ar-SA") },
                    ].map((item) => (
                      <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="font-medium text-sm mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <h3 className="font-bold mb-3">الإجابات التفصيلية</h3>
                  <div className="space-y-2">
                    {(selectedSurvey.answers || []).map((a: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 text-sm">
                        <span className="text-gray-600 flex-1">{i + 1}. {a.question}</span>
                        <span className="font-bold text-primary ml-4">{a.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold">جميع نتائج الاختبارات ({surveyResults.length})</h2>
                </div>
                {surveyResults.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">لا توجد نتائج بعد</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs">
                      <tr>
                        <th className="px-4 py-2 text-right">الاسم</th>
                        <th className="px-4 py-2 text-right">الإيميل</th>
                        <th className="px-4 py-2 text-right">النوع</th>
                        <th className="px-4 py-2 text-right">النتيجة</th>
                        <th className="px-4 py-2 text-right">%</th>
                        <th className="px-4 py-2 text-right">التاريخ</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {surveyResults.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{r.name || "—"}</td>
                          <td className="px-4 py-3 text-gray-500" dir="ltr">{r.email}</td>
                          <td className="px-4 py-3"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{surveyTypeLabel(r.survey_type)}</span></td>
                          <td className="px-4 py-3 font-bold">{r.total_score}/360</td>
                          <td className="px-4 py-3 text-primary font-bold">{r.percentage}%</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString("ar-SA")}</td>
                          <td className="px-4 py-3"><button onClick={() => setSelectedSurvey(r)} className="text-xs text-primary hover:underline">تفاصيل</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Users ── */}
        {activeTab === "users" && (
          <div className="space-y-5">
            {/* Add user */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">إضافة مستخدم جديد</h2>
                <button onClick={() => setShowAddUser(v => !v)} className="text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">
                  {showAddUser ? "إغلاق" : "+ إضافة"}
                </button>
              </div>
              {showAddUser && (
                <form onSubmit={addUser} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "email", placeholder: "الإيميل *", type: "email", dir: "ltr", required: true },
                    { key: "password", placeholder: "كلمة المرور *", type: "password", dir: "ltr", required: true },
                    { key: "name", placeholder: "الاسم الكامل", type: "text", dir: "rtl", required: false },
                    { key: "phone", placeholder: "رقم الهاتف", type: "text", dir: "ltr", required: false },
                  ].map((f) => (
                    <input key={f.key} type={f.type} required={f.required} placeholder={f.placeholder} dir={f.dir}
                      value={(newUser as any)[f.key]}
                      onChange={(e) => setNewUser(p => ({ ...p, [f.key]: e.target.value }))}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  ))}
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button type="submit" disabled={userLoading} className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                      {userLoading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                    </button>
                    {userMessage.text && <p className={`text-sm font-medium ${userMessage.ok ? "text-green-700" : "text-red-600"}`}>{userMessage.text}</p>}
                  </div>
                </form>
              )}
            </div>

            {/* Users list */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold">جميع المستخدمين ({siteUsers.length})</h2>
              </div>
              {loadingData ? (
                <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-4 border-black border-t-transparent" /></div>
              ) : siteUsers.length === 0 ? (
                <p className="text-center text-gray-400 py-12">لا يوجد مستخدمون بعد</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs">
                    <tr>
                      <th className="px-4 py-2 text-right">الاسم</th>
                      <th className="px-4 py-2 text-right">الإيميل</th>
                      <th className="px-4 py-2 text-right">النوع</th>
                      <th className="px-4 py-2 text-right">الهاتف</th>
                      <th className="px-4 py-2 text-right">تاريخ التسجيل</th>
                      <th className="px-4 py-2 text-right">آخر دخول</th>
                      <th className="px-4 py-2 text-right">الحساب</th>
                      <th className="px-4 py-2 text-right">اختبارات</th>
                      <th className="px-4 py-2 text-right">آخر نتيجة</th>
                      <th className="px-4 py-2 text-right">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {siteUsers.map((u) => {
                      const userSurveys = surveyResults.filter((r) => r.email === u.email);
                      const lastScore = userSurveys[0]?.total_score;
                      const email = u.email?.toLowerCase();
                      const isAdmin = ADMIN_EMAILS.includes(email);
                      const isTrainer = !isAdmin && trainerEmails.has(email);
                      const roleLabel = isAdmin ? { text: "إدارة", cls: "bg-red-100 text-red-700" }
                        : isTrainer ? { text: "مدرب", cls: "bg-purple-100 text-purple-700" }
                        : { text: "متدرب", cls: "bg-green-100 text-green-700" };
                      return (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{u.name || "—"}</td>
                          <td className="px-4 py-3 text-gray-500" dir="ltr">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleLabel.cls}`}>{roleLabel.text}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{u.phone || "—"}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString("ar-SA")}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString("ar-SA") : "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.confirmed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                              {u.confirmed ? "مفعّل" : "غير مفعّل"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">{userSurveys.length || "—"}</td>
                          <td className="px-4 py-3 font-bold text-primary">{lastScore ? `${lastScore}/360` : "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => impersonateUser(u.email)}
                                disabled={impersonating === u.email}
                                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded-lg font-medium disabled:opacity-50"
                              >
                                {impersonating === u.email ? "..." : "دخول كهذا"}
                              </button>
                              <button onClick={() => deleteUser(u.id, u.email)} className="text-xs text-red-500 hover:text-red-700 font-medium">حذف</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Programs ── */}
        {activeTab === "programs" && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">الدورات المتاحة</h2>
                <button onClick={() => setShowAddProgram(v => !v)} className="text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">
                  {showAddProgram ? "إغلاق" : "+ إضافة برنامج"}
                </button>
              </div>
              {showAddProgram && (
                <form onSubmit={addProgram} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-4 bg-gray-50 rounded-xl">
                  <input required placeholder="اسم الدورة *" value={newProgram.name} onChange={(e) => setNewProgram(p => ({ ...p, name: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <select value={newProgram.category} onChange={(e) => setNewProgram(p => ({ ...p, category: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black bg-white">
                    <option value="">اختر البرنامج</option>
                    <option value="هارموني">هارموني</option>
                    <option value="ساعة العمل">ساعة العمل</option>
                    <option value="المسار المهني">المسار المهني</option>
                  </select>
                  <input placeholder="المدة (مثال: 3 أشهر)" value={newProgram.duration} onChange={(e) => setNewProgram(p => ({ ...p, duration: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <input placeholder="رابط الملزمة (اختياري)" type="url" dir="ltr" value={newProgram.material_url} onChange={(e) => setNewProgram(p => ({ ...p, material_url: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <textarea placeholder="الوصف" value={newProgram.description} onChange={(e) => setNewProgram(p => ({ ...p, description: e.target.value }))}
                    rows={2} className="sm:col-span-2 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black resize-none" />
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={programLoading} className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                      {programLoading ? "جاري الحفظ..." : "حفظ الدورة"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="font-bold">قائمة البرامج ({programs.length})</h2>
              </div>
              {programs.length === 0 ? (
                <p className="text-center text-gray-400 py-12 text-sm">لا توجد برامج بعد</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs">
                    <tr>
                      <th className="px-4 py-2 text-right">اسم الدورة</th>
                      <th className="px-4 py-2 text-right">الفئة</th>
                      <th className="px-4 py-2 text-right">المدة</th>
                      <th className="px-4 py-2 text-right">الوصف</th>
                      <th className="px-4 py-2 text-right">الملزمة</th>
                      <th className="px-4 py-2 text-right">الحالة</th>
                      <th className="px-4 py-2 text-right">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {programs.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-gray-500">{p.category || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{p.duration || "—"}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs max-w-[200px] truncate">{p.description || "—"}</td>
                        <td className="px-4 py-3">
                          {p.material_url
                            ? <a href={p.material_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">📎 فتح</a>
                            : <span className="text-gray-300 text-xs">—</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleProgramStatus(p.id, p.status)}
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {p.status === "active" ? "نشط" : "موقوف"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => deleteProgram(p.id)} className="text-xs text-red-500 hover:text-red-700">حذف</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Trainers ── */}
        {activeTab === "trainers" && (
          <div className="space-y-5">

            {/* Pending requests */}
            {trainers.filter(t => t.status === "pending").length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-yellow-200 flex items-center gap-2">
                  <span className="text-yellow-600 font-bold text-sm">⏳ طلبات تسجيل جديدة</span>
                  <span className="bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">{trainers.filter(t => t.status === "pending").length}</span>
                </div>
                <table className="w-full text-sm">
                  <thead className="text-gray-500 text-xs">
                    <tr>
                      <th className="px-4 py-2 text-right">الاسم</th>
                      <th className="px-4 py-2 text-right">الإيميل</th>
                      <th className="px-4 py-2 text-right">الهاتف</th>
                      <th className="px-4 py-2 text-right">التخصص</th>
                      <th className="px-4 py-2 text-right">النبذة</th>
                      <th className="px-4 py-2 text-right">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-100">
                    {trainers.filter(t => t.status === "pending").map((t) => (
                      <tr key={t.id} className="hover:bg-yellow-100/40">
                        <td className="px-4 py-3 font-medium">{t.name}</td>
                        <td className="px-4 py-3 text-gray-500" dir="ltr">{t.email || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{t.phone || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{t.specialty || "—"}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs max-w-[180px] truncate">{t.bio || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => approveTrainer(t.id)} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-medium">قبول</button>
                            <button onClick={() => rejectTrainer(t.id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg font-medium">رفض</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add trainer manually */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">إضافة مدرب يدوياً</h2>
                <button onClick={() => setShowAddTrainer(v => !v)} className="text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">
                  {showAddTrainer ? "إغلاق" : "+ إضافة"}
                </button>
              </div>
              {showAddTrainer && (
                <form onSubmit={addTrainer} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                  <input required placeholder="الاسم الكامل *" value={newTrainer.name} onChange={(e) => setNewTrainer(p => ({ ...p, name: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <input placeholder="الإيميل" type="email" value={newTrainer.email} onChange={(e) => setNewTrainer(p => ({ ...p, email: e.target.value }))}
                    dir="ltr" className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <input placeholder="رقم الهاتف" value={newTrainer.phone} onChange={(e) => setNewTrainer(p => ({ ...p, phone: e.target.value }))}
                    dir="ltr" className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <input placeholder="التخصص" value={newTrainer.specialty} onChange={(e) => setNewTrainer(p => ({ ...p, specialty: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <textarea placeholder="نبذة مختصرة" value={newTrainer.bio} onChange={(e) => setNewTrainer(p => ({ ...p, bio: e.target.value }))}
                    rows={2} className="sm:col-span-2 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black resize-none" />
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={trainerLoading} className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                      {trainerLoading ? "جاري الحفظ..." : "حفظ المدرب"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Active/inactive trainers */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="font-bold">المدربون المعتمدون ({trainers.filter(t => t.status !== "pending").length})</h2>
              </div>
              {trainers.filter(t => t.status !== "pending").length === 0 ? (
                <p className="text-center text-gray-400 py-12 text-sm">لا يوجد مدربون بعد</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs">
                    <tr>
                      <th className="px-4 py-2 text-right">الاسم</th>
                      <th className="px-4 py-2 text-right">الإيميل</th>
                      <th className="px-4 py-2 text-right">الهاتف</th>
                      <th className="px-4 py-2 text-right">التخصص</th>
                      <th className="px-4 py-2 text-right">الحالة</th>
                      <th className="px-4 py-2 text-right">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {trainers.filter(t => t.status !== "pending").map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{t.name}</td>
                        <td className="px-4 py-3 text-gray-500" dir="ltr">{t.email || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{t.phone || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{t.specialty || "—"}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleTrainerStatus(t.id, t.status)}
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {t.status === "active" ? "نشط" : "موقوف"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => deleteTrainer(t.id)} className="text-xs text-red-500 hover:text-red-700">حذف</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Quiz Control ── */}
        {activeTab === "quiz-control" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-lg mb-1">تحكم بأيام الاختبار</h2>
              <p className="text-gray-400 text-sm mb-5">اليوم المفتوح حالياً: <span className="font-bold text-black">يوم {quizCurrentDay}</span></p>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((day) => (
                  <button key={day} onClick={() => setQuizDay(day)} disabled={dayLoading}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${quizCurrentDay === day ? "bg-black text-white shadow-lg scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {quizCurrentDay >= day ? "✓ " : "🔒 "}اليوم {day}
                  </button>
                ))}
              </div>
              {dayMessage && <p className="mt-4 text-sm font-medium text-green-700 bg-green-50 rounded-lg py-2 px-4">{dayMessage}</p>}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold">تقدم المشاركين في الاختبار اليومي</h2>
                <span className="text-xs text-gray-400">{quizProgress.length} مشارك</span>
              </div>
              {quizProgress.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">لا يوجد مشاركون بعد</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs">
                    <tr>
                      <th className="px-4 py-2 text-right">المستخدم</th>
                      <th className="px-4 py-2 text-right">أيام مكتملة</th>
                      <th className="px-4 py-2 text-right">آخر تحديث</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quizProgress.map((p) => {
                      const user = siteUsers.find((u) => u.id === p.user_id);
                      const doneCount = (p.submitted as boolean[])?.filter(Boolean).length ?? 0;
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium">{user?.name || "—"}</p>
                            <p className="text-xs text-gray-400" dir="ltr">{user?.email || p.user_id}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <span key={i} className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${p.submitted?.[i] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-300"}`}>{i + 1}</span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{doneCount}/5 أيام</p>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{p.updated_at ? new Date(p.updated_at).toLocaleDateString("ar-SA") : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
      </main>
    </div>
  );
}
