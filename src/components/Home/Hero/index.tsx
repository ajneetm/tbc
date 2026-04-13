"use client";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import HeroClients from "./HeroClients";
import HeroImage from "./HeroImage";
export default function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  return (
    <div
      id="home"
      className="relative bg-white pb-10 pt-[140px]  lg:pt-[200px]"
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-6/12 xl:w-5/12">
            <div className="hero-content">
              <h1 className="mb-3 w-fit rounded-[10px] bg-red-500 p-2 text-xl font-bold leading-snug text-white sm:text-2xl lg:text-xl xl:text-2xl">
                {t("title")}
              </h1>
              <h1 className="mb-3 text-2xl font-bold leading-snug text-dark sm:text-4xl lg:text-3xl xl:text-4xl">
                {t("subtitle")}
              </h1>
              <p className="mb-8 max-w-[480px] text-base text-body-color">
                {t("description")}
              </p>
              <ul className="flex flex-wrap items-center gap-3">
                <li>
                  <a
                    href="/files/brochure.pdf"
                    download="The Business Clock Brochure.pdf"
                    target="_blank"
                    className="inline-flex items-center justify-center px-1 py-1 text-base font-normal text-body-color hover:text-primary"
                  >
                    <span className="mx-2">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="11" fill="#ef4444" />
                        <rect x="6.90906" y="13.3636" width="8.18182" height="1.63636" fill="white" />
                        <rect x="10.1818" y="6" width="1.63636" height="4.09091" fill="white" />
                        <path d="M11 12.5454L13.8343 9.47726H8.16576L11 12.5454Z" fill="white" />
                      </svg>
                    </span>
                    {t("link")}
                  </a>
                </li>
              </ul>

              {/* Clients */}
              <HeroClients />

              {/* CTA + hint — button stretches to match text block height */}
              <div className="mt-4 flex items-stretch gap-3">
                <Link
                  href="/dashboard/assessment"
                  className="flex flex-col items-center justify-center gap-1 rounded-[10px] bg-red-500 px-5 text-base font-bold text-white shadow-md hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    <path d="M9 12h6M9 16h4" />
                  </svg>
                  <span>{t("cta")}</span>
                </Link>
                <div className={`text-sm text-gray-600 leading-relaxed ${locale === "ar" ? "text-right" : "text-left"}`}>
                  <p className="font-semibold text-gray-700 mb-0.5">{t("ctaTime")}</p>
                  <p className="text-xs text-gray-500 max-w-[340px]">{t("ctaHint")}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden px-4 xl:block xl:w-1/12"></div>
          <div className="w-full px-4 lg:w-6/12 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center w-full max-lg:mt-10 lg:justify-end">
              <HeroImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
