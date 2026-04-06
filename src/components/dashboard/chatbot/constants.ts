import { payloadType } from "@/store/chatbot/ChatSlice";
import {
  ExcludedSurveyType,
  SurveyType,
} from "@/store/chatbot/SurveyFlowTypes";
import { v4 as uuid } from "uuid";

type Answer = {
  id: string;
  question: string;
  modalId: string;
  rate: number;
  question_ar: string;
};

export const explorersSurveyComments: Record<
  string,
  { details: string[]; details_en: string[] }
> = {
  "explorers-modal-1": {
    details: [
      "توقعات المشروعات والأعمال التي تريد خوضها",
      "قياس الربح والخسارة لأي عمل جديد",
      "الدخول في مشاريع أو أعمال تجارية جديدة",
    ],
    details_en: [
      "Project and business venture expectations you want to pursue",
      "Evaluating the profit and loss of any new venture",
      "Engaging in new projects or business ventures",
    ],
  },
  "explorers-modal-2": {
    details: [
      "إمكانية التخطيط لما تريد الوصول اليه",
      "رؤية المستقبل المهني",
      "رسم خطوات النجاح المستقبلي",
    ],
    details_en: [
      "Ability to plan what you want to achieve",
      "Vision for your professional future",
      "Outlining steps for future success",
    ],
  },
  "explorers-modal-3": {
    details: [
      "رسم خطوات النجاح المستقبلي",
      "ترتيب الأشياء وتنظيمها",
      "الطريق الى ما تريد الوصول اليه",
    ],
    details_en: [
      "Outlining steps for future success",
      "Arranging and organizing things",
      "Charting the path to achieve your goals",
    ],
  },
  "explorers-modal-4": {
    details: [
      "احتراف التسميات الرنانة",
      "شغف التعرف على معاني ما حولك",
      "فهم معاني أسماء الشركات",
    ],
    details_en: [
      "Expertise in crafting catchy names",
      "Passion for understanding the meanings of things around you",
      "Understanding the meanings of company names",
    ],
  },
  "explorers-modal-5": {
    details: [
      "إدراك تنوع هياكل ومسميات الشركات",
      "فهم عميق لضرورة أن لكل شيء هوية واسم",
      "متطلبات وشروط ترخيص الأعمال",
    ],
    details_en: [
      "Awareness of the diversity of company structures and names.",
      "Deep understanding of the necessity for everything to have an identity and a name",
      "Requirements and conditions for business licensing",
    ],
  },
  "explorers-modal-6": {
    details: [
      "فهم قيمة الموارد لأي عمل تقوم به",
      "إدراك أن الموارد جوهر النجاح",
      "البحث على الموارد والقدرة على تأمينها",
    ],
    details_en: [
      "Understanding the value of resources for any work you undertake",
      "Recognizing that resources are the essence of success",
      "Searching for resources and the ability to secure them",
    ],
  },
  "explorers-modal-7": {
    details: [
      "فهم نتائج القرارات",
      "تقييم تأثير الاختيارات",
      "تقييم نتائج الأفعال",
    ],
    details_en: [
      "Understanding the outcomes of decisions",
      "Evaluating the impact of choices",
      "Assessing the results of actions",
    ],
  },
  "explorers-modal-8": {
    details: [
      "القدرة على فهم تفاصيل الاشياء",
      "فهم تركيب وبناء الأعمال",
      "الاهتمام بتفاصيل أي منتج والتعرف على تركيبه",
    ],
    details_en: [
      "Ability to understand the details of things",
      "Understanding the structure and composition of businesses",
      "Attention to the details of any product and understanding its composition",
    ],
  },
  "explorers-modal-9": {
    details: [
      "القدرة على الاقناع",
      "توظيف المعرفة التكنولوجيا والاستفادة منها",
      "بناء علاقات وتواصل مع الاخرين",
    ],
    details_en: [
      "Ability to persuade",
      "Leveraging technological knowledge and benefits",
      "Building relationships and communicating with others",
    ],
  },
  "explorers-modal-10": {
    details: [
      "فهم إدارة الالتزامات المالية",
      "فهم الحساب والأرقام",
      "فهم تمويل الأعمال",
    ],
    details_en: [
      "Understanding financial obligations management",
      "Understanding accounting and figures",
      "Understanding business financing",
    ],
  },
  "explorers-modal-11": {
    details: [
      "معاني النسب العالية والنسب المنخفضة",
      "العلاقة بين الأرقام والتقدم والنمو",
      "ربط النتائج بالأرقام والقدرة على فهمها",
    ],
    details_en: [
      "Understanding high and low ratios",
      "Analysing the relationship between figures and progress or growth",
      "Linking results to figures and being able to interpret them",
    ],
  },
  "explorers-modal-12": {
    details: [
      "تحليل الأداء والتعرف على الأخطاء",
      "أهمية التقييم الدوري ومراجعة الاعمال",
      "القدرة على التحسين من خلال مراجعة العمل",
    ],
    details_en: [
      "Analysing performance and identifying errors",
      "The importance of regular evaluation and work review",
      "Ability to improve through work review",
    ],
  },
};
export const companiesSurveyComments: Record<
  string,
  { details: string[]; details_en: string[] }
