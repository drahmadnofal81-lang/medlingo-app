import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const termsPath = path.join(__dirname, "cardiac-terms.txt");
const outputDir = path.join(__dirname, "output");
const outputPath = path.join(outputDir, "cardiac-prompts.txt");

const terms = fs
  .readFileSync(termsPath, "utf8")
  .split(/\r?\n/)
  .map((term) => term.trim())
  .filter(Boolean);

const prompts = terms.map((term, index) => {
  return [
    `${index + 1}. ${term}`,
    `Create ONE single image only of the ${term}. No collage. No grid. No multiple panels. Use a clean white background. Show the relevant cardiac anatomy in a semi-realistic 3D medical textbook style. Add one black arrow pointing to the requested structure: ${term}. Include only one English label, exactly: "${term}". The image must be 1024x1024.`,
  ].join("\n");
});

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${prompts.join("\n\n")}\n`, "utf8");

console.log(`Generated ${prompts.length} prompts at ${path.relative(process.cwd(), outputPath)}`);
