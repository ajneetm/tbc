"use client";
import { Stakeholder } from "@/types/stakeholder";
import Link from "next/link";

import "yet-another-react-lightbox/styles.css";

export default function SingleStakeholder({
  stakeholder,
}: {
  stakeholder: Stakeholder;
}) {
  return (
    <>
      <div className="mb-4">
        <div className="group relative mb-8 aspect-[518/291] overflow-hidden rounded-md shadow-service">
          <div
            style={{ backgroundImage: `url(${stakeholder?.image})` }}
            className="h-full w-full bg-cover bg-center"
          />
          <Link
            target="_blank"
            href={stakeholder?.link}
            className="invisible absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[#4A6CF7] bg-opacity-[17%] opacity-0 transition group-hover:visible group-hover:opacity-100"
          ></Link>
        </div>
        <h3 className="mt-6">
          <Link
            href={stakeholder?.link}
            className="mb-3 inline-block text-xl font-semibold text-black hover:text-[#4A6CF7]"
          >
            {stakeholder?.title}
          </Link>
        </h3>
        <p className="text-base font-medium text-body-color">
          {stakeholder?.sortDescription}
        </p>
      </div>
    </>
  );
}
