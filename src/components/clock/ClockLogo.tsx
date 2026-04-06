"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import SecondHand from "./clock-logo-second-hand.svg";
import MinuteHand from "./MinuteHand.svg";
import HourHand from "./HourHand.svg";
import ClockBackground from "./ClockBackground";
import Image from "next/image";
import "./clock.css";
import { cn } from "@/utils/cn";

// Dynamically import with no SSR
const ClockLogo = ({ clockSize = "size-[80px]" }: { clockSize?: string }) => {
  useEffect(() => {
    function initLocalClocks() {
      const date = new Date();
      const seconds = date.getSeconds();
      const minutes = date.getMinutes();
      const hours = date.getHours();

      const hands = [
        {
          hand: `hours-logo`,
          angle: hours * 30 + minutes / 2,
        },
        { hand: `minutes-logo`, angle: minutes * 6 },
        { hand: `seconds-logo`, angle: seconds * 6 },
      ];

      hands.forEach(({ hand, angle }) => {
        const elements = document.querySelectorAll(`#${hand}`);
        elements.forEach((element) => {
          const el = element as HTMLElement;
          el.style.transform = `rotateZ(${angle}deg)`;
          if (hand === "minutes") {
            const secondAngle = hands[2].angle; // Seconds angle
            const secondOffset = secondAngle / 6;
            el.parentElement?.style.setProperty(
              "animation-delay",
              `-${secondOffset}s`,
            );
          }
        });
      });

      const clock = document.getElementById(`ajnee-clock-logo`);
      clock?.classList.add("!opacity-100", "!bottom-10");
    }

    initLocalClocks();
  }, []);

  return (
    <div id={`ajnee-clock-logo`}>
      <div className={cn("w-full", "flex items-center justify-center")}>
        <div className={cn("relative", clockSize)}>
          <div className="clock">
          <ClockBackground color="#090E34" clockLocation={"doha"} />
          </div>
          <div id="seconds-container" className="seconds-container">
            <div id={`seconds-logo`} className="seconds">
              <Image src={SecondHand} alt="seconds" priority />
            </div>
          </div>
          <div id="minutes-container" className="minutes-container">
            <div id={`minutes-logo`} className="minutes">
              <Image src={MinuteHand} alt="minutes" priority />
            </div>
          </div>
          <div id="hours-container" className="hours-container">
            <div id={`hours-logo`} className="hours">
              <Image src={HourHand} alt="hours" priority />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Disable SSR
export default dynamic(() => Promise.resolve(ClockLogo), { ssr: false });