> = {
  "companies-modal-1": {
    details: [
      "البحث عن الفرص",
      "استغلال الفرص الجديدة",
      "إمكانية تحويل الفرص إلى مشاريع ناجحة",
    ],
    details_en: [
      "Searching for opportunities.",
      "Leveraging new opportunities.",
      "Transforming opportunities into successful projects.",
    ],
  },
  "companies-modal-2": {
    details: ["رؤية مستقرة وواضحة", "موقع تنافسي مقنع", "إستراتيجية سوق فعالة"],
    details_en: [
      "Stable and clear vision.",
      "Compelling competitive position.",
      "Effective market strategy.",
    ],
  },
  "companies-modal-3": {
    details: [
      "تنظيم الأولويات والأهداف",
      "إدارة فعالة من خلال التخطيط",
      "خطط مؤثرة على الأداء",
    ],
    details_en: [
      "Organizing priorities and goals",
      "Effective management through planning",
      "Plans that impact performance",
    ],
  },
  "companies-modal-4": {
    details: [
      "فهم عميق وتعبير فني مميز عن شركتك",
      "التواصل الفعال مع السوق",
      "إيصال رسالة الشركة بفعالية نحو العملاء",
    ],
    details_en: [
      "Deep understanding and unique expression about your company",
      "Effective communication with the market",
      "Conveying the company’s message effectively to clients",
    ],
  },
  "companies-modal-5": {
    details: [
      "اختيار الهياكل واللوائح والقوانين الأكثر توافقاً مع شركتك",
      "إدراك أهمية الامتثال للقوانين والتشريعات النافذة لشركتك",
      "فهم أهمية تحديث القوانين بما يحقق مصالح الشركة",
    ],
    details_en: [
      "Defining structures, regulations, and laws that best align with your company",
      "Recognizing the importance of your company’s applicable laws and regulations",
      "Understanding the importance of updating laws to serve the company’s interests",
    ],
  },
  "companies-modal-6": {
    details: [
      "تحقيق الكفاءة والفعالية في بناء سلسلة الموارد",
      "تخصيص الموارد للأولويات",
      "حسن توجيه الموارد",
    ],
    details_en: [
      "Achieving efficiency and effectiveness in building a resource chain",
      "Allocating resources to priorities",
      "Properly directing resources",
    ],
  },
  "companies-modal-7": {
    details: [
      "المرونة في اتخاذ القرارات",
      "اختيار الخيار الأنسب",
      "اتخاذ قرارات متوازنة",
    ],
    details_en: [
      "Flexibility in decision-making",
      "Choosing the most suitable option",
      "Making balanced decisions",
    ],
  },
  "companies-modal-8": {
    details: [
      "تحليل العمليات بكفاءة وفعالية",
      "تلبية متطلبات العملاء وفق عمليات مُحَكمة",
      "تحسين عمليات الشركة",
    ],
    details_en: [
      "Analyzing processes efficiently and effectively",
      "Meeting customer requirements through well-defined processes",
      "Improving company operations",
    ],
  },
  "companies-modal-9": {
    details: [
      "التواصل الفعال وبناء العلاقات",
      "زيادة الوعي والإقبال على المنتجات والخدمات",
      "تصميم رسائل ترويجية فعّالة",
    ],
    details_en: [
      "Effective communication and relationship building",
      "Increasing awareness and interest in products and services",
      "Designing effective promotional messages",
    ],
  },
  "companies-modal-10": {
    details: [
      "الاستجابة للاحتياجات المالية",
      "التكيف مع الاحتياجات المالية للشركة",
      "الفعالية في سياسات التحصيل والسداد",
    ],
    details_en: [
      "Responding to financial needs",
      "Adapting to the company's financial requirements",
      "Effectiveness in collection and payment policies",
    ],
  },
  "companies-modal-11": {
    details: [
      "السعي نحو النمو والتطوير",
      "استخدام مؤشرات مالية فعًالة",
      "فهم سهل لأعمال الشركة من الناحية المالية",
    ],
    details_en: [
      "Striving for growth and development",
      "Using effective financial indicators",
      "Easy understanding of the company’s financial operations",
    ],
  },
  "companies-modal-12": {
    details: [
      "التعلم من الأخطاء",
      "ضمان تنفيذ الإجراءات بفعالية",
      "كفاية إجراءات المراجعة",
    ],
    details_en: [
      "Learning from mistakes",
      "Ensuring effective implementation of procedures",
      "Adequacy of review procedures",
    ],
  },
};
export const entrepreneursSurveyComments: Record<
  string,
  { details: string[]; details_en: string[] }
