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

export interface ExtractedSlide {
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

export interface PptxSection {
  name: string;
  slideIndexes: number[];
}

interface SlideOrderInfo {
  paths: string[];
  /** Each <p:sldId>'s own numeric `id` attribute -> its 0-based position in `paths`. Sections reference slides by this id, not by the r:id used to resolve the file path. */
  idToIndex: Map<string, number>;
  presentationXml: string;
}

async function getSlideOrderInfo(zip: JSZip): Promise<SlideOrderInfo> {
  const presentationXml = await zip.file("ppt/presentation.xml")?.async("string");
  const relsXml = await zip.file("ppt/_rels/presentation.xml.rels")?.async("string");
  if (!presentationXml || !relsXml) {
    throw new PptxParseError("Not a valid .pptx file (missing presentation.xml)");
  }

  const relIdToTarget = new Map<string, string>();
  for (const m of relsXml.matchAll(/<Relationship\s+Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
    relIdToTarget.set(m[1], m[2]);
  }

  const paths: string[] = [];
  const idToIndex = new Map<string, number>();
  for (const m of presentationXml.matchAll(/<p:sldId\b([^>]*)\/>/g)) {
    const attrs = m[1];
    const rid = attrs.match(/\br:id="([^"]+)"/)?.[1];
    const target = rid ? relIdToTarget.get(rid) : undefined;
    if (!target) continue;
    const id = attrs.match(/\bid="([^"]+)"/)?.[1];
    if (id) idToIndex.set(id, paths.length);
    paths.push(`ppt/${target.replace(/^\.?\//, "")}`);
  }

  if (paths.length === 0) {
    throw new PptxParseError("No slides found in this .pptx file");
  }
  return { paths, idToIndex, presentationXml };
}

/**
 * PowerPoint's native "Sections" feature (grouping slides into named chunks
 * from within PowerPoint itself) lives in an extension block in
 * presentation.xml: <p14:sectionLst><p14:section name="..."><p14:sldIdLst>
 * <p14:sldId id="..."/>...</p14:sldIdLst></p14:section>...</p14:sectionLst>
 * — note these reference slides by the plain `id` attribute, not `r:id`.
 * Returns null (not an empty array) when the file has none, which is the
 * common case — most decks aren't organized with this feature.
 */
function extractSections(presentationXml: string, idToIndex: Map<string, number>): PptxSection[] | null {
  const listMatch = presentationXml.match(/<p14:sectionLst\b[^>]*>([\s\S]*?)<\/p14:sectionLst>/);
  if (!listMatch) return null;

  const sections = [...listMatch[1].matchAll(/<p14:section\b[^>]*\bname="([^"]*)"[^>]*>([\s\S]*?)<\/p14:section>/g)]
    .map((m) => {
      const name = decodeXmlEntities(m[1]);
      const slideIndexes = [...m[2].matchAll(/<p14:sldId\b[^>]*\bid="([^"]+)"/g)]
        .map((sm) => idToIndex.get(sm[1]))
        .filter((idx): idx is number => idx !== undefined)
        .sort((a, b) => a - b);
      return { name, slideIndexes };
    })
    .filter((section) => section.slideIndexes.length > 0);

  return sections.length > 0 ? sections : null;
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

/**
 * A slide's own image relationship can be its decorative background fill
 * (<p:bg><p:bgPr><a:blipFill><a:blip r:embed="...">) as well as a genuine
 * picture someone placed on the slide (<p:pic><p:blipFill><a:blip
 * r:embed="...">) — both are just "an image relationship" if you only look
 * at the slide's .rels file, which is what earlier grabbed slide-theme
 * background art instead of actual slide content. Only <p:pic> shapes count
 * as content; the background's embed id is explicitly excluded even if it
 * would otherwise look like a valid candidate.
 */
async function extractSlideImage(zip: JSZip, slidePath: string, slideXml: string): Promise<ExtractedSlide["image"]> {
  const slideDir = slidePath.slice(0, slidePath.lastIndexOf("/"));
  const slideFileName = slidePath.slice(slidePath.lastIndexOf("/") + 1);
  const relsPath = `${slideDir}/_rels/${slideFileName}.rels`;
  const relsXml = await zip.file(relsPath)?.async("string");
  if (!relsXml) return null;

  const relIdToTarget = new Map<string, string>();
  for (const m of relsXml.matchAll(/<Relationship\s+Id="([^"]+)"\s+Type="([^"]+)"\s+Target="([^"]+)"/g)) {
    if (m[2].endsWith("/relationships/image")) relIdToTarget.set(m[1], m[3]);
  }
  if (relIdToTarget.size === 0) return null;

  const bgEmbedId = slideXml.match(/<p:bg\b[\s\S]*?<\/p:bg>/)?.[0].match(/<a:blip\b[^>]*\br:embed="([^"]+)"/)?.[1];

  for (const picMatch of slideXml.matchAll(/<p:pic\b[\s\S]*?<\/p:pic>/g)) {
    const embedId = picMatch[0].match(/<a:blip\b[^>]*\br:embed="([^"]+)"/)?.[1];
    if (!embedId || embedId === bgEmbedId) continue;
    const target = relIdToTarget.get(embedId);
    if (!target) continue;

    const mediaPath = resolveZipPath(slideDir, target);
    const mediaFile = zip.file(mediaPath);
    if (!mediaFile) continue;

    const extension = (mediaPath.split(".").pop() ?? "").toLowerCase();
    const contentType = IMAGE_EXT_TO_TYPE[extension];
    if (!contentType) continue; // skip formats R2's lesson-images folder doesn't accept (e.g. embedded .emf/.wmf)

    return { blob: await mediaFile.async("blob"), contentType, extension };
  }
  return null;
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
): Promise<{ extracted: ExtractedSlide[]; sections: PptxSection[] | null }> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new PptxParseError("Could not read this file as a .pptx archive");
  }

  const { paths: slidePaths, idToIndex, presentationXml } = await getSlideOrderInfo(zip);
  const sections = extractSections(presentationXml, idToIndex);

  const extracted: ExtractedSlide[] = [];
  for (let i = 0; i < slidePaths.length; i++) {
    const path = slidePaths[i];
    const xml = await zip.file(path)?.async("string");
    const texts = xml ? extractTextRuns(xml) : [];
    const image = xml ? await extractSlideImage(zip, path, xml) : null;
    extracted.push({ texts, image });
    onProgress?.(i + 1, slidePaths.length);
  }
  return { extracted, sections };
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
