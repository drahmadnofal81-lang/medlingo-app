import { useState, useEffect, useRef } from "react";
import { TERMS } from "./data/terms";

const FONT_EN = "'Inter', sans-serif";
const FONT_AR = "'Cairo', sans-serif";
const PALETTE = {
  appBg: "#DCEEFF",
  card: "#FFFFFF",
  primary: "#22C55E",
  success: "#16A34A",
  blue: "#3B82F6",
  error: "#EF4444",
  text: "#1F2937",
  secondary: "#6B7280",
  border: "#D6E4F0",
};

function containsArabic(text = "") {
  return /[\u0600-\u06FF]/.test(text);
}

function getDefinitionText(term) {
  return term.definition || term.example || "";
}

function playSoundEffect(fileName, muted = false) {
  if (muted || typeof Audio === "undefined") return Promise.resolve(false);

  try {
    const audio = new Audio(`/sounds/${fileName}`);
    audio.volume = 0.25;
    const playPromise = audio.play();
    if (playPromise?.then) return playPromise.then(() => true).catch(() => false);
    return Promise.resolve(true);
  } catch {
    // Sound effects are optional; missing files should never interrupt learning.
    return Promise.resolve(false);
  }
}

function playPreparedSound(audio, muted = false) {
  if (muted || !audio) return Promise.resolve(false);

  try {
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise?.then) return playPromise.then(() => true).catch(() => false);
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}

function getArabicDefinitionText(term) {
  if (term.definitionAr) return term.definitionAr;

  const definition = getDefinitionText(term);
  const exactTranslations = {
    "The thick muscle layer of the heart that contracts to pump blood.": "الطبقة العضلية السميكة في القلب التي تنقبض لضخ الدم.",
    "A protective sac that surrounds the heart.": "كيس واقٍ يحيط بالقلب.",
    "The thin inner lining of the heart chambers and valves.": "البطانة الداخلية الرقيقة لحجرات القلب والصمامات.",
    "The main artery that carries oxygen-rich blood from the heart to the body.": "الشريان الرئيسي الذي ينقل الدم الغني بالأكسجين من القلب إلى الجسم.",
    "The maintenance of a stable internal environment in the body.": "الحفاظ على بيئة داخلية مستقرة داخل الجسم.",
    "The fluid found inside the body's cells.": "السائل الموجود داخل خلايا الجسم.",
    "The fluid found outside cells, including plasma and interstitial fluid.": "السائل الموجود خارج الخلايا، ويشمل البلازما والسائل الخلالي.",
    "The fluid inside blood vessels, mainly blood plasma.": "السائل الموجود داخل الأوعية الدموية، ومعظمه بلازما الدم.",
    "The fluid that surrounds and bathes body cells.": "السائل الذي يحيط بخلايا الجسم ويغمرها.",
    "The passive movement of particles from high concentration to low concentration.": "الحركة السلبية للجزيئات من تركيز عالٍ إلى تركيز منخفض.",
    "The energy-requiring movement of substances across a membrane against a concentration gradient.": "حركة المواد عبر الغشاء بعكس تدرج التركيز مع الحاجة إلى طاقة.",
    "Changes in membrane potential after stimulation.": "تغيرات في جهد الغشاء بعد التنبيه.",
  };
  if (exactTranslations[definition]) return exactTranslations[definition];

  const replacements = [
    ["The process, molecule, structure, or condition that", "عملية أو جزيء أو تركيب أو حالة"],
    ["A body process or response that", "عملية أو استجابة جسمية"],
    ["A body structure or process that", "تركيب أو عملية في الجسم"],
    ["A cell, tissue feature, or structure that", "خلية أو خاصية نسيجية أو تركيب"],
    ["A molecule or process that", "جزيء أو عملية"],
    ["A medication that", "دواء"],
    ["A disease process or condition that", "عملية مرضية أو حالة"],
    ["oxygen-rich blood", "الدم الغني بالأكسجين"],
    ["oxygen-poor blood", "الدم الفقير بالأكسجين"],
    ["blood vessels", "الأوعية الدموية"],
    ["blood cells", "خلايا الدم"],
    ["red blood cells", "خلايا الدم الحمراء"],
    ["white blood cells", "خلايا الدم البيضاء"],
    ["heart muscle", "عضلة القلب"],
    ["heart chambers", "حجرات القلب"],
    ["cell membrane", "غشاء الخلية"],
    ["cell membranes", "أغشية الخلايا"],
    ["body tissues", "أنسجة الجسم"],
    ["body cells", "خلايا الجسم"],
    ["the body", "الجسم"],
    ["the heart", "القلب"],
    ["the lungs", "الرئتين"],
    ["the brain", "الدماغ"],
    ["the kidney", "الكلية"],
    ["the liver", "الكبد"],
    ["the stomach", "المعدة"],
    ["the blood", "الدم"],
    ["the cell", "الخلية"],
    ["the membrane", "الغشاء"],
    ["the enzyme", "الإنزيم"],
    ["oxygen", "الأكسجين"],
    ["nutrients", "المغذيات"],
    ["hormones", "الهرمونات"],
    ["waste products", "الفضلات"],
    ["wastes", "الفضلات"],
    ["water", "الماء"],
    ["fluid", "سائل"],
    ["fluids", "سوائل"],
    ["cells", "الخلايا"],
    ["proteins", "البروتينات"],
    ["amino acids", "الأحماض الأمينية"],
    ["glucose", "الجلوكوز"],
    ["fatty acids", "الأحماض الدهنية"],
    ["energy", "الطاقة"],
    ["infection", "العدوى"],
    ["bleeding", "النزيف"],
    ["clot", "جلطة"],
    ["clots", "جلطات"],
    ["movement", "حركة"],
    ["moves", "ينقل"],
    ["carries", "ينقل"],
    ["carry", "تنقل"],
    ["transports", "ينقل"],
    ["transport", "نقل"],
    ["helps", "يساعد"],
    ["help", "تساعد"],
    ["forms", "يشكل"],
    ["form", "تشكل"],
    ["breaks down", "يكسر"],
    ["builds", "يبني"],
    ["produces", "ينتج"],
    ["release", "إطلاق"],
    ["released", "يُفرز"],
    ["controls", "يتحكم في"],
    ["regulates", "ينظم"],
    ["maintains", "يحافظ على"],
    ["protects", "يحمي"],
    ["supports", "يدعم"],
    ["stimulates", "يحفز"],
    ["inhibits", "يثبط"],
    ["increases", "يزيد"],
    ["decreases", "يقلل"],
    ["inside", "داخل"],
    ["outside", "خارج"],
    ["between", "بين"],
    ["from", "من"],
    ["to", "إلى"],
    ["through", "عبر"],
    ["with", "مع"],
    ["and", "و"],
    ["or", "أو"],
    ["that", "الذي"],
    ["a ", ""],
    ["an ", ""],
    ["the ", ""],
  ];

  let translated = definition;
  replacements
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([english, arabic]) => {
      translated = translated.replace(new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), arabic);
    });

  return translated === definition ? `ترجمة التعريف: ${definition}` : translated;
}

