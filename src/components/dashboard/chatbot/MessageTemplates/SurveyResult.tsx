"use client";
import { useSelector } from "@/store/hooks";
import { MsgSender } from "@/types/chat";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import { useRouter } from "next/navigation";
import React from "react";
import {
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import clockBackground from "../../../../../public/images/dashboard/chat/clock-bg.png";
import { calculateTestResults } from "../helpers/survey";
import { PRINT_RESULT_AREA, SESSION_STORAGE_SCORE_KEY, SURVEY_TYPE } from "./constents";
import "./print-result.css";
export type ModalScore = {
  modalScore: number;
  modalId: string;
  label: string;
};
export type SurveyResultMessageProps = {
  id: string;
  msgSender: MsgSender;
};

const variants = cva(
  ["w-full gap-5 bg-white rounded-xl py-5 border shadow-lg"],
  {
    variants: {
      variant: {
        user: "",
        chatbot: "",
      },
    },
  },
);

function SurveyResultMessage({ id, msgSender }: SurveyResultMessageProps) {
  const { submittedAnswers,type,surveyDetails:{activeSurveyId} } = useSelector((state) => state.surveyFlow);
  const { language} = useSelector((state) => state.assessmentForm);
  const {push} = useRouter()
  const { totalScore, modalScore } = calculateTestResults(submittedAnswers[activeSurveyId!] || []);

  const modalRatio = ((totalScore / 360) * 100).toFixed(2);
  const handlePrint = () => {
    window.print();
  };

  const openReport = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        SESSION_STORAGE_SCORE_KEY,
        JSON.stringify(modalScore),
      );
      sessionStorage.setItem(SURVEY_TYPE, type);
    }
    push("/report");
  };

  return (
    <div id={id} className={cn(variants({ variant: msgSender }), "fixed top-[2000px] left-[2000px]")}>
      <div
        className="flex items-center gap-5 px-5 max-md:flex-col w-fit"
        id={PRINT_RESULT_AREA}
      >
        <div
          className="size-[278px] p-[15.5px]"
          style={{
            backgroundImage: `url(${clockBackground.src})`,
            backgroundSize: "cover",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={modalScore}>
              <PolarAngleAxis dataKey="modalId" tick={false} />
              <PolarRadiusAxis domain={[0, 30]} tick={false} axisLine={false} />
              {/* Set the domain to [0, 30] */}
              <Radar
                dataKey="modalScore"
                fill="#F04438"
                fillOpacity={0.6}
                animationDuration={0}
                dot={{
                  r: 4,
                  fillOpacity: 1,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-1  text-start max-md:w-full max-md:items-center max-md:justify-between md:flex-col ">
          <p className="md:text-2xl md:font-semibold">{modalRatio} %</p>
          <p className="md:mt-5 md:text-xl md:font-semibold">{`${language === "en" ? "Total Score" : "المجموع الكلي"} ${totalScore}/${360}`}</p>
        </div>
      </div>
      <hr className="border-t-gray mb-4 mt-5 w-full border-t" />
      <div className="flex items-center justify-between gap-3 px-5">
        <button
          onClick={handlePrint}
          className="border-gray flex w-full items-center justify-center rounded-lg border  p-2 "
        >
          {language === "en" ? "Print Report" : "طباعة التقرير"}
        </button>
        <button
          onClick={openReport}
          className="flex w-full items-center justify-center rounded-lg bg-[#F04438] p-2 text-white"
        >
          {language === "en" ? "Download Report" : "تحميل التقرير"}
        </button>
      </div>
    </div>
  );
}

export default React.memo(SurveyResultMessage);
