import { SurveyAnswer } from "@/types/chat";

export type SurveyDetails = {
  status: "idle" | "inProgress";
  activeSurveyId: string | null;
};
export const surveyTypeValues = ["explorers", "companies", "entrepreneurs", "none"] as const;

export type SurveyType = typeof surveyTypeValues[number]; // TS type
export type ExcludedSurveyType = Exclude<SurveyType, "none">;

export interface SurveyFlowState {
  surveyDetails: SurveyDetails;
  type: SurveyType;
  submittedAnswers: Record<string, SurveyAnswer[]>;
}

export type UpdateSurveyAnswer = {
  score: number;
  answerId: string;
  questionId: string;
};
