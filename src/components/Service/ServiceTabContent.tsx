import { Service } from "@/types/service";
import Image from "next/image";

export default function ServiceTabContent({ service }: { service: Service }) {
  return (
    <div>
      <div className="relative mb-8 aspect-[34/20] rounded-sm bg-stone-100">
        {service?.image ? (
          <Image
            src={service?.image}
            alt="image"
            fill
            className="w-full object-cover object-center"
          />
        ) : (
          "no image found"
        )}
      </div>
      <h1 className="mb-7 text-2xl font-bold text-black sm:text-4xl lg:text-3xl">
        {service?.title}
      </h1>
      {service?.details && (
        <div
          className="my-10"
        >
          {service?.details}
        </div>
      )}
    </div>
  );
}
