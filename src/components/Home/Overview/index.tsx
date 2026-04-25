import Link from "next/link";
import Graphic from "./Graphic";
import { getTranslations } from "next-intl/server";
export default async function Overview() {
  const t = await getTranslations("home.overview");
  return (
    <section
      id="overview"
      className="relative z-10 bg-white pb-[120px] pt-20 lg:pt-[120px]"
    >
      <div className="container">
        <section className="py-12">
          <div className="-mx-4 mb-8 flex flex-wrap">
            <div className="mb-8 h-full w-full px-4 lg:mb-0 lg:w-6/12 xl:w-5/12">
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  src="https://drive.google.com/file/d/13VpmPVUv25sqiyvM9j8z_3X-TXaNsVud/preview"
                  className="h-full w-full"
                  allow="autoplay"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="hidden px-4 xl:block xl:w-1/12"></div>

            <div className="w-full px-4 lg:w-6/12">
              <div className="flex w-full lg:justify-end">
                <div className="relative left-0 z-10  flex w-full flex-col lg:justify-end  xl:max-w-[491px]">
                  <h2 className="mb-4 text-3xl font-bold text-primary">
                    {t("title")}
                  </h2>
                  <p className="text-base text-body-color">
                    {t("description")}
                    <Link href="/overview" className="text-red-500 underline">
                      {t("readMore")}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Graphic />
    </section>
  );
}
