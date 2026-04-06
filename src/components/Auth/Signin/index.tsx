"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const signinSchema = z.object({
  username: z
    .string()
    .min(3, "auth.signin.form.username.min")
    .max(255, "auth.signin.form.username.max"),
  password: z.string().min(8, "auth.signin.form.password.min"),
});

export default function Signin() {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const handleVisiblePassword = () => setVisiblePassword(!visiblePassword);
  const router = useRouter();
  const t = useTranslations("auth.signin");
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signinSchema>) {
    signIn("credentials", { ...values, redirect: false }).then((callback) => {
      if (callback?.error) {
        toast.error(t("validation.invalid"));
      }

      if (callback?.ok && !callback?.error) {
        toast.success(t("validation.success"));
        router.push("/auth/success");
      }
    });
  }

  return (
    <section className="pt-[120px] lg:pt-[240px]">
      <div className="px-4 xl:container">
        <div className="border-b pb-20 lg:pb-[130px]">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[920px] rounded border bg-white px-6 py-10 sm:px-10 md:p-[70px]">
                <h1 className="mb-3 text-2xl font-medium text-black  sm:text-3xl lg:text-2xl xl:text-[40px] xl:leading-tight">
                  {t("title")}
                </h1>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="-mx-4 flex flex-wrap">
                      <div className="w-full px-4 sm:w-1/2">
                        <div className="mb-10">
                          <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("form.username.label")}</FormLabel>
                                <FormControl>
                                  <input
                                    {...field}
                                    placeholder={t("form.username.placeholder")}
                                    className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary   "
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="relative w-full px-4 sm:w-1/2">
                        <div className="mb-10">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("form.password.label")}</FormLabel>
                                <FormControl>
                                  <div>
                                    <input
                                      type={
                                        visiblePassword ? "text" : "password"
                                      }
                                      {...field}
                                      placeholder={t("form.password.placeholder")}
                                      className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary   "
                                    />
                                    <button
                                      type="button"
                                      className="absolute top-[60px] mb-3 mr-3 [inset-inline-end:8px]"
                                      onClick={handleVisiblePassword}
                                    >
                                      {visiblePassword ? (
                                        <i className="fa-regular fa-eye" />
                                      ) : (
                                        <i className="fa-regular fa-eye-slash"></i>
                                      )}
                                    </button>
                                  </div>
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="w-full px-4">
                        <div className="mb-4 flex flex-wrap justify-between gap-4">
                          <div className="mb-4">
                            <p className="text-body-color">
                              {t("signup")} {" "}
                              <Link
                                href="/auth/signup"
                                className="text-primary hover:underline"
                              >
                                {t("signupLink")}
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full px-4">
                        <button
                          type="submit"
                          className="flex items-center justify-center rounded bg-primary px-14 py-[14px] text-sm font-semibold text-white hover:bg-primary/90"
                        >
                          {t("signinButton")}
                        </button>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
