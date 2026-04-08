"use client";

import { Survey } from "@/app/libs/api/survey";
import { useSelector } from "@/store/hooks";
import Image from "next/image";
import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import clockBackground from "../../../public/images/dashboard/chat/clock-bg.png";
import {
  greetings,
  greetings2,
  paragraph1Messages,
  aspectsHeaders,
  paragraph3Messages,
  paragraph4Messages,
  printStyles,
} from "./constants";

function SurveyReport({ survey, aiAnalysis }: { survey: Survey; aiAnalysis?: string }) {
  const { score, data, name} = survey;
  const { language } = useSelector((state) => state.assessmentForm);

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

  const modalRatio = ((Number(score) / 360) * 100).toFixed(2);
  const chartData = useMemo(() => {
    const elements: { modalId: string; score: number }[] = [];
    data.forEach((item) => {
      const existingItem = elements.find(i => i.modalId === item.modalId);
      if (existingItem) {
        existingItem.score = (Number(existingItem.score) + Number(item.score)) / 2;
      } else {
        elements.push({ ...item, score: Number(item.score) });
      }
    });
    return elements;
  }, [data]);

  // Business area mappings
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
      "entrepreneurs-modal-12": "Business Development"
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
      "entrepreneurs-modal-12": "تطوير الأعمال"
    }
  };

  // Calculate analysis based on actual survey data
  const analysisData = useMemo(() => {
    if (!chartData.length) return { strengths: [], development: [], weaknesses: [] };

    // Sort by score to categorize
    const sortedData = [...chartData].sort((a, b) => b.score - a.score);
    const total = sortedData.length;

    // Categorize into thirds
    const strengthsCount = Math.ceil(total / 3);
    const weaknessesCount = Math.ceil(total / 3);

    const strengths = sortedData.slice(0, strengthsCount);
    const weaknesses = sortedData.slice(-weaknessesCount);
    const development = sortedData.slice(strengthsCount, total - weaknessesCount);

    return {
      strengths: strengths.map(item => businessAreaMappings[language][item.modalId] || item.modalId),
      development: development.map(item => businessAreaMappings[language][item.modalId] || item.modalId),
      weaknesses: weaknesses.map(item => businessAreaMappings[language][item.modalId] || item.modalId)
    };
  }, [chartData, language]);

  const mappedStrengths = analysisData.strengths.join(", ");
  const mappedDevelopment = analysisData.development.join(", ");
  const mappedWeaknesses = analysisData.weaknesses.join(", ");
 
  return (
    <>
      <style jsx global>
        {printStyles}
      </style>
      <section
        dir={language === "ar" ? "rtl" : "ltr"}
        id="report-area"
        className="print:page-break-after-avoid print:page-break-before-avoid print:page-break-inside-avoid bg-white font-[Tajawal] print:m-0 print:min-h-[297mm] print:w-[210mm] print:break-before-avoid print:break-inside-avoid print:break-after-avoid print:overflow-visible print:p-0"
        style={{
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <div
          id="report-container"
          className="mx-auto flex min-h-full max-w-[210mm] print:min-h-[297mm] print:w-[210mm] print:overflow-visible"
        >
          <div className="main-content flex w-5/6 flex-col p-3">
            <div className="mt-9 flex items-center justify-between ps-3">
              <p className="text-xs">{formattedDate}</p>
              <p className="max-w-min text-end text-lg font-medium leading-snug">
                WE SUPPORT YOUR BUSINESS
              </p>
            </div>
            <div className="mt-9 flex items-center justify-center gap-4 leading-snug">
              <div className="mt-3 space-y-2 ps-3 pe-6 text-justify">
                <p className="font-bold">{greetings[language](name || "")}</p>
                <p>{greetings2[language]}</p>

                {aiAnalysis ? (
                  <div
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: aiAnalysis }}
                  />
                ) : (
                  <>
                    <p>{paragraph1Messages[language]}</p>
                    {analysisData.strengths.length > 0 && (
                      <p>
                        {language === "en"
                          ? `Through this assessment, you demonstrate strong capabilities in: ${analysisData.strengths.slice(0, 3).join(", ")}. These strengths provide a solid foundation for your business development.`
                          : `من خلال هذا التقييم، تُظهر قدرات قوية في: ${analysisData.strengths.slice(0, 3).join("، ")}. هذه نقاط القوة تُوفر أساساً قوياً لتطوير أعمالك.`
                        }
                      </p>
                    )}
                    {analysisData.weaknesses.length > 0 && (
                      <p>
                        {language === "en"
                          ? `Areas that would benefit from additional focus include: ${analysisData.weaknesses.slice(0, 3).join(", ")}. Developing these areas will significantly enhance your business capabilities.`
                          : `المجالات التي ستستفيد من التركيز الإضافي تشمل: ${analysisData.weaknesses.slice(0, 3).join("، ")}. تطوير هذه المجالات سيعزز بشكل كبير من قدراتك التجارية.`
                        }
                      </p>
                    )}
                  </>
                )}
                <p>{paragraph3Messages[language]}</p>
                <p>{paragraph4Messages[language]}</p>
              </div>

              <div className="min-w-auto z-10 -me-[150px] flex flex-col items-center justify-center gap-10">
                <div
                  className="size-[278px] p-[15.5px]"
                  style={{
                    backgroundImage: `url(${clockBackground.src})`,
                    backgroundSize: "cover",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData}>
                      <PolarAngleAxis dataKey="modalId" tick={false} />
                      <PolarRadiusAxis
                        domain={[0, 30]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        dataKey="score"
                        fill="#F04438"
                        fillOpacity={0.6}
                        animationDuration={700}
                        dot={{
                          r: 4,
                          fillOpacity: 1,
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className=" w-fit rounded-sm border border-white bg-[#000] p-4 text-center text-xl  font-bold text-white">{`${language === "en" ? "Score" : "نتيجة"} ${score}/${360}`}</p>
                  <p className="mt-4 w-fit rounded-sm border border-white bg-[#000] p-4 text-center text-xl  font-bold text-white">
                    {modalRatio} %
                  </p>
                </div>
                {chartData.length > 0 && (
                  <div className="mt-6 max-w-[600px] grid grid-cols-3 gap-1 border border-gray-300 bg-white p-1 text-center text-[10px]">
                    {aspectsHeaders[language].map((header, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center bg-black p-1 font-bold text-white"
                      >
                        {header}
                      </div>
                    ))}

                    {/* Strengths Column */}
                    {analysisData.strengths.map((strength, index) => (
                      <div key={`strength-${index}`} className="flex items-center justify-center bg-green-50 p-1 text-green-800">
                        {strength}
                      </div>
                    ))}
                    {/* Fill empty cells if needed */}
                    {Array.from({ length: Math.max(0, Math.max(analysisData.development.length, analysisData.weaknesses.length) - analysisData.strengths.length) }).map((_, index) => (
                      <div key={`strength-empty-${index}`} className="flex items-center justify-center bg-gray-50 p-1 text-gray-400">
                        -
                      </div>
                    ))}

                    {/* Development Column */}
                    {analysisData.development.map((dev, index) => (
                      <div key={`dev-${index}`} className="flex items-center justify-center bg-yellow-50 p-1 text-yellow-800">
                        {dev}
                      </div>
                    ))}
                    {/* Fill empty cells if needed */}
                    {Array.from({ length: Math.max(0, Math.max(analysisData.strengths.length, analysisData.weaknesses.length) - analysisData.development.length) }).map((_, index) => (
                      <div key={`dev-empty-${index}`} className="flex items-center justify-center bg-gray-50 p-1 text-gray-400">
                        -
                      </div>
                    ))}

                    {/* Weaknesses Column */}
                    {analysisData.weaknesses.map((weakness, index) => (
                      <div key={`weakness-${index}`} className="flex items-center justify-center bg-red-50 p-1 text-red-800">
                        {weakness}
                      </div>
                    ))}
                    {/* Fill empty cells if needed */}
                    {Array.from({ length: Math.max(0, Math.max(analysisData.strengths.length, analysisData.development.length) - analysisData.weaknesses.length) }).map((_, index) => (
                      <div key={`weakness-empty-${index}`} className="flex items-center justify-center bg-gray-50 p-1 text-gray-400">
                        -
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8 mt-auto flex items-center justify-center gap-3 text-center">
              <div className="mt-2 ps-3">
                <p className="text-xl font-bold">أجني لدعم الأعمال</p>
                <p>
                  <span className="mt-2 text-2xl font-medium">ajnee</span>{" "}
                  BUSINESS SUPPORT
                </p>
                <p className="mt-1">The Gate Mall, Tower 2, Floor12</p>
                <p>Tel. 41415555 - P.O. Box 55994</p>
                <p>
                  <span className="underline">info@Ajnee.com</span> -{" "}
                  <span className="underline">www.Ajnee.com</span>
                </p>
              </div>
            </div>
          </div>
          <div className="side-bar h-[297mm] w-[25%] bg-[#000]">
            <div className="mx-[2px] mt-9 bg-white px-5 py-2 flex items-center justify-center">
              <Image
                src="/images/brands/Ajnee-business-hub-black.svg"
                alt="hero"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </section>
      <div className="flex justify-center py-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-black px-8 py-3 text-white font-medium hover:bg-gray-800 transition-colors"
        >
          {language === "ar" ? "طباعة التقرير" : "Print Report"}
        </button>
      </div>
    </>
  );
}

export default SurveyReport;
