"use client";
import { Service } from "@/types/service";
import { useEffect, useRef } from "react";
import CallToActionCard from "./CallToActionCard";
import ServiceTabButtons from "./ServiceTabButtons";
import ServiceTabContent from "./ServiceTabContent";

export default function ServiceLayout({
  service,
  data,
  title,
}: {
  service: Service;
  data: Service[];
  title: string;
  prefixPath: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <>
      <section className="bg-gray-50 pb-20 pt-[150px]" ref={ref}>
        <div className="container  mt-5">
          <div className="-mx-5 flex flex-wrap">
            <div className="w-full px-5 lg:w-4/12">
              <div className="space-y-10">
                <ServiceTabButtons serviceData={data} title={title} />

                <CallToActionCard />
              </div>
            </div>

            <div className="w-full px-5 lg:w-8/12">
              <ServiceTabContent service={service as Service} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
