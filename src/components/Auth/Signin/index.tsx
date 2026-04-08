"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Signin() {
  const t = useTranslations("auth.signin");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } else {
      router.push("/dashboard/profile");
    }
    setLoading(false);
  };

  return (
    <section className="pt-[120px] lg:pt-[240px]">
      <div className="px-4 xl:container">
        <div className="border-b pb-20 lg:pb-[130px]">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[920px] rounded border bg-white px-6 py-10 sm:px-10 md:p-[70px]">
                <h1 className="mb-3 text-2xl font-medium text-black sm:text-3xl lg:text-2xl xl:text-[40px] xl:leading-tight">
                  {t("title")}
                </h1>

                <form onSubmit={handleSubmit}>
                  <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4 sm:w-1/2">
                      <div className="mb-10">
                        <label className="mb-2 block text-sm font-medium text-dark">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="example@email.com"
                          dir="ltr"
                          className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="relative w-full px-4 sm:w-1/2">
                      <div className="mb-10">
                        <label className="mb-2 block text-sm font-medium text-dark">
                          {t("form.password.label")}
                        </label>
                        <input
                          type={visiblePassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder={t("form.password.placeholder")}
                          className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          className="absolute top-[60px] mb-3 mr-3 [inset-inline-end:8px]"
                          onClick={() => setVisiblePassword(!visiblePassword)}
                        >
                          {visiblePassword
                            ? <i className="fa-regular fa-eye" />
                            : <i className="fa-regular fa-eye-slash" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="w-full px-4 mb-4">
                        <p className="text-sm text-red-500 bg-red-50 rounded px-3 py-2">{error}</p>
                      </div>
                    )}

                    <div className="w-full px-4">
                      <div className="mb-4 flex flex-wrap justify-between gap-4">
                        <p className="text-body-color">
                          {t("signup")}{" "}
                          <Link href="/auth/signup" className="text-primary hover:underline">
                            {t("signupLink")}
                          </Link>
                        </p>
                        <Link href="/auth/forget-password" className="text-sm text-primary hover:underline">
                          نسيت كلمة المرور؟
                        </Link>
                      </div>
                    </div>

                    <div className="w-full px-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center rounded bg-primary px-14 py-[14px] text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                      >
                        {loading ? "..." : t("signinButton")}
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
