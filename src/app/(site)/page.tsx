import Contact from "@/components/Contact";
import Brands from "@/components/Home/Brands";
import Geography from "@/components/Home/Geography/Geography";
import Hero from "@/components/Home/Hero";
import Overview from "@/components/Home/Overview";
import Service from "@/components/Home/Service";
import Stakeholder from "@/components/Stakeholder";
import { getLocale, getTranslations } from "next-intl/server";

const siteName = process.env.SITE_NAME;
export const generateMetadata = async () => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  openGraph: {
    title: t("metadata.title"),
    description: t("metadata.description"),
    url: siteName,
    siteName: t("metadata.siteName"),
    images: [
      {
        url: `https://www.thebusinessclock.com/images/logo/bc-big.png`,
        width: 1200,
        height: 630,
        alt: "Business Clock Logo",
      },
    ],
    type: "website",
  },
  twitter: {
      card: "summary_large_image",
      title: t("metadata.title"),
      description: t("metadata.description"),
      images: [`https://www.thebusinessclock.com/images/logo/bc-big.png`],
    },
  };
};

export default function Home() {
  return (
    <>
      <Hero />
      <Overview />
      <Service />
      <Stakeholder />
      <Brands />
      <Geography />
      <Contact />
    </>
  );
}
