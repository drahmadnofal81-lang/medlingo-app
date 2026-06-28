import { useState, useEffect } from "react";
import { TERMS } from "./data/terms";

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


// ── Flashcard Component ──────────────────────────────────────────────────────
function FlashCard({ term, onPrevious, onNext, canPrevious, canNext }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const imageSrc = typeof term.image === "string" ? term.image.trim() : "";
  const imageCandidates = imageSrc
    ? [imageSrc, ...[".webp", ".png", ".jpg", ".jpeg"].map(ext => imageSrc.replace(/\.[^/.]+$/, ext))]
        .filter((src, index, all) => src && all.indexOf(src) === index)
    : [];
  const currentImageSrc = imageCandidates[imageIndex] || "";

  useEffect(() => {
    setAiHint(null);
    setImageError(false);
    setImageIndex(0);
  }, [term]);

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
          overflow: "hidden",
        }}>
          {currentImageSrc && !imageError ? (
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
          ) : (
            "🩺"
          )}
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
      <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 420, direction: "ltr" }}>
        <button onClick={onPrevious} disabled={!canPrevious} style={{
          flex: 1, padding: "14px 0", borderRadius: 14,
          background: "#fff3cd", border: "none", color: "#856404",
          fontWeight: 900, fontSize: 24, cursor: canPrevious ? "pointer" : "not-allowed",
          opacity: canPrevious ? 1 : 0.45,
        }}>
          ←
        </button>
        <button onClick={onNext} style={{
          flex: 1, padding: "14px 0", borderRadius: 14,
          background: "#d1fae5", border: "none", color: "#065f46",
          fontWeight: 900, fontSize: 24, cursor: "pointer",
        }}>
          →
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

  // Build options: 1 correct + 3 random wrong
  const buildOptions = (term, allTerms) => {
    const others = allTerms.filter(t => t.en !== term.en);
    const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled, term].sort(() => Math.random() - 0.5);
  };

  const [questions] = useState(() => terms.flatMap(term => {
    if (term.quizQuestions?.length) {
      return term.quizQuestions.map((quizQuestion, index) => ({
        ...quizQuestion,
        term,
        id: `${term.en}-${index}`,
        prompt: quizQuestion.prompt || term.en,
        optionsList: Object.entries(quizQuestion.options).map(([key, value]) => ({ key, value })),
      }));
    }

    return [{
      term,
      id: term.en,
      question: "ما معنى هذا المصطلح؟",
      prompt: term.en,
      optionsList: buildOptions(term, terms).map(opt => ({
        value: opt.ar,
        isCorrect: opt.en === term.en,
      })),
    }];
  }));

  const current = questions[qIndex];
  const currentTerm = current.term;

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
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 6 }}>
          <span>سؤال {qIndex + 1} من {questions.length}</span>
          <span>✅ {score} صح</span>
        </div>
        <div style={{ background: "#e9ecef", borderRadius: 99, height: 8 }}>
          <div style={{ height: 8, borderRadius: 99, background: "linear-gradient(90deg,#2A9D8F,#457B9D)",
            width: `${((qIndex) / questions.length) * 100}%`, transition: "width 0.4s" }} />
        </div>
      </div>

      {/* Question */}
      <div style={{
        background: "linear-gradient(135deg,#0f3460,#16213e)",
        color: "#fff", borderRadius: 20, padding: "28px 24px",
        width: "100%", maxWidth: 420, textAlign: "center",
      }}>
        <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 10 }}>{current.question}</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#FFD700" }}>{current.prompt}</div>
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 420 }}>
        {current.optionsList.map((opt, i) => {
          const isRight = opt.isCorrect ?? opt.key === current.correctAnswer;
          const isPicked = selected === opt;
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
              {opt.key ? `${opt.key}. ${opt.value}` : opt.value}
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

function getQuizQuestionCount(terms) {
  return terms.reduce((total, term) => total + (term.quizQuestions?.length || 1), 0);
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
      background: "#f5f7fb",
      color: "#172033",
      fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
      padding: 24,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <main style={{
        width: "100%",
        maxWidth: 760,
        background: "#fff",
        border: "1px solid #d9e1ee",
        borderRadius: 8,
        padding: 24,
        boxShadow: "0 16px 40px rgba(23,32,51,0.08)",
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#5d6b82", textTransform: "uppercase", marginBottom: 8 }}>
          Developer Tools
        </div>
        <h1 style={{ margin: 0, fontSize: 32, color: "#0f3460" }}>{current.en}</h1>
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
            border: "1px solid #c8d2e2",
            borderRadius: 6,
            padding: 14,
            fontSize: 15,
            lineHeight: 1.6,
            color: "#172033",
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          <button onClick={previous} disabled={index === 0} style={{
            border: "1px solid #c8d2e2",
            borderRadius: 6,
            background: "#fff",
            color: "#172033",
            padding: "11px 16px",
            fontWeight: 700,
            cursor: index === 0 ? "not-allowed" : "pointer",
            opacity: index === 0 ? 0.5 : 1,
          }}>
            Previous Term
          </button>
          <button onClick={copyPrompt} style={{
            border: "1px solid #0f3460",
            borderRadius: 6,
            background: "#0f3460",
            color: "#fff",
            padding: "11px 16px",
            fontWeight: 700,
            cursor: "pointer",
          }}>
            Copy Gemini Prompt
          </button>
          <button onClick={next} disabled={index === terms.length - 1} style={{
            border: "1px solid #c8d2e2",
            borderRadius: 6,
            background: "#fff",
            color: "#172033",
            padding: "11px 16px",
            fontWeight: 700,
            cursor: index === terms.length - 1 ? "not-allowed" : "pointer",
            opacity: index === terms.length - 1 ? 0.5 : 1,
          }}>
            Next Term
          </button>
        </div>

        <div style={{ minHeight: 22, marginTop: 12, color: "#1f7a4f", fontWeight: 700 }}>
          {copyStatus}
        </div>
      </main>
    </div>
  );
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
const LOGO_B64 = "data:image/jpeg;base64,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";

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

  function openTermResult(result) {
    const terms = TERMS[result.category][result.subtab];
    setCategory(result.category);
    setSubtab(result.subtab);
    setQueue(terms);
    setCardIndex(result.termIndex);
    setKnownCount(0);
    setSearchQuery("");
    setView("flashcards");
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

  function handlePreviousCard() {
    setCardIndex(i => Math.max(0, i - 1));
  }

  function handleNextCard() {
    advanceCard(queue);
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
      background: "linear-gradient(160deg, #e8f8f1 0%, #bdebd8 45%, #2A9D8F 100%)",
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
            <div style={{ position: "relative", marginBottom: 14 }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                color: "#888", fontSize: 17, pointerEvents: "none",
              }}>
                🔍
              </span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مصطلح"
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: "1.5px solid rgba(42,157,143,0.25)",
                  borderRadius: 14, padding: "12px 16px 12px 42px",
                  background: "#fff", color: "#16213e",
                  fontSize: 14, outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
            {termSearchResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {termSearchResults.map(({ term, category: catId, subtab: subId, termIndex }) => (
                  <button key={`${catId}-${subId}-${term.en}`} onClick={() => openTermResult({ category: catId, subtab: subId, termIndex })} style={{
                    background: "#fff", border: "1.5px solid rgba(42,157,143,0.25)",
                    borderRadius: 14, padding: "12px 14px", cursor: "pointer",
                    textAlign: "right", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#16213e" }}>{term.en}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 3 }}>{term.ar}</div>
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {visibleCategories.map(cat => (
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
                  {activeQuizQuestionCount} سؤال
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
              <Quiz terms={activeTerms} onFinish={handleQuizFinish} />
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