> = {
  "entrepreneurs-modal-1": {
    details: [
      "الاستفادة من التجارب",
      "تقدير الجدوى بدقة",
      "تقييم الفرص بعناية",
    ],
    details_en: [
      "Learning from experiences",
      "Accurately assessing feasibility",
      "Carefully evaluating opportunities",
    ],
  },
  "entrepreneurs-modal-2": {
    details: [
      "توجيه الأفكار والأفعال",
      "تحديد فرص النمو والتوسع",
      "تطوير إستراتيجية محكمة",
    ],
    details_en: [
      "Guiding thoughts and actions",
      "Identifying growth and expansion opportunities",
      "Developing a well-structured strategy",
    ],
  },
  "entrepreneurs-modal-3": {
    details: [
      "ترتيب الأفكار والأهداف",
      "إمكانية وضع خطة تنفيذية تفصيلية",
      "إعداد خطة عمل مُحدَّدة",
    ],
    details_en: [
      "Organizing thoughts and goals",
      "Ability to create a detailed execution plan",
      "Preparing a specific action plan",
    ],
  },
  "entrepreneurs-modal-4": {
    details: [
      "اختيار الأسماء بعناية",
      "استخدام الألوان والأشكال المناسبة",
      "تصميم علامة تجارية جذابة",
    ],
    details_en: [
      "Carefully selecting names",
      "Using appropriate colors and shapes",
      "Designing an attractive brand identity",
    ],
  },
  "entrepreneurs-modal-5": {
    details: [
      "التفاعل وتفهم الأطراف الآخرى",
      "اختيار نوع الشركة المناسب",
      "المعرفة القانونية الكافية للشركات",
    ],
    details_en: [
      "Interacting and understanding other parties",
      "Choosing the appropriate type of company",
      "Adequate legal knowledge for companies",
    ],
  },
  "entrepreneurs-modal-6": {
    details: [
      "تحليل الاحتياجات وتقييمها",
      "إدارة الموارد بفعالية",
      "تقدير الموارد اللازمة للمشروعات",
    ],
    details_en: [
      "Analyzing and assessing needs",
      "Managing resources effectively",
      "Estimating resources required for projects",
    ],
  },
  "entrepreneurs-modal-7": {
    details: [
      "اتخاذ قرارات مؤثرة",
      "اتخاذ قرارات موزونة",
      "تقييم القرارات بفعالية",
    ],
    details_en: [
      "Making impactful decisions",
      "Making balanced decisions",
      "Effectively evaluating decisions",
    ],
  },
  "entrepreneurs-modal-8": {
    details: [
      "تفكيك المشكلات وفهم التفاصيل",
      "ترتيب العمليات بعناية",
      "تحليل التفاصيل بعناية",
    ],
    details_en: [
      "Breaking down problems and understanding details",
      "Organizing processes carefully",
      "Analyzing details thoroughly",
    ],
  },
  "entrepreneurs-modal-9": {
    details: [
      "إلهام الآخرين",
      "قدرة على التسويق الجذاب",
      "جذب الجمهور بفعالية",
    ],
    details_en: [
      "Inspiring others",
      "Ability to engage effectively in marketing",
      "Attracting the audience effectively",
    ],
  },
  "entrepreneurs-modal-10": {
    details: [
      "الحفاظ على استقرار مالي",
      "تطوير سياسات التحصيل والسداد بفاعلية",
      "تحفيز السداد في الوقت المناسب",
    ],
    details_en: [
      "Maintaining financial stability",
      "Developing effective collection and payment policies",
      "Encouraging timely payments",
    ],
  },
  "entrepreneurs-modal-11": {
    details: [
      "فهم المؤشرات المالية الحساسة لمشروعك",
      "فهم واسع لمؤشرات التقدُّم",
      "فهم النجاح من خلال البيانات والنسب المالية",
    ],
    details_en: [
      "Understanding key financial indicators for your project",
      "Broad understanding of progress indicators",
      "understanding success through data and financial ratios",
    ],
  },
  "entrepreneurs-modal-12": {
    details: [
      "إدراك أهمية المراجعة والتقييم",
      "الحرص على سلامة الأداء بإستمرار",
      "خطط عملية لتجاوز الأخطاء",
    ],
    details_en: [
      "Understanding the importance of review and evaluation",
      "Ensuring continuous performance quality",
      "Practical plans to overcome mistakes",
    ],
  },
};

export const surveyComments = {
  entrepreneurs: entrepreneursSurveyComments,
  explorers: explorersSurveyComments,
  companies: companiesSurveyComments,
};

