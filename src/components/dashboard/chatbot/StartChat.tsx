"use client";
import ChatbotClock from "@/components/clock/ChatbotClock";
import {
  ExcludedInitialPrompts,
  updateChatTrailing,
  updateExcludedInitialPrompts,
} from "@/store/chatbot/ChatController";
import { sendMsg } from "@/store/chatbot/ChatSlice";
import { useDispatch, useSelector } from "@/store/hooks";
import { cn } from "@/utils/cn";
import sleep from "@/utils/sleep";
import { v4 as uuid } from "uuid";
import { getBusinessClockHelpfulAnswer } from "./constants";
import { useLocale, useTranslations } from "next-intl";

function StartChat() {
  const { excludedInitialPrompts } = useSelector(
    (state) => state.chatController,
  );
  const dispatch = useDispatch();
  const t = useTranslations("chat-bot");

  const resetController = (excludedInitialPrompts: ExcludedInitialPrompts) => {
    dispatch(updateExcludedInitialPrompts(excludedInitialPrompts));
    dispatch(updateChatTrailing("none"));
  };
  // const startSurveyFlow = () => {
  //   dispatch(setIsDisabled(true));
  //   resetController("survey");
  //   triggerSurveySequence(dispatch)();
  // };
  const startBusinessClock = async () => {
    resetController("business-clock");
    dispatch(
      sendMsg({
        message: {
          id: uuid(),
          msgType: "text",
          msgSender: "user",
          msg_body: t("businessClockQuestion"),
        },
      }),
    );
    await sleep(500);
    dispatch(
      sendMsg({
        message: {
          id: uuid(),
          msgType: "text",
          msgSender: "chatbot",
          msg_body: getBusinessClockHelpfulAnswer(locale),
        },
      }),
    );
    await sleep(500);

    dispatch(updateChatTrailing("initial-prompts"));
  };

  const initialPromptsEn = [
    {
      id: "assistant",
      title: "Ask about me (Your personal assistant)",
      description: "How I can be benefit to you?",
      action: () => {},
      isActive: false,
    },
    // {
    //   id: "survey",
    //   title: "Test your business and get free consultation",
    //   description: "What is your current gap in business?",
    //   action: startSurveyFlow,
    //   isActive: true,
    // },
    {
      id: "business-clock",
      title: "Ask about business clock",
      description: "How The Business Clock can be helpful?",
      action: startBusinessClock,
      isActive: true,
    },
  ];

  const initialPromptsAr = [
    {
      id: "assistant",
      title: "اسأل عني (مساعدك الشخصي)",
      description: "كيف يمكنني أن أفيدك؟",
      action: () => {},
      isActive: false,
    },
    {
      id: "business-clock", 
      title: "اسأل عن الساعة التجارية",
      description: "كيف يمكن للساعة التجارية أن تكون مفيدة؟",
      action: startBusinessClock,
      isActive: true,
    },
  ];
  const locale = useLocale();
  const initialPrompts = locale === "ar" ? initialPromptsAr : initialPromptsEn;
  const noExcluded = excludedInitialPrompts === "none";
  return (
    <div
      className={cn(
        "my-3 flex w-full flex-col items-center justify-center gap-10 max-md:mb-3",
        {
          "my-5": noExcluded,
        },
      )}
    >
      {noExcluded ? (
        <ChatbotClock clockSize="size-[200px] max-md:hidden" />
      ) : null}
      <div className="flex gap-5 max-md:flex-col max-md:gap-2">
        {initialPrompts.map((prompt) => {
          if (excludedInitialPrompts.includes(prompt.id)) return null;
          return (
            <button
              onClick={prompt.action}
              key={prompt.id}
              className={cn(
                "relative w-full rounded-[10px] border border-[#E4E7EC] bg-white px-[14px] py-[10px] text-start",
                {
                  "cursor-not-allowed": !prompt.isActive,
                },
              )}
            >
              {prompt.isActive ? null : (
                <span className="absolute -top-3 right-2 mr-2 inline-block rounded-full bg-red-200 p-1 text-xs">
                  {t("comingSoon")}
                </span>
              )}
              <h1 className="text-sm font-medium text-[#344054] max-md:text-xs">
                {prompt.title}
              </h1>
              <p className="text-sm font-normal text-[#475467] max-md:text-xs">
                {prompt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StartChat;
