import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LMSLayout from "@/components/lms/LMSLayout";
import WeekDetailView from "@/components/lms/course/WeekDetailView";
import { fetchCourseFromDB } from "@/lib/lms-db";

interface PageProps {
  params: Promise<{ slug: string; phaseId: string; weekId: string; }>;
}

export default async function QuestionsPage({ params }: PageProps) {
  const { slug, phaseId, weekId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect(`/login?redirect=/lms/course/${slug}/phase/${phaseId}/week/${weekId}/questions`);

  const userData = cookieStore.get("user")?.value;
  if (!userData) redirect(`/login?redirect=/lms/course/${slug}/phase/${phaseId}/week/${weekId}/questions`);

  let user: any;
  try { user = JSON.parse(userData!); } catch { redirect(`/login?redirect=/lms/course/${slug}/phase/${phaseId}/week/${weekId}/questions`); }

  const course = await fetchCourseFromDB(slug, user?.id);
  if (!course) redirect("/lms/courses");

  const phase = course!.phases.find((p) => p.id === phaseId);
  if (!phase) redirect(`/lms/course/${slug}`);

  const week = phase.weeks.find((w) => w.id === weekId);
  if (!week) redirect(`/lms/course/${slug}/phase/${phaseId}`);

  return (
    <LMSLayout>
      <WeekDetailView course={course} phase={phase} week={week} activeTab="questions" />
    </LMSLayout>
  );
}
