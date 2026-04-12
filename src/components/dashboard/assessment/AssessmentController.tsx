"use client";

import { useDispatch, useSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import AssessmentForm from "./Form";
import Survey from "./Survey";
import { updateAssessmentStarted } from "@/store/assessmentForm/AssessmentForm";
import { handleNewChat } from "../chatbot/helpers/chats";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";

type Step = "entry" | "register" | "setup" | "survey";

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
}

const countries = [
  { code: "+974", flag: "🇶🇦", name: "قطر" },
  { code: "+966", flag: "🇸🇦", name: "السعودية" },
  { code: "+971", flag: "🇦🇪", name: "الإمارات" },
  { code: "+965", flag: "🇰🇼", name: "الكويت" },
  { code: "+968", flag: "🇴🇲", name: "عُمان" },
  { code: "+973", flag: "🇧🇭", name: "البحرين" },
  { code: "+962", flag: "🇯🇴", name: "الأردن" },
  { code: "+961", flag: "🇱🇧", name: "لبنان" },
  { code: "+963", flag: "🇸🇾", name: "سوريا" },
  { code: "+964", flag: "🇮🇶", name: "العراق" },
  { code: "+20",  flag: "🇪🇬", name: "مصر" },
  { code: "+212", flag: "🇲🇦", name: "المغرب" },
  { code: "+213", flag: "🇩🇿", name: "الجزائر" },
  { code: "+216", flag: "🇹🇳", name: "تونس" },
  { code: "+249", flag: "🇸🇩", name: "السودان" },
  { code: "+967", flag: "🇾🇪", name: "اليمن" },
  { code: "+1",   flag: "🇺🇸", name: "الولايات المتحدة" },
  { code: "+44",  flag: "🇬🇧", name: "المملكة المتحدة" },
  { code: "+49",  flag: "🇩🇪", name: "ألمانيا" },
  { code: "+33",  flag: "🇫🇷", name: "فرنسا" },
  { code: "+90",  flag: "🇹🇷", name: "تركيا" },
  { code: "+92",  flag: "🇵🇰", name: "باكستان" },
  { code: "+91",  flag: "🇮🇳", name: "الهند" },
];

