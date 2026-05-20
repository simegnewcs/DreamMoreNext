import type { Metadata } from "next";
import LMSLayout from "@/components/lms/LMSLayout";
import LMSDashboard from "@/components/lms/LMSDashboard";

export const metadata: Metadata = {
  title: "LMS Dashboard",
  description: "Your DreamMore learning dashboard.",
};

export default function LMSPage() {
  return (
    <LMSLayout>
      <LMSDashboard viewMode="dashboard" />
    </LMSLayout>
  );
}
