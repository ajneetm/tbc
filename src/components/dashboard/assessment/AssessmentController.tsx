"use client";

import { useDispatch, useSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import AssessmentForm from "./Form";
import Survey from "./Survey";
import { updateAssessmentStarted } from "@/store/assessmentForm/AssessmentForm";
import { handleNewChat } from "../chatbot/helpers/chats";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import { useRouter } from "next/navigation";

type Step = "entry" | "guest-info" | "setup" | "survey";

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
  const router = useRouter();

  const [step, setStep] = useState<Step>("entry");
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: "", lastName: "", email: "", phone: "", countryCode: "+974",
  });
  const [formErrors, setFormErrors] = useState<Partial<GuestInfo>>({});

  const resetAssessmentForm = () => dispatch(updateAssessmentStarted(false));

  useEffect(() => {
    return () => {
      handleNewChat(dispatch);
      resetAssessmentForm();
    };
  }, []);

  // If user is logged in, skip entry → go straight to setup
  useEffect(() => {
    if (!loading && user && step === "entry") {
      setStep("setup");
    }
  }, [user, loading]);

  // When assessment starts (Survey shows), update step
  useEffect(() => {
    if (isAssessmentStarted) setStep("survey");
  }, [isAssessmentStarted]);

  const validateGuestInfo = () => {
    const errors: Partial<GuestInfo> = {};
    if (!guestInfo.firstName.trim()) errors.firstName = "الاسم الأول مطلوب";
    if (!guestInfo.lastName.trim()) errors.lastName = "الاسم الأخير مطلوب";
    if (!guestInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email))
      errors.email = "البريد الإلكتروني غير صحيح";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateGuestInfo()) {
      // Store in sessionStorage for Survey.tsx to use when saving results
      sessionStorage.setItem("guest_info", JSON.stringify({
        name: `${guestInfo.firstName} ${guestInfo.lastName}`,
        email: guestInfo.email,
        phone: guestInfo.phone ? `${guestInfo.countryCode}${guestInfo.phone}` : "",
      }));
      setStep("setup");
    }
  };

  // ── Entry screen ──
  if (step === "entry" && !user) return (
    <div dir="rtl" className="mx-auto mt-5 max-w-[600px] px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">اختبار قياس الجاهزية التجارية</h1>
        <p className="text-gray-500 text-sm">اختر طريقة المتابعة</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* With login */}
        <button
          onClick={() => router.push("/auth/signin")}
          className="group bg-black text-white rounded-2xl p-6 text-right hover:bg-gray-900 transition"
        >
          <div className="text-3xl mb-3">🔑</div>
          <h2 className="font-bold text-lg mb-1">بتسجيل دخول</h2>
          <p className="text-gray-400 text-sm leading-relaxed">سيتم حفظ نتائجك وتقاريرك في حسابك الشخصي</p>
          <div className="mt-4 text-xs text-gray-500 group-hover:text-gray-400">
            تسجيل الدخول ←
          </div>
        </button>

        {/* Without login */}
        <button
          onClick={() => setStep("guest-info")}
          className="group bg-white border-2 border-gray-200 text-gray-900 rounded-2xl p-6 text-right hover:border-black transition"
        >
          <div className="text-3xl mb-3">👤</div>
          <h2 className="font-bold text-lg mb-1">بدون تسجيل دخول</h2>
          <p className="text-gray-500 text-sm leading-relaxed">أجرِ الاختبار مباشرة بدون إنشاء حساب</p>
          <div className="mt-4 text-xs text-gray-400 group-hover:text-black">
            متابعة ←
          </div>
        </button>

      </div>
    </div>
  );

  // ── Guest info form ──
  if (step === "guest-info") return (
    <div dir="rtl" className="mx-auto mt-5 max-w-[600px] px-4">
      <button onClick={() => setStep("entry")} className="text-sm text-gray-400 hover:text-black mb-6 flex items-center gap-1">
        ← رجوع
      </button>
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="font-bold text-xl mb-1">معلوماتك الأساسية</h2>
        <p className="text-gray-400 text-sm mb-6">لن يتم إنشاء حساب، هذه المعلومات لتخصيص تقريرك</p>

        <form onSubmit={handleGuestSubmit} className="space-y-5">

          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                الاسم الأول <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal text-xs mr-1">(بالإنجليزية)</span>
              </label>
              <input
                type="text"
                value={guestInfo.firstName}
                onChange={(e) => setGuestInfo(p => ({ ...p, firstName: e.target.value.replace(/[^\x00-\x7F]/g, "") }))}
                placeholder="First Name"
                dir="ltr"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black ${formErrors.firstName ? "border-red-400" : "border-gray-300"}`}
              />
              {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                الاسم الأخير <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal text-xs mr-1">(بالإنجليزية)</span>
              </label>
              <input
                type="text"
                value={guestInfo.lastName}
                onChange={(e) => setGuestInfo(p => ({ ...p, lastName: e.target.value.replace(/[^\x00-\x7F]/g, "") }))}
                placeholder="Last Name"
                dir="ltr"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black ${formErrors.lastName ? "border-red-400" : "border-gray-300"}`}
              />
              {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              البريد الإلكتروني <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo(p => ({ ...p, email: e.target.value }))}
              placeholder="example@email.com"
              dir="ltr"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black ${formErrors.email ? "border-red-400" : "border-gray-300"}`}
            />
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>

          {/* Phone with country code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              رقم الهاتف <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
            </label>
            <div className="flex gap-2">
              <select
                value={guestInfo.countryCode}
                onChange={(e) => setGuestInfo(p => ({ ...p, countryCode: e.target.value }))}
                className="border border-gray-300 rounded-xl px-2 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black bg-white flex-shrink-0 w-[130px]"
                dir="ltr"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={guestInfo.phone}
                onChange={(e) => setGuestInfo(p => ({ ...p, phone: e.target.value.replace(/[^0-9]/g, "") }))}
                placeholder="XXXX XXXX"
                dir="ltr"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-800 transition">
            متابعة لاختيار نوع الاختبار ←
          </button>
        </form>
      </div>
    </div>
  );

  // ── Setup (survey type + age) ──
  if (step === "setup") return <AssessmentForm guestInfo={user ? undefined : guestInfo} />;

  // ── Survey ──
  return <Survey />;
}

export default AssessmentController;
