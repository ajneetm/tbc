import { MsgSender } from "@/types/chat";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import ChatbotHeaderLogo from "@/components/clock/ChatbotHeaderLogo";
import { useSelector } from "@/store/hooks";
const messageLayoutVariants = cva("flex justify-start items-start", {
  variants: {
    variant: {
      user: "flex-row-reverse gap-3",
      chatbot: "gap-3",
    },
  },
});

type MessageContainerProps = {
  children: React.ReactNode;
  msgSender: MsgSender;
  hasChatbotImage?: boolean;
};
function MessageContainer({
  children,
  msgSender,
  hasChatbotImage = true,
}: MessageContainerProps) {
  const hasImage = msgSender === "chatbot" && hasChatbotImage;
  return (
    <div className={cn(messageLayoutVariants({ variant: msgSender }), "message-container")}>
      {hasImage && <ChatbotHeaderLogo clockSize="size-[40px]" />}

      {children}
    </div>
  );
}

export default MessageContainer;
