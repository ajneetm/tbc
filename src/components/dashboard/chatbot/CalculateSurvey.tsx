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
