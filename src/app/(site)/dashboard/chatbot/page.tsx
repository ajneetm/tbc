"use server";
import { auth } from "@/app/libs/helper/auth";
import ChatContainer from "@/components/dashboard/chatbot/Layout/ChatContainer";
async function ChatbotPage() {
  // const session = await auth();

  return (
    <section className="h-full pb-4 pt-[120px] max-md:pt-[105px]">
      <ChatContainer />
    </section>
  );
}

export default ChatbotPage;
