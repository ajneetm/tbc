import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
  
const siteName = process.env.SITE_NAME;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.signup');

  return {
    title: `${t('pageTitle')} | ${siteName}`,
    description: t('pageDescription')
  };
}

export default function SignupPage() {
  return (
    <>
      <Signup />
    </>
  );
}
