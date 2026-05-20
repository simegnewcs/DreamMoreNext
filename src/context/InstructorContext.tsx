"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface AssignedCourse {
  id: number;
  title: string;
  slug: string;
  category?: string;
  level?: string;
  status?: string;
  students_count?: number;
  rating?: number;
  assigned_at?: string;
}

export interface InstructorStats {
  total_courses: number;
  total_students: number;
}

interface InstructorContextType {
  isInstructor: boolean;
  instructorId: number | null;
  assignedCourses: AssignedCourse[];
  stats: InstructorStats;
  loading: boolean;
  canAccessCourse: (slug: string) => boolean;
  refresh: () => void;
}

const InstructorContext = createContext<InstructorContextType>({
  isInstructor: false,
  instructorId: null,
  assignedCourses: [],
  stats: { total_courses: 0, total_students: 0 },
  loading: true,
  canAccessCourse: () => false,
  refresh: () => {},
});

export function InstructorProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [assignedCourses, setAssignedCourses] = useState<AssignedCourse[]>([]);
  const [stats, setStats] = useState<InstructorStats>({ total_courses: 0, total_students: 0 });
  const [loading, setLoading] = useState(true);

  const loadUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return null;
  };

  const fetchInstructorData = async (u: any) => {
    if (!u || u.role !== "instructor") { setLoading(false); return; }
    try {
      const [coursesRes, statsRes] = await Promise.all([
        fetch(`/api/instructor/courses?instructor_id=${u.id}`),
        fetch(`/api/instructor/stats?instructor_id=${u.id}`),
      ]);
      const coursesData = await coursesRes.json();
      const statsData = await statsRes.json();
      if (coursesData.success) setAssignedCourses(coursesData.courses || []);
      if (statsData.success) setStats(statsData.stats || { total_courses: 0, total_students: 0 });
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const u = loadUser();
    setUser(u);
    fetchInstructorData(u);
  }, []);

  const isInstructor = user?.role === "instructor";
  const instructorId = user?.id ?? null;

  const canAccessCourse = (slug: string) => {
    if (!isInstructor) return true; // non-instructors handled elsewhere
    return assignedCourses.some(c => c.slug === slug);
  };

  const refresh = () => {
    const u = loadUser();
    setUser(u);
    fetchInstructorData(u);
  };

  return (
    <InstructorContext.Provider value={{ isInstructor, instructorId, assignedCourses, stats, loading, canAccessCourse, refresh }}>
      {children}
    </InstructorContext.Provider>
  );
}

export function useInstructor() {
  return useContext(InstructorContext);
}
