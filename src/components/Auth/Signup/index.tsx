"use client";
import { registerUser } from "@/app/libs/api/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const signupSchema = z
  .object({
    username: z.string({required_error: "auth.signup.form.username.required"}).min(3, "auth.signup.form.username.min").max(255, "auth.signup.form.username.max"),

    first_name: z.string({required_error: "auth.signup.form.first_name.required"}).min(3, "auth.signup.form.first_name.min").max(255, "auth.signup.form.first_name.max"),
    last_name: z.string({required_error: "auth.signup.form.last_name.required"}).min(3, "auth.signup.form.last_name.min").max(255, "auth.signup.form.last_name.max"),
    email: z.string({required_error: "auth.signup.form.email.required"}).email("auth.signup.form.email.invalid"),
    password: z
      .string({required_error: "auth.signup.form.password.required"})
      .min(8, "auth.signup.form.password.min")
      .refine(
        (val) =>
          /[A-Z]/.test(val) && // At least one uppercase letter
          /[a-z]/.test(val) && // At least one lowercase letter
          /\d/.test(val) && // At least one number
          /[@$!%*?&]/.test(val), // At least one special character
        {
          message: "auth.signup.form.password.invalid",
        },
      ),
    rePassword: z.string({required_error: "auth.signup.form.rePassword.required"}).min(8),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "auth.signup.form.rePassword.invalid",
    path: ["rePassword"], // Error message will be attached to `rePassword`
  });

export default function Signup() {
  const router = useRouter();
  const [visiblePassword, setVisiblePassword] = useState({
    password: false,
    rePassword: false,
  });
  const handleVisiblePassword = (type: "password" | "rePassword") => {
    setVisiblePassword({
      ...visiblePassword,
      [type]: !visiblePassword[type],
    });
  };
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const t = useTranslations("auth.signup");

  function onSubmit(values: z.infer<typeof signupSchema>) {
    registerUser({
      ...values,
    })
      .then(() => {
        toast.success(t("validation.success"));
        router.push("/auth/signin");
      })
      .catch((error: any) => toast.error(error));
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="-mx-4 flex flex-wrap">
                      <div className="w-full px-4 sm:w-1/2">
                        <div className="mb-10">
                          <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("form.first_name.label")}</FormLabel>
                                <FormControl>
                                  <input
                                    {...field}
                                    placeholder={t("form.first_name.placeholder")}
                                    className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary   "
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="w-full px-4 sm:w-1/2">
                        <div className="mb-10">
                          <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("form.last_name.label")}</FormLabel>
                                <FormControl>
                                  <input
                                    {...field}
                                    placeholder={t("form.last_name.placeholder")}
                                    className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary   "
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
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
                                    type="username"
                                    placeholder={t("form.username.placeholder")}
                                    className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="w-full px-4 sm:w-1/2">
                        <div className="mb-10">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("form.email.label")}</FormLabel>
                                <FormControl>
                                  <input
                                    {...field}
                                    type="email"
                                    placeholder={t("form.email.placeholder")}
                                    className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
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
                              <div>
                                <FormItem>
                                  <FormLabel>{t("form.password.label")}</FormLabel>
                                  <FormControl>
                                    <input
                                      {...field}
                                      type={
                                        visiblePassword.password
                                          ? "text"
                                          : "password"
                                      }
                                        placeholder={t("form.password.placeholder")}
                                      className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                                <button
                                  type="button"
                                  className="absolute top-[60px] mb-3 mr-3 [inset-inline-end:8px]"
                                  onClick={() =>
                                    handleVisiblePassword("password")
                                  }
                                >
                                  {visiblePassword.password ? (
                                    <i className="fa-regular fa-eye" />
                                  ) : (
                                    <i className="fa-regular fa-eye-slash"></i>
                                  )}
                                </button>
                              </div>
                            )}
                          />
                        </div>
                      </div>
                      <div className="relative w-full px-4 sm:w-1/2">
                        <div className="mb-10">
                          <FormField
                            control={form.control}
                            name="rePassword"
                            render={({ field }) => (
                              <div>
                                <FormItem>
                                  <FormLabel>{t("form.rePassword.label")}</FormLabel>
                                  <FormControl>
                                    <input
                                      {...field}
                                      type={
                                        visiblePassword.rePassword
                                          ? "text"
                                          : "password"
                                      }
                                      placeholder={t("form.rePassword.placeholder")}
                                      className="placeholder-dark-text w-full border-b bg-transparent py-5 text-base font-medium text-dark outline-none focus:border-primary"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>

                                <button
                                  type="button"
                                  className="absolute top-[60px] mb-3 mr-3 [inset-inline-end:8px]"
                                  onClick={() =>
                                    handleVisiblePassword("rePassword")
                                  }
                                >
                                  {visiblePassword.rePassword ? (
                                    <i className="fa-regular fa-eye" />
                                  ) : (
                                    <i className="fa-regular fa-eye-slash"></i>
                                  )}
                                </button>
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      <div className="w-full px-4">
                        <div className="mb-4 flex flex-wrap justify-between gap-4">
                          <div className="mb-4">
                            <p className="text-body-color">
                              {t("signin")} {" "}
                              <Link
                                href="/auth/signin"
                                className="text-primary hover:underline"
                              >
                                {t("signinLink")}
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full px-4">
                        <button className="flex items-center justify-center rounded bg-primary px-14 py-[14px] text-sm font-semibold text-white hover:bg-primary/90">
                          {t("signupButton")}
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
