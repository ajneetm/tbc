import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.0-flash-001', 'gemini-2.0-flash-lite-001']

const surveyTypeLabels: Record<string, Record<string, string>> = {
  en: { explorers: 'Market Explorer', companies: 'Established Company', entrepreneurs: 'Entrepreneur' },
  ar: { explorers: 'مستكشف السوق', companies: 'شركة قائمة', entrepreneurs: 'رائد أعمال' },
}

const modalLabels: Record<string, Record<string, string>> = {
  en: {
    'explorers-modal-1': 'Problem Analysis & Financial Understanding',
    'explorers-modal-2': 'Goal Setting & Vision',
    'explorers-modal-3': 'Organization & Planning',
    'explorers-modal-4': 'Brand Identity & Naming',
    'explorers-modal-5': 'Legal Knowledge & Company Forms',
    'explorers-modal-6': 'Networking & Resources',
    'explorers-modal-7': 'Decision Making & Risk Analysis',
    'explorers-modal-8': 'Task Management & Execution',
    'explorers-modal-9': 'Marketing Channels & Methods',
    'explorers-modal-10': 'Financial Management',
    'explorers-modal-11': 'Financial Analysis & Ratios',
    'explorers-modal-12': 'Self-Development & Business Improvement',
    'companies-modal-1': 'Opportunity Seeking & Growth',
    'companies-modal-2': 'Competitive Advantage',
    'companies-modal-3': 'Planning & Organization',
    'companies-modal-4': 'Brand Development',
    'companies-modal-5': 'Legal Compliance',
    'companies-modal-6': 'Resource Management',
    'companies-modal-7': 'Strategic Decision Making',
    'companies-modal-8': 'Operational Excellence',
    'companies-modal-9': 'Marketing Strategy',
    'companies-modal-10': 'Financial Control',
    'companies-modal-11': 'Performance Analytics',
    'companies-modal-12': 'Continuous Improvement',
    'entrepreneurs-modal-1': 'Experience & Opportunity Assessment',
    'entrepreneurs-modal-2': 'Strategic Thinking & Growth',
    'entrepreneurs-modal-3': 'Action Planning & Execution',
    'entrepreneurs-modal-4': 'Brand Design & Identity',
    'entrepreneurs-modal-5': 'Legal Understanding & Compliance',
    'entrepreneurs-modal-6': 'Resource Assessment & Management',
    'entrepreneurs-modal-7': 'Decision Making & Evaluation',
    'entrepreneurs-modal-8': 'Process Management',
    'entrepreneurs-modal-9': 'Market Penetration',
    'entrepreneurs-modal-10': 'Financial Operations',
    'entrepreneurs-modal-11': 'Financial Monitoring',
    'entrepreneurs-modal-12': 'Business Development',
  },
  ar: {
    'explorers-modal-1': 'تحليل المشاكل والفهم المالي',
    'explorers-modal-2': 'تحديد الأهداف والرؤية',
    'explorers-modal-3': 'التنظيم والتخطيط',
    'explorers-modal-4': 'الهوية التجارية والتسمية',
    'explorers-modal-5': 'المعرفة القانونية وأشكال الشركات',
    'explorers-modal-6': 'الشبكات والموارد',
    'explorers-modal-7': 'صنع القرار وتحليل المخاطر',
    'explorers-modal-8': 'إدارة المهام والتنفيذ',
    'explorers-modal-9': 'قنوات وطرق التسويق',
    'explorers-modal-10': 'الإدارة المالية',
    'explorers-modal-11': 'التحليل المالي والنسب',
    'explorers-modal-12': 'التطوير الذاتي وتحسين الأعمال',
    'companies-modal-1': 'البحث عن الفرص والنمو',
    'companies-modal-2': 'الميزة التنافسية',
    'companies-modal-3': 'التخطيط والتنظيم',
    'companies-modal-4': 'تطوير العلامة التجارية',
    'companies-modal-5': 'الامتثال القانوني',
    'companies-modal-6': 'إدارة الموارد',
    'companies-modal-7': 'صنع القرارات الاستراتيجية',
    'companies-modal-8': 'التميز التشغيلي',
    'companies-modal-9': 'استراتيجية التسويق',
    'companies-modal-10': 'التحكم المالي',
    'companies-modal-11': 'تحليل الأداء',
    'companies-modal-12': 'التحسين المستمر',
    'entrepreneurs-modal-1': 'تقييم الخبرة والفرص',
    'entrepreneurs-modal-2': 'التفكير الاستراتيجي والنمو',
    'entrepreneurs-modal-3': 'تخطيط العمل والتنفيذ',
    'entrepreneurs-modal-4': 'تصميم العلامة التجارية والهوية',
    'entrepreneurs-modal-5': 'الفهم القانوني والامتثال',
    'entrepreneurs-modal-6': 'تقييم وإدارة الموارد',
    'entrepreneurs-modal-7': 'صنع القرار والتقييم',
    'entrepreneurs-modal-8': 'إدارة العمليات',
    'entrepreneurs-modal-9': 'اختراق السوق',
    'entrepreneurs-modal-10': 'العمليات المالية',
    'entrepreneurs-modal-11': 'المراقبة المالية',
    'entrepreneurs-modal-12': 'تطوير الأعمال',
  },
}

