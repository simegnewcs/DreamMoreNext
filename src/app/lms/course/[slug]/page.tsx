import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LMSLayout from "@/components/lms/LMSLayout";
import CoursePhasesView from "@/components/lms/course/CoursePhasesView";
import { fetchCourseFromDB } from "@/lib/lms-db";

interface PageProps {
  params: Promise<{ slug: string }>;
}


export default async function LMSCoursePage({ params }: PageProps) {
  const { slug } = await params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login?redirect=/lms/course/" + slug);

  const userData = cookieStore.get("user")?.value;
  if (!userData) redirect("/login?redirect=/lms/course/" + slug);

  let user: any;
  try { user = JSON.parse(userData); } catch { redirect("/login?redirect=/lms/course/" + slug); }

  const course = await fetchCourseFromDB(slug, user?.id);
  if (!course) redirect("/lms/courses");

  return (
    <LMSLayout>
      <CoursePhasesView course={course} />
    </LMSLayout>
  );
}
