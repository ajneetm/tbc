"use client";

import React, { memo } from "react";
import MessageContainer from "./MessageTemplates/MessageContainer";
import TextMessage from "./MessageTemplates/TextMessage";
import { useSession } from "next-auth/react";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";

function WelcomeMessage() {
  const session = useSession();
  const t = useTranslations("chat-bot");
  return (
    <MessageContainer msgSender="chatbot">
      <TextMessage
        id="welcome-message-id"
        message={`${t("firstMessage", { name: session.data?.user?.first_name ? ` ${session.data?.user?.first_name}` : "" })}`}
        msgSender="chatbot"
      />
    </MessageContainer>
  );
}

export default memo(WelcomeMessage);
