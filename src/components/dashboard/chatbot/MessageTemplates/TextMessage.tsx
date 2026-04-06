import { MsgSender } from "@/types/chat";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";

const variants = cva(
  [" max-w-max rounded-lg  px-4 py-[10px] ", " max-md:text-sm whitespace-pre-wrap"],
  {
    variants: {
      variant: {
        user: "self-end bg-[#F04438] text-white rounded-se-none text-start",
        chatbot:
          "border border-[#E4E7EC] bg-[#F9FAFB] text-[#101828] rounded-ss-none text-start",
      },
    },
  },
);
export type TextMessageProps = {
  message: string;
  id: string;
  msgSender: MsgSender;
};
function TextMessage({ id, message, msgSender }: TextMessageProps) {
  return (
    <div
      id={id}
      className={cn(variants({ variant: msgSender }))}
      dangerouslySetInnerHTML={{ __html: message }}
    />
  );
}

export default TextMessage;
