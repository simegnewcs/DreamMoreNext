"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, Users, TrendingUp, Clock, ChevronRight,
  Loader2, UserCheck, BarChart3
} from "lucide-react";
import { useInstructor } from "@/context/InstructorContext";

interface RecentEnrollment {
  name: string;
  email: string;
  course_title: string;
  verified_at: string;
}

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function InstructorDashboard() {
  const { assignedCourses, stats, loading, instructorId } = useInstructor();
  const [recent, setRecent] = useState<RecentEnrollment[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try { const raw = localStorage.getItem("user"); if (raw) setUser(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!instructorId) return;
    fetch(`/api/instructor/stats?instructor_id=${instructorId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setRecent(d.recent_enrollments || []); })
      .catch(() => {})
      .finally(() => setRecentLoading(false));
  }, [instructorId]);

  const statCards = [
    { label: "Assigned Courses", value: stats.total_courses, icon: BookOpen, color: "text-[#f47822]", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "Total Students", value: stats.total_students, icon: Users, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <UserCheck className="w-5 h-5 text-[#f47822]" />
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Instructor Panel</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] || "Instructor"} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your assigned courses and students.</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`rounded-2xl border ${border} bg-white p-5 flex items-center gap-4 shadow-sm`}>
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-300" /> : (
                <div className="text-3xl font-black text-gray-900">{value}</div>
              )}
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Assigned Courses */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#f47822]" />
              <h2 className="font-bold text-sm text-gray-900">Assigned Courses</h2>
            </div>
            <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full font-semibold">{assignedCourses.length}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            ) : assignedCourses.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-400">No courses assigned yet.</div>
            ) : assignedCourses.map(course => (
              <Link key={course.id} href={`/lms/course/${course.slug}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-[#f47822]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{course.title}</div>
                  <div className="text-xs text-gray-400">{[course.category, course.level].filter(Boolean).join(" · ")}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${course.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                    {course.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#f47822] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Enrollments */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <h2 className="font-bold text-sm text-gray-900">Recent Enrollments</h2>
            </div>
            <Link href="/instructor/students" className="text-xs text-[#f47822] hover:underline font-medium">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            ) : recent.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-400">No enrollments yet.</div>
            ) : recent.map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-sm flex-shrink-0">
                  {e.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{e.name}</div>
                  <div className="text-xs text-gray-400 truncate">{e.course_title}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {timeAgo(e.verified_at)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
