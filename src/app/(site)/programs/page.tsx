import { getProgramsList } from "@/app/libs/api/programs";
import ProgramsList from "./components/ProgramsList";
import { getPrograms } from "@/static-data/programs";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  const programsData = getPrograms(locale);
  
  return <ProgramsList programs={programsData} />;
}
