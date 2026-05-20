import type { Metadata } from "next";
import LMSLayout from "@/components/lms/LMSLayout";
import InstructorStudents from "@/components/instructor/InstructorStudents";

export const metadata: Metadata = {
  title: "Students | Instructor Panel",
  description: "Students enrolled in your assigned courses.",
};

export default function InstructorStudentsPage() {
  return (
    <LMSLayout>
      <InstructorStudents />
    </LMSLayout>
  );
}
