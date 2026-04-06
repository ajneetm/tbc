"use client";
import { Button } from "@/components/ui/button";
import { handleNewChat } from "../helpers/chats";
import { useDispatch } from "@/store/hooks";
import ChatbotHeaderLogo from "@/components/clock/ChatbotHeaderLogo";

function ChatHeader() {
  const dispatch = useDispatch();
  return (
    <div className="h-20 w-full border-b border-gray-200 px-6 pb-4 pt-6">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="mx-auto mt-auto max-w-max p-0 hover:bg-transparent"
            onClick={() => handleNewChat(dispatch)}
          >
            <ChatbotHeaderLogo clockSize="size-[40px]" isHeader />
            <h1 className="text-lg font-semibold text-[#101828]">Mr. DING</h1>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
