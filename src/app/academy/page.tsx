import type { Metadata } from "next";
import AcademyHero from "@/components/academy/AcademyHero";
import CourseGrid from "@/components/academy/CourseGrid";

export const metadata: Metadata = {
  title: "Academy",
  description:
    "DreamMore Academy — 16+ professional courses in web development, UI/UX design, AI engineering, cybersecurity, digital marketing, and more.",
};

export default function AcademyPage() {
  return (
    <>
      <AcademyHero />
      <CourseGrid />
    </>
  );
}
