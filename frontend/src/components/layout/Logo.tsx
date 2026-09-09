import Image from "next/image";

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <Image
      src="/brand/marahil-logo.png"
      alt="مراحل"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}