const buildPrompt = (
  surveyType: string,
  totalScore: number,
  modalScores: { modalId: string; score: number }[],
  language: 'ar' | 'en'
): string => {
  const lang = language === 'ar' ? 'ar' : 'en'
  const typeLabel = surveyTypeLabels[lang][surveyType] ?? surveyType
  const pct = ((totalScore / 360) * 100).toFixed(1)
  const labels = modalLabels[lang]

  const sorted = [...modalScores].sort((a, b) => b.score - a.score)
  const top3 = sorted.slice(0, 3).map(i => `${labels[i.modalId] ?? i.modalId}: ${i.score}/30`)
  const bottom3 = sorted.slice(-3).reverse().map(i => `${labels[i.modalId] ?? i.modalId}: ${i.score}/30`)

  if (language === 'ar') {
    return `أنت خبير في تطوير الأعمال. اكتب تقرير تقييم احترافي باللغة العربية الفصحى فقط لشخص أجرى اختبار جاهزية الأعمال.

**نوع المشارك:** ${typeLabel}
**الدرجة الإجمالية:** ${totalScore} من 360 (${pct}%)

**أعلى 3 مجالات:**
${top3.join('\n')}

**أدنى 3 مجالات:**
${bottom3.join('\n')}

اكتب التقرير بتنسيق Markdown يحتوي على:
## المستوى العام
[جملة أو جملتان تفسران الدرجة الإجمالية]

## نقاط القوة
[اشرح كل مجال من أعلى 3 مجالات بأسلوب إيجابي وعملي — جملة لكل مجال]

## مجالات التطوير
[اشرح كل مجال من أدنى 3 مجالات بأسلوب بنّاء — جملة لكل مجال]

## الخلاصة
[فقرة ختامية إنسانية ودافئة تربط النقاط]

## التوصيات
[3 توصيات عملية ومحددة مرتبطة بمجالات التطوير]

القواعد: لا تستخدم أرقاماً أو نسباً داخل أقسام القوة والتطوير. اكتب بلغة عربية فصيحة دافئة ومهنية حصراً.`
  }

  return `You are a business development expert. Write a professional business readiness assessment report in English.

**Participant Type:** ${typeLabel}
**Overall Score:** ${totalScore} out of 360 (${pct}%)

**Top 3 Areas:**
${top3.join('\n')}

**Bottom 3 Areas:**
${bottom3.join('\n')}

Write the report in Markdown format with:
## Overall Level
[1-2 sentences interpreting the overall score]

## Strengths
[Explain each of the top 3 areas positively and practically — one sentence per area]

## Development Areas
[Explain each of the bottom 3 areas constructively — one sentence per area]

## Summary
[A warm closing paragraph connecting the key points]

## Recommendations
[3 specific, actionable recommendations tied to the development areas]

Rules: Do not use numbers or percentages inside the Strengths and Development sections. Write in warm, professional language.`
}

async function generateWithFallback(prompt: string, systemInstruction: string, modelIndex = 0): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? ''
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: MODELS[modelIndex] ?? MODELS[0],
    systemInstruction,
  })

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1500 },
    })
    return result.response.text()
  } catch (err: any) {
    const msg: string = err?.message ?? ''
    if ((msg.includes('404') || msg.includes('403')) && modelIndex < MODELS.length - 1) {
      return generateWithFallback(prompt, systemInstruction, modelIndex + 1)
    }
    throw err
  }
}

export async function POST(req: NextRequest) {
  try {
    const { surveyType, totalScore, modalScores, language } = await req.json()

    const prompt = buildPrompt(surveyType, totalScore, modalScores, language)
    const systemInstruction = language === 'ar'
      ? 'أنت خبير في تطوير الأعمال. اكتب باللغة العربية الفصحى حصراً.'
      : 'You are a business development expert. Write in English only.'

    const content = await generateWithFallback(prompt, systemInstruction)
    if (!content?.trim()) throw new Error('Empty AI response')

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('Report generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