function AssessmentController() {
  const { isAssessmentStarted } = useSelector((state) => state.assessmentForm);
  const { user, loading } = useSupabaseAuth();
  const dispatch = useDispatch();

  const [step, setStep] = useState<Step>("entry");
  const [regData, setRegData] = useState({
    firstName: "", lastName: "", email: "", password: "",
    phone: "", countryCode: "+974",
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const resetAssessmentForm = () => dispatch(updateAssessmentStarted(false));

  useEffect(() => {
    return () => {
      handleNewChat(dispatch);
      resetAssessmentForm();
    };
  }, []);

  // Already logged in → skip to setup
  useEffect(() => {
    if (!loading && user && step === "entry") setStep("setup");
  }, [user, loading]);

  // Survey started
  useEffect(() => {
    if (isAssessmentStarted) setStep("survey");
  }, [isAssessmentStarted]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!regData.firstName.trim()) errors.firstName = "مطلوب";
    if (!regData.lastName.trim()) errors.lastName = "مطلوب";
    if (!regData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regData.email))
      errors.email = "بريد إلكتروني غير صحيح";
    if (regData.password.length < 6) errors.password = "6 أحرف على الأقل";
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setRegLoading(true);
    setRegError("");
    const fullName = `${regData.firstName} ${regData.lastName}`.trim();
    const phone = regData.phone ? `${regData.countryCode}${regData.phone}` : "";
    const { error } = await supabase.auth.signUp({
      email: regData.email,
      password: regData.password,
      options: {
        data: { full_name: fullName, first_name: regData.firstName, phone },
      },
    });
    if (error) {
      setRegError(error.message === "User already registered" ? "هذا البريد مسجل مسبقاً" : error.message);
    } else {
      setStep("setup");
    }
    setRegLoading(false);
  };

  // ── Entry screen ──
  if (step === "entry" && !user) return (
    <div dir="rtl" className="mx-auto mt-5 max-w-[580px] px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">اختبار قياس الجاهزية التجارية</h1>
        <p className="text-gray-500 text-sm">كيف تريد المتابعة؟</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Anonymous */}
        <button
          onClick={() => setStep("setup")}
          className="group bg-white border-2 border-gray-200 text-gray-900 rounded-2xl p-6 text-right hover:border-black transition"
        >
          <div className="text-3xl mb-3">⚡</div>
          <h2 className="font-bold text-lg mb-1">بدون تسجيل</h2>
          <p className="text-gray-500 text-sm leading-relaxed">ابدأ الاختبار مباشرة بدون أي بيانات</p>
          <div className="mt-4 text-xs text-gray-400 group-hover:text-black transition">ابدأ الآن ←</div>
        </button>

        {/* Register */}
        <button
          onClick={() => setStep("register")}
          className="group bg-black text-white rounded-2xl p-6 text-right hover:bg-gray-900 transition"
        >
          <div className="text-3xl mb-3">📋</div>
          <h2 className="font-bold text-lg mb-1">إنشاء حساب</h2>
          <p className="text-gray-400 text-sm leading-relaxed">سجّل بياناتك واحفظ نتائجك ومتابعة تقدمك</p>
          <div className="mt-4 text-xs text-gray-500 group-hover:text-gray-400 transition">تسجيل ←</div>
        </button>

      </div>
    </div>
  );

  // ── Register form ──
  if (step === "register") return (
    <div dir="rtl" className="mx-auto mt-5 max-w-[580px] px-4">
      <button onClick={() => setStep("entry")} className="text-sm text-gray-400 hover:text-black mb-5 flex items-center gap-1">
        ← رجوع
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
        <h2 className="font-bold text-xl mb-1">إنشاء حساب جديد</h2>
        <p className="text-gray-400 text-sm mb-6">بعد التسجيل ستنتقل مباشرة للاختبار</p>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                الاسم الأول <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal"> (EN)</span>
              </label>
              <input
                type="text"
                value={regData.firstName}
                onChange={(e) => setRegData(p => ({ ...p, firstName: e.target.value.replace(/[^\x00-\x7F]/g, "") }))}
                placeholder="First Name"
                dir="ltr"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black ${regErrors.firstName ? "border-red-400" : "border-gray-300"}`}
              />
              {regErrors.firstName && <p className="text-red-500 text-xs mt-0.5">{regErrors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                الاسم الأخير <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal"> (EN)</span>
              </label>
              <input
                type="text"
                value={regData.lastName}
                onChange={(e) => setRegData(p => ({ ...p, lastName: e.target.value.replace(/[^\x00-\x7F]/g, "") }))}
                placeholder="Last Name"
                dir="ltr"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black ${regErrors.lastName ? "border-red-400" : "border-gray-300"}`}
              />
              {regErrors.lastName && <p className="text-red-500 text-xs mt-0.5">{regErrors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">البريد الإلكتروني <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={regData.email}
              onChange={(e) => setRegData(p => ({ ...p, email: e.target.value }))}
              placeholder="example@email.com"
              dir="ltr"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black ${regErrors.email ? "border-red-400" : "border-gray-300"}`}
            />
            {regErrors.email && <p className="text-red-500 text-xs mt-0.5">{regErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">كلمة المرور <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={regData.password}
              onChange={(e) => setRegData(p => ({ ...p, password: e.target.value }))}
              placeholder="6 أحرف على الأقل"
              dir="ltr"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black ${regErrors.password ? "border-red-400" : "border-gray-300"}`}
            />
            {regErrors.password && <p className="text-red-500 text-xs mt-0.5">{regErrors.password}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              رقم الهاتف <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <div className="flex gap-2">
              <select
                value={regData.countryCode}
                onChange={(e) => setRegData(p => ({ ...p, countryCode: e.target.value }))}
                dir="ltr"
                className="border border-gray-300 rounded-xl px-2 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black bg-white w-[120px] flex-shrink-0"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input
                type="tel"
                value={regData.phone}
                onChange={(e) => setRegData(p => ({ ...p, phone: e.target.value.replace(/[^0-9]/g, "") }))}
                placeholder="XXXX XXXX"
                dir="ltr"
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {regError && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-red-600">{regError}</div>
          )}

          <button
            type="submit"
            disabled={regLoading}
            className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {regLoading ? "جاري التسجيل..." : "تسجيل والمتابعة للاختبار ←"}
          </button>

          <p className="text-center text-xs text-gray-400">
            لديك حساب؟{" "}
            <a href="/auth/signin" className="text-black font-medium hover:underline">سجّل دخولك</a>
          </p>
        </form>
      </div>
    </div>
  );

  // ── Setup ──
  if (step === "setup") return <AssessmentForm />;

  // ── Survey ──
  return <Survey />;
}

export default AssessmentController;
