"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";

const ForgetPassword = () => {
  const t = useTranslations("auth.forgetPassword");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError("حدث خطأ، تأكد من البريد الإلكتروني وحاول مرة أخرى");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <section className="pt-[120px] lg:pt-[240px]">
        <div className="px-4 xl:container">
          <div className="border-b pb-24">
            <div className="mx-auto max-w-[750px] rounded border bg-white px-6 py-10 sm:p-[70px] text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-bold mb-2">تحقق من بريدك الإلكتروني</h2>
              <p className="text-body-color">
                أرسلنا رابط إعادة تعيين كلمة المرور على <strong>{email}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-[120px] lg:pt-[240px]">
      <div className="px-4 xl:container">
        <div className="border-b pb-24">
          <div className="mx-auto max-w-[750px] rounded border bg-white px-6 py-10 sm:p-[70px]">
            <div className="mb-8 text-center">
              <h1 className="font-heading mb-3 text-2xl font-medium text-black sm:text-3xl lg:text-2xl xl:text-[40px] xl:leading-tight">
                {t("title")}
              </h1>
              <p className="text-center text-body-color md:px-20">
                {t("description")}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 pb-7 lg:pb-12">
                <input
                  type="email"
                  placeholder={t("form.email.placeholder")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  required
                  dir="ltr"
                  className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                />
                {error && <p className="text-sm text-red-500 bg-red-50 rounded px-3 py-2">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded bg-primary px-14 py-[14px] text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "..." : t("button")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