const explorersSurvey = [
  {
    id: "explorers-1",
    question:
      "1 / 24. I can understand the dimensions of any problem I encounter",
    question_ar: "أستطيع أن أفهم أبعاد أي مشكلة تواجهني ١ / ٢٤",
    modalId: "explorers-modal-1",
    rate: 0.8,
  },
  {
    id: "explorers-2",
    question:
      "2 / 24. I can understand the financial aspects of any business endeavor",
    question_ar: "يمكنني فهم الجوانب المالية لأي تجربة تجارية ٢ / ٢٤",
    modalId: "explorers-modal-1",
    rate: 0.2,
  },
  {
    id: "explorers-3",
    question: "3 / 24. I am able to define my personal goals",
    question_ar: "قادر على تحديد أهدافي الشخصية ٣ / ٢٤",
    modalId: "explorers-modal-2",
    rate: 0.8,
  },
  {
    id: "explorers-4",
    question: "4 / 24. I have a clear vision of my professional future",
    question_ar: "لدي تصوُّري عن مستقبلي المهني ٤ / ٢٤",
    modalId: "explorers-modal-2",
    rate: 0.2,
  },
  {
    id: "explorers-5",
    question: "5 / 24. I can access what I need in an organized manner",
    question_ar: "أستطيع الوصول إلى ما أحتاجه بشكل منظم ٥ / ٢٤",
    modalId: "explorers-modal-3",
    rate: 0.9,
  },
  {
    id: "explorers-6",
    question: "6 / 24. I prepare clear plans for my business",
    question_ar: "أقوم بإعداد خطط واضحة لأعمالي ٦ / ٢٤",
    modalId: "explorers-modal-3",
    rate: 0.2,
  },
  {
    id: "explorers-7",
    question: "7 / 24. I have an interest in distinctive names",
    question_ar: "لدي اهتمام في الأسماء المميزة ٧ / ٢٤",
    modalId: "explorers-modal-4",
    rate: 0.8,
  },
  {
    id: "explorers-8",
    question: "8 / 24. I can create distinctive brands",
    question_ar: "أستطيع ابتكار علامات تجارية مميزة ٨ / ٤٢",
    modalId: "explorers-modal-4",
    rate: 0.2,
  },
  {
    id: "explorers-9",
    question: "9 / 24. I recognize that every business has a legal identity",
    question_ar: "أدرك بأن لكل عمل شخصية قانونية ٩ / ٢٤",
    modalId: "explorers-modal-5",
    rate: 0.8,
  },
  {
    id: "explorers-10",
    question: "10 / 24. I understand the different legal forms of companies",
    question_ar: "أفهم اختلاف الأشكال القانونية للشركات ١٠ / ٢٤",
    modalId: "explorers-modal-5",
    rate: 0.2,
  },
  {
    id: "explorers-11",
    question: "11 / 24. My connections enable me to access what I need",
    question_ar: "علاقاتي تمكنني من الوصول إلى ما أحتاجه ١١ / ٢٤",
    modalId: "explorers-modal-6",
    rate: 0.8,
  },
  {
    id: "explorers-12",
    question: "12 / 24. We need greater efforts to obtain better resources",
    question_ar: "نحتاج جهوداً أكبر للحصول على موارد أفضل ١٢ / ٢٤",
    modalId: "explorers-modal-6",
    rate: 0.2,
  },
  {
    id: "explorers-13",
    question:
      "13 / 24. I fully understand the potential consequences of any decision before making it",
    question_ar: "أدرك تماماً العواقب المحتملة لأي قرار قبل اتخاذه ١٣ / ٢٤",
    modalId: "explorers-modal-7",
    rate: 0.8,
  },
  {
    id: "explorers-14",
    question:
      "14 / 24. I can understand the implications of success and failure in business",
    question_ar: "أستطيع أن أفهم آثار النجاح والفشل في التجارة ١٤ / ٢٤",
    modalId: "explorers-modal-7",
    rate: 0.2,
  },
  {
    id: "explorers-15",
    question:
      "15 / 24. I break things down into parts to understand them better",
    question_ar: "أفكك الأشياء إلى أجزاء لفهمها بشكل أفضل ١٥ / ٢٤",
    modalId: "explorers-modal-8",
    rate: 0.8,
  },
  {
    id: "explorers-16",
    question: "16 / 24. I execute tasks smoothly",
    question_ar: "أقوم بتنفيذ الأعمال بطريقة سلسة ١٦ / ٢٤",
    modalId: "explorers-modal-8",
    rate: 0.2,
  },
  {
    id: "explorers-17",
    question: "17 / 24. Utilizing multiple channels to market any product",
    question_ar: "استخدام وسائل متعددة لتسويق أي منتج ١٧ / ٢٤",
    modalId: "explorers-modal-9",
    rate: 0.8,
  },
  {
    id: "explorers-18",
    question: "18 / 24. Using multiple methods to market any product",
    question_ar: "استخدام وسائل متعددة لتسويق أي منتج ١٨ / ٢٤",
    modalId: "explorers-modal-9",
    rate: 0.2,
  },
  {
    id: "explorers-19",
    question: "19 / 24. I manage my finances as required",
    question_ar: "أدير أموالي بالشكل المطلوب ١٩ / ٢٤",
    modalId: "explorers-modal-10",
    rate: 0.8,
  },
  {
    id: "explorers-20",
    question: "20 / 24. I find it easy to work with figures and accounts",
    question_ar: "يسهل علي التعامل مع الأرقام والحسابات ٢٠ / ٢٤",
    modalId: "explorers-modal-10",
    rate: 0.2,
  },
  {
    id: "explorers-21",
    question:
      "21 / 24. Able to interpret numerical ratios to understand any development",
    question_ar: "قادر على قراءة النسب الرقمية لفهم أي تطور ٢١ / ٢٤",
    modalId: "explorers-modal-11",
    rate: 0.8,
  },
  {
    id: "explorers-22",
    question:
      "22 / 24. Proficient in reading financial and accounting ratios in business",
    question_ar: "ملم بقراءة النسب المالية والمحاسبية في التجارية ٢٢ / ٢٤",
    modalId: "explorers-modal-11",
    rate: 0.2,
  },
  {
    id: "explorers-23",
    question:
      "23 / 24. I review my abilities for a periodic develop development",
    question_ar: "أراجع قدراتي لكي أطورها بشكل دوري ٢٣ / ٢٤",
    modalId: "explorers-modal-12",
    rate: 0.8,
  },
  {
    id: "explorers-24",
    question: "24 / 24. I can devise a method to improve any business",
    question_ar: "أستطيع أن أضع طريقة لتحسين أي عمل ٢٤ / ٢٤",
    modalId: "explorers-modal-12",
    rate: 0.2,
  },
];

