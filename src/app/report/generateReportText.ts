// ─── Modal descriptions per survey type ──────────────────────────────────────

type ModalDesc = { asStrength: string; asWeakness: string };

// ── Arabic descriptions ────────────────────────────────────────────────────

const explorerModalDescriptions: Record<string, ModalDesc> = {
  "explorers-modal-1": {
    asStrength: "وهو ما يعكس قدرة جيدة على قراءة التحديات وفهم الأبعاد المالية المرتبطة بالفرص التجارية، مما يمنح المستفيد ميزة واضحة في التمييز بين الفرص الحقيقية وغيرها.",
    asWeakness: "إذ إن اكتشاف الفرص لا يكتمل بمجرد الحماس أو وضوح الفكرة، بل يحتاج إلى قدرة على قراءة التحديات وفهم الأبعاد المالية المرتبطة بأي فرصة.",
  },
  "explorers-modal-2": {
    asStrength: "وهو جانب يعكس أن لدى المستفيد قدرة مبدئية على توجيه اهتمامه نحو غاية واضحة بدل الدخول إلى السوق بصورة عشوائية أو غير منظمة.",
    asWeakness: "إذ إن الانطلاق دون رؤية واضحة يجعل الجهود متفرقة ويقلل من القدرة على التمييز بين الفرصة الحقيقية والفرصة الوهمية.",
  },
  "explorers-modal-3": {
    asStrength: "وهو ما يدل على وعي جيد بأهمية ترتيب الخطوات وتسلسل المراحل عند الإقبال على أي فرصة تجارية، مما يُقلل من احتمالات الوقوع في الفوضى.",
    asWeakness: "لأن التخطيط المسبق هو الفارق بين من يتحرك بثقة نحو السوق ومن يتعثر في خطواته الأولى بسبب غياب الخارطة التنفيذية.",
  },
  "explorers-modal-4": {
    asStrength: "وهو ما يعكس قدرة جيدة على تصور الصورة الذهنية للعمل أو النشاط التجاري وفهم جانب من عناصر الظهور والتميّز.",
    asWeakness: "إذ تُشكّل الهوية التجارية الواجهة الأولى لأي نشاط أمام السوق، وضعفها يؤثر مباشرة في تصور العملاء وثقتهم وقدرتهم على التمييز.",
  },
  "explorers-modal-5": {
    asStrength: "وهي نقطة إيجابية مهمة تدل على وجود وعي مقبول بالجوانب النظامية والتنظيمية المرتبطة بالعمل التجاري.",
    asWeakness: "إذ إن الجهل بالأطر القانونية يُعرّض أي نشاط تجاري لمخاطر غير محسوبة قد تُوقف مساره في مراحله الأولى.",
  },
  "explorers-modal-6": {
    asStrength: "وهو ما يعني أن المستفيد يمتلك قدرة جيدة على الاستفادة من علاقاته وموارده المتاحة في خدمة توجهاته التجارية.",
    asWeakness: "لأن نجاح المستكشف في الانتقال من مرحلة الاهتمام بالسوق إلى مرحلة اقتناص الفرصة يتأثر كثيرًا بما يملكه من علاقات، ومصادر دعم، وإمكانية الوصول إلى الموارد المناسبة.",
  },
  "explorers-modal-7": {
    asStrength: "وهو ما يكشف عن قدرة واعية على الموازنة بين الخيارات وتقدير المخاطر قبل الانتقال من مرحلة إلى أخرى.",
    asWeakness: "إذ إن اتخاذ القرار في بيئة السوق يستلزم معرفة بأدوات تقييم المخاطر وتوقع السيناريوهات المحتملة قبل الالتزام بأي مسار.",
  },
  "explorers-modal-8": {
    asStrength: "وهو ما يعني أن لدى المستفيد قدرة جيدة على تحويل الأفكار إلى خطوات عملية قابلة للتنفيذ الفعلي.",
    asWeakness: "لأن التنفيذ الفعّال هو الجسر الحقيقي بين الفكرة والنتيجة، وضعفه يؤدي إلى فقدان الفرص حتى لو كانت الأفكار جيدة.",
  },
  "explorers-modal-9": {
    asStrength: "وهو ما يعكس وعيًا جيدًا بطرق الوصول إلى الجمهور المستهدف وتحديد القنوات المناسبة لأي نشاط تجاري.",
    asWeakness: "إذ إن فهم آليات التسويق وقنواته يُعدّ من الأساسيات التي تحدد مدى قدرة أي نشاط على الوصول إلى عملائه وبناء حضوره.",
  },
  "explorers-modal-10": {
    asStrength: "وهي مهارة محورية تدل على قدرة المستفيد في التعامل مع الأرقام وفهم حركة المال داخل أي نشاط تجاري.",
    asWeakness: "وهي من المهارات الأساسية التي ينبغي تنميتها مبكرًا، لأنها تؤثر في جودة التقدير، وحسن اتخاذ القرار، والقدرة على التمييز بين الفرص الجيدة والفرص المرهقة أو غير المجدية.",
  },
  "explorers-modal-11": {
    asStrength: "وهو ما يدل على قدرة المستفيد على قراءة الأداء المالي وفهم المؤشرات الرقمية المرتبطة بالنشاط التجاري.",
    asWeakness: "إذ إن القدرة على قراءة النسب المالية وتفسير البيانات المحاسبية تُعدّ من المهارات التي ترفع مستوى القرارات التجارية وتُقلل من احتمال الوقوع في أخطاء التقدير.",
  },
  "explorers-modal-12": {
    asStrength: "وهو ما يعكس توجهًا إيجابيًا نحو التعلم المستمر والسعي الدائم لتحسين الأداء الشخصي والمهني.",
    asWeakness: "إذ إن التطوير الذاتي هو الوقود الحقيقي الذي يُبقي المستكشف في مسار نمو مستدام ويُعزز قدرته على التكيف مع متغيرات السوق.",
  },
};

