"use client";
import { sendChat } from "@/app/libs/api/chat";
import { updateChatTrailing } from "@/store/chatbot/ChatController";
import { addToHistory, sendMsg, updateMsgBody } from "@/store/chatbot/ChatSlice";
import { useDispatch, useSelector } from "@/store/hooks";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { remark } from "remark";
import html from "remark-html";
import { v4 as uuid } from "uuid";

const ChatbotForm: React.FC = () => {
  const { isDisabled, conversationHistory } = useSelector(
    (state) => state.chatbot,
  );
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("chat-bot");
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;
    if (!message?.trim()) return;

    // Reset textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.value = "";
      textarea.style.height = "auto";
    }

    setIsPending(true);
    dispatch(updateChatTrailing("loading"));

    // Add user message to UI
    dispatch(
      sendMsg({
        message: {
          id: uuid(),
          msgType: "text",
          msgSender: "user",
          msg_body: message,
        },
      }),
    );

    // Add user message to Lambda conversation history
    dispatch(addToHistory({ role: "user", content: message }));

    const botMsgId = uuid();
    let accumulatedText = "";

    try {
      // Add empty bot message first, then stream into it
      dispatch(
        sendMsg({
          message: {
            id: botMsgId,
            msgType: "text",
            msgSender: "chatbot",
            msg_body: "",
          },
        }),
      );
      dispatch(updateChatTrailing("none"));

      const updatedHistory = [
        ...conversationHistory,
        { role: "user" as const, content: message },
      ];

      await sendChat(updatedHistory, (chunk) => {
        accumulatedText += chunk;
        dispatch(updateMsgBody({ id: botMsgId, msg_body: accumulatedText }));
      });

      // Convert final markdown to HTML and update the message
      const processedContent = await remark()
        .use(html)
        .process(accumulatedText);
      const contentHtml = processedContent.toString();
      dispatch(updateMsgBody({ id: botMsgId, msg_body: contentHtml }));

      // Save final assistant response to history
      dispatch(
        addToHistory({ role: "assistant", content: accumulatedText }),
      );
    } catch (error) {
      console.error("[Chatbot] Error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
      dispatch(updateChatTrailing("none"));
    } finally {
      setIsPending(false);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (autoResize?: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto"; // Reset the height to recalculate
    if (autoResize) return;
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent a new line
      (event.target as HTMLTextAreaElement).form?.requestSubmit(); // Submit the form
    }
  };

  return (
    <form className="flex w-full gap-4 py-4" onSubmit={handleSubmit}>
      <div
        id="composer-background"
        className=" flex w-full cursor-text flex-col rounded-3xl bg-[#f4f4f4] px-2.5 py-1 transition-colors contain-inline-size"
      >
        <div className="flex min-h-[44px] items-start pl-2 max-md:min-h-8 ">
          <div className="min-w-0 max-w-full flex-1">
            <div
              className="text-token-text-primary default-browser max-h-52 max-h-[25dvh] overflow-auto"
              style={{
                scrollbarColor: " #c8c8c8 #ffffff00",
              }}
            >
              <textarea
                ref={textareaRef}
                className="h-10 w-full resize-none border-0 bg-transparent py-2 pe-2 outline-none max-md:py-1"
                placeholder={t("inputPlaceholder")}
                name="message"
                required
                onInput={() => handleInput()}
                onKeyDown={handleKeyDown}
                disabled={isDisabled || isPending}
              />
            </div>
          </div>
        </div>
        <div className="flex h-[44px] items-center justify-end max-md:h-5">
          <button
            aria-label="Send prompt"
            className="flex size-8 items-center justify-center rounded-full bg-primary text-white transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-black disabled:bg-[#D7D7D7] disabled:text-[#f4f4f4] disabled:hover:opacity-100 dark:bg-white dark:text-black dark:focus-visible:outline-white disabled:dark:bg-gray-600 dark:disabled:text-gray-400 max-md:size-5"
            disabled={isDisabled || isPending}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="icon-2xl"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatbotForm;
