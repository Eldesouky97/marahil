import JSZip from "jszip";
import type { LessonSlide, QuizSlide, TextSlide } from "@/types/lessonSlide";

export class PptxParseError extends Error {}

const IMAGE_EXT_TO_TYPE: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
};

interface ExtractedSlide {
  texts: string[];
  image: { blob: Blob; contentType: string; extension: string } | null;
}

export interface PptxImportResult {
  slides: LessonSlide[];
  /** Slide indexes (1-based, in the returned `slides` order) that were auto-detected as quizzes and need the teacher to confirm the correct answer. */
  quizSlideNumbers: number[];
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&");
}

function extractTextRuns(slideXml: string): string[] {
  const matches = [...slideXml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)];
  return matches.map((m) => decodeXmlEntities(m[1]).trim()).filter((t) => t.length > 0);
}

async function getOrderedSlidePaths(zip: JSZip): Promise<string[]> {
  const presentationXml = await zip.file("ppt/presentation.xml")?.async("string");
  const relsXml = await zip.file("ppt/_rels/presentation.xml.rels")?.async("string");
  if (!presentationXml || !relsXml) {
    throw new PptxParseError("Not a valid .pptx file (missing presentation.xml)");
  }

  const relIdToTarget = new Map<string, string>();
  for (const m of relsXml.matchAll(/<Relationship\s+Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
    relIdToTarget.set(m[1], m[2]);
  }

  const orderedIds = [...presentationXml.matchAll(/<p:sldId\b[^>]*\br:id="([^"]+)"/g)].map((m) => m[1]);
  const paths = orderedIds
    .map((rid) => relIdToTarget.get(rid))
    .filter((target): target is string => !!target)
    .map((target) => `ppt/${target.replace(/^\.?\//, "")}`);

  if (paths.length === 0) {
    throw new PptxParseError("No slides found in this .pptx file");
  }
  return paths;
}

/** Resolves a zip-internal relative path (e.g. "../media/x.jpeg" from "ppt/slides") without URL-encoding filenames — plain string/array manipulation keeps unicode/space-containing names byte-exact for the zip lookup. */
function resolveZipPath(baseDir: string, relativeTarget: string): string {
  const stack = baseDir.split("/").filter(Boolean);
  for (const part of relativeTarget.split("/").filter(Boolean)) {
    if (part === "..") stack.pop();
    else if (part !== ".") stack.push(part);
  }
  return stack.join("/");
}

async function extractSlideImage(zip: JSZip, slidePath: string): Promise<ExtractedSlide["image"]> {
  const slideDir = slidePath.slice(0, slidePath.lastIndexOf("/"));
  const slideFileName = slidePath.slice(slidePath.lastIndexOf("/") + 1);
  const relsPath = `${slideDir}/_rels/${slideFileName}.rels`;
  const relsXml = await zip.file(relsPath)?.async("string");
  if (!relsXml) return null;

  const imageRel = [...relsXml.matchAll(/<Relationship\s+Id="([^"]+)"\s+Type="([^"]+)"\s+Target="([^"]+)"/g)].find(
    ([, , type]) => type.endsWith("/relationships/image")
  );
  if (!imageRel) return null;

  const mediaPath = resolveZipPath(slideDir, imageRel[3]);
  const mediaFile = zip.file(mediaPath);
  if (!mediaFile) return null;

  const extension = (mediaPath.split(".").pop() ?? "").toLowerCase();
  const contentType = IMAGE_EXT_TO_TYPE[extension];
  if (!contentType) return null; // skip formats R2's lesson-images folder doesn't accept (e.g. embedded .emf/.wmf)

  const blob = await mediaFile.async("blob");
  return { blob, contentType, extension };
}

/** MCQ heuristic: a line ending in "؟"/"?" followed by ≥2 "number-token, content-token" pairs. Never guesses the correct answer. */
function tryExtractMcq(texts: string[]): { title: string | undefined; question: string; choices: string[] } | null {
  const qIndex = texts.findIndex((t) => /[؟?]\s*$/.test(t));
  if (qIndex === -1) return null;

  const question = texts[qIndex];
  const rest = texts.slice(qIndex + 1);
  const choices: string[] = [];
  for (let i = 0; i < rest.length - 1; i++) {
    if (/^\d+[.\-)]$/.test(rest[i])) {
      const content = rest[i + 1];
      if (content && !/^\d+[.\-)]$/.test(content)) {
        choices.push(content);
        i++;
      }
    }
  }

  if (choices.length < 2) return null;
  return { title: qIndex > 0 ? texts[0] : undefined, question, choices };
}

function slideToLessonSlide(extracted: ExtractedSlide, imageUrl: string | undefined): { slide: LessonSlide; isQuiz: boolean } {
  const mcq = tryExtractMcq(extracted.texts);
  if (mcq) {
    const slide: QuizSlide = {
      id: crypto.randomUUID(),
      type: "quiz",
      title: mcq.title,
      questions: [
        {
          id: crypto.randomUUID(),
          question: mcq.question,
          choices: mcq.choices,
          correct: 0,
          explanation: "",
        },
      ],
    };
    return { slide, isQuiz: true };
  }

  const slide: TextSlide = {
    id: crypto.randomUUID(),
    type: "text",
    title: extracted.texts[0],
    body: extracted.texts.slice(1).join("\n"),
    imageUrl,
  };
  return { slide, isQuiz: false };
}

/**
 * Parses a .pptx File entirely client-side (JSZip — a .pptx is just a zip of
 * XML) into Marahil's own LessonSlide[] shape. This is a content importer,
 * not a PowerPoint renderer: only text (in reading order) and the first
 * image per slide survive; layout/animation/multi-image slides don't. Image
 * upload to R2 is the caller's job (see PptxImportButton.tsx) so this stays
 * a pure parsing step with a single clear failure mode (PptxParseError).
 */
export async function extractPptxSlides(
  file: File,
  onProgress?: (done: number, total: number) => void
): Promise<{ extracted: ExtractedSlide[] }> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new PptxParseError("Could not read this file as a .pptx archive");
  }

  const slidePaths = await getOrderedSlidePaths(zip);
  const extracted: ExtractedSlide[] = [];
  for (let i = 0; i < slidePaths.length; i++) {
    const path = slidePaths[i];
    const xml = await zip.file(path)?.async("string");
    const texts = xml ? extractTextRuns(xml) : [];
    const image = await extractSlideImage(zip, path);
    extracted.push({ texts, image });
    onProgress?.(i + 1, slidePaths.length);
  }
  return { extracted };
}

export function buildLessonSlides(
  extracted: ExtractedSlide[],
  imageUrls: (string | undefined)[]
): PptxImportResult {
  const slides: LessonSlide[] = [];
  const quizSlideNumbers: number[] = [];

  extracted.forEach((slide, index) => {
    const { slide: lessonSlide, isQuiz } = slideToLessonSlide(slide, imageUrls[index]);
    slides.push(lessonSlide);
    if (isQuiz) quizSlideNumbers.push(slides.length);
  });

  return { slides, quizSlideNumbers };
}
