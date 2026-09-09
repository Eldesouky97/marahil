import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsInit } from "@/components/analytics/AnalyticsInit";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
});

const tajawal = Tajawal({
  weight: ["300", "400", "500", "700", "800"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "مراحل — منصة الدروس الخصوصية والكورسات التعليمية",
  description:
    "منصة مراحل التعليمية: دروس تفاعلية، اختبارات فورية، وشهادات موثقة لكل المراحل الدراسية.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${tajawal.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#0B1224] font-body text-[#E7E9F2]">
        <AuthProvider>
          <AnalyticsInit />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
