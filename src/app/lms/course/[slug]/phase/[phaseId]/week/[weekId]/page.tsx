import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LMSLayout from "@/components/lms/LMSLayout";
import WeekDetailView from "@/components/lms/course/WeekDetailView";
import { fetchCourseFromDB } from "@/lib/lms-db";

interface PageProps {
  params: Promise<{ slug: string; phaseId: string; weekId: string; }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function WeekPage({ params, searchParams }: PageProps) {
  const { slug, phaseId, weekId } = await params;
  const { tab } = await searchParams;
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect(`/login?redirect=/lms/course/${slug}/phase/${phaseId}/week/${weekId}`);

  const userData = cookieStore.get("user")?.value;
  if (!userData) redirect(`/login?redirect=/lms/course/${slug}/phase/${phaseId}/week/${weekId}`);

  let user: any;
  try { user = JSON.parse(userData!); } catch { redirect(`/login?redirect=/lms/course/${slug}/phase/${phaseId}/week/${weekId}`); }

  const course = await fetchCourseFromDB(slug, user?.id);
  if (!course) redirect("/lms/courses");

  const phase = course!.phases.find((p) => p.id === phaseId);
  if (!phase) redirect(`/lms/course/${slug}`);

  const week = phase.weeks.find((w) => w.id === weekId);
  if (!week) redirect(`/lms/course/${slug}/phase/${phaseId}`);

  const validTabs = ["videos", "notes", "questions"];
  const activeTab = tab && validTabs.includes(tab) ? tab as "videos" | "notes" | "questions" : "videos";

  return (
    <LMSLayout>
      <WeekDetailView 
        course={course} 
        phase={phase} 
        week={week}
        activeTab={activeTab}
      />
    </LMSLayout>
  );
}
