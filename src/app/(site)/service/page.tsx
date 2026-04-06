
import SingleService from "@/components/Home/Service/SingleService";

import { Metadata } from "next";
import { getAllServices } from "@/static-data/service";
import { useLocale } from "next-intl";
import { getLocale } from "next-intl/server";

const siteName = process.env.SITE_NAME;

export const metadata: Metadata = {
  title: `Services Page | ${siteName}`,
  description: "This is Blog page description",
  // other metadata
};

export default async function ServicePage() {
  const locale = await getLocale();
  const serviceData = getAllServices(locale);
  
  return (
    <>

      <section className="bg-gray-50  pb-[100px] pt-[250px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {serviceData.map((service) => (
              <SingleService key={service?.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
