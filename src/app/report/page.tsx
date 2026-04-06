"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyReport from ".";
import { Survey } from "@/app/libs/api/survey";
import {
  SESSION_STORAGE_SCORE_KEY,
  SURVEY_SCORE,
  SURVEY_TYPE,
} from "@/components/dashboard/chatbot/MessageTemplates/constents";
import { remark } from "remark";
import html from "remark-html";
import { geminiGenerate } from "@/app/libs/api/chat";

const SESSION_SURVEY_DATA = "SESSION_SURVEY_DATA";

const businessAreaMappings: Record<string, Record<string, string>> = {
  en: {
    "explorers-modal-1": "Problem Analysis & Financial Understanding",
    "explorers-modal-2": "Goal Setting & Vision",
    "explorers-modal-3": "Organization & Planning",
    "explorers-modal-4": "Brand Identity & Naming",
    "explorers-modal-5": "Legal Knowledge & Company Forms",
    "explorers-modal-6": "Networking & Resources",
    "explorers-modal-7": "Decision Making & Risk Analysis",
    "explorers-modal-8": "Task Management & Execution",
    "explorers-modal-9": "Marketing Channels & Methods",
    "explorers-modal-10": "Financial Management",
    "explorers-modal-11": "Financial Analysis & Ratios",
    "explorers-modal-12": "Self-Development & Business Improvement",
    "companies-modal-1": "Opportunity Seeking & Growth",
    "companies-modal-2": "Competitive Advantage",
    "companies-modal-3": "Planning & Organization",
    "companies-modal-4": "Brand Development",
    "companies-modal-5": "Legal Compliance",
    "companies-modal-6": "Resource Management",
    "companies-modal-7": "Strategic Decision Making",
    "companies-modal-8": "Operational Excellence",
    "companies-modal-9": "Marketing Strategy",
    "companies-modal-10": "Financial Control",
    "companies-modal-11": "Performance Analytics",
    "companies-modal-12": "Continuous Improvement",
    "entrepreneurs-modal-1": "Experience & Opportunity Assessment",
    "entrepreneurs-modal-2": "Strategic Thinking & Growth",
    "entrepreneurs-modal-3": "Action Planning & Execution",
    "entrepreneurs-modal-4": "Brand Design & Identity",
    "entrepreneurs-modal-5": "Legal Understanding & Compliance",
    "entrepreneurs-modal-6": "Resource Assessment & Management",
    "entrepreneurs-modal-7": "Decision Making & Evaluation",
    "entrepreneurs-modal-8": "Process Management",
    "entrepreneurs-modal-9": "Market Penetration",
    "entrepreneurs-modal-10": "Financial Operations",
    "entrepreneurs-modal-11": "Financial Monitoring",
    "entrepreneurs-modal-12": "Business Development",
  },
  ar: {
    "explorers-modal-1": "تحليل المشاكل والفهم المالي",
    "explorers-modal-2": "تحديد الأهداف والرؤية",
    "explorers-modal-3": "التنظيم والتخطيط",
    "explorers-modal-4": "الهوية التجارية والتسمية",
    "explorers-modal-5": "المعرفة القانونية وأشكال الشركات",
    "explorers-modal-6": "الشبكات والموارد",
    "explorers-modal-7": "صنع القرار وتحليل المخاطر",
    "explorers-modal-8": "إدارة المهام والتنفيذ",
    "explorers-modal-9": "قنوات وطرق التسويق",
    "explorers-modal-10": "الإدارة المالية",
    "explorers-modal-11": "التحليل المالي والنسب",
    "explorers-modal-12": "التطوير الذاتي وتحسين الأعمال",
    "companies-modal-1": "البحث عن الفرص والنمو",
    "companies-modal-2": "الميزة التنافسية",
    "companies-modal-3": "التخطيط والتنظيم",
    "companies-modal-4": "تطوير العلامة التجارية",
    "companies-modal-5": "الامتثال القانوني",
    "companies-modal-6": "إدارة الموارد",
    "companies-modal-7": "صنع القرارات الاستراتيجية",
    "companies-modal-8": "التميز التشغيلي",
    "companies-modal-9": "استراتيجية التسويق",
    "companies-modal-10": "التحكم المالي",
    "companies-modal-11": "تحليل الأداء",
    "companies-modal-12": "التحسين المستمر",
    "entrepreneurs-modal-1": "تقييم الخبرة والفرص",
    "entrepreneurs-modal-2": "التفكير الاستراتيجي والنمو",
    "entrepreneurs-modal-3": "تخطيط العمل والتنفيذ",
    "entrepreneurs-modal-4": "تصميم العلامة التجارية والهوية",
    "entrepreneurs-modal-5": "الفهم القانوني والامتثال",
    "entrepreneurs-modal-6": "تقييم وإدارة الموارد",
    "entrepreneurs-modal-7": "صنع القرار والتقييم",
    "entrepreneurs-modal-8": "إدارة العمليات",
    "entrepreneurs-modal-9": "اختراق السوق",
    "entrepreneurs-modal-10": "العمليات المالية",
    "entrepreneurs-modal-11": "المراقبة المالية",
    "entrepreneurs-modal-12": "تطوير الأعمال",
  },
};