// ── Main Categories ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "organs",       label: "🫁 أعضاء الجسم", en: "Body Organs",   color: PALETTE.primary, desc: "أعضاء رئيسية" },
  { id: "anatomy",      label: "🫀 تشريح",       en: "Anatomy",      color: PALETTE.error, desc: "مقسّم بالجهاز" },
  { id: "physiology",   label: "⚡ فسيولوجيا",   en: "Physiology",   color: PALETTE.success, desc: "مرتّب بالموضوع" },
  { id: "biochemistry", label: "🧪 بيوكيمياء",   en: "Biochemistry", color: PALETTE.blue, desc: "جزيئات وتفاعلات" },
  { id: "histology",    label: "🔬 هيستولوجيا",  en: "Histology",    color: PALETTE.primary, desc: "أنسجة وخلايا" },
  { id: "bodysystems",  label: "🏥 أنظمة الجسم", en: "Body Systems",  color: PALETTE.blue, desc: "٨ أنظمة رئيسية" },
  { id: "pharmacology", label: "💊 فارماكولوجي",  en: "Pharmacology",  color: PALETTE.success, desc: "أدوية وتأثيرات" },
  { id: "pathology",    label: "🔴 باثولوجي",     en: "Pathology",     color: PALETTE.error, desc: "أمراض وآليات" },
];

const INTERACTIVE_CATEGORIES = new Set(["organs", "anatomy", "histology"]);

