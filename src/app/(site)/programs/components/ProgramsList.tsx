"use client";
import SingleProgram from "@/components/programs/SingleProgram";
import { Program } from "@/static-data/programs";
import { useEffect, useRef } from "react";

type Props = {
  programs: Program[];
};
export default function ProgramsList(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <>
      <section className="bg-gray-50 pb-20 pt-[190px]" ref={ref}>
        <div className="container mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {props.programs.map((program) => (
              <SingleProgram key={program?.id} program={program} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
