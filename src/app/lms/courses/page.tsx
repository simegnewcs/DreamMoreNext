import type { Metadata } from "next";
import LMSLayout from "@/components/lms/LMSLayout";
import LMSDashboard from "@/components/lms/LMSDashboard";

export const metadata: Metadata = {
  title: "My Courses | LMS",
  description: "View all your enrolled courses.",
};

export default function MyCoursesPage() {
  return (
    <LMSLayout>
      <LMSDashboard viewMode="courses" />
    </LMSLayout>
  );
}