// ── Sub-tabs per category ────────────────────────────────────────────────────
const SUBTABS = {
  anatomy: [
    { id: "cardiac",      label: "🫀 القلب", en: "Cardiac" },
    { id: "skeletal",     label: "🦴 العظام", en: "Skeletal" },
    { id: "neuro",        label: "🧠 الجهاز العصبي", en: "Nervous System" },
    { id: "respiratory",  label: "🫁 الجهاز التنفسي", en: "Respiratory" },
    { id: "abdominal",    label: "🫃 البطن", en: "Abdominal" },
    { id: "muscle",        label: "💪 العضلات", en: "Muscle" },
  ],
  physiology: [
    { id: "introduction", label: "📘 مقدمة", en: "Introduction" },
    { id: "blood",        label: "🩸 الدم", en: "Blood" },
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
    { id: "main", label: "🫁 أعضاء الجسم", en: "Body Organs" },
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


// ── Flashcard Component ──────────────────────────────────────────────────────
function FlashCard({ term, onPrevious, onNext, canPrevious, canNext }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [touchDistance, setTouchDistance] = useState(null);
  const imageSrc = typeof term.image === "string" ? term.image.trim() : "";
  const imageBase = imageSrc.replace(/\.[^/.]+$/, "");
  const imageCandidates = imageSrc
    ? [".webp", ".png", ".jpg", ".jpeg"].map(ext => `${imageBase}${ext}`)
    : [];
  const currentImageSrc = imageCandidates[imageIndex] || "";
  const definitionText = getDefinitionText(term);
  const definitionArText = getArabicDefinitionText(term);

  useEffect(() => {
    setAiHint(null);
    setImageError(false);
    setImageIndex(0);
    setImageModalOpen(false);
    setImageZoom(1);
  }, [term]);

  useEffect(() => {
    if (!imageModalOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") setImageModalOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [imageModalOpen]);

  function changeImageZoom(nextZoom) {
    setImageZoom(Math.min(4, Math.max(1, nextZoom)));
  }

  function getTouchDistance(touches) {
    const [first, second] = touches;
    return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
  }

  function openImageModal() {
    setImageZoom(1);
    setTouchDistance(null);
    setImageModalOpen(true);
  }

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
        background: PALETTE.card,
        color: PALETTE.text, display: "flex", flexDirection: "column",
        alignItems: "center", padding: "24px 24px 20px",
        border: `1px solid ${PALETTE.border}`,
        boxShadow: "0 10px 30px rgba(31,41,55,0.08)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Image placeholder — replace with real image later */}
        <div style={{
          width: "100%", height: 160, borderRadius: 16, marginBottom: 20,
          background: PALETTE.appBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 64, border: `1.5px dashed ${PALETTE.border}`,
          overflow: "hidden",
        }}>
          {currentImageSrc && !imageError ? (
            <button
              type="button"
              onClick={openImageModal}
              aria-label={`Open ${term.en} image`}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "zoom-in",
              }}
            >
              <img
                key={currentImageSrc}
                src={currentImageSrc}
                alt={term.en}
                onError={() => {
                  if (imageIndex + 1 < imageCandidates.length) setImageIndex(i => i + 1);
                  else setImageError(true);
                }}
                style={{ maxWidth: "100%", height: "auto", maxHeight: "100%", objectFit: "contain", display: "block" }}
              />
            </button>
          ) : (
            "🩺"
          )}
        </div>

        {/* English term — big, bold, yellow */}
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 0, marginBottom: 8, textAlign: "center", color: PALETTE.text, fontFamily: FONT_EN }}>
          {term.en}
        </div>

        {/* Arabic translation — underneath */}
        <div style={{ fontSize: 20, fontWeight: 500, color: PALETTE.success, textAlign: "center", direction: "rtl", marginBottom: 10, fontFamily: FONT_AR }}>
          {term.ar}
        </div>

        {/* Definition */}
        <div style={{ fontSize: 13, fontWeight: 400, color: PALETTE.text, textAlign: "center", lineHeight: 1.7, opacity: 0.92, fontFamily: FONT_EN }}>
          {definitionText}
        </div>
        <div style={{ fontSize: 13, fontWeight: 400, color: PALETTE.secondary, textAlign: "center", lineHeight: 1.7, opacity: 0.92, direction: "rtl", marginTop: 8, fontFamily: FONT_AR }}>
          {definitionArText}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
          background: `linear-gradient(90deg, ${PALETTE.primary}, ${PALETTE.blue})` }} />
      </div>

      {/* AI Hint */}
      {!aiHint ? (
        <button onClick={getAiHint} disabled={loading} style={{
          background: "transparent", border: `1.5px solid ${PALETTE.blue}`,
          color: PALETTE.blue, borderRadius: 12, padding: "8px 20px",
          cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6,
        }}>
          {loading ? "⏳ جاري التحميل..." : "✨ تلميح ذكي من AI"}
        </button>
      ) : (
        <div style={{
          background: "#EFF6FF", border: `1px solid ${PALETTE.border}`,
          borderRadius: 14, padding: "14px 18px", maxWidth: 420,
          fontSize: 14, color: PALETTE.text, direction: "rtl", lineHeight: 1.8,
          whiteSpace: "pre-line",
        }}>
          🤖 {aiHint}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 420, direction: "ltr" }}>
        <button onClick={onPrevious} disabled={!canPrevious} style={{
          flex: 1, padding: "14px 0", borderRadius: 14,
          background: "#F3F4F6", border: `1px solid ${PALETTE.border}`, color: PALETTE.text,
          fontWeight: 900, fontSize: 24, cursor: canPrevious ? "pointer" : "not-allowed",
          opacity: canPrevious ? 1 : 0.45,
        }}>
          ←
        </button>
        <button onClick={onNext} style={{
          flex: 1, padding: "14px 0", borderRadius: 14,
          background: "#DCFCE7", border: `1px solid ${PALETTE.border}`, color: PALETTE.success,
          fontWeight: 900, fontSize: 24, cursor: "pointer",
        }}>
          →
        </button>
      </div>
      {imageModalOpen && currentImageSrc && !imageError && (
        <div
          onClick={() => setImageModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(0,0,0,0.78)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <button
            type="button"
            onClick={() => setImageModalOpen(false)}
            aria-label="Close image"
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              width: 42,
              height: 42,
              borderRadius: 21,
              border: "none",
              background: "#fff",
              color: PALETTE.text,
              fontSize: 28,
              lineHeight: "42px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ×
          </button>

          <div
            onClick={(event) => event.stopPropagation()}
            onWheel={(event) => {
              event.preventDefault();
              changeImageZoom(imageZoom + (event.deltaY < 0 ? 0.15 : -0.15));
            }}
            onTouchStart={(event) => {
              if (event.touches.length === 2) setTouchDistance(getTouchDistance(event.touches));
            }}
            onTouchMove={(event) => {
              if (event.touches.length !== 2 || !touchDistance) return;
              const nextDistance = getTouchDistance(event.touches);
              changeImageZoom(imageZoom + (nextDistance - touchDistance) / 220);
              setTouchDistance(nextDistance);
            }}
            onTouchEnd={() => setTouchDistance(null)}
            style={{
              maxWidth: "92vw",
              maxHeight: "86vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{
              maxWidth: "92vw",
              maxHeight: "76vh",
              overflow: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 18,
              background: "#fff",
              padding: 12,
            }}>
              <img
                src={currentImageSrc}
                alt={term.en}
                style={{
                  maxWidth: "86vw",
                  maxHeight: "70vh",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  transform: `scale(${imageZoom})`,
                  transformOrigin: "center center",
                  transition: "transform 120ms ease",
                  display: "block",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => changeImageZoom(imageZoom - 0.25)}
                style={{
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 16px",
                  background: "#F3F4F6",
                  color: PALETTE.text,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                −
              </button>
              <button
                type="button"
                onClick={() => changeImageZoom(imageZoom + 0.25)}
                style={{
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 16px",
                  background: "#DCFCE7",
                  color: PALETTE.success,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReferenceTerms({ term, onPrevious, onNext, canPrevious, canNext }) {
  if (!term) return null;

  const definitionText = term.definition || term.example || "";
  const definitionArText = getArabicDefinitionText(term);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{
        width: "100%", maxWidth: 420,
        borderRadius: 24,
        background: PALETTE.card,
        color: PALETTE.text, display: "flex", flexDirection: "column",
        alignItems: "center", padding: "24px 24px 20px",
        border: `1px solid ${PALETTE.border}`,
        boxShadow: "0 10px 30px rgba(31,41,55,0.08)",
        position: "relative", overflow: "hidden",
        boxSizing: "border-box",
      }}>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 0, marginBottom: 8, textAlign: "center", color: PALETTE.text, direction: "ltr", fontFamily: FONT_EN }}>
          {term.en}
        </div>
        <div style={{ fontSize: 20, fontWeight: 500, color: PALETTE.success, textAlign: "center", direction: "rtl", marginBottom: 10, fontFamily: FONT_AR }}>
          {term.ar}
        </div>
        <div style={{ fontSize: 13, fontWeight: 400, color: PALETTE.text, textAlign: "center", lineHeight: 1.7, opacity: 0.92, fontFamily: FONT_EN }}>
          {definitionText}
        </div>
        <div style={{ fontSize: 13, fontWeight: 400, color: PALETTE.secondary, textAlign: "center", lineHeight: 1.7, opacity: 0.92, direction: "rtl", marginTop: 8, fontFamily: FONT_AR }}>
          {definitionArText}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
          background: `linear-gradient(90deg, ${PALETTE.primary}, ${PALETTE.blue})` }} />
      </div>

      <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 420, direction: "ltr" }}>
        <button onClick={onPrevious} disabled={!canPrevious} style={{
          flex: 1, padding: "14px 0", borderRadius: 14,
          background: "#F3F4F6", border: `1px solid ${PALETTE.border}`, color: PALETTE.text,
          fontWeight: 900, fontSize: 24, cursor: canPrevious ? "pointer" : "not-allowed",
          opacity: canPrevious ? 1 : 0.45,
        }}>
          ←
        </button>
        <button onClick={onNext} disabled={!canNext} style={{
          flex: 1, padding: "14px 0", borderRadius: 14,
          background: "#DCFCE7", border: `1px solid ${PALETTE.border}`, color: PALETTE.success,
          fontWeight: 900, fontSize: 24, cursor: canNext ? "pointer" : "not-allowed",
          opacity: canNext ? 1 : 0.45,
        }}>
          →
        </button>
      </div>
    </div>
  );
}

const OPTION_KEYS = ["A", "B", "C", "D"];

function getTermDefinition(term) {
  return term.definition || term.example || term.ar;
}

function normalizeOptionValue(value) {
  return String(value || "").trim();
}

function sameOptionValue(a, b) {
  return normalizeOptionValue(a).toLowerCase() === normalizeOptionValue(b).toLowerCase();
}

function cleanOptionTermName(value, terms = []) {
  const option = normalizeOptionValue(value);
  const matchingTerm = terms.find(term => sameOptionValue(option, term.en));
  if (matchingTerm) return matchingTerm.en;

  const optionStart = option.split(/[:.!?–-]/)[0].trim();
  const matchingStart = terms.find(term => sameOptionValue(optionStart, term.en));
  return matchingStart ? matchingStart.en : optionStart;
}

function getTermKeywords(termName) {
  return normalizeOptionValue(termName)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word.length > 2);
}

function optionRevealsTerm(option, termName) {
  const text = normalizeOptionValue(option).toLowerCase();
  if (!text) return true;
  if (sameOptionValue(text, termName)) return true;
  return getTermKeywords(termName).some(keyword => text.includes(keyword));
}

