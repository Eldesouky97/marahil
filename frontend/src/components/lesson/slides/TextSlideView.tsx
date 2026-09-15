import Image from "next/image";
import { RichText } from "./RichText";
import type { TextSlide } from "@/types/lessonSlide";

export function TextSlideView({ slide }: { slide: TextSlide }) {
  return (
    <div>
      {slide.title && <h3 className="mb-4 font-display text-xl text-heading">{slide.title}</h3>}
      {slide.imageUrl && (
        <div className="mb-6 overflow-hidden rounded-xl border border-border">
          <Image src={slide.imageUrl} alt="" width={900} height={400} className="w-full object-cover" />
        </div>
      )}
      <RichText text={slide.body} />
    </div>
  );
}
