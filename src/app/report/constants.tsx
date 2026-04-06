interface Greetings {
  ar: (firstName: string) => string;
  en: (firstName: string) => string;
}
export const greetings: Greetings = {
  ar: (firstName: string) => `السيد / ${firstName} المحترم,`,
  en: (firstName: string) => `Mr/ ${firstName},`,
};

export const greetings2 = {
  ar: "السلام عليكم ورحمة الله وبركاته، وبعد.",
  en: "Good day and welcome, and may God bless you and your family.",
};

export const paragraph1Messages = {
  ar: "نشكر لك اهتمامك بالمشاركة في اختبار قياس الفجوة التجارية لديك. لقد قمنا بتصميم هذا الاختبار وفق معايير مهنية دقيقة وبشكل مبسط وفريد يراعي كافة الجوانب التي تتعلق برحلتك إلى عالم الأعمال، إن نجاح الأعمال التجارية تتوقف على البناء السليم لسلسلة من المهارات والاستعدادات الشخصية والمهنية.",
  en: "Thank you for your interest in participating in the Business Aptitude Assessment. We have designed this test according to precise professional standards in a simple and unique manner that considers all aspects related to your journey into the business world. The success of businesses depends on the proper establishment of a series of personal and professional skills and preparations.",
};

export const paragraph2Messages = {
  ar: "من خلال هذا الاختبار والرسم الموضح هنا، يوجد لديك استعدادات وقدرات تمكنك من بناء مستقبل مميز في إدارة أعمالك مثل قدراتك التخطيطية وعلاقاتك مع السوق وقدراتك التسويقية. وهذه العناصر مجتمعة غالباً ما تكون عناصر مفتاحية لتقوية بعض الجوانب التي وجدناها تحتاج إلى المزيد من العناية مثل الجوانب المالية وبناء الهوية التجارية وإدارة التشغيل تحتاج إلى المزيد من العناية.",
  en: "Through this test and the illustration provided here, you have preparations and capabilities that enable you to build a distinguished future in managing your business, such as your planning abilities, market relationships, and marketing capabilities. These combined elements are often key factors to strengthen some aspects we found needing more attention, such as financial aspects, brand identity building, and operational management.",
};

export const paragraph3Messages = {
  ar: "يسعدنا في أجني أن نقدم لك ساعة مجانية مع أحد المستشارين لدينا لمناقشة أفكارنا في تحديد كافة احتياجاتك المهنية للنجاحات التي تصبو إليها.",
  en: "We at Ajnee are pleased to offer you a free hour with one of our consultants to discuss our ideas in identifying all your professional needs for the successes you aspire to.",
};

export const paragraph4Messages = {
  ar: "سنكون سعداء في استقبال مكالمتك على الرقم الموضح أدناه، أو التواصل معي شخصياً عبر هذا الايميل.",
  en: "We would be happy to receive your call at the number provided below or to communicate with me personally via this email.",
};

export const regardsMessages = {
  ar: "متمنيا لكم دوام التقدم والازدهار،",
  en: "Kind regards,",
};
export const signedMessages = {
  ar: "علي الهاشمي",
  en: "Ali Al-Hashimi",
};
export const signedMessages2 = {
  ar: "مدير ومؤسس",
  en: "CEO",
};

export const aspectsHeaders = {
  ar: [
    "الجوانب للاستفادة منها",
    "الجوانب للتطوير",
    "الجوانب التي تحتاج إلى مزيد من الاهتمام",
  ],
  en: [
    "Aspects to leverage",
    "Aspects to develop",
    "Aspects needing more attention",
  ],
};

export const printStyles = `
@page {
  size: A4;
  margin: 0;
  padding: 0;
}

@media print {
  html, body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    overflow: visible;
  }
  
  body * {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  
  #report-area {
    width: 210mm;
    height: auto;
    min-height: 297mm;
    max-width: 210mm;
    overflow: visible;
    transform: scale(0.97);
    transform-origin: top left;
  }
  
  #report-container {
    width: 210mm;
    height: auto;
    min-height: 297mm;
    max-width: 210mm;
    overflow: visible;
    transform: none !important;
  }
  
  #report-area::after {
    content: '';
    display: none;
  }

  .side-bar {
    max-width: 16.666% !important;
    width: 35mm !important;
    display: block !important;
    overflow: visible !important;
  }

  .main-content {
    max-width: 83.333% !important;
    width: 175mm !important;
  }
}
`; 