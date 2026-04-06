import Image from "next/image";
import Contact from "../Contact";
import { Program } from "@/static-data/programs";

export default function ProgramTabContent({ program }: { program: Program }) {
  return (
    <div>
      <div className="relative mb-8 aspect-[34/20] rounded-sm bg-stone-100">
        {program?.image ? (
          <Image
            src={program?.image}
            alt="image"
            fill
            className="w-full object-cover object-center"
          />
        ) : (
          "no image found"
        )}
      </div>
      <h1 className="mb-1 text-2xl font-bold text-black sm:text-4xl lg:text-3xl">
        {program?.title}
      </h1>

      {program.subtitle_header && program.subtitle_body && (
        <div className="mb-7 flex flex-col  lg:w-[390px]">
          <p className=" text-2xl text-red-500">{program.subtitle_header}</p>
          <p className="text-xl  text-black ">{program.subtitle_body}</p>
        </div>
      )}
      {program?.details && (
        <div
          className="my-10"
          dangerouslySetInnerHTML={{ __html: program?.details }}
        />
      )}

      <Contact joinUs />
    </div>
  );
}
