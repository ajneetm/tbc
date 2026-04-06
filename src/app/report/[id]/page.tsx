import { getSurvey } from "@/app/libs/api/survey";
import SurveyReport from "..";

async function SurveyReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const survey = await getSurvey(id);
  return <SurveyReport survey={survey} />;
};

export default SurveyReportPage;