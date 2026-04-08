import ResetPassword from "@/components/Auth/ResetPassword";

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const siteName = process.env.SITE_NAME;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.resetPassword');

  return {
    title: `${t('pageTitle')} | ${siteName}`,
    description: t('pageDescription')
  };
}

const ResetPasswordPage = async () => {
  return <ResetPassword />;
};

export default ResetPasswordPage;
