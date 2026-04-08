"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      else router.push("/auth/forget-password");
    });
  }, [router]);

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
      router.push("/auth/signin");
    }
    setLoading(false);
  };

  if (!ready) return null;

  return (
    <section className="pt-[120px] lg:pt-[240px]">
      <div className="px-4 xl:container">
        <div className="border-b pb-24">
          <div className="mx-auto max-w-[750px] rounded border bg-white px-6 py-10 sm:p-[70px]">
            <div className="mb-8 text-center">
              <h1 className="font-heading mb-3 text-2xl font-medium text-black sm:text-3xl xl:text-[40px] xl:leading-tight">
                تعيين كلمة مرور جديدة
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 pb-7">
                <input
                  type="password"
                  placeholder="كلمة المرور الجديدة"
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
                {error && <p className="text-sm text-red-500 bg-red-50 rounded px-3 py-2">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded bg-primary px-14 py-[14px] text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "..." : "حفظ كلمة المرور"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
