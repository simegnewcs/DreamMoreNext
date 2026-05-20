"use client";

import LMSLayout from "@/components/lms/LMSLayout";
import LMSCourseClient from "@/components/lms/LMSCourseClient";

interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string;
  duration?: string;
  level?: string;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  is_completed?: boolean;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface LMSCourseClientWrapperProps {
  course: Course;
  modules: Module[];
  user: User;
}

export default function LMSCourseClientWrapper({ course, modules, user }: LMSCourseClientWrapperProps) {
  return (
    <LMSLayout course={course}>
      <LMSCourseClient course={course} modules={modules} user={user} />
    </LMSLayout>
  );
}
