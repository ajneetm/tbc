"use client";
import { heroClientsData } from "@/static-data/brands";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { useTranslations } from "next-intl";

export default function HeroClients() {
  const t = useTranslations("home.hero");
  return (
    <div className="clients pt-8">
      <p className="mb-2 flex items-center text-xs font-normal text-body-color">
        {t("clients")}
      </p>
      <div className="flex items-center gap-4 ">
        {heroClientsData.map((client, index) => (
          <Fragment key={client?.id}>
            <Link
              href={client?.link}
              target="_blank"
              className={cn("py-3", client?.className)}
            >
              <Image src={client?.image} alt={client?.name} height={70} />
            </Link>
            {index !== heroClientsData.length - 1 && (
              <span className="h-8 w-[1px] bg-body-color"></span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
