"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function QuizAuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check if email is in allowed list
    const { data, error: dbError } = await supabase
      .from("allowed_emails")
      .select("email")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (dbError || !data) {
      setError("هذا الإيميل غير مسجّل في البرنامج. تواصل مع المدرب.");
      setLoading(false);
      return;
    }

    // Send magic link
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/quiz`,
      },
    });

    if (authError) {
      setError("حدث خطأ، حاول مرة أخرى.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center font-[Tajawal]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold mb-2">تحقق من إيميلك</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            أرسلنا رابط دخول مباشر على<br />
            <strong className="text-black">{email}</strong><br /><br />
            افتح الإيميل واضغط على الرابط للدخول للاختبار
          </p>
          <button
            onClick={() => { setSent(false); setEmail(""); }}
            className="mt-6 text-sm text-gray-400 hover:text-black transition-colors underline"
          >
            تغيير الإيميل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center font-[Tajawal]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">⏰</span>
          </div>
          <h1 className="text-2xl font-bold">اغتنم الفرص التجارية</h1>
          <p className="text-gray-400 text-sm mt-1">نموذج القياس المعرفي – 5 أيام</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              dir="ltr"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "إرسال رابط الدخول"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          سيصلك رابط مباشر على إيميلك للدخول للاختبار
        </p>
      </div>
    </div>
  );
}
