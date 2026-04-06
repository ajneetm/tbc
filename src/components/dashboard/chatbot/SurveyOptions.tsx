import { sendMsg } from "@/store/chatbot/ChatSlice";
import { updateSurveyFlow, updateSurveyType } from "@/store/chatbot/SurveyFlow";
import {
  ExcludedSurveyType,
  SurveyType,
} from "@/store/chatbot/SurveyFlowTypes";
import { useDispatch, useSelector } from "@/store/hooks";
import { MsgSender } from "@/types/chat";
import { cn } from "@/utils/cn";
import { v4 as uuid } from "uuid";
import { surveyAnswers, surveyFlows } from "./constants";
import { surveyVariants } from "./MessageTemplates/SurveyMessage";
import sleep from "@/utils/sleep";
import { updateChatTrailing } from "@/store/chatbot/ChatController";
import { trailingItemsIds } from "./Layout/ChatContent";
import { useEffect, useRef } from "react";

export type SurveyOptionsProps = {
  msgSender: MsgSender;
};
const options: { label: string; label_ar: string; type: ExcludedSurveyType }[] =
  [
    {
      label: "Explorers",
      label_ar: "المستكشفون",
      type: "explorers",
    },
    {
      label: "Entrepreneurs",
      label_ar: "رواد الأعمال",
      type: "entrepreneurs",
    },
    {
      label: "Existing projects and companies",
      label_ar: "المشاريع الحالية والشركات",
      type: "companies",
    },
  ];

const optionsLabel = {
  en: "Let’s identify your best fitting category",
  ar: "دعنا نحدد الفئة الأنسب لك",
};
function SurveyOptions({ msgSender }: SurveyOptionsProps) {
  const dispatch = useDispatch();
  const { surveyType } = useSelector((state) => state.assessmentForm);
  const firstRender = useRef(false);

  const selectSurvey = async (type: ExcludedSurveyType) => {
    dispatch(updateSurveyType(type));

    await sleep(500);
    dispatch(updateChatTrailing("none"));
    const selectedSurveyAnswers = surveyFlows[type];
    const newSurveyId = uuid();
    dispatch(
      updateSurveyFlow({
        status: "inProgress",
        activeSurveyId: newSurveyId,
      }),
    );
    dispatch(
      sendMsg({
        message: {
          id: uuid(),
          msgType: "survey",
          questionId: selectedSurveyAnswers[0].id,
          msgSender: "chatbot",
          surveyId: newSurveyId,
          msg_body: "",
        },
      }),
    );
  };

  useEffect(() => {
    if (surveyType !== "none" && !firstRender.current) {
      firstRender.current = true;
      selectSurvey(surveyType);
    }
  }, []);

  return null;

  // (
  //   <div
  //     className={cn(surveyVariants({ variant: msgSender }))}
  //     id={trailingItemsIds["new-survey"]}
  //   >
  //     <p>{optionsLabel[language]}</p>
  //     <div className="mt-2 flex w-full gap-[10px] max-md:flex-wrap">
  //       {options.map(({ type, label, label_ar }) => (
  //         <button
  //           onClick={() => selectSurvey(type)}
  //           key={type}
  //           className={cn(
  //             "w-full rounded-md bg-[#F2F4F7] px-[14px] py-[10px] text-center text-[#182230]",
  //             "hover:!outline hover:outline-2 hover:outline-[#F04438]",
  //             "visited:!outline visited:outline-2 visited:outline-[#F04438]",
  //           )}
  //         >
  //           {language === "en" ? label : label_ar}
  //         </button>
  //       ))}
  //     </div>
  //   </div>
  // );
}

export default SurveyOptions;
