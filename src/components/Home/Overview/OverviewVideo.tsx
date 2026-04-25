"use client";
import { useEffect, useRef, useState } from "react";

const BASE = "https://drive.google.com/file/d/13VpmPVUv25sqiyvM9j8z_3X-TXaNsVud/preview";

export default function OverviewVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(BASE);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSrc(`${BASE}?autoplay=1`);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="aspect-video w-full overflow-hidden rounded-xl">
      <iframe
        src={src}
        className="h-full w-full"
        allow="autoplay"
        allowFullScreen
      />
    </div>
  );
}
