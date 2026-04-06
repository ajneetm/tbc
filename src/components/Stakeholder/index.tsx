"use client";

import { stakeHolderData } from "@/static-data/stakeholder";
import { useMemo } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import SectionTitle from "../Common/SectionTitle";
import SingleStakeholder from "./SingleStakeholder";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
export default function Stakeholder() {
  const locale = useLocale();
  const items = useMemo(() => stakeHolderData(locale), [locale]);
  const t = useTranslations("home.stakeholder");

  return (
    <section id="stakeholder" className="bg-[#f8f9ff] pb-[70px] pt-[120px]">
      <div className="container">
        <div className="mx-[-16px] flex flex-wrap">
          <div className="w-full px-4">
            <SectionTitle
              title={t("title")}
              paragraph={t("description")}
              center
            />
          </div>
        </div>

        <div className="stakeholder-container -mx-4 flex justify-center">
          <div className="w-full px-4 xl:w-10/12">
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
              <Masonry gutter="30px">
                {items.map((stakeholder) => (
                  <SingleStakeholder
                    key={stakeholder?.id}
                    stakeholder={stakeholder}
                  />
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </div>
      </div>
    </section>
  );
}