const entrepreneurModalDescriptions: Record<string, ModalDesc> = {
  "entrepreneurs-modal-1": {
    asStrength: "بما يدل على قدرة جيدة على استقراء السوق وتحديد الفرص المناسبة بناءً على خبرة متراكمة وتقييم واعٍ للواقع.",
    asWeakness: "لأن الفرص الحقيقية لا تُكتشف بمجرد الحدس، بل تحتاج إلى منهجية في التقييم وقدرة على ربط الخبرة بمعطيات السوق.",
  },
  "entrepreneurs-modal-2": {
    asStrength: "بما يعكس قدرة جيدة على النظر إلى العمل بمنظور أوسع من التشغيل اليومي، وربط الجهد الحالي باتجاهات النمو المستقبلية.",
    asWeakness: "لأن التفكير الاستراتيجي هو الذي يُحدد الفارق بين المشروع الذي يكبر والمشروع الذي يتوقف عند حدود معينة.",
  },
  "entrepreneurs-modal-3": {
    asStrength: "بما يُشير إلى قدرة على تحويل الخطط إلى إجراءات فعلية وقابلة للقياس والتنفيذ على أرض الواقع.",
    asWeakness: "لأن الفجوة بين التخطيط والتنفيذ هي أكثر ما يُربك مسيرة رائد الأعمال ويُضيع الجهود دون نتائج ملموسة.",
  },
  "entrepreneurs-modal-4": {
    asStrength: "بما يدل على قدرة على بناء صورة واضحة ومميزة لعلامته التجارية في أذهان العملاء والسوق المستهدف.",
    asWeakness: "إذ إن هوية العلامة التجارية هي الرسالة الصامتة التي يتركها كل منتج وكل تفاعل مع العميل، وضعفها يؤثر في الانطباع الأول.",
  },
  "entrepreneurs-modal-5": {
    asStrength: "وهو جانب مهم يدل على وعي بأهمية الانضباط النظامي في حماية المشروع وضمان استمراريته بعيدًا عن المخاطر القانونية.",
    asWeakness: "وهو جانب مهم لحماية النشاط التجاري، وتقليل المخاطر، وتعزيز سلامة الممارسات في مختلف مراحل تطور المشروع.",
  },
  "entrepreneurs-modal-6": {
    asStrength: "بما يعكس قدرة على إدارة الموارد المتاحة بكفاءة وتوجيهها نحو الأولويات الأكثر أثرًا في مسيرة النمو.",
    asWeakness: "لأن إدارة الموارد بحكمة هي ما يُتيح للمشروع الصمود في أوقات الضغط والتوسع حين تتاح الفرص.",
  },
  "entrepreneurs-modal-7": {
    asStrength: "وهي مهارة أساسية لرائد الأعمال في تقدير الخيارات، والموازنة بين البدائل، واتخاذ القرار المناسب في الوقت المناسب.",
    asWeakness: "لأن كل قرار خاطئ في بيئة ريادية يُكلّف وقتًا ومالًا وزخمًا، وتطوير هذه المهارة يُقلل من تكلفة الأخطاء ويُحسّن نوعية الاختيارات.",
  },
  "entrepreneurs-modal-8": {
    asStrength: "مما يشير إلى وجود قدرة عملية على التعامل مع سير العمل، وتنظيم المهام، والمحافظة على انسيابية النشاط التشغيلي.",
    asWeakness: "لأن كفاءة العمليات هي ما يُحدد ما إذا كان النمو سيُحسّن الربحية أم سيُضاعف التعقيد والفوضى.",
  },
  "entrepreneurs-modal-9": {
    asStrength: "بما يعكس قدرة على فهم السوق واختيار أسلوب الاختراق المناسب لتحقيق الانتشار والحصة المستهدفة.",
    asWeakness: "إذ إن فهم ديناميكيات السوق واختيار نقطة الدخول الصحيحة يحدد مدى سرعة نمو المشروع وقدرته على الاحتفاظ بحصته.",
  },
  "entrepreneurs-modal-10": {
    asStrength: "بما يدل على قدرة على ضبط التدفق المالي وإدارة العمليات الحسابية المرتبطة بالنشاط التجاري بصورة منظمة.",
    asWeakness: "لأن ضبط العمليات المالية هو الضمانة الأولى لاستدامة المشروع وعدم الوقوع في أزمات سيولة مفاجئة.",
  },
  "entrepreneurs-modal-11": {
    asStrength: "بما يدل على قدرة على متابعة الأداء المالي وقراءة المؤشرات بدقة واتخاذ القرار بناءً على بيانات حقيقية.",
    asWeakness: "لما لها من أثر مباشر في ضبط الأداء، وفهم الوضع المالي، واتخاذ قرارات أكثر دقة وأقل اعتمادًا على التخمين.",
  },
  "entrepreneurs-modal-12": {
    asStrength: "بما يعكس التزامًا بالتطوير المستمر وعدم الاكتفاء بالمستوى الراهن من الأداء أو الاستسلام للروتين.",
    asWeakness: "وهو من المجالات الحيوية التي تساعد رائد الأعمال على الانتقال من المحافظة على النشاط إلى توسيعه وتنمية فرصه بصورة أكثر فاعلية.",
  },
};

const companiesModalDescriptions: Record<string, ModalDesc> = {
  "companies-modal-1": {
    asStrength: "وهو ما يدل على قدرة المؤسسة على رصد الفرص التجارية الجديدة وتحويلها إلى مصادر نمو فعلية.",
    asWeakness: "إذ إن اقتصار الشركة على قاعدتها الحالية دون البحث الفعّال عن فرص النمو يُعرّضها لخطر التراجع التدريجي.",
  },
  "companies-modal-2": {
    asStrength: "وهو ما يُشير إلى وضوح في تحديد ما يميز المؤسسة عن منافسيها وقدرتها على الحفاظ على هذا التميز.",
    asWeakness: "إذ إن غياب الميزة التنافسية الواضحة يجعل المؤسسة عُرضة لضغوط السوق وصعوبة الاحتفاظ بعملائها.",
  },
  "companies-modal-3": {
    asStrength: "وهو ما يدل على إدارة منهجية ومنظمة تتيح ترجمة الاستراتيجية إلى خطط قابلة للتنفيذ والقياس.",
    asWeakness: "لأن التخطيط الضعيف يُحوّل الموارد إلى جهود متشتتة لا تُفضي إلى نتائج استراتيجية.",
  },
  "companies-modal-4": {
    asStrength: "وهو ما يعكس استثمارًا جيدًا في بناء الهوية المؤسسية وتعزيز الحضور البراندي في السوق.",
    asWeakness: "إذ إن العلامة التجارية الضعيفة تُصعّب الاحتفاظ بالعملاء وتُقلل من القدرة على رفع السعر أو التوسع في أسواق جديدة.",
  },
  "companies-modal-5": {
    asStrength: "وهو ما يدل على التزام بالمتطلبات التنظيمية والقانونية مما يُحصّن المؤسسة من المخاطر القانونية.",
    asWeakness: "إذ إن الإغفال عن الامتثال القانوني يُشكّل خطرًا مباشرًا على استمرارية المؤسسة وسمعتها.",
  },
  "companies-modal-6": {
    asStrength: "وهو ما يعكس كفاءة في توظيف الموارد المتاحة وتوجيهها لخدمة الأولويات الاستراتيجية للمؤسسة.",
    asWeakness: "لأن سوء إدارة الموارد يُفضي إلى هدر يُضعف القدرة التنافسية ويُضيق هامش الربحية.",
  },
  "companies-modal-7": {
    asStrength: "وهو ما يكشف عن قدرة على اتخاذ قرارات استراتيجية مدروسة تأخذ في الحسبان المتغيرات والمخاطر.",
    asWeakness: "إذ إن القرارات الاستراتيجية السريعة أو غير المدروسة تُكلّف المؤسسة خسائر يصعب تداركها لاحقًا.",
  },
  "companies-modal-8": {
    asStrength: "وهو ما يدل على كفاءة تشغيلية تُتيح تقديم الخدمة أو المنتج بجودة عالية وتكلفة مضبوطة.",
    asWeakness: "لأن ضعف الكفاءة التشغيلية يُضيع الموارد ويُقلل من جودة تجربة العميل وقدرة المؤسسة على التوسع.",
  },
  "companies-modal-9": {
    asStrength: "وهو ما يعكس وعيًا استراتيجيًا بكيفية الوصول إلى الأسواق المستهدفة وتعزيز الحضور التسويقي.",
    asWeakness: "إذ إن ضعف الاستراتيجية التسويقية يُقلل من قدرة المؤسسة على اكتساب عملاء جدد والاحتفاظ بالقائمين.",
  },
  "companies-modal-10": {
    asStrength: "وهو ما يدل على ضبط مالي جيد يُتيح تتبع الأداء والتحكم في التكاليف واتخاذ قرارات مبنية على بيانات دقيقة.",
    asWeakness: "إذ إن ضعف التحكم المالي يُعرّض المؤسسة لأزمات سيولة مفاجئة وصعوبة في التخطيط للنمو.",
  },
  "companies-modal-11": {
    asStrength: "وهو ما يعكس قدرة على تحويل البيانات إلى رؤى قابلة للعمل وقرارات أكثر دقة.",
    asWeakness: "لأن المؤسسات التي لا تحلّل أداءها بدقة تفقد القدرة على التحسين المستمر والتكيف مع متغيرات السوق.",
  },
  "companies-modal-12": {
    asStrength: "وهو ما يعكس ثقافة مؤسسية راسخة تؤمن بالتطوير المستمر وعدم الاكتفاء بالمستوى الراهن من الأداء.",
    asWeakness: "إذ إن الشركات التي تتوقف عن التطوير تُصبح أهدافًا سهلة للمنافسين الأكثر حيوية وابتكارًا.",
  },
};

