"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

const ADMIN_PASSWORD = "AJNEE-ADMIN-2026";

type Tab = "overview" | "users" | "surveys" | "quiz-control";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Data
  const [siteUsers, setSiteUsers] = useState<any[]>([]);
  const [surveyResults, setSurveyResults] = useState<any[]>([]);
  const [quizProgress, setQuizProgress] = useState<any[]>([]);
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

  const fetchAll = async () => {
    setLoadingData(true);
    const [usersRes, surveysRes, progressRes, settingsRes] = await Promise.all([
      fetch("/api/admin/users").then((r) => r.json()).catch(() => ({ users: [] })),
      supabase.from("survey_results").select("*").order("created_at", { ascending: false }),
      supabase.from("quiz_progress").select("*").order("updated_at", { ascending: false }),
      supabase.from("quiz_settings").select("current_day").eq("id", 1).single(),
    ]);

    if (usersRes.users) setSiteUsers(usersRes.users);
    if (surveysRes.data) setSurveyResults(surveysRes.data);
    if (progressRes.data) setQuizProgress(progressRes.data);
    if (settingsRes.data) setQuizCurrentDay(settingsRes.data.current_day);
    setLoadingData(false);
  };

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) setAuthed(true);
    else setPassError(true);
  };

  // ── Quiz day control ──
  const setQuizDay = async (day: number) => {
    setDayLoading(true);
    const { error } = await supabase
      .from("quiz_settings")
      .update({ current_day: day, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (!error) {
      setQuizCurrentDay(day);
      setDayMessage(`تم فتح اليوم ${day} ✓`);
    } else {
      setDayMessage("حدث خطأ، حاول مجدداً");
    }
    setDayLoading(false);
    setTimeout(() => setDayMessage(""), 3000);
  };

  // ── User management ──
  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) return;
    setUserLoading(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (res.ok) {
      setUserMessage({ text: "تم إنشاء الحساب ✓", ok: true });
      setNewUser({ email: "", password: "", name: "", phone: "" });
      setShowAddUser(false);
      fetchAll();
    } else {
      setUserMessage({ text: data.error || "حدث خطأ", ok: false });
    }
    setUserLoading(false);
    setTimeout(() => setUserMessage({ text: "", ok: true }), 4000);
  };

  const deleteUser = async (id: string, email: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم ${email}؟`)) return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchAll();
    else alert("فشل الحذف");
  };

  // ── Export Excel ──
  const exportExcel = async () => {
    if (!surveyResults.length) { alert("لا توجد نتائج"); return; }

    const usersSheet = surveyResults.map((r) => ({
      "الاسم": r.name || "",
      "الإيميل": r.email || "",
      "الهاتف": r.phone || "",
      "نوع الاختبار": r.survey_type === "explorers" ? "مستكشف" : r.survey_type === "entrepreneurs" ? "رائد أعمال" : "شركة",
      "اللغة": r.language === "ar" ? "عربي" : "إنجليزي",
      "العمر": r.age || "",
      "نوع العمل": r.business_type || "",
      "رأس المال": r.capital || "",
      "عمر المشروع (سنوات)": r.project_age || "",
      "عدد الموظفين": r.staff_count || "",
      "النتيجة": r.total_score || 0,
      "النسبة %": r.percentage || 0,
      "التاريخ": new Date(r.created_at).toLocaleDateString("ar-SA"),
    }));

    const answersSheet: any[] = [];
    surveyResults.forEach((r) => {
      (r.answers || []).forEach((a: any, i: number) => {
        answersSheet.push({
          "الإيميل": r.email || "",
          "الاسم": r.name || "",
          "رقم السؤال": i + 1,
          "السؤال": a.question || "",
          "الدرجة": a.score || 0,
          "المحور": a.modalId || "",
          "التاريخ": new Date(r.created_at).toLocaleDateString("ar-SA"),
        });
      });
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(usersSheet), "نتائج المشاركين");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(answersSheet), "تفاصيل الإجابات");
    XLSX.writeFile(wb, `ajnee-results-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ── Stats ──
  const avgScore = surveyResults.length
    ? (surveyResults.reduce((s, r) => s + Number(r.total_score || 0), 0) / surveyResults.length).toFixed(1)
    : "0";

  const byType = surveyResults.reduce((acc: any, r) => {
    acc[r.survey_type] = (acc[r.survey_type] || 0) + 1;
    return acc;
  }, {});

  // ── Auth screen ──
  if (!authed) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-950 flex items-center justify-center font-[Tajawal]">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl">🔐</span>
            </div>
            <h1 className="text-xl font-bold">لوحة تحكم المدير</h1>
            <p className="text-gray-400 text-xs mt-1">أجني لدعم الأعمال</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setPassError(false); }}
              placeholder="كلمة المرور"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black ${passError ? "border-red-400" : "border-gray-300"}`}
              dir="ltr"
            />
            {passError && <p className="text-red-500 text-sm text-center">كلمة المرور غير صحيحة</p>}
            <button type="submit" className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors">
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview", label: "نظرة عامة", icon: "📊" },
    { key: "surveys", label: "نتائج الاختبارات", icon: "📋" },
    { key: "users", label: "المستخدمون", icon: "👥" },
    { key: "quiz-control", label: "الاختبار اليومي", icon: "📅" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-[Tajawal]">

      {/* Header */}
      <div className="bg-black text-white py-4 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">لوحة تحكم المدير — أجني</h1>
          <p className="text-gray-400 text-xs mt-0.5">جميع بيانات الموقع</p>
        </div>
        <button
          onClick={exportExcel}
          className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 font-medium transition-colors flex items-center gap-2"
        >
          ⬇ تصدير Excel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200 px-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "إجمالي الاختبارات", value: surveyResults.length, color: "bg-blue-50 text-blue-700", icon: "📋" },
                { label: "مشاركون فريدون", value: siteUsers.length, color: "bg-purple-50 text-purple-700", icon: "👥" },
                { label: "متوسط النتيجة", value: `${avgScore}/360`, color: "bg-green-50 text-green-700", icon: "📈" },
                { label: "اليوم المفتوح الآن", value: `يوم ${quizCurrentDay}`, color: "bg-orange-50 text-orange-700", icon: "📅" },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl p-5 ${stat.color} border border-current/10`}>
                  <p className="text-2xl mb-1">{stat.icon}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs mt-1 opacity-70">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* By survey type */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-bold mb-4">توزيع الاختبارات حسب النوع</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { key: "explorers", label: "مستكشفون", color: "bg-blue-100 text-blue-800" },
                  { key: "entrepreneurs", label: "رواد أعمال", color: "bg-green-100 text-green-800" },
                  { key: "companies", label: "شركات", color: "bg-purple-100 text-purple-800" },
                ].map((type) => (
                  <div key={type.key} className={`rounded-lg p-4 ${type.color}`}>
                    <p className="text-3xl font-bold">{byType[type.key] || 0}</p>
                    <p className="text-sm mt-1">{type.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest 5 results */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="font-bold">آخر الاختبارات</h2>
              </div>
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
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                          {r.survey_type === "explorers" ? "مستكشف" : r.survey_type === "entrepreneurs" ? "رائد أعمال" : "شركة"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-primary">{r.total_score}/360</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(r.created_at).toLocaleDateString("ar-SA")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Survey Results ── */}
        {activeTab === "surveys" && (
          <div className="space-y-4">
            {selectedSurvey ? (
              <div>
                <button onClick={() => setSelectedSurvey(null)} className="mb-4 text-sm text-gray-500 hover:text-black flex items-center gap-1">
                  ← رجوع للقائمة
                </button>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-bold text-lg mb-4">{selectedSurvey.name || selectedSurvey.email}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "الإيميل", value: selectedSurvey.email },
                      { label: "الهاتف", value: selectedSurvey.phone || "—" },
                      { label: "نوع الاختبار", value: selectedSurvey.survey_type === "explorers" ? "مستكشف" : selectedSurvey.survey_type === "entrepreneurs" ? "رائد أعمال" : "شركة" },
                      { label: "النتيجة", value: `${selectedSurvey.total_score}/360` },
                      { label: "النسبة", value: `${selectedSurvey.percentage}%` },
                      { label: "التاريخ", value: new Date(selectedSurvey.created_at).toLocaleDateString("ar-SA") },
                      { label: "العمر", value: selectedSurvey.age || "—" },
                      { label: "نوع العمل", value: selectedSurvey.business_type || "—" },
                      { label: "رأس المال", value: selectedSurvey.capital || "—" },
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
                        <th className="px-4 py-2 text-right">الهاتف</th>
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
                          <td className="px-4 py-3 text-gray-500">{r.phone || "—"}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                              {r.survey_type === "explorers" ? "مستكشف" : r.survey_type === "entrepreneurs" ? "رائد أعمال" : "شركة"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold">{r.total_score}/360</td>
                          <td className="px-4 py-3 text-primary font-bold">{r.percentage}%</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString("ar-SA")}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => setSelectedSurvey(r)} className="text-xs text-primary hover:underline">تفاصيل</button>
                          </td>
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
                <button
                  onClick={() => setShowAddUser((v) => !v)}
                  className="text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  {showAddUser ? "إغلاق" : "+ إضافة"}
                </button>
              </div>
              {showAddUser && (
                <form onSubmit={addUser} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email" required placeholder="الإيميل *" dir="ltr"
                    value={newUser.email}
                    onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="password" required placeholder="كلمة المرور *" dir="ltr"
                    value={newUser.password}
                    onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text" placeholder="الاسم الكامل"
                    value={newUser.name}
                    onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text" placeholder="رقم الهاتف" dir="ltr"
                    value={newUser.phone}
                    onChange={(e) => setNewUser((p) => ({ ...p, phone: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button
                      type="submit" disabled={userLoading}
                      className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                    >
                      {userLoading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                    </button>
                    {userMessage.text && (
                      <p className={`text-sm font-medium ${userMessage.ok ? "text-green-700" : "text-red-600"}`}>
                        {userMessage.text}
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Users list */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold">جميع المستخدمين المسجّلين ({siteUsers.length})</h2>
            </div>
            {loadingData ? (
              <div className="flex justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-black border-t-transparent" />
              </div>
            ) : siteUsers.length === 0 ? (
              <p className="text-center text-gray-400 py-12">لا يوجد مستخدمون بعد</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="px-4 py-2 text-right">الاسم</th>
                    <th className="px-4 py-2 text-right">الإيميل</th>
                    <th className="px-4 py-2 text-right">الهاتف</th>
                    <th className="px-4 py-2 text-right">تاريخ التسجيل</th>
                    <th className="px-4 py-2 text-right">آخر دخول</th>
                    <th className="px-4 py-2 text-right">الحساب مفعّل</th>
                    <th className="px-4 py-2 text-right">عدد الاختبارات</th>
                    <th className="px-4 py-2 text-right">آخر نتيجة</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {siteUsers.map((u) => {
                    const userSurveys = surveyResults.filter((r) => r.email === u.email);
                    const lastScore = userSurveys[0]?.total_score;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{u.name || "—"}</td>
                        <td className="px-4 py-3 text-gray-500" dir="ltr">{u.email}</td>
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
                          <button
                            onClick={() => deleteUser(u.id, u.email)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            حذف
                          </button>
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

        {/* ── Quiz Control ── */}
        {activeTab === "quiz-control" && (
          <div className="space-y-6">

            {/* Day control */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-lg mb-1">تحكم بأيام الاختبار</h2>
              <p className="text-gray-400 text-sm mb-5">اليوم المفتوح حالياً: <span className="font-bold text-black">يوم {quizCurrentDay}</span> — جميع المشاركين المسجّلين يرون الأيام حتى هذا اليوم</p>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((day) => (
                  <button
                    key={day}
                    onClick={() => setQuizDay(day)}
                    disabled={dayLoading}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                      quizCurrentDay === day
                        ? "bg-black text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {quizCurrentDay >= day ? "✓ " : "🔒 "}اليوم {day}
                  </button>
                ))}
              </div>
              {dayMessage && (
                <p className="mt-4 text-sm font-medium text-green-700 bg-green-50 rounded-lg py-2 px-4">{dayMessage}</p>
              )}
            </div>

            {/* Quiz participants progress */}
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
                              {[0,1,2,3,4].map((i) => (
                                <span key={i} className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                                  p.submitted?.[i] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-300"
                                }`}>{i+1}</span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{doneCount}/5 أيام</p>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {p.updated_at ? new Date(p.updated_at).toLocaleDateString("ar-SA") : "—"}
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


      </div>
    </div>
  );
}
