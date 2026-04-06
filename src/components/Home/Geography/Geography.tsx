import SectionTitle from "@/components/Common/SectionTitle";
import Image from "next/image";
import GeographyBackground from "@/../public/images/geography/geography.svg";
import Clock from "@/components/clock";
import { useTranslations } from "next-intl";
// import ClockBackground from "./main-clock.svg";

export default function Geography() {
  const t = useTranslations("home.geography");
  return (
    <section id="geography" className="bg-white py-[120px]">
      <div className="container">
        <SectionTitle
          paragraph={
            <span>
              {t("titleStart")}{" "}
              <span className="font-[900] text-[#0d0e32] whitespace-nowrap">
                {t("titleMiddle")}
              </span>
              {" "}
              {t("titleEnd")}
            </span>
          }
          center
          titleClassName=" text-xl  sm:text-xl md:text-2xl"
        />

        <div className="-mx-4 flex justify-center">
          <div className="w-full px-4 lg:w-9/12">
            <div className="relative">
              <Image src={GeographyBackground} alt="Geography Background" />
              <div className="absolute top-[27%] z-50  flex flex-col items-center transition-all duration-700 [inset-inline-start:10%]">
                <Clock
                  clockSize="size-[40px] sm:size-[60px] md:size-[100px]"
                  color="#8A1538"
                  clockLocation="new_york"
                />
              </div>
              <div className="absolute top-[27%] z-50  flex flex-col  items-center transition-all duration-700 [inset-inline-start:25%]">
                <Clock
                  clockSize="size-[40px] sm:size-[60px] md:size-[100px]"
                  color="#000"
                  clockLocation="azores"
                />
              </div>
              <div className="absolute top-[27%] z-50  flex flex-col  items-center transition-all duration-700 [inset-inline-start:40%]">
                <Clock
                  clockSize="size-[40px] sm:size-[60px] md:size-[100px]"
                  color="#228B22"
                  clockLocation="london"
                />
              </div>

              <div className="absolute top-[27%] z-50 flex flex-col  items-center transition-all duration-700 [inset-inline-start:55%]">
                <Clock
                  clockSize="size-[40px] sm:size-[60px] md:size-[100px]"
                  color="#003366"
                  clockLocation="doha"
                />
              </div>
              <div className="absolute top-[27%] z-50  flex flex-col  items-center transition-all duration-700 [inset-inline-start:70%]">
                <Clock
                  clockSize="size-[40px] sm:size-[60px] md:size-[100px]"
                  color="#C83600"
                  clockLocation="tokyo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
