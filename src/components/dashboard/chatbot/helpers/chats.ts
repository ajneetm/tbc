import { resetBooking } from "@/store/chatbot/Booking";
import { resetController } from "@/store/chatbot/ChatController";
import { resetChat } from "@/store/chatbot/ChatSlice";
import { resetSurvey } from "@/store/chatbot/SurveyFlow";
import { AppDispatch } from "@/store/store";
import { ChatMsg, GeneratedProps, MsgType } from "@/types/chat";

export function scrollToBottom(chatId?: string) {
  const id = chatId ?? "chat-content";
  const chatContent = document.getElementById(id);
  if (chatContent) {
    chatContent.scrollIntoView({
      block: "center",
      behavior: "smooth", // Enables smooth scrolling
    });
  }
}
export const generateProps = (chat: ChatMsg): GeneratedProps => {
  const props: Record<MsgType, GeneratedProps> = {
    text: {
      message: chat.msg_body ?? "",
      msgSender: chat.msgSender,
      id: chat.id!,
    },
    survey: {
      chatId: chat.id!,
      questionId: chat.questionId!,
      submittedAnswerId: chat.answerId,
      msgSender: chat.msgSender,
      surveyId: chat.surveyId ?? null,
    },
    result: { id: chat.id!, msgSender: chat.msgSender },
  };
  return props[chat.msgType];
};

export const handleNewChat = (dispatch: AppDispatch) => {
  dispatch(resetBooking());
  dispatch(resetController());
  dispatch(resetChat());
  dispatch(resetSurvey());
};
