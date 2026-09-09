import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseForm } from "@/components/dashboard/teacher/CourseForm";
import { Container } from "@/components/ui/Container";

export default function NewCoursePage() {
  return (
    <RoleGuard role="teacher">
      <section className="py-12">
        <Container>
          <DashboardHeader title="إنشاء دورة جديدة" />
          <CourseForm />
        </Container>
      </section>
    </RoleGuard>
  );
}