const companiesSurvey = [
  {
    id: "companies-1",
    question: "1 / 24. I always seek opportunities to improve my life and work",
    question_ar: "أبحث دائمًا عن فرص لتحسين حياتي وعملي ١ / ٢٤",
    modalId: "companies-modal-1",
    rate: 0.8,
  },
  {
    id: "companies-2",
    question:
      "2 / 24. My company can turn opportunities into successful projects",
    question_ar: "شركتي قادرة على تحويل الفرص إلى مشاريع ناجحة ٢ / ٢٤",
    modalId: "companies-modal-1",
    rate: 0.2,
  },
  {
    id: "companies-3",
    question: "3 / 24. I have a clear vision of what my life goals",
    question_ar: "لديَّ رؤية واضحة لما أسعى لتحقيقه في حياتي ٣ / ٢٤",
    modalId: "companies-modal-2",
    rate: 0.8,
  },
  {
    id: "companies-4",
    question:
      "4 / 24. The company's market position is compelling compared to competitors",
    question_ar: "موقع الشركة في السوق مقنع مقارنة بالمنافسين ٤ / ٢٤",
    modalId: "companies-modal-2",
    rate: 0.2,
  },
  {
    id: "companies-5",
    question:
      "5 / 24. I allocate adequate time to reflect on what I do in my life",
    question_ar: "أخصص وقتاً كافياً في التفكير لما أقوم به في حياتي ٥ / ٢٤",
    modalId: "companies-modal-3",
    rate: 0.8,
  },
  {
    id: "companies-6",
    question: "6 / 24. Our well-defined plans enhance our company's position",
    question_ar: "الخطط المحكمة لدينا تعزز مكانة شركتنا ٦ / ٢٤",
    modalId: "companies-modal-3",
    rate: 0.2,
  },
  {
    id: "companies-7",
    question:
      "7 / 24. I grasp deep meanings and express them in a distinctive style",
    question_ar: "أستوعب المعاني العميقة وأعبِّر عنها بأسلوب مميز ٧ / ٢٤",
    modalId: "companies-modal-4",
    rate: 0.8,
  },
  {
    id: "companies-8",
    question: "8 / 24. The brand reaches the market in a relevant way",
    question_ar: "العلامة التجارية تصل إلى السوق بطريقة ملائمة ٨ / ٤٢",
    modalId: "companies-modal-4",
    rate: 0.2,
  },
  {
    id: "companies-9",
    question: "9 / 24. I understand who I am and how others perceive me",
    question_ar: "أدرك من أنا وكيف يراني الآخريين ٩ / ٢٤",
    modalId: "companies-modal-5",
    rate: 0.8,
  },
  {
    id: "companies-10",
    question: "10 / 24. The systems operate efficiently and no need to changes",
    question_ar: "الأنظمة تعمل بكفاءة ولا تحتاج إلى تغيير ١٠ / ٢٤",
    modalId: "companies-modal-5",
    rate: 0.2,
  },
  {
    id: "companies-11",
    question: "11 / 24. I can effectively balance different aspects of my life",
    question_ar: "أستطيع تحقيق التوازن بين مختلف جوانب حياتي بفعَّالية ١١ / ٢٤",
    modalId: "companies-modal-6",
    rate: 0.8,
  },
  {
    id: "companies-12",
    question:
      "12 / 24. The company provides and allocates resources wisely to support its business priorities",
    question_ar:
      "تُوفٍّر الشركة وتخصص الموارد بذكاء لدعم أولويات أعمالها ١٢ / ٢٤",
    modalId: "companies-modal-6",
    rate: 0.2,
  },
  {
    id: "companies-13",
    question: "13 / 24. I can adjust my decisions if circumstances require",
    question_ar: "يمكنني تعديل قراراتي إذا تطلبت الظروف ذلك ١٣ / ٢٤",
    modalId: "companies-modal-7",
    rate: 0.8,
  },
  {
    id: "companies-14",
    question:
      "14 / 24. The company's decisions are balanced and made with accurate, thoughtful criteria",
    question_ar:
      "قرارات الشركة متوازنة وتُتَّخذ بمعايير دقيقة ومدروسة. ١٤ / ٢٤",
    modalId: "companies-modal-7",
    rate: 0.2,
  },
  {
    id: "companies-15",
    question: "15 / 24. I always organize and manage operations logically",
    question_ar: "أقوم دائمًا بتنظيم وتشغيل الأعمال بشكل منطقي. ١٥ / ٢٤",
    modalId: "companies-modal-8",
    rate: 0.8,
  },
  {
    id: "companies-16",
    question:
      "16 / 24. Everyone in the company works according to well-planned processes",
    question_ar: "جميع مَن في الشركة يعملون وفق عمليات مدروسة ١٦ / ٢٤",
    modalId: "companies-modal-8",
    rate: 0.2,
  },
  {
    id: "companies-17",
    question:
      "17 / 24. I can communicate with others and persuade them of my views",
    question_ar: "أستطيع التواصل مع الآخرين وإقناعهم بآرائي ١٧ / ٢٤",
    modalId: "companies-modal-9",
    rate: 0.8,
  },
  {
    id: "companies-18",
    question: "18 / 24. The company's marketing efforts are adequate",
    question_ar: "جهود التسويق التي تبذلها الشركة كافية ١٨ / ٢٤",
    modalId: "companies-modal-9",
    rate: 0.2,
  },
  {
    id: "companies-19",
    question:
      "19 / 24. Economy and saving are an essential part of my life vision",
    question_ar: "الاقتصاد والتوفير جزء أساسي من تصوري للحياة ١٩ / ٢٤",
    modalId: "companies-modal-10",
    rate: 0.8,
  },
  {
    id: "companies-20",
    question:
      "20 / 24. The company's collection and payment system is adequately effective",
    question_ar: "نظام التحصيل والدفع لدى الشركة فعًالة بدرجة كافية ٢٠ / ٢٤",
    modalId: "companies-modal-10",
    rate: 0.2,
  },
  {
    id: "companies-21",
    question:
      "21 / 24. I am highly focused on achieving progress and growth in my life",
    question_ar: "يهمني بشكل كبير تحقيق التقدم والنمو في حياتي ٢١ / ٢٤",
    modalId: "companies-modal-11",
    rate: 0.8,
  },
  {
    id: "companies-22",
    question:
      "22 / 24. Financial reports provide adequate data to understand the company's operations",
    question_ar: "التقارير المالية تعرض بيانات كافية لفهم أعمال الشركة ٢٢ / ٢٤",
    modalId: "companies-modal-11",
    rate: 0.2,
  },
  {
    id: "companies-23",
    question: "23 / 24. I leverage mistakes to improve my life",
    question_ar: "أستفيد من الأخطاء لتطوير حياتي ٢٣ / ٢٤",
    modalId: "companies-modal-12",
    rate: 0.8,
  },
  {
    id: "companies-24",
    question:
      "24 / 24. The company's review and evaluation procedures are adequate",
    question_ar: "إجراءات المراجعة والتقييم بالشركة كافية ٢٤ / ٢٤",
    modalId: "companies-modal-12",
    rate: 0.2,
  },
];

