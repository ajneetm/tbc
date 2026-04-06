import overviewClock from "@/../public/images/overview/overview-clock.png";
import Clock from "@/components/clock";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

const siteName = process.env.SITE_NAME;

export const generateMetadata = async () => {
  const t = await getTranslations("overview");
  return {
    title: `${t("pageTitle")} | ${siteName}`,
    description: t("pageDescription"),
  };
};

export default async function page() {
  const t = await getTranslations("overview");
  return (
    <>
      <section className=" bg-gray-50 pb-20 pt-[150px]">
        <div className="container grid grid-cols-1 gap-8 lg:grid-cols-2 ">
          <Clock
            className=" !relative !inset-0 z-50 !size-full  transition-all duration-700 [inset-inline-start:10px] md:[inset-inline-start:40px]"
            clockSize="size-[300px]"
          />
          <div className="">
            <h2 className="mb-4 text-3xl font-bold text-primary">{t("overview.title")}</h2>
            <p className="text-lg text-body-color">{t("overview.description")}</p>
          </div>
        </div>
      </section>

      <section className=" bg-gray-50 pb-20 pt-[90px]">
        <div className="container grid grid-cols-1 gap-8 lg:grid-cols-2 ">
          <div className="flex w-full items-start justify-center">
            <Image
              src={overviewClock}
              alt="Overview Clock"
              className="size-[300px]"
            />
          </div>

          <div className="">
            <h4 className="mb-8 text-xl font-bold text-primary">{t("ding-model.title")}</h4>
            <p className="text-body-color ">{t("ding-model.description")}</p>
            <hr className="my-8 border-[2px]" />

            <div className="flex flex-col items-stretch gap-6">
              <div className="rounded-lg border-[3px] border-[#FBD748] p-6 shadow-lg transition hover:shadow-xl">
                <h3 className="mb-3 text-xl font-semibold ">{t("ding-model.cards.draft.title")}</h3>
                <p className="text-sm text-body-color">
                  {t("ding-model.cards.draft.description")}
                </p>
              </div>
              <div className="rounded-lg border-[3px] border-[#3CB1EE] p-6 shadow-lg transition hover:shadow-xl">
                <h3 className="mb-3 text-xl font-semibold ">{t("ding-model.cards.incorporate.title")}</h3>
                <p className="text-sm text-body-color">
                  {t("ding-model.cards.incorporate.description")}
                </p>
              </div>
              <div className="rounded-lg border-[3px] border-[#F75150] p-6 shadow-lg transition hover:shadow-xl">
                <h3 className="mb-3 text-xl font-semibold ">{t("ding-model.cards.navigate.title")}</h3>
                <p className="text-sm text-body-color">
                  {t("ding-model.cards.navigate.description")}
                </p>
              </div>
              <div className="rounded-lg border-[3px] border-[#60EA60] p-6 shadow-lg transition hover:shadow-xl">
                <h3 className="mb-3 text-xl font-semibold ">{t("ding-model.cards.generate.title")}</h3>
                <p className="text-sm text-body-color">
                  {t("ding-model.cards.generate.description")}
                </p>
              </div>
            </div>

            <p className="mt-12 text-body-color">
              {t("ding-model.footer")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
