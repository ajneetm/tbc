import { SurveyAnswer } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SurveyFlowState,
  SurveyDetails,
  SurveyType,
  UpdateSurveyAnswer,
} from "./SurveyFlowTypes";

const initialState: SurveyFlowState = {
  surveyDetails: {
    status: "idle",
    activeSurveyId: null,
  },
  type: "none",
  submittedAnswers: {},
};

const surveyFlowSlice = createSlice({
  name: "surveyFlow",
  initialState,
  reducers: {
    updateSurveyFlow: (state, action: PayloadAction<SurveyDetails>) => {
      state.surveyDetails.status = action.payload.status;
      state.surveyDetails.activeSurveyId = action.payload.activeSurveyId;
    },
    addSurveyAnswer: (
      state,
      action: PayloadAction<{ answer: SurveyAnswer }>,
    ) => {
      const activeSurveyId = state.surveyDetails.activeSurveyId;
      if (activeSurveyId) {
        if (!state.submittedAnswers[activeSurveyId]) {
          state.submittedAnswers[activeSurveyId] = [];
        }
        state.submittedAnswers[activeSurveyId].push(action.payload.answer);
      }
    },
    updateSurveyAnswer: (state, action: PayloadAction<UpdateSurveyAnswer>) => {
      const activeSurveyId = state.surveyDetails.activeSurveyId;
      if (activeSurveyId && state.submittedAnswers[activeSurveyId]) {
        const index = state.submittedAnswers[activeSurveyId].findIndex(
          (answer) => answer.questionId === action.payload.questionId,
        );

        if (index !== -1) {
          state.submittedAnswers[activeSurveyId][index].answerId =
            action.payload.answerId;
          state.submittedAnswers[activeSurveyId][index].score =
            action.payload.score;
        }
      }
    },
    updateSurveyType: (state, action: PayloadAction<SurveyType>) => {
      state.type = action.payload;
    },


    resetSurvey: () => initialState,
  },
});

export const {
  addSurveyAnswer,
  updateSurveyFlow,
  resetSurvey,
  updateSurveyType,
  updateSurveyAnswer,
} = surveyFlowSlice.actions;
export default surveyFlowSlice.reducer;
