import type { CodeSlideLanguage } from "@/types/lessonSlide";

export type CodeTokenType = "comment" | "string" | "number" | "keyword" | "plain";

export interface CodeToken {
  text: string;
  type: CodeTokenType;
}

const KEYWORDS: Record<CodeSlideLanguage, string[]> = {
  javascript: [
    "const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export",
    "from", "new", "async", "await", "try", "catch", "finally", "default", "extends", "typeof", "null",
    "undefined", "true", "false", "switch", "case", "break", "continue", "this", "super",
  ],
  python: [
    "def", "return", "if", "elif", "else", "for", "while", "import", "from", "class", "try", "except",
    "finally", "with", "as", "lambda", "None", "True", "False", "and", "or", "not", "in", "is", "pass",
    "break", "continue", "self",
  ],
  html: ["html", "head", "body", "div", "span", "script", "style", "a", "img", "class", "id"],
  css: ["color", "background", "margin", "padding", "display", "flex", "grid", "border", "width", "height", "font", "important"],
  json: ["true", "false", "null"],
  bash: ["if", "then", "else", "elif", "fi", "for", "do", "done", "echo", "export", "function", "return", "while", "case", "esac"],
  plain: [],
};

const COMMENT_SOURCE: Record<CodeSlideLanguage, string | null> = {
  javascript: "//[^\\n]*|/\\*[\\s\\S]*?\\*/",
  python: "#[^\\n]*",
  bash: "#[^\\n]*",
  html: "<!--[\\s\\S]*?-->",
  css: "/\\*[\\s\\S]*?\\*/",
  json: null,
  plain: null,
};

const STRING_SOURCE = '"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'';
const NUMBER_SOURCE = "\\b\\d+(?:\\.\\d+)?\\b";

function buildRegex(language: CodeSlideLanguage): RegExp | null {
  if (language === "plain") return null;
  const parts: string[] = [];
  const comment = COMMENT_SOURCE[language];
  if (comment) parts.push(`(?<comment>${comment})`);
  parts.push(`(?<str>${STRING_SOURCE})`);
  parts.push(`(?<num>${NUMBER_SOURCE})`);
  const keywords = KEYWORDS[language];
  if (keywords.length > 0) parts.push(`(?<kw>\\b(?:${keywords.join("|")})\\b)`);
  return new RegExp(parts.join("|"), "g");
}

/** Small, dependency-free approximate syntax highlighter — good enough for a read-only slide, not a full-fidelity tokenizer. */
export function tokenizeCode(code: string, language: CodeSlideLanguage): CodeToken[] {
  const regex = buildRegex(language);
  if (!regex) return [{ text: code, type: "plain" }];

  const tokens: CodeToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(code))) {
    if (match.index > lastIndex) tokens.push({ text: code.slice(lastIndex, match.index), type: "plain" });
    const groups = match.groups ?? {};
    const type: CodeTokenType = groups.comment ? "comment" : groups.str ? "string" : groups.num ? "number" : groups.kw ? "keyword" : "plain";
    tokens.push({ text: match[0], type });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < code.length) tokens.push({ text: code.slice(lastIndex), type: "plain" });
  return tokens;
}