const entrepreneursSurvey = [
  {
    id: "entrepreneurs-1",
    question:
      "1 / 24. I can evaluate any important matter I intend to undertake",
    question_ar: "أستطيع أن أقيِّم أي أمر مُهمٍّ أنوي القيام به  ١ / ٢٤",
    modalId: "entrepreneurs-modal-1",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-2",
    question: "2 / 24. I can assess the economic feasibility of my project",
    question_ar: "أستطيع تقدير الجدوى الاقتصادية لمشروعي  ٢ / ٢٤",
    modalId: "entrepreneurs-modal-1",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-3",
    question:
      "3 / 24. My thoughts and actions are directed towards achieving my goals",
    question_ar: "أفكاري وأفعالي موجَّهة نحو تحقيق غاياتي  ٣ / ٢٤",
    modalId: "entrepreneurs-modal-2",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-4",
    question: "4 / 24. I have a clear strategy for entering the market",
    question_ar: "لدى إستراتيجية واضحة للدخول إلى السوق  ٤ / ٢٤",
    modalId: "entrepreneurs-modal-2",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-5",
    question:
      "5 / 24. I organize my thoughts and goals in a way that helps me succeed",
    question_ar: "أرتب أفكاري وأهدافي بطريقة تساعدني على النجاح  ٥ / ٢٤",
    modalId: "entrepreneurs-modal-3",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-6",
    question: "6 / 24. I have prepared a detailed plan to implement my project",
    question_ar: "أعددت خطة تفصيلية لتنفيذ مشروعي  ٦ / ٢٤",
    modalId: "entrepreneurs-modal-3",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-7",
    question:
      "7 / 24. I choose the phrases that precisely convey what I want to express",
    question_ar: "أختار العبارات التي تعني بدقة ما أرغب التعبير عنه  ٧ / ٢٤",
    modalId: "entrepreneurs-modal-4",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-8",
    question: "8 / 24. I can choose my brand identity carefully",
    question_ar: "أستطيع أن أختار علامتي التجارية بعناية  ٨ / ٤٢",
    modalId: "entrepreneurs-modal-4",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-9",
    question:
      "9 / 24. Proficient in understanding people's personalities and types",
    question_ar: "متمكِّن في فهم أطباع وأنماط الناس  ٩ / ٢٤",
    modalId: "entrepreneurs-modal-5",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-10",
    question:
      "10 / 24. I understand the appropriate legal structure for my company",
    question_ar: "أدرك الشكل القانوني المناسب لشركتي  ١٠ / ٢٤",
    modalId: "entrepreneurs-modal-5",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-11",
    question: "11 / 24. I excel at finding resources that meet my needs",
    question_ar: "أُجيد البحث عن الموارد الملبية لاحتياجاتي  ١١ / ٢٤",
    modalId: "entrepreneurs-modal-6",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-12",
    question: "12 / 24. I can secure the best resources for my project",
    question_ar: "أستطيع الحصول على أفضل الموارد لمشروعي  ١٢ / ٢٤",
    modalId: "entrepreneurs-modal-6",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-13",
    question:
      "13 / 24. I understand the impact of my decisions on my life before making them",
    question_ar: "أدرك تأثير قراراتي على حياتي قبل اتخاذها  ١٣ / ٢٤",
    modalId: "entrepreneurs-modal-7",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-14",
    question:
      "14 / 24. I evaluated the decision to enter the project from all aspects",
    question_ar: "قيًمت قرار دخولي في المشروع من جميع جوانبه  ١٤ / ٢٤",
    modalId: "entrepreneurs-modal-7",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-15",
    question:
      "15 / 24. I work on breaking down any problem to understand its details",
    question_ar: "أعمل على تفكيك أي مشكلة لاستيعاب تفاصيلها  ١٥ / ٢٤",
    modalId: "entrepreneurs-modal-8",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-16",
    question: "16 / 24. I work on continuously improving business operations",
    question_ar: "أعمل على تطوير تشغيل العمل بإستمرار  ١٦ / ٢٤",
    modalId: "entrepreneurs-modal-8",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-17",
    question: "17 / 24. I can easily inspire others",
    question_ar: "أستطيع أن ألهم الآخرين بسهولة  ١٧ / ٢٤",
    modalId: "entrepreneurs-modal-9",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-18",
    question:
      "18 / 24. I am capable of showcasing my products in a way that impresses them",
    question_ar: "قادرٌ على عرض منتجاتي بطريقة تنال إعجابهم  ١٨ / ٢٤",
    modalId: "entrepreneurs-modal-9",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-19",
    question: "19 / 24. I am proficient in managing my financial affairs",
    question_ar: "لدي الكفاءة في إدارة أموري المالية  ١٩ / ٢٤",
    modalId: "entrepreneurs-modal-10",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-20",
    question:
      "20 / 24. I work on efficiently developing collection and payment policies",
    question_ar: "أعمل على تطوير سياسات التحصيل والسداد بكفاءة  ٢٠ / ٢٤",
    modalId: "entrepreneurs-modal-10",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-21",
    question: "21 / 24. I can understand numerical ratios to measure progress",
    question_ar: "قادر على فهم النسب الرقمية في قياس التطور  ٢١ / ٢٤",
    modalId: "entrepreneurs-modal-11",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-22",
    question:
      "22 / 24. My financial reports provide me with enough information to understand the progress of my project",
    question_ar:
      "تقاريري المالية تعطيني القدر الكافي لفهم تطور مشروعي  ٢٢ / ٢٤",
    modalId: "entrepreneurs-modal-11",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-23",
    question:
      "23 / 24. I always work on self-review and reflection on my actions",
    question_ar: "دائماً أعمل على مراجعة نفسي وما أقوم به  ٢٣ / ٢٤",
    modalId: "entrepreneurs-modal-12",
    rate: 0.5,
  },
  {
    id: "entrepreneurs-24",
    question:
      "24 / 24. I regularly work on implementing improvements in my project",
    question_ar: "أعمل بانتظام على إدخال التحسينات في مشروعي  ٢٤ / ٢٤",
    modalId: "entrepreneurs-modal-12",
    rate: 0.5,
  },
];

