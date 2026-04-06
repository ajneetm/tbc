"use client";

import MrAjnee from "@/../public/images/chat-bot/mr-ajnee.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./style.css";
import { useTranslations } from "next-intl";
function ChatPot() {
  const pathName = usePathname();
  const t = useTranslations("chat-bot");
  if (pathName === "/dashboard/chatbot") return null;
  return (
    <div className="group fixed bottom-10 z-50 size-[80px] cursor-pointer [inset-inline-end:20px] md:size-[160px]">
      <div className="absolute top-[10px] hidden w-max rounded-2xl bg-[#090e34] p-4 text-white [inset-inline-end:75px] before:absolute before:right-[-8px] before:top-[20px] before:h-0 before:w-0 before:border-b-[8px] before:border-l-[8px] before:border-t-[8px] before:border-b-transparent before:border-l-[#090e34] before:border-l-current before:border-t-transparent before:content-[''] group-hover:flex  md:top-[25px] md:[inset-inline-end:160px] md:before:right-[-10px] md:before:top-[30px] md:before:border-b-[10px] md:before:border-l-[10px] md:before:border-t-[10px]">
        <p className="text-[8px] sm:text-[12px] md:text-base">
          {t("title")}
        </p>
      </div>
      <Link href={"/dashboard/chatbot"}>
        <div className="absolute left-0 top-0 z-10 size-full">
          <Image src={MrAjnee} alt="Next.js logo" fill priority />
        </div>
        <div className="animate-lighting size-full">
          <Image src={MrAjnee} alt="Next.js logo" fill priority />
        </div>
      </Link>
    </div>
  );
}

export default ChatPot;
