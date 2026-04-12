"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Handle Supabase recovery token from URL hash
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      } else if (session) {
        setReady(true);
      }
    });

    // Also check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== rePassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("حدث خطأ، حاول مرة أخرى");
    } else {
      setDone(true);
      setTimeout(() => router.push("/auth/signin"), 2500);
    }
    setLoading(false);
  };

  if (done) return (
    <section className="pt-[120px] lg:pt-[240px]">
      <div className="px-4 xl:container">
        <div className="border-b pb-24">
          <div className="mx-auto max-w-[750px] rounded border bg-white px-6 py-10 sm:p-[70px] text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">تم تغيير كلمة المرور</h2>
            <p className="text-gray-500 text-sm">سيتم تحويلك لصفحة تسجيل الدخول...</p>
          </div>
        </div>
      </div>
    </section>
  );

  if (!ready) return (
    <section className="pt-[120px] lg:pt-[240px]">
      <div className="px-4 xl:container">
        <div className="border-b pb-24">
          <div className="mx-auto max-w-[750px] rounded border bg-white px-6 py-10 sm:p-[70px] text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-gray-500 text-sm">جاري التحقق من الرابط...</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="pt-[120px] lg:pt-[240px]">
      <div className="px-4 xl:container">
        <div className="border-b pb-24">
          <div className="mx-auto max-w-[750px] rounded border bg-white px-6 py-10 sm:p-[70px]">
            <div className="mb-8 text-center">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="font-heading mb-3 text-2xl font-medium text-black sm:text-3xl xl:text-[40px] xl:leading-tight">
                تعيين كلمة مرور جديدة
              </h1>
              <p className="text-gray-500 text-sm">أدخل كلمة المرور الجديدة</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 pb-7">
                <input
                  type="password"
                  placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                />
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  required
                  className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                />
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 rounded px-3 py-2">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded bg-primary px-14 py-[14px] text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
