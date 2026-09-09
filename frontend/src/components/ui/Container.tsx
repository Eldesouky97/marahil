import { cn } from "@/lib/utils/cn";

export function Container({
  children,
  className,
  size = "xl",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "lg" | "xl" | "2xl";
}) {
  const maxWidth = { lg: "max-w-3xl", xl: "max-w-6xl", "2xl": "max-w-7xl" }[size];
  return <div className={cn("mx-auto px-5 sm:px-8", maxWidth, className)}>{children}</div>;
}
