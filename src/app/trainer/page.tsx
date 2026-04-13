"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Tab =
  | "profile"
  | "available-courses"
  | "my-courses"
  | "assessments"
  | "general-agreement"
  | "confidentiality"
  | "policies"
  | "certificates";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "profile",           label: "الملف الشخصي",      icon: "👤" },
  { key: "available-courses", label: "الدورات المتاحة",   icon: "📚" },
  { key: "my-courses",        label: "الدورات المقدمة",   icon: "🎯" },
  { key: "assessments",       label: "الاختبارات",        icon: "📋" },
  { key: "general-agreement", label: "الاتفاقية العامة",  icon: "📄" },
  { key: "confidentiality",   label: "الاتفاقية السرية",  icon: "🔒" },
  { key: "policies",          label: "السياسات والضوابط", icon: "📜" },
  { key: "certificates",      label: "الشهادات",          icon: "🏅" },
];

const surveyTypeLabel = (t: string) =>
  t === "explorers" ? "مستكشف" : t === "entrepreneurs" ? "رائد أعمال" : "صاحب شركة/مدير تنفيذي";

export default function TrainerPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);
  const [trainerProfile, setTrainerProfile] = useState<any>(null);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [trainees, setTrainees] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [issuingCert, setIssuingCert] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { router.replace("/auth/signin"); return; }

      const email = user.email?.toLowerCase() || "";
      if (ADMIN_EMAILS.includes(email)) { router.replace("/admin"); return; }

      const { data: trainer } = await supabase
        .from("trainers")
        .select("*")
        .ilike("email", email)
        .single();

      if (!trainer || trainer.status !== "active") { router.replace("/dashboard/profile"); return; }

      setTrainerProfile({ ...trainer, authEmail: user.email });

      const [workshopsRes, traineesRes, certsRes] = await Promise.all([
        supabase.from("workshops").select("id, name, description, category, duration").order("created_at", { ascending: false }),
        supabase.from("trainer_trainees").select("*, survey_results(*)").eq("trainer_id", trainer.id),
        supabase.from("certificates").select("*").eq("trainer_id", trainer.id).order("issued_at", { ascending: false }),
      ]);

      if (workshopsRes.data) setWorkshops(workshopsRes.data);
      if (traineesRes.data) setTrainees(traineesRes.data);
      if (certsRes.data) setCertificates(certsRes.data);
      setLoading(false);
    };
    init();
  }, []);

  const issueCertificate = async (traineeId: string, traineeName: string, traineeEmail: string) => {
    setIssuingCert(traineeId);
    const { error } = await supabase.from("certificates").insert({
      trainer_id: trainerProfile.id,
      trainee_id: traineeId,
      trainee_name: traineeName,
      trainee_email: traineeEmail,
      trainer_name: trainerProfile.name,
      issued_at: new Date().toISOString(),
    });
    if (!error) {
      const { data } = await supabase.from("certificates").select("*").eq("trainer_id", trainerProfile.id).order("issued_at", { ascending: false });
      if (data) setCertificates(data);
    }
    setIssuingCert(null);
  };

  const revokeCertificate = async (certId: string) => {
    if (!confirm("إلغاء الشهادة؟")) return;
    await supabase.from("certificates").delete().eq("id", certId);
    setCertificates(prev => prev.filter(c => c.id !== certId));
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
    </div>
  );

  const activeTabObj = tabs.find(t => t.key === activeTab)!;
  const certifiedIds = new Set(certificates.map(c => c.trainee_id));

  return (
    <div dir="rtl" className="h-screen overflow-hidden bg-gray-100 font-[Tajawal] flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-black flex flex-col h-full overflow-y-auto">

        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {trainerProfile?.name?.charAt(0) || "م"}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight truncate">{trainerProfile?.name}</p>
              <p className="text-gray-400 text-xs mt-0.5 truncate">{trainerProfile?.specialty || "مدرب"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-right ${
                activeTab === tab.key
                  ? "bg-white text-black"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
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

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto h-full">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-bold text-gray-900">{activeTabObj.icon} {activeTabObj.label}</h1>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 text-xs font-medium">نشط</span>
            <span className="text-sm text-gray-400">{trainerProfile?.email}</span>
          </div>
        </div>

        <div className="p-8">

          {/* ── الملف الشخصي ── */}
          {activeTab === "profile" && (
            <div className="max-w-3xl space-y-5">
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                    {trainerProfile?.name?.charAt(0) || "م"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{trainerProfile?.name}</h2>
                    <p className="text-gray-500 mt-1">{trainerProfile?.specialty || "—"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "البريد الإلكتروني", value: trainerProfile?.email },
                    { label: "رقم الهاتف",         value: trainerProfile?.phone || "—" },
                    { label: "التخصص",              value: trainerProfile?.specialty || "—" },
                    { label: "تاريخ الانضمام",      value: trainerProfile?.created_at ? new Date(trainerProfile.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }) : "—" },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                      <p className="font-medium text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
                {trainerProfile?.bio && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-2">نبذة شخصية</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{trainerProfile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── الدورات المتاحة ── */}
          {activeTab === "available-courses" && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm mb-2">إجمالي الدورات: <span className="font-bold text-black">{workshops.length}</span></p>
              {workshops.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-3">📚</p>
                  <p className="text-gray-400">لا توجد دورات متاحة حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workshops.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-base leading-snug">{p.name}</h3>
                        {p.category && <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 mr-2 flex-shrink-0">{p.category}</span>}
                      </div>
                      {p.description && <p className="text-gray-500 text-sm mb-3 leading-relaxed">{p.description}</p>}
                      <div className="flex items-center justify-between mt-3">
                        {p.duration && <p className="text-xs text-gray-400">⏱ المدة: {p.duration}</p>}
                        {p.material_url && (
                          <a
                            href={p.material_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition font-medium"
                          >
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

          {/* ── الدورات المقدمة ── */}
          {activeTab === "my-courses" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg">
              <p className="text-5xl mb-4">🎯</p>
              <h2 className="text-lg font-bold text-gray-800 mb-2">الدورات المقدمة</h2>
              <p className="text-gray-400 text-sm">يتم تحديد الدورات المقدمة من قِبل إدارة أجني</p>
            </div>
          )}

          {/* ── الاختبارات ── */}
          {activeTab === "assessments" && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 text-blue-700 rounded-xl p-4 border border-current/10 text-center">
                  <p className="text-2xl font-bold">{trainees.length}</p>
                  <p className="text-xs mt-1 opacity-70">إجمالي المتدربين</p>
                </div>
                <div className="bg-green-50 text-green-700 rounded-xl p-4 border border-current/10 text-center">
                  <p className="text-2xl font-bold">{trainees.filter(t => t.survey_results?.length > 0).length}</p>
                  <p className="text-xs mt-1 opacity-70">أجروا الاختبار</p>
                </div>
                <div className="bg-purple-50 text-purple-700 rounded-xl p-4 border border-current/10 text-center">
                  <p className="text-2xl font-bold">{certifiedIds.size}</p>
                  <p className="text-xs mt-1 opacity-70">حاملو الشهادات</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <h2 className="font-bold">متدربوك</h2>
                </div>
                {trainees.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-3xl mb-3">📋</p>
                    <p className="text-gray-400 text-sm">لم يتم إضافة متدربين بعد</p>
                    <p className="text-gray-300 text-xs mt-1">تواصل مع الإدارة لإضافة متدربيك</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs">
                      <tr>
                        <th className="px-4 py-2 text-right">الاسم</th>
                        <th className="px-4 py-2 text-right">الإيميل</th>
                        <th className="px-4 py-2 text-right">نوع الاختبار</th>
                        <th className="px-4 py-2 text-right">النتيجة</th>
                        <th className="px-4 py-2 text-right">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {trainees.map((t) => {
                        const result = t.survey_results?.[0];
                        return (
                          <tr key={t.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{t.trainee_name || "—"}</td>
                            <td className="px-4 py-3 text-gray-500" dir="ltr">{t.trainee_email}</td>
                            <td className="px-4 py-3">{result ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{surveyTypeLabel(result.survey_type)}</span> : "—"}</td>
                            <td className="px-4 py-3 font-bold">{result ? `${result.total_score}/360` : "لم يؤدِّ"}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{result ? new Date(result.created_at).toLocaleDateString("ar-SA") : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── الاتفاقية العامة ── */}
          {activeTab === "general-agreement" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-3xl">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">الاتفاقية العامة</h2>
              <div className="text-gray-700 leading-loose space-y-5 text-sm">
                <p>تُعدّ هذه الاتفاقية عقداً ملزماً بين المدرب المعتمد ومنصة أجني لدعم الأعمال، وتُحدّد الحقوق والالتزامات المتبادلة بين الطرفين.</p>
                {[
                  { title: "أولاً: التزامات المدرب", items: ["الالتزام بمواعيد الجلسات التدريبية المحددة مسبقاً.", "تقديم المحتوى التدريبي بمستوى احترافي يتوافق مع معايير أجني.", "المحافظة على سرية بيانات المتدربين وعدم إفشائها لأي طرف ثالث.", "الإبلاغ الفوري عن أي إشكاليات تواجه سير العملية التدريبية.", "الحرص على تطوير المهارات الذاتية بصفة مستمرة."] },
                  { title: "ثانياً: التزامات منصة أجني", items: ["توفير البيئة التدريبية الملائمة والمواد اللازمة.", "صرف المستحقات المالية في المواعيد المتفق عليها.", "تقديم الدعم الإداري والفني للمدرب.", "تقييم الأداء بصورة منتظمة وتقديم تغذية راجعة بنّاءة."] },
                ].map((section) => (
                  <div key={section.title}>
                    <h3 className="font-bold text-gray-900 mb-3">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-2"><span className="flex-shrink-0 mt-0.5">•</span><span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">ثالثاً: مدة الاتفاقية</h3>
                  <p>تسري هذه الاتفاقية لمدة سنة قابلة للتجديد بموافقة الطرفين، ويحق لأي من الطرفين إنهاؤها بإشعار كتابي مسبق لا يقل عن ثلاثين يوماً.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── الاتفاقية السرية ── */}
          {activeTab === "confidentiality" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-3xl">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">اتفاقية السرية وعدم الإفصاح</h2>
              <div className="text-gray-700 leading-loose space-y-5 text-sm">
                <p>يُقرّ المدرب المعتمد بالتزامه التام بسرية جميع المعلومات التي يطّلع عليها خلال فترة عمله مع منصة أجني لدعم الأعمال.</p>
                {[
                  { title: "أولاً: نطاق السرية", items: ["بيانات المتدربين الشخصية ونتائج اختباراتهم وتقاريرهم.", "المناهج والمواد التدريبية الخاصة بمنصة أجني.", "الخطط التجارية والاستراتيجيات والمعلومات المالية.", "قواعد بيانات العملاء والشركاء والموردين.", "أي معلومات تُصنَّف كسرية من قِبل الإدارة."] },
                  { title: "ثانياً: الالتزامات", items: ["عدم الإفصاح عن أي معلومات سرية لأي طرف ثالث دون إذن كتابي مسبق.", "استخدام المعلومات السرية لأغراض العمل فقط.", "اتخاذ جميع الاحتياطات اللازمة لحماية المعلومات السرية.", "إعادة أو إتلاف جميع المواد السرية عند انتهاء التعاقد."] },
                ].map((section) => (
                  <div key={section.title}>
                    <h3 className="font-bold text-gray-900 mb-3">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-2"><span className="flex-shrink-0 mt-0.5">•</span><span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">ثالثاً: مدة الالتزام</h3>
                  <p>يستمر الالتزام لمدة ثلاث سنوات بعد انتهاء العلاقة التعاقدية، وأي خرق يُعرّض المخالف للمساءلة القانونية.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── السياسات والضوابط ── */}
          {activeTab === "policies" && (
            <div className="space-y-4 max-w-3xl">
              {[
                { title: "سياسة الحضور والانضباط", items: ["الالتزام بالحضور في الوقت المحدد لجميع الجلسات التدريبية.", "في حال الغياب الاضطراري، يجب الإشعار قبل 24 ساعة على الأقل.", "لا يُسمح بتجاوز نسبة الغياب 10% من إجمالي ساعات التدريب."] },
                { title: "سياسة جودة التدريب", items: ["تقديم محتوى تدريبي محدّث ومتوافق مع أحدث الممارسات المهنية.", "استخدام أساليب تدريبية متنوعة وتفاعلية.", "إجراء تقييمات دورية للمتدربين ورفع تقارير منتظمة للإدارة.", "الالتزام بالمناهج والمعايير المعتمدة من أجني."] },
                { title: "ضوابط التعامل المهني", items: ["احترام جميع المتدربين وتعزيز بيئة تعليمية إيجابية وآمنة.", "تجنب أي تمييز بسبب الجنس أو الجنسية أو أي اعتبار آخر.", "عدم الترويج لأي أعمال أو خدمات شخصية للمتدربين خلال الجلسات.", "الإفصاح فوراً عن أي تضارب محتمل في المصالح."] },
                { title: "سياسة الملكية الفكرية", items: ["جميع المواد التدريبية المُعدّة بالتعاون مع أجني تُعدّ ملكاً للمنصة.", "لا يحق استخدام الشعارات أو العلامات التجارية لأجني دون إذن رسمي.", "يحتفظ المدرب بحقوق المواد التي أعدّها بشكل مستقل قبل التعاقد."] },
              ].map((section) => (
                <div key={section.title} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-600">
                        <span className="flex-shrink-0 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* ── الشهادات ── */}
          {activeTab === "certificates" && (
            <div className="space-y-5">

              {/* Issued certificates */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold">الشهادات الصادرة ({certificates.length})</h2>
                </div>
                {certificates.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-3xl mb-3">🏅</p>
                    <p className="text-gray-400 text-sm">لم تُصدر أي شهادات بعد</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs">
                      <tr>
                        <th className="px-4 py-2 text-right">الاسم</th>
                        <th className="px-4 py-2 text-right">الإيميل</th>
                        <th className="px-4 py-2 text-right">تاريخ الإصدار</th>
                        <th className="px-4 py-2 text-right">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {certificates.map((cert) => (
                        <tr key={cert.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium flex items-center gap-2">
                            <span className="text-yellow-500">🏅</span>{cert.trainee_name}
                          </td>
                          <td className="px-4 py-3 text-gray-500" dir="ltr">{cert.trainee_email}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{new Date(cert.issued_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => revokeCertificate(cert.id)} className="text-xs text-red-500 hover:text-red-700">إلغاء</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Eligible trainees (completed, not yet certified) */}
              {trainees.filter(t => !certifiedIds.has(t.trainee_id) && t.survey_results?.length > 0).length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100">
                    <h2 className="font-bold text-green-700">✅ مستحقون للشهادة</h2>
                    <p className="text-xs text-gray-400 mt-0.5">أتمّوا الاختبار ولم يحصلوا على شهادة بعد</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs">
                      <tr>
                        <th className="px-4 py-2 text-right">الاسم</th>
                        <th className="px-4 py-2 text-right">الإيميل</th>
                        <th className="px-4 py-2 text-right">النتيجة</th>
                        <th className="px-4 py-2 text-right">إصدار شهادة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {trainees
                        .filter(t => !certifiedIds.has(t.trainee_id) && t.survey_results?.length > 0)
                        .map((t) => {
                          const result = t.survey_results[0];
                          return (
                            <tr key={t.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium">{t.trainee_name}</td>
                              <td className="px-4 py-3 text-gray-500" dir="ltr">{t.trainee_email}</td>
                              <td className="px-4 py-3 font-bold text-primary">{result.total_score}/360</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => issueCertificate(t.trainee_id, t.trainee_name, t.trainee_email)}
                                  disabled={issuingCert === t.trainee_id}
                                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 transition"
                                >
                                  {issuingCert === t.trainee_id ? "جاري..." : "🏅 إصدار شهادة"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

              {trainees.length === 0 && (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                  <p className="text-gray-400 text-sm">لا يوجد متدربون مرتبطون بك بعد</p>
                  <p className="text-gray-300 text-xs mt-1">تواصل مع الإدارة لإضافة متدربيك</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
