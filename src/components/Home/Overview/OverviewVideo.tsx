"use client";
import { useEffect, useRef } from "react";

const SRC = "https://www.youtube.com/embed/gC1sDrDMcOo?enablejsapi=1&mute=1&rel=0";

export default function OverviewVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeReadyRef = useRef(false);
  const shouldPlayRef = useRef(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const play = () =>
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: "" }),
        "*",
      );

    const onLoad = () => {
      iframeReadyRef.current = true;
      if (shouldPlayRef.current) play();
    };
    iframe.addEventListener("load", onLoad);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          shouldPlayRef.current = true;
          if (iframeReadyRef.current) play();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(iframe);

    return () => {
      iframe.removeEventListener("load", onLoad);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
      <iframe
        ref={iframeRef}
        src={SRC}
        title="The Business Clock Introduction"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
