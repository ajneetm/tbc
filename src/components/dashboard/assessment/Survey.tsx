"use client";

import ChatContent from "../chatbot/Layout/ChatContent";
import { handleNewChat } from "../chatbot/helpers/chats";
import { useDispatch, useSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import NewChat from "../../../../public/images/dashboard/chat/new-chat.svg";
import {
  ExcludedInitialPrompts,
  updateChatTrailing,
  updateExcludedInitialPrompts,
} from "@/store/chatbot/ChatController";
import { triggerSurveySequence } from "../chatbot/helpers/survey";
import { cn } from "@/utils/cn";
import { resetAssessment } from "@/store/assessmentForm/AssessmentForm";
import { useTranslations } from "next-intl";

function Survey() {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.assessmentForm);
  const t = useTranslations("assessment.survey");
  const resetController = (excludedInitialPrompts: ExcludedInitialPrompts) => {
    dispatch(updateExcludedInitialPrompts(excludedInitialPrompts));
    dispatch(updateChatTrailing("none"));
  };
  const startSurveyFlow = () => {
    resetController("survey");
    triggerSurveySequence(dispatch, false, language)();
  };

  const newSurvey = () => {
    startSurveyFlow();
    handleNewChat(dispatch);
    dispatch(resetAssessment());
  };
  return (
    <section
      className={cn("relative h-full pb-4", {
        "[&_.message-container]:[direction:rtl] [&_.message-container]:font-[Tajawal]": language === "ar",
      })}
    >
      <ChatContent type="survey" />

      <Button
        variant="ghost"
        className="absolute -bottom-2 left-1/2 max-w-max -translate-x-1/2 p-0 "
        onClick={() => newSurvey()}
      >
        <div className="flex max-w-max gap-2 rounded-xl bg-primary px-4 py-1 text-sm leading-6 text-white">
          <Image src={NewChat} alt="new chat" width={18} height={18} />
          {t("newSurveryButton")}
        </div>
      </Button>
    </section>
  );
}

export default Survey;
