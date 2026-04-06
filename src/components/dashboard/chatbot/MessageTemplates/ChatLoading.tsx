import { MsgSender } from "@/types/chat";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import { trailingItemsIds } from "../Layout/ChatContent";

const variants = cva(
  [
    " max-w-max rounded-lg  px-4 py-[10px] flex items-center justify-center ",
    "text-pretty whitespace-pre-wrap",
  ],
  {
    variants: {
      variant: {
        user: "self-end bg-[#F04438] text-white rounded-se-none text-end",
        chatbot:
          "border border-[#E4E7EC] bg-[#F9FAFB] text-[#101828] rounded-ss-none text-start",
      },
    },
  },
);
export type ChatLoadingProps = {
  msgSender: MsgSender;
};
function ChatLoading({ msgSender }: ChatLoadingProps) {
  return (
    <div
      className={cn(variants({ variant: msgSender }))}
      id={trailingItemsIds.loading}
    >
      <span className="mx-1 size-2 animate-bounce rounded-full bg-gray-600 delay-0"></span>
      <span className="mx-1 size-2 animate-bounce rounded-full bg-gray-600 delay-200"></span>
      <span className="mx-1 size-2 animate-bounce rounded-full bg-gray-600 delay-500"></span>
    </div>
  );
}

export default ChatLoading;
