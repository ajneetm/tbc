"use client";

import { Service } from "@/types/service";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ServiceTabButtons({
  serviceData,
  title,
}: {
  serviceData: Service[];
  title: string;
}) {
  const pathname = usePathname();

  return (
    <div>
      <h3 className="mb-[22px] text-[34px] font-bold text-black">{title}</h3>
      <div className="rounded-sm border border-stroke">
        {serviceData.map((service: Service) => (
          <Link
            href={`/service/${service?.id}`}
            key={service?.id}
            className={cn(
              `flex w-full items-center gap-3 border-b border-stroke px-5 py-4 text-lg font-medium duration-200 last-of-type:border-0 ${pathname === `/service//${service?.slug}` ? "text-primary" : "text-black hover:text-primary"}`,
            )}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.8 10.45L12.6844 3.2313C12.375 2.92192 11.8938 2.92192 11.5844 3.2313C11.275 3.54067 11.275 4.02192 11.5844 4.3313L17.3594 10.2094H2.75002C2.33752 10.2094 1.99377 10.5532 1.99377 10.9657C1.99377 11.3782 2.33752 11.7563 2.75002 11.7563H17.4282L11.5844 17.7032C11.275 18.0126 11.275 18.4938 11.5844 18.8032C11.7219 18.9407 11.9282 19.0094 12.1344 19.0094C12.3407 19.0094 12.5469 18.9407 12.6844 18.7688L19.8 11.55C20.1094 11.2407 20.1094 10.7594 19.8 10.45Z"
                fill="currentColor"
              />
            </svg>
            {service?.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
