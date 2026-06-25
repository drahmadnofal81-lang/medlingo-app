import { useState, useEffect } from "react";

// ── Main Categories ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "anatomy",      label: "🫀 تشريح",       en: "Anatomy",      color: "#E63946", desc: "مقسّم بالجهاز" },
  { id: "physiology",   label: "⚡ فسيولوجيا",   en: "Physiology",   color: "#2A9D8F", desc: "مرتّب بالموضوع" },
  { id: "biochemistry", label: "🧪 بيوكيمياء",   en: "Biochemistry", color: "#F4A261", desc: "جزيئات وتفاعلات" },
  { id: "histology",    label: "🔬 هيستولوجيا",  en: "Histology",    color: "#7B2D8B", desc: "أنسجة وخلايا" },
  { id: "bodysystems",  label: "🏥 أنظمة الجسم", en: "Body Systems",  color: "#1A6B9A", desc: "٨ أنظمة رئيسية" },
  { id: "organs",       label: "🫁 أعضاء الجسم", en: "Body Organs",   color: "#6B4226", desc: "أعضاء رئيسية" },
  { id: "pharmacology", label: "💊 فارماكولوجي",  en: "Pharmacology",  color: "#5C4D91", desc: "أدوية وتأثيرات" },
  { id: "pathology",    label: "🔴 باثولوجي",     en: "Pathology",     color: "#B22222", desc: "أمراض وآليات" },
];

// ── Sub-tabs per category ────────────────────────────────────────────────────
const SUBTABS = {
  anatomy: [
    { id: "cardiac",      label: "🫀 القلب", en: "Cardiac" },
    { id: "skeletal",     label: "🦴 العظام", en: "Skeletal" },
    { id: "neuro",        label: "🧠 الجهاز العصبي", en: "Neuro" },
    { id: "respiratory",  label: "🫁 الجهاز التنفسي", en: "Respiratory" },
    { id: "abdominal",    label: "🫃 البطن", en: "Abdominal" },
    { id: "muscle",        label: "💪 العضلات", en: "Muscle" },
  ],
  physiology: [
    { id: "cardiac",      label: "🫀 قلبي", en: "Cardiac" },
    { id: "renal",        label: "🫘 كلوي", en: "Renal" },
    { id: "neuro",        label: "🧠 عصبي", en: "Neuro" },
    { id: "respiratory",  label: "🫁 تنفسي", en: "Respiratory" },
    { id: "endocrine",    label: "⚗️ هرموني", en: "Endocrine" },
  ],
  biochemistry: [
    { id: "metabolism",   label: "🔋 استقلاب", en: "Metabolism" },
    { id: "molecular",    label: "🧬 جزيئي", en: "Molecular" },
    { id: "proteins",     label: "🔗 بروتينات", en: "Proteins" },
    { id: "enzymes",      label: "⚙️ إنزيمات", en: "Enzymes" },
    { id: "carbohydrates", label: "🍬 كربوهيدرات", en: "Carbohydrates" },
    { id: "lipids",        label: "🧈 دهون", en: "Lipids" },
  ],
  histology: [
    { id: "epithelial",   label: "🧱 ظهاري", en: "Epithelial" },
    { id: "connective",   label: "🕸️ ضام", en: "Connective" },
    { id: "nervous",      label: "🧠 عصبي", en: "Nervous" },
    { id: "muscular",     label: "💪 عضلي", en: "Muscular" },
    { id: "cell",          label: "🔵 الخلية", en: "Cell" },
  ],
  organs: [
    { id: "heart",    label: "🫀 القلب",         en: "Heart" },
    { id: "lungs",    label: "🫁 الرئتان",        en: "Lungs" },
    { id: "liver",    label: "🟤 الكبد",          en: "Liver" },
    { id: "kidneys",  label: "🫘 الكليتان",       en: "Kidneys" },
    { id: "brain",    label: "🧠 الدماغ",         en: "Brain" },
    { id: "skin",     label: "🩹 الجلد",          en: "Skin" },
  ],
  pharmacology: [
    { id: "analgesics",    label: "💊 مسكنات",        en: "Analgesics" },
    { id: "antibiotics",   label: "🦠 مضادات حيوية", en: "Antibiotics" },
    { id: "cardiovascular",label: "🫀 قلبية وعائية",  en: "Cardiovascular" },
    { id: "cns_drugs",     label: "🧠 جهاز عصبي",    en: "CNS Drugs" },
    { id: "hormonal",      label: "⚗️ هرمونية",       en: "Hormonal" },
  ],
  pathology: [
    { id: "inflammation",  label: "🔥 الالتهاب",      en: "Inflammation" },
    { id: "neoplasia",     label: "🔬 الأورام",        en: "Neoplasia" },
    { id: "cardiovascular",label: "🫀 قلبية وعائية",  en: "Cardiovascular" },
    { id: "infectious",    label: "🦠 معدية",          en: "Infectious" },
    { id: "genetic",       label: "🧬 وراثية",         en: "Genetic" },
  ],
  bodysystems: [
    { id: "git",          label: "🫃 الجهاز الهضمي", en: "GI Tract" },
    { id: "cardiovascular", label: "🫀 القلب والأوعية", en: "Cardiovascular" },
    { id: "renal",        label: "🫘 الجهاز البولي", en: "Renal" },
    { id: "cns",          label: "🧠 الجهاز العصبي", en: "CNS" },
    { id: "respiratory",  label: "🫁 الجهاز التنفسي", en: "Respiratory" },
    { id: "endocrine",    label: "⚗️ الغدد الصماء", en: "Endocrine" },
    { id: "musculoskeletal", label: "🦴 العضلات والعظام", en: "Musculoskeletal" },
    { id: "reproductive", label: "🔬 الجهاز التناسلي", en: "Reproductive" },
  ],
};


