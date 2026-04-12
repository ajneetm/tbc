"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

type Tab = "overview" | "users" | "surveys" | "quiz-control" | "trainers" | "workshops" | "discounts";

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

  // Trainers
  const [newTrainer, setNewTrainer] = useState({ name: "", email: "", phone: "", specialty: "", bio: "" });
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [showAddTrainer, setShowAddTrainer] = useState(false);

  // Discounts
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [newDiscount, setNewDiscount] = useState({ title: "", description: "", code: "", discount_percent: "", expires_at: "" });
  const [discountLoading, setDiscountLoading] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [discountMsg, setDiscountMsg] = useState({ text: "", ok: true });

  // Courses (الدورات)
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [workshopMaterials, setWorkshopMaterials] = useState<any[]>([]);
  const [workshopEnrollments, setWorkshopEnrollments] = useState<any[]>([]);
  const [newWorkshop, setNewWorkshop] = useState({ name: "", description: "", category: "", duration: "" });
  const [workshopLoading, setWorkshopLoading] = useState(false);
  const [showAddWorkshop, setShowAddWorkshop] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(false);
  const [editWorkshopData, setEditWorkshopData] = useState({ name: "", description: "", category: "", duration: "" });
  const [copiedLink, setCopiedLink] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: "", url: "", content_type: "file" });
  const [materialLoading, setMaterialLoading] = useState(false);
  const [newEnrollEmail, setNewEnrollEmail] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [workshopMsg, setWorkshopMsg] = useState({ text: "", ok: true });

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
    const [usersRes, surveysRes, progressRes, settingsRes, trainersRes, workshopsRes, discountsRes] = await Promise.all([
      fetch("/api/admin/users").then((r) => r.json()).catch(() => ({ users: [] })),
      supabase.from("survey_results").select("*").order("created_at", { ascending: false }),
      supabase.from("quiz_progress").select("*").order("updated_at", { ascending: false }),
      supabase.from("quiz_settings").select("current_day").eq("id", 1).single(),
      supabase.from("trainers").select("*").order("created_at", { ascending: false }),
      supabase.from("workshops").select("*, workshop_materials(count), workshop_enrollments(count)").order("created_at", { ascending: false }),
      supabase.from("discounts").select("*").order("created_at", { ascending: false }),
    ]);
    if (usersRes.users) setSiteUsers(usersRes.users);
    if (surveysRes.data) setSurveyResults(surveysRes.data);
    if (progressRes.data) setQuizProgress(progressRes.data);
    if (settingsRes.data) setQuizCurrentDay(settingsRes.data.current_day);
    if (trainersRes.data) setTrainers(trainersRes.data);
    if (workshopsRes.data) setWorkshops(workshopsRes.data);
    if (discountsRes.data) setDiscounts(discountsRes.data);
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

  // ── Discounts ──
  const showDiscountMsg = (text: string, ok = true) => {
    setDiscountMsg({ text, ok });
    setTimeout(() => setDiscountMsg({ text: "", ok: true }), 3500);
  };

  const addDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountLoading(true);
    const payload: any = {
      title: newDiscount.title,
      description: newDiscount.description || null,
      code: newDiscount.code || null,
      discount_percent: newDiscount.discount_percent ? parseInt(newDiscount.discount_percent) : null,
      expires_at: newDiscount.expires_at || null,
    };
    const { error } = await supabase.from("discounts").insert(payload);
    if (error) showDiscountMsg("فشل الحفظ", false);
    else { showDiscountMsg("تم إضافة الخصم ✓"); setNewDiscount({ title: "", description: "", code: "", discount_percent: "", expires_at: "" }); setShowAddDiscount(false); fetchAll(); }
    setDiscountLoading(false);
  };

  const deleteDiscount = async (id: string) => {
    if (!confirm("حذف هذا الخصم؟")) return;
    await supabase.from("discounts").delete().eq("id", id);
    fetchAll();
  };

  // ── Workshops ──
  const fetchWorkshopDetails = async (workshop: any) => {
    setSelectedWorkshop(workshop);
    const [matsRes, enrollsRes] = await Promise.all([
      supabase.from("workshop_materials").select("*").eq("workshop_id", workshop.id).order("created_at", { ascending: false }),
      supabase.from("workshop_enrollments").select("*").eq("workshop_id", workshop.id).order("created_at", { ascending: false }),
    ]);
    if (matsRes.data) setWorkshopMaterials(matsRes.data);
    if (enrollsRes.data) setWorkshopEnrollments(enrollsRes.data);
  };

  const showWsMsg = (text: string, ok = true) => {
    setWorkshopMsg({ text, ok });
    setTimeout(() => setWorkshopMsg({ text: "", ok: true }), 3500);
  };

  const addWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkshop.name.trim()) return;
    setWorkshopLoading(true);
    const { data, error } = await supabase.from("workshops").insert({
      name: newWorkshop.name,
      description: newWorkshop.description || null,
      category: newWorkshop.category || null,
      duration: newWorkshop.duration || null,
    }).select().single();
    if (error) {
      // Retry without optional columns if they don't exist yet
      const { data: data2, error: error2 } = await supabase.from("workshops").insert({
        name: newWorkshop.name,
        description: newWorkshop.description || null,
      }).select().single();
      if (error2) {
        alert("فشل إنشاء الدورة: " + error2.message);
        setWorkshopLoading(false);
        return;
      }
      if (data2) setWorkshops(prev => [data2, ...prev]);
    } else if (data) {
      setWorkshops(prev => [data, ...prev]);
    }
    setNewWorkshop({ name: "", description: "", category: "", duration: "" });
    setShowAddWorkshop(false);
    setWorkshopLoading(false);
  };

  const deleteWorkshop = async (id: string) => {
    if (!confirm("حذف الدورة وجميع بياناتها؟")) return;
    await Promise.all([
      supabase.from("workshop_materials").delete().eq("workshop_id", id),
      supabase.from("workshop_enrollments").delete().eq("workshop_id", id),
    ]);
    await supabase.from("workshops").delete().eq("id", id);
    setSelectedWorkshop(null);
    fetchAll();
  };

  const startEditWorkshop = (w: any) => {
    setEditWorkshopData({ name: w.name, description: w.description || "", category: w.category || "", duration: w.duration || "" });
    setEditingWorkshop(true);
  };

  const saveEditWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from("workshops")
      .update({ name: editWorkshopData.name, description: editWorkshopData.description || null, category: editWorkshopData.category || null, duration: editWorkshopData.duration || null })
      .eq("id", selectedWorkshop.id)
      .select().single();
    if (data) setSelectedWorkshop(data);
    setEditingWorkshop(false);
    showWsMsg("تم حفظ التعديلات ✓");
    fetchAll();
  };

  const copyRegLink = (workshopId: string) => {
    const link = `${window.location.origin}/register/course/${workshopId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const addMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.name.trim() || !newMaterial.url.trim()) return;
    setMaterialLoading(true);
    const { error } = await supabase.from("workshop_materials").insert({
      workshop_id: selectedWorkshop.id,
      name: newMaterial.name,
      url: newMaterial.url,
      content_type: newMaterial.content_type,
    });
    if (error) showWsMsg("فشل الإضافة", false);
    else { showWsMsg("تم الإضافة ✓"); setNewMaterial({ name: "", url: "", content_type: "file" }); await fetchWorkshopDetails(selectedWorkshop); }
    setMaterialLoading(false);
  };

  const deleteMaterial = async (id: string) => {
    await supabase.from("workshop_materials").delete().eq("id", id);
    await fetchWorkshopDetails(selectedWorkshop);
  };

  const addEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newEnrollEmail.trim().toLowerCase();
    if (!email) return;
    setEnrollLoading(true);
    const already = workshopEnrollments.some((en) => en.user_email?.toLowerCase() === email);
    if (already) { showWsMsg("هذا الإيميل مسجّل مسبقاً", false); setEnrollLoading(false); return; }
    const { error } = await supabase.from("workshop_enrollments").insert({
      workshop_id: selectedWorkshop.id,
      user_email: email,
    });
    if (error) showWsMsg("فشل التسجيل", false);
    else { showWsMsg("تم التسجيل ✓"); setNewEnrollEmail(""); await fetchWorkshopDetails(selectedWorkshop); }
    setEnrollLoading(false);
  };

  const deleteEnrollment = async (id: string) => {
    await supabase.from("workshop_enrollments").delete().eq("id", id);
    await fetchWorkshopDetails(selectedWorkshop);
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
    { key: "trainers",     label: "المدربون",         icon: "🧑‍💼" },
    { key: "quiz-control", label: "الاختبار اليومي",  icon: "📅" },
    { key: "workshops",    label: "الدورات",          icon: "🎓" },
    { key: "discounts",   label: "الخصومات",         icon: "🎁" },
  ];

  const activeTabObj = tabs.find(t => t.key === activeTab)!;

  return (
    <div dir="rtl" className="h-screen overflow-hidden bg-gray-100 font-[Tajawal] flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-black flex flex-col h-full overflow-y-auto">

        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-4 transition">
            <span>←</span>
            <span>الصفحة الرئيسية</span>
          </Link>
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
              <p className="text-gray-400 text-sm mb-5">
                الحالة: <span className="font-bold text-black">{quizCurrentDay === 0 ? "🔒 كل الأيام مقفلة" : `مفتوح حتى اليوم ${quizCurrentDay}`}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setQuizDay(0)} disabled={dayLoading}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${quizCurrentDay === 0 ? "bg-red-600 text-white shadow-lg scale-105" : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"}`}>
                  🔒 قفل الكل
                </button>
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

        {/* ── Discounts ── */}
        {activeTab === "discounts" && (
          <div className="space-y-5">

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">إضافة خصم جديد</h2>
                <button onClick={() => setShowAddDiscount(v => !v)}
                  className="text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">
                  {showAddDiscount ? "إغلاق" : "+ خصم جديد"}
                </button>
              </div>
              {discountMsg.text && (
                <div className={`mb-3 rounded-xl px-4 py-2.5 text-sm font-medium ${discountMsg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {discountMsg.text}
                </div>
              )}
              {showAddDiscount && (
                <form onSubmit={addDiscount} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                  <input required placeholder="عنوان الخصم *" value={newDiscount.title}
                    onChange={(e) => setNewDiscount(p => ({ ...p, title: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <input placeholder="كود الخصم (اختياري)" dir="ltr" value={newDiscount.code}
                    onChange={(e) => setNewDiscount(p => ({ ...p, code: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <input type="number" placeholder="نسبة الخصم % (اختياري)" min="1" max="100" value={newDiscount.discount_percent}
                    onChange={(e) => setNewDiscount(p => ({ ...p, discount_percent: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <input type="date" placeholder="تاريخ الانتهاء" value={newDiscount.expires_at}
                    onChange={(e) => setNewDiscount(p => ({ ...p, expires_at: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                  <textarea placeholder="الوصف (اختياري)" value={newDiscount.description}
                    onChange={(e) => setNewDiscount(p => ({ ...p, description: e.target.value }))}
                    rows={2} className="sm:col-span-2 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black resize-none" />
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={discountLoading}
                      className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                      {discountLoading ? "جاري الحفظ..." : "حفظ الخصم"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="font-bold">قائمة الخصومات ({discounts.length})</h2>
              </div>
              {discounts.length === 0 ? (
                <p className="text-center text-gray-400 py-12 text-sm">لا توجد خصومات بعد</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {discounts.map((d) => (
                    <div key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-medium text-sm">{d.title}</p>
                          {d.discount_percent && (
                            <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                              {d.discount_percent}%
                            </span>
                          )}
                          {d.code && (
                            <span className="bg-gray-100 text-gray-700 font-mono text-xs px-2 py-0.5 rounded" dir="ltr">
                              {d.code}
                            </span>
                          )}
                        </div>
                        {d.description && <p className="text-gray-400 text-xs mt-0.5 truncate max-w-sm">{d.description}</p>}
                        {d.expires_at && (
                          <p className="text-gray-300 text-xs mt-0.5">
                            ينتهي: {new Date(d.expires_at).toLocaleDateString("ar-SA")}
                          </p>
                        )}
                      </div>
                      <button onClick={() => deleteDiscount(d.id)} className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 mr-4">حذف</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── Courses (الدورات) ── */}
        {activeTab === "workshops" && (
          <div className="space-y-5">

            {selectedWorkshop ? (
              /* ── Course detail ── */
              <div className="space-y-5">
                <button onClick={() => { setSelectedWorkshop(null); setWorkshopMaterials([]); setWorkshopEnrollments([]); }}
                  className="text-sm text-gray-500 hover:text-black flex items-center gap-1">← رجوع للدورات</button>

                {/* Course info card */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  {editingWorkshop ? (
                    <form onSubmit={saveEditWorkshop} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input required placeholder="اسم الدورة *" value={editWorkshopData.name}
                        onChange={(e) => setEditWorkshopData(p => ({ ...p, name: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                      <input placeholder="الفئة" value={editWorkshopData.category}
                        onChange={(e) => setEditWorkshopData(p => ({ ...p, category: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                      <input placeholder="المدة" value={editWorkshopData.duration}
                        onChange={(e) => setEditWorkshopData(p => ({ ...p, duration: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                      <textarea placeholder="الوصف" value={editWorkshopData.description}
                        onChange={(e) => setEditWorkshopData(p => ({ ...p, description: e.target.value }))}
                        rows={1} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black resize-none" />
                      <div className="sm:col-span-2 flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800">حفظ</button>
                        <button type="button" onClick={() => setEditingWorkshop(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">إلغاء</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-lg">{selectedWorkshop.name}</h2>
                        {selectedWorkshop.description && <p className="text-gray-400 text-sm mt-0.5">{selectedWorkshop.description}</p>}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {selectedWorkshop.category && <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">{selectedWorkshop.category}</span>}
                          {selectedWorkshop.duration && <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">⏱ {selectedWorkshop.duration}</span>}
                        </div>
                        {/* Registration link */}
                        <div className="mt-3 flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-dashed border-gray-300 max-w-md">
                          <span className="text-xs text-gray-400 flex-1 truncate" dir="ltr">
                            {typeof window !== "undefined" ? `${window.location.origin}/register/course/${selectedWorkshop.id}` : "..."}
                          </span>
                          <button onClick={() => copyRegLink(selectedWorkshop.id)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-medium flex-shrink-0 transition ${copiedLink ? "bg-green-100 text-green-700" : "bg-black text-white hover:bg-gray-800"}`}>
                            {copiedLink ? "✓ تم النسخ" : "نسخ الرابط"}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 mr-4">
                        <button onClick={() => startEditWorkshop(selectedWorkshop)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition">تعديل</button>
                        <button onClick={() => deleteWorkshop(selectedWorkshop.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">حذف</button>
                      </div>
                    </div>
                  )}
                </div>

                {workshopMsg.text && (
                  <div className={`rounded-xl px-4 py-2.5 text-sm font-medium ${workshopMsg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {workshopMsg.text}
                  </div>
                )}

                {/* Course content */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold mb-4">محتوى الدورة</h3>
                  <form onSubmit={addMaterial} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
                    <select value={newMaterial.content_type} onChange={(e) => setNewMaterial(p => ({ ...p, content_type: e.target.value }))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black bg-white">
                      <option value="file">📄 ملف / ملزمة</option>
                      <option value="quiz">📝 اختبار</option>
                      <option value="video">🎬 فيديو</option>
                      <option value="link">🔗 رابط</option>
                    </select>
                    <input required placeholder="الاسم *" value={newMaterial.name} onChange={(e) => setNewMaterial(p => ({ ...p, name: e.target.value }))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                    <input required placeholder="الرابط *" type="url" dir="ltr" value={newMaterial.url} onChange={(e) => setNewMaterial(p => ({ ...p, url: e.target.value }))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                    <button type="submit" disabled={materialLoading}
                      className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                      {materialLoading ? "..." : "+ إضافة"}
                    </button>
                  </form>
                  {workshopMaterials.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center">لا يوجد محتوى بعد</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {workshopMaterials.map((m) => {
                        const typeIcon = m.content_type === "quiz" ? "📝" : m.content_type === "video" ? "🎬" : m.content_type === "link" ? "🔗" : "📄";
                        const typeLabel = m.content_type === "quiz" ? "اختبار" : m.content_type === "video" ? "فيديو" : m.content_type === "link" ? "رابط" : "ملف";
                        const typeBg = m.content_type === "quiz" ? "bg-purple-50 text-purple-700" : m.content_type === "video" ? "bg-blue-50 text-blue-700" : m.content_type === "link" ? "bg-gray-100 text-gray-600" : "bg-orange-50 text-orange-700";
                        return (
                          <div key={m.id} className="flex items-center justify-between py-2.5 gap-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${typeBg}`}>{typeIcon} {typeLabel}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{m.name}</p>
                              <a href={m.url} target="_blank" rel="noopener noreferrer" dir="ltr"
                                className="text-xs text-blue-500 hover:underline truncate max-w-[300px] block">{m.url}</a>
                            </div>
                            <button onClick={() => deleteMaterial(m.id)} className="text-xs text-red-400 hover:text-red-600 flex-shrink-0">حذف</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Enrollments */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold mb-4">المسجّلون في الدورة ({workshopEnrollments.length})</h3>
                  <form onSubmit={addEnrollment} className="flex gap-2 mb-4">
                    <input required type="email" placeholder="إيميل المتدرب *" dir="ltr" value={newEnrollEmail}
                      onChange={(e) => setNewEnrollEmail(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                    <button type="submit" disabled={enrollLoading}
                      className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex-shrink-0">
                      {enrollLoading ? "..." : "+ تسجيل"}
                    </button>
                  </form>
                  {workshopEnrollments.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center">لا يوجد مسجّلون بعد</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {workshopEnrollments.map((en) => (
                        <div key={en.id} className="flex items-center justify-between py-2.5">
                          <p className="text-sm font-medium" dir="ltr">{en.user_email}</p>
                          <button onClick={() => deleteEnrollment(en.id)} className="text-xs text-red-400 hover:text-red-600">إزالة</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            ) : (
              /* ── Courses list ── */
              <>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold">إضافة دورة جديدة</h2>
                    <button onClick={() => setShowAddWorkshop(v => !v)}
                      className="text-sm px-4 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">
                      {showAddWorkshop ? "إغلاق" : "+ دورة جديدة"}
                    </button>
                  </div>
                  {showAddWorkshop && (
                    <form onSubmit={addWorkshop} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                      <input required placeholder="اسم الدورة *" value={newWorkshop.name}
                        onChange={(e) => setNewWorkshop(p => ({ ...p, name: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                      <input placeholder="الفئة (مثال: ساعة العمل)" value={newWorkshop.category}
                        onChange={(e) => setNewWorkshop(p => ({ ...p, category: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                      <input placeholder="المدة (مثال: 4 أسابيع)" value={newWorkshop.duration}
                        onChange={(e) => setNewWorkshop(p => ({ ...p, duration: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                      <textarea placeholder="الوصف (اختياري)" value={newWorkshop.description}
                        onChange={(e) => setNewWorkshop(p => ({ ...p, description: e.target.value }))}
                        rows={1} className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black resize-none" />
                      <div className="sm:col-span-2">
                        <button type="submit" disabled={workshopLoading}
                          className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                          {workshopLoading ? "جاري الحفظ..." : "إنشاء الدورة"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100">
                    <h2 className="font-bold">قائمة الدورات ({workshops.length})</h2>
                  </div>
                  {workshops.length === 0 ? (
                    <p className="text-center text-gray-400 py-12 text-sm">لا توجد دورات بعد — أضف دورة من الأعلى</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {workshops.map((w) => {
                        const matsCount = w.workshop_materials?.[0]?.count ?? 0;
                        const enrollsCount = w.workshop_enrollments?.[0]?.count ?? 0;
                        return (
                        <button key={w.id} onClick={() => fetchWorkshopDetails(w)}
                          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-right">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{w.name}</p>
                            <div className="flex gap-2 mt-1 flex-wrap items-center">
                              {w.category && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{w.category}</span>}
                              {w.duration && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">⏱ {w.duration}</span>}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${matsCount > 0 ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-400"}`}>
                                📄 {matsCount} ملف
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${enrollsCount > 0 ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                                👥 {enrollsCount} مسجّل
                              </span>
                            </div>
                          </div>
                          <span className="text-gray-400 text-xs flex-shrink-0 mr-4">إدارة ←</span>
                        </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        )}

      </div>
      </main>
    </div>
  );
}
