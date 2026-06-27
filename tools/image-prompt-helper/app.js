const terms = [
  "Myocardium",
  "Pericardium",
  "Endocardium",
  "Aorta",
  "Mitral Valve",
  "Coronary Artery",
  "Left Ventricle",
  "Right Atrium",
  "Pulmonary Artery",
  "Sinoatrial Node",
];

let currentIndex = 0;

const termName = document.getElementById("termName");
const filename = document.getElementById("filename");
const promptText = document.getElementById("promptText");
const previousButton = document.getElementById("previousButton");
const copyButton = document.getElementById("copyButton");
const nextButton = document.getElementById("nextButton");
const copyStatus = document.getElementById("copyStatus");

function getFilename(term) {
  return `${term.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}.png`;
}

function getPrompt(term) {
  return [
    `Create ONE single image only of the ${term}.`,
    "No collage.",
    "No grid.",
    "No multiple panels.",
    "Use a white background.",
    `Add one black arrow pointing to the requested structure: ${term}.`,
    `Use only one English label, exactly: "${term}".`,
    "Create the image at 1024x1024.",
    "Use a semi-realistic 3D medical textbook style.",
  ].join(" ");
}

function render() {
  const term = terms[currentIndex];
  termName.textContent = term;
  filename.textContent = getFilename(term);
  promptText.value = getPrompt(term);
  copyStatus.textContent = "";
  previousButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === terms.length - 1;
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(promptText.value);
    copyStatus.textContent = "Prompt copied.";
  } catch {
    promptText.select();
    document.execCommand("copy");
    copyStatus.textContent = "Prompt copied.";
  }
}

previousButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    render();
  }
});

nextButton.addEventListener("click", () => {
  if (currentIndex < terms.length - 1) {
    currentIndex += 1;
    render();
  }
});

copyButton.addEventListener("click", copyPrompt);

render();