// ── English descriptions ───────────────────────────────────────────────────

const explorerModalDescriptionsEn: Record<string, ModalDesc> = {
  "explorers-modal-1": {
    asStrength: "reflecting a solid ability to identify challenges and understand the financial dimensions of business opportunities, giving you a clear advantage in distinguishing real opportunities.",
    asWeakness: "as discovering opportunities requires more than enthusiasm — it demands the ability to analyze challenges and understand the financial realities behind any business idea.",
  },
  "explorers-modal-2": {
    asStrength: "showing an ability to direct your focus toward clear objectives rather than entering the market in an unstructured way.",
    asWeakness: "as starting without a clear vision leads to scattered efforts and reduces your ability to distinguish genuine opportunities from misleading ones.",
  },
  "explorers-modal-3": {
    asStrength: "reflecting a good awareness of the importance of sequencing steps and organizing phases when approaching any business opportunity.",
    asWeakness: "as prior planning is what separates those who move confidently toward the market from those who stumble at the first steps due to the lack of a clear roadmap.",
  },
  "explorers-modal-4": {
    asStrength: "reflecting a good ability to visualize the identity of a business and understand key elements of visibility and differentiation.",
    asWeakness: "as brand identity is the first face any business presents to the market, and its weakness directly affects customer perception and trust.",
  },
  "explorers-modal-5": {
    asStrength: "a meaningful positive indicator of acceptable awareness of the regulatory and organizational aspects of business activity.",
    asWeakness: "as lack of knowledge about legal frameworks exposes any business to unforeseen risks that could halt its progress in its early stages.",
  },
  "explorers-modal-6": {
    asStrength: "meaning you have a good ability to leverage your relationships and available resources in service of your business goals.",
    asWeakness: "as successfully transitioning from market interest to seizing an opportunity depends greatly on the relationships, support sources, and resources you have.",
  },
  "explorers-modal-7": {
    asStrength: "revealing a conscious ability to weigh options and assess risks before moving from one stage to the next.",
    asWeakness: "as decision-making in a market environment requires tools for risk assessment and scenario planning before committing to any course of action.",
  },
  "explorers-modal-8": {
    asStrength: "meaning you have a good ability to convert ideas into practical, executable steps.",
    asWeakness: "as effective execution is the true bridge between an idea and a result — its weakness leads to lost opportunities even when the ideas are sound.",
  },
  "explorers-modal-9": {
    asStrength: "reflecting a good awareness of how to reach target audiences and identify appropriate channels for any business.",
    asWeakness: "as understanding marketing mechanisms and channels is fundamental to determining how well any business can reach its customers and build its presence.",
  },
  "explorers-modal-10": {
    asStrength: "a key skill reflecting your ability to handle numbers and understand the flow of money within any business.",
    asWeakness: "a foundational skill that must be developed early, as it affects the quality of estimation, decision-making, and the ability to distinguish good opportunities from burdensome ones.",
  },
  "explorers-modal-11": {
    asStrength: "indicating your ability to read financial performance and understand numerical indicators related to business activity.",
    asWeakness: "as the ability to read financial ratios and interpret accounting data elevates the quality of business decisions and reduces the likelihood of estimation errors.",
  },
  "explorers-modal-12": {
    asStrength: "reflecting a positive orientation toward continuous learning and a constant drive to improve personal and professional performance.",
    asWeakness: "as self-development is the true fuel that keeps an explorer on a path of sustainable growth and enhances the ability to adapt to market changes.",
  },
};

