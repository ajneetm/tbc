"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import SecondHand from "./SecondHand.svg";
import MinuteHand from "./MinuteHand.svg";
import HourHand from "./HourHand.svg";
// import ClockBackground from "./main-clock.svg";
import Image from "next/image";
import "./clock.css";
import { cn } from "@/utils/cn";
import ClockBackground from "./ClockBackground";

// Dynamically import with no SSR
const Clock = ({
  className,
  clockSize = "size-[80px] md:size-[160px]",
  color = "#090E34",
  fill = "#fff",
  clockLocation,
  clockStyle,
  clockHandsClassName = "",
  hoursfill = "",
}: {
  className?: string;
  clockSize?: string;
  color?: string;
  fill?: string;
  invertClockHandsColor?: boolean;
  clockLocation?: "doha" | "london" | "new_york" | "tokyo" | "azores" | "worldwide";
  clockStyle?: React.CSSProperties;
  clockHandsClassName?: string;
  hoursfill?: string;
}) => {
  useEffect(() => {
    function initLocalClocks() {
      const timeZones = {
        doha: "Asia/Qatar",
        london: "Europe/London",
        new_york: "America/New_York",
        tokyo: "Asia/Tokyo",
        azores: "Atlantic/Azores",
        worldwide: "Etc/UTC",
      };
      const timeZone = clockLocation
        ? timeZones[clockLocation]
        : Intl.DateTimeFormat().resolvedOptions().timeZone;
      const date = new Date(
        new Date().toLocaleString("en-US", { timeZone: timeZone }),
      );
      const seconds = date.getSeconds();
      const minutes = date.getMinutes();
      const hours = date.getHours();

      const hands = [
        {
          hand: `hours-${clockLocation || "local"}`,
          angle: hours * 30 + minutes / 2,
        },
        { hand: `minutes-${clockLocation || "local"}`, angle: minutes * 6 },
        { hand: `seconds-${clockLocation || "local"}`, angle: seconds * 6 },
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

      const clock = document.getElementById(
        `ajnee-clock-${clockLocation || "local"}`,
      );
      clock?.classList.add("!opacity-100", "!bottom-10");
    }

    initLocalClocks();
  }, [clockLocation]);

  return (
    <div
      id={`ajnee-clock-${clockLocation || "local"}`}
      className={cn(className)}
    >
      <div className={cn("w-full", "flex items-center justify-center")}>
        <div style={clockStyle || {}} className={cn("relative", clockSize)}>
          <div className="clock">
            <ClockBackground color={color} fill={fill} hoursfill={hoursfill} clockLocation={clockLocation} />
          </div>
          <div id="seconds-container" className="seconds-container">
            <div id={`seconds-${clockLocation || "local"}`} className="seconds">
              <Image src={SecondHand} alt="seconds" priority className={clockHandsClassName} />
            </div>
          </div>
          <div id="minutes-container" className="minutes-container">
            <div id={`minutes-${clockLocation || "local"}`} className="minutes">
              <Image src={MinuteHand} alt="minutes" priority className={clockHandsClassName} />
            </div>
          </div>
          <div id="hours-container" className="hours-container">
            <div id={`hours-${clockLocation || "local"}`} className="hours">
              <Image src={HourHand} alt="hours" priority className={clockHandsClassName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Disable SSR
export default dynamic(() => Promise.resolve(Clock), { ssr: false });
