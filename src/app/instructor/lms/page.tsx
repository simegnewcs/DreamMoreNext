import type { Metadata } from "next";
import LMSLayout from "@/components/lms/LMSLayout";
import InstructorLMS from "@/components/instructor/InstructorLMS";

export const metadata: Metadata = {
  title: "LMS Content Manager | Instructor Panel",
  description: "Manage phases, weeks, videos, notes and assignments for your assigned courses.",
};

export default function InstructorLMSPage() {
  return (
    <LMSLayout>
      <InstructorLMS />
    </LMSLayout>
  );
}
