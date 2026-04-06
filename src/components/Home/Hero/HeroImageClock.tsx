import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import React from "react";
import HourHand from "@/components/clock/HourHand.svg";
import MinuteHand from "@/components/clock/MinuteHand.svg";
import SecondHand from "@/components/clock/homepageSecondHand.svg";
// import ClockBackground from "./main-clock.svg";
import { cn } from "@/utils/cn";
import Image from "next/image";
import "@/components/clock/clock.css";
import ClockBackground from "@/components/clock/ClockBackground";
interface HeroImageClockProps {
  containerRef: React.RefObject<HTMLDivElement>;
}
const CLOCK_SIZE_RATIO = 0.5;

export default function HeroImageClock({ containerRef }: HeroImageClockProps) {
  const [clockDimensions, setClockDimensions] = useState({ width: 0, height: 0 });
  const resizeTimeout = useRef<NodeJS.Timeout>();
  const updateClockSize = useCallback(() => {
    if (!containerRef.current) return;
    
    // Clear any pending updates
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    // Debounce the update
    resizeTimeout.current = setTimeout(() => {
      const width = containerRef.current?.clientWidth || 0;
      setClockDimensions({
        width: width * CLOCK_SIZE_RATIO,
        height: width * CLOCK_SIZE_RATIO
      });
    }, 16); // roughly one frame at 60fps
  }, [containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Small delay to ensure container is rendered
    const initialTimeout = setTimeout(() => {
      updateClockSize();
    }, 100);

    const resizeObserver = new ResizeObserver(updateClockSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(resizeTimeout.current);
      resizeObserver.disconnect();
    };
  }, [updateClockSize]);

  const clockStyle = useMemo(() => ({
    width: `${clockDimensions.width}px`,
    height: `${clockDimensions.height}px`,
    userSelect: "none",
  }), [clockDimensions.width, clockDimensions.height]);

  return (
    <div className="absolute inset-0 z-50 size-[100%] select-none" dir="ltr">
      <Clock
        className="size-[100%] pt-[32%] [margin-inline-start:0.7%] select-none"
        clockStyle={clockStyle}
        hoursfill="#7D7D7D"
        color="#fff"
        clockLocation="worldwide"
        fill="#000"
        clockHandsClassName="[.minutes_&]:invert [.hours_&]:invert"
        ajneeFill="#D5534A"
      />
    </div>
  );
} 



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
  ajneeFill = "",
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
  ajneeFill?: string;
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
            <ClockBackground color={color} fill={fill} hoursfill={hoursfill} ajneeFill={ajneeFill} clockLocation={clockLocation} />
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

