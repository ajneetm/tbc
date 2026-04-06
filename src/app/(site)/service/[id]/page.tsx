import ServiceLayout from "@/components/Service/ServiceLayout";
import { getAllServices, getService } from "@/static-data/service";
import { getLocale, getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ServiceDetailPage(props: Props) {
  const params = await props.params;
  const locale = await getLocale();
  const t = await getTranslations("service");
  const [service, serviceData] = await Promise.all([
    getService(params.id, locale),
    getAllServices(locale),
  ]);
  return (
    <>
      <ServiceLayout
        service={service!}
        data={serviceData}
        title={t("title")}
        prefixPath="/service"
      />
    </>
  );
}