const entrepreneurModalDescriptionsEn: Record<string, ModalDesc> = {
  "entrepreneurs-modal-1": {
    asStrength: "indicating a good ability to read the market and identify suitable opportunities based on accumulated experience and conscious evaluation.",
    asWeakness: "as real opportunities are not discovered by intuition alone — they require a systematic approach to evaluation and the ability to link experience with market realities.",
  },
  "entrepreneurs-modal-2": {
    asStrength: "reflecting a good ability to view the business from a wider perspective than day-to-day operations, connecting current efforts to future growth directions.",
    asWeakness: "as strategic thinking is what determines the difference between a business that grows and one that stagnates at a certain level.",
  },
  "entrepreneurs-modal-3": {
    asStrength: "indicating an ability to translate plans into concrete, measurable actions on the ground.",
    asWeakness: "as the gap between planning and execution is what most derails an entrepreneur's journey and wastes efforts without tangible results.",
  },
  "entrepreneurs-modal-4": {
    asStrength: "indicating an ability to build a clear and distinctive image of your brand in the minds of customers and the target market.",
    asWeakness: "as brand identity is the silent message left by every product and every customer interaction, and its weakness affects the first impression.",
  },
  "entrepreneurs-modal-5": {
    asStrength: "an important aspect reflecting awareness of the importance of regulatory discipline in protecting the business and ensuring its continuity.",
    asWeakness: "an important area for protecting the business, reducing risks, and ensuring the integrity of practices across different stages of development.",
  },
  "entrepreneurs-modal-6": {
    asStrength: "reflecting an ability to manage available resources efficiently and direct them toward the priorities with the greatest impact on the growth journey.",
    asWeakness: "as wise resource management is what allows a business to weather pressure and expand when opportunities arise.",
  },
  "entrepreneurs-modal-7": {
    asStrength: "a core skill for entrepreneurs in assessing options, balancing alternatives, and making the right decision at the right time.",
    asWeakness: "as every wrong decision in an entrepreneurial environment costs time, money, and momentum — developing this skill reduces the cost of errors.",
  },
  "entrepreneurs-modal-8": {
    asStrength: "indicating a practical ability to handle workflow, organize tasks, and maintain the smooth flow of operations.",
    asWeakness: "as operational efficiency determines whether growth will improve profitability or multiply complexity and disorder.",
  },
  "entrepreneurs-modal-9": {
    asStrength: "reflecting an ability to understand the market and choose the right penetration approach to achieve desired reach and market share.",
    asWeakness: "as understanding market dynamics and choosing the correct entry point determines how quickly the business grows and retains its market share.",
  },
  "entrepreneurs-modal-10": {
    asStrength: "indicating an ability to control cash flow and manage accounting operations related to the business in an organized manner.",
    asWeakness: "as controlling financial operations is the primary guarantee of business sustainability and avoiding sudden cash flow crises.",
  },
  "entrepreneurs-modal-11": {
    asStrength: "indicating an ability to track financial performance, read indicators accurately, and make decisions based on real data.",
    asWeakness: "for its direct impact on performance control, understanding financial position, and making more accurate decisions with less reliance on guesswork.",
  },
  "entrepreneurs-modal-12": {
    asStrength: "reflecting a commitment to continuous improvement and not settling for the current level of performance or surrendering to routine.",
    asWeakness: "a vital area that helps entrepreneurs move from maintaining the business to expanding it and developing its opportunities more effectively.",
  },
};

const companiesModalDescriptionsEn: Record<string, ModalDesc> = {
  "companies-modal-1": {
    asStrength: "indicating the organization's ability to identify new business opportunities and convert them into real sources of growth.",
    asWeakness: "as limiting the company to its current base without actively seeking growth opportunities exposes it to the risk of gradual decline.",
  },
  "companies-modal-2": {
    asStrength: "indicating clarity in defining what distinguishes the organization from competitors and its ability to maintain that distinction.",
    asWeakness: "as the absence of a clear competitive advantage makes the organization vulnerable to market pressures and difficulty retaining customers.",
  },
  "companies-modal-3": {
    asStrength: "indicating systematic and organized management that enables the translation of strategy into executable and measurable plans.",
    asWeakness: "as weak planning turns resources into scattered efforts that don't lead to strategic results.",
  },
  "companies-modal-4": {
    asStrength: "reflecting a good investment in building institutional identity and strengthening brand presence in the market.",
    asWeakness: "as a weak brand makes it difficult to retain customers and reduces the ability to raise prices or expand into new markets.",
  },
  "companies-modal-5": {
    asStrength: "indicating commitment to regulatory and legal requirements, protecting the organization from legal risks.",
    asWeakness: "as neglecting legal compliance poses a direct threat to the organization's continuity and reputation.",
  },
  "companies-modal-6": {
    asStrength: "reflecting efficiency in deploying available resources and directing them toward the organization's strategic priorities.",
    asWeakness: "as poor resource management leads to waste that weakens competitive ability and narrows profit margins.",
  },
  "companies-modal-7": {
    asStrength: "revealing an ability to make thoughtful strategic decisions that account for variables and risks.",
    asWeakness: "as hasty or poorly-considered strategic decisions cost the organization losses that are difficult to recover from.",
  },
  "companies-modal-8": {
    asStrength: "indicating operational efficiency that enables delivering the service or product at high quality and controlled cost.",
    asWeakness: "as weak operational efficiency wastes resources and reduces the quality of customer experience and the organization's ability to expand.",
  },
  "companies-modal-9": {
    asStrength: "reflecting strategic awareness of how to reach target markets and strengthen marketing presence.",
    asWeakness: "as a weak marketing strategy reduces the organization's ability to acquire new customers and retain existing ones.",
  },
  "companies-modal-10": {
    asStrength: "indicating good financial control that enables tracking performance, controlling costs, and making data-driven decisions.",
    asWeakness: "as weak financial control exposes the organization to sudden liquidity crises and difficulty planning for growth.",
  },
  "companies-modal-11": {
    asStrength: "reflecting an ability to convert data into actionable insights and more accurate decisions.",
    asWeakness: "as organizations that don't analyze their performance accurately lose the ability to continuously improve and adapt to market changes.",
  },
  "companies-modal-12": {
    asStrength: "reflecting a deeply rooted organizational culture that believes in continuous development and doesn't settle for the current level of performance.",
    asWeakness: "as companies that stop developing become easy targets for more dynamic and innovative competitors.",
  },
};

// ─── Score level descriptions ─────────────────────────────────────────────────