export const surveyFlows: Record<ExcludedSurveyType, Answer[]> = {
  entrepreneurs: entrepreneursSurvey,
  explorers: explorersSurvey,
  companies: companiesSurvey,
};

export const endSurveyMessages: payloadType["message"][] = [
  {
    id: uuid(),
    msgType: "text",
    msgSender: "chatbot",
    msg_body: "Thank you for completing the survey, now let’s review your business strength & weaknesses",

  },
  {
    id: uuid(),
    msgType: "result",
    msgSender: "chatbot",
    msg_body: "",
  },
  // {
  //   id: uuid(),
  //   msgType: "text",
  //   msgSender: "chatbot",
  //   msg_body:
  //     "Now, let’s move to the next step and discuss how might we use the strength skills and improve the weak ones.",
  // },
];

export const surveyAnswers = [
  {
    title: "Strongly disagree",
    title_ar: "غير موافق بشدة",
    score: 0,
    id: "an_1",
  },
  {
    title: "Disagree",
    title_ar: "غير موافق",
    score: 7.5,
    id: "an_2",
  },
  {
    title: "Neutral",
    title_ar: "لا اعرف",
    score: 15,
    id: "an_3",
  },
  {
    title: "Agree",
    title_ar: "موافق",
    score: 22.5,
    id: "an_4",
  },
  {
    title: "Strongly agree",
    title_ar: "موافق بشدة",
    score: 30,
    id: "an_5",
  },
];

const businessClockHelpfulAnswerEn = `
  <div class="grid">
    <h1 class="text-lg font-bold text-gray-900 mb-4">The Business Clock</h1>
    <p class="text-gray-700 mb-6">
     The Business Clock offers a structured and comprehensive framework for managing and developing businesses effectively, tailored to individuals at different stages of their entrepreneurial journey—beginners, entrepreneurs with opportunities, and experienced business owners or CEOs. Here's how it is helpful:
    </p>
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Key Benefits of the Business Clock</h2>

    <h3 class="font-semibold text-gray-900 mb-2">1. Comprehensive Guidance:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>It covers every aspect of a business lifecycle, from conceptualizing an idea (Opportunity Hour) to evaluating performance (Review Hour).</li>
      <li>Divided into four logical phases—Thinking, Preparing, Operating, and Earning—the clock ensures businesses address foundational elements before scaling.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">2. Structured Decision-Making:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>Tools like the SAMPLE Model for Decision Making and CROM Dashboard for financial evaluation provide frameworks to assess the impact of decisions and measure performance.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">3. Focus on Practical Outcomes:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>Each hour is goal-oriented, such as formulating strategic plans, defining brand identity, building organizational structures, optimizing operations, and enhancing marketing efforts.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">4. Tailored Learning and Application:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>The model supports learners at different levels—beginners simulate scenarios, entrepreneurs work on real opportunities, and CEOs optimize existing operations.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">5. Promotes Sustainability and Growth:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>By emphasizing continuous improvement, the Business Clock equips businesses to adapt, innovate, and remain competitive.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">6. Supports Across Business Functions:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>It simplifies complex areas like financial management, branding, operations, and marketing, offering tools to break down challenges.</li>
    </ul>

    <h2 class="text-lg font-semibold text-gray-900 mb-4">Specific Applications</h2>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li><strong class="font-medium text-gray-900">Opportunity Identification:</strong> Frameworks like the PRODUCT Model help entrepreneurs evaluate market demand, profitability, and competition.</li>
      <li><strong class="font-medium text-gray-900">Strategic Planning:</strong> The 4P Strategic Shifts Model ensures a smooth market entry, profitability, and long-term prosperity.</li>
      <li><strong class="font-medium text-gray-900">Operational Efficiency:</strong> The Operations Triangle balances cost, quality, and time to optimize outputs.</li>
      <li><strong class="font-medium text-gray-900">Performance Monitoring:</strong> Tools like the CROM Dashboard ensure businesses stay aligned with financial and operational benchmarks.</li>
      <li><strong class="font-medium text-gray-900">Self-Development:</strong> Through evaluation models like the Review Model, it identifies areas for growth in personal and organizational capabilities.</li>
    </ul>

    <h2 class="text-lg font-semibold text-gray-900 mb-4">How It Stands Out</h2>
    <p class="text-gray-700 mb-4">Unlike generic business courses, the Business Clock:</p>
    <ul class="grid list-disc pl-6 text-gray-700 mb-6">
      <li>Offers a visual, chronological structure, making it intuitive to follow.</li>
      <li>Integrates real-world applications, case studies, and tools to directly address business challenges.</li>
      <li>Customizes the workplace and focus for beginners, entrepreneurs, and CEOs, ensuring relevance and impact.</li>
    </ul>
    <p class="text-gray-700">
      The Business Clock is not just a guide but a dynamic management tool that ensures every business activity is purposeful, aligned, and strategically implemented to achieve sustainable success.
    </p>
  </div>`;

