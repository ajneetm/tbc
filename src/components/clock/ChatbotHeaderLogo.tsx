"use client";

import { cn } from "@/utils/cn";
import dynamic from "next/dynamic";
import Image from "next/image";
import "./clock.css";
import EmptyClockAnimateBody from "./empty_clock_animate_body.svg";
import EmptyClockBorder from "./empty_clock_border.svg";
import EmptyClockStaticBody from "./empty_clock_static_body.svg";

const ChatbotHeaderLogo = ({
  clockSize = "size-[40px]",
  isHeader = false,
}: {
  clockSize?: string;
  isHeader?: boolean;
}) => {
  return (
    <div className={clockSize}>
      <div className={cn("relative", clockSize)}>
        <div className={cn("clock", { "reverse-spin": isHeader })}>
          <Image src={EmptyClockBorder} alt="Ajnee" width={40} height={40} />
        </div>
        <div className="clock">
          <Image
            src={EmptyClockStaticBody}
            alt="Ajnee2"
            width={40}
            height={40}
          />
        </div>
        <div
          className={cn("clock", { "animate-spin": isHeader })}
          style={isHeader ? { animationDuration: "30s" } : {}}
        >
          <Image
            src={EmptyClockAnimateBody}
            alt="Ajnee3"
            width={40}
            height={40}
            style={{ animationDuration: "20s" }}
          />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ChatbotHeaderLogo), {
  ssr: false,
});
