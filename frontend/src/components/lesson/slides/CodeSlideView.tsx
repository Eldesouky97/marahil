import { tokenizeCode, type CodeTokenType } from "@/lib/utils/codeHighlight";
import type { CodeSlide } from "@/types/lessonSlide";

const TOKEN_CLASSES: Record<CodeTokenType, string> = {
  comment: "text-dim italic",
  string: "text-accent",
  number: "text-gold",
  keyword: "text-primary-strong font-semibold",
  plain: "",
};

export function CodeSlideView({ slide }: { slide: CodeSlide }) {
  const tokens = tokenizeCode(slide.code, slide.language);
  return (
    <div>
      {slide.title && <h3 className="mb-4 font-display text-xl text-heading">{slide.title}</h3>}
      <pre dir="ltr" className="overflow-x-auto rounded-xl border border-border bg-surface-2 p-4 text-start text-sm">
        <code className="font-mono">
          {tokens.map((token, i) => (
            <span key={i} className={TOKEN_CLASSES[token.type]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
      {slide.caption && <p className="mt-3 text-sm text-dim">{slide.caption}</p>}
    </div>
  );
}