// ── Terms ────────────────────────────────────────────────────────────────────
const TERMS = {
  anatomy: {
    cardiac: [
      { en: "Myocardium", ar: "عضلة القلب", example: "The myocardium is the muscular wall of the heart." },
      { en: "Pericardium", ar: "غلاف القلب", example: "The pericardium is the fibrous sac surrounding the heart." },
      { en: "Endocardium", ar: "الشغاف الداخلي", example: "The endocardium lines the inner chambers of the heart." },
      { en: "Aorta", ar: "الشريان الأورطي", example: "The aorta is the largest artery in the body." },
      { en: "Mitral Valve", ar: "الصمام التاجي", example: "The mitral valve separates the left atrium from the left ventricle." },
      { en: "Coronary Artery", ar: "الشريان التاجي", example: "Coronary arteries supply blood to the heart muscle." },
      { en: "Left Ventricle", ar: "البطين الأيسر", example: "The left ventricle pumps oxygenated blood to the body." },
      { en: "Right Atrium", ar: "الأذين الأيمن", example: "The right atrium receives deoxygenated blood from the body." },
      { en: "Pulmonary Artery", ar: "الشريان الرئوي", example: "The pulmonary artery carries deoxygenated blood to the lungs." },
      { en: "Sinoatrial Node", ar: "العقدة الجيبية الأذينية", example: "The sinoatrial node is the natural pacemaker of the heart." },
    ],
    skeletal: [
      { en: "Femur", ar: "عظمة الفخذ", example: "The femur is the longest bone in the body." },
      { en: "Tibia", ar: "عظمة القصبة", example: "The tibia is the larger bone of the lower leg." },
      { en: "Humerus", ar: "عظمة العضد", example: "The humerus connects the shoulder to the elbow." },
      { en: "Periosteum", ar: "سمحاق العظم", example: "The periosteum covers and protects the bone surface." },
      { en: "Cortical Bone", ar: "العظم القشري", example: "Cortical bone forms the hard outer layer of bones." },
      { en: "Medullary Cavity", ar: "تجويف النخاع", example: "The medullary cavity contains bone marrow." },
      { en: "Vertebra", ar: "الفقرة", example: "The vertebrae form the spinal column protecting the spinal cord." },
      { en: "Scapula", ar: "لوح الكتف", example: "The scapula connects the humerus with the clavicle." },
      { en: "Patella", ar: "الرضفة", example: "The patella protects the knee joint from the front." },
      { en: "Sternum", ar: "عظمة القص", example: "The sternum connects to the ribs forming the chest wall." },
    ],
    neuro: [
      { en: "Cerebellum", ar: "المخيخ", example: "The cerebellum controls balance and coordination." },
      { en: "Hippocampus", ar: "الحُصين", example: "The hippocampus plays a key role in memory formation." },
      { en: "Corpus Callosum", ar: "الجسم الجاسئ", example: "The corpus callosum connects the two brain hemispheres." },
      { en: "Thalamus", ar: "المهاد", example: "The thalamus relays sensory signals to the cortex." },
      { en: "Medulla Oblongata", ar: "النخاع المستطيل", example: "The medulla oblongata controls breathing and heart rate." },
      { en: "Cerebral Cortex", ar: "القشرة المخية", example: "The cerebral cortex is responsible for higher brain functions." },
      { en: "Hypothalamus", ar: "تحت المهاد", example: "The hypothalamus regulates temperature, hunger, and hormones." },
      { en: "Frontal Lobe", ar: "الفص الجبهي", example: "The frontal lobe controls personality and voluntary movement." },
      { en: "Spinal Cord", ar: "الحبل الشوكي", example: "The spinal cord transmits signals between the brain and body." },
      { en: "Brainstem", ar: "جذع الدماغ", example: "The brainstem controls vital functions like breathing and consciousness." },
    ],
    respiratory: [
      { en: "Trachea", ar: "القصبة الهوائية", example: "The trachea connects the larynx to the bronchi." },
      { en: "Alveoli", ar: "الحويصلات الهوائية", example: "Alveoli are tiny air sacs where gas exchange occurs." },
      { en: "Diaphragm", ar: "الحجاب الحاجز", example: "The diaphragm is the main muscle of breathing." },
      { en: "Bronchioles", ar: "القصيبات الهوائية الدقيقة", example: "Bronchioles are small airways leading to the alveoli." },
      { en: "Pleura", ar: "غشاء الجنب", example: "The pleura is a membrane that surrounds the lungs." },
      { en: "Hilum", ar: "باب الرئة", example: "The hilum is where vessels and bronchi enter the lung." },
      { en: "Larynx", ar: "الحنجرة", example: "The larynx produces sound and guards the airway." },
      { en: "Epiglottis", ar: "لسان المزمار", example: "The epiglottis prevents food from entering the airway." },
      { en: "Bronchus", ar: "القصبة الهوائية الرئيسية", example: "Each bronchus leads air into one lung." },
      { en: "Pulmonary Capillaries", ar: "الشعيرات الرئوية", example: "Pulmonary capillaries surround alveoli for gas exchange." },
    ],
    abdominal: [
      { en: "Liver", ar: "الكبد", example: "The liver filters blood and produces bile." },
      { en: "Pancreas", ar: "البنكرياس", example: "The pancreas produces insulin and digestive enzymes." },
      { en: "Kidneys", ar: "الكليتان", example: "The kidneys filter blood and produce urine." },
      { en: "Spleen", ar: "الطحال", example: "The spleen filters blood and supports immune function." },
      { en: "Stomach", ar: "المعدة", example: "The stomach digests food using acid and enzymes." },
      { en: "Small Intestine", ar: "الأمعاء الدقيقة", example: "The small intestine absorbs most nutrients from food." },
      { en: "Large Intestine", ar: "الأمعاء الغليظة", example: "The large intestine absorbs water and forms stool." },
      { en: "Gallbladder", ar: "المرارة", example: "The gallbladder stores bile produced by the liver." },
      { en: "Adrenal Gland", ar: "الغدة الكظرية", example: "The adrenal glands produce adrenaline and cortisol." },
      { en: "Appendix", ar: "الزائدة الدودية", example: "The appendix is a small pouch attached to the large intestine." },
    ],
    muscle: [
      { en: "Biceps Brachii", ar: "العضلة ذات الرأسين", example: "The biceps brachii flexes the elbow and supinates the forearm." },
      { en: "Triceps Brachii", ar: "العضلة ذات الثلاثة رؤوس", example: "The triceps brachii extends the elbow joint." },
      { en: "Quadriceps", ar: "العضلة رباعية الرؤوس", example: "The quadriceps extend the knee and are vital for walking." },
      { en: "Hamstrings", ar: "عضلات الجهة الخلفية للفخذ", example: "The hamstrings flex the knee and extend the hip." },
      { en: "Gastrocnemius", ar: "عضلة الساق", example: "The gastrocnemius plantarflexes the foot and flexes the knee." },
      { en: "Deltoid", ar: "العضلة الدالية", example: "The deltoid abducts the arm at the shoulder joint." },
      { en: "Trapezius", ar: "العضلة شبه المنحرفة", example: "The trapezius elevates and retracts the scapula." },
      { en: "Pectoralis Major", ar: "العضلة الصدرية الكبرى", example: "The pectoralis major adducts and medially rotates the arm." },
      { en: "Latissimus Dorsi", ar: "العضلة الظهرية العريضة", example: "The latissimus dorsi extends and adducts the arm." },
      { en: "Diaphragm", ar: "الحجاب الحاجز", example: "The diaphragm is the primary muscle of respiration." },
    ],
  },

  physiology: {
    cardiac: [
      { en: "Action Potential", ar: "جهد الفعل", example: "An action potential triggers each heartbeat." },
      { en: "Depolarization", ar: "إزالة الاستقطاب", example: "Depolarization occurs when sodium ions rush into the cell." },
      { en: "Repolarization", ar: "إعادة الاستقطاب", example: "Repolarization restores the resting membrane potential." },
      { en: "Cardiac Output", ar: "الناتج القلبي", example: "Cardiac output equals heart rate times stroke volume." },
      { en: "Stroke Volume", ar: "حجم الضربة", example: "Stroke volume is the blood ejected per heartbeat." },
      { en: "Tachycardia", ar: "تسارع ضربات القلب", example: "Tachycardia is a heart rate above 100 bpm." },
      { en: "Bradycardia", ar: "بطء ضربات القلب", example: "Bradycardia is a resting heart rate below 60 bpm." },
      { en: "Preload", ar: "الحمل المسبق", example: "Preload is the ventricular filling pressure before contraction." },
      { en: "Afterload", ar: "الحمل اللاحق", example: "Afterload is the resistance the heart pumps against." },
      { en: "Frank-Starling Law", ar: "قانون فرانك-ستارلينج", example: "Greater stretch of cardiac muscle leads to stronger contraction." },
    ],
    renal: [
      { en: "Glomerular Filtration", ar: "الترشيح الكبيبي", example: "Glomerular filtration is the first step of urine formation." },
      { en: "Tubular Reabsorption", ar: "إعادة امتصاص أنبوبي", example: "Tubular reabsorption reclaims glucose and amino acids." },
      { en: "Osmosis", ar: "التناضح", example: "Osmosis drives water reabsorption in the collecting duct." },
      { en: "GFR", ar: "معدل الترشيح الكبيبي", example: "Normal GFR is about 125 mL/min in healthy adults." },
      { en: "Aldosterone", ar: "الألدوستيرون", example: "Aldosterone promotes sodium reabsorption in the kidney." },
      { en: "ADH", ar: "الهرمون المضاد للإدرار", example: "ADH increases water reabsorption in the collecting duct." },
      { en: "Tubular Secretion", ar: "الإفراز الأنبوبي", example: "Tubular secretion removes waste products into the filtrate." },
      { en: "Countercurrent Mechanism", ar: "آلية التيار المعاكس", example: "The countercurrent mechanism concentrates urine." },
      { en: "Juxtaglomerular Apparatus", ar: "الجهاز المجاور للكبيبة", example: "The JGA regulates blood pressure and GFR." },
      { en: "Renin", ar: "الرينين", example: "Renin is released when blood pressure drops." },
    ],
    neuro: [
      { en: "Resting Potential", ar: "جهد الراحة", example: "The resting membrane potential is about -70 mV." },
      { en: "Synaptic Transmission", ar: "النقل التشابكي", example: "Synaptic transmission passes signals between neurons." },
      { en: "Neurotransmitter", ar: "الناقل العصبي", example: "Acetylcholine is a key neurotransmitter at synapses." },
      { en: "Myelin Conduction", ar: "توصيل ميليني", example: "Myelinated fibers conduct impulses faster via saltatory conduction." },
      { en: "Reflex Arc", ar: "قوس المنعكس", example: "A reflex arc allows rapid involuntary responses." },
      { en: "Blood-Brain Barrier", ar: "الحاجز الدموي الدماغي", example: "The blood-brain barrier protects the CNS from pathogens." },
      { en: "Summation", ar: "التجميع", example: "Summation occurs when multiple signals combine to reach threshold." },
      { en: "Inhibitory Postsynaptic Potential", ar: "جهد ما بعد التشابك التثبيطي", example: "IPSP hyperpolarizes the postsynaptic membrane." },
      { en: "Excitatory Postsynaptic Potential", ar: "جهد ما بعد التشابك التنشيطي", example: "EPSP depolarizes the postsynaptic membrane toward threshold." },
      { en: "Neuroplasticity", ar: "مرونة الجهاز العصبي", example: "Neuroplasticity allows the brain to reorganize after injury." },
    ],
    respiratory: [
      { en: "Tidal Volume", ar: "حجم المد", example: "Tidal volume is the air inhaled with each normal breath." },
      { en: "Vital Capacity", ar: "السعة الحيوية", example: "Vital capacity is the maximum air exhaled after full inhalation." },
      { en: "Gas Exchange", ar: "تبادل الغازات", example: "Gas exchange occurs at the alveolar-capillary membrane." },
      { en: "Hypoxia", ar: "نقص الأكسجين", example: "Hypoxia stimulates erythropoietin secretion." },
      { en: "Compliance", ar: "مطاوعة الرئة", example: "Lung compliance measures how easily the lungs expand." },
      { en: "Surfactant", ar: "الفاعل بالسطح", example: "Surfactant reduces surface tension in the alveoli." },
      { en: "Dead Space", ar: "الفراغ الميت", example: "Dead space is the volume of air that doesn't reach the alveoli." },
      { en: "Hypercapnia", ar: "ارتفاع ثاني أكسيد الكربون", example: "Hypercapnia stimulates the respiratory center to increase breathing." },
      { en: "Minute Ventilation", ar: "التهوية الدقيقة", example: "Minute ventilation is tidal volume times respiratory rate." },
      { en: "Oxygen Dissociation Curve", ar: "منحنى تفكك الأكسجين", example: "The oxygen dissociation curve shows hemoglobin saturation vs O2 pressure." },
    ],
    endocrine: [
      { en: "Homeostasis", ar: "التوازن الداخلي", example: "Homeostasis is maintained by hormonal feedback loops." },
      { en: "Negative Feedback", ar: "تغذية راجعة سلبية", example: "Negative feedback keeps hormone levels within range." },
      { en: "Insulin", ar: "الأنسولين", example: "Insulin lowers blood glucose by promoting cellular uptake." },
      { en: "Cortisol", ar: "كورتيزول", example: "Cortisol is released in response to stress." },
      { en: "Vasodilation", ar: "توسع الأوعية", example: "Vasodilation lowers blood pressure by widening vessels." },
      { en: "Thyroid Hormone", ar: "هرمون الغدة الدرقية", example: "Thyroid hormone regulates metabolic rate." },
      { en: "Glucagon", ar: "الجلوكاجون", example: "Glucagon raises blood glucose during fasting." },
      { en: "Positive Feedback", ar: "تغذية راجعة إيجابية", example: "Positive feedback amplifies a response, as in childbirth." },
      { en: "Oxytocin", ar: "الأوكسيتوسين", example: "Oxytocin stimulates uterine contractions during labor." },
      { en: "Receptor Downregulation", ar: "تنظيم هبوطي للمستقبل", example: "Downregulation reduces cell sensitivity to a hormone." },
    ],
  },

  biochemistry: {
    metabolism: [
      { en: "ATP", ar: "ثلاثي فوسفات الأدينوزين", example: "ATP is the main energy currency of the cell." },
      { en: "Glycolysis", ar: "تحلل الغلوكوز", example: "Glycolysis breaks glucose into pyruvate in the cytoplasm." },
      { en: "Krebs Cycle", ar: "دورة كريبس", example: "The Krebs cycle generates NADH in the mitochondria." },
      { en: "Oxidative Phosphorylation", ar: "الفسفرة التأكسدية", example: "Oxidative phosphorylation produces most cellular ATP." },
      { en: "Gluconeogenesis", ar: "توليد الغلوكوز", example: "Gluconeogenesis synthesizes glucose from non-carbohydrate sources." },
      { en: "Beta Oxidation", ar: "أكسدة بيتا", example: "Beta oxidation breaks down fatty acids to produce acetyl-CoA." },
      { en: "Glycogenolysis", ar: "تحلل الجليكوجين", example: "Glycogenolysis breaks down glycogen to release glucose." },
      { en: "Lipogenesis", ar: "تكوين الدهون", example: "Lipogenesis converts excess glucose into fatty acids." },
      { en: "Acetyl-CoA", ar: "أسيتيل كوإنزيم أ", example: "Acetyl-CoA is the key entry molecule into the Krebs cycle." },
      { en: "NADH", ar: "نيكوتيناميد أدينين ثنائي النوكليوتيد", example: "NADH carries electrons to the electron transport chain." },
    ],
    molecular: [
      { en: "DNA Replication", ar: "تضاعف الحمض النووي", example: "DNA replication copies the genome before cell division." },
      { en: "Transcription", ar: "النسخ", example: "Transcription copies DNA into mRNA." },
      { en: "Translation", ar: "الترجمة", example: "Translation converts mRNA into protein at ribosomes." },
      { en: "Codon", ar: "الكودون", example: "Each codon is a triplet of nucleotides coding for an amino acid." },
      { en: "Mutation", ar: "الطفرة", example: "A point mutation changes a single nucleotide in the DNA." },
      { en: "Epigenetics", ar: "فوق الجينوم", example: "Epigenetics studies heritable changes not in DNA sequence." },
      { en: "mRNA", ar: "الحمض النووي الريبوزي المرسال", example: "mRNA carries genetic information from DNA to ribosomes." },
      { en: "tRNA", ar: "الحمض النووي الريبوزي الناقل", example: "tRNA brings amino acids to the ribosome during translation." },
      { en: "Promoter Region", ar: "المنطقة المحفزة", example: "The promoter region is where RNA polymerase binds to start transcription." },
      { en: "Splicing", ar: "الربط", example: "Splicing removes introns and joins exons in pre-mRNA." },
    ],
    proteins: [
      { en: "Protein Synthesis", ar: "تخليق البروتين", example: "Protein synthesis occurs at ribosomes via mRNA." },
      { en: "Hemoglobin", ar: "هيموغلوبين", example: "Hemoglobin carries oxygen in red blood cells." },
      { en: "Albumin", ar: "ألبومين", example: "Albumin maintains oncotic pressure in the blood." },
      { en: "Collagen", ar: "كولاجين", example: "Collagen is the most abundant protein in the human body." },
      { en: "Receptor Protein", ar: "بروتين مستقبل", example: "Receptor proteins bind hormones to trigger cell responses." },
      { en: "Immunoglobulin", ar: "غلوبولين مناعي", example: "Immunoglobulins are antibodies produced by B cells." },
      { en: "Denaturation", ar: "تمسخ البروتين", example: "Denaturation unfolds a protein, destroying its function." },
      { en: "Peptide Bond", ar: "الرابطة الببتيدية", example: "A peptide bond links amino acids together in a protein chain." },
      { en: "Primary Structure", ar: "البنية الأولية", example: "The primary structure is the amino acid sequence of a protein." },
      { en: "Tertiary Structure", ar: "البنية الثلاثية", example: "Tertiary structure is the 3D folding of a protein chain." },
    ],
    enzymes: [
      { en: "Enzyme", ar: "إنزيم", example: "Enzymes are biological catalysts that speed up reactions." },
      { en: "Active Site", ar: "الموقع الفعال", example: "The active site is where the substrate binds the enzyme." },
      { en: "Substrate", ar: "الركيزة", example: "The substrate is the molecule acted upon by an enzyme." },
      { en: "Inhibitor", ar: "مثبط", example: "A competitive inhibitor blocks the enzyme active site." },
      { en: "Cofactor", ar: "عامل مساعد", example: "Many enzymes require a cofactor like zinc or magnesium." },
      { en: "Km (Michaelis)", ar: "ثابت ميخايليس", example: "Km measures substrate concentration for half-maximal activity." },
      { en: "Allosteric Regulation", ar: "التنظيم الألوستيري", example: "Allosteric regulation changes enzyme shape to alter activity." },
      { en: "Isoenzyme", ar: "إنزيم متماثل", example: "Isoenzymes are different forms of an enzyme with the same function." },
      { en: "Zymogen", ar: "زيموجين", example: "Zymogens are inactive enzyme precursors activated by cleavage." },
      { en: "Turnover Number", ar: "عدد الدوران", example: "Turnover number is how many substrate molecules one enzyme processes per second." },
    ],
    carbohydrates: [
      { en: "Glucose", ar: "الغلوكوز", example: "Glucose is the primary fuel source for most cells." },
      { en: "Glycogen", ar: "الجليكوجين", example: "Glycogen is the storage form of glucose in liver and muscle." },
      { en: "Fructose", ar: "الفركتوز", example: "Fructose is a monosaccharide found in fruits and honey." },
      { en: "Galactose", ar: "الجالاكتوز", example: "Galactose combines with glucose to form lactose in milk." },
      { en: "Sucrose", ar: "السكروز", example: "Sucrose is a disaccharide of glucose and fructose." },
      { en: "Lactose", ar: "اللاكتوز", example: "Lactose is the main carbohydrate in mammalian milk." },
      { en: "Starch", ar: "النشا", example: "Starch is the main dietary carbohydrate from plant sources." },
      { en: "Cellulose", ar: "السيلولوز", example: "Cellulose forms the structural component of plant cell walls." },
      { en: "Pentose Phosphate Pathway", ar: "مسار فوسفات البنتوز", example: "The pentose phosphate pathway produces NADPH and ribose-5-phosphate." },
      { en: "Glycosidic Bond", ar: "الرابطة الجليكوسيدية", example: "Glycosidic bonds link monosaccharides together in polysaccharides." },
    ],
    lipids: [
      { en: "Triglyceride", ar: "ثلاثي الغليسريد", example: "Triglycerides are the main form of stored fat in the body." },
      { en: "Phospholipid", ar: "الفوسفوليبيد", example: "Phospholipids form the bilayer of all cell membranes." },
      { en: "Cholesterol", ar: "الكوليسترول", example: "Cholesterol is essential for membrane fluidity and steroid synthesis." },
      { en: "Fatty Acid", ar: "الحمض الدهني", example: "Fatty acids are the building blocks of most lipids." },
      { en: "HDL", ar: "البروتين الدهني عالي الكثافة", example: "HDL transports cholesterol from tissues back to the liver." },
      { en: "LDL", ar: "البروتين الدهني منخفض الكثافة", example: "Elevated LDL is associated with atherosclerosis risk." },
      { en: "Sphingomyelin", ar: "السفينغوميلين", example: "Sphingomyelin is a major component of the myelin sheath." },
      { en: "Lipolysis", ar: "تحلل الدهون", example: "Lipolysis breaks triglycerides into glycerol and fatty acids." },
      { en: "Ketone Bodies", ar: "أجسام الكيتون", example: "Ketone bodies are produced from fatty acids during fasting." },
      { en: "Eicosanoids", ar: "الإيكوسانويدات", example: "Eicosanoids include prostaglandins that mediate inflammation." },
    ],
  },

  histology: {
    epithelial: [
      { en: "Epithelium", ar: "النسيج الظهاري", example: "Epithelium lines the surfaces of organs and cavities." },
      { en: "Goblet Cell", ar: "خلية كأسية", example: "Goblet cells secrete mucus to protect epithelial surfaces." },
      { en: "Stratified Squamous", ar: "طلائي حرشفي طبقي", example: "Stratified squamous epithelium lines the skin and esophagus." },
      { en: "Microvilli", ar: "أهداب دقيقة", example: "Microvilli increase surface area for absorption in the gut." },
      { en: "Tight Junction", ar: "وصلة ضيقة", example: "Tight junctions seal the space between epithelial cells." },
      { en: "Basement Membrane", ar: "الغشاء القاعدي", example: "The basement membrane anchors epithelium to connective tissue." },
      { en: "Simple Columnar", ar: "أسطواني بسيط", example: "Simple columnar epithelium lines the stomach and intestines." },
      { en: "Pseudostratified", ar: "طلائي كاذب الطبقات", example: "Pseudostratified epithelium lines the respiratory tract." },
      { en: "Transitional Epithelium", ar: "ظهارة انتقالية", example: "Transitional epithelium lines the bladder and can stretch." },
      { en: "Cilia", ar: "أهداب", example: "Cilia in the airways sweep mucus and debris upward." },
    ],
    connective: [
      { en: "Connective Tissue", ar: "النسيج الضام", example: "Connective tissue supports and binds other tissues." },
      { en: "Hyaline Cartilage", ar: "غضروف زجاجي", example: "Hyaline cartilage covers articular surfaces of bones." },
      { en: "Collagen Fiber", ar: "ألياف كولاجينية", example: "Collagen fibers provide tensile strength to connective tissue." },
      { en: "Mast Cell", ar: "خلية بدينية", example: "Mast cells release histamine during allergic reactions." },
      { en: "Fibroblast", ar: "الخلية الليفية", example: "Fibroblasts produce collagen and extracellular matrix components." },
      { en: "Adipocyte", ar: "خلية دهنية", example: "Adipocytes store fat and regulate energy balance." },
      { en: "Elastic Fiber", ar: "ألياف مرنة", example: "Elastic fibers allow tissues to recoil after stretching." },
      { en: "Macrophage", ar: "بلعم كبير", example: "Macrophages engulf pathogens and dead cells." },
      { en: "Ground Substance", ar: "المادة الأرضية", example: "Ground substance fills the space between cells and fibers." },
      { en: "Osteoclast", ar: "ناقض العظم", example: "Osteoclasts break down bone tissue during remodeling." },
    ],
    nervous: [
      { en: "Neuron", ar: "خلية عصبية", example: "A neuron is the basic functional unit of the nervous system." },
      { en: "Myelin Sheath", ar: "غمد الميلين", example: "The myelin sheath insulates nerve fibers and speeds conduction." },
      { en: "Astrocyte", ar: "خلية نجمية", example: "Astrocytes support neurons and maintain the blood-brain barrier." },
      { en: "Synapse", ar: "المشبك", example: "Synapses are junctions where neurons communicate." },
      { en: "Axon", ar: "المحور", example: "The axon transmits electrical signals away from the cell body." },
      { en: "Oligodendrocyte", ar: "خلية قليلة التغصنات", example: "Oligodendrocytes produce myelin in the CNS." },
      { en: "Schwann Cell", ar: "خلية شوان", example: "Schwann cells produce myelin in the peripheral nervous system." },
      { en: "Dendrite", ar: "التغصن", example: "Dendrites receive signals from other neurons." },
      { en: "Node of Ranvier", ar: "عقدة رانفييه", example: "Nodes of Ranvier allow saltatory conduction along myelinated axons." },
      { en: "Nissl Body", ar: "جسيم نيسل", example: "Nissl bodies are rough ER clusters in the neuron soma." },
    ],
    muscular: [
      { en: "Sarcomere", ar: "الساركومير", example: "The sarcomere is the basic contractile unit of muscle." },
      { en: "Myofibril", ar: "الليف العضلي", example: "Myofibrils contain the contractile proteins actin and myosin." },
      { en: "Smooth Muscle", ar: "عضلة ملساء", example: "Smooth muscle lines hollow organs like the GIT and bladder." },
      { en: "Cardiac Muscle", ar: "عضلة قلبية", example: "Cardiac muscle is striated and involuntary." },
      { en: "Intercalated Disc", ar: "قرص متخلل", example: "Intercalated discs connect cardiac muscle cells electrically." },
      { en: "Actin", ar: "أكتين", example: "Actin is the thin filament in muscle sarcomeres." },
      { en: "Myosin", ar: "ميوسين", example: "Myosin is the thick filament that pulls actin during contraction." },
      { en: "T-Tubule", ar: "الأنبوب T", example: "T-tubules transmit action potentials deep into muscle fibers." },
      { en: "Sarcoplasmic Reticulum", ar: "الشبكة الساركوبلازمية", example: "The sarcoplasmic reticulum stores and releases calcium for contraction." },
      { en: "Mitosis", ar: "الانقسام غير المباشر", example: "Mitosis produces two identical daughter cells." },
    ],
    cell: [
      { en: "Cell Membrane", ar: "غشاء الخلية", example: "The cell membrane controls what enters and exits the cell." },
      { en: "Nucleus", ar: "النواة", example: "The nucleus contains the cell's genetic material." },
      { en: "Mitochondria", ar: "الميتوكوندريا", example: "Mitochondria generate ATP through oxidative phosphorylation." },
      { en: "Endoplasmic Reticulum", ar: "الشبكة الإندوبلازمية", example: "The rough ER synthesizes and transports proteins." },
      { en: "Golgi Apparatus", ar: "جهاز جولجي", example: "The Golgi apparatus packages proteins for secretion." },
      { en: "Lysosome", ar: "الجسيم الحال", example: "Lysosomes digest waste materials and cellular debris." },
      { en: "Cytoskeleton", ar: "الهيكل الخلوي", example: "The cytoskeleton maintains cell shape and enables movement." },
      { en: "Ribosome", ar: "الريبوسوم", example: "Ribosomes translate mRNA into protein chains." },
      { en: "Centriole", ar: "المريكز", example: "Centrioles organise the mitotic spindle during cell division." },
      { en: "Peroxisome", ar: "الجسيم الپيروكسي", example: "Peroxisomes break down fatty acids and detoxify harmful molecules." },
    ],
  },

  bodysystems: {
    git: [
      { en: "Peristalsis", ar: "حركة دودية", example: "Peristalsis propels food through the digestive tract." },
      { en: "Gastric Acid", ar: "حمض المعدة", example: "Gastric acid helps digest proteins and kills bacteria." },
      { en: "Bile", ar: "الصفراء", example: "Bile emulsifies fats in the small intestine." },
      { en: "Villus", ar: "الزغب", example: "Villi increase the surface area for nutrient absorption." },
      { en: "Pyloric Sphincter", ar: "عضلة البواب", example: "The pyloric sphincter controls gastric emptying." },
      { en: "Hepatic Portal Vein", ar: "الوريد البابي الكبدي", example: "The hepatic portal vein carries absorbed nutrients to the liver." },
      { en: "Pepsin", ar: "البيبسين", example: "Pepsin is an enzyme that breaks down proteins in the stomach." },
      { en: "Amylase", ar: "الأميليز", example: "Salivary amylase begins starch digestion in the mouth." },
      { en: "Ileocecal Valve", ar: "الصمام اللفائفي الأعوري", example: "The ileocecal valve controls flow from small to large intestine." },
      { en: "Enteric Nervous System", ar: "الجهاز العصبي المعوي", example: "The enteric nervous system controls GIT motility independently." },
    ],
    cardiovascular: [
      { en: "Systole", ar: "انقباض القلب", example: "Systole is the contraction phase of the cardiac cycle." },
      { en: "Diastole", ar: "انبساط القلب", example: "Diastole is the relaxation phase when chambers fill with blood." },
      { en: "Blood Pressure", ar: "ضغط الدم", example: "Blood pressure is measured as systolic over diastolic." },
      { en: "Arrhythmia", ar: "اضطراب النظم القلبي", example: "Arrhythmia is an irregular heartbeat rhythm." },
      { en: "Atherosclerosis", ar: "تصلب الشرايين", example: "Atherosclerosis is plaque buildup inside artery walls." },
      { en: "Ejection Fraction", ar: "كسر الطرد", example: "Ejection fraction measures heart pumping efficiency." },
      { en: "Capillary", ar: "الشعيرة الدموية", example: "Capillaries are the smallest blood vessels for nutrient exchange." },
      { en: "Venous Return", ar: "العودة الوريدية", example: "Venous return is the flow of blood back to the heart." },
      { en: "Pulse Pressure", ar: "ضغط النبض", example: "Pulse pressure is the difference between systolic and diastolic pressure." },
      { en: "Mean Arterial Pressure", ar: "متوسط الضغط الشرياني", example: "MAP represents the average blood pressure throughout the cardiac cycle." },
    ],
    renal: [
      { en: "Glomerulonephritis", ar: "التهاب كبيبات الكلى", example: "Glomerulonephritis is inflammation of the kidney filters." },
      { en: "Uremia", ar: "البولينا الدموية", example: "Uremia occurs when the kidneys fail to excrete waste." },
      { en: "Creatinine", ar: "الكرياتينين", example: "Creatinine is a marker of kidney function." },
      { en: "Dialysis", ar: "غسيل الكلى", example: "Dialysis filters blood in patients with renal failure." },
      { en: "Nephrotic Syndrome", ar: "متلازمة نفروضية", example: "Nephrotic syndrome causes massive protein loss in urine." },
      { en: "Renin-Angiotensin", ar: "الرينين أنجيوتنسين", example: "The renin-angiotensin system regulates blood pressure." },
      { en: "Hematuria", ar: "بيلة دموية", example: "Hematuria is the presence of blood in the urine." },
      { en: "Proteinuria", ar: "بيلة بروتينية", example: "Proteinuria indicates glomerular damage when persistent." },
      { en: "Oliguria", ar: "قلة البول", example: "Oliguria is urine output less than 400 mL/day." },
      { en: "Renal Calculi", ar: "حصى الكلى", example: "Renal calculi are stones formed from crystallized minerals." },
    ],
    cns: [
      { en: "Meningitis", ar: "التهاب السحايا", example: "Meningitis is inflammation of the brain's protective membranes." },
      { en: "Stroke", ar: "السكتة الدماغية", example: "A stroke occurs when blood supply to the brain is interrupted." },
      { en: "Cerebrospinal Fluid", ar: "السائل النخاعي الدماغي", example: "CSF cushions and nourishes the brain and spinal cord." },
      { en: "Epilepsy", ar: "الصرع", example: "Epilepsy is characterized by recurrent seizures." },
      { en: "Autonomic Nervous System", ar: "الجهاز العصبي اللاإرادي", example: "The autonomic nervous system controls involuntary functions." },
      { en: "Demyelination", ar: "إزالة الميلين", example: "Demyelination slows nerve conduction, as seen in MS." },
      { en: "Intracranial Pressure", ar: "الضغط داخل القحف", example: "Raised ICP can compress brain tissue and cause herniation." },
      { en: "Glasgow Coma Scale", ar: "مقياس غلاسكو للغيبوبة", example: "The GCS assesses consciousness in neurological patients." },
      { en: "Parkinson Disease", ar: "مرض باركنسون", example: "Parkinson disease involves dopamine loss in the substantia nigra." },
      { en: "Multiple Sclerosis", ar: "التصلب المتعدد", example: "Multiple sclerosis is an autoimmune demyelinating disease." },
    ],
    respiratory: [
      { en: "Pneumonia", ar: "التهاب رئوي", example: "Pneumonia is infection of the lung parenchyma." },
      { en: "COPD", ar: "الداء الرئوي المزمن", example: "COPD is a progressive airflow limitation disease." },
      { en: "Atelectasis", ar: "انخماص الرئة", example: "Atelectasis is partial or complete lung collapse." },
      { en: "Spirometry", ar: "قياس وظائف التنفس", example: "Spirometry measures lung volumes and airflow rates." },
      { en: "Hypercapnia", ar: "ارتفاع ثاني أكسيد الكربون", example: "Hypercapnia occurs when CO2 accumulates in the blood." },
      { en: "Pleural Effusion", ar: "انصباب جنبي", example: "Pleural effusion is fluid accumulation around the lungs." },
      { en: "Pulmonary Embolism", ar: "الانسداد الرئوي", example: "Pulmonary embolism is a blood clot blocking pulmonary arteries." },
      { en: "Asthma", ar: "الربو", example: "Asthma causes reversible airway obstruction and wheezing." },
      { en: "Pneumothorax", ar: "استرواح الصدر", example: "Pneumothorax is air in the pleural space causing lung collapse." },
      { en: "FEV1", ar: "حجم الزفير القسري في الثانية الأولى", example: "FEV1 is a key spirometry measure reduced in obstructive disease." },
    ],
    endocrine: [
      { en: "Diabetes Mellitus", ar: "مرض السكري", example: "Diabetes mellitus is characterized by chronic hyperglycemia." },
      { en: "Hypothyroidism", ar: "قصور الدرقية", example: "Hypothyroidism causes fatigue, weight gain, and cold intolerance." },
      { en: "Cortisol", ar: "كورتيزول", example: "Cortisol is released by the adrenal gland under stress." },
      { en: "TSH", ar: "هرمون محفز الدرقية", example: "TSH stimulates the thyroid to produce T3 and T4." },
      { en: "Glucagon", ar: "جلوكاجون", example: "Glucagon raises blood glucose by stimulating glycogenolysis." },
      { en: "Pituitary Gland", ar: "الغدة النخامية", example: "The pituitary gland is the master endocrine gland." },
      { en: "Hyperthyroidism", ar: "فرط الدرقية", example: "Hyperthyroidism causes weight loss, heat intolerance, and palpitations." },
      { en: "Addison Disease", ar: "مرض أديسون", example: "Addison disease is primary adrenal insufficiency." },
      { en: "Cushing Syndrome", ar: "متلازمة كوشينغ", example: "Cushing syndrome results from prolonged excess cortisol." },
      { en: "HbA1c", ar: "الهيموغلوبين السكري", example: "HbA1c reflects average blood glucose over the past 3 months." },
    ],
    musculoskeletal: [
      { en: "Osteoporosis", ar: "هشاشة العظام", example: "Osteoporosis reduces bone density and increases fracture risk." },
      { en: "Rheumatoid Arthritis", ar: "التهاب المفاصل الروماتويدي", example: "Rheumatoid arthritis is an autoimmune joint disease." },
      { en: "Tendon", ar: "وتر", example: "Tendons connect muscles to bones." },
      { en: "Ligament", ar: "رباط", example: "Ligaments connect bone to bone at joints." },
      { en: "Fracture", ar: "كسر العظم", example: "A fracture is a break in the continuity of bone." },
      { en: "Osteoblast", ar: "باني العظم", example: "Osteoblasts are cells that build new bone tissue." },
      { en: "Gout", ar: "النقرس", example: "Gout is caused by uric acid crystal deposition in joints." },
      { en: "Synovial Fluid", ar: "السائل الزليلي", example: "Synovial fluid lubricates and nourishes joint cartilage." },
      { en: "Rotator Cuff", ar: "الكفة المدورة", example: "The rotator cuff stabilizes the shoulder joint." },
      { en: "Compartment Syndrome", ar: "متلازمة الحجرة", example: "Compartment syndrome is raised pressure within a muscle compartment." },
    ],
    reproductive: [
      { en: "Meiosis", ar: "الانقسام الاختزالي", example: "Meiosis produces gametes with half the normal chromosome number." },
      { en: "Spermatogenesis", ar: "تكوّن الحيوانات المنوية", example: "Spermatogenesis is the production of sperm in the testes." },
      { en: "Oogenesis", ar: "تكوّن البويضات", example: "Oogenesis is the formation of mature oocytes in the ovary." },
      { en: "Placenta", ar: "المشيمة", example: "The placenta exchanges nutrients between mother and fetus." },
      { en: "HCG", ar: "هرمون الحمل", example: "HCG is the hormone detected in pregnancy tests." },
      { en: "Follicle Stimulating Hormone", ar: "هرمون محفز الجريب", example: "FSH stimulates follicle development in the ovary." },
      { en: "Ovulation", ar: "الإباضة", example: "Ovulation is the release of a mature egg from the ovary." },
      { en: "Luteinizing Hormone", ar: "الهرمون الملوتن", example: "LH triggers ovulation and stimulates testosterone production." },
      { en: "Endometrium", ar: "بطانة الرحم", example: "The endometrium thickens each cycle to prepare for implantation." },
      { en: "Testosterone", ar: "التستوستيرون", example: "Testosterone drives male secondary sexual characteristics." },
    ],
  },

  organs: {
    heart: [
      { en: "Myocardium",        ar: "عضلة القلب",             example: "The myocardium contracts to pump blood throughout the body." },
      { en: "Pericardium",       ar: "التأمور",                 example: "The pericardium is the fibrous sac that encloses the heart." },
      { en: "Endocardium",       ar: "الشغاف",                  example: "The endocardium lines the inner surface of the heart chambers." },
      { en: "Tricuspid Valve",   ar: "الصمام ثلاثي الشرفات",    example: "The tricuspid valve separates the right atrium from the right ventricle." },
      { en: "Mitral Valve",      ar: "الصمام التاجي",           example: "The mitral valve prevents backflow from the left ventricle to the left atrium." },
      { en: "Aortic Valve",      ar: "الصمام الأبهري",          example: "The aortic valve opens to allow blood to flow from the left ventricle into the aorta." },
      { en: "Chordae Tendineae", ar: "الأوتار الوترية",         example: "Chordae tendineae anchor the valve leaflets to the papillary muscles." },
      { en: "Interventricular Septum", ar: "الحاجز بين البطينين", example: "The interventricular septum separates the left and right ventricles." },
      { en: "Coronary Sinus",    ar: "الجيب التاجي",            example: "The coronary sinus drains deoxygenated blood from the myocardium into the right atrium." },
      { en: "Bundle of His",     ar: "حزمة هيس",                example: "The bundle of His transmits electrical impulses from the AV node to the ventricles." },
    ],
    lungs: [
      { en: "Pleura",             ar: "غشاء الجنب",              example: "The pleura is a double membrane surrounding each lung." },
      { en: "Alveolus",           ar: "الحويصلة الهوائية",        example: "Each alveolus is surrounded by capillaries for gas exchange." },
      { en: "Bronchiole",         ar: "القصيبة الهوائية",         example: "Bronchioles are small airways that lack cartilage in their walls." },
      { en: "Hilum",              ar: "بوابة الرئة",              example: "The hilum is where the bronchus, vessels, and nerves enter the lung." },
      { en: "Carina",             ar: "عارضة القصبة",             example: "The carina is the ridge at the bifurcation of the trachea." },
      { en: "Surfactant",         ar: "الفاعل السطحي",            example: "Surfactant prevents alveolar collapse by reducing surface tension." },
      { en: "Type I Pneumocyte",  ar: "الخلية الرئوية من النوع الأول", example: "Type I pneumocytes cover 95% of the alveolar surface for gas exchange." },
      { en: "Type II Pneumocyte", ar: "الخلية الرئوية من النوع الثاني", example: "Type II pneumocytes secrete surfactant and can regenerate Type I cells." },
      { en: "Pulmonary Lobule",   ar: "الفصيص الرئوي",            example: "Each pulmonary lobule is supplied by a terminal bronchiole." },
      { en: "Respiratory Membrane", ar: "الغشاء التنفسي",         example: "The respiratory membrane is where O2 and CO2 diffuse between air and blood." },
    ],
    liver: [
      { en: "Hepatocyte",        ar: "خلية الكبد",               example: "Hepatocytes perform most of the liver's metabolic functions." },
      { en: "Lobule",            ar: "الفصيص الكبدي",             example: "The liver lobule is the functional unit of the liver." },
      { en: "Portal Triad",      ar: "الثالوث البابي",            example: "The portal triad contains a portal vein branch, hepatic artery, and bile duct." },
      { en: "Sinusoid",          ar: "الجيب الدموي الكبدي",       example: "Hepatic sinusoids are specialised capillaries between hepatocyte plates." },
      { en: "Kupffer Cell",      ar: "خلية كوبفر",               example: "Kupffer cells are resident macrophages that filter pathogens from portal blood." },
      { en: "Bile Canaliculus",  ar: "القناة الصفراوية الدقيقة",  example: "Bile canaliculi collect bile secreted by adjacent hepatocytes." },
      { en: "Glisson Capsule",   ar: "كبسولة جليسون",             example: "Glisson's capsule is the fibrous connective tissue covering the liver." },
      { en: "Zone 1 (Periportal)", ar: "المنطقة الأولى المحيطة بالبوابة", example: "Zone 1 hepatocytes receive the most oxygenated blood and are most resistant to ischaemia." },
      { en: "Central Vein",      ar: "الوريد المركزي",            example: "The central vein drains blood from the liver lobule into the hepatic veins." },
      { en: "Ito Cell",          ar: "خلية إيتو",                 example: "Ito cells store vitamin A and become activated in liver fibrosis." },
    ],
    kidneys: [
      { en: "Nephron",           ar: "النيفرون",                  example: "The nephron is the basic functional unit of the kidney." },
      { en: "Glomerulus",        ar: "الكبيبة",                   example: "The glomerulus is a tuft of capillaries where blood is filtered." },
      { en: "Bowman Capsule",    ar: "كبسولة بومان",              example: "Bowman's capsule surrounds the glomerulus and collects the filtrate." },
      { en: "Proximal Tubule",   ar: "النبيب القريب",             example: "The proximal tubule reabsorbs 65% of filtered sodium and water." },
      { en: "Loop of Henle",     ar: "عروة هنلي",                 example: "The loop of Henle creates an osmotic gradient in the medulla." },
      { en: "Distal Tubule",     ar: "النبيب البعيد",             example: "The distal tubule is the main site of aldosterone action." },
      { en: "Collecting Duct",   ar: "قناة التجميع",              example: "ADH acts on the collecting duct to increase water reabsorption." },
      { en: "Macula Densa",      ar: "البقعة الكثيفة",            example: "The macula densa senses sodium levels to regulate GFR and renin release." },
      { en: "Podocyte",          ar: "الخلية القدمية",            example: "Podocytes form the filtration slits of the glomerular barrier." },
      { en: "Renal Cortex",      ar: "قشرة الكلية",               example: "The renal cortex contains all glomeruli and most tubular structures." },
    ],
    brain: [
      { en: "Cerebrum",          ar: "المخ",                      example: "The cerebrum is the largest part of the brain controlling cognition and movement." },
      { en: "Cerebellum",        ar: "المخيخ",                    example: "The cerebellum coordinates fine motor movement and balance." },
      { en: "Brainstem",         ar: "جذع الدماغ",                example: "The brainstem controls vital autonomic functions such as breathing and heart rate." },
      { en: "Limbic System",     ar: "الجهاز الحوفي",             example: "The limbic system regulates emotions and memory formation." },
      { en: "Basal Ganglia",     ar: "العقد القاعدية",             example: "The basal ganglia modulate voluntary movement and procedural learning." },
      { en: "Meninges",          ar: "السحايا",                   example: "The meninges are three protective membranes surrounding the brain and spinal cord." },
      { en: "Blood-Brain Barrier", ar: "الحاجز الدموي الدماغي",  example: "The blood-brain barrier protects the CNS from toxins and pathogens." },
      { en: "Ventricles",        ar: "بطينات الدماغ",             example: "The cerebral ventricles produce and circulate cerebrospinal fluid." },
      { en: "Corpus Callosum",   ar: "الجسم الجاسئ",              example: "The corpus callosum connects the two cerebral hemispheres." },
      { en: "Reticular Formation", ar: "التكوين الشبكي",          example: "The reticular formation regulates arousal, consciousness, and sleep." },
    ],
    skin: [
      { en: "Epidermis",         ar: "البشرة",                    example: "The epidermis is the outermost layer of skin forming a protective barrier." },
      { en: "Dermis",            ar: "الأدمة",                    example: "The dermis contains collagen, blood vessels, and nerve endings." },
      { en: "Hypodermis",        ar: "تحت الجلد",                 example: "The hypodermis is the deepest layer of skin composed mainly of fat." },
      { en: "Keratinocyte",      ar: "خلية كيراتينية",            example: "Keratinocytes produce keratin and form the bulk of the epidermis." },
      { en: "Melanocyte",        ar: "خلية صبغية",                example: "Melanocytes produce melanin which gives skin its colour and UV protection." },
      { en: "Langerhans Cell",   ar: "خلية لانغرهانس",            example: "Langerhans cells are immune cells in the epidermis that present antigens." },
      { en: "Sebaceous Gland",   ar: "الغدة الدهنية",             example: "Sebaceous glands secrete sebum to lubricate and waterproof the skin." },
      { en: "Sweat Gland",       ar: "الغدة العرقية",             example: "Sweat glands regulate body temperature through evaporative cooling." },
      { en: "Hair Follicle",     ar: "جريب الشعر",               example: "Hair follicles anchor hairs and contain stem cells for skin regeneration." },
      { en: "Stratum Corneum",   ar: "الطبقة القرنية",            example: "The stratum corneum is the outermost dead cell layer that prevents water loss." },
    ],
  },

  pharmacology: {
    analgesics: [
      { en: "Paracetamol",       ar: "الباراسيتامول",             example: "Paracetamol relieves pain and fever by inhibiting central prostaglandin synthesis." },
      { en: "Ibuprofen",         ar: "الإيبوبروفين",              example: "Ibuprofen is an NSAID that inhibits COX-1 and COX-2 enzymes." },
      { en: "Morphine",          ar: "المورفين",                  example: "Morphine is a potent opioid that binds mu receptors to relieve severe pain." },
      { en: "Codeine",           ar: "الكودايين",                 example: "Codeine is a mild opioid converted to morphine in the liver." },
      { en: "Aspirin",           ar: "الأسبرين",                  example: "Aspirin irreversibly inhibits COX enzymes and is used as an antiplatelet." },
      { en: "Tramadol",          ar: "الترامادول",                example: "Tramadol is a centrally-acting analgesic with weak opioid and SNRI activity." },
      { en: "Diclofenac",        ar: "الديكلوفيناك",              example: "Diclofenac is an NSAID used for inflammation, pain, and dysmenorrhoea." },
      { en: "Naloxone",          ar: "النالوكسون",                example: "Naloxone is an opioid antagonist used to reverse opioid overdose." },
      { en: "Gabapentin",        ar: "الغاباپنتين",               example: "Gabapentin treats neuropathic pain by binding calcium channel subunits." },
      { en: "Celecoxib",         ar: "السيليكوكسيب",              example: "Celecoxib is a selective COX-2 inhibitor with reduced GI side effects." },
    ],
    antibiotics: [
      { en: "Penicillin",        ar: "البنسيلين",                 example: "Penicillin inhibits bacterial cell wall synthesis." },
      { en: "Amoxicillin",       ar: "الأموكسيسيلين",             example: "Amoxicillin is a broad-spectrum penicillin effective against gram-positive and some gram-negative bacteria." },
      { en: "Ciprofloxacin",     ar: "السيبروفلوكساسين",          example: "Ciprofloxacin inhibits DNA gyrase and is used for urinary and respiratory infections." },
      { en: "Metronidazole",     ar: "الميترونيدازول",            example: "Metronidazole treats anaerobic bacterial and protozoal infections." },
      { en: "Azithromycin",      ar: "الأزيثرومايسين",            example: "Azithromycin inhibits 50S ribosomal subunit and treats atypical pneumonias." },
      { en: "Vancomycin",        ar: "الفانكومايسين",             example: "Vancomycin inhibits cell wall synthesis and treats MRSA infections." },
      { en: "Tetracycline",      ar: "التتراسيكلين",              example: "Tetracycline inhibits 30S ribosomal subunit and treats acne and chlamydia." },
      { en: "Gentamicin",        ar: "الجنتامايسين",              example: "Gentamicin is an aminoglycoside used for serious gram-negative infections." },
      { en: "Clindamycin",       ar: "الكليندامايسين",            example: "Clindamycin inhibits protein synthesis and treats anaerobic and skin infections." },
      { en: "Fluconazole",       ar: "الفلوكونازول",              example: "Fluconazole inhibits fungal ergosterol synthesis and treats candidiasis." },
    ],
    cardiovascular: [
      { en: "Atenolol",          ar: "الأتينولول",                example: "Atenolol is a beta-1 blocker used for hypertension and angina." },
      { en: "Amlodipine",        ar: "الأملوديپين",               example: "Amlodipine is a calcium channel blocker used for hypertension and angina." },
      { en: "Lisinopril",        ar: "الليزينوبريل",              example: "Lisinopril is an ACE inhibitor that reduces blood pressure and protects the kidneys." },
      { en: "Warfarin",          ar: "الوارفارين",                example: "Warfarin inhibits vitamin K-dependent clotting factors and prevents thrombosis." },
      { en: "Digoxin",           ar: "الديجوكسين",                example: "Digoxin inhibits Na/K ATPase to increase cardiac contractility." },
      { en: "Furosemide",        ar: "الفيروسيميد",               example: "Furosemide is a loop diuretic used for heart failure and oedema." },
      { en: "Simvastatin",       ar: "السيمفاستاتين",             example: "Simvastatin inhibits HMG-CoA reductase to lower LDL cholesterol." },
      { en: "Heparin",           ar: "الهيبارين",                 example: "Heparin activates antithrombin III to rapidly prevent clot formation." },
      { en: "Nitroglycerin",     ar: "النيتروغليسرين",            example: "Nitroglycerin releases nitric oxide to dilate coronary arteries in angina." },
      { en: "Spironolactone",    ar: "السبيرونولاكتون",           example: "Spironolactone is a potassium-sparing diuretic and aldosterone antagonist." },
    ],
    cns_drugs: [
      { en: "Diazepam",          ar: "الديازيبام",                example: "Diazepam enhances GABA activity to treat anxiety and seizures." },
      { en: "Fluoxetine",        ar: "الفلوكستين",                example: "Fluoxetine is an SSRI used for depression and OCD." },
      { en: "Haloperidol",       ar: "الهالوپيريدول",             example: "Haloperidol blocks dopamine D2 receptors to treat psychosis." },
      { en: "Levodopa",          ar: "الليفودوبا",                example: "Levodopa is converted to dopamine in the brain to treat Parkinson's disease." },
      { en: "Phenytoin",         ar: "الفينيتوين",                example: "Phenytoin stabilises neuronal membranes by blocking sodium channels to prevent seizures." },
      { en: "Lithium",           ar: "الليثيوم",                  example: "Lithium is a mood stabiliser used in bipolar disorder." },
      { en: "Amitriptyline",     ar: "الأميتريبتيلين",            example: "Amitriptyline is a tricyclic antidepressant that inhibits noradrenaline and serotonin reuptake." },
      { en: "Risperidone",       ar: "الريسپيريدون",              example: "Risperidone is an atypical antipsychotic that blocks D2 and 5-HT2 receptors." },
      { en: "Donepezil",         ar: "الدونيپيزيل",               example: "Donepezil inhibits acetylcholinesterase to improve cognition in Alzheimer's disease." },
      { en: "Valproate",         ar: "الفالپروات",                example: "Valproate increases GABA levels and is used for epilepsy and bipolar disorder." },
    ],
    hormonal: [
      { en: "Metformin",         ar: "الميتفورمين",               example: "Metformin reduces hepatic glucose production and is first-line for type 2 diabetes." },
      { en: "Insulin Glargine",  ar: "الأنسولين جلارجين",         example: "Insulin glargine is a long-acting basal insulin given once daily." },
      { en: "Levothyroxine",     ar: "الليفوثيروكسين",            example: "Levothyroxine replaces T4 in hypothyroidism treatment." },
      { en: "Prednisolone",      ar: "البريدنيزولون",             example: "Prednisolone is a corticosteroid used for inflammation and autoimmune conditions." },
      { en: "Dexamethasone",     ar: "الديكساميثازون",            example: "Dexamethasone is a potent steroid used for cerebral oedema and anaphylaxis." },
      { en: "Propylthiouracil",  ar: "البروبيلثيوراسيل",          example: "Propylthiouracil inhibits thyroid hormone synthesis in hyperthyroidism." },
      { en: "Combined OCP",      ar: "حبوب منع الحمل المركبة",    example: "Combined oral contraceptives contain oestrogen and progestogen to prevent ovulation." },
      { en: "Oxytocin",          ar: "الأوكسيتوسين",              example: "Oxytocin is used to induce or augment labour and prevent postpartum haemorrhage." },
      { en: "Fludrocortisone",   ar: "الفلودروكورتيزون",          example: "Fludrocortisone is a mineralocorticoid replacement for Addison's disease." },
      { en: "Somatropin",        ar: "الهرمون النمو الصناعي",      example: "Somatropin is recombinant growth hormone used in GH deficiency." },
    ],
  },

  pathology: {
    inflammation: [
      { en: "Acute Inflammation", ar: "الالتهاب الحاد",          example: "Acute inflammation is characterised by redness, heat, swelling, pain, and loss of function." },
      { en: "Chronic Inflammation", ar: "الالتهاب المزمن",       example: "Chronic inflammation persists beyond 6 weeks and involves lymphocytes and macrophages." },
      { en: "Granuloma",          ar: "الورم الحبيبي",            example: "A granuloma is a collection of activated macrophages seen in tuberculosis and sarcoidosis." },
      { en: "Oedema",             ar: "الوذمة",                   example: "Oedema is abnormal accumulation of fluid in interstitial tissues." },
      { en: "Exudate",            ar: "الإفراز الالتهابي",        example: "An exudate is protein-rich fluid that leaks from inflamed vessels." },
      { en: "Cytokines",          ar: "السيتوكينات",              example: "Cytokines like IL-1 and TNF mediate the systemic response to infection." },
      { en: "Neutrophil",         ar: "العدلة",                   example: "Neutrophils are the first white cells recruited in acute inflammation." },
      { en: "Phagocytosis",       ar: "البلعمة",                  example: "Phagocytosis is the engulfment and destruction of pathogens by immune cells." },
      { en: "Abscess",            ar: "الخراج",                   example: "An abscess is a localised collection of pus surrounded by inflamed tissue." },
      { en: "Fibrosis",           ar: "التليف",                   example: "Fibrosis is excessive deposition of collagen as a result of chronic injury." },
    ],
    neoplasia: [
      { en: "Benign Tumour",      ar: "الورم الحميد",             example: "Benign tumours grow slowly, are well-differentiated, and do not metastasise." },
      { en: "Malignant Tumour",   ar: "الورم الخبيث",             example: "Malignant tumours invade local tissues and can spread to distant sites." },
      { en: "Metastasis",         ar: "الانتقال الورمي",          example: "Metastasis is the spread of cancer cells from the primary site to distant organs." },
      { en: "Carcinoma",          ar: "السرطانة",                 example: "Carcinoma is a malignant tumour arising from epithelial cells." },
      { en: "Sarcoma",            ar: "الساركومة",                example: "Sarcoma is a malignant tumour arising from connective tissue." },
      { en: "Oncogene",           ar: "الجين الورمي",             example: "Oncogenes promote uncontrolled cell proliferation when mutated." },
      { en: "Tumour Suppressor",  ar: "الجين الكابح للورم",       example: "Tumour suppressor genes like p53 prevent abnormal cell division." },
      { en: "Angiogenesis",       ar: "تكوّن الأوعية الدموية",    example: "Tumours stimulate angiogenesis to obtain nutrients and oxygen." },
      { en: "Differentiation",    ar: "التمايز الخلوي",           example: "Well-differentiated tumours resemble their tissue of origin and behave less aggressively." },
      { en: "Paraneoplastic Syndrome", ar: "المتلازمة المرافقة للورم", example: "Paraneoplastic syndromes are remote effects of tumours not caused by direct invasion." },
    ],
    cardiovascular: [
      { en: "Atherosclerosis",    ar: "تصلب الشرايين",            example: "Atherosclerosis is the buildup of plaques in arterial walls." },
      { en: "Myocardial Infarction", ar: "احتشاء عضلة القلب",    example: "Myocardial infarction occurs when coronary artery occlusion causes myocardial necrosis." },
      { en: "Heart Failure",      ar: "فشل القلب",                example: "Heart failure occurs when the heart cannot pump enough blood to meet the body's needs." },
      { en: "Hypertension",       ar: "ارتفاع ضغط الدم",         example: "Chronic hypertension damages arterial walls and increases risk of stroke and MI." },
      { en: "Thrombosis",         ar: "الخثار",                   example: "Thrombosis is formation of a blood clot inside a blood vessel." },
      { en: "Embolism",           ar: "الصمة",                    example: "An embolism occurs when a clot or other material travels to block a distant vessel." },
      { en: "Cardiomyopathy",     ar: "اعتلال عضلة القلب",       example: "Cardiomyopathy refers to diseases of the heart muscle affecting its function." },
      { en: "Aortic Dissection",  ar: "تشريح الأبهر",            example: "Aortic dissection is a tear in the inner layer of the aorta." },
      { en: "Endocarditis",       ar: "التهاب الشغاف",            example: "Infective endocarditis is bacterial infection of the heart valves." },
      { en: "Pericarditis",       ar: "التهاب التأمور",           example: "Pericarditis is inflammation of the pericardium causing chest pain." },
    ],
    infectious: [
      { en: "Sepsis",             ar: "الإنتان",                  example: "Sepsis is a life-threatening systemic response to infection." },
      { en: "Bacteraemia",        ar: "تجرثم الدم",               example: "Bacteraemia is the presence of bacteria in the bloodstream." },
      { en: "Virulence",          ar: "الضراوة",                  example: "Virulence describes the degree of pathogenicity of a microorganism." },
      { en: "Opportunistic Infection", ar: "العدوى الانتهازية",   example: "Opportunistic infections occur in immunocompromised patients." },
      { en: "Nosocomial Infection", ar: "العدوى المكتسبة في المستشفى", example: "Nosocomial infections are acquired during hospital stay." },
      { en: "Endotoxin",          ar: "الذيفان الداخلي",          example: "Endotoxins are lipopolysaccharides from gram-negative bacterial cell walls." },
      { en: "Exotoxin",           ar: "الذيفان الخارجي",          example: "Exotoxins are proteins secreted by bacteria that damage host tissues." },
      { en: "Prion",              ar: "البريون",                  example: "Prions are misfolded proteins that cause fatal neurodegenerative diseases." },
      { en: "Biofilm",            ar: "الغشاء الحيوي",            example: "Biofilms are bacterial communities embedded in a protective matrix resistant to antibiotics." },
      { en: "Zoonosis",           ar: "الأمراض الحيوانية المنشأ", example: "Zoonoses are diseases transmitted from animals to humans such as rabies and brucellosis." },
    ],
    genetic: [
      { en: "Autosomal Dominant", ar: "سائد جسمي",               example: "Autosomal dominant disorders appear when one abnormal allele is inherited." },
      { en: "Autosomal Recessive", ar: "متنحٍّ جسمي",            example: "Autosomal recessive disorders require two abnormal alleles to manifest." },
      { en: "X-Linked",           ar: "مرتبط بالكروموسوم X",     example: "X-linked disorders are more commonly expressed in males." },
      { en: "Trisomy",            ar: "التثلث الصبغي",            example: "Trisomy 21 causes Down syndrome with an extra chromosome 21." },
      { en: "Point Mutation",     ar: "الطفرة النقطية",           example: "A point mutation is a single nucleotide change that may alter protein function." },
      { en: "Deletion",           ar: "الحذف الجيني",             example: "Chromosomal deletions remove segments of DNA causing loss of gene function." },
      { en: "Translocation",      ar: "الانتقال الصبغي",          example: "Chromosomal translocations move genetic material between chromosomes." },
      { en: "Mosaicism",          ar: "الفسيفساء الجينية",        example: "Mosaicism occurs when an individual has two or more genetically distinct cell populations." },
      { en: "Imprinting",         ar: "البصمة الجينية",           example: "Genomic imprinting silences one parental allele in a parent-of-origin specific manner." },
      { en: "Hardy-Weinberg Principle", ar: "مبدأ هاردي-واينبرغ", example: "The Hardy-Weinberg principle describes allele frequency equilibrium in a stable population." },
    ],
  },
};
// ── Flashcard Component ──────────────────────────────────────────────────────
function FlashCard({ term, onKnow, onStudyMore }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState(null);

  useEffect(() => { setAiHint(null); }, [term]);

  async function getAiHint() {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "أنت مساعد طبي تعليمي. رد دائماً بالعربية.",
          messages: [{
            role: "user",
            content: `حلّل المصطلح الطبي "${term.en}" لغوياً. أعطني: ١) تحليل أجزاء الكلمة (مثل: Myo = عضلة، Cardium = قلب) ٢) جملة حفظ ذكية. الرد في ٣ سطور فقط بالعربية.`
          }]
        })
      });
      const data = await res.json();
      setAiHint(data.content?.[0]?.text || "تعذّر تحميل التلميح.");
    } catch {
      setAiHint("تعذّر الاتصال بالذكاء الاصطناعي.");
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Card — no flip, single face */}
      <div style={{
        width: "100%", maxWidth: 420,
        borderRadius: 24,
        background: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)",
        color: "#fff", display: "flex", flexDirection: "column",
        alignItems: "center", padding: "24px 24px 20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Image placeholder — replace with real image later */}
        <div style={{
          width: "100%", height: 160, borderRadius: 16, marginBottom: 20,
          background: "rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 64, border: "1.5px dashed rgba(255,255,255,0.15)",
        }}>
          🩺
        </div>

        {/* English term — big, bold, yellow */}
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 1, marginBottom: 8, textAlign: "center", color: "#FFD700" }}>
          {term.en}
        </div>

        {/* Arabic translation — underneath */}
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fbbf24", textAlign: "center", direction: "rtl", marginBottom: 10 }}>
          {term.ar}
        </div>

        {/* Example */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", fontStyle: "italic", textAlign: "center", lineHeight: 1.7, opacity: 0.92 }}>
          {term.example}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(90deg, #E63946, #F4A261, #2A9D8F, #457B9D)" }} />
      </div>

      {/* AI Hint */}
      {!aiHint ? (
        <button onClick={getAiHint} disabled={loading} style={{
          background: "transparent", border: "1.5px solid #457B9D",
          color: "#457B9D", borderRadius: 12, padding: "8px 20px",
          cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6,
        }}>
          {loading ? "⏳ جاري التحميل..." : "✨ تلميح ذكي من AI"}
        </button>
      ) : (
        <div style={{
          background: "#f0f7ff", border: "1px solid #c7dff0",
          borderRadius: 14, padding: "14px 18px", maxWidth: 420,
          fontSize: 14, color: "#1a3a5c", direction: "rtl", lineHeight: 1.8,
          whiteSpace: "pre-line",
        }}>
          🤖 {aiHint}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 420 }}>
        <button onClick={onStudyMore} style={{
          flex: 1, padding: "14px 0", borderRadius: 14,
          background: "#fff3cd", border: "none", color: "#856404",
          fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}>
          🔄 مش عارفه
        </button>
        <button onClick={onKnow} style={{
          flex: 1, padding: "14px 0", borderRadius: 14,
          background: "#d1fae5", border: "none", color: "#065f46",
          fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}>
          ✅ عارفه!
        </button>
      </div>
    </div>
  );
}

// ── Quiz Component ───────────────────────────────────────────────────────────
function Quiz({ terms, onFinish }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const current = terms[qIndex];

  // Build options: 1 correct + 3 random wrong
  const buildOptions = (term, allTerms) => {
    const others = allTerms.filter(t => t.en !== term.en);
    const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled, term].sort(() => Math.random() - 0.5);
  };

  const [options] = useState(() => terms.map(t => buildOptions(t, terms)));

  async function getAiFeedback(isCorrect, term, chosenAr) {
    setLoadingFeedback(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "أنت مدرس طبي. رد بالعربية فقط. رسالتك قصيرة وتشجيعية. سطرين فقط.",
          messages: [{
            role: "user",
            content: isCorrect
              ? `الطالب أجاب صح على "${term.en}" = "${term.ar}". شجّعه وأعطه حقيقة طبية مثيرة عن هذا المصطلح.`
              : `الطالب اختار "${chosenAr}" بدل "${term.ar}" للمصطلح "${term.en}". صحّحه بلطف واشرح الفرق.`
          }]
        })
      });
      const data = await res.json();
      setAiFeedback(data.content?.[0]?.text || "");
    } catch { setAiFeedback(""); }
    setLoadingFeedback(false);
  }

  function handleSelect(opt) {
    if (selected) return;
    setSelected(opt);
    const correct = opt.en === current.en;
    if (correct) setScore(s => s + 1);
    getAiFeedback(correct, current, opt.ar);
  }

  function next() {
    setSelected(null);
    setAiFeedback(null);
    if (qIndex + 1 >= terms.length) onFinish(score + (selected?.en === current.en ? 1 : 0));
    else setQIndex(i => i + 1);
  }

  const isCorrect = selected?.en === current.en;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
      {/* Progress */}
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 6 }}>
          <span>سؤال {qIndex + 1} من {terms.length}</span>
          <span>✅ {score} صح</span>
        </div>
        <div style={{ background: "#e9ecef", borderRadius: 99, height: 8 }}>
          <div style={{ height: 8, borderRadius: 99, background: "linear-gradient(90deg,#2A9D8F,#457B9D)",
            width: `${((qIndex) / terms.length) * 100}%`, transition: "width 0.4s" }} />
        </div>
      </div>

      {/* Question */}
      <div style={{
        background: "linear-gradient(135deg,#0f3460,#16213e)",
        color: "#fff", borderRadius: 20, padding: "28px 24px",
        width: "100%", maxWidth: 420, textAlign: "center",
      }}>
        <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 10 }}>ما معنى هذا المصطلح؟</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#FFD700" }}>{current.en}</div>
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 420 }}>
        {options[qIndex].map((opt, i) => {
          const isRight = opt.en === current.en;
          const isPicked = selected?.en === opt.en;
          let bg = "#fff", border = "2px solid #dee2e6", color = "#333";
          if (selected) {
            if (isRight) { bg = "#d1fae5"; border = "2px solid #10b981"; color = "#065f46"; }
            else if (isPicked) { bg = "#fee2e2"; border = "2px solid #ef4444"; color = "#991b1b"; }
          }
          return (
            <button key={i} onClick={() => handleSelect(opt)} style={{
              padding: "14px 10px", borderRadius: 14, background: bg, border,
              color, fontWeight: 600, fontSize: 15, cursor: selected ? "default" : "pointer",
              direction: "rtl", transition: "all 0.2s",
            }}>
              {opt.ar}
            </button>
          );
        })}
      </div>

      {/* AI Feedback */}
      {selected && (
        <div style={{
          background: isCorrect ? "#f0fdf4" : "#fff5f5",
          border: `1px solid ${isCorrect ? "#bbf7d0" : "#fecaca"}`,
          borderRadius: 14, padding: "14px 18px", width: "100%", maxWidth: 420,
          direction: "rtl", fontSize: 14, lineHeight: 1.8,
          color: isCorrect ? "#14532d" : "#7f1d1d",
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>
            {isCorrect ? "🎉 ممتاز!" : "❌ إجابة خاطئة"}
          </div>
          {loadingFeedback ? "⏳ جاري تحليل إجابتك..." : aiFeedback}
        </div>
      )}

      {selected && (
        <button onClick={next} style={{
          background: "linear-gradient(90deg,#2A9D8F,#457B9D)",
          color: "#fff", border: "none", borderRadius: 14,
          padding: "14px 40px", fontWeight: 700, fontSize: 16,
          cursor: "pointer", width: "100%", maxWidth: 420,
        }}>
          {qIndex + 1 >= terms.length ? "🏁 انتهى الاختبار!" : "التالي ←"}
        </button>
      )}
    </div>
  );
}


