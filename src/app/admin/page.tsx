"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { FolderOpen, User, CheckCircle2, Clock, QrCode, X } from "lucide-react";
import QRCode from "react-qr-code";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

type Tab = "overview" | "users" | "surveys" | "quiz-control" | "trainers" | "workshops" | "consultations" | "evaluation" | "projects";

const surveyTypeLabel = (t: string) =>
  t === "explorers" ? "مستكشف" : t === "entrepreneurs" ? "رائد أعمال" : "صاحب شركة/مدير تنفيذي";

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    const saved = localStorage.getItem("admin_tab") as Tab;
    if (saved) setActiveTab(saved);
  }, []);

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    localStorage.setItem("admin_tab", tab);
  };

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Trainers
  const [newTrainer, setNewTrainer] = useState({ name: "", email: "", phone: "", specialty: "", bio: "" });
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [showAddTrainer, setShowAddTrainer] = useState(false);

  // Consultations
  const [consultations, setConsultations] = useState<any[]>([]);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // Workshop Evaluation
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [evaluationMsg, setEvaluationMsg] = useState("");
  const [evaluations, setEvaluations] = useState<any[]>([]);

  // Projects
  const [adminProjects, setAdminProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [qrProject, setQrProject] = useState<any>(null);
  const [projectEvals, setProjectEvals] = useState<any[]>([]);
  const [projectEvalsLoading, setProjectEvalsLoading] = useState(false);

  // Courses (الدورات)
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [workshopMaterials, setWorkshopMaterials] = useState<any[]>([]);
  const [workshopEnrollments, setWorkshopEnrollments] = useState<any[]>([]);
  const [newWorkshop, setNewWorkshop] = useState({ name: "", description: "", category: "", duration: "", discount_percent: "", discount_code: "" });
  const [workshopLoading, setWorkshopLoading] = useState(false);
  const [showAddWorkshop, setShowAddWorkshop] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(false);
  const [editWorkshopData, setEditWorkshopData] = useState({ name: "", description: "", category: "", duration: "", discount_percent: "", discount_code: "" });
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
    const [usersRes, surveysRes, progressRes, settingsRes, trainersRes, workshopsRes, consultRes, evalSettingsRes, evalsRes, projectsRes] = await Promise.all([
      fetch("/api/admin/users").then((r) => r.json()).catch(() => ({ users: [] })),
      supabase.from("survey_results").select("*").order("created_at", { ascending: false }),
      supabase.from("quiz_progress").select("*").order("updated_at", { ascending: false }),
      supabase.from("quiz_settings").select("current_day").eq("id", 1).single(),
      supabase.from("trainers").select("*").order("created_at", { ascending: false }),
      supabase.from("workshops").select("*, workshop_materials(count), workshop_enrollments(count)").order("created_at", { ascending: false }),
      supabase.from("consultations").select("*").order("created_at", { ascending: false }),
      supabase.from("evaluation_settings").select("is_open").eq("id", 1).maybeSingle(),
      supabase.from("workshop_evaluations").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
    ]);
    if (usersRes.users) setSiteUsers(usersRes.users);
    if (surveysRes.data) setSurveyResults(surveysRes.data);
    if (progressRes.data) setQuizProgress(progressRes.data);
    if (settingsRes.data) setQuizCurrentDay(settingsRes.data.current_day);
    if (trainersRes.data) setTrainers(trainersRes.data);
    if (workshopsRes.data) setWorkshops(workshopsRes.data);
    if (consultRes.data) setConsultations(consultRes.data);
    setEvaluationOpen(evalSettingsRes.data?.is_open ?? false);
    if (evalsRes.data) setEvaluations(evalsRes.data);
    if (projectsRes.data) setAdminProjects(projectsRes.data);
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

  // ── Consultations ──
  const replyToConsultation = async (id: string) => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    const { error } = await supabase.from("consultations").update({
      admin_reply: replyText,
      status: "replied",
      replied_at: new Date().toISOString(),
    }).eq("id", id);
    if (!error) {
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, admin_reply: replyText, status: "replied", replied_at: new Date().toISOString() } : c));
      setReplyingId(null);
      setReplyText("");
    }
    setReplyLoading(false);
  };

  const closeConsultation = async (id: string) => {
    await supabase.from("consultations").update({ status: "closed" }).eq("id", id);
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: "closed" } : c));
  };

  // ── Workshops ──
  const fetchWorkshopDetails = async (workshop: any) => {
    setSelectedWorkshop(workshop);
    const id = workshop.id as string;
    const [matsRes, enrollsRes] = await Promise.all([
      supabase.from("workshop_materials").select("*").eq("workshop_id", id),
      supabase.from("workshop_enrollments").select("*").eq("workshop_id", id),
    ]);
    if (matsRes.error) console.error("[admin] materials error:", matsRes.error);
    if (enrollsRes.error) console.error("[admin] enrollments error:", enrollsRes.error);
    console.log("[admin] enrollments data:", enrollsRes.data);
    setWorkshopMaterials(matsRes.data || []);
    setWorkshopEnrollments(enrollsRes.data || []);
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
    setNewWorkshop({ name: "", description: "", category: "", duration: "", discount_percent: "", discount_code: "" });
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
    setEditWorkshopData({
      name: w.name, description: w.description || "",
      category: w.category || "", duration: w.duration || "",
      discount_percent: w.discount_percent ? String(w.discount_percent) : "",
      discount_code: w.discount_code || "",
    });
    setEditingWorkshop(true);
  };

  const saveEditWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from("workshops")
      .update({
        name: editWorkshopData.name,
        description: editWorkshopData.description || null,
        category: editWorkshopData.category || null,
        duration: editWorkshopData.duration || null,
        discount_percent: editWorkshopData.discount_percent ? parseInt(editWorkshopData.discount_percent) : null,
        discount_code: editWorkshopData.discount_code || null,
      })
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

  // ── Evaluation toggle ──
  const toggleEvaluation = async () => {
    setEvaluationLoading(true);
    const newState = !evaluationOpen;
    const { error } = await supabase.from("evaluation_settings")
      .update({ is_open: newState, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (!error) {
      setEvaluationOpen(newState);
      setEvaluationMsg(newState ? "تم فتح التقييم ✓" : "تم إغلاق التقييم ✓");
    } else {
      setEvaluationMsg("حدث خطأ");
    }
    setEvaluationLoading(false);
    setTimeout(() => setEvaluationMsg(""), 3000);
  };

  // ── Projects ──
  const toggleProjectActive = async (id: string, isActive: boolean) => {
    await supabase.from("projects").update({ is_active: !isActive }).eq("id", id);
    setAdminProjects((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !isActive } : p));
    if (selectedProject?.id === id) setSelectedProject((p: any) => ({ ...p, is_active: !isActive }));
  };

  const deleteProject = async (id: string) => {
    if (!confirm("حذف المشروع وجميع تقييماته؟")) return;
    const { error: projError } = await supabase.from("projects").delete().eq("id", id);
    if (projError) { alert("فشل حذف المشروع: " + projError.message); return; }
    setAdminProjects((prev) => prev.filter((p) => p.id !== id));
    setSelectedProject(null);
  };

  const deleteSurvey = async (id: string) => {
    if (!confirm("حذف هذا الاختبار نهائياً؟")) return;
    await supabase.from("survey_results").delete().eq("id", id);
    setSurveyResults(prev => prev.filter(r => r.id !== id));
    if (selectedSurvey?.id === id) setSelectedSurvey(null);
  };

  const deleteQuizProgress = async (id: string) => {
    if (!confirm("حذف كامل تقدم هذا المستخدم؟ سيتمكن من إعادة الاختبار من البداية.")) return;
    const { error } = await supabase.from("quiz_progress").delete().eq("id", id);
    if (error) { alert("فشل الحذف: " + error.message); return; }
    setQuizProgress(prev => prev.filter(p => p.id !== id));
  };

  const resetQuizDay = async (progressId: string, dayIndex: number) => {
    const progress = quizProgress.find(p => p.id === progressId);
    if (!progress) return;
    const submitted = [...(progress.submitted || [false, false, false, false, false])];
    const scores = [...(progress.scores || [null, null, null, null, null])];
    submitted[dayIndex] = false;
    scores[dayIndex] = null;
    const { error } = await supabase
      .from("quiz_progress")
      .update({ submitted, scores, updated_at: new Date().toISOString() })
      .eq("id", progressId);
    if (error) { alert("فشل الحذف: " + error.message); return; }
    setQuizProgress(prev => prev.map(p => p.id === progressId ? { ...p, submitted, scores } : p));
  };

  const deleteConsultation = async (id: string) => {
    if (!confirm("حذف هذه الاستشارة نهائياً؟")) return;
    await supabase.from("consultations").delete().eq("id", id);
    setConsultations(prev => prev.filter(c => c.id !== id));
  };

  const deleteEvaluation = async (id: string) => {
    if (!confirm("حذف هذا التقييم؟")) return;
    await supabase.from("workshop_evaluations").delete().eq("id", id);
    setEvaluations(prev => prev.filter(e => e.id !== id));
  };

  const openProjectDetail = async (project: any) => {
    setSelectedProject(project);
    setProjectEvalsLoading(true);
    const { data } = await supabase.from("project_evaluations").select("*").eq("project_id", project.id).order("created_at", { ascending: false });
    setProjectEvals(data || []);
    setProjectEvalsLoading(false);
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
    { key: "overview",       label: "نظرة عامة",       icon: "📊" },
    { key: "surveys",        label: "الاختبارات",       icon: "📋" },
    { key: "users",          label: "المستخدمون",       icon: "👥" },
    { key: "trainers",       label: "المدربون",         icon: "🧑‍💼" },
    { key: "quiz-control",   label: "الاختبار اليومي",  icon: "📅" },
    { key: "workshops",      label: "الدورات",          icon: "🎓" },
    { key: "consultations",  label: "الاستشارات",       icon: "💬" },
    { key: "evaluation",     label: "تقييم الورشة",     icon: "📝" },
    { key: "projects",       label: "تقييم المشاريع",   icon: "🗂️" },
  ];

  const activeTabObj = tabs.find(t => t.key === activeTab)!;

  return (
    <div dir="rtl" className="h-screen overflow-hidden bg-gray-100 font-[Tajawal] flex">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-30 w-64 flex-shrink-0 bg-black flex flex-col h-full overflow-y-auto transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>

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
              onClick={() => changeTab(tab.key)}
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
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 lg:py-4 sticky top-0 z-10 flex items-center justify-between gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition">
            <div className="w-5 h-0.5 bg-gray-700 mb-1" /><div className="w-5 h-0.5 bg-gray-700 mb-1" /><div className="w-5 h-0.5 bg-gray-700" />
          </button>
          <h1 className="font-bold text-gray-900 text-sm lg:text-base">{activeTabObj.icon} {activeTabObj.label}</h1>
          {loadingData && <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />}
        </div>

      <div className="p-4 lg:p-8">

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
              <div className="overflow-x-auto"><table className="w-full text-sm">
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
              </table></div>
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

                  {selectedSurvey.ai_analysis && (
                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <h3 className="font-bold mb-4">تقرير الذكاء الاصطناعي</h3>
                      <div
                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                        style={{ direction: selectedSurvey.language === "ar" ? "rtl" : "ltr" }}
                        dangerouslySetInnerHTML={{ __html: selectedSurvey.ai_analysis }}
                      />
                    </div>
                  )}
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
                  <div className="overflow-x-auto"><table className="w-full text-sm">
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
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSelectedSurvey(r)} className="text-xs text-primary hover:underline">تفاصيل</button>
                              <a href={`/admin/survey-report/${r.id}`} target="_blank" className="text-xs text-green-600 hover:underline font-medium">التقرير</a>
                              <button onClick={() => deleteSurvey(r.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">حذف</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
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
                <div className="overflow-x-auto"><table className="w-full text-sm">
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
                </table></div>
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
                <div className="overflow-x-auto"><table className="w-full text-sm">
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
                </table></div>
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
                <div className="overflow-x-auto"><table className="w-full text-sm">
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
                </table></div>
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
                <div className="overflow-x-auto"><table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs">
                    <tr>
                      <th className="px-4 py-2 text-right">المستخدم</th>
                      <th className="px-4 py-2 text-center">اليوم 1</th>
                      <th className="px-4 py-2 text-center">اليوم 2</th>
                      <th className="px-4 py-2 text-center">اليوم 3</th>
                      <th className="px-4 py-2 text-center">اليوم 4</th>
                      <th className="px-4 py-2 text-center">اليوم 5</th>
                      <th className="px-4 py-2 text-center font-bold">المجموع</th>
                      <th className="px-4 py-2 text-right">آخر تحديث</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quizProgress.map((p) => {
                      const user = siteUsers.find((u) => u.id === p.user_id);
                      const sc: (number | null)[] = Array.isArray(p.scores) ? p.scores : [null, null, null, null, null];
                      const scoredDays = sc.filter((s, i) => p.submitted?.[i] && s !== null);
                      const totalScore = scoredDays.reduce<number>((sum, s) => sum + (s as number), 0);
                      const doneCount = (p.submitted as boolean[])?.filter(Boolean).length ?? 0;
                      const scoredCount = scoredDays.length;
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium">{user?.name || "—"}</p>
                            <p className="text-xs text-gray-400" dir="ltr">{user?.email || p.user_id}</p>
                          </td>
                          {[0, 1, 2, 3, 4].map((i) => (
                            <td key={i} className="px-4 py-3 text-center">
                              {p.submitted?.[i] ? (
                                <div className="flex flex-col items-center gap-1">
                                  <span className={`inline-block font-bold text-sm px-2 py-0.5 rounded-lg ${sc[i] !== null ? (sc[i]! >= 7 ? "bg-green-100 text-green-700" : sc[i]! >= 5 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600") : "bg-gray-100 text-gray-500"}`}>
                                    {sc[i] !== null ? `${sc[i]}/10` : "✓"}
                                  </span>
                                  <button
                                    onClick={() => resetQuizDay(p.id, i)}
                                    title={`حذف نتيجة اليوم ${i + 1}`}
                                    className="text-xs text-red-400 hover:text-red-600 leading-none"
                                  >× حذف</button>
                                </div>
                              ) : (
                                <span className="text-gray-300 text-sm">—</span>
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center">
                            {scoredCount > 0 ? (
                              <span className="font-bold text-sm bg-black text-white px-3 py-1 rounded-lg">
                                {totalScore}/{scoredCount * 10}
                              </span>
                            ) : doneCount > 0 ? (
                              <span className="text-xs text-gray-400">تم {doneCount}/5</span>
                            ) : <span className="text-gray-300 text-sm">—</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{p.updated_at ? new Date(p.updated_at).toLocaleDateString("ar-SA") : "—"}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => deleteQuizProgress(p.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">حذف</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table></div>
              )}
            </div>
          </div>
        )}

        {/* ── Consultations ── */}
        {activeTab === "consultations" && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">الاستشارات ({consultations.length})</h2>
              <div className="flex gap-2 text-xs">
                <span className="bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
                  قيد المراجعة: {consultations.filter(c => c.status === "pending").length}
                </span>
                <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                  تم الرد: {consultations.filter(c => c.status === "replied").length}
                </span>
              </div>
            </div>

            {consultations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="font-bold text-gray-700">لا توجد استشارات بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map((c) => {
                  const isReplying = replyingId === c.id;
                  const stBadge = c.status === "replied"
                    ? "bg-green-50 text-green-700"
                    : c.status === "closed"
                    ? "bg-gray-100 text-gray-500"
                    : "bg-yellow-50 text-yellow-700";
                  const stLabel = c.status === "replied" ? "تم الرد" : c.status === "closed" ? "مغلق" : "قيد المراجعة";
                  return (
                    <div key={c.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="px-5 py-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-sm">{c.subject}</p>
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${stBadge}`}>{stLabel}</span>
                            </div>
                            <p className="text-xs text-gray-400">{c.user_name} · {c.user_email}</p>
                            <p className="text-xs text-gray-300 mt-0.5">{new Date(c.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {c.status !== "closed" && (
                              <button onClick={() => closeConsultation(c.id)}
                                className="text-xs text-gray-400 hover:text-gray-600">إغلاق</button>
                            )}
                            <button onClick={() => deleteConsultation(c.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-medium">حذف</button>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl px-4 py-3">{c.message}</p>

                        {c.admin_reply && (
                          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                            <p className="text-xs font-bold text-blue-700 mb-1">ردك</p>
                            <p className="text-sm text-blue-800">{c.admin_reply}</p>
                          </div>
                        )}

                        {!isReplying ? (
                          <button onClick={() => { setReplyingId(c.id); setReplyText(c.admin_reply || ""); }}
                            className="mt-3 text-xs font-bold text-black border border-gray-300 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition">
                            {c.admin_reply ? "تعديل الرد" : "رد على الاستشارة"}
                          </button>
                        ) : (
                          <div className="mt-3 space-y-2">
                            <textarea value={replyText} rows={3}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="اكتب ردك هنا..."
                              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black resize-none" />
                            <div className="flex gap-2">
                              <button onClick={() => replyToConsultation(c.id)} disabled={replyLoading}
                                className="flex-1 bg-black text-white text-sm font-bold py-2 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition">
                                {replyLoading ? "..." : "إرسال الرد"}
                              </button>
                              <button onClick={() => { setReplyingId(null); setReplyText(""); }}
                                className="px-4 border border-gray-300 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition">
                                إلغاء
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                      <input type="number" placeholder="نسبة الخصم % (اختياري)" min="1" max="100" value={editWorkshopData.discount_percent}
                        onChange={(e) => setEditWorkshopData(p => ({ ...p, discount_percent: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
                      <input placeholder="كود الخصم (اختياري)" dir="ltr" value={editWorkshopData.discount_code}
                        onChange={(e) => setEditWorkshopData(p => ({ ...p, discount_code: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black" />
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

        {/* ── Evaluation ── */}
        {activeTab === "evaluation" && (
          <div className="space-y-6">

            {/* Toggle card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">تحكم بتقييم الورشة</h2>
                  <p className="text-gray-400 text-sm mt-0.5">
                    الحالة: <span className={`font-bold ${evaluationOpen ? "text-green-600" : "text-red-600"}`}>
                      {evaluationOpen ? "🟢 مفتوح" : "🔒 مغلق"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={toggleEvaluation}
                  disabled={evaluationLoading}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                    evaluationOpen
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {evaluationLoading ? "..." : evaluationOpen ? "🔒 إغلاق التقييم" : "🟢 فتح التقييم"}
                </button>
              </div>
              {evaluationMsg && (
                <p className="mt-4 text-sm font-medium text-green-700 bg-green-50 rounded-lg py-2 px-4">{evaluationMsg}</p>
              )}
            </div>

            {/* Averages summary */}
            {evaluations.length > 0 && (() => {
              const avg = (key: string) => {
                const vals = evaluations.map((e) => e[key]).filter(Boolean);
                return vals.length ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : "—";
              };
              return (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold mb-4">متوسط التقييمات ({evaluations.length} مشارك)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { key: "trainer_rating",      label: "أداء المدرب" },
                      { key: "interaction_rating",  label: "التفاعل الجماعي" },
                      { key: "content_rating",      label: "جودة المحتوى" },
                      { key: "facilities_rating",   label: "التجهيزات" },
                      { key: "benefit_rating",      label: "مدى الاستفادة" },
                    ].map(({ key, label }) => (
                      <div key={key} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                        <p className="text-2xl font-bold text-black">{avg(key)}</p>
                        <p className="text-xs text-gray-500 mt-1">{label}</p>
                        <p className="text-xs text-gray-300">من 5</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Evaluations table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold">التقييمات الواردة ({evaluations.length})</h2>
              </div>
              {evaluations.length === 0 ? (
                <p className="text-center text-gray-400 py-12 text-sm">لا توجد تقييمات بعد</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs">
                      <tr>
                        <th className="px-4 py-2 text-right">الاسم</th>
                        <th className="px-4 py-2 text-center">المدرب</th>
                        <th className="px-4 py-2 text-center">التفاعل</th>
                        <th className="px-4 py-2 text-center">المحتوى</th>
                        <th className="px-4 py-2 text-center">التجهيزات</th>
                        <th className="px-4 py-2 text-center">الاستفادة</th>
                        <th className="px-4 py-2 text-right">ملاحظات</th>
                        <th className="px-4 py-2 text-right">التاريخ</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {evaluations.map((ev) => (
                        <tr key={ev.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{ev.user_name || <span className="text-gray-300 text-xs">مجهول</span>}</td>
                          <td className="px-4 py-3 text-center font-bold">{ev.trainer_rating}/5</td>
                          <td className="px-4 py-3 text-center font-bold">{ev.interaction_rating}/5</td>
                          <td className="px-4 py-3 text-center font-bold">{ev.content_rating}/5</td>
                          <td className="px-4 py-3 text-center font-bold">{ev.facilities_rating}/5</td>
                          <td className="px-4 py-3 text-center font-bold">{ev.benefit_rating}/5</td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{ev.comments || "—"}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{new Date(ev.created_at).toLocaleDateString("ar-SA")}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => deleteEvaluation(ev.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">حذف</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── Projects ── */}
        {activeTab === "projects" && (
          <div className="space-y-5">

            {selectedProject ? (
              <div className="space-y-5">
                <button onClick={() => { setSelectedProject(null); setProjectEvals([]); }}
                  className="text-sm text-gray-500 hover:text-black flex items-center gap-1">← رجوع للمشاريع</button>

                {/* Project info */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-lg">{selectedProject.title}</h2>
                      {selectedProject.description && <p className="text-gray-400 text-sm mt-1">{selectedProject.description}</p>}
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                          <User className="w-3 h-3" /> {selectedProject.owner_name || "مجهول"}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${selectedProject.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {selectedProject.is_active
                            ? <><CheckCircle2 className="w-3 h-3" /> نشط</>
                            : <><Clock className="w-3 h-3" /> بانتظار الموافقة</>}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 mr-4 flex-wrap justify-end">
                      <button onClick={() => window.open(`/admin/project-report/${selectedProject.id}`, "_blank")}
                        className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-700 transition">
                        تقرير
                      </button>
                      <button onClick={() => toggleProjectActive(selectedProject.id, selectedProject.is_active)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${selectedProject.is_active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-600 text-white hover:bg-green-700"}`}>
                        {selectedProject.is_active ? "إخفاء" : "نشر"}
                      </button>
                      <button onClick={() => deleteProject(selectedProject.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">حذف</button>
                    </div>
                  </div>
                </div>

                {/* Evaluations for this project */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold">التقييمات الواردة ({projectEvals.length})</h3>
                    {projectEvalsLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />}
                  </div>

                  {/* Averages */}
                  {projectEvals.length > 0 && (() => {
                    const CRIT = ["purpose","return","obtainability","design","users","competition","timeline"];
                    const CRIT_LABELS: Record<string,string> = { purpose:"الغرض", return:"العائد", obtainability:"التمكن", design:"التصميم", users:"المستخدمون", competition:"المنافسون", timeline:"الخط الزمني" };
                    const avg = (key: string) => {
                      const vals = projectEvals.map((e) => e[`${key}_rating`]).filter((v) => v != null);
                      return vals.length ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : "—";
                    };
                    const allVals = projectEvals.flatMap((e) => CRIT.map((k) => e[`${k}_rating`]).filter((v) => v != null));
                    const overall = allVals.length ? (allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(1) : "—";
                    return (
                      <div className="p-5 border-b border-gray-100">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                          <div className="sm:col-span-1 bg-black text-white rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold">{overall}</p>
                            <p className="text-xs text-gray-300 mt-1">المتوسط العام /10</p>
                          </div>
                          {CRIT.slice(0,3).map((k) => (
                            <div key={k} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                              <p className="text-xl font-bold">{avg(k)}</p>
                              <p className="text-xs text-gray-500 mt-1">{CRIT_LABELS[k]}</p>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {CRIT.slice(3).map((k) => (
                            <div key={k} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                              <p className="text-xl font-bold">{avg(k)}</p>
                              <p className="text-xs text-gray-500 mt-1">{CRIT_LABELS[k]}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {projectEvals.length === 0 && !projectEvalsLoading ? (
                    <p className="text-center text-gray-400 py-10 text-sm">لا توجد تقييمات بعد</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {projectEvals.map((ev) => {
                        const CRIT = ["purpose","return","obtainability","design","users","competition","timeline"];
                        const CRIT_LABELS: Record<string,string> = { purpose:"الغرض", return:"العائد", obtainability:"التمكن", design:"التصميم", users:"المستخدمون", competition:"المنافسون", timeline:"الخط الزمني" };
                        const evaluator = siteUsers.find((u) => u.id === ev.evaluator_id);
                        return (
                          <div key={ev.id} className="px-5 py-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                {ev.project_name && <p className="font-bold text-sm">{ev.project_name}</p>}
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  {ev.person_name && <span className="text-xs text-gray-600 font-medium">{ev.person_name}</span>}
                                  {evaluator && (
                                    <span className="text-xs text-gray-400" dir="ltr">({evaluator.email})</span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-gray-400 flex-shrink-0">{new Date(ev.created_at).toLocaleDateString("ar-SA")}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {CRIT.map((k) => ev[`${k}_rating`] != null && (
                                <span key={k} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                  {CRIT_LABELS[k]}: {ev[`${k}_rating`]}/10
                                </span>
                              ))}
                            </div>
                            {CRIT.map((k) => ev[`${k}_notes`] && (
                              <p key={k} className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5">
                                <span className="font-semibold">{CRIT_LABELS[k]}:</span> {ev[`${k}_notes`]}
                              </p>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> بانتظار الموافقة: {adminProjects.filter((p) => !p.is_active).length}
                  </span>
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> نشط: {adminProjects.filter((p) => p.is_active).length}
                  </span>
                  <button onClick={() => window.open("/admin/results", "_blank")}
                    className="mr-auto text-xs bg-black text-white px-4 py-1.5 rounded-lg font-bold hover:bg-gray-800 transition">
                    🏆 النتائج
                  </button>
                </div>

                {adminProjects.length === 0 ? (
                  <div className="bg-white rounded-xl border border-dashed border-gray-200 p-14 text-center">
                    <FolderOpen className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="font-bold text-gray-700">لا توجد مشاريع مقدّمة بعد</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100">
                      <h2 className="font-bold">المشاريع المقدّمة ({adminProjects.length})</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {adminProjects.map((project) => (
                        <div key={project.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition">
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openProjectDetail(project)}>
                            <p className="font-medium text-sm">{project.title}</p>
                            <div className="flex gap-2 mt-1 items-center flex-wrap">
                              <span className="text-xs text-gray-400 flex items-center gap-1"><User className="w-3 h-3" /> {project.owner_name || "مجهول"}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${project.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {project.is_active ? "نشط" : "بانتظار الموافقة"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => window.open(`/admin/qr/${project.id}`, "_blank")}
                              className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-1">
                              <QrCode className="w-3 h-3" /> QR
                            </button>
                            <button onClick={() => toggleProjectActive(project.id, project.is_active)}
                              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${project.is_active ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600" : "bg-green-600 text-white hover:bg-green-700"}`}>
                              {project.is_active ? "إخفاء" : "نشر"}
                            </button>
                            <button onClick={() => openProjectDetail(project)} className="text-xs text-primary hover:underline">تفاصيل</button>
                            <button onClick={() => deleteProject(project.id)} className="text-xs text-red-400 hover:text-red-600">حذف</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
      </main>

      {/* QR Modal */}
      {qrProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setQrProject(null)}>
          <div className="bg-white rounded-3xl p-10 text-center max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="text-right">
                <p className="text-xs text-gray-400">رمز تقييم مشروع</p>
                <p className="font-bold text-gray-900">{qrProject.title}</p>
              </div>
              <button onClick={() => setQrProject(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center p-4 bg-white rounded-2xl border border-gray-100">
              <QRCode
                value={`${typeof window !== "undefined" ? window.location.origin : "https://thebusinessclock.com"}/evaluate/${qrProject.id}`}
                size={220}
              />
            </div>
            <p className="text-xs text-gray-400 mt-4 break-all" dir="ltr">
              /evaluate/{qrProject.id}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