const businessClockHelpfulAnswerAr = `
  <div class="grid">
    <h1 class="text-lg font-bold text-gray-900 mb-4">الساعة التجارية</h1>
    <p class="text-gray-700 mb-6">
      تقدم الساعة التجارية إطارًا منظمًا وشاملاً لإدارة وتطوير الأعمال بفعالية، مصممة خصيصًا للأفراد في مراحل مختلفة من رحلتهم الريادية - المبتدئين، ورواد الأعمال ذوي الفرص، وأصحاب الأعمال أو الرؤساء التنفيذيين ذوي الخبرة. إليك كيف تكون مفيدة:
    </p>
    <h2 class="text-lg font-semibold text-gray-900 mb-4">الفوائد الرئيسية للساعة التجارية</h2>

    <h3 class="font-semibold text-gray-900 mb-2">1. التوجيه الشامل:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>تغطي كل جانب من جوانب دورة حياة الأعمال، من تصور الفكرة (ساعة الفرصة) إلى تقييم الأداء (ساعة المراجعة).</li>
      <li>مقسمة إلى أربع مراحل منطقية - التفكير، والتحضير، والتشغيل، والكسب - تضمن الساعة معالجة الشركات للعناصر الأساسية قبل التوسع.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">2. صنع القرار المنظم:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>توفر أدوات مثل نموذج SAMPLE لصنع القرار ولوحة معلومات CROM للتقييم المالي أطرًا لتقييم تأثير القرارات وقياس الأداء.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">3. التركيز على النتائج العملية:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>كل ساعة موجهة نحو هدف، مثل صياغة الخطط الاستراتيجية، وتحديد هوية العلامة التجارية، وبناء الهياكل التنظيمية، وتحسين العمليات، وتعزيز جهود التسويق.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">4. التعلم والتطبيق المخصص:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>يدعم النموذج المتعلمين على مستويات مختلفة - يحاكي المبتدئون السيناريوهات، ويعمل رواد الأعمال على الفرص الحقيقية، ويحسن الرؤساء التنفيذيون العمليات القائمة.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">5. تعزيز الاستدامة والنمو:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>من خلال التركيز على التحسين المستمر، تجهز الساعة التجارية الشركات للتكيف والابتكار والبقاء تنافسية.</li>
    </ul>

    <h3 class="font-semibold text-gray-900 mb-2">6. الدعم عبر وظائف الأعمال:</h3>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li>تبسط المجالات المعقدة مثل الإدارة المالية، والعلامات التجارية، والعمليات، والتسويق، وتقدم أدوات لتفكيك التحديات.</li>
    </ul>

    <h2 class="text-lg font-semibold text-gray-900 mb-4">التطبيقات المحددة</h2>
    <ul class="grid list-disc pl-6 text-gray-700 mb-4">
      <li><strong class="font-medium text-gray-900">تحديد الفرص:</strong> تساعد أطر مثل نموذج PRODUCT رواد الأعمال على تقييم الطلب في السوق والربحية والمنافسة.</li>
      <li><strong class="font-medium text-gray-900">التخطيط الاستراتيجي:</strong> يضمن نموذج التحولات الاستراتيجية 4P دخولًا سلسًا للسوق، وربحية، وازدهارًا على المدى الطويل.</li>
      <li><strong class="font-medium text-gray-900">الكفاءة التشغيلية:</strong> يوازن مثلث العمليات بين التكلفة والجودة والوقت لتحسين المخرجات.</li>
      <li><strong class="font-medium text-gray-900">مراقبة الأداء:</strong> تضمن أدوات مثل لوحة معلومات CROM بقاء الشركات متوافقة مع المعايير المالية والتشغيلية.</li>
      <li><strong class="font-medium text-gray-900">التطوير الذاتي:</strong> من خلال نماذج التقييم مثل نموذج المراجعة، يحدد مجالات النمو في القدرات الشخصية والتنظيمية.</li>
    </ul>

    <h2 class="text-lg font-semibold text-gray-900 mb-4">كيف تتميز</h2>
    <p class="text-gray-700 mb-4">على عكس دورات الأعمال العامة، فإن الساعة التجارية:</p>
    <ul class="grid list-disc pl-6 text-gray-700 mb-6">
      <li>تقدم هيكلًا مرئيًا وزمنيًا، مما يجعلها سهلة الفهم والمتابعة.</li>
      <li>تدمج التطبيقات الواقعية، ودراسات الحالة، والأدوات لمعالجة تحديات الأعمال بشكل مباشر.</li>
      <li>تخصص مكان العمل والتركيز للمبتدئين ورواد الأعمال والرؤساء التنفيذيين، مما يضمن الصلة والتأثير.</li>
    </ul>
    <p class="text-gray-700">
      الساعة التجارية ليست مجرد دليل، بل هي أداة إدارة ديناميكية تضمن أن كل نشاط تجاري هادف ومتوافق ومنفذ استراتيجيًا لتحقيق النجاح المستدام.
    </p>
  </div>`;

export const getBusinessClockHelpfulAnswer = (locale: string) => {
  if (locale === "ar") {
    return businessClockHelpfulAnswerAr;
  }
  return businessClockHelpfulAnswerEn;
};

export const START_SURVEY_MESSAGE = {
  en: "Take your time to answer the following 24 questions.",
  ar: "خذ وقتك للإجابة على الأسئلة التالية .",
};
