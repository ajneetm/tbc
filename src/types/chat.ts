import { SurveyMessageProps } from "@/components/dashboard/chatbot/MessageTemplates/SurveyMessage";
import { SurveyResultMessageProps } from "@/components/dashboard/chatbot/MessageTemplates/SurveyResult";
import { TextMessageProps } from "@/components/dashboard/chatbot/MessageTemplates/TextMessage";

export type ChatMsg = {
  id: string;
  msgSender: MsgSender;
  msg_body: string;
  msgType: MsgType;
  questionId?: string;
  answerId?: string;
  surveyId?: string | null;
};

export type MsgSender = "user" | "chatbot";

export type MsgType = "text" | "survey" | "result";

export interface SurveyAnswer {
  id: string;
  score: number;
  rate: number;
  answerId: string;
  question: string;
  modalId: string;
  questionId: string;
}

export type GeneratedProps = TextMessageProps | SurveyMessageProps | SurveyResultMessageProps;