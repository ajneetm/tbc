"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
function VideoComponent({
  src,
  width,
  height,
  className,
}: {
  src: string;
  width: string;
  height: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const t = useTranslations("home.overview");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed) {
            const iframe = videoRef.current;
            if (iframe) {
              const src = iframe.src;
              iframe.src = src;
              setHasPlayed(true);
            }
          }
        });
      },
      { threshold: 0.5 }, // Trigger when 50% of element is visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [hasPlayed]);

  return (
    <iframe
      ref={videoRef}
      width={width}
      height={height}
      className={className}
      src={src}
      title={t("videoIframeTitle")}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
}

export default VideoComponent;
