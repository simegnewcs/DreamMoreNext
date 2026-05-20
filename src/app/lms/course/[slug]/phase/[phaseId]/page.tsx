import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LMSLayout from "@/components/lms/LMSLayout";
import PhaseDetailView from "@/components/lms/course/PhaseDetailView";
import { fetchCourseFromDB } from "@/lib/lms-db";

interface PageProps {
  params: Promise<{ slug: string; phaseId: string }>;
}

export default async function PhasePage({ params }: PageProps) {
  const { slug, phaseId } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login?redirect=/lms/course/" + slug + "/phase/" + phaseId);

  const userData = cookieStore.get("user")?.value;
  if (!userData) redirect("/login?redirect=/lms/course/" + slug + "/phase/" + phaseId);

  let user: any;
  try { user = JSON.parse(userData!); } catch { redirect("/login?redirect=/lms/course/" + slug + "/phase/" + phaseId); }

  const course = await fetchCourseFromDB(slug, user?.id);
  if (!course) redirect("/lms/courses");

  const phase = course!.phases.find((p) => p.id === phaseId);
  if (!phase) redirect("/lms/course/" + slug);

  return (
    <LMSLayout>
      <PhaseDetailView course={course} phase={phase} />
    </LMSLayout>
  );
}
