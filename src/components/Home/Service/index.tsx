"use client";
import SectionTitle from "@/components/Common/SectionTitle";
import { getAllServices } from "@/static-data/service";
import { useLocale, useTranslations } from "next-intl";
import SingleService from "./SingleService";

export default function Service() {
  const locale = useLocale();
  const serviceData = getAllServices(locale);
  const t = useTranslations("home.services");
  return (
    <section
      id="services"
      className="bg-black pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="-mx-4 mb-10 flex flex-wrap items-end lg:mb-[60px]">
          <div className="w-full px-4 lg:w-8/12">
            <SectionTitle
              mainTitle={t("title")}
              title={t("description")}
              width="625px"
              color="white"
              marginBottom="0px"
            />
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          {serviceData.map((service) => (
            <SingleService key={service?.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
