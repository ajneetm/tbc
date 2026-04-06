"use client";
import {
  footerLinks,
  footerHotLinks,
  footerQuickLinks,
} from "@/static-data/footer";
import FooterBottom from "./FooterBottom";
import FooterContact from "./FooterContact";
import FooterLinkItem from "./FooterLinkItem";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathName = usePathname();
  const isChatbot = pathName.includes("chatbot");
  if (isChatbot) {
    return null;
  }
  return (
    <footer className="relative z-10 bg-black pb-12 pt-[100px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2 lg:w-4/12">
            <FooterContact />
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-3/12">
            <div className="mb-10">
              <h3 className="mb-9 text-xl font-semibold text-white">
                Trusted by
              </h3>
              <ul className="space-y-3">
                {footerLinks.map((linkItem) => (
                  <FooterLinkItem key={linkItem?.id} linkItem={linkItem} />
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-2/12">
            <div className="mb-10">
              <h3 className="mb-9 text-xl font-semibold text-white">
                Hot Links
              </h3>
              <ul className="space-y-3">
                {footerHotLinks.map((linkItem) => (
                  <FooterLinkItem key={linkItem?.id} linkItem={linkItem} />
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 lg:w-3/12">
            <div className="mb-10">
              <h3 className="mb-9 text-xl font-semibold text-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {footerQuickLinks.map((linkItem) => (
                  <FooterLinkItem key={linkItem?.id} linkItem={linkItem} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}
