import ProgramLayout from "@/components/programs/ProgramLayout";
import { getProgram, getPrograms, Program } from "@/static-data/programs";
import { getLocale } from "next-intl/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ServiceDetailPage(props: Props) {
  const params = await props.params;
  const locale = await getLocale();
  const [program, programsData] = await Promise.all([
    getProgram(params.id, locale),
    getPrograms(locale),
  ]);

  return (
    <>
      <ProgramLayout
        program={program as Program}
        data={programsData}
        title="Programs"
      />
    </>
  );
}
