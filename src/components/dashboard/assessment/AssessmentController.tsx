"use client";

import { useDispatch, useSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import AssessmentForm from "./Form";
import Survey from "./Survey";
import { updateAssessmentStarted } from "@/store/assessmentForm/AssessmentForm";
import { handleNewChat } from "../chatbot/helpers/chats";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import { useTranslations, useLocale } from "next-intl";
import { Zap, UserPlus, MailCheck } from "lucide-react";

type Step = "entry" | "register" | "emailSent" | "setup" | "survey";

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
  const t = useTranslations("assessment");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

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
    if (!regData.firstName.trim()) errors.firstName = t("registerForm.required");
    if (!regData.lastName.trim()) errors.lastName = t("registerForm.required");
    if (!regData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regData.email))
      errors.email = t("registerForm.invalidEmail");
    if (regData.password.length < 6) errors.password = t("registerForm.passwordMin");
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
      setRegError(error.message === "User already registered" ? t("registerForm.alreadyRegistered") : error.message);
    } else {
      setStep("emailSent");
    }
    setRegLoading(false);
  };

  // ── Entry screen ──
  if (step === "entry" && !user) return (
    <div dir={dir} className="mx-auto mt-5 max-w-[580px] px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("entry.title")}</h1>
        <p className="text-gray-500 text-sm">{t("entry.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Anonymous */}
        <button
          onClick={() => setStep("setup")}
          className="group bg-white border-2 border-gray-200 text-gray-900 rounded-2xl p-6 text-start hover:border-black transition"
        >
          <div className="mb-3">
            <Zap className="w-8 h-8 text-gray-700" />
          </div>
          <h2 className="font-bold text-lg mb-1">{t("entry.guestTitle")}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{t("entry.guestDesc")}</p>
          <div className="mt-4 text-xs text-gray-400 group-hover:text-black transition">{t("entry.guestCta")}</div>
        </button>

        {/* Register */}
        <button
          onClick={() => setStep("register")}
          className="group bg-black text-white rounded-2xl p-6 text-start hover:bg-gray-900 transition"
        >
          <div className="mb-3">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-bold text-lg mb-1">{t("entry.registerTitle")}</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{t("entry.registerDesc")}</p>
          <div className="mt-4 text-xs text-gray-500 group-hover:text-gray-400 transition">{t("entry.registerCta")}</div>
        </button>

      </div>
    </div>
  );

  // ── Register form ──
  if (step === "register") return (
    <div dir={dir} className="mx-auto mt-5 max-w-[580px] px-4">
      <button onClick={() => setStep("entry")} className="text-sm text-gray-400 hover:text-black mb-5 flex items-center gap-1">
        {t("registerForm.back")}
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
        <h2 className="font-bold text-xl mb-1">{t("registerForm.title")}</h2>
        <p className="text-gray-400 text-sm mb-6">{t("registerForm.subtitle")}</p>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("registerForm.firstName")} <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal"> {t("registerForm.nameNote")}</span>
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
                {t("registerForm.lastName")} <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal"> {t("registerForm.nameNote")}</span>
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
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("registerForm.emailLabel")} <span className="text-red-500">*</span></label>
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
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("registerForm.passwordLabel")} <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={regData.password}
              onChange={(e) => setRegData(p => ({ ...p, password: e.target.value }))}
              placeholder={t("registerForm.passwordPlaceholder")}
              dir="ltr"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black ${regErrors.password ? "border-red-400" : "border-gray-300"}`}
            />
            {regErrors.password && <p className="text-red-500 text-xs mt-0.5">{regErrors.password}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("registerForm.phoneLabel")} <span className="text-gray-400 font-normal">{t("registerForm.phoneOptional")}</span>
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
            {regLoading ? t("registerForm.submitting") : t("registerForm.submit")}
          </button>

          <p className="text-center text-xs text-gray-400">
            {t("registerForm.haveAccount")}{" "}
            <a href="/auth/signin" className="text-black font-medium hover:underline">{t("registerForm.signIn")}</a>
          </p>
        </form>
      </div>
    </div>
  );

  // ── Email sent ──
  if (step === "emailSent") return (
    <div dir={dir} className="mx-auto mt-5 max-w-[480px] px-4 text-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
        <div className="flex justify-center mb-4">
          <MailCheck className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="font-bold text-xl text-gray-900 mb-2">{t("registerForm.emailSentTitle")}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">{t("registerForm.emailSentDesc")}</p>
        <p className="text-gray-400 text-xs mb-6">{t("registerForm.emailSentSpam")}</p>
        <a
          href="/auth/signin"
          className="inline-block bg-black text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-gray-800 transition"
        >
          {t("registerForm.goToSignIn")}
        </a>
      </div>
    </div>
  );

  // ── Setup ──
  if (step === "setup") return <AssessmentForm />;

  // ── Survey ──
  return <Survey />;
}

export default AssessmentController;
