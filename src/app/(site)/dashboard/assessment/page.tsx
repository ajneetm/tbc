"use server";
import AssessmentController from "@/components/dashboard/assessment/AssessmentController";
async function TestPage() {
  return (
    <section className="pb-4 pt-[120px] max-md:pt-[105px] md:h-full md:overflow-auto">
      <AssessmentController />
    </section>
  );
}

export default TestPage;