function getScoreLevelAr(percentage: number, surveyType: string): { level: string; summary: string; recs: string } {
  if (surveyType === "explorers") {
    if (percentage < 40) return {
      level: "مستوى أولي يستدعي بناء قاعدة معرفية وتجريبية أشمل قبل الاقتراب من السوق بصورة جدية",
      summary: "معظم الأدوات الأساسية لفهم السوق لا تزال تحتاج إلى بناء. هذا لا يعني غياب الإمكانية، بل يعني أن الخطوات الأولى ينبغي أن تكون تعلمية وتجريبية قبل أن تكون تنفيذية.",
      recs: "ابدأ بتحديد مشكلة واحدة تراها في محيطك واكتب في ورقة: من يعاني منها؟ كيف يتعاملون معها الآن؟ ثم ابحث عن 3 مشاريع موجودة تحل نفس المشكلة وادرس كيف تعمل وكيف تكسب. اختر فرصة صغيرة لا تكلفك شيئاً لتجربتها — بيع خدمة بسيطة، أو عرض منتج على عدد محدود — والهدف ليس الربح بل تعلم كيف يتصرف السوق فعلاً.",
    };
    if (percentage < 55) return {
      level: "مستوى متوسط يعكس وجود أساس أولي واعد مع حاجة لتعميق الأدوات التحليلية والمالية",
      summary: "لديك فهم جزئي للسوق لكن القدرة على تقييم الفرصة بشكل موضوعي قبل الانتقال للتنفيذ تحتاج تطويراً. كثير من الأفكار تبدو جيدة حتى تكتب أرقامها على ورقة.",
      recs: "خذ أي فكرة تجارية تراودك الآن واكتب تقييمها على ورقة واحدة: من هو العميل بالتحديد؟ كم سيدفع؟ كم سيكلفك توصيل الخدمة له؟ ما ربحك من كل عملية؟ كرر هذا التمرين على 3 أفكار مختلفة. بعدها اختر الفكرة الأوضح وتحدث مع 5 أشخاص من الجمهور المستهدف لتتحقق من أن المشكلة حقيقية وليست مجرد افتراض.",
    };
    if (percentage < 70) return {
      level: "مستوى متوسط جيد يدل على أرضية صلبة مع حاجة للانتقال من التفكير إلى الاختبار الفعلي",
      summary: "أساسك جيد وفهمك للسوق أفضل من المتوسط. الفجوة الحقيقية الآن في الانتقال من التحليل إلى الاختبار الميداني — لأن كثيراً من الأسئلة لا تُجيب عنها الدراسة، بل السوق نفسه.",
      recs: "اختر الفرصة التي تشغل بالك وضعها في اختبار صغير: تحدث مع 10 أشخاص من جمهورك المستهدف واسألهم عن المشكلة، وكيف يحلونها حالياً، وكم يدفعون فعلاً. لا تبيع لهم الفكرة — فقط اسأل. دوّن ما تسمعه. ثم ضع جدولاً زمنياً لأسبوعين: الأول للبحث الميداني، الثاني لاتخاذ قرار المضي أو التعديل بناءً على ما سمعته.",
    };
    if (percentage < 85) return {
      level: "مستوى جيد مرتفع يكشف عن جاهزية واضحة وأدوات تحليلية متطورة",
      summary: "جاهزيتك عالية وقدرتك التحليلية متطورة. ما يعيق الانطلاق الآن غالباً هو انتظار اليقين التام — وهو شيء لا يوجد في السوق. القرار الصحيح لا يأتي من المزيد من التحليل، بل من الاختبار المدروس.",
      recs: "حدد الفرصة التي تريد اختبارها وضع لها جدولاً إجرائياً محدداً: الأسبوع الأول — تحديد الجمهور والتواصل المباشر معه. الثاني — عرض الفكرة أو الخدمة ورصد الاستجابة. الثالث — تسعير وتجربة أول صفقة أو عملية فعلية. الرابع — تقييم النتيجة والقرار بالمضي أو التعديل. نفّذ هذا الجدول بصرف النظر عن مستوى الاستعداد.",
    };
    return {
      level: "مستوى متقدم يؤهل صاحبه للانطلاق بثقة — التأخر الآن يُضيع الميزة المبنية",
      summary: "تمتلك جاهزية متقدمة وقدرة تحليلية عالية. الاستمرار في التقييم بدلاً من التنفيذ هو المخاطرة الوحيدة المتبقية — السوق الجيد لا ينتظر.",
      recs: "خذ قراراً واحداً محدداً هذا الأسبوع: ما الفرصة التي ستختبرها؟ ضع الموعد الأول للتنفيذ خلال 7 أيام من الآن. إن كانت فكرة — تحدث مع أول عميل محتمل. إن كانت شراكة — أرسل أول تواصل. إن كانت منتجاً — ضع أول نموذج مبسط. الخطوة الأولى هي الأصعب والأهم، وكل يوم تأخير له تكلفة.",
    };
  }

  if (surveyType === "entrepreneurs") {
    if (percentage < 40) return {
      level: "مستوى يستدعي مراجعة الأسس التشغيلية والمالية قبل التوسع أو اتخاذ قرارات كبرى",
      summary: "التقييم يشير إلى فجوات في بعض الممارسات الريادية الأساسية يمكن معالجتها من داخل العمل نفسه دون الحاجة للتوقف. البدء بالأرقام هو أسرع طريقة لفهم أين تكمن المشكلة الحقيقية.",
      recs: "ابدأ بورقة واحدة الآن: اكتب الإيراد الشهري، التكاليف الثابتة، التكاليف المتغيرة، الربح الصافي. إن لم تستطع كتابتها بسرعة، فهذا هو أول شيء تحتاج إصلاحه — ضع نظاماً بسيطاً لتتبع الأرقام أسبوعياً. بعدها حدد ثلاثة عملاء تكسب منهم أكثر واسأل لماذا هم تحديداً — الجواب سيخبرك أين تضاعف جهدك وأين تتوقف عن الهدر.",
    };
    if (percentage < 55) return {
      level: "مستوى متوسط يكشف عن خبرة حقيقية مع حاجة لتحويل الحدس إلى قرارات مبنية على بيانات",
      summary: "لديك مشروع يعمل وخبرة متراكمة، لكن بعض القرارات تُبنى على الحدس بدلاً من الأرقام. الفجوة الأكبر ليست في القدرة بل في المنهجية — واكتساب المنهجية لا يحتاج وقتاً طويلاً، بل قراراً بتغيير طريقة التفكير في القرارات.",
      recs: "اختر قراراً أجّلته أو تردد فيه مؤخراً في مشروعك. اكتب: ما الخيارات المتاحة؟ ما تكلفة كل خيار؟ ما العائد المتوقع من كل منها؟ ما الأسوأ الذي يمكن حدوثه في كل حالة؟ اتخذ القرار وطبقه، ثم قس نتيجته بعد 30 يوماً بمؤشر واحد واضح. كرر هذا النمط مع كل قرار مهم — ستلاحظ تحسناً ملموساً في دقة قراراتك خلال ثلاثة أشهر.",
    };
    if (percentage < 70) return {
      level: "مستوى متوسط جيد يدل على تجربة متينة — الفارق للمستوى التالي هو التفرغ للنمو بدلاً من التشغيل",
      summary: "مشروعك يعمل بشكل جيد وتمتلك أساساً قوياً. الفرق بين من يبقى في هذا المستوى ومن يتجاوزه هو القدرة على رفع البصر من التشغيل اليومي إلى بناء النمو — وهذا يبدأ بتحديد هدف واحد واضح والالتزام به.",
      recs: "حدد هدفاً واحداً محدداً للأشهر الثلاثة القادمة — ليس عاماً مثل 'أزيد المبيعات'، بل دقيقاً مثل 'أوصل لـ X عميل جديد بحلول تاريخ كذا' أو 'أخفض تكاليف التشغيل بنسبة X%'. قسّمه إلى خطوات أسبوعية مكتوبة. في نهاية كل أسبوع اسأل: هل تقدمنا؟ إن لا، ما الذي يعيق التقدم تحديداً؟ عالج العائق — لا تبدل الهدف.",
    };
    if (percentage < 85) return {
      level: "مستوى مرتفع يُبرز نضجاً ريادياً واضحاً — السؤال الآن ماذا تبني بعد ذلك",
      summary: "وصلت لمستوى نضج ريادي واضح وأدواتك التشغيلية والاستراتيجية متطورة. السؤال الحقيقي الآن ليس كيف تحسن ما هو موجود، بل ما الخطوة التوسعية التالية وكيف تختبرها بأقل مخاطرة ممكنة.",
      recs: "حدد خطة توسع واحدة محددة: هل ستدخل قطاعاً جديداً؟ تضيف منتجاً إضافياً؟ تفتح قناة بيع جديدة؟ خصص 60 يوماً لاختبار الفكرة بحجم صغير قبل الاستثمار الكبير — بميزانية محدودة وهدف واضح قابل للقياس. في نهاية الـ60 يوماً اتخذ القرار بناءً على الأرقام الفعلية لا التوقعات.",
    };
    return {
      level: "مستوى متميز — التحدي الحقيقي الآن هو الانضباط في الأولويات وعدم تشتيت الموارد",
      summary: "جاهزيتك الريادية متقدمة وتمتلك أدوات التفكير والتنفيذ اللازمة للوصول إلى المستوى التالي. التحدي الفعلي في هذه المرحلة ليس القدرة بل التركيز — لأن المشاريع المتميزة لا تنجح بالتشتت بل بالتركيز المتعمد.",
      recs: "اكتب قائمة بكل الفرص التوسعية التي تفكر فيها. صنّفها من الأعلى عائداً والأسرع تنفيذاً. اختر واحدة فقط وركز عليها كل الموارد لمدة ربع سنة كاملة. ضع مؤشراً واحداً تقيس به النجاح وراجعه شهرياً. بعد ربع السنة — سواء نجحت أو لم تنجح — ستكون لديك بيانات حقيقية تبني عليها القرار التالي.",
    };
  }

  // companies
  if (percentage < 40) return {
    level: "مستوى يُشير إلى فجوات مؤسسية تستحق المعالجة الفورية من داخل المنظومة",
    summary: "التقييم يكشف فجوات في الأسس المؤسسية يمكن معالجة كثير منها بقرارات تشغيلية داخلية دون انتظار. الخطوة الأولى هي توثيق ما يحدث فعلاً — لأن ما لا يُقاس لا يُحسَّن.",
    recs: "ابدأ بتوثيق 5 عمليات أساسية في شركتك كتابياً: من يفعل ماذا، متى، وكيف يُقاس النجاح. ثم ضع لكل قسم مؤشر أداء واحد تقيسه أسبوعياً — مبيعات، وقت تسليم، رضا عميل، أو أي مؤشر مناسب. بعد شهر واحد من القياس المنتظم ستظهر أكبر مصادر الهدر والخلل بوضوح، وعندها تُحدد أولويات التحسين بناءً على أرقام حقيقية لا تقديرات.",
  };
  if (percentage < 55) return {
    level: "مستوى متوسط يكشف عن ممارسات قائمة مع قصور تشغيلي يمكن تحديده وعلاجه داخلياً",
    summary: "المؤسسة لديها قاعدة عمل قائمة، لكن بعض الممارسات تسير بقصور تشغيلي لا يُكتشف إلا بالسؤال المباشر. تحديد هذه الممارسات قبل أن تتراكم تكاليفها هو القرار الأذكى في هذه المرحلة.",
    recs: "اجلس مع كل مسؤول قسم ساعة واحدة واسأله سؤالاً واحداً: ما أكبر شيء يُبطّئ عملك أو يأخذ وقتاً أكثر مما يجب؟ اجمع الإجابات وصنّفها من الأعلى تأثيراً على الإنتاجية أو التكلفة أو رضا العميل. اختر المشكلة الأعلى تأثيراً وخصص شهراً كاملاً لحلها فقط — مع تحديد المسؤول، والإجراء، والمؤشر الذي يثبت أن الحل نجح.",
  };
  if (percentage < 70) return {
    level: "مستوى متوسط جيد يعكس ممارسات ناضجة — الانتقال للمستوى التالي يبدأ بمضاعفة ما ينجح فعلاً",
    summary: "المؤسسة تعمل بكفاءة جيدة في أغلب جوانبها. الانتقال للمستوى التالي لا يأتي من إصلاح ما يفشل فقط، بل من التعرف على ما ينجح ومضاعفة الاستثمار فيه — وهذا يبدأ بتحليل بيانات الأداء الموجودة.",
    recs: "خذ تقرير المبيعات أو الإيرادات للأشهر الستة الماضية وابحث عن ثلاثة أنماط: ما أكثر المنتجات أو الخدمات ربحاً؟ ما القطاع أو الشريحة التي تعطي أعلى عائد؟ ما القناة التي تجلب أفضل عملاء بأقل تكلفة؟ ضع خطة لمدة 90 يوماً لمضاعفة الاستثمار في الناجح — بدلاً من توزيع الموارد على كل شيء بالتساوي.",
  };
  if (percentage < 85) return {
    level: "مستوى مرتفع يُبرز مؤسسة ناضجة — الوقت مناسب للمخاطرة المحسوبة في التوسع",
    summary: "المؤسسة في موقع تنافسي جيد وأداؤها مرتفع. هذا المستوى يُتيح المخاطرة المحسوبة في التوسع — لأن قاعدة العمل القوية الحالية تستطيع استيعاب تجارب جديدة دون أن تزعزع الاستقرار.",
    recs: "حدد قطاعاً أو منتجاً أو خدمة لم تستثمر فيها حتى الآن وضع اختباراً مصغراً في 60 يوماً: ميزانية محدودة ومحددة، هدف قابل للقياس، ومؤشر نجاح واحد واضح. في نهاية الـ60 يوماً اتخذ القرار بناءً على الأرقام — سواء بالتوسع أو بالإيقاف. التوسع بخطوات صغيرة محسوبة أفضل بكثير من قرار توسعي كبير دفعة واحدة.",
  };
  return {
    level: "مستوى متميز — التحدي الحقيقي هو قيادة التوسع مع الحفاظ على جودة الأداء",
    summary: "مؤسستك في مقدمة الأداء وتمتلك الأدوات والنضج المؤسسي للقيادة. التحدي الفعلي في هذه المرحلة هو ضمان أن التوسع لا يُضعف جودة ما بُني — وهذا يتطلب تخطيطاً إجرائياً واضحاً لا مجرد طموح.",
    recs: "ضع خطة توسع لمدة سنة بثلاثة محاور محددة قابلة للقياس — مثل: دخول سوق جديد بهدف إيراد محدد، أو إطلاق منتج إضافي، أو رفع هامش الربح بنسبة محددة من خلال تحسين كفاءة تشغيلية معينة. خصص لكل محور أهدافاً ربعية وراجعها شهرياً. القيادة السوقية لا تُحفظ بالثبات بل بالتقدم المنضبط.",
  };
}

