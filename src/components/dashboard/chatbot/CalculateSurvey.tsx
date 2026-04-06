"use client";
import { Button } from "@/components/ui/button";
import { updateSurveyFlow } from "@/store/chatbot/SurveyFlow";
import { useDispatch, useSelector } from "@/store/hooks";
import { cn } from "@/utils/cn";
import { calculateTestResults } from "./helpers/survey";
import { trailingItemsIds } from "./Layout/ChatContent";
import {
  SESSION_STORAGE_SCORE_KEY,
  SURVEY_SCORE,
  SURVEY_TYPE,
} from "./MessageTemplates/constents";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuid } from "uuid";

const SESSION_SURVEY_DATA = "SESSION_SURVEY_DATA";

const surveyTypeLabel: Record<string, string> = {
  explorers: "Explorers (مستكشف)",
  entrepreneurs: "Entrepreneurs (رائد أعمال)",
  companies: "Companies (شركة)",
};

function CalculateSurvey() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    submittedAnswers,
    surveyDetails: { activeSurveyId },
    type,
  } = useSelector((state) => state.surveyFlow);
  const dispatch = useDispatch();
  const {
    language, email, name, phone, surveyType,
    age, businessType, capital, projectAge, staffCount,
  } = useSelector((state) => state.assessmentForm);
  const { push } = useRouter();

  const answers = submittedAnswers[activeSurveyId || ""] || [];
  const { totalScore, modalScore } = calculateTestResults(answers);

  const calculateSurvey = async () => {
    setIsLoading(true);

    const percentage = ((totalScore / 360) * 100).toFixed(1);
    const sessionId = uuid();

    // Store in sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_SCORE_KEY, JSON.stringify(modalScore));
      sessionStorage.setItem(SURVEY_TYPE, type);
      sessionStorage.setItem(SURVEY_SCORE, String(totalScore));
      sessionStorage.setItem(SESSION_SURVEY_DATA, JSON.stringify({
        name, email, phone, surveyType, age,
        businessType, capital, projectAge, staffCount, language,
      }));
    }

    // Save to Google Sheets via secure API route (URL never exposed to browser)
    fetch("/api/save-survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        name, email, phone, surveyType, language,
        age, businessType, capital, projectAge, staffCount,
        totalScore, percentage,
        answers: answers.map((a) => ({
          question: a.question,
          answerId: a.answerId,
          score: a.score,
          rate: a.rate,
          modalId: a.modalId,
        })),
      }),
    })
      .then((r) => r.json())
      .then((d) => console.log("[Sheets]", d))
      .catch((err) => console.error("[Sheets] error:", err));

    // Send email via Web3Forms
    const web3key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (web3key && web3key !== "YOUR_ACCESS_KEY_HERE") {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: web3key,
          subject: `[Business Clock] تقييم جديد - ${name} (${percentage}%)`,
          from_name: "Business Clock",
          name,
          email,
          message: `
الاسم: ${name}
الإيميل: ${email}
الهاتف: ${phone}
نوع التقييم: ${surveyTypeLabel[surveyType] || surveyType}
اللغة: ${language === "ar" ? "عربي" : "English"}
${age ? `العمر: ${age}` : ""}
${businessType ? `نوع العمل: ${businessType}` : ""}
${capital ? `رأس المال: ${capital}` : ""}
${projectAge ? `عمر المشروع: ${projectAge} سنة` : ""}
${staffCount ? `عدد الموظفين: ${staffCount}` : ""}

النتيجة: ${totalScore} / 360
النسبة: ${percentage}%

تفاصيل الإجابات:
${answers.map((a, i) => `${i + 1}. ${a.question} → ${a.answerId} (${a.score})`).join("\n")}
          `.trim(),
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) console.log("[Email] Sent");
          else console.error("[Email] Error:", d);
        })
        .catch((err) => console.error("[Email] Network error:", err));
    }

    dispatch(updateSurveyFlow({ status: "idle", activeSurveyId }));
    setIsLoading(false);
    push("/report");
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg rounded-ss-none border border-gray-200",
        "p-4 text-center text-sm font-medium text-gray-900",
      )}
      id={trailingItemsIds["end-survey"]}
    >
      <Button
        onClick={calculateSurvey}
        className="mx-auto w-56"
        size="lg"
        variant="destructive"
      >
        {language === "ar" ? "احسب النتائج" : "Calculate Results"}
        <span className="ms-2">{isLoading && "..."}</span>
      </Button>
    </div>
  );
}

export default CalculateSurvey;