function shuffleOptions(values) {
  const shuffled = [...values];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildMcqOptionSet(correctValue, wrongValues, fallbackValues = [], targetTerm = "", terms = []) {
  const correct = cleanOptionTermName(correctValue, terms);
  const distractors = [];
  const backupDistractors = [];

  [...wrongValues, ...fallbackValues].forEach(value => {
    const option = cleanOptionTermName(value, terms);
    if (!option || sameOptionValue(option, correct)) return;
    if (optionRevealsTerm(option, targetTerm)) {
      if (!backupDistractors.some(existing => sameOptionValue(existing, option))) {
        backupDistractors.push(option);
      }
      return;
    }
    if (distractors.some(existing => sameOptionValue(existing, option))) return;
    distractors.push(option);
  });

  backupDistractors.forEach(option => {
    if (distractors.length >= 3) return;
    if (distractors.some(existing => sameOptionValue(existing, option))) return;
    distractors.push(option);
  });

  const values = shuffleOptions([correct, ...distractors.slice(0, 3)]);
  const correctIndex = values.findIndex(value => sameOptionValue(value, correct));

  const options = OPTION_KEYS.reduce((items, key, index) => {
    items[key] = values[index];
    return items;
  }, {});

  return {
    options,
    correctAnswer: OPTION_KEYS[correctIndex >= 0 ? correctIndex : 0],
  };
}

function toOptionsList(options) {
  return Object.entries(options).map(([key, value]) => ({ key, value }));
}

function buildStandardQuestion({ term, id, question, prompt, correctValue, wrongValues, fallbackValues, allTerms, explanation }) {
  const { options, correctAnswer } = buildMcqOptionSet(correctValue, wrongValues, fallbackValues, "", allTerms);

  return {
    term,
    id,
    question,
    prompt,
    correctAnswer,
    explanation,
    optionsList: toOptionsList(options),
  };
}

function prepareQuizQuestion(quizQuestion, term, index, allTerms) {
  const originalOptions = quizQuestion.options || {};
  const originalCorrectValue = originalOptions[quizQuestion.correctAnswer];
  const asksForEnglishTerm = /english term/i.test(quizQuestion.question || "") || sameOptionValue(originalCorrectValue, term.en);
  const otherTerms = allTerms.filter(other => !sameOptionValue(other.en, term.en));
  const correctValue = term.en;
  const wrongValues = otherTerms.map(other => other.en);
  const fallbackValues = allTerms.map(other => other.en);
  const { options, correctAnswer } = buildMcqOptionSet(correctValue, wrongValues, fallbackValues, "", allTerms);

  return {
    ...quizQuestion,
    term,
    id: `${term.en}-${index}`,
    question: asksForEnglishTerm ? quizQuestion.question : "Which term means this definition?",
    prompt: asksForEnglishTerm ? (quizQuestion.prompt || term.ar) : (originalCorrectValue || getTermDefinition(term)),
    options,
    correctAnswer,
    optionsList: toOptionsList(options),
  };
}

function generateStandardQuizQuestions(term, allTerms) {
  const definition = getTermDefinition(term);
  const otherTerms = allTerms.filter(other => other.en !== term.en);

  return [
    buildStandardQuestion({
      term,
      id: `${term.en}-definition`,
      question: "Which term means this definition?",
      prompt: definition,
      correctValue: term.en,
      wrongValues: otherTerms.map(other => other.en),
      fallbackValues: allTerms.map(other => other.en),
      allTerms,
      explanation: `${term.en}: ${definition}`,
    }),
    buildStandardQuestion({
      term,
      id: `${term.en}-arabic`,
      question: "Which English term matches this Arabic translation?",
      prompt: term.ar,
      correctValue: term.en,
      wrongValues: otherTerms.map(other => other.en),
      fallbackValues: allTerms.map(other => other.en),
      allTerms,
      explanation: `${term.ar} means ${term.en}.`,
    }),
  ];
}

function buildQuizQuestions(terms) {
  return terms.flatMap(term => {
    if (term.quizQuestions?.length) {
      return term.quizQuestions.map((quizQuestion, index) => prepareQuizQuestion(quizQuestion, term, index, terms));
    }

    return generateStandardQuizQuestions(term, terms);
  });
}

// ── Quiz Component ───────────────────────────────────────────────────────────
function Quiz({ terms, onFinish, onSound }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const [questions] = useState(() => buildQuizQuestions(terms));

  const current = questions[qIndex];
  const currentTerm = current.term;
  const promptFont = containsArabic(current.prompt) ? FONT_AR : FONT_EN;

  async function getAiFeedback(isCorrect, term, chosenAr) {
    if (current.explanation) {
      setAiFeedback(current.explanation);
      return;
    }

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
    const correct = opt.isCorrect ?? opt.key === current.correctAnswer;
    onSound?.(correct ? "correct.mp3" : "wrong.mp3");
    if (correct) setScore(s => s + 1);
    getAiFeedback(correct, currentTerm, opt.value);
  }

  function next() {
    setSelected(null);
    setAiFeedback(null);
    if (qIndex + 1 >= questions.length) {
      onFinish(score + ((selected?.isCorrect ?? selected?.key === current.correctAnswer) ? 1 : 0));
    }
    else setQIndex(i => i + 1);
  }

  const isCorrect = selected && (selected.isCorrect ?? selected.key === current.correctAnswer);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
      {/* Progress */}
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: PALETTE.secondary, marginBottom: 6 }}>
          <span>سؤال {qIndex + 1} من {questions.length}</span>
          <span>✅ {score} صح</span>
        </div>
        <div style={{ background: PALETTE.border, borderRadius: 99, height: 8 }}>
          <div style={{ height: 8, borderRadius: 99, background: `linear-gradient(90deg,${PALETTE.primary},${PALETTE.blue})`,
            width: `${((qIndex) / questions.length) * 100}%`, transition: "width 0.4s" }} />
        </div>
      </div>

      {/* Question */}
      <div style={{
        background: PALETTE.card,
        color: PALETTE.text, borderRadius: 20, padding: "28px 24px",
        width: "100%", maxWidth: 420, textAlign: "center",
        border: `1px solid ${PALETTE.border}`,
        boxShadow: "0 8px 24px rgba(31,41,55,0.08)",
      }}>
        <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 10, fontFamily: FONT_EN }}>{current.question}</div>
        <div style={{ fontSize: 32, fontWeight: 600, color: PALETTE.text, fontFamily: promptFont }}>{current.prompt}</div>
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 420, direction: "ltr" }}>
        {current.optionsList.map((opt, i) => {
          const isRight = opt.isCorrect ?? opt.key === current.correctAnswer;
          const isPicked = selected === opt;
          let bg = PALETTE.card, border = `2px solid ${PALETTE.border}`, color = PALETTE.text;
          if (selected) {
            if (isRight) { bg = "#DCFCE7"; border = `2px solid ${PALETTE.success}`; color = PALETTE.success; }
            else if (isPicked) { bg = "#FEE2E2"; border = `2px solid ${PALETTE.error}`; color = "#991B1B"; }
          }
          return (
            <button key={i} onClick={() => handleSelect(opt)} style={{
              padding: "14px 10px", borderRadius: 14, background: bg, border,
              color, fontWeight: 500, fontSize: 15, cursor: selected ? "default" : "pointer",
              direction: "ltr", transition: "all 0.2s", fontFamily: FONT_EN,
            }}>
              {opt.key ? `${opt.key}. ${opt.value}` : opt.value}
            </button>
          );
        })}
      </div>

      {/* AI Feedback */}
      {selected && (
        <div style={{
          background: isCorrect ? "#F0FDF4" : "#FEF2F2",
          border: `1px solid ${isCorrect ? "#BBF7D0" : "#FECACA"}`,
          borderRadius: 14, padding: "14px 18px", width: "100%", maxWidth: 420,
          direction: "rtl", fontSize: 14, lineHeight: 1.8,
          color: isCorrect ? PALETTE.success : "#7F1D1D",
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>
            {isCorrect ? "🎉 ممتاز!" : "❌ إجابة خاطئة"}
          </div>
          {loadingFeedback ? "⏳ جاري تحليل إجابتك..." : aiFeedback}
        </div>
      )}

      {selected && (
        <button onClick={next} style={{
          background: `linear-gradient(90deg,${PALETTE.primary},${PALETTE.blue})`,
          color: "#fff", border: "none", borderRadius: 14,
          padding: "14px 40px", fontWeight: 700, fontSize: 16,
          cursor: "pointer", width: "100%", maxWidth: 420,
        }}>
          {qIndex + 1 >= questions.length ? "🏁 انتهى الاختبار!" : "التالي ←"}
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
function RegisterPage({ onRegister, onFirstInteraction }) {
  const [form, setForm] = useState({ name: "", college: "", university: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const GOLD = PALETTE.primary;
  const DARK = PALETTE.text;

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
        <span style={{ fontSize:11, color:"#9fb4d4", fontFamily: FONT_EN }}>{labelEn}</span>
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
          border: errors[id] ? `2px solid ${PALETTE.error}` : `1.5px solid ${PALETTE.border}`,
          background: PALETTE.card, color: PALETTE.text,
          fontSize:15, outline:"none",
          fontFamily:"inherit",
        }}
      />
      {errors[id] && (
        <div style={{ fontSize:12, color: PALETTE.error, marginTop:4, textAlign:"right" }}>
          ⚠ {errors[id]}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background: PALETTE.appBg,
      fontFamily: FONT_AR,
      padding:"24px 20px",
    }}>
      <style>{`
        input::placeholder { color: #9CA3AF; }
        input:focus { border-color: ${PALETTE.primary} !important; background: #FFFFFF !important; }
        @keyframes regFadeIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }
      `}</style>

      {submitted ? (
        <div style={{ textAlign:"center", animation:"regFadeIn 0.5s ease" }}>
          <div style={{ fontSize:72, animation:"checkPop 0.6s ease" }}>✅</div>
          <div style={{ fontSize:22, fontWeight:800, color: PALETTE.text, marginTop:16 }}>
            أهلاً {form.name}!
          </div>
          <div style={{ fontSize:14, color: PALETTE.secondary, marginTop:8, fontFamily: FONT_EN, fontWeight: 400 }}>
            Welcome to MedLingo 🩺
          </div>
        </div>
      ) : (
        <div style={{ width:"100%", maxWidth:420, animation:"regFadeIn 0.5s ease" }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🩺</div>
            <div style={{ fontSize:26, fontWeight:600, color: PALETTE.text, letterSpacing:0, fontFamily: FONT_EN }}>MedLingo</div>
            <div dir="rtl" style={{ fontSize:14, color:GOLD, marginTop:6, fontWeight:600 }}>
              سجّل للبدء في رحلة تعلّم المصطلحات الطبية
            </div>
            <div style={{ fontSize:12, color: PALETTE.secondary, marginTop:4, fontFamily: FONT_EN }}>
              Register to begin your medical terminology journey
            </div>
          </div>

          {/* Card */}
          <div style={{
            background: PALETTE.card,
            border: `1.5px solid ${PALETTE.border}`,
            borderRadius:24, padding:"28px 24px",
            backdropFilter:"blur(8px)",
          }}>
            <Field id="name"       label="الاسم الكامل"  labelEn="Full Name"   placeholder="اكتب اسمك هنا"     icon="👤" />
            <Field id="college"    label="الكلية"         labelEn="College"     placeholder="مثال: كلية الطب"   icon="🏛️" />
            <Field id="university" label="الجامعة"        labelEn="University"  placeholder="مثال: جامعة القاهرة" icon="🎓" />
            <Field id="phone"      label="رقم الهاتف"    labelEn="Phone Number" placeholder="+20 10XXXXXXXX" type="tel" icon="📱" />

            <button onClick={() => { onFirstInteraction?.(); handleSubmit(); }} style={{
              width:"100%", padding:"15px 0", borderRadius:16,
              background:`linear-gradient(90deg, ${PALETTE.primary}, ${PALETTE.blue})`,
              border:"none", color: DARK, fontWeight:900, fontSize:17,
              cursor:"pointer", marginTop:8, letterSpacing:0.5,
              boxShadow:"0 4px 16px rgba(34,197,94,0.22)",
              fontFamily: FONT_AR,
            }}>
              ابدأ التعلّم ✨
            </button>

            <div style={{ textAlign:"center", marginTop:14, fontSize:12, color: PALETTE.secondary }}>
              بياناتك محفوظة على جهازك فقط 🔒
            </div>
          </div>

          {/* Decorative dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20 }}>
            {[PALETTE.error, PALETTE.primary, PALETTE.success, PALETTE.blue].map((c,i) => (
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
      background: PALETTE.appBg,
      fontFamily: FONT_AR,
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
          background: "rgba(34,197,94,0.18)",
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
        background: PALETTE.primary, color: PALETTE.text,
        borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 800,
        marginBottom: 20, letterSpacing: 1,
      }}>
        {avatar.name}
      </div>

      {/* Message bubble */}
      <div style={{
        background: PALETTE.card,
        border: `1.5px solid ${PALETTE.border}`,
        borderRadius: 20, padding: "18px 24px", maxWidth: 300,
        textAlign: "center", marginBottom: 32,
        animation: "fadeInUp 0.6s ease-out",
      }}>
        <div dir="rtl" style={{ fontSize: 17, fontWeight: 700, color: PALETTE.text, marginBottom: 6 }}>
          {avatar.msg}
        </div>
        <div style={{ fontSize: 12, color: PALETTE.secondary, fontStyle: "italic" }}>
          {avatar.msgEn}
        </div>
      </div>

      {/* The message passed from parent (score etc.) */}
      {message && (
        <div style={{
          background: "#DCFCE7", border: `1px solid ${PALETTE.primary}`,
          borderRadius: 14, padding: "12px 20px", marginBottom: 24,
          color: PALETTE.text, textAlign: "center", fontSize: 15,
        }}>
          {message}
        </div>
      )}

      <button onClick={onContinue} style={{
        background: `linear-gradient(90deg, ${PALETTE.primary}, ${PALETTE.blue})`,
        color: "#fff", border: "none", borderRadius: 16,
        padding: "14px 40px", fontWeight: 800, fontSize: 16,
        cursor: "pointer", boxShadow: "0 4px 16px rgba(34,197,94,0.22)",
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
        background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 10,
        width: 36, height: 36, cursor: "pointer", fontSize: 16, flexShrink: 0,
      }}>
        →
      </button>
      <div style={{ fontWeight: 700, fontSize: 16, color: PALETTE.text }}>{title}</div>
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

function getQuizQuestionCount(terms) {
  return terms.reduce((total, term) => total + (term.quizQuestions?.length || 2), 0);
}

function toImageFilename(term) {
  return `${term.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}.png`;
}

function buildGeminiPrompt(term) {
  return [
    `Create ONE single image only of the ${term}.`,
    "No collage.",
    "No grid.",
    "No multiple panels.",
    "White background.",
    `One black arrow pointing to the requested structure: ${term}.`,
    `Only one English label, exactly: "${term}".`,
    "1024x1024.",
    "Semi-realistic 3D medical textbook style.",
    "No watermark.",
    "No logo.",
  ].join(" ");
}

function DeveloperToolsPage() {
  const terms = TERMS.anatomy.cardiac.slice(0, 10);
  const [index, setIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const current = terms[index];
  const prompt = buildGeminiPrompt(current.en);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus("Prompt copied.");
    } catch {
      setCopyStatus("Copy failed. Select and copy the prompt manually.");
    }
  }

  function previous() {
    setIndex(i => Math.max(0, i - 1));
    setCopyStatus("");
  }

  function next() {
    setIndex(i => Math.min(terms.length - 1, i + 1));
    setCopyStatus("");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: PALETTE.appBg,
      color: PALETTE.text,
      fontFamily: FONT_AR,
      padding: 24,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <main style={{
        width: "100%",
        maxWidth: 760,
        background: PALETTE.card,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 8,
        padding: 24,
        boxShadow: "0 16px 40px rgba(31,41,55,0.08)",
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: PALETTE.secondary, textTransform: "uppercase", marginBottom: 8 }}>
          Developer Tools
        </div>
        <h1 style={{ margin: 0, fontSize: 32, color: PALETTE.text, fontFamily: FONT_EN, fontWeight: 600 }}>{current.en}</h1>
        <div style={{ marginTop: 14, display: "grid", gap: 8, fontSize: 15 }}>
          <div><strong>Category:</strong> Cardiac</div>
          <div><strong>English term:</strong> {current.en}</div>
          <div><strong>Suggested image filename:</strong> {toImageFilename(current.en)}</div>
        </div>

        <textarea
          readOnly
          value={prompt}
          style={{
            width: "100%",
            minHeight: 180,
            marginTop: 20,
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 6,
            padding: 14,
            fontSize: 15,
            lineHeight: 1.6,
            color: PALETTE.text,
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          <button onClick={previous} disabled={index === 0} style={{
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 6,
            background: PALETTE.card,
            color: PALETTE.text,
            padding: "11px 16px",
            fontWeight: 700,
            cursor: index === 0 ? "not-allowed" : "pointer",
            opacity: index === 0 ? 0.5 : 1,
          }}>
            Previous Term
          </button>
          <button onClick={copyPrompt} style={{
            border: `1px solid ${PALETTE.blue}`,
            borderRadius: 6,
            background: PALETTE.blue,
            color: "#fff",
            padding: "11px 16px",
            fontWeight: 700,
            cursor: "pointer",
          }}>
            Copy Gemini Prompt
          </button>
          <button onClick={next} disabled={index === terms.length - 1} style={{
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 6,
            background: PALETTE.card,
            color: PALETTE.text,
            padding: "11px 16px",
            fontWeight: 700,
            cursor: index === terms.length - 1 ? "not-allowed" : "pointer",
            opacity: index === terms.length - 1 ? 0.5 : 1,
          }}>
            Next Term
          </button>
        </div>

        <div style={{ minHeight: 22, marginTop: 12, color: PALETTE.success, fontWeight: 700 }}>
          {copyStatus}
        </div>
      </main>
    </div>
  );
}

function ResultCard({ emoji, title, lines, onContinue }) {
  return (
    <div style={{
      background: PALETTE.card, borderRadius: 20, padding: "32px 24px",
      textAlign: "center", boxShadow: "0 8px 24px rgba(31,41,55,0.08)", marginTop: 20,
      border: `1px solid ${PALETTE.border}`,
    }}>
      <div style={{ fontSize: 48, marginBottom: 10 }}>{emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: PALETTE.text, marginBottom: 10 }}>{title}</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: 14, color: PALETTE.secondary, marginBottom: 4 }}>{l}</div>
      ))}
      <button onClick={onContinue} style={{
        marginTop: 18, background: `linear-gradient(90deg,${PALETTE.primary},${PALETTE.blue})`,
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
const LOGO_B64 = "/images/best-academy-logo.jpeg";

function App() {
  if (window.location.pathname === "/developer") {
    return import.meta.env.DEV ? <DeveloperToolsPage /> : null;
  }

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
  const [searchQuery, setSearchQuery] = useState("");
  const [soundMuted, setSoundMuted] = useState(() => {
    try {
      return localStorage.getItem("medlingo_sound_muted") === "1";
    } catch {
      return false;
    }
  });
  const [welcomePlayed, setWelcomePlayed] = useState(() => {
    try {
      return sessionStorage.getItem("medlingo_welcome_played") === "1";
    } catch {
      return false;
    }
  });
  const appHistoryRef = useRef([]);
  const welcomeAudioRef = useRef(null);
  const welcomeAutoplayTriedRef = useRef(false);
  const welcomePlayedRef = useRef(welcomePlayed);

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

  useEffect(() => {
    if (welcomePlayed || typeof Audio === "undefined") return;

    try {
      const audio = new Audio("/sounds/welcome.mp3");
      audio.preload = "auto";
      audio.volume = 0.25;
      audio.load();
      welcomeAudioRef.current = audio;
    } catch {
      welcomeAudioRef.current = null;
    }
  }, [welcomePlayed]);

  useEffect(() => {
    try {
      localStorage.setItem("medlingo_sound_muted", soundMuted ? "1" : "0");
    } catch {}
  }, [soundMuted]);

  useEffect(() => {
    function handleBrowserBack() {
      const previousState = appHistoryRef.current.pop();
      if (!previousState) return;
      restoreAppState(previousState);
    }

    window.addEventListener("popstate", handleBrowserBack);
    return () => window.removeEventListener("popstate", handleBrowserBack);
  }, []);

  useEffect(() => {
    if (welcomePlayed) return;

    function handleFirstInteraction() {
      playWelcomeOnce();
    }

    window.addEventListener("pointerdown", handleFirstInteraction, { once: true, capture: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction, { capture: true });
      window.removeEventListener("keydown", handleFirstInteraction, { capture: true });
    };
  }, [welcomePlayed, soundMuted]);

  useEffect(() => {
    if (welcomePlayed || welcomeAutoplayTriedRef.current) return;
    if (view !== "splash" && view !== "home") return;

    welcomeAutoplayTriedRef.current = true;
    playWelcomeOnce({ markOnlyOnSuccess: true });
  }, [view, welcomePlayed, soundMuted]);

  function openCategory(catId) {
    setCategory(catId);
    navigateView("subtabs");
  }

  function openSubtab(subId) {
    setSubtab(subId);
    setCardIndex(0);
    navigateView("mode");
  }

  function openTermResult(result) {
    const terms = TERMS[result.category][result.subtab];
    setCategory(result.category);
    setSubtab(result.subtab);
    setQueue(terms);
    setCardIndex(result.termIndex);
    setKnownCount(0);
    setSearchQuery("");
    navigateView(INTERACTIVE_CATEGORIES.has(result.category) ? "flashcards" : "mode");
  }

  function startFlashcards() {
    setQueue(TERMS[category][subtab]);
    setCardIndex(0);
    setKnownCount(0);
    navigateView("flashcards");
  }

  function startQuiz() {
    navigateView("quiz");
  }

  function playAppSound(fileName) {
    playSoundEffect(fileName, soundMuted);
  }

  function markWelcomePlayed() {
    welcomePlayedRef.current = true;
    setWelcomePlayed(true);
    try {
      sessionStorage.setItem("medlingo_welcome_played", "1");
    } catch {}
  }

  async function playWelcomeOnce({ markOnlyOnSuccess = false } = {}) {
    if (welcomePlayedRef.current) return;
    if (soundMuted) {
      markWelcomePlayed();
      return;
    }

    const played = welcomeAudioRef.current
      ? await playPreparedSound(welcomeAudioRef.current, soundMuted)
      : await playSoundEffect("welcome.mp3", soundMuted);

    if (played || !markOnlyOnSuccess) markWelcomePlayed();
  }

  function getAppSnapshot() {
    return { view, category, subtab, queue, cardIndex, knownCount, quizScore };
  }

  function restoreAppState(snapshot) {
    setCategory(snapshot.category);
    setSubtab(snapshot.subtab);
    setQueue(snapshot.queue || []);
    setCardIndex(snapshot.cardIndex || 0);
    setKnownCount(snapshot.knownCount || 0);
    setQuizScore(snapshot.quizScore || 0);
    setView(snapshot.view);
  }

  function navigateView(nextView) {
    if (nextView === view) return;
    appHistoryRef.current.push(getAppSnapshot());
    try {
      window.history.pushState({ medlingo: true }, "", window.location.href);
    } catch {}
    setView(nextView);
  }

  function advanceCard(q) {
    if (cardIndex + 1 < q.length) {
      playAppSound("card-click.mp3");
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

  function handlePreviousCard() {
    if (cardIndex > 0) playAppSound("card-click.mp3");
    setCardIndex(i => Math.max(0, i - 1));
  }

  function handleNextCard() {
    advanceCard(queue);
  }

  function handleNextReferenceTerm() {
    if (cardIndex < activeTerms.length - 1) playAppSound("card-click.mp3");
    setCardIndex(i => Math.min(activeTerms.length - 1, i + 1));
  }

  function handleQuizFinish(score) {
    playAppSound("success.mp3");
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
  const isInteractiveMode = INTERACTIVE_CATEGORIES.has(category);
  const activeQuizQuestionCount = getQuizQuestionCount(activeTerms);
  const visibleCategories = CATEGORIES.filter(cat => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return `${cat.label} ${cat.en} ${cat.desc}`.toLowerCase().includes(q);
  });
  const termSearchResults = searchQuery.trim()
    ? Object.entries(TERMS).flatMap(([catId, subtabs]) =>
        Object.entries(subtabs).flatMap(([subId, terms]) =>
          terms
            .map((term, termIndex) => ({ term, termIndex, category: catId, subtab: subId }))
            .filter(({ term }) =>
              `${term.en} ${term.ar} ${term.definition || ""} ${term.example || ""}`.toLowerCase()
                .includes(searchQuery.trim().toLowerCase())
            )
        )
      ).slice(0, 12)
    : [];

  if (view === "register") {
    return <RegisterPage onFirstInteraction={playWelcomeOnce} onRegister={(u) => { setUser(u); setView("splash"); }} />;
  }

  if (view === "splash") {
    return (
      <div onClick={() => { playWelcomeOnce(); setView("home"); }} style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: PALETTE.appBg,
        color: PALETTE.text, fontFamily: FONT_AR,
        cursor: "pointer", position: "relative",
        padding: "72px 24px 120px", boxSizing: "border-box",
      }}>
        <style>{`
          @keyframes medlingoLogoFade {
            0% { opacity: 0; filter: blur(4px); }
            100% { opacity: 1; filter: blur(0); }
          }
          @keyframes medlingoLoad {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          transform: "translateY(clamp(4px, 2vh, 18px))",
          animation: "medlingoLogoFade 700ms ease-out both",
        }}>
        <div style={{
          width: 160, height: 160, borderRadius: "50%",
          background: PALETTE.card,
          border: `4px solid ${PALETTE.primary}`,
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 0 0 8px rgba(34,197,94,0.12), 0 12px 30px rgba(31,41,55,0.12)",
        }}>
          <img src={LOGO_B64} alt="The Best Academy" style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
          }} />
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: 0, fontFamily: FONT_EN }}>MedLingo</div>
        <div dir="rtl" style={{ fontSize: 14, color: PALETTE.secondary, marginTop: 8, textAlign: "center" }}>
          تعلّم المصطلحات الطبية بالإنجليزية
        </div>
        <div style={{ width: 140, height: 4, borderRadius: 99, background: PALETTE.border, marginTop: 34, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: `linear-gradient(90deg, ${PALETTE.primary}, ${PALETTE.blue})`,
            animation: "medlingoLoad 3.5s ease-in-out forwards",
          }} />
        </div>
        </div>

        {/* Powered by */}
        <div style={{
          position: "absolute", bottom: 32,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}>
          <div style={{ fontSize: 11, color: PALETTE.secondary, letterSpacing: 1, textTransform: "uppercase", fontFamily: FONT_EN }}>
            Powered by
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: PALETTE.card,
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 20, padding: "6px 14px",
          }}>
            <img src={LOGO_B64} alt="The Best Academy" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", background: "#fff" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: PALETTE.success, letterSpacing: 0, fontFamily: FONT_EN }}>
              The Best Academy
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" onPointerDownCapture={playWelcomeOnce} style={{
      minHeight: "100vh",
      background: PALETTE.appBg,
      fontFamily: FONT_AR,
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
            background: `linear-gradient(135deg,${PALETTE.primary},${PALETTE.blue})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>
            🩺
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 20, color: PALETTE.text, fontFamily: FONT_EN }}>MedLingo</div>
            {user && <div style={{ fontSize: 11, color: PALETTE.secondary, marginTop: 1 }}>أهلاً، {user.name.split(" ")[0]} 👋</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setSoundMuted(muted => !muted)}
            aria-label={soundMuted ? "Unmute sounds" : "Mute sounds"}
            style={{
              background: PALETTE.card,
              color: PALETTE.text,
              border: `1px solid ${PALETTE.border}`,
              borderRadius: 12,
              padding: "6px 10px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {soundMuted ? "🔇" : "🔊"}
          </button>
          <div style={{ background: PALETTE.card, color: PALETTE.text, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>
            🔥 {streak}
          </div>
          <div style={{ background: "#DCFCE7", color: PALETTE.success, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: "6px 12px", fontSize: 13, fontWeight: 700 }}>
            ⭐ {xp}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        {view === "home" && (
          <>
            <div style={{ fontSize: 15, color: PALETTE.secondary, marginBottom: 16, textAlign: "center" }}>
              اختر فئة لتبدأ التعلّم
            </div>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                color: PALETTE.secondary, fontSize: 17, pointerEvents: "none",
              }}>
                🔍
              </span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مصطلح"
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: `1.5px solid ${PALETTE.border}`,
                  borderRadius: 14, padding: "12px 16px 12px 42px",
                  background: PALETTE.card, color: PALETTE.text,
                  fontSize: 14, outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
            {termSearchResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {termSearchResults.map(({ term, category: catId, subtab: subId, termIndex }) => (
                  <button key={`${catId}-${subId}-${term.en}`} onClick={() => openTermResult({ category: catId, subtab: subId, termIndex })} style={{
                    background: PALETTE.card, border: `1.5px solid ${PALETTE.border}`,
                    borderRadius: 14, padding: "12px 14px", cursor: "pointer",
                    textAlign: "right", boxShadow: "0 4px 14px rgba(31,41,55,0.05)",
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: PALETTE.text, fontFamily: FONT_EN, direction: "ltr" }}>{term.en}</div>
                    <div style={{ fontSize: 12, color: PALETTE.secondary, marginTop: 3, fontFamily: FONT_AR, fontWeight: 500 }}>{term.ar}</div>
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {visibleCategories.map(cat => (
                <button key={cat.id} onClick={() => openCategory(cat.id)} style={{
                  background: PALETTE.card, border: `1.5px solid ${PALETTE.border}`,
                  borderRadius: 18, padding: "20px 12px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  boxShadow: "0 6px 18px rgba(31,41,55,0.06)",
                }}>
                  <div style={{ fontSize: 26 }}>{cat.label.split(" ")[0]}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: PALETTE.text, fontFamily: FONT_AR }}>
                    {cat.label.split(" ").slice(1).join(" ")}
                    <span style={{ fontWeight: 600, color: PALETTE.secondary, fontFamily: FONT_EN }}> · {cat.en}</span>
                  </div>
                  <div style={{ fontSize: 11, color: PALETTE.secondary }}>{cat.desc}</div>
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
                  background: PALETTE.card, border: `1.5px solid ${PALETTE.border}`,
                  borderRadius: 14, padding: "16px 10px", cursor: "pointer",
                  fontWeight: 600, fontSize: 14, color: PALETTE.text, fontFamily: FONT_AR,
                }}>
                  {sub.label}
                  <span style={{ fontWeight: 600, color: PALETTE.secondary, fontFamily: FONT_EN }}> · {sub.en}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {view === "mode" && currentCategory && (
          <>
            <BackBar onBack={() => setView("subtabs")} title={currentSubtabLabel} />
            {isInteractiveMode ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
                <button onClick={startFlashcards} style={modeButtonStyle(currentCategory.color)}>
                  🃏 بطاقات تعليمية
                  <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.85, marginTop: 4 }}>
                    {activeTerms.length} مصطلح
                  </div>
                </button>
                <button onClick={startQuiz} style={modeButtonStyle(PALETTE.blue)}>
                  📝 اختبار سريع
                  <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.85, marginTop: 4 }}>
                    {activeQuizQuestionCount} سؤال
                  </div>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
                <ReferenceTerms
                  term={activeTerms[cardIndex]}
                  onPrevious={handlePreviousCard}
                  onNext={handleNextReferenceTerm}
                  canPrevious={cardIndex > 0}
                  canNext={cardIndex + 1 < activeTerms.length}
                />
                <button onClick={startQuiz} style={modeButtonStyle(PALETTE.blue)}>
                  📝 اختبار سريع
                  <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.85, marginTop: 4 }}>
                    {activeQuizQuestionCount} سؤال
                  </div>
                </button>
              </div>
            )}
          </>
        )}

        {view === "flashcards" && queue[cardIndex] && (
          <>
            <BackBar onBack={() => setView("mode")} title={`بطاقة ${cardIndex + 1} من ${queue.length}`} />
            <div style={{ marginTop: 16 }}>
              <FlashCard
                term={queue[cardIndex]}
                onPrevious={handlePreviousCard}
                onNext={handleNextCard}
                canPrevious={cardIndex > 0}
                canNext={cardIndex + 1 < queue.length}
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
              <Quiz terms={activeTerms} onFinish={handleQuizFinish} onSound={playAppSound} />
            </div>
          </>
        )}

        {view === "quizAvatar" && (
          <AvatarTransition
            onContinue={() => setView("quizResults")}
            message={`نتيجتك: ${quizScore} من ${activeQuizQuestionCount} ⭐`}
          />
        )}

        {view === "quizResults" && (
          <ResultCard
            emoji={quizScore === activeQuizQuestionCount ? "🏆" : "✅"}
            title="انتهى الاختبار!"
            lines={[`النتيجة: ${quizScore} من ${activeQuizQuestionCount}`, `+${quizScore * 10} نقطة خبرة`]}
            onContinue={() => setView("mode")}
          />
        )}
      </div>
    </div>
  );
}

export default App;
