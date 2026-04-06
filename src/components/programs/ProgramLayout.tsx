"use client";
import { useEffect, useRef } from "react";
import CallToActionCard from "../Service/CallToActionCard";
import ProgramTabButtons from "./ProgramTabButtons";
import ProgramTabContent from "./ProgramTabContent";
import { Program } from "@/static-data/programs";

export default function ProgramLayout({
  program,
  data,
  title,
}: {
  program: Program;
  data: Program[];
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const haHash = window.location.hash === "#contact";
    const joinUs = document.getElementById("contact");
    const scrollTo = haHash ? joinUs : ref.current;
    if (scrollTo) {
      scrollTo.scrollIntoView({ behavior: "smooth",});
    }
  }, []);
  return (
    <>
      <section className="bg-gray-50 pb-20 pt-[60px]">
        <div className="container pt-[90px]" ref={ref}>
          <div className="-mx-5  mt-5 flex flex-wrap">
            <div className="w-full px-5 lg:w-4/12">
              <div className="space-y-10">
                <ProgramTabButtons programData={data} title={title} />

                <CallToActionCard />
              </div>
            </div>

            <div className="w-full px-5 lg:w-8/12">
              <ProgramTabContent program={program as Program} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