// ── Cartoon Medical Student Avatars (SVG) ────────────────────────────────────
const AVATARS = [
  {
    name: "Sara",
    mood: "excited",
    svg: (
      <svg viewBox="0 0 120 160" width="120" height="160" xmlns="http://www.w3.org/2000/svg">
        {/* Body - white coat */}
        <rect x="25" y="95" width="70" height="60" rx="10" fill="#fff" stroke="#ddd" strokeWidth="1.5"/>
        <rect x="45" y="95" width="30" height="60" fill="#e8f4fd"/>
        {/* Stethoscope */}
        <path d="M38 105 Q30 115 35 125 Q40 132 48 128" fill="none" stroke="#2A9D8F" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="48" cy="128" r="4" fill="#2A9D8F"/>
        {/* Neck */}
        <rect x="52" y="82" width="16" height="16" rx="4" fill="#FDBCB4"/>
        {/* Head */}
        <ellipse cx="60" cy="65" rx="28" ry="30" fill="#FDBCB4"/>
        {/* Hair */}
        <ellipse cx="60" cy="42" rx="28" ry="14" fill="#4A2C0A"/>
        <ellipse cx="35" cy="60" rx="8" ry="18" fill="#4A2C0A"/>
        <ellipse cx="85" cy="60" rx="8" ry="18" fill="#4A2C0A"/>
        {/* Eyes - happy */}
        <ellipse cx="50" cy="63" rx="5" ry="6" fill="#fff"/>
        <ellipse cx="70" cy="63" rx="5" ry="6" fill="#fff"/>
        <circle cx="51" cy="64" r="3" fill="#3d2b1f"/>
        <circle cx="71" cy="64" r="3" fill="#3d2b1f"/>
        <circle cx="52" cy="62" r="1" fill="#fff"/>
        <circle cx="72" cy="62" r="1" fill="#fff"/>
        {/* Smile */}
        <path d="M50 77 Q60 85 70 77" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
        {/* Cheeks */}
        <ellipse cx="44" cy="73" rx="6" ry="4" fill="#f1948a" opacity="0.5"/>
        <ellipse cx="76" cy="73" rx="6" ry="4" fill="#f1948a" opacity="0.5"/>
        {/* Pocket + clipboard */}
        <rect x="72" y="100" width="16" height="20" rx="3" fill="#D4AF37" opacity="0.8"/>
        <rect x="73" y="97" width="14" height="4" rx="1" fill="#b8860b"/>
        <line x1="75" y1="105" x2="86" y2="105" stroke="#fff" strokeWidth="1.2"/>
        <line x1="75" y1="109" x2="86" y2="109" stroke="#fff" strokeWidth="1.2"/>
        <line x1="75" y1="113" x2="83" y2="113" stroke="#fff" strokeWidth="1.2"/>
      </svg>
    ),
    msg: "هيا نكمل! أنت تتقدم بشكل رائع 🌟",
    msgEn: "Let's keep going! You're doing amazing!"
  },
  {
    name: "Omar",
    mood: "focused",
    svg: (
      <svg viewBox="0 0 120 160" width="120" height="160" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <rect x="22" y="95" width="76" height="60" rx="10" fill="#fff" stroke="#ddd" strokeWidth="1.5"/>
        <rect x="44" y="95" width="32" height="60" fill="#e8f4fd"/>
        {/* Stethoscope */}
        <path d="M82 105 Q90 115 85 125 Q80 132 72 128" fill="none" stroke="#E63946" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="72" cy="128" r="4" fill="#E63946"/>
        {/* Neck */}
        <rect x="52" y="82" width="16" height="16" rx="4" fill="#D4A574"/>
        {/* Head */}
        <ellipse cx="60" cy="64" rx="29" ry="30" fill="#D4A574"/>
        {/* Hair - short */}
        <ellipse cx="60" cy="40" rx="29" ry="12" fill="#1a1a1a"/>
        <rect x="31" y="40" width="58" height="10" fill="#1a1a1a"/>
        {/* Ears */}
        <ellipse cx="31" cy="65" rx="5" ry="7" fill="#D4A574"/>
        <ellipse cx="89" cy="65" rx="5" ry="7" fill="#D4A574"/>
        {/* Glasses */}
        <rect x="37" y="58" width="18" height="13" rx="4" fill="none" stroke="#457B9D" strokeWidth="2"/>
        <rect x="65" y="58" width="18" height="13" rx="4" fill="none" stroke="#457B9D" strokeWidth="2"/>
        <line x1="55" y1="64" x2="65" y2="64" stroke="#457B9D" strokeWidth="2"/>
        {/* Eyes behind glasses */}
        <circle cx="46" cy="65" r="3" fill="#3d2b1f"/>
        <circle cx="74" cy="65" r="3" fill="#3d2b1f"/>
        <circle cx="47" cy="64" r="1" fill="#fff"/>
        <circle cx="75" cy="64" r="1" fill="#fff"/>
        {/* Focused mouth */}
        <path d="M51 77 Q60 80 69 77" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round"/>
        {/* Book in hand */}
        <rect x="26" y="108" width="20" height="28" rx="2" fill="#457B9D"/>
        <rect x="27" y="109" width="9" height="26" rx="1" fill="#5d93bc"/>
        <line x1="30" y1="113" x2="34" y2="113" stroke="#fff" strokeWidth="1"/>
        <line x1="30" y1="117" x2="34" y2="117" stroke="#fff" strokeWidth="1"/>
        <line x1="30" y1="121" x2="34" y2="121" stroke="#fff" strokeWidth="1"/>
      </svg>
    ),
    msg: "المثابرة هي مفتاح النجاح 📚",
    msgEn: "Persistence is the key to success!"
  },
  {
    name: "Layla",
    mood: "cheerful",
    svg: (
      <svg viewBox="0 0 120 160" width="120" height="160" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <rect x="24" y="95" width="72" height="60" rx="10" fill="#fff" stroke="#ddd" strokeWidth="1.5"/>
        <rect x="44" y="95" width="32" height="60" fill="#fef9e7"/>
        {/* Stethoscope */}
        <path d="M40 108 Q32 118 38 128 Q44 135 52 130" fill="none" stroke="#2A9D8F" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="52" cy="130" r="4" fill="#2A9D8F"/>
        {/* Neck */}
        <rect x="52" y="82" width="16" height="16" rx="4" fill="#FDBCB4"/>
        {/* Head */}
        <ellipse cx="60" cy="64" rx="27" ry="29" fill="#FDBCB4"/>
        {/* Hair - ponytail */}
        <ellipse cx="60" cy="40" rx="27" ry="13" fill="#8B4513"/>
        <ellipse cx="33" cy="58" rx="7" ry="20" fill="#8B4513"/>
        <ellipse cx="87" cy="58" rx="7" ry="20" fill="#8B4513"/>
        <ellipse cx="92" cy="52" rx="5" ry="14" fill="#8B4513"/>
        <circle cx="92" cy="40" r="5" fill="#E63946"/>
        {/* Eyes - big happy */}
        <ellipse cx="50" cy="63" rx="6" ry="7" fill="#fff"/>
        <ellipse cx="70" cy="63" rx="6" ry="7" fill="#fff"/>
        <circle cx="51" cy="64" r="4" fill="#5D4037"/>
        <circle cx="71" cy="64" r="4" fill="#5D4037"/>
        <circle cx="52" cy="62" r="1.5" fill="#fff"/>
        <circle cx="72" cy="62" r="1.5" fill="#fff"/>
        {/* Lashes */}
        <line x1="45" y1="56" x2="43" y2="53" stroke="#333" strokeWidth="1.2"/>
        <line x1="50" y1="55" x2="49" y2="52" stroke="#333" strokeWidth="1.2"/>
        <line x1="55" y1="56" x2="55" y2="53" stroke="#333" strokeWidth="1.2"/>
        <line x1="65" y1="56" x2="64" y2="53" stroke="#333" strokeWidth="1.2"/>
        <line x1="70" y1="55" x2="70" y2="52" stroke="#333" strokeWidth="1.2"/>
        <line x1="75" y1="56" x2="77" y2="53" stroke="#333" strokeWidth="1.2"/>
        {/* Big smile */}
        <path d="M48 76 Q60 87 72 76" fill="#f1948a" stroke="#c0392b" strokeWidth="1.5"/>
        {/* Cheeks */}
        <ellipse cx="43" cy="72" rx="7" ry="5" fill="#f1948a" opacity="0.45"/>
        <ellipse cx="77" cy="72" rx="7" ry="5" fill="#f1948a" opacity="0.45"/>
        {/* Pocket pen */}
        <rect x="74" y="99" width="4" height="18" rx="2" fill="#E63946"/>
        <rect x="74" y="97" width="4" height="4" rx="1" fill="#c0392b"/>
      </svg>
    ),
    msg: "كل مصطلح تحفظه خطوة نحو هدفك! 💪",
    msgEn: "Every term you learn is a step closer to your goal!"
  },
  {
    name: "Karim",
    mood: "confident",
    svg: (
      <svg viewBox="0 0 120 160" width="120" height="160" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <rect x="22" y="95" width="76" height="60" rx="10" fill="#fff" stroke="#ddd" strokeWidth="1.5"/>
        <rect x="43" y="95" width="34" height="60" fill="#e8f4fd"/>
        {/* Tie */}
        <polygon points="60,95 55,110 60,150 65,110" fill="#E63946" opacity="0.85"/>
        {/* Stethoscope */}
        <path d="M80 107 Q90 118 84 128 Q78 135 70 131" fill="none" stroke="#1A6B9A" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="70" cy="131" r="4" fill="#1A6B9A"/>
        {/* Neck */}
        <rect x="52" y="82" width="16" height="16" rx="4" fill="#C8A882"/>
        {/* Head */}
        <ellipse cx="60" cy="63" rx="28" ry="30" fill="#C8A882"/>
        {/* Hair */}
        <ellipse cx="60" cy="39" rx="28" ry="11" fill="#2c1810"/>
        <rect x="32" y="40" width="56" height="8" fill="#2c1810"/>
        {/* Ears */}
        <ellipse cx="32" cy="64" rx="5" ry="7" fill="#C8A882"/>
        <ellipse cx="88" cy="64" rx="5" ry="7" fill="#C8A882"/>
        {/* Confident eyes */}
        <ellipse cx="50" cy="63" rx="5" ry="5.5" fill="#fff"/>
        <ellipse cx="70" cy="63" rx="5" ry="5.5" fill="#fff"/>
        <circle cx="51" cy="64" r="3.5" fill="#3d2b1f"/>
        <circle cx="71" cy="64" r="3.5" fill="#3d2b1f"/>
        <circle cx="52" cy="62" r="1.2" fill="#fff"/>
        <circle cx="72" cy="62" r="1.2" fill="#fff"/>
        {/* Confident smirk */}
        <path d="M50 76 Q58 82 70 76" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round"/>
        {/* Thumbs up arm */}
        <ellipse cx="22" cy="112" rx="8" ry="14" fill="#C8A882"/>
        <ellipse cx="18" cy="100" rx="6" ry="8" fill="#C8A882"/>
        <ellipse cx="22" cy="95" rx="4" ry="5" fill="#C8A882"/>
      </svg>
    ),
    msg: "أنت أفضل من الأمس! استمر 🔥",
    msgEn: "You're better than yesterday! Keep going!"
  },
];


