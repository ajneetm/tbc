import Image from "next/image";
import { useRef } from "react";
import HeroImageClock from "./HeroImageClock";

export default function HeroImage() {
  const containerSize = useRef<HTMLDivElement>(null);

  return (
    <div className="relative z-10 flex aspect-[491/515] w-full max-w-[491px] pt-11 lg:justify-end lg:pt-0" ref={containerSize}>
      <Image src="/images/hero/hero.svg" alt="hero" fill />
      <HeroImageClock containerRef={containerSize} />
      
    </div>
  );
}
