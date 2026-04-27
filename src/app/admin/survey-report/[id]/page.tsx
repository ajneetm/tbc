"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SurveyReport from "@/app/report";

export default function AdminSurveyReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("survey_results")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setSurvey(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        لم يتم العثور على التقرير
      </div>
    );
  }

  const surveyObj = {
    id: survey.id,
    score: String(survey.total_score),
    photo: "",
    name: survey.name || "",
    email: survey.email || "",
    phone: survey.phone || "",
    type: survey.survey_type || "",
    business_type: survey.business_type || "",
    age: survey.age || "",
    capital: survey.capital || "",
    project_age: survey.project_age || "",
    staff_count: survey.staff_count || "",
    data: (survey.modal_scores || []).map((m: any, i: number) => ({
      id: String(i),
      question: m.label || m.modalId || "",
      score: String(m.modalScore ?? 0),
      rate: "1",
      answerId: "",
      modalId: m.modalId || "",
      questionId: String(i),
    })),
  };

  return (
    <div>
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={() => router.back()}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 transition"
        >
          ← رجوع
        </button>
      </div>
      <SurveyReport
        survey={surveyObj}
        language={survey.language || "ar"}
        aiAnalysis={survey.ai_analysis || ""}
        isLoading={false}
      />
    </div>
  );
}