// ── Registration Page ────────────────────────────────────────────────────────
function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({ name: "", college: "", university: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const GOLD = "#D4AF37";
  const DARK = "#16213e";

  function validate() {
    const e = {};
    if (!form.name.trim())       e.name       = "الاسم مطلوب";
    if (!form.college.trim())    e.college    = "اسم الكلية مطلوب";
    if (!form.university.trim()) e.university = "اسم الجامعة مطلوب";
    if (!/^[0-9]{7,15}$/.test(form.phone.replace(/\s/g,"")))
                                  e.phone      = "رقم هاتف غير صحيح";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
    try { localStorage.setItem("medlingo_user", JSON.stringify(form)); } catch {}
    setTimeout(() => onRegister(form), 900);
  }

  const Field = ({ id, label, labelEn, placeholder, type="text", icon }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:13, color: GOLD, fontWeight:700 }}>{icon} {label}</span>
        <span style={{ fontSize:11, color:"#9fb4d4" }}>{labelEn}</span>
      </div>
      <input
        type={type}
        value={form[id]}
        placeholder={placeholder}
        onChange={e => { setForm(f=>({...f,[id]:e.target.value})); setErrors(er=>({...er,[id]:null})); }}
        dir={id==="phone" ? "ltr" : "rtl"}
        style={{
          width:"100%", boxSizing:"border-box",
          padding:"13px 16px", borderRadius:14,
          border: errors[id] ? "2px solid #E63946" : "1.5px solid rgba(212,175,55,0.35)",
          background:"rgba(255,255,255,0.06)", color:"#fff",
          fontSize:15, outline:"none",
          fontFamily:"inherit",
        }}
      />
      {errors[id] && (
        <div style={{ fontSize:12, color:"#E63946", marginTop:4, textAlign:"right" }}>
          ⚠ {errors[id]}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"linear-gradient(160deg, #0f3460 0%, #16213e 60%, #0a1628 100%)",
      fontFamily:"'Segoe UI', Tahoma, Arial, sans-serif",
      padding:"24px 20px",
    }}>
      <style>{`
        input::placeholder { color: rgba(159,180,212,0.5); }
        input:focus { border-color: #D4AF37 !important; background: rgba(255,255,255,0.1) !important; }
        @keyframes regFadeIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }
      `}</style>

      {submitted ? (
        <div style={{ textAlign:"center", animation:"regFadeIn 0.5s ease" }}>
          <div style={{ fontSize:72, animation:"checkPop 0.6s ease" }}>✅</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginTop:16 }}>
            أهلاً {form.name}!
          </div>
          <div style={{ fontSize:14, color:"#9fb4d4", marginTop:8 }}>
            Welcome to MedLingo 🩺
          </div>
        </div>
      ) : (
        <div style={{ width:"100%", maxWidth:420, animation:"regFadeIn 0.5s ease" }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🩺</div>
            <div style={{ fontSize:26, fontWeight:900, color:"#fff", letterSpacing:1 }}>MedLingo</div>
            <div dir="rtl" style={{ fontSize:14, color:GOLD, marginTop:6, fontWeight:600 }}>
              سجّل للبدء في رحلة تعلّم المصطلحات الطبية
            </div>
            <div style={{ fontSize:12, color:"#9fb4d4", marginTop:4 }}>
              Register to begin your medical terminology journey
            </div>
          </div>

          {/* Card */}
          <div style={{
            background:"rgba(255,255,255,0.05)",
            border:"1.5px solid rgba(212,175,55,0.25)",
            borderRadius:24, padding:"28px 24px",
            backdropFilter:"blur(8px)",
          }}>
            <Field id="name"       label="الاسم الكامل"  labelEn="Full Name"   placeholder="اكتب اسمك هنا"     icon="👤" />
            <Field id="college"    label="الكلية"         labelEn="College"     placeholder="مثال: كلية الطب"   icon="🏛️" />
            <Field id="university" label="الجامعة"        labelEn="University"  placeholder="مثال: جامعة القاهرة" icon="🎓" />
            <Field id="phone"      label="رقم الهاتف"    labelEn="Phone Number" placeholder="+20 10XXXXXXXX" type="tel" icon="📱" />

            <button onClick={handleSubmit} style={{
              width:"100%", padding:"15px 0", borderRadius:16,
              background:`linear-gradient(90deg, ${GOLD}, #F4A261)`,
              border:"none", color: DARK, fontWeight:900, fontSize:17,
              cursor:"pointer", marginTop:8, letterSpacing:0.5,
              boxShadow:"0 4px 20px rgba(212,175,55,0.35)",
              fontFamily:"inherit",
            }}>
              ابدأ التعلّم ✨
            </button>

            <div style={{ textAlign:"center", marginTop:14, fontSize:12, color:"#9fb4d4" }}>
              بياناتك محفوظة على جهازك فقط 🔒
            </div>
          </div>

          {/* Decorative dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20 }}>
            {["#E63946","#D4AF37","#2A9D8F","#457B9D"].map((c,i) => (
              <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:c, opacity:0.7 }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Between-Session Avatar Screen ────────────────────────────────────────────
function AvatarTransition({ onContinue, message }) {
  const [avatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setBounce(b => !b), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #0f3460 0%, #16213e 60%, #1a6b9a 100%)",
      fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
      padding: 24,
    }}>
      <style>{`
        @keyframes avatarBounce {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Stars background dots */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: "fixed",
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 100}%`,
          width: 4, height: 4, borderRadius: "50%",
          background: "rgba(212,175,55,0.4)",
          pointerEvents: "none",
        }} />
      ))}

      {/* Avatar with bounce */}
      <div style={{
        animation: "avatarBounce 1.4s ease-in-out infinite",
        marginBottom: 8, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
      }}>
        {avatar.svg}
      </div>

      {/* Name badge */}
      <div style={{
        background: "#D4AF37", color: "#16213e",
        borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 800,
        marginBottom: 20, letterSpacing: 1,
      }}>
        {avatar.name}
      </div>

      {/* Message bubble */}
      <div style={{
        background: "rgba(255,255,255,0.1)",
        border: "1.5px solid rgba(212,175,55,0.4)",
        borderRadius: 20, padding: "18px 24px", maxWidth: 300,
        textAlign: "center", marginBottom: 32,
        animation: "fadeInUp 0.6s ease-out",
      }}>
        <div dir="rtl" style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
          {avatar.msg}
        </div>
        <div style={{ fontSize: 12, color: "#9fb4d4", fontStyle: "italic" }}>
          {avatar.msgEn}
        </div>
      </div>

      {/* The message passed from parent (score etc.) */}
      {message && (
        <div style={{
          background: "rgba(42,157,143,0.2)", border: "1px solid #2A9D8F",
          borderRadius: 14, padding: "12px 20px", marginBottom: 24,
          color: "#fff", textAlign: "center", fontSize: 15,
        }}>
          {message}
        </div>
      )}

      <button onClick={onContinue} style={{
        background: "linear-gradient(90deg, #D4AF37, #F4A261)",
        color: "#16213e", border: "none", borderRadius: 16,
        padding: "14px 40px", fontWeight: 800, fontSize: 16,
        cursor: "pointer", boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
      }}>
        متابعة ←
      </button>
    </div>
  );
}

// ── Small shared UI bits ─────────────────────────────────────────────────────
function BackBar({ onBack, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button onClick={onBack} style={{
        background: "#fff", border: "1px solid #ddd", borderRadius: 10,
        width: 36, height: 36, cursor: "pointer", fontSize: 16, flexShrink: 0,
      }}>
        →
      </button>
      <div style={{ fontWeight: 700, fontSize: 16, color: "#16213e" }}>{title}</div>
    </div>
  );
}

function modeButtonStyle(color) {
  return {
    background: color, color: "#fff", border: "none", borderRadius: 18,
    padding: "22px 16px", fontWeight: 800, fontSize: 17, cursor: "pointer",
    textAlign: "center",
  };
}

function ResultCard({ emoji, title, lines, onContinue }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "32px 24px",
      textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", marginTop: 20,
    }}>
      <div style={{ fontSize: 48, marginBottom: 10 }}>{emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#16213e", marginBottom: 10 }}>{title}</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>{l}</div>
      ))}
      <button onClick={onContinue} style={{
        marginTop: 18, background: "linear-gradient(90deg,#2A9D8F,#457B9D)",
        color: "#fff", border: "none", borderRadius: 14, padding: "12px 30px",
        fontWeight: 700, fontSize: 15, cursor: "pointer",
      }}>
        متابعة
      </button>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
// ── Best Academy Logo ────────────────────────────────────────────────────────
const LOGO_B64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCAEsASwDASIAAhEBAxEB/8QAHQABAAMAAwEBAQAAAAAAAAAAAAUGBwIDBAEICf/EAFAQAAEDAwIEAgUHBwgHBwUAAAEAAgMEBREGEgcTITFBURQiYXGBCDKRobHB0RUjNkJSkrMWGDdic3R1kzM0U1RVVnIXJCVDgqLhg5Sy0vD/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAwQFAgEG/8QAMhEAAgICAAMGAwgDAQEAAAAAAAECAwQREiExBRMyQVFxYYGRFCIjM1KhsfDB0eHxQv/aAAwDAQACEQMRAD8A/VKIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiJkeaAIo6bUdpp6kU8txpWSn9UyD6/Je9kjJGhzHNc09iDkFcxnGXJM9cWuqOSIi6PAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiqGqtQait00kdDa8U7e1SG83PtwO3xUV1yqjxSO663N8KLc57WgucQAO5PgoS5a0slsJa+sZM8fqQeufq6D6VlVwvVyujj6bWzzf1HOw0f+kdF4lj29rvpXH6mjX2ev8A7f0LzcuKE78st1EyMftzncfoHT61V7hqK63TIqq6Z7D+o07W/QFHIO/VZtuXbb4pF2GPXDwoL10F3uFrduoqyaD+q13qn4dlbYrNod1GHOuz923q4zYdn/px9SiDpu1TH/uup6A+QmaWFdvGshpxkt/Bo4V8JbUk/miStvE6vgw2vpoqlvi+P1Hfh9itVt13ZLjhpqfRpD+pUDb9fb61RDomsf8A6tcLXU57bKkfeF1S6H1BGMig5g845Gu+9XKsnMr6ra9v8orzpxp9Ho19krJGh7Htc09nNOQVyWOU1Fqeyu3U9Ncqbz2MJafeBkKyWDWeoaiYQTWp9aA7a57IzG5vvPzfsV6rtFSajOLTKs8NpbjJNF/RASR1RaRTCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCYCIgI+4WC13QH0uhglcf19uHfSOqzSpt2mp6maGGvqbbLG9zNtQzmRkg46OHUD3rW1hd1yLpWZyDz5P/wAisftThgovhT2aODxSbW3yJGfR9zbGZqMQXGH9ukkD/q7qGlhkgkMc0b4nju17S0/QV9gnlppBJBLJE8frMcWn6lMxaxuRjEVc2nuUP7FVGHH97usf8KXqv3/1/k0fxF6P9iDQAuIaAST2A7lWBlw0tKTNPZ6yKQf+TDPmNx+PULk7WLqQFlntlFbm+DwzfJ+8V73UFzlNfLf/AA87yT5KP1PJRaSvFc3mNoXRRYzzZ8Rtx8eq9rLba7R1rtQve9veG3Zcf3uyha6611ydurKuec+T3HA+HZeQ/NPuRWVw8Ed+/wDpDgnLxP6GtykWbS09xoJKh0no3OYamV0pGQCM5OPoU3bZH1FvpppDl8kTHuPmSASqhqm7/k/R1DRiPc+tpmxZJxsAYMn39lNaKvP5YskbjHy305EDgD0O0DBHwwvoaro993afkuRjzrl3fG/UnkRFeKwREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARQerdbWDQtDBcNRXBlvpJ5xTsme1xbzCCQDtBx0aep6LhauIOkb41rrZqezVm7sIayNx+jOUBPqDuWi7NdJ31E9KWzP6ufG8t3HzI7ZUoLhRuGRVQEeyRv4r76fSf7zB/mD8VxOuM1qa2dRnKL3F6KjVcLrfJn0atqYT5PAePuKg67hrdqbLqaWnqwPAHY76D0+taV6fSf7zB/mD8U9PpP95g/wAwfiqc+zaJeWvYsRzLY+ezEJ7fWUtT6LNSzRznoIyw7j7h4/BTlv4f3qtAdLHHSMP+2d637o6/YtRNXRF7XmenLm9jvbkI640TBl1XTtHmZGj71Xh2RWnuT2iaXaE2vurRTqThZTtANXcZXnxETA0fXlS1Nw+sNM5rjTSTFpz+dkJB+AwF0X3itoXTUbn3XVlnpy3vGKlr5P3G5cfoVgtF1pL5a6S6UEhlpKyFk8Ly0t3McAWnB6jofFXYYVEekV/JWlk2y6yKNxRnbzrdTNABYx7yB4AkAfYV7eFs4NurYfFs4d8C3/4UhqrRbdRVEVSyr9HlYzlnLNwcM5Hj0PUr06V0qzTUMwNQZ5ZiC523aAB2AHxKqRx7VmO1rl/wndsPs/Bvn/0nkRFqlEIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAmeuFHXq/0NhgEtZLt3Z2MaMuefYF0aXvZ1BQSVpiEX550bW5zhoxj49VF30OPu98zvu5cPHrkTCIilODDfleW6ru/D2z26ggfUVdVfKeGGJnzpHujkAaPeSqZpv5E1O+2RSai1PUMr3tDnxUMLTHEf2dzurvfgL9Dap01JqGt09O2WJjLTc23B7XtJ5gEUrAB5HMgOfYp8dkB+b/5k2mh21Veh/8ATi/BP5k2m/8Amq9/5cX4L9IIgP5+cfOFNDwi1Jb7Tb7lWV0dVRekufUBoLTzHNwNvh6qt/Av5Odo4r6Mlv8AX3y5UU0dbJSiOBrC0hrWHPrdc+sV6vlsfp/Y/wDCR/GkWqfI1/omqf8AF5/4cSAhf5k2m/8Amq9/5cX4J/Mm00e+qb0ffFF+C/SCID8Z8WPkl1ui7BU6g03dpbtTUcZlqaaaIMmZGBlz2lvRwA6kYBwD3X6j4Vf0ZaU/wik/hNVir6UVtDUUrg0tmidGQ4ZHUEdR8VHaOscmmdJWayTTMmkt1FDSukYCGvLGBuQD2BwgJhERAEREATIRQWp9SDTfokzoDLHNIWPAOCG4zke1cWWRrjxS6HUIOb4Y9SdReK1XejvNMKiimbLH2PgWnyI8CvauoyUltdDxpp6YREXp4EREAREQBERAEREAREQBERAEXRXVsNupJauocWxRDc4gZwPcuVNVQVsDJ6eVssTxlr2nIK84lvh8z3T1syviHO+TU0rHuO2KJjWjyBGT9ZV30Fb5rfp2Js7Sx8z3TbSOoB7Z+AC7hp+33K7Pu1TAJpWkRxhx9Ubem7Hic57+SnAAOyz8fEcbpXSfXei1bkKVca0ugREWiVAiIgCIiA/Gvy2P0/sf+Ej+NItU+Rp/RNVf4vP/AA4lm/yw6CO5cSrHTyV1JQg2fPNqnODOk0nTLQTn4K9fJrvNBobh3JbqqqiuBmuEtQ2a3u5sWC1gxk4O4beox4hR2XQr8b0dwrlPwrZ+hEVR/wC02zf7Kt/yx+Kf9p1l/wBlW/5Y/FQ/baP1Ik+zW/pZbkVZp+IlhmcA+eaHPjJEcfVlTtFcqO4x8yjqYp2ecbgce/yUsL65+GSZHOqcPEtHpREUpwEREAVQ4lW+ars8VRE0uFNLveAOzSME/DorevjmhwLXAEHuD4qK+pWwcH5ndU3CakvIzPhhPIy8VMIJ5ckG5w9ocMH6ytNUJR2Cgsl0NXRwiH0oGJ7QfVB+cMDwzj7FJV9xpbZSvqayZsMTO7nfYPM+xQYdboq4JvoS5Fits4orqelF1087KmCOaPOyRoe3PkRkLsVxPZXCIiAIiIAiIgCIiAIiIAiIgIHXPN/kvXcpuTtG7H7O4Z+pUDR2pJ7LXiFzyaSfIcw9mux0cPLrgFa49jZGOY9oc1wwQRkELOtQ8PHQ1DJbXKwRyyBghkJGwnyPksrOpt7yN9XkXsWyvgdU/M89y4gV0MgpbWY44Ihs5rmbnSHxPXoBnKuGi5bhV2cVtynfLLUvL27gBtZ2GAO2cZ+KrVp4Yy85r7nVR8oHJihyS72Fx7fBaDFG2GNsbGhrGgBrR2AHgusKu9ydlz9keZM6lFQrXzOSIi0ykEREAREQH41+WwSOIFjx/wAJH8aRXP5N1thr+A1zkkaDJT3Soljf4tIjiz9IVM+Wx+n9j/wkfxpFf/kvf0B3v+/1X8KJQ5EU65J+hJU2ppr1LBpmKOfUFvilY2SN8wDmuGQR17ha3/J+zkdbXRf5DfwWTaV/SW2/27fvW0jsFm9kwjKuW15l3tCTU1p+RXLloKy17Dy6YUkng+A7cfDsVnl0tty0hdAGzPjf86KeI4Dx/wD3cFbMqzxBt7KzTs020cymIlafHGcEfQfqU2bhwcHZBakufIjxsmSkoSe0xo3Vwv8AC6nqQ1lbEMuA7SN/aH3hWZYjp+vfbL1R1LSQGytDva0nBH0Fbcuuzsl3V6l1RzmUquf3ejCIi0CoFWNdVd0tlFBcLbUOiET9srQ0OBDuxIPkR9as66aykirqaSmnYHxStLXNPiFFdBzg4xemd1yUZJtbM8tGvquqkFLc+U7cQ6KZrdu14OQCO2DjHxUFqm/zX25SPc8+jROLYWeAb5+8qfuPDCrjlJt9XDJET6rZstcPiAQV36V0AwuZXXORkoa4lkDercg4y4+PUdlhyqy7NUz+pqKzHh+JEt+nOb+QaDngiQU7AQfcpFAAOwRb8I8MVH0MmT22wiIujwIiIAiIgCIiAIiIAiIgKzcNcU1nvUtur6eSNjdpbMw7gQRnJHfz7ZXqul6oBS0VwFQx9IJjIZGnIOGOOPfnwVe4haZrKypZdKOJ0wEYZLGwZcMZw4DxHVUUVkzKOShLjynStlLT+q4AjP0H6liX5ttM5QmuXkaVWNXZFSi+fmXui13U3rUFDRUkAp6V8uH7vWe8YJ9w7eCviznh7pupFc27VUTooo2kQhwwXkjGceWMrRldwJWSrc7erf7FbKUIz4a/IIiK8VgiIgCIiA/Gvy2P0/sf+Ej+NIr/APJe/oDvf9/qv4USoHy2P0/sf+Ej+NIr/wDJe/oDvf8Af6r+FEorvy5ezO6vGvcself0ltv9u371tA7BYvpX9Jbb/bt+9bQOwWd2R+XL3LvaHjXsFDaxkbHpm4l3YwlvxJAUys/4j6hjkjbZ6d4c4OD5yD83HZvv8foV3MtVdMmyrjwc7EkUighdUV9PCwZdJKxo+Lgt3WacPdOSVNY271DCIIc8nI+e/wAx7B9q0tVOyqnCtyfmWc+xSmoryCIi1CgEKIgKBT8Q57bc6qjucHOijnewSR9HsAce48cD4qyUV5oKG1SVk9TGyn58u15PzgXkjHn37Kka805U0dznuUMbpKWodvc5ozy3eOfZ45VbfVT1UFNRjc9kO7lsb16uOSceawHm3UTlCfPXQ1VjV2xUocvU1Oy6yh1Bdn0dHSyCGOMvdNIcHuAMN+KsapvD7TdVao562tYYpZwGsid85rQc5PkT5K5LWxJWSrUrerKF6hGbUOgREVkhCIiAIiIAiIgCIiAIiIDqdV07JhC6eJspGQwvAcR7lF3ukpm1FvqXU8JeKtjXPLBnDg5vU+8hV7ifbHSU9LcY4yTC4xyOA7NPUE/H7VT4NR3CO3zUEk8ksEjRs3uyYnAggtPw7LKyc5Qm65x9mXqMVzipxfuXK68Qmenw0VraHt5zWSTuHQjcAQ0ferwDlYxpa0TXi808cTDy4ntklf4MaDn68YWzhSdn3WXKU5/I5y64VtRgERFolMIiIAiL497WNLnHAAySewQH42+Wx+n9j/wkfxpFf/kvf0B3v+/1X8KJYz8qbXlt1xxK/wDCJ2VNHa6VtCKiM5ZK8Oc55afEAuxnxwfBX75LWvLYzQepNF1VRHDcC6StpWPIHPY5jWuDfNzSwHHfB9hUd35cvZndXjXuaXpX9Jbb/bt+9azWzXWN+KKkpZmY6OlnLDn3BpWS6U/SW2/27fvW0jsFl9lLdUlvXMvZ71NexR77LrieJ7IqWKGI9/RHhzyPeev0BU+2Pt9triL5bquZ7XZMZdtx72kZP0raF4brZKG805hrYGyDwd2c32g+CmvwJSfHGW2vXmiOrKUVwuPL4HTY7/a7xCG2+ZnqAfmSNrmD/p8vd0UosZvdqq9KXgMjme0t/OQTt6Et/HwIWjaO1K3UFAebtbVw4bK0dj5OHsP2rrFzHOTqsWpI5vxlGPeQe4lgREWgVAuE7+XC9/7LSfqXNcZGh7HNPZwwV4+gKXpjX0dwfFQ3NojnkOxsoHqSE9gR4H6lPacpaZtEamOCKN8ssr9zWAHHMdjr7sLJrtbKmyXGSlmaWvjdljvBwz0cF31+oa6sp4aRs8kVJDGGCNjsB2B1c7Hck5KwKu0JQ5XLbRrTw1PnW9Jmyx1dPM90cU8T3s+c1rwS33hdqqXDe2Gjsz6qSPZJVSbhkdSwDA+8q2raosdlanJa2ZtsFCTinvQREUxGEREAREQBERAEREAREQHGSNkrCx7Q5rhgtIyCFXazh/Yap+9tPJAT35MhaPo6hT1bDNPSyxQTuglc0hsjQCWHwPVZTJrDUtsq5aeaucZInlj2vjaRkfBUM26qvXex2vkWsauye+7lplohvtHpXTTWCGNtY18kHKaMb5WHBc72dj8VNaPvEl6scNTO7dO0mOQ4xlwPf6MLKr1dPyxV+mOjEckgHMY35u/sXD3gD6FfeH7Ra9OyVdZIIYZpt7S84GOjQfiVUxMqU7uFeFL+snyMdRr4n4m/6i5IgOUW0ZwREQBVDVfCrTetKmea9C6ztnaGyQMulTFAQBj/AETHhnv6dVb0QGS/zV+E/wDy3J/99P8A/uums+Tnw101Sy3m2WGSCuommeCQ1kztj29QcFxB+K2BRWqv0cuX93f9iju/Ll7M7r8a9zK9KfpJbf7dv3raR2CxfSv6S23+3b962gdgs3sj8uXuXe0fGvYIiLWM8qPEqgbPY2VQb69NKDn+q7oR9n0KnaGr3UOpKUA4ZUEwvHnnt9YCvvEB4ZpaqB7uLGj37wsxsIcb5bw353pMeP3gsHOfBlRlH4Gti/ex5J/E3BERbxkhVzW9/msNuifTFonlma1u4ZG0dXfh8VYnvbGwveQ1rRkk9gFQ+JUZrbdb7hTnmUzScub1GHAbT7uiq5tkoUycepPjRUrEpdD2V9dbtY2qhZHE0zVNS2Igj14MDc/B/wCkd/aFIUGhLFQyCT0UzPHUGd5eB8OyzWx3p9iklqYWNfUFuyLf82PPd2PE4GFKW7U2pr3coKOG5PY+V2MtjaA0eJ7eAWXVmVTalZHcn8C7PGsimoS1E1ZrQ0YAwF9XGJjmRtY57nloALnd3e04XJbyMsIiIAiIgCIiAIiIAiIgCIiAKGvGkrVe5ObVU5E2Mc2N21xHt8/ipldNZVMoqaSoeyR7Y27i2Npc4+4DuuLIQlHU1tHUJSi9xfMqdfw4tsVFM+hbM+paN0Ylky1xHXaR5Ht8VDa21CyutdupaRnKp5mc2RmMbS07dhHhg5+peqt4pHcRRW7Lc/OnkwT8B+Kqd7ucV1qjUxQGmLyXyRbstDz3c0+3AyPNYWVfQoONHn1NSiq1yTt8jSNA3h90sjWTEulpXcouP6wxlp+jp8FZVmFPW1mjbDQyR4bVVs5nfE8d4g3AB8s5BV/sV6pr7QMq6ckA9HsPdjvEFaWHenFVSf3kink1abnHwtkgiIrxVCIiAKK1V+jly/u7/sUqqtr2+U9DZ56IPa6pqm8trAeoae7j5DCgyZqNUm/Qkpi3YkvUoGlf0ltv9u371tA7BYfY6yK3XijrJt3KhlD3bRk4WijiVY8dqz/J/wDlZXZl9dcGpy1zNDOqnOScVvkWtFU38TLK0ZbHWuPkIgPtKgbxxLqqmMw22D0UO6c153P+A7D61fs7Qogt8W/YqRxLZPWjv4l3uOZ0NpheHGN3Nmx4HHqt9/Un6FGcPbQ+vvbatzfzFH65Pm8j1R9/wXnsuj7rfphNIx8EDjufPMDl3ngHqStRtFppbLRMpKVm1jepJ7uPiSfNUaKZ5N3f2LSLVtsaau6g9s9qIojUuooNO0JmkG+Z/qxR5+e78B4rZnOMIuUnyRnRi5PhXUhOJN4fR26KgiJa6rJ3kfsDGR8SR9aitNX4u0rV0FRC2pcxzaenicM80yZ2t+BBPuXhuctXqfTTbpI7m1NDO9swaMYjdgggeQUZYb1HY5jUmm9JmZnlNc7axhIwXHxJx0HxWBbkv7R3m9Ra/b/01YULueDXNP8Af/wvMHDS0ejxCd1QZgwB7mS4DneJxjopuzaatli3Gjpw2RwwZHnc8jyyVVrdxQa+Rsdbbntycbqd27/2lXqGUTRtkDXNDgDhwwR7x4LTxVjT+9SltfAo3u+PKxnNERXisEREAREQBERAEREAREQBERAEREBWL3oC3XepdVMkkpJX9X8oDa4+eD4r5Q6DsdrjfLUNNSQ0gvqHDa34dAFaFQtb6XvFbI6rp6mauhzn0bsYx/VA6H7feqGRTXWnbGviZaqsnPUHPSK7quIQPp4Iq6GupYNzYJWyBz2NPXY7Hl4HyUpw/mmgor3Kx5YyOAPDvJ4DsFQlDo+918oYy3ywjsXzN2NH0/crdBYLppajljp2NulFUMIqoWt2StJGCWHxGPArLx4WO3vnFpf817l66cFX3W02fdKcQBXPjoroGxzvw1kzejXnyI8D9XuVjvGoqSxPpvTQ9sc7iwSAZDCOvXxwsYqGNhle2Jzy1p9UubtcPePAq+8QKeqq7FbKwtLmxAGbH6pc0dT8ftU+Pm2ume+bjoiuxq1ZHXJMvcE8dTE2WJ7ZI3jLXNOQQuay7QN4lgqKm3SPc6nlgkka39lzRk494yvml9eVVukjpri91RSHA3uOXxe3PiPYrUO0q2ouXLf7EEsKaclHno0usooa+HkzhxZkHDXuaentBBUU7RGn3uLn25rnHuTI8k/WpN9xpY54YHzxtknBMbS7G8ezz7helXZV1zfNJlaM5R6PRBfyG09/w2P9934p/IbT3/DY/wB934qdTK8+z1fpX0R731n6n9SCGh9PA5/JkR97nH717qSw2uhINNQU0Tv2mxjP091z/K1EY6mVtTE5lLnnOachmBnr8Fm931vWXi4RRQOfS0XNZ6jTh0g3D5x+5VrrcfHSelt+hNXC27a29GnVdZT0FO+oqZWRRMGXPecALyWW+U19ppamlDxEyQxhzxjdgA5x5dVnGv7tNXXyWkLyKelIa1mem7GS4+3qpqwQVdv4fXGYhzHStklj8w0tAz9RK4Wc5XShFco7/Y6eKo1qTfN6Pmo+IbhOaS0Fu0O2vqSM569do+8qP4mGQ3il3EmP0YFn7xz9yrFviilrImTNlfHuGY4m5e/+qPaVfrlpq8ari9JrjBQOjaRTUoG4tB/bd8PBZ6styoTXVvWkW3CuicX7kDpCCKqifS1tdBSUD5Q+VjpQ19QQOjO/Rvn5q2XHh9ZrkedTl9I53X8wRsPwPT6FQarSd7pJTG+2VDznAdG3e0/EK7aI01drWBPWVksETh/qYO4e92ex9ykw1xfg2V7+JzkPX4kJ/IkLBoi3WKb0lrpKmoHRskoHqe4DsfarEiLarqjWuGC0jMnOU3uTCIikOQiIgCIiAIiIAiIgCIiAIiIAiIgC6/SIef6PzY+dt38vcN23OM474z0yuxYrxx1JJFqGx6X0ZTQP19c5WOhrmj85b6Zpy573fsEB3qnLSA4kE4QGxXCvgtlHLV1LwyKJu5x+4e1Y/f8AU9bfqp0kkr46cH83A13qtHt8z7Vb5dawacq6ay67nt8ElVKynoq7bsgr5NuSOWSTG4dM5Jblww7JwLSLFaTK2dtupOYOoeIm5H1KjmY1l+oxlpFrHuhVza2zMaa30FqtTq29075p6sYpaYPLH7fGQnwC89vvl6MzKOiqp3Nmdy2QSHmNOemMO8Fdb3w/fea6atfdZBJIejXRAtaPBo69guEXDt1DRPFFcSyueNpndH2b4tbg+rnxPUrNeFepagtJe22XFk1OO5Pbf0RV45XaPv8Az5WUNW9rXNMVPKdrc9+mOnuULcHUklQ+SibJHC8kiOTGWezI7jyU0/QGoG1BiFKx4z/pRK3Yfb5/UvWHWTSUc1LUQMu9ycNsoIxFF/VyftHX3KtKqbWprhjvz/u2TKyKe4vil8P7yOOsJHS2bT72vbIG05a57HZw/DenTxU/w+1PUXPmW2teZZYmb45D85zexB8yOnVZ3VVDJ5HOhp2UzHHPKjc4tz8SrBoSeK23+GWtLoGVETmQve3DXkkY6+XTupMfJf2lST0npP8Ag5upXctPqaws/wCIWp6mGpNopJHRNDAZ3tOHOz2aD4DHf3q/ucGtLicAeKx3Vs8dyvldXUe+amDmNdKGnaDtA7/DotPtO1wq1F83/BRwYKVm5Loe+zvMWhLwC5sYklaGZON/zdwHmoOz1VHRVrKqrikqBE4OZEzAD3DtknsF10NXFSzNfUUcVY1vaOZzg0fQVZJaa06xLfyYxttubW/6u4fm5QPIjsVjx/EUeFrcei9f8fI0Zfcb4lyfmeOnin1Re6mupm0EU7zzG0879xJA8G49bt4rw1WoLnVy8u41NTNE04fTh/LB8xgDopCl0DqCSpDHU7acNOea6UYHtGDlWWt4dflCFkk9wPp2MSTCLpL7XDPf2+PipY4+ROLai0/Py38iOV1MJLbTX8FVu1uo6ugju1jifHBG0R1MG4ufA79o+YPmvmmdW1VhqWiSV81E44fE52cDzbnsftV10/oZ1hrW1TLlJJlpZJHygGvafA9VNtsFpjkdI220YeepPJb+CtV4Fu1Ynwv++n8EE8qvTg1xI9kFRFUwMqIntfFI0Pa4HoQfFRUGoefqyr0/6JJH6NRxVnPc4bZRI97QGgHPQsOc47jCzu911o4q3u+8OI9QXXTVzsU7JGMt0rYxUx7WPbJjblwa5wBaCMEA+PSCt9y1pwr4oWij1pWy6otd5pjbaO701GROyQPL2slYzJJ79evQk56HG0t65mab0iA5APZF6AiIgCIiAIiIAiIgCIiAIiIAiIgCIiAEZBCpenOGFo0rrK/6wZNV1twuwYHS1TzK+nY0dY4z32nDenf1QOyuiID892Bt74m8VrnxFfbWy2bSsr7baqCtcad73gZkmG4Ya8ZBw8Aes0ZBblezR/FK86juutOIRr30OhLRTmClpZo2u9Kljblz8+ByQPVPXc0dcLYNVaZg1Tp+42aSrq6BlwidDLUUbwyXBGD1IPh06+CyLiXwxutJw90xw909RSHTMNTCL1WU/rTGFrtzncoes4ucS87c9QOmEBfdB8Tv5XWay19xsFysr7yzdSCRvOilOHOwHs+blrXOG8NyOyvGVTuHzrdJHVx2i+1F3tlG5lNSskYNtEGsAMQftBc4Z65yQMAlUHiTqusn4z2ax0l6uVqtdltNRdb1NQbi4xEeq1zQHbsENONp+eUBt6i71py3X2LZVwDePmys6Pb7j9xWQW3jhqSx8F6bW2orMKusmuLaSkiP/d33CB59SXABDXEbjjGDt6YytIn13+Q6SsrNV2x9jpKKmFTLVmZs8GC4N2At9YvyQMbeuemVzOEZrhkto9jJxe0crfw6s1FKJZRNVkHIbM4bR8BjPxXs1dYheLLJBBA108QDoOoGCPAHwyF5o+IthET5Kx1dbSxkchZX0UsDtr37GH1m9cu6YHUeIC5R8SdGTOljGqLMHwnErH1bGujPk4Egj4qFYtSg4JaTJHdNyUm+aPlwgu0+iBAyOR1wfBGx7AfW6kB3xxnKkLHZILdZIKB8EZywc5pAIe4j1s+alemF0UVfS3GmbU0dRHUQOLmiSN25pLXFpGfYQR7wuo0RUuJ8+Wjx2Nx4fjsrVXw2s9RMZInVFM0nJZG8FvwyDhTtpslDZacQ0cDYx+s/u5/vPioMcRrdWy1rLHb7pf20EjoaiW3QtdGyVvzow97mte4eIaTjseq82t+I0emOHEmsqOimqvUgkio5WOjlfve0Fhb3a4Au6eBHVeQxqoS4oxSYldOS1J8i6dl5jcqMVXonpUHpOM8nmN3/ALucrMeJF9n4hcEq7Uugr7WU8gpjWRPpJNj3tZ1kifjqHBocCAR1Hkqrq+w6U17wAZre12+htV1pLcLlT11IwRTQVEf+kZzB6xy5rm9SeuD3U5GXGk4pT6m1JqOyU00OmTphzJKw3KMSSzx5yXABwayMgY3ZccOBwMqvcQKjiPYeIVHcdAXOluFvvdEaltpr5N0FRNEG72wuONjnRlrwA5oO1564URV6R1NdL1w24j0+n23W7VlBFT36hla1okZywRM7f6rXDOevXIZjstZo9HVVzeyp1BJDH6PXRV1BR0DnNZQ8uMsDOZ0L8hzi7AaDnGCO4GOW/h3qHiSyfXdBSP0br6iv5dtqQ7Ah5ULXMf0Be3Ac5vQgglvY5H6JpqaQw0764wTVcbeskce1ocR12gkkA+8r0gAIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiID5tGDjplZhdeEV0gvmqNQac1IyK66kgbSzy3Kl5/o0YG3EJY5m3pjo4O7D46giA/O2qOD92smn+HOjKeC53mw2e5Guu1dAPW+duAZG12/HrPA2g46HOVb79HpG/6VuWmbzXX78l3m4CibX3MSRugn5fMa1r5mghrTG0AuGC523J6rWsZXCenhqoXwzxMlieMOY9oc1w8iD3QGRcEbpqeC7ag0RqOupr/Fp0w+h3uI7jIx4JbG89fXa3HjkZOSehXj4LUsNx4jcXpqiNssc13ZSua8ZDmtEgIOVstHb6S3Qej0dLBTQ5J5cMYY3J7nAUfZNJWLTdTWVNotlNRTVz+ZUvhbgzP6+s7zPU9e/VAeLiHqGbTGka2so2ukr3htLQxtaXOfUSuDIwGjqfWcDgeAKxvhPcarQ2rL7wnq6q4RUlyilrtPVdwidFK8vaeY3DgDndud72uPit4ulgtt6moprhTCd9BOKmm3PcBFKAQHgA4yASOvmV03HSVgu9yp7ncLPQVddSjEFRPC174eufUJ+b169EBknydNR2/SWiJNGamqKay32yVM7aimrZBE6RjpC8StLsb2nJGRnt7QrJf66564k03Db6Kto6U3uSoFaKXe0U8MUnLlc13QB8hbt3dx62MLSZKaCV7HyQxvcz5rnNBLfd5LswgMi0NwhvvDrW11fY7pSSaPujRJUW6saS8TkHc6NrGhrR4Y7EHGOgKm9GcEtP6Rs0dokqa+7UMdQ6qZSVkuaZkhduyIhhpAIBAduwevdaEiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAi4STRRFgkkYwvdtaHOA3HyHmUjnilc9scjHlh2uDXA7T5HyQHNeaG40k9KyqjqIzBIQGSF2A4k4Hf29EqK+Cmqqemke1sk4eWgkDo0Ak/WPpWfU/8rjYRb7XZrVWUnpEvo1W6raS1gmLmSBrmFuQOg79RnqOijnZwnUY7Lbqe7y01quTbZVU8dwpYGzHmgubGwn5xAB8Gux0PUL12y+UlwkdTskzUsDuYzaRjbIY3EZHbc1wCpFj0trOee4uvtWHb7XJQMDqrmtneXOLJCAxuMA4JIyVYtOWavhrG3Oup4qWeWOfm07JeYI3PmDwA7Azjr1x4riM5N70dSiktbJ6iuMFfSelQuPK3Pblw24LXFp7+1pXXb7zQXRzxR1LJ9jWPJZ1GHglpB8cgKpVjdbUEvoluslrq7cKucyCWs2OqIpHOd+z6mNxHjk48Mrr/AJNXm2aflittBDFWVVPTQmKjqhTCmcwyEua/acgbmDt62CneS9BwL1L8TheOC7UdTWCkhmbJIYRONvUFhcW5B7dwV4by+9wWendR0jK+qBa2phjnEJe0tIcWOIwDuweuOniFTCb5pCKmusOn6KjpIKc29lFLXPlkaC8Pa4uYx2STlu0ZxnJOOi6nZwvoeRhs0WkuNNWwRTwzNdHN/oyem7v2B9xXoWb2/TeuXTUhFTa7fDRA8tlRG2sYSdx3MAaxzHYeWk7+uDgYK0WASNhYJnNfIGgOc0YBPiQPBe1zcuq0eSil0ZzRdPptNsD/AEiHaX8sO3jBd+z7/Yu5SHIREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREBE6jbSSUrGTvxPuzA1rN7nuxjAZ+sCDg9uhzkYyPBaX19mpnCpsc75pCCTRyMkaABhoy5zXHA7k5ySTk5Vk2N3b9o3AYzjrhfUBWr1RRappo4LhpIVkcbxIxtwfE1rXds9C4j6F7aemvTGMhi/JNBAxoa2OOJ8u0DsB1YAPgphF5pb2e7fQjBQXTOXXf4NpmgfaV9FNeIhllfTT/1Zactz8Wu6fQVJIvTw8sVXM0EVNM6N4Gcxne13uOM/AgLqkfdJ3fmGU1Kz9qYGRx/9LSAP3iveiAjfQLoe93Gf6tM0D6yVxNJeo2nlXOlkPlNSH7WvClEQEUKm9wAc230lQPF1PUFrv3Xtx/7kN7qg/YbDdM+Y5JH08xSqICnw0Po9ybJdKSOioi8OgJcHZIdkMkI9VmD1GPnANBd0wbgDkZC+Oa17S1wBBGCD2IX0AAYHQIAiIgCIiAIiIAiIgCIiAIiIAiIgI3Ud3dYbNVXJtP6R6O0OMe/bkbgD1wcYBJ+C7LLdReKAVYhdD+dliLHHJBZI5h+tufiq9qjSuoL3c5G0V+pKSz1tO2nraaai50u0F2eU/eA0uDiDlrsYyFG1nDjUhukdZauINxtsENRPNFSNooZIg2UlzmOB+fhxOC7JAwBg9SBYW62t0kGoJWR1INie6OoEkZaJHBgf6juzgc46eIK6ariDZ7dLeobiZ6N9kpIaytL4yWtbLu2hh/XOWOHQd8eajItA3GnkjfV6ju19knmhbUur3sbHHBG/mYZGxrWhzixjSfEZPmu+9cNaS/12pZq6tlMN/oqejfFGwNMHJL3Me13idzyeox0HtyB31HEe1wWg3MUtwmjirvydUxxxNMtNNvDC1zd3Xq5vzNxIOQCFOXC7egVlDSihrqk1byzmQQ7o4MDO6R2RtH2qp1fCqCus9VaJ7nI6muNVNW3HEDd800j2u3xu7xFuza3GcA+eCpLWGlJr5crFdoqupb+Q6h1WKOADdVO24DQ5zgG9Mg5yCHOHTOUBNOuu2+R2owO/OUr6kTZGPVe1pbjz9YFd5uNE2vbbzV04rXR84U5kHMLM43bc5256ZxhUMaJ1DfqKardeLhperq5asugieyqkihmDPU5h6MO6MP8AUOG7nNB7OXbpfhXUWm7Mu971beL7WRiIN3baeJ3LbtaXtZ1eep+c7B6EgnqgL+vCbxTsu35MlD4ZXsDoXSANbOcOLmsOcuLQ3JGOgIXMWmkFzNzDH+lGPlbuY7G3y252/HGVVanT+o6a+SXSeshutvpJpaqgoKekZHViSRjm7TM+QN2tD3YwBkYz26gWaC6ie81ls5Lmmlghm5hPR4kMgwB7OWfpUONf2yW+NtlK6OsY6WGnFTTTMkYJX87LHYPQt5OD7XgKlxcEq256atVur9VXuhdFDmpZBOHyySCWWWLM2ATsMzgQBh2B2wCrTZOH1RRT+kXa+PukrZoZoy2ihphGYy52AIwMgueT1yfacoCXqdW0FDcquiro6mjZTRNl9Knj2wyglrSGOzl2C9gPTALh1Xsrr/a7bI+KrroIZGMZI5jnesGvfsa7HfBedoPmq5qDh9V3LUjdR2rVFztNw5Hoh2xxTxthOCQxj2+qS4NJPXt26qFtVLrK7Q0Vopqi+6bdQRy+m3KtpqWZ1a9zss2Dc8AZ3OwOjRhvUnoBpijrNeob02sdFG+P0WrlpHB/cujdgn3HuPYq3VUl+g0DBZobXcK+4VdM6kmklrY4XwOcCDK+RrugGS783uI6AKI1TpK73ien07a6u7UMdRUGtudwEUZpZmOi5b43NJy8uIB24wCST2GQNMRZhpXhbX6PvFrnpLve5bdDI+OS3yV5niaAJNkxL9u0EFuY2NwDjHQErRIrXSw3Ga4sY/0mZoY9xkcQQO2Gk7R28AEBwrLxT0VxoLfKH82uMgiIHT1G7jn4LupbhS1slTFTzMlfSy8mYN/8t+0O2n24c0/FZvfbrdNaVsFHZae+Wq+2OrqKh0zrfthAEckbYxJMOW/mB7SC3dj53TGF3/yB11c6Ghlq+I90oqyF8dQ6OKjp3NY8AhzCWtbzG4wOowTk46gNAtOlNXw6oErW0ktLLDDDLIx7g7HM39AR3xsIPtUxW3CC3tidPzMSytiaWRufhzu2doOB5uOAPEqK09pZlggdtq3zVUtNHBLOWNbvc10jt4aOgy6Vxx2HQKo1mkOJN+s0unLxqTTjLbNF6PNWU1uldVTx9jlr5OWC4dHdCOp6IDSXzRxxGV72tja3cXk4AHnnyXTQXGjutJHW2+rgq6WUExzQSB7HjOOjh0PUFZfDwHdAySri1hd4Ly4QsFTTtENOY48AMfTsIbIC0bTuJ6eXZWjTnD6Wz3uK93DUVxulZBSyUUTDHFT07IXODscqNobuBHfx8ugQFmgulFU11RQw1UUlVS7edE12XR7hlufLIGVF3PV1PaG3ySqpp+VZ6ZlU8xDe6ZrmuOGt88sIx4lUpl80fpnUN+uj6qnm1IKuRotc1wZBIzIa0GKOZ7WjmNa1xe352fZhSNv0BqB1JRzM1ZcLNM+nbHVQUwjqScSve1omlaXHa2VzM464aemOoF8oquKvo4KuHfyp42ys3NLTtcMjIPUHr2K4XGuFupTUOgnmAc1pbC3c4AuALu46DOSfAArwUmlqSDT8Vjqamvr4WfOnqqhxnlO7dlz27STk+xefU9ov1XDRnTd1o7dPTuLXCspXVEUkZbj5oe07h0IOfMHugO63ast1xq307Zo27pxDSuDw4VQMDJ97CPDa/wCpeqvvUVvudst74pHPuMkkcbm/NaWRl5z7w0qpx8Obzb9kVl1nWWql5EMckMNDA7e9kYjLwXA7QWgYaOjSAe3RSlk0L+TKiGtrr7drxXMqBUunrXsxuET4yGNa0BjSJHHA8UB7v5UwCou9O6iro5LZEZjzIw0VLcE5i65cMjGcAZUja6+O622lr4gWx1MLJmg9wHNDh9qp920DMNZRalo7ldpTVSxxVtGJIuVyWj1QC7Dmsa4bi0FxduIx1UfarNf3axt01Mb9S6dtUEdB6HUGJkcz42PAnADi4sAIB8XEtwNrSUBeb9dxY7VPcDA6cQ7csa4A4Lg0n4Zz8F9r7xFb662Uckb3OuM74I3D5rXNifJ1+DCFSajQ1PqPXGpblU3G5U9eKJlupxHKOTHTyRAh3LIw5wlEh6nGQOil7Dw7itFfJdKu83K6XGepirJ5agtDDKyF8XqMAwxpa89BnsBnogLciIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAYREQBERAEREB0S0FJPUR1MtNBJPF8yR0YLme44yF3oiAIiIAiIgCIiA4iKNsjpAxoe4AOcB1IGcZPxP0rkiIAiIgP//Z";

function App() {
  const [view, setView] = useState("register");   // register | splash | home | subtabs | mode | flashcards | avatar | flashResults | quiz | quizAvatar | quizResults
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState(null);
  const [subtab, setSubtab] = useState(null);
  const [queue, setQueue] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  // On mount: check if user already registered
  useEffect(() => {
    try {
      const saved = localStorage.getItem("medlingo_user");
      if (saved) {
        setUser(JSON.parse(saved));
        setView("splash");
      } else {
        setView("register");
      }
    } catch { setView("register"); }
  }, []);

  // Show splash every time the panel becomes visible (only if registered)
  useEffect(() => {
    const handleVisible = () => {
      if (document.visibilityState === "visible" && user) {
        setView("splash");
      }
    };
    document.addEventListener("visibilitychange", handleVisible);
    return () => document.removeEventListener("visibilitychange", handleVisible);
  }, [user]);

  useEffect(() => {
    if (view !== "splash") return;
    const timer = setTimeout(() => setView("home"), 3500);
    return () => clearTimeout(timer);
  }, [view]);

  function openCategory(catId) {
    setCategory(catId);
    setView("subtabs");
  }

  function openSubtab(subId) {
    setSubtab(subId);
    setView("mode");
  }

  function startFlashcards() {
    setQueue(TERMS[category][subtab]);
    setCardIndex(0);
    setKnownCount(0);
    setView("flashcards");
  }

  function startQuiz() {
    setView("quiz");
  }

  function advanceCard(q) {
    if (cardIndex + 1 < q.length) {
      setCardIndex(i => i + 1);
    } else {
      setStreak(s => s + 1);
      setView("avatar");
    }
  }

  function handleKnow() {
    setXp(x => x + 10);
    setKnownCount(k => k + 1);
    advanceCard(queue);
  }

  function handleStudyMore() {
    const current = queue[cardIndex];
    const newQueue = [...queue, current];
    setQueue(newQueue);
    advanceCard(newQueue);
  }

  function handleQuizFinish(score) {
    setQuizScore(score);
    setXp(x => x + score * 10);
    setStreak(s => s + 1);
    setView("quizAvatar");
  }

  const currentCategory = CATEGORIES.find(c => c.id === category);
  const subtabList = category ? SUBTABS[category] : [];
  const currentSubtab = subtabList.find(s => s.id === subtab);
  const currentSubtabLabel = currentSubtab ? `${currentSubtab.label} · ${currentSubtab.en}` : "";
  const activeTerms = category && subtab ? TERMS[category][subtab] : [];

  if (view === "register") {
    return <RegisterPage onRegister={(u) => { setUser(u); setView("splash"); }} />;
  }

  if (view === "splash") {
    return (
      <div onClick={() => setView("home")} style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)",
        color: "#fff", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
        cursor: "pointer",
      }}>
        <style>{`
          @keyframes medlingoPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.85; }
          }
          @keyframes medlingoLoad {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
        <div style={{
          width: 160, height: 160, borderRadius: "50%",
          background: "#fff",
          border: "4px solid #D4AF37",
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 22,
          boxShadow: "0 0 0 8px rgba(212,175,55,0.18), 0 8px 32px rgba(0,0,0,0.4)",
          animation: "medlingoPulse 1.8s ease-in-out infinite",
        }}>
          <img src={LOGO_B64} alt="The Best Academy" style={{ width: "115%", height: "115%", objectFit: "cover", marginTop: "-8%" }} />
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 1 }}>MedLingo</div>
        <div dir="rtl" style={{ fontSize: 14, color: "#9fb4d4", marginTop: 8 }}>
          تعلّم المصطلحات الطبية بالإنجليزية
        </div>
        <div style={{ width: 140, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.12)", marginTop: 34, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg, #E63946, #F4A261, #2A9D8F, #457B9D)",
            animation: "medlingoLoad 3.5s ease-in-out forwards",
          }} />
        </div>

        {/* Powered by */}
        <div style={{
          position: "absolute", bottom: 32,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}>
          <div style={{ fontSize: 11, color: "rgba(159,180,212,0.7)", letterSpacing: 1, textTransform: "uppercase" }}>
            Powered by
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: 20, padding: "6px 14px",
          }}>
            <img src={LOGO_B64} alt="The Best Academy" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", background: "#fff" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#D4AF37", letterSpacing: 0.5 }}>
              The Best Academy
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "#f5f7fa",
      fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
      padding: "20px 16px 60px",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 460, margin: "0 auto 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#0f3460,#16213e)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>
            🩺
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#16213e" }}>MedLingo</div>
            {user && <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>أهلاً، {user.name.split(" ")[0]} 👋</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: "#fff3cd", color: "#856404", borderRadius: 12, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>
            🔥 {streak}
          </div>
          <div style={{ background: "#d1fae5", color: "#065f46", borderRadius: 12, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>
            ⭐ {xp}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        {view === "home" && (
          <>
            <div style={{ fontSize: 15, color: "#555", marginBottom: 16, textAlign: "center" }}>
              اختر فئة لتبدأ التعلّم
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => openCategory(cat.id)} style={{
                  background: "#fff", border: `2px solid ${cat.color}33`,
                  borderRadius: 18, padding: "20px 12px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}>
                  <div style={{ fontSize: 26 }}>{cat.label.split(" ")[0]}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#16213e" }}>
                    {cat.label.split(" ").slice(1).join(" ")}
                    <span style={{ fontWeight: 400, color: "#999" }}> · {cat.en}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>{cat.desc}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {view === "subtabs" && currentCategory && (
          <>
            <BackBar onBack={() => setView("home")} title={`${currentCategory.label} · ${currentCategory.en}`} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              {subtabList.map(sub => (
                <button key={sub.id} onClick={() => openSubtab(sub.id)} style={{
                  background: "#fff", border: `2px solid ${currentCategory.color}33`,
                  borderRadius: 14, padding: "16px 10px", cursor: "pointer",
                  fontWeight: 700, fontSize: 14, color: "#16213e",
                }}>
                  {sub.label}
                  <span style={{ fontWeight: 400, color: "#999" }}> · {sub.en}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {view === "mode" && currentCategory && (
          <>
            <BackBar onBack={() => setView("subtabs")} title={currentSubtabLabel} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
              <button onClick={startFlashcards} style={modeButtonStyle(currentCategory.color)}>
                🃏 بطاقات تعليمية
                <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.85, marginTop: 4 }}>
                  {activeTerms.length} مصطلح
                </div>
              </button>
              <button onClick={startQuiz} style={modeButtonStyle("#457B9D")}>
                📝 اختبار سريع
                <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.85, marginTop: 4 }}>
                  {activeTerms.length} سؤال
                </div>
              </button>
            </div>
          </>
        )}

        {view === "flashcards" && queue[cardIndex] && (
          <>
            <BackBar onBack={() => setView("mode")} title={`بطاقة ${cardIndex + 1} من ${queue.length}`} />
            <div style={{ marginTop: 16 }}>
              <FlashCard
                term={queue[cardIndex]}
                onKnow={handleKnow}
                onStudyMore={handleStudyMore}
              />
            </div>
          </>
        )}

        {view === "avatar" && (
          <AvatarTransition
            onContinue={() => setView("flashResults")}
            message={`راجعت ${queue.length} مصطلح — عرفت ${knownCount} منهم 🎉`}
          />
        )}

        {view === "flashResults" && (
          <ResultCard
            emoji="🎉"
            title="أحسنت!"
            lines={[`راجعت ${queue.length} مصطلح`, `عرفت ${knownCount} منهم مباشرةً`]}
            onContinue={() => setView("mode")}
          />
        )}

        {view === "quiz" && (
          <>
            <BackBar onBack={() => setView("mode")} title="اختبار" />
            <div style={{ marginTop: 16 }}>
              <Quiz terms={activeTerms} onFinish={handleQuizFinish} />
            </div>
          </>
        )}

        {view === "quizAvatar" && (
          <AvatarTransition
            onContinue={() => setView("quizResults")}
            message={`نتيجتك: ${quizScore} من ${activeTerms.length} ⭐`}
          />
        )}

        {view === "quizResults" && (
          <ResultCard
            emoji={quizScore === activeTerms.length ? "🏆" : "✅"}
            title="انتهى الاختبار!"
            lines={[`النتيجة: ${quizScore} من ${activeTerms.length}`, `+${quizScore * 10} نقطة خبرة`]}
            onContinue={() => setView("mode")}
          />
        )}
      </div>
    </div>
  );
}

export default App;
