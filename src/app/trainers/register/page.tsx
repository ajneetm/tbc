"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Step = "form" | "success";

export default function TrainerRegisterPage() {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialty: "",
    bio: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (form.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);

    // Create Supabase auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name, first_name: form.name.split(" ")[0], phone: form.phone },
      },
    });

    if (authError) {
      setError(authError.message === "User already registered" ? "هذا الإيميل مسجل مسبقاً" : authError.message);
      setLoading(false);
      return;
    }

    // Insert into trainers table with pending status
    const { error: dbError } = await supabase.from("trainers").insert({
      name: form.name,
      email: form.email.toLowerCase(),
      phone: form.phone,
      specialty: form.specialty,
      bio: form.bio,
      status: "pending",
    });

    if (dbError) {
      setError("حدث خطأ أثناء حفظ بياناتك. يرجى التواصل مع الإدارة.");
      setLoading(false);
      return;
    }

    // Sign out so they wait for approval
    await supabase.auth.signOut();
    setStep("success");
    setLoading(false);
  };

  const specialties = [
    "ريادة الأعمال",
    "التسويق الرقمي",
    "الإدارة المالية",
    "التطوير الذاتي",
    "إدارة الموارد البشرية",
    "التخطيط الاستراتيجي",
    "القانون التجاري",
    "التحول الرقمي",
    "أخرى",
  ];

  if (step === "success") return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center font-[Tajawal] px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          سيقوم فريق أجني بمراجعة طلبك والتواصل معك قريباً على بريدك الإلكتروني.
          بعد الموافقة ستتمكن من الدخول إلى لوحة المدرب.
        </p>
        <Link href="/" className="inline-block rounded-xl bg-black text-white px-8 py-2.5 text-sm font-medium hover:bg-gray-800 transition">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-[Tajawal]">

      {/* Header */}
      <div className="bg-black text-white py-5 px-6 text-center">
        <h1 className="text-xl font-bold">بوابة تسجيل المدربين</h1>
        <p className="text-gray-400 text-sm mt-1">أجني لدعم الأعمال</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">ℹ️</span>
          <p>سيتم مراجعة طلبك من قِبل إدارة أجني. بعد القبول ستتمكن من الدخول إلى لوحة المدرب باستخدام بريدك الإلكتروني وكلمة المرور.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">

          <h2 className="font-bold text-lg text-gray-900 mb-1">المعلومات الشخصية</h2>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم الكامل <span className="text-red-500">*</span></label>
            <input
              required
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="محمد أحمد العلي"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني <span className="text-red-500">*</span></label>
              <input
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="example@email.com"
                dir="ltr"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهاتف <span className="text-red-500">*</span></label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+974 XXXX XXXX"
                dir="ltr"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">كلمة المرور <span className="text-red-500">*</span></label>
              <input
                required
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="6 أحرف على الأقل"
                dir="ltr"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">تأكيد كلمة المرور <span className="text-red-500">*</span></label>
              <input
                required
                type="password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                placeholder="أعد كتابة كلمة المرور"
                dir="ltr"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <hr className="border-gray-100 my-2" />
          <h2 className="font-bold text-lg text-gray-900 mb-1">المعلومات المهنية</h2>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">التخصص <span className="text-red-500">*</span></label>
            <select
              required
              value={form.specialty}
              onChange={set("specialty")}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="">اختر تخصصك</option>
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">نبذة مختصرة عن خبرتك <span className="text-red-500">*</span></label>
            <textarea
              required
              value={form.bio}
              onChange={set("bio")}
              rows={4}
              placeholder="اكتب هنا نبذة عن خبرتك التدريبية وإنجازاتك..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "جاري إرسال الطلب..." : "إرسال طلب التسجيل"}
          </button>

          <p className="text-center text-xs text-gray-400">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/signin" className="text-black font-medium hover:underline">سجّل دخولك</Link>
          </p>

        </form>
      </div>
    </div>
  );
}
