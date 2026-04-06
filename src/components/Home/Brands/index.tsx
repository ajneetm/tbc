"use client";
import CPD from "@/../public/images/brands/CPD_accreditation.svg";
import Image from "next/image";
import VideoComponent from "../../Common/VideoComponent";
import { useTranslations } from "next-intl";

export default function Brands() {
  const t = useTranslations("home.brands"); 
  return (
    <section
      id="accreditation"
      className="relative bg-black pb-[250px] pt-20 lg:pt-[120px]"
    >
      <div className="container">
        <div className="mx-[-16px] flex flex-col flex-wrap gap-y-3">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[570px] text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                {t("title")}
              </h2>
              <p className="text-lg font-medium text-body-color">
                {t("descriptionStart")}{" "}
                  <a
                    href="https://cpduk.co.uk/"
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="text-red-500 underline"
                  >
                    {t("descriptionLink")}
                  </a>{" "}
                {t("descriptionEnd")}
              </p>
            </div>
          </div>
          <div className="w-full px-4">
            <div className="flex flex-wrap items-center justify-center">
              <a
                href="https://cpduk.co.uk/"
                target="_blank"
                rel="nofollow noreferrer"
                className="relative mx-3 flex max-w-[120px] items-center justify-center py-[15px]  sm:mx-4 lg:max-w-[140px] xl:mx-6 xl:max-w-[160px] 2xl:mx-8 2xl:max-w-[180px]"
              >
                <Image
                  src={CPD}
                  alt="CPD"
                  className="brightness-150 grayscale"
                />
              </a>
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <VideoComponent
              width="560"
              height="315"
              src="https://www.youtube.com/embed/WevZ17TQzfA?si=uiAeJk8TJJI_3xaR&autoplay=1&mute=1&loop=1&playlist=WevZ17TQzfA&rel=0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
