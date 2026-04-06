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

const ResetPasswordPage = async (props: { params: Promise<{ token: string }> }) => {
  const params = await props.params;
  return <ResetPassword token={params.token} />;
};

export default ResetPasswordPage;
