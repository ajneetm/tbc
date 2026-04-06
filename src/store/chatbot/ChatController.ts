import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TrailingItems =
  | "date"
  | "time"
  | "new-survey"
  | "end-survey"
  | "initial-prompts"
  | "loading"
  | "none";
export type ExcludedInitialPrompts =
  | "survey"
  | "business-clock"
  | "assistant"
  | "none";
export interface ChatControllerStateType {
  layout: {
    trailingItems: TrailingItems;
  };
  excludedInitialPrompts: ExcludedInitialPrompts;
}

const initialState: ChatControllerStateType = {
  layout: {
    trailingItems: "none",
  },
  excludedInitialPrompts: "none",
};

export const ChatControllerSlice = createSlice({
  name: "ChatController",
  initialState,
  reducers: {
    updateChatTrailing: (state, action: PayloadAction<TrailingItems>) => {
      state.layout.trailingItems = action.payload;
    },
    updateExcludedInitialPrompts: (
      state,
      action: PayloadAction<ExcludedInitialPrompts>,
    ) => {
      state.excludedInitialPrompts = action.payload;
    },
    resetController: () => initialState,
  },
});

export const { updateChatTrailing, updateExcludedInitialPrompts,resetController } =
  ChatControllerSlice.actions;

export default ChatControllerSlice.reducer;
