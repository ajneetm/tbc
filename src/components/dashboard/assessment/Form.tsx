"use client";

import { saveAssessmentData } from "@/store/assessmentForm/AssessmentForm";
import {
  ExcludedInitialPrompts,
  updateChatTrailing,
  updateExcludedInitialPrompts,
} from "@/store/chatbot/ChatController";
import { surveyTypeValues } from "@/store/chatbot/SurveyFlowTypes";
import { useDispatch } from "@/store/hooks";
import { useLocale, useTranslations } from "next-intl";
import { triggerSurveySequence } from "../chatbot/helpers/survey";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";

type SurveyType = (typeof surveyTypeValues)[number];

const AssessmentForm = () => {
  const dispatch = useDispatch();
  const t = useTranslations("assessment");
  const { user } = useSupabaseAuth();
  const locale = useLocale() as "en" | "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const startSurvey = (surveyType: SurveyType) => {
    dispatch(updateExcludedInitialPrompts("survey" as ExcludedInitialPrompts));
    dispatch(updateChatTrailing("none"));
    dispatch(
      saveAssessmentData({
        name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        phone: user?.user_metadata?.phone || "",
        language: locale,
        isAssessmentStarted: true,
        surveyType,
        age: "",
        businessType: "",
        capital: "",
        projectAge: "",
        staffCount: "",
      }),
    );
    triggerSurveySequence(dispatch, false, locale)();
  };

  const cards: { type: SurveyType; key: string }[] = [
    { type: "explorers", key: "explorers" },
    { type: "entrepreneurs", key: "entrepreneurs" },
    { type: "companies", key: "companies" },
  ];

  return (
    <div dir={dir} className="mx-auto mt-5 max-w-[860px] px-4">
      <div className="text-center mb-8">
        <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
          {t("cards.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ type, key }) => (
          <div
            key={type}
            className="flex flex-col bg-white border-2 border-[#F04438] rounded-2xl p-6 transition"
          >
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-900 mb-4">
                {t(`cards.${key}.title`)}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-2">
                {t(`cards.${key}.line1`)}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t(`cards.${key}.line2`)}
              </p>
            </div>
            <button
              onClick={() => startSurvey(type)}
              className="mt-6 w-full rounded-xl border-2 border-black bg-white py-3 text-sm font-bold text-black hover:bg-black hover:text-white transition"
            >
              {t(`cards.${key}.button`)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentForm;
