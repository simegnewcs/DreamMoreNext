import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CourseDetailClient from "@/components/academy/CourseDetailClient";
import { fetchCourseBySlug } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: course.title,
    description: course.short_description || course.description?.replace(/<[^>]*>/g, '').slice(0, 150),
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);
  if (!course) notFound();
  return <CourseDetailClient course={course} />;
}
