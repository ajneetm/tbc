"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SurveyReport from ".";
import { Survey } from "@/app/libs/api/survey";
import {
  SESSION_STORAGE_SCORE_KEY,
  SURVEY_SCORE,
  SURVEY_TYPE,
} from "@/components/dashboard/chatbot/MessageTemplates/constents";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";

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
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();
  const { user } = useSupabaseAuth();
  const adminNotifiedRef = useRef(false);

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
    setLanguage(language);

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

    // Generate AI report
    const type = surveyType || formData.surveyType || "explorers";
    fetch("/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surveyType: type,
        totalScore: Number(totalScore),
        modalScores: modalScore.map((i) => ({ modalId: i.modalId, score: i.modalScore })),
        language,
      }),
    })
      .then((r) => r.json())
      .then(async (res) => {
        if (res.content) {
          const html = (await remark().use(remarkHtml).process(res.content)).toString();
          setAiAnalysis(html);

          // أرسل نسخة للأدمن إذا المستخدم مسجل
          if (user && !adminNotifiedRef.current) {
            adminNotifiedRef.current = true;
            fetch("/api/send-report", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ali@qatarccs.org",
                totalScore: Number(totalScore),
                percentage: ((Number(totalScore) / 360) * 100).toFixed(1),
                language,
                aiContent: html,
                userName: user.user_metadata?.full_name || user.email,
                userEmail: user.email,
              }),
            }).catch(() => {});
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [push]);

  if (!survey) return null;

  return (
    <div>
      <SurveyReport survey={survey} language={language} aiAnalysis={aiAnalysis} isLoading={isLoading} />
    </div>
  );
}

