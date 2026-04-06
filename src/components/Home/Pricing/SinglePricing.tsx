"use client";
import axios from "axios";
import SingleOffer from "./SingleOffer";
import SinglePricingGraphic from "./SinglePricingGraphic";
import { integrations, messages } from "../../../../integrations.config";
import toast from "react-hot-toast";

export default function SinglePricing({ price }: any) {
  const handleSubscription = async (e: any) => {
    e.preventDefault();

    if (!integrations?.isStripeEnabled) {
      return toast.error(messages?.stripe);
    }

    const { data } = await axios.post(
      "/api/payment",
      {
        priceId: price.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    window.location.assign(data);
  };

  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div className="relative z-10 mb-10 overflow-hidden rounded-xl border border-primary border-opacity-20 bg-white px-8 py-10 shadow-pricing sm:p-12 lg:px-6 lg:py-10 xl:px-10 2xl:p-12">
        <span className="mb-4 block text-lg font-semibold text-primary">
          {price?.nickname}
        </span>
        <h2 className="mb-5 text-[42px] font-bold text-dark">
          $
          {(price.unit_amount / 100).toLocaleString("en-US", {
            currency: "USD",
          })}{" "}
          <span className="text-base font-medium text-body-color">
            {" "}
            / year{" "}
          </span>
        </h2>
        <p className="mb-8 border-b border-[#F2F2F2] pb-8 text-base text-body-color">
          Perfect for using in a personal website or a client project.
        </p>
        <div className="mb-7 space-y-1">
          {price?.nickname === "Personal" && (
            <>
              <SingleOffer text="1 User" />
              <SingleOffer text="All UI components" />
              <SingleOffer text="Lifetime access" />
              <SingleOffer text="Free updates" />
              <SingleOffer text="Use on 1 (one) project" />
              <SingleOffer text="3 Months support" />
            </>
          )}
          {price?.nickname === "Professional" && (
            <>
              <SingleOffer text="5 User" />
              <SingleOffer text="All UI components" />
              <SingleOffer text="Lifetime access" />
              <SingleOffer text="Free updates" />
              <SingleOffer text="Use on 3 (Three) project" />
              <SingleOffer text="5 Months support" />
            </>
          )}
          {price?.nickname === "Business" && (
            <>
              <SingleOffer text="Unlimited User" />
              <SingleOffer text="All UI components" />
              <SingleOffer text="Lifetime access" />
              <SingleOffer text="Free updates" />
              <SingleOffer text="Use on Unlimited project" />
              <SingleOffer text="Lifetime support" />
            </>
          )}
        </div>
        <button
          onClick={handleSubscription}
          className={`block w-full rounded-md border p-4 text-center text-base font-semibold duration-200 ${price?.nickname === "Professional" ? "border-primary bg-primary text-white hover:bg-primary/90" : "border-[#D4DEFF] bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-white"}`}
        >
          Choose {price?.nickname}
        </button>

        <SinglePricingGraphic />
      </div>
    </div>
  );
}
