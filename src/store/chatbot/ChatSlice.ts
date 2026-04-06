import { ChatMsg } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LambdaMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface ChatStateType {
  isDisabled: boolean;
  chats: ChatMsg[];
  chatMode: "live" | "static";
  conversationHistory: LambdaMessage[];
}

const initialState: ChatStateType = {
  isDisabled: false,
  chatMode: "live",
  chats: [],
  conversationHistory: [],
};

export type payloadType = {
  message: ChatMsg;
  isLoading?: boolean;
};

type updateAnswerIdType = {
  chatId: string;
  answerId: string;
};

export const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMsg: (state: ChatStateType, action: PayloadAction<payloadType>) => {
      const conversation = action.payload;
      state.chats.push(conversation.message);
    },
    updateAnswerId: (
      state: ChatStateType,
      action: PayloadAction<updateAnswerIdType>,
    ) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.chatId,
      );
      state.chats[index].answerId = action.payload.answerId;
    },
    updateMsgBody: (
      state: ChatStateType,
      action: PayloadAction<{ id: string; msg_body: string }>,
    ) => {
      const msg = state.chats.find((c) => c.id === action.payload.id);
      if (msg) msg.msg_body = action.payload.msg_body;
    },
    setIsDisabled: (state: ChatStateType, action: PayloadAction<boolean>) => {
      state.isDisabled = action.payload;
    },
    addToHistory: (
      state: ChatStateType,
      action: PayloadAction<LambdaMessage>,
    ) => {
      state.conversationHistory.push(action.payload);
    },
    resetChat: () => initialState,
  },
});

export const { sendMsg, updateMsgBody, updateAnswerId, setIsDisabled, addToHistory, resetChat } = ChatSlice.actions;

export default ChatSlice.reducer;
