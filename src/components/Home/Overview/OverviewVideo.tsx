"use client";
import { useEffect, useRef, useState } from "react";

const SRC = "https://drive.google.com/file/d/13VpmPVUv25sqiyvM9j8z_3X-TXaNsVud/preview";

export default function OverviewVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
      {visible && (
        <iframe
          src={SRC}
          className="h-full w-full"
          allowFullScreen
        />
      )}
    </div>
  );
}
