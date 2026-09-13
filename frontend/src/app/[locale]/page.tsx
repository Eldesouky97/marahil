import { Hero } from "@/components/landing/Hero";
import { SubjectMarquee } from "@/components/landing/SubjectMarquee";
import { StagesSection } from "@/components/landing/StagesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { StatsSection } from "@/components/landing/StatsSection";
import { Testimonial } from "@/components/landing/Testimonial";
import { TeacherPitch } from "@/components/landing/TeacherPitch";
import { FinalCta } from "@/components/landing/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SubjectMarquee />
      <StagesSection />
      <HowItWorks />
      <FeaturesSection />
      <InteractiveDemo />
      <StatsSection />
      <Testimonial />
      <TeacherPitch />
      <FinalCta />
    </>
  );
}
