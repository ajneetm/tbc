"use client";
import { useEffect, useMemo, useRef } from "react";
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeReadyRef = useRef(false);
  const shouldPlayRef = useRef(false);
  const t = useTranslations("home.overview");

  const iframeSrc = useMemo(() => {
    try {
      const url = new URL(src);
      url.searchParams.delete("autoplay");
      url.searchParams.set("enablejsapi", "1");
      return url.toString();
    } catch {
      return src;
    }
  }, [src]);

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
    <iframe
      ref={iframeRef}
      width={width}
      height={height}
      className={className}
      src={iframeSrc}
      title={t("videoIframeTitle")}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}

export default VideoComponent;
