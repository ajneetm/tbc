"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CallToActionCard() {
  const t = useTranslations("service.callToAction");
  return (
    <div className="bg-primary px-7 py-10 text-center">
      <div className="mx-auto w-full max-w-[215px]">
        <h3 className="mb-5 text-2xl font-bold text-white">{t("title")}</h3>
        <p className="mb-1.5 text-white">+44 7386590966</p>
        <p className="mb-9 text-white">info@thebusinessclock.com</p>
        <Link
          href={"/#contact"}
          className="flex h-12 w-full items-center justify-center rounded-full bg-white text-center font-medium text-black"
        >
          {t("button")}
        </Link>
      </div>
    </div>
  );
}
