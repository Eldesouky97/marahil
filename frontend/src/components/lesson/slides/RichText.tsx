import type { ReactNode } from "react";

const INLINE_TOKEN = /(\*\*.+?\*\*|\*.+?\*|`.+?`)/g;

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  INLINE_TOKEN.lastIndex = 0;
  while ((match = INLINE_TOKEN.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={key++} className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.9em]">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/** Small regex-based renderer for **bold** / *italic* / `code` — builds React nodes only, never dangerouslySetInnerHTML, since this is teacher-authored content shown to students. */
export function RichText({ text }: { text: string }) {
  return <p className="whitespace-pre-line leading-relaxed text-muted">{parseInline(text)}</p>;
}
