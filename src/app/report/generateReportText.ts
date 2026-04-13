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
      level: "مستوى أولي يستدعي العمل على بناء قاعدة معرفية وتجريبية أشمل قبل الاقتراب من السوق بصورة جدية",
      summary: "التقييم العام يشير إلى أن المستفيد في مرحلة التأسيس المعرفي، ويحتاج إلى استثمار أعمق في فهم أساسيات السوق والأعمال التجارية قبل الانطلاق الفعلي. هذه المرحلة لا تعني القصور بقدر ما تعني أن الرحلة في بدايتها وأن ما يُبنى الآن سيُشكّل أساس النجاح المستقبلي.",
      recs: "التوصيات في هذه المرحلة تتمحور حول الاستثمار في التعلم الموجّه عبر برامج ريادة الأعمال، وحضور ورش العمل التدريبية، والتعرف على نماذج أعمال مختلفة من خلال القراءة والاحتكاك بأصحاب التجارب الناجحة. كما يُنصح بمحاولة تجارب استكشافية صغيرة ومنخفضة المخاطر تُتيح بناء الخبرة العملية بصورة تدريجية ومنهجية.",
    };
    if (percentage < 55) return {
      level: "مستوى متوسط يعكس وجود أساس أولي يمكن البناء عليه مع الحرص على تطوير الجوانب التي لا تزال تحتاج إلى تعزيز",
      summary: "التقييم العام يشير إلى أن المستفيد يمتلك مقومات أولية واعدة تؤهله لأن يكون قريبًا من فهم السوق والدخول إليه بوعي أفضل من الشخص العادي، إلا أن جاهزيته ما تزال بحاجة إلى تعميق في الجوانب العملية، خصوصًا ما يتعلق بالتحليل المالي، وقراءة المخاطر، وبناء العلاقات والموارد.",
      recs: "التوصيات العامة في هذه المرحلة تتمثل في توسيع الاطلاع على نماذج الأعمال المختلفة، وتنمية الفهم المالي الأساسي، والتدرب على تحليل الفرص من أكثر من زاوية، إلى جانب بناء شبكة علاقات مهنية أوسع. كما يُستحسن أن يخوض المستفيد تجارب استكشافية بسيطة ومدروسة أو جلسات توجيه مهني.",
    };
    if (percentage < 70) return {
      level: "مستوى متوسط جيد من الجاهزية، بما يدل على وجود أساس مناسب يمكن البناء عليه، مع حاجة واضحة إلى تطوير بعض الجوانب المكملة",
      summary: "التقييم العام يشير إلى أن المستفيد يمتلك مقومات جيدة تجعله في موقع متقدم من مستكشفي السوق، وأن لديه أرضية صلبة تُمكّنه من الانطلاق بخطوات أكثر ثقة. غير أن تحسين بعض الجوانب المشار إليها سيُمكّنه من رفع مستوى جاهزيته إلى الدرجة التي تجعله قادرًا على قراءة الفرص بدقة أعلى.",
      recs: "يُوصى بالتركيز على الجوانب التي أشار إليها التقييم كمجالات تطوير، من خلال برامج تدريبية متخصصة أو جلسات توجيه مهني. كما يُستحسن الاستمرار في تعميق الجوانب القوية لأنها تُشكّل ركيزة يمكن الاعتماد عليها في رحلة استكشاف السوق.",
    };
    if (percentage < 85) return {
      level: "مستوى جيد مرتفع يكشف عن جاهزية واضحة واستعداد مناسب للتعامل مع متطلبات السوق واستكشاف الفرص بصورة أكثر ثقة",
      summary: "التقييم العام يُشير إلى أن المستفيد يمتلك جاهزية تجارية جيدة تؤهله للدخول إلى السوق بصورة واعية ومدروسة. والجوانب التي لا تزال تحتاج إلى تطوير لا تُشكّل عائقًا بقدر ما تُمثّل فرصة لرفع مستوى الأداء إلى مرحلة التميز الكامل.",
      recs: "يُوصى بالاستثمار في تطوير الجوانب المُشار إليها لرفع مستوى الجاهزية من الجيد إلى الممتاز. كما يُنصح بالانتقال من مرحلة الاستكشاف إلى مرحلة التطبيق الفعلي من خلال تجارب مدروسة ومحسوبة المخاطر.",
    };
    return {
      level: "مستوى عالٍ ومتقدم من الجاهزية يؤهل صاحبه للانطلاق بثقة عالية نحو السوق",
      summary: "التقييم العام يُشير إلى جاهزية تجارية متقدمة تضع المستفيد في مقدمة مستكشفي السوق. هذا المستوى المرتفع من الوعي والاستعداد يُهيئه لاتخاذ قرارات تجارية راسخة والانطلاق نحو فرص حقيقية بثقة عالية.",
      recs: "في هذه المرحلة، يُوصى بتحويل هذه الجاهزية إلى خطوات عملية ملموسة، سواء بالبدء في استكشاف فرصة محددة أو بالانخراط في برامج ريادية أو شراكات تجارية. كما يُنصح بالحرص على تغذية هذا المستوى من الوعي باستمرار من خلال التعلم والتطبيق والمراجعة الدورية.",
    };
  }

  if (surveyType === "entrepreneurs") {
    if (percentage < 40) return {
      level: "مستوى يستدعي مراجعة الأسس وتقوية الجوانب الجوهرية قبل التوسع أو اتخاذ قرارات تجارية كبرى",
      summary: "التقييم العام يشير إلى وجود فجوات في بعض المهارات والممارسات الريادية الأساسية تستحق الاهتمام والمعالجة المدروسة. هذه الفجوات لا تنفي القدرات الموجودة، لكنها تُنبّه إلى أهمية تقوية الأساس قبل التوسع.",
      recs: "يُوصى بمراجعة الممارسات الحالية وتحديد الأولويات التطويرية، والاستعانة بمستشارين أعمال أو برامج تدريبية متخصصة تُعالج الجوانب التي أشار إليها التقييم.",
    };
    if (percentage < 55) return {
      level: "مستوى متوسط يكشف عن قدرات ريادية قائمة مع حاجة واضحة لتعزيز بعض الجوانب الجوهرية",
      summary: "التقييم العام يشير إلى أن صاحب المشروع يمتلك رصيدًا ريادياً جيداً اكتسبه من تجربته، غير أن تطوير بعض الجوانب المشار إليها سيُحسّن بشكل ملحوظ من كفاءة المشروع وقدرته على النمو المستدام.",
      recs: "يُوصى بالتركيز على المجالات التي أشار إليها التقييم كأولويات تطوير، مع إجراء مراجعة دورية للاستراتيجية والعمليات وقياس مؤشرات الأداء بصورة منتظمة.",
    };
    if (percentage < 70) return {
      level: "مستوى متوسط جيد من الجاهزية الريادية يدل على تجربة حقيقية وقدرات قائمة مع مجال للتطوير والتحسين",
      summary: "التقييم العام يُشير إلى أن رائد الأعمال يمتلك أساسًا ريادياً متيناً أهّله للوصول إلى هذه المرحلة من مسيرته. والمضي في تطوير الجوانب المُشار إليها سيُمكّنه من الانتقال من مرحلة التشغيل الجيد إلى مرحلة النمو المتسارع والمستدام.",
      recs: "يُوصى بتوجيه الجهد التطويري نحو الجوانب التي كشف عنها التقييم، مع الحرص على ترجمة التطوير إلى إجراءات عملية قابلة للقياس. كما يُنصح بالاستمرار في تعزيز نقاط القوة لأنها ركيزة النجاح الحالي.",
    };
    if (percentage < 85) return {
      level: "مستوى جيد مرتفع يُبرز نضجًا ريادياً واضحًا وجاهزية عالية للتوسع والنمو",
      summary: "التقييم العام يُشير إلى أن رائد الأعمال يمتلك جاهزية ريادية متقدمة تجعله في موقع قوي لتحقيق نمو مستدام. والمجالات التي لا تزال تحتاج إلى تطوير إذا عُولجت ستُعلي من مستوى الأداء وتُعزز من القدرة التنافسية.",
      recs: "يُوصى باستثمار هذا المستوى المرتفع في اتخاذ خطوات توسعية مدروسة، مع مواصلة تطوير الجوانب المُشار إليها. الشراكات الاستراتيجية وبرامج التسريع قد تُضيف قيمة مضاعفة في هذه المرحلة.",
    };
    return {
      level: "مستوى متميز من الجاهزية الريادية يُؤهل صاحبه للقيادة والتوسع بثقة عالية وأدوات متكاملة",
      summary: "التقييم العام يُشير إلى جاهزية ريادية عالية تضع رائد الأعمال في مقدمة أقرانه. هذا المستوى يُهيئه لاتخاذ قرارات توسعية جريئة ومدروسة والانتقال إلى مراحل نمو أكثر طموحًا.",
      recs: "يُوصى بتوجيه هذه الجاهزية نحو استراتيجيات توسع واضحة، سواء في الأسواق أو المنتجات أو الشراكات. كما يُنصح بالحرص على نقل هذا الوعي الريادي إلى الفريق وبناء ثقافة مؤسسية تُستدام بها هذه المستويات من الأداء.",
    };
  }

  // companies
  if (percentage < 40) return {
    level: "مستوى يُشير إلى حاجة مؤسسية فعلية لمراجعة الممارسات الأساسية وتقوية البنية التشغيلية",
    summary: "التقييم العام يُبرز وجود فجوات مؤسسية تستحق المعالجة المنهجية والعاجلة. معالجة هذه الفجوات بأسلوب استراتيجي مدروس سيُحسّن من الأداء العام للمؤسسة ويُعزز من قدرتها التنافسية.",
    recs: "يُوصى بإجراء مراجعة شاملة للممارسات المؤسسية الحالية وتحديد الأولويات التطويرية بناءً على الأثر المتوقع وسرعة التنفيذ. الاستعانة بخبراء استشاريين متخصصين في المجالات المُشار إليها قد يُسرّع التحسن.",
  };
  if (percentage < 55) return {
    level: "مستوى متوسط يكشف عن ممارسات مؤسسية قائمة مع وجود مجال واضح للتطوير والتحسين",
    summary: "التقييم العام يُشير إلى أن المؤسسة تمتلك قاعدة عمل قائمة لكنها تحتاج إلى تعزيز منهجي في الجوانب المُشار إليها لتُحسّن من مستوى أدائها وتُعزز من قدرتها على النمو المستدام.",
    recs: "يُوصى بوضع خطة تطوير مؤسسي واضحة تُحدد الأهداف والمؤشرات والمسؤوليات، مع مراجعة دورية للتحقق من التقدم المُحرز.",
  };
  if (percentage < 70) return {
    level: "مستوى متوسط جيد يعكس ممارسات مؤسسية ناضجة مع فرص واضحة للارتقاء بالأداء",
    summary: "التقييم العام يُشير إلى مؤسسة ذات أداء جيد تمتلك ممارسات ناضجة في أغلب مجالاتها. والمضي في تطوير الجوانب المُشار إليها سيُحسّن من مستوى الكفاءة المؤسسية ويُعزز من الميزة التنافسية.",
    recs: "يُوصى بتبني نهج التحسين المستمر في الجوانب المُشار إليها، وقياس الأداء بمؤشرات واضحة تُتيح تتبع التقدم وتُحفز الفريق على بلوغ مستويات أعلى.",
  };
  if (percentage < 85) return {
    level: "مستوى جيد مرتفع يُبرز مؤسسة ناضجة وجاهزة للتوسع والمنافسة القوية في السوق",
    summary: "التقييم العام يُشير إلى مؤسسة ذات أداء مرتفع وممارسات متقدمة تجعلها في موقع تنافسي جيد. والمجالات التي لا تزال تحتاج إلى تطوير إذا عُولجت ستُوصل المؤسسة إلى مرحلة التميز المؤسسي.",
    recs: "يُوصى باستثمار هذا المستوى المرتفع في مبادرات توسعية استراتيجية، مع مواصلة الرفع من مستوى الجوانب المُشار إليها لتُحقق المؤسسة التميز الشامل في مجالها.",
  };
  return {
    level: "مستوى متميز يُعكس مؤسسة عالية الأداء قادرة على قيادة السوق والمنافسة على أعلى المستويات",
    summary: "التقييم العام يُشير إلى مؤسسة ذات أداء متميز وممارسات رائدة تضعها في مقدمة منافسيها. هذا المستوى يُهيئها لتصبح مرجعًا في مجالها وقيادة حركة التطور في سوقها.",
    recs: "يُوصى بتوجيه هذه القدرات المؤسسية نحو أهداف توسع طموحة وبناء شراكات استراتيجية تُضاعف الأثر. كما يُنصح بنقل هذه الثقافة المؤسسية الرائدة إلى كل مستويات الفريق لضمان استمرارها وتطورها.",
  };
}

