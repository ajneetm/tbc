"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MailCheck } from "lucide-react";

export default function Signup() {
  const t = useTranslations("auth.signup");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [visible, setVisible] = useState({ password: false, rePassword: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.rePassword) {
      setError(t("form.rePassword.invalid"));
      return;
    }
    if (form.password.length < 8) {
      setError(t("form.password.min"));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: `${form.first_name} ${form.last_name}`,
          first_name: form.first_name,
          last_name: form.last_name,
        },
      },
    });

    if (error) {
      setError(error.message === "User already registered"
        ? t("alreadyRegistered")
        : t("genericError"));
    } else {
      setEmailSent(true);
    }
    setLoading(false);
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  if (emailSent) {
    return (
      <section className="pt-[120px] lg:pt-[240px]">
        <div className="px-4 xl:container">
          <div className="border-b pb-24">
            <div className="mx-auto max-w-[560px] rounded-2xl border border-gray-200 bg-white px-8 py-12 shadow-sm text-center">
              <div className="flex justify-center mb-5">
                <MailCheck className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="font-bold text-xl text-gray-900 mb-2">{t("emailSentTitle")}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">{t("emailSentDesc")}</p>
              <p className="text-gray-400 text-xs mb-8">{t("emailSentSpam")}</p>
              <Link
                href="/auth/signin"
                className="inline-block bg-black text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition"
              >
                {t("goToSignIn")}
              </Link>
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
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[920px] rounded border bg-white px-6 py-10 sm:px-10 md:p-[70px]">
                <h1 className="mb-8 text-2xl font-medium text-black sm:text-3xl lg:text-2xl xl:text-[40px] xl:leading-tight">
                  {t("title")}
                </h1>

                <form onSubmit={handleSubmit}>
                  <div className="-mx-4 flex flex-wrap">
                    {/* First Name */}
                    <div className="w-full px-4 sm:w-1/2">
                      <div className="mb-10">
                        <label className="mb-2 block text-sm font-medium text-dark">{t("form.first_name.label")}</label>
                        <input
                          value={form.first_name}
                          onChange={set("first_name")}
                          required
                          placeholder={t("form.first_name.placeholder")}
                          className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="w-full px-4 sm:w-1/2">
                      <div className="mb-10">
                        <label className="mb-2 block text-sm font-medium text-dark">{t("form.last_name.label")}</label>
                        <input
                          value={form.last_name}
                          onChange={set("last_name")}
                          required
                          placeholder={t("form.last_name.placeholder")}
                          className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="w-full px-4 sm:w-1/2">
                      <div className="mb-10">
                        <label className="mb-2 block text-sm font-medium text-dark">{t("form.email.label")}</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={set("email")}
                          required
                          placeholder={t("form.email.placeholder")}
                          dir="ltr"
                          className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="relative w-full px-4 sm:w-1/2">
                      <div className="mb-10">
                        <label className="mb-2 block text-sm font-medium text-dark">{t("form.password.label")}</label>
                        <input
                          type={visible.password ? "text" : "password"}
                          value={form.password}
                          onChange={set("password")}
                          required
                          placeholder={t("form.password.placeholder")}
                          className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                        />
                        <button type="button" className="absolute top-[60px] mb-3 mr-3 [inset-inline-end:8px]"
                          onClick={() => setVisible({ ...visible, password: !visible.password })}>
                          {visible.password ? <i className="fa-regular fa-eye" /> : <i className="fa-regular fa-eye-slash" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative w-full px-4 sm:w-1/2">
                      <div className="mb-10">
                        <label className="mb-2 block text-sm font-medium text-dark">{t("form.rePassword.label")}</label>
                        <input
                          type={visible.rePassword ? "text" : "password"}
                          value={form.rePassword}
                          onChange={set("rePassword")}
                          required
                          placeholder={t("form.rePassword.placeholder")}
                          className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                        />
                        <button type="button" className="absolute top-[60px] mb-3 mr-3 [inset-inline-end:8px]"
                          onClick={() => setVisible({ ...visible, rePassword: !visible.rePassword })}>
                          {visible.rePassword ? <i className="fa-regular fa-eye" /> : <i className="fa-regular fa-eye-slash" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="w-full px-4 mb-4">
                        <p className="text-sm text-red-500 bg-red-50 rounded px-3 py-2">{error}</p>
                      </div>
                    )}

                    <div className="w-full px-4">
                      <div className="mb-4">
                        <p className="text-body-color">
                          {t("signin")}{" "}
                          <Link href="/auth/signin" className="text-primary hover:underline">
                            {t("signinLink")}
                          </Link>
                        </p>
                      </div>
                    </div>

                    <div className="w-full px-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center rounded bg-primary px-14 py-[14px] text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                      >
                        {loading ? "..." : t("signupButton")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
