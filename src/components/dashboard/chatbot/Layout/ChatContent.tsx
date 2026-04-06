"use client";
import { Button } from "@/components/ui/button";
import { TrailingItems } from "@/store/chatbot/ChatController";
import { useDispatch, useSelector } from "@/store/hooks";
import { MsgType } from "@/types/chat";
import Image from "next/image";
import { ReactNode, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import NewChat from "../../../../../public/images/dashboard/chat/new-chat.svg";
import BookingDate from "../Booking/Date";
import BookingTime from "../Booking/Time";
import CalculateSurvey from "../CalculateSurvey";
import { generateProps, handleNewChat, scrollToBottom } from "../helpers/chats";
import ChatLoading from "../MessageTemplates/ChatLoading";
import MessageContainer from "../MessageTemplates/MessageContainer";
import SurveyMessage from "../MessageTemplates/SurveyMessage";
import SurveyResultMessage from "../MessageTemplates/SurveyResult";
import TextMessage from "../MessageTemplates/TextMessage";
import StartChat from "../StartChat";
import SurveyOptions from "../SurveyOptions";
import WelcomeMessage from "../WelcomeMessage";
import { useTranslations } from "next-intl";

const chatMessageMap: Record<MsgType, React.ComponentType<any>> = {
  text: TextMessage,
  survey: SurveyMessage,
  result: SurveyResultMessage,
};

type ExcludedTrailingItems = Exclude<TrailingItems, "none" | "initial-prompts">;

export const trailingItemsIds: Record<ExcludedTrailingItems, string> = {
  date: "trailing-components-date",
  time: "trailing-components-time",
  "new-survey": "trailing-components-new-survey",
  "end-survey": "trailing-components-end-survey",
  // "initial-prompts": "trailing-components-initial-prompts",
  loading: "trailing-components-loading",
};

const chatTrailingComponents: Record<TrailingItems, ReactNode> = {
  date: (
    <MessageContainer key={uuid()} msgSender="chatbot">
      <BookingDate />
    </MessageContainer>
  ),
  time: (
    <MessageContainer key={uuid()} msgSender="chatbot">
      <BookingTime />
    </MessageContainer>
  ),
  "new-survey": (
    <MessageContainer key={uuid()} msgSender="chatbot">
      <SurveyOptions msgSender="chatbot" />
    </MessageContainer>
  ),
  "end-survey": (
    <MessageContainer key={uuid()} msgSender="chatbot">
      <CalculateSurvey />
    </MessageContainer>
  ),
  "initial-prompts": (
    <MessageContainer key={uuid()} msgSender="chatbot">
      <StartChat />
    </MessageContainer>
  ),
  loading: (
    <MessageContainer key={uuid()} msgSender="chatbot">
      <ChatLoading msgSender="chatbot" />
    </MessageContainer>
  ),
  none: null,
};

function ChatContent({ type = "chat" }: { type: "survey" | "chat" }) {
  const { chatbot, chatController } = useSelector((state) => state);
  const dispatch = useDispatch();
  const t = useTranslations("chat-bot");
  useEffect(() => {
    const trailingComponentId =
      trailingItemsIds[
        chatController.layout.trailingItems as ExcludedTrailingItems
      ];
    const chatId = chatbot.chats[chatbot.chats.length - 1]?.id;
    const scrollId = trailingComponentId || chatId;
    scrollToBottom(scrollId);
  }, [chatbot.chats, chatController.layout.trailingItems]);

  const chatComponents = useMemo(() => {
    return chatbot.chats.map((chat) => {
      const Component = chatMessageMap[chat.msgType];
      return {
        id: chat.id,
        Component,
        messageType: chat.msgType,
        props: {
          ...generateProps(chat), // Pass the entire chat object or only relevant props
        },
      };
    });
  }, [chatbot.chats]);

  return (
    <div
      className="flex size-full flex-col  gap-5 overflow-y-auto px-4 py-5"
      style={{ scrollbarColor: "#ffffff00 #ffffff00" }}
      id="chat-content"
    >
      {type === "chat" && <WelcomeMessage />}
      {chatComponents.map(({ id, Component, props, messageType }) => (
        <MessageContainer
          key={id}
          msgSender={props.msgSender}
          hasChatbotImage={messageType !== "result"}
        >
          <Component {...props} />
        </MessageContainer>
      ))}

      {chatTrailingComponents[chatController.layout.trailingItems]}
      {type === "chat" && (
        <Button
          variant="ghost"
          className="mx-auto mt-auto max-w-max p-0"
          onClick={() => handleNewChat(dispatch)}
        >
          <div className="flex max-w-max gap-2 rounded-xl bg-primary px-4 py-1 text-sm leading-6 text-white">
            <Image src={NewChat} alt="new chat" width={18} height={18} />
            {t("newChat")}
          </div>
        </Button>
      )}
    </div>
  );
}

export default ChatContent;
