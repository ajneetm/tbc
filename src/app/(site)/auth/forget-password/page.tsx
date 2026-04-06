import ForgetPassword from "@/components/Auth/ForgetPassword";

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const siteName = process.env.SITE_NAME;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.forgetPassword');

  return {
    title: `${t('pageTitle')} | ${siteName}`,
    description: t('pageDescription')
  };
}
  
const ForgetPasswordPage = () => {
  return <ForgetPassword />;
};

export default ForgetPasswordPage;
