import { pricingData } from "../../../../stripe/pricingData";
import SinglePricing from "./SinglePricing";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative z-20 overflow-hidden bg-white pb-8 pt-20 lg:pt-[120px]"
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-primary">
                PRICING
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px]">
                Our Pricing Plan
              </h2>
              <p className="text-base text-body-color">
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {pricingData &&
            pricingData.map((price, key) => (
              <SinglePricing price={price} key={key} />
            ))}
        </div>
      </div>
    </section>
  );
}
