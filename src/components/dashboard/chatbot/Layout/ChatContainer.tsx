"use client";
import { useSelector } from "@/store/hooks";
import ChatContent from "./ChatContent";
import ChatbotForm from "./ChatForm";
import ChatHeader from "./ChatHeader";
import StartChat from "../StartChat";
import { cn } from "@/lib/utils";
import MrAjnee from "@/../public/images/chat-bot/mr-ajnee.png";

import chatBg from "../../../../../public/images/dashboard/chat/chat-bg.jpg";
import Image from "next/image";

const ChatContainer: React.FC = () => {
  const { chats } = useSelector((state) => state.chatbot);
  const hasChats = chats.length > 0;
  return (
    <div
      className={cn(
        "mx-auto h-full md:w-[70%]",
        "max-md:flex max-md:flex-col max-md:items-center max-md:justify-end",
      )}
      style={{
        backgroundImage: `url(${chatBg.src})`,
        backgroundSize: "130%",
      }}
    >
      <Image
        src={MrAjnee}
        alt="Mr Ajnee"
        className="h-[150px] w-auto md:hidden"
      />
      <div
        className={cn(
          "relative flex size-full flex-col items-center bg-white px-4 text-center",
          "max-md:h-[70%] max-md:rounded-t-2xl",
        )}
      >
        {hasChats ? <ChatHeader /> : <StartChat />}
        <ChatContent type="chat" />
        <ChatbotForm />
      </div>
    </div>
  );
};

export default ChatContainer;