function getScoreLevelEn(percentage: number, surveyType: string): { level: string; summary: string; recs: string } {
  if (surveyType === "explorers") {
    if (percentage < 40) return {
      level: "A foundational level that calls for building broader knowledge and experience before seriously approaching the market",
      summary: "The assessment indicates you are at the knowledge-building stage and need deeper investment in understanding market fundamentals before launching. This stage doesn't indicate a shortcoming — it means the journey is just beginning, and what is built now will form the foundation of future success.",
      recs: "Focus on directed learning through entrepreneurship programs, training workshops, and exposure to different business models through reading and interaction with experienced entrepreneurs. Consider small, low-risk exploratory ventures to build practical experience gradually.",
    };
    if (percentage < 55) return {
      level: "An average level reflecting a promising foundation that can be built upon, with areas that still need strengthening",
      summary: "The assessment indicates you have promising initial foundations that put you ahead of the average person in understanding the market. However, your readiness still needs deepening — particularly in financial analysis, risk assessment, and building relationships and resources.",
      recs: "Broaden your exposure to different business models, develop basic financial understanding, and practice analyzing opportunities from multiple angles. Build a wider professional network and consider mentoring sessions or guided exploratory experiences.",
    };
    if (percentage < 70) return {
      level: "A good intermediate level of readiness, indicating a suitable foundation to build on with clear need to develop some complementary areas",
      summary: "The assessment indicates you have good foundations that place you in an advanced position among market explorers. Improving the identified areas will enable you to read opportunities with greater accuracy and seize them with greater efficiency.",
      recs: "Focus on the development areas identified through specialized training or mentoring. Continue strengthening your strong points as they form the foundation for your market exploration journey.",
    };
    if (percentage < 85) return {
      level: "A good high level revealing clear readiness and appropriate preparation to handle market requirements confidently",
      summary: "The assessment indicates you have good business readiness that qualifies you to enter the market in a conscious and measured way. Areas that still need development are opportunities to elevate performance to full excellence.",
      recs: "Invest in developing the identified areas to raise your readiness from good to excellent. Transition from exploration to actual application through calculated, risk-conscious experiences, and leverage your professional network to validate opportunities.",
    };
    return {
      level: "A high and advanced level of readiness that qualifies you to launch confidently into the market",
      summary: "The assessment indicates advanced business readiness placing you at the forefront of market explorers. This high level of awareness prepares you for solid business decisions and pursuing real opportunities with full confidence.",
      recs: "Convert this readiness into concrete practical steps — whether by exploring a specific opportunity or engaging in entrepreneurial programs or business partnerships. Continuously feed this level of awareness through learning, application, and periodic review.",
    };
  }

  if (surveyType === "entrepreneurs") {
    if (percentage < 40) return {
      level: "A level calling for reviewing the fundamentals and strengthening core areas before expanding or making major business decisions",
      summary: "The assessment indicates gaps in some fundamental entrepreneurial skills and practices that deserve careful attention. These gaps don't negate existing capabilities — they highlight the importance of strengthening the foundation before expanding.",
      recs: "Review current practices, identify development priorities, and seek business advisors or specialized training programs that address the areas identified. Regular performance evaluation with clear metrics helps track improvement and ensure continuity.",
    };
    if (percentage < 55) return {
      level: "An average level revealing existing entrepreneurial capabilities with a clear need to strengthen some core areas",
      summary: "The assessment indicates you have a good entrepreneurial foundation built from your experience. Developing the identified areas will significantly improve your business efficiency and capacity for sustainable growth.",
      recs: "Focus on the areas identified as development priorities, conduct periodic reviews of strategy and operations, and measure performance indicators regularly. Entrepreneurial communities and acceleration programs help exchange experiences and accelerate growth.",
    };
    if (percentage < 70) return {
      level: "A good intermediate level of entrepreneurial readiness reflecting genuine experience and established capabilities with room for improvement",
      summary: "The assessment indicates you have a solid entrepreneurial foundation that has brought you to this stage of your journey. Continuing to develop the identified areas will enable you to transition from good operations to accelerated, sustainable growth.",
      recs: "Direct development efforts toward the areas the assessment revealed and translate development into practical, measurable actions. Continue strengthening your strengths as they are the foundation of current success and the launchpad for the next level.",
    };
    if (percentage < 85) return {
      level: "A good high level highlighting clear entrepreneurial maturity and high readiness for expansion and growth",
      summary: "The assessment indicates advanced entrepreneurial readiness placing you in a strong position for sustainable growth. Areas that still need development, if addressed, will elevate performance and strengthen competitive advantage.",
      recs: "Invest this high level in making measured expansion steps while continuing to develop the identified areas. Strategic partnerships and acceleration programs can add multiplied value at this stage.",
    };
    return {
      level: "An outstanding level of entrepreneurial readiness that qualifies you for leadership and expansion with full confidence",
      summary: "The assessment indicates high entrepreneurial readiness placing you at the forefront of your peers. This level prepares you for bold, measured expansion decisions and transition to more ambitious growth stages.",
      recs: "Direct this readiness toward clear expansion strategies — whether in markets, products, or partnerships. Transfer this entrepreneurial awareness to your team and build an organizational culture that sustains these performance levels.",
    };
  }

  // companies
  if (percentage < 40) return {
    level: "A level indicating a genuine institutional need to review core practices and strengthen the operational structure",
    summary: "The assessment highlights institutional gaps that deserve systematic and urgent attention. Addressing these gaps strategically will improve the organization's overall performance and strengthen its competitive position.",
    recs: "Conduct a comprehensive review of current institutional practices and identify development priorities based on expected impact and implementation speed. Specialized consultants in the identified areas can accelerate improvement and reduce the cost of errors.",
  };
  if (percentage < 55) return {
    level: "An average level revealing existing institutional practices with clear room for development and improvement",
    summary: "The assessment indicates the organization has an established base but needs systematic strengthening in the identified areas to improve performance and capacity for sustainable growth.",
    recs: "Set a clear institutional development plan with defined objectives, indicators, and responsibilities, with periodic review to verify progress.",
  };
  if (percentage < 70) return {
    level: "A good intermediate level reflecting mature institutional practices with clear opportunities to elevate performance",
    summary: "The assessment indicates an organization with good performance and mature practices in most areas. Continuing to develop the identified areas will improve institutional efficiency and strengthen competitive advantage.",
    recs: "Adopt a continuous improvement approach in the identified areas and measure performance with clear indicators that allow tracking progress and motivating the team to reach higher levels.",
  };
  if (percentage < 85) return {
    level: "A good high level highlighting a mature organization ready for expansion and strong market competition",
    summary: "The assessment indicates an organization with high performance and advanced practices that place it in a good competitive position. The areas that still need development, if addressed, will bring the organization to institutional excellence.",
    recs: "Invest this high level in strategic expansion initiatives while continuing to raise the level of identified areas for comprehensive excellence in your field.",
  };
  return {
    level: "An outstanding level reflecting a high-performance organization capable of leading the market and competing at the highest levels",
    summary: "The assessment indicates an organization with outstanding performance and leading practices that place it at the forefront of competitors. This level positions it to become a reference in its field and lead the direction of development in its market.",
    recs: "Direct these institutional capabilities toward ambitious expansion goals and strategic partnerships that multiply impact. Transfer this leading organizational culture to all team levels to ensure its continuity and development.",
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
