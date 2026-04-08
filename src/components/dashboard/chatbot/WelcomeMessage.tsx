"use client";

import React, { memo } from "react";
import MessageContainer from "./MessageTemplates/MessageContainer";
import TextMessage from "./MessageTemplates/TextMessage";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import { useTranslations } from "next-intl";

function WelcomeMessage() {
  const { user } = useSupabaseAuth();
  const t = useTranslations("chat-bot");
  const firstName = user?.user_metadata?.first_name || "";
  return (
    <MessageContainer msgSender="chatbot">
      <TextMessage
        id="welcome-message-id"
        message={`${t("firstMessage", { name: firstName ? ` ${firstName}` : "" })}`}
        msgSender="chatbot"
      />
    </MessageContainer>
  );
}

export default memo(WelcomeMessage);