export default function ReportPage() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    const modalScoreRaw = sessionStorage.getItem(SESSION_STORAGE_SCORE_KEY);
    const totalScore = sessionStorage.getItem(SURVEY_SCORE);
    const surveyType = sessionStorage.getItem(SURVEY_TYPE);
    const formDataRaw = sessionStorage.getItem(SESSION_SURVEY_DATA);

    if (!modalScoreRaw || !totalScore) {
      push("/dashboard/chatbot");
      return;
    }

    const modalScore: { modalScore: number; modalId: string; label: string }[] =
      JSON.parse(modalScoreRaw);
    const formData = formDataRaw ? JSON.parse(formDataRaw) : {};
    const language: "ar" | "en" = formData.language || "en";

    // Map modalScore to SurveyItem[] for the report component
    const data = modalScore.map((item, index) => ({
      id: String(index),
      question: item.label || item.modalId,
      score: String(item.modalScore),
      rate: "1",
      answerId: "",
      modalId: item.modalId,
      questionId: String(index),
    }));

    const surveyData: Survey = {
      id: "local",
      score: totalScore,
      photo: "",
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      type: surveyType || formData.surveyType || "",
      business_type: formData.businessType || "",
      age: formData.age || "",
      capital: formData.capital || "",
      project_age: formData.projectAge || "",
      staff_count: formData.staffCount || "",
      data,
    };

    setSurvey(surveyData);

    // Build area names for AI prompt
    const mappings = businessAreaMappings[language];
    const sorted = [...modalScore].sort((a, b) => b.modalScore - a.modalScore);
    const total = sorted.length;
    const thirdSize = Math.ceil(total / 3);
    const strengths = sorted
      .slice(0, thirdSize)
      .map((i) => mappings[i.modalId] || i.modalId);
    const weaknesses = sorted
      .slice(-thirdSize)
      .map((i) => mappings[i.modalId] || i.modalId);
    const percentage = ((Number(totalScore) / 360) * 100).toFixed(1);

    // Generate AI analysis
    generateAiAnalysis({
      name: formData.name || "",
      totalScore,
      percentage,
      strengths,
      weaknesses,
      language,
      surveyType: surveyType || "",
    }).then(setAiAnalysis).finally(() => setIsGenerating(false));
  }, [push]);

  if (!survey) return null;

  return (
    <div>
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-gray-600">
              {survey.type?.includes("ar")
                ? "جاري توليد التحليل..."
                : "Generating AI analysis..."}
            </p>
          </div>
        </div>
      )}
      <SurveyReport survey={survey} aiAnalysis={aiAnalysis} />
    </div>
  );
}

async function generateAiAnalysis({
  name,
  totalScore,
  percentage,
  strengths,
  weaknesses,
  language,
  surveyType,
}: {
  name: string;
  totalScore: string;
  percentage: string;
  strengths: string[];
  weaknesses: string[];
  language: "ar" | "en";
  surveyType: string;
}): Promise<string> {
  const prompt =
    language === "ar"
      ? `أنت مستشار أعمال خبير في إطار "ساعة الأعمال". قم بكتابة تحليل مهني موجز (3-4 فقرات) لنتائج تقييم الأعمال للمشارك ${name || "المشارك"}.

النتائج:
- المجموع الكلي: ${totalScore}/360 (${percentage}%)
- نوع التقييم: ${surveyType}
- نقاط القوة الرئيسية: ${strengths.slice(0, 4).join("، ")}
- المجالات التي تحتاج تطوير: ${weaknesses.slice(0, 4).join("، ")}

اكتب التحليل بأسلوب مهني ومشجع، مع تسليط الضوء على نقاط القوة وتقديم توصيات عملية للتطوير. لا تذكر الأرقام والدرجات مباشرة.`
      : `You are a business consultant expert in "The Business Clock" framework. Write a concise professional analysis (3-4 paragraphs) for the business assessment results of ${name || "the participant"}.

Results:
- Total score: ${totalScore}/360 (${percentage}%)
- Assessment type: ${surveyType}
- Key strengths: ${strengths.slice(0, 4).join(", ")}
- Areas for development: ${weaknesses.slice(0, 4).join(", ")}

Write the analysis in a professional and encouraging tone, highlighting strengths and providing practical development recommendations. Do not mention raw scores or numbers directly.`;

  try {
    const systemPrompt =
      language === "ar"
        ? "أنت مستشار أعمال خبير متخصص في تحليل نتائج تقييمات الأعمال وتقديم توصيات مهنية."
        : "You are an expert business consultant specializing in analyzing business assessment results and providing professional recommendations.";

    const text = await geminiGenerate(prompt, systemPrompt);
    const processed = await remark().use(html).process(text);
    return processed.toString();
  } catch {
    return "";
  }
}
