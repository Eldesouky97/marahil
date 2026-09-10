import { getTranslations } from "next-intl/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseForm } from "@/components/dashboard/teacher/CourseForm";

export default async function NewCoursePage() {
  const t = await getTranslations("dashboardTeacher");
  return (
    <>
      <DashboardHeader title={t("newCourseTitle")} />
      <CourseForm />
    </>
  );
}
