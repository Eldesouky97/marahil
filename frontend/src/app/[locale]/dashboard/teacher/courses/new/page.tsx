import { getTranslations } from "next-intl/server";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseForm } from "@/components/dashboard/teacher/CourseForm";
import { Container } from "@/components/ui/Container";

export default async function NewCoursePage() {
  const t = await getTranslations("dashboardTeacher");
  return (
    <RoleGuard role="teacher">
      <section className="py-12">
        <Container>
          <DashboardHeader title={t("newCourseTitle")} />
          <CourseForm />
        </Container>
      </section>
    </RoleGuard>
  );
}
