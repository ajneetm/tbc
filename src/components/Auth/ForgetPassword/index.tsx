"use client";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { integrations, messages } from "../../../../integrations.config";
import z from "zod";
import { useTranslations } from "next-intl";

const forgetPasswordSchema = z.object({
  email: z.string({required_error: "form.email.required"}).email("form.email.invalid"),
});

const ForgetPassword = () => {
  const [data, setData] = useState({
    email: "",
  });
  const t = useTranslations("auth.forgetPassword");
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!integrations?.isAuthEnabled) {
      toast.error(messages?.auth);
      return;
    }

    const result = await forgetPasswordSchema.safeParseAsync(data);

    if (!result.success) {
      const firstError = result.error.issues[0];
      console.log(firstError);
      toast.error(t(firstError.message as any));
      return;
    }

    try {
      const res = await axios.post("/api/forget-password/reset", data);

      if (res.status === 404) {
        toast.error(t("form.email.notFound"));
        return;
      }

      if (res.status === 200) {
        toast.success(res.data);
        setData({ email: "" });
      }

      setData({ email: "" });
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

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
              <div className="flex flex-col gap-2 pb-7 lg:justify-between lg:pb-12">
                <input
                  type="email"
                  placeholder={t("form.email.placeholder")}
                  name="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                />

                <button
                  aria-label="reset password"
                  className="inline-flex items-center justify-center rounded bg-primary px-14 py-[14px] text-sm font-semibold text-white"
                  type="submit"
                >
                  {t("button")}
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