function getScoreLevelEn(percentage: number, surveyType: string): { level: string; summary: string; recs: string } {
  if (surveyType === "explorers") {
    if (percentage < 40) return {
      level: "A foundational level — the priority now is learning through small experiments, not planning",
      summary: "Most of the core tools for understanding the market still need to be built. This doesn't mean a lack of potential — it means the first steps should be exploratory and learning-oriented before they become execution-oriented.",
      recs: "Start by identifying one problem you observe in your environment. Write on a single page: who is affected by it, how do they deal with it today, and what would they pay to solve it better? Then find 3 existing businesses solving a similar problem and study how they operate and earn. Finally, choose the smallest possible test you can run — offer a simple service to a small group — not to profit, but to learn how the market actually behaves.",
    };
    if (percentage < 55) return {
      level: "An average level with promising foundations — the gap is in evaluating opportunities objectively before acting",
      summary: "You have a partial understanding of the market, but the tools to assess opportunities financially and analytically need strengthening. Many ideas look promising until you write the numbers down.",
      recs: "Take any business idea you're currently considering and write its assessment on one page: Who exactly is the customer? What will they pay? What will it cost you to deliver? What is your profit per transaction? Repeat this for 3 different ideas. Then take the clearest one and talk to 5 people from your target audience to verify the problem is real — not just an assumption.",
    };
    if (percentage < 70) return {
      level: "A good intermediate level — the real gap now is moving from analysis to field testing",
      summary: "Your foundation is solid and your market understanding is above average. The real gap is in transitioning from analysis to field testing — because many questions can't be answered by research alone; the market itself provides the answers.",
      recs: "Take the opportunity that occupies your mind and run a small test: talk to 10 people from your target audience — ask about the problem, how they currently solve it, and what they actually pay. Don't pitch your idea; just ask and listen. Document what you hear. Then set a two-week schedule: week one for field research, week two for deciding to proceed or adjust based on what you learned.",
    };
    if (percentage < 85) return {
      level: "A good high level with strong analytical tools — waiting for perfect certainty is the only remaining risk",
      summary: "Your readiness is high and your analytical capability is strong. What typically delays action at this stage is waiting for total certainty — which doesn't exist in any market. The right decision doesn't come from more analysis; it comes from structured testing.",
      recs: "Identify the opportunity you want to test and build a specific action timeline: Week 1 — identify and directly contact your target audience. Week 2 — present the idea or service and measure the response. Week 3 — set a price and attempt the first real transaction. Week 4 — evaluate results and decide whether to proceed or adjust. Execute this plan regardless of how ready you feel.",
    };
    return {
      level: "An advanced level — delaying action now wastes the advantage you have already built",
      summary: "You have advanced readiness and high analytical capability. Continuing to assess instead of executing is the only remaining risk — good markets don't wait.",
      recs: "Make one specific decision this week: which opportunity will you test first? Set a date for the first execution step within 7 days. If it's an idea — talk to the first potential customer. If it's a partnership — send the first outreach. If it's a product — build the first simple prototype. The first step is the hardest and most important, and every day of delay has a real cost.",
    };
  }

  if (surveyType === "entrepreneurs") {
    if (percentage < 40) return {
      level: "A level calling for reviewing operational and financial foundations — fixable from within the business",
      summary: "The assessment points to gaps in some core entrepreneurial practices that can be addressed internally without stopping. Starting with the numbers is the fastest way to understand where the real problem lies.",
      recs: "Start with one page right now: write your monthly revenue, fixed costs, variable costs, and net profit. If you can't write these quickly, that's the first thing to fix — set up a simple system to track these numbers weekly. Then identify the three customers you earn the most from and ask yourself why specifically those three — the answer will tell you where to double your effort and where to stop wasting resources.",
    };
    if (percentage < 55) return {
      level: "An average level with real experience — the gap is converting intuition into data-driven decisions",
      summary: "You have a working business and accumulated experience, but some decisions are based on intuition rather than numbers. The biggest gap is not in capability but in methodology — and developing that methodology doesn't take long; it takes a decision to change how you approach decisions.",
      recs: "Choose one decision you've been postponing or are uncertain about in your business. Write: what are the available options? What is the cost of each? What is the expected return from each? What is the worst that could happen in each case? Make the decision and implement it, then measure its outcome after 30 days using one clear metric. Repeat this pattern with every significant decision — you'll notice a measurable improvement in decision quality within three months.",
    };
    if (percentage < 70) return {
      level: "A good intermediate level with solid experience — the step up is shifting focus from operating to growing",
      summary: "Your business is running well and you have a strong foundation. The difference between staying at this level and moving beyond it is the ability to look beyond daily operations and build deliberate growth — and that starts with setting one clear target and committing to it.",
      recs: "Set one specific goal for the next three months — not something vague like 'increase sales', but precise like 'reach X new customers by this date' or 'reduce operating costs by X%'. Break it into weekly written steps. At the end of each week ask: did we move forward? If not, what specifically is blocking progress? Address the obstacle — don't change the goal.",
    };
    if (percentage < 85) return {
      level: "A high level with clear entrepreneurial maturity — the question now is what to build next",
      summary: "You've reached a clear level of entrepreneurial maturity with strong operational and strategic tools. The real question now isn't how to improve what exists — it's what the next expansion step is and how to test it with minimum risk.",
      recs: "Define one specific expansion plan: will you enter a new segment? Add a product? Open a new sales channel? Allocate 60 days to test the idea at a small scale before major investment — with a limited budget, a clear goal, and one measurable success indicator. At the end of 60 days, make your decision based on actual numbers, not expectations.",
    };
    return {
      level: "An outstanding level — the real challenge now is disciplined focus, not capability",
      summary: "Your entrepreneurial readiness is advanced and you have the thinking and execution tools needed for the next level. The real challenge at this stage isn't capability — it's focus. Outstanding businesses don't succeed by spreading thin; they succeed by deliberate concentration.",
      recs: "Write a list of every expansion opportunity you're considering. Rank them by highest return and fastest execution. Choose only one and direct all resources toward it for a full quarter. Set one metric to measure success and review it monthly. After the quarter — whether it succeeds or not — you'll have real data to build the next decision on.",
    };
  }

  // companies
  if (percentage < 40) return {
    level: "A level indicating institutional gaps — many are fixable through internal operational decisions",
    summary: "The assessment reveals gaps in institutional foundations that can largely be addressed through internal decisions. The first step is documenting what actually happens — because what isn't measured can't be improved.",
    recs: "Start by documenting 5 core processes in your organization in writing: who does what, when, and how success is measured. Then assign each department one performance indicator to track weekly — sales, delivery time, customer satisfaction, or whatever fits. After one month of consistent tracking, the biggest sources of waste and dysfunction will become visible — and you can then prioritize improvements based on real numbers, not estimates.",
  };
  if (percentage < 55) return {
    level: "An average level with operational shortfalls that can be identified and fixed internally",
    summary: "The organization has an established base, but some practices are running with hidden operational shortfalls that are only uncovered by asking the right questions. Identifying these before their costs compound is the smartest move at this stage.",
    recs: "Sit with each department head for one hour and ask one question: what's the single biggest thing slowing your work or taking more time than it should? Collect the answers and rank them by impact on productivity, cost, or customer experience. Choose the highest-impact problem and dedicate one full month to solving only that — with a clear owner, a clear action, and a clear metric that proves the solution worked.",
  };
  if (percentage < 70) return {
    level: "A good intermediate level with mature practices — the next step is doubling down on what already works",
    summary: "The organization performs well across most areas. Moving to the next level doesn't come only from fixing what fails — it also comes from identifying what succeeds and investing more in it. That starts with analyzing the performance data you already have.",
    recs: "Pull your sales or revenue data from the last six months and look for three patterns: which products or services are most profitable? Which segment or audience generates the highest return? Which channel brings the best customers at the lowest cost? Build a 90-day plan to double investment in what's already working — instead of spreading resources equally across everything.",
  };
  if (percentage < 85) return {
    level: "A high level with a mature organization — the conditions are right for calculated expansion",
    summary: "The organization is in a strong competitive position with high performance. This level enables calculated risk-taking in expansion — because a strong existing base can absorb new experiments without destabilizing operations.",
    recs: "Identify a segment, product, or service you haven't invested in yet and design a 60-day pilot: a defined limited budget, one measurable goal, and one clear success indicator. At the end of 60 days, make your decision based on the numbers — whether to scale or stop. Expanding through small, calculated steps is far better than one large expansion decision made all at once.",
  };
  return {
    level: "An outstanding level — the challenge now is leading expansion without compromising what's been built",
    summary: "Your organization is at the forefront of performance with the tools and maturity needed for leadership. The real challenge at this stage is ensuring that expansion doesn't dilute the quality of what's been built — and that requires clear procedural planning, not just ambition.",
    recs: "Build a one-year expansion plan around three specific, measurable pillars — for example: entering a new market with a defined revenue target, launching an additional product, or improving operational efficiency to raise margin by a specific percentage. Assign quarterly targets to each pillar and review monthly. Market leadership isn't maintained by standing still — it's maintained by disciplined, consistent progress.",
  };
}

