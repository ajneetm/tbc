"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Form";
import { saveAssessmentData } from "@/store/assessmentForm/AssessmentForm";
import {
  ExcludedInitialPrompts,
  updateChatTrailing,
  updateExcludedInitialPrompts,
} from "@/store/chatbot/ChatController";
import { surveyTypeValues } from "@/store/chatbot/SurveyFlowTypes";
import { useDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { triggerSurveySequence } from "../chatbot/helpers/survey";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import { useEffect } from "react";

const assessmentSchema = z
  .object({
    language: z.union([z.literal("en"), z.literal("ar")]),
    surveyType: z.enum(surveyTypeValues),
    age: z.string().optional(),
    businessType: z.string().optional(),
    capital: z.string().optional(),
    projectAge: z.string().optional(),
    staffCount: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.surveyType === "explorers") {
      if (!data.age) {
        ctx.addIssue({
          code: "custom",
          path: ["age"],
          message: "assessment.form.fields.age.required",
        });
      }
    } else if (data.surveyType === "entrepreneurs") {
      if (!data.businessType) {
        ctx.addIssue({
          code: "custom",
          path: ["businessType"],
          message: "assessment.form.fields.businessType.required",
        });
      }
    } else if (data.surveyType === "companies") {
      ["businessType", "capital", "projectAge", "staffCount"].forEach(
        (field) => {
          if (!(data as Record<string, any>)[field]) {
            ctx.addIssue({
              code: "custom",
              path: [field],
              message: `assessment.form.fields.${field}.required`,
            });
          }
        },
      );
    }
  });

const AssessmentForm = () => {
  const dispatch = useDispatch();
  const t = useTranslations("assessment");
  const { user } = useSupabaseAuth();
  const locale = useLocale() as "en" | "ar";

  const resetController = (excludedInitialPrompts: ExcludedInitialPrompts) => {
    dispatch(updateExcludedInitialPrompts(excludedInitialPrompts));
    dispatch(updateChatTrailing("none"));
  };
  const startSurveyFlow = (lang: "en" | "ar") => {
    resetController("survey");
    triggerSurveySequence(dispatch, false, lang)();
  };

  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      language: locale,
      surveyType: "explorers",
      age: "",
      businessType: "",
      capital: "",
      projectAge: "",
      staffCount: "",
    },
  });

  // Sync language field with site locale
  useEffect(() => {
    form.setValue("language", locale);
  }, [locale, form]);

  function onSubmit(values: z.infer<typeof assessmentSchema>) {
    const { language, surveyType, age, businessType, capital, projectAge, staffCount } = values;
    dispatch(
      saveAssessmentData({
        name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        phone: user?.user_metadata?.phone || "",
        language,
        isAssessmentStarted: true,
        surveyType,
        age,
        businessType,
        capital,
        projectAge,
        staffCount,
      }),
    );
    startSurveyFlow(language);
  }

  return (
    <div className="mx-auto mt-5 max-w-[800px] rounded-lg bg-white p-5 shadow-lg md:mt-10">
      <h1 className="mb-3 text-2xl font-medium text-black sm:text-3xl lg:text-2xl xl:text-[40px] xl:leading-tight">
        {t("form.title")}
      </h1>
      <p className="mb-5 text-base font-normal text-gray-600">
        {t("form.description")}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="-mx-4 flex flex-wrap">

            <div className="relative w-full px-4 sm:w-1/2">
              <div className="mb-5 md:mb-10">
                <FormField
                  control={form.control}
                  name="surveyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.fields.surveyType.label")}</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            form.setValue("age", "");
                            form.setValue("businessType", "");
                            form.setValue("capital", "");
                            form.setValue("projectAge", "");
                            form.setValue("staffCount", "");
                          }}
                          className="placeholder-dark-text w-full border-b bg-transparent py-2 text-base font-medium text-dark outline-none focus:border-primary md:py-5"
                        >
                          <option value="explorers">{t("form.fields.surveyType.options.explorers")}</option>
                          <option value="entrepreneurs">{t("form.fields.surveyType.options.entrepreneurs")}</option>
                          <option value="companies">{t("form.fields.surveyType.options.companies")}</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {form.watch("surveyType") === "explorers" && (
              <div className="relative w-full px-4 sm:w-1/2">
                <div className="mb-5 md:mb-10">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.fields.age.label")}</FormLabel>
                        <FormControl>
                          <input
                            {...field}
                            onChange={(e) => {
                              field.onChange(
                                e.target.value.replace(/[^0-9]/g, ""),
                              );
                            }}
                            placeholder={t("form.fields.age.placeholder")}
                            className="placeholder-dark-text w-full border-b bg-transparent py-2 text-base font-medium text-dark outline-none focus:border-primary md:py-5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {(form.watch("surveyType") === "entrepreneurs" ||
              form.watch("surveyType") === "companies") && (
              <div className="relative w-full px-4 sm:w-1/2">
                <div className="mb-5 md:mb-10">
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.fields.businessType.label")}</FormLabel>
                        <FormControl>
                          <input
                            {...field}
                            placeholder={t("form.fields.businessType.placeholder")}
                            className="placeholder-dark-text w-full border-b bg-transparent py-2 text-base font-medium text-dark outline-none focus:border-primary md:py-5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {form.watch("surveyType") === "companies" && (
              <>
                <div className="relative w-full px-4 sm:w-1/2">
                  <div className="mb-5 md:mb-10">
                    <FormField
                      control={form.control}
                      name="capital"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.fields.capital.label")}</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              onChange={(e) => {
                                field.onChange(
                                  e.target.value.replace(/[^0-9]/g, ""),
                                );
                              }}
                              placeholder={t("form.fields.capital.placeholder")}
                              className="placeholder-dark-text w-full border-b bg-transparent py-2 text-base font-medium text-dark outline-none focus:border-primary md:py-5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="relative w-full px-4 sm:w-1/2">
                  <div className="mb-5 md:mb-10">
                    <FormField
                      control={form.control}
                      name="projectAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.fields.projectAge.label")}</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              onChange={(e) => {
                                field.onChange(
                                  e.target.value.replace(/[^0-9]/g, ""),
                                );
                              }}
                              placeholder={t("form.fields.projectAge.placeholder")}
                              className="placeholder-dark-text w-full border-b bg-transparent py-2 text-base font-medium text-dark outline-none focus:border-primary md:py-5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="relative w-full px-4 sm:w-1/2">
                  <div className="mb-5 md:mb-10">
                    <FormField
                      control={form.control}
                      name="staffCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.fields.staffCount.label")}</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              onChange={(e) => {
                                field.onChange(
                                  e.target.value.replace(/[^0-9]/g, ""),
                                );
                              }}
                              placeholder={t("form.fields.staffCount.placeholder")}
                              className="placeholder-dark-text w-full border-b bg-transparent py-2 text-base font-medium text-dark outline-none focus:border-primary md:py-5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="w-full px-4">
              <button
                type="submit"
                className="flex items-center justify-center rounded bg-primary px-14 py-[14px] text-sm font-semibold text-white hover:bg-primary/90"
              >
                {t("form.button")}
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AssessmentForm;
