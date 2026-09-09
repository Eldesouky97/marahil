import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-[#080D1A] py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-lg text-[#F6EFDD]">مراحل</span>
        </div>
        <p className="text-xs text-[#5C6584]">© {new Date().getFullYear()} منصة مراحل التعليمية</p>
      </div>
    </footer>
  );
}