// ─── Main generator ───────────────────────────────────────────────────────────

export interface ReportInput {
  surveyType: string; // explorers | entrepreneurs | companies
  totalScore: number;
  modalScores: { modalId: string; score: number }[];
  language: "ar" | "en";
}

export interface ReportItem {
  title: string;
  description: string;
}

export interface StructuredReport {
  intro: string;
  scoreNote: string;
  level: string;
  summary: string;
  recs: string;
  strengths: ReportItem[];
  weaknesses: ReportItem[];
}

export function generateReportData(input: ReportInput): StructuredReport | null {
  const { surveyType, totalScore, modalScores, language } = input;
  const percentage = (totalScore / 360) * 100;
  const percentageStr = percentage.toFixed(2);

  const isAr = language === "ar";

  const arDescMap =
    surveyType === "explorers" ? explorerModalDescriptions
    : surveyType === "entrepreneurs" ? entrepreneurModalDescriptions
    : companiesModalDescriptions;

  const enDescMap =
    surveyType === "explorers" ? explorerModalDescriptionsEn
    : surveyType === "entrepreneurs" ? entrepreneurModalDescriptionsEn
    : companiesModalDescriptionsEn;

  const descMap = isAr ? arDescMap : enDescMap;

  const sorted = [...modalScores].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);
  const bottom3 = sorted.slice(-3).reverse();

  const { level, summary, recs } = isAr
    ? getScoreLevelAr(percentage, surveyType)
    : getScoreLevelEn(percentage, surveyType);

  const intro = isAr
    ? surveyType === "explorers"
      ? "نشكر لكم اهتمامكم بالمشاركة في اختبار قياس الجاهزية التجارية لمستكشف السوق. هذا التقييم لا يهدف إلى الحكم على مشروع محدد أو فكرة قائمة، وإنما صُمّم لقياس مستوى الجاهزية الشخصية والمهنية للدخول إلى عالم السوق، وفهم الفرص، واستكشاف المسارات التجارية المناسبة بصورة أكثر وعيًا واتزانًا."
      : surveyType === "entrepreneurs"
      ? "نشكر لكم اهتمامكم بالمشاركة في اختبار قياس القوة التجارية. وقد صُمّم هذا التقييم لقياس مجموعة من المهارات والقدرات التي تؤثر مباشرة في نجاح رائد الأعمال، وفي قدرته على إدارة العمل، واتخاذ القرارات، وتطوير النشاط التجاري على أسس أكثر وعيًا وتنظيمًا."
      : "نشكر لكم اهتمامكم بالمشاركة في اختبار قياس الأداء المؤسسي. هذا التقييم صُمّم لقياس مستوى النضج المؤسسي في مختلف جوانب العمل التجاري، وتحديد مواطن القوة والفرص التطويرية بصورة شاملة ومنهجية."
    : surveyType === "explorers"
      ? "Thank you for participating in the Market Explorer Business Readiness Assessment. This evaluation is not designed to judge a specific project or existing idea, but rather to measure your personal and professional readiness to enter the business world, understand opportunities, and explore appropriate business paths with greater awareness and balance."
      : surveyType === "entrepreneurs"
      ? "Thank you for participating in the Business Strength Assessment. This evaluation is designed to measure the skills and capabilities that directly impact an entrepreneur's success — the ability to manage operations, make decisions, and develop the business on a more informed and organized basis."
      : "Thank you for participating in the Institutional Performance Assessment. This evaluation is designed to measure the level of institutional maturity across different aspects of business activity and identify strengths and development opportunities in a comprehensive and systematic way.";

  const scoreNote = isAr
    ? surveyType === "entrepreneurs"
      ? `أظهرت نتيجتكم ${totalScore} من 360 بنسبة ${percentageStr}%`
      : `النتيجة العامة: ${totalScore} من 360 (${percentageStr}%)`
    : `Overall Score: ${totalScore} / 360 (${percentageStr}%)`;

  const strengths: ReportItem[] = top3.map((item) => ({
    title: getModalName(item.modalId, language),
    description: descMap[item.modalId]?.asStrength || "",
  }));

  const weaknesses: ReportItem[] = bottom3.map((item) => ({
    title: getModalName(item.modalId, language),
    description: descMap[item.modalId]?.asWeakness || "",
  }));

  return { intro, scoreNote, level, summary, recs, strengths, weaknesses };
}

// kept for backwards compatibility
export function generateReportText(input: ReportInput): string {
  const data = generateReportData(input);
  if (!data) return "";
  return [
    data.intro,
    data.scoreNote,
    data.level,
    data.strengths.map((s) => `${s.title}: ${s.description}`).join("\n"),
    data.weaknesses.map((w) => `${w.title}: ${w.description}`).join("\n"),
    data.summary,
    data.recs,
  ].join("\n\n");
}

function getModalName(modalId: string, language: "ar" | "en" = "ar"): string {
  const ar: Record<string, string> = {
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
  };
  const en: Record<string, string> = {
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
  };
  return (language === "en" ? en[modalId] : ar[modalId]) || modalId;
}
