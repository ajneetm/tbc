import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage";

import bookingSliceReducer from "./chatbot/Booking";
import ChatControllerReducer from "./chatbot/ChatController";
import chatReducer from "./chatbot/ChatSlice";
import surveyFlowReducer from "./chatbot/SurveyFlow";
import AssessmentFormReducer from "./assessmentForm/AssessmentForm";

export const store = configureStore({
  reducer: {
    chatbot: chatReducer,
    surveyFlow: surveyFlowReducer,
    booking: bookingSliceReducer,
    chatController: ChatControllerReducer,
    assessmentForm: AssessmentFormReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});


const rootReducer = combineReducers({
  chatbot: chatReducer,
  surveyFlow: surveyFlowReducer,
  booking: bookingSliceReducer,
  chatController: ChatControllerReducer,
  assessmentForm: AssessmentFormReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
