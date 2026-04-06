import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const siteName = process.env.SITE_NAME;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.signin');

  return {
    title: `${t('pageTitle')} | ${siteName}`,
    description: t('pageDescription')
  };
}

export default function SigninPage() {
  return (
    <>
      <Signin />
    </>
  );
}
