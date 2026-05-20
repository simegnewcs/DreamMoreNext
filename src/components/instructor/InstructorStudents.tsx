"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, Search, Loader2, BookOpen, Mail } from "lucide-react";
import { useInstructor } from "@/context/InstructorContext";

interface Student {
  application_id: number;
  name: string;
  email: string;
  phone?: string;
  amount?: number;
  payment_method?: string;
  enrollment_status: string;
  enrolled_at: string;
  created_at: string;
  course_title: string;
  course_slug: string;
  user_id?: number;
  avatar?: string;
  user_status?: string;
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function InstructorStudents() {
  const { instructorId } = useInstructor();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  useEffect(() => {
    if (!instructorId) return;
    fetch(`/api/instructor/students?instructor_id=${instructorId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setStudents(d.students || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [instructorId]);

  const courses = Array.from(new Set(students.map(s => s.course_title).filter(Boolean)));

  const filtered = students.filter(s => {
    const matchSearch = !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === "all" || s.course_title === courseFilter;
    return matchSearch && matchCourse;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-[#f47822]" />
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Instructor Panel</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Students</h1>
        <p className="text-sm text-gray-500 mt-1">Students enrolled in your assigned courses</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-orange-300 transition-colors" />
        </div>
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-orange-300 bg-white min-w-[180px]">
          <option value="all">All Courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </motion.div>

      {/* Stats bar */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="font-semibold text-gray-900">{filtered.length}</span> student{filtered.length !== 1 ? "s" : ""}
        {search || courseFilter !== "all" ? ` (filtered from ${students.length})` : ""}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-gray-300" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <Users className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500">{students.length === 0 ? "No students yet" : "No results"}</p>
            <p className="text-xs text-gray-400 mt-1">
              {students.length === 0 ? "Students enrolled in your courses will appear here." : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Student", "Email", "Course", "Payment", "Enrolled", "Status"].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((s, i) => (
                    <tr key={`${s.application_id}-${i}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-sm flex-shrink-0">
                            {s.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate max-w-[140px]">{s.name}</div>
                            {s.phone && <div className="text-[10px] text-gray-400">{s.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate max-w-[160px]">{s.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#f47822] flex-shrink-0" />
                          <span className="text-gray-700 truncate max-w-[160px]">{s.course_title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs text-gray-700">
                          {s.amount ? (
                            <span className="font-semibold">{Number(s.amount).toLocaleString()} ETB</span>
                          ) : <span className="text-gray-400">—</span>}
                          {s.payment_method && (
                            <div className="text-[10px] text-gray-400 capitalize mt-0.5">{s.payment_method}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(s.enrolled_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-600">
                          approved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>

    </div>
  );
}
