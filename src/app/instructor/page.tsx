import type { Metadata } from "next";
import LMSLayout from "@/components/lms/LMSLayout";
import InstructorDashboard from "@/components/instructor/InstructorDashboard";

export const metadata: Metadata = {
  title: "Instructor Dashboard | DreamMore",
  description: "Manage your assigned courses and students.",
};

export default function InstructorPage() {
  return (
    <LMSLayout>
      <InstructorDashboard />
    </LMSLayout>
  );
}
