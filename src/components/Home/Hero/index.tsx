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
              <ul className="flex flex-wrap items-center gap-8">
                <li className="leading-none">
                  <a
                    href="/files/brochure.pdf"
                    download="The Business Clock Brochure.pdf"
                    target="_blank"
                    className="inline-flex items-center justify-center py-1 text-center text-base font-normal text-body-color hover:text-primary"
                  >
                    <span className="mx-2">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="11" cy="11" r="11" fill="#ef4444" />
                        <rect
                          x="6.90906"
                          y="13.3636"
                          width="8.18182"
                          height="1.63636"
                          fill="white"
                        />
                        <rect
                          x="10.1818"
                          y="6"
                          width="1.63636"
                          height="4.09091"
                          fill="white"
                        />
                        <path
                          d="M11 12.5454L13.8343 9.47726H8.16576L11 12.5454Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    {t("link")}
                  </a>
                </li>
              </ul>

              <HeroClients />
            </div>
          </div>
          <div className="hidden px-4 xl:block xl:w-1/12"></div>
          <div className="w-full px-4 lg:w-6/12 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center w-full max-lg:mt-10 lg:justify-end gap-10">
              <HeroImage />
              <div>

                <Link href={"/dashboard/assessment"} className="rounded-[10px] z-50 cursor-pointer bg-red-500 p-2 px-4 text-xl font-bold flex items-center justify-center text-white sm:text-2xl lg:text-xl xl:text-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                 <p className={`${locale === "ar" ? "pt-1" : ""}`}>
                  {t("cta")}
                  </p>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
