import { AvailableTimeList } from "@/app/libs/api/chatTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExcludedSurveyType, SurveyType } from "../chatbot/SurveyFlowTypes";

export interface AssessmentStateType {
  name: string;
  email: string;
  phone: string;
  language: "en" | "ar";
  surveyType: SurveyType;
  isAssessmentStarted?: boolean;
  businessType?: string;
  age?: string;
  capital?: string;
  projectAge?: string;
  staffCount?: string;
}

const initialState: AssessmentStateType = {
  name: "",
  email: "",
  phone: "",
  language: "en",
  surveyType: "none",
  isAssessmentStarted: false,
};

export const assessmentSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    saveAssessmentData: (state, action: PayloadAction<AssessmentStateType>) =>
      Object.assign(state, action.payload),

    updateAssessmentStarted: (state, action: PayloadAction<boolean>) => {
      state.isAssessmentStarted = action.payload;
    },
    resetAssessment: () => initialState,
  },
});

export const { resetAssessment, saveAssessmentData, updateAssessmentStarted } =
  assessmentSlice.actions;

export default assessmentSlice.reducer;
