"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, ChevronRight, Home, PlayCircle, MoreVertical, Loader2,
  Sparkles, TrendingUp, Clock, Layers, Video, CalendarDays
} from "lucide-react";

// Types
interface Course {
  id: number;
  title: string;
  slug: string;
  image?: string;
  description?: string;
  duration?: string;
  level?: string;
  status?: string;
  progress?: number;
  enrolledAt?: string;
  phases?: number;
  weeks?: number;
  totalVideos?: number;
  completedVideos?: number;
}

// Types for other courses (discover)
interface OtherCourse {
  id: number;
  title: string;
  slug: string;
  duration?: string;
  image?: string;
}

interface LMSDashboardProps {
  viewMode?: "dashboard" | "courses";
}

export default function LMSDashboard({ viewMode = "dashboard" }: LMSDashboardProps) {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [otherCourses, setOtherCourses] = useState<OtherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch approved courses for logged-in user
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await fetch("/api/lms/my-courses");
        const data = await response.json();

        if (data.success) {
          setMyCourses(data.courses.map((course: Course) => ({
            ...course,
            status: "Active", // Default status for approved courses
          })));
        } else {
          setError(data.error || "Failed to load courses");
        }
      } catch (err) {
        setError("Failed to fetch courses");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-2">
          <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="flex items-center gap-1 text-gray-900 font-medium">
            <BookOpen className="w-4 h-4" />
            My Courses
          </span>
        </nav>
      </header>

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        {/* Dashboard View - Overview Stats */}
        {viewMode === "dashboard" && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-[#f47822]" />
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
            </div>
            <p className="text-gray-600">Here&apos;s your learning overview</p>
            
            {/* Quick Stats Cards */}
            {!loading && myCourses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{myCourses.length}</p>
                    <p className="text-xs text-gray-500">Enrolled Courses</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {myCourses.length > 0
                        ? Math.round(myCourses.reduce((acc, c) => acc + (c.progress || 0), 0) / myCourses.length)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-500">Avg Progress</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Video className="w-5 h-5 text-[#f47822]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {myCourses.reduce((acc, c) => acc + (c.completedVideos || 0), 0)}
                    </p>
                    <p className="text-xs text-gray-500">Videos Completed</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Courses View - Simple Header */}
        {viewMode === "courses" && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-[#f47822]" />
              <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            </div>
            <p className="text-gray-600">All your enrolled courses in one place</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#f47822] animate-spin" />
            <span className="ml-3 text-gray-600">Loading your courses...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-700 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && myCourses.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center mb-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Approved Courses Yet</h3>
            <p className="text-gray-500 mb-4">You haven&apos;t been approved for any courses yet. Apply to a course and wait for admin approval.</p>
            <Link 
              href="/academy"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f47822] text-white rounded-xl hover:bg-[#e06b18] transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        )}

        {/* My Courses Grid */}
        {!loading && myCourses.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                {/* Course Image - Full width top */}
                <div className="relative -mx-6 -mt-6 mb-4 h-40 overflow-hidden">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/70" />
                    </div>
                  )}
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Status badge on image */}
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(course.status || "")}`}>
                    {course.status}
                  </span>
                  
                  {/* Duration badge */}
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 border border-white/50 shadow-sm backdrop-blur-sm">
                    {course.duration}
                  </span>

                  {/* Title on image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white drop-shadow-md line-clamp-2">
                      {course.title}
                    </h3>
                  </div>
                </div>

                {/* Course Info */}
                <div>
                  <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Enrolled {course.enrolledAt ? new Date(course.enrolledAt).toLocaleDateString() : "Recently"}
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                    {(course.phases ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-violet-500" />
                        {course.phases} phases
                      </span>
                    )}
                    {(course.weeks ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                        {course.weeks} weeks
                      </span>
                    )}
                    {(course.totalVideos ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-blue-500" />
                        {course.completedVideos}/{course.totalVideos} videos
                      </span>
                    )}
                    {course.level && (
                      <span className="px-2 py-0.5 rounded-lg font-medium bg-purple-50 text-purple-600 border border-purple-100">
                        {course.level}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {course.progress !== undefined && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Course Progress</span>
                      <span className="text-sm font-semibold text-[#f47822]">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#f47822] to-[#ff6b35] rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/lms/course/${course.slug}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f47822] text-white rounded-xl font-medium hover:bg-[#e06b18] transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    {(course.progress || 0) > 0 ? "Continue Learning" : "Start Learning"}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        )}

        {/* Discover More Courses */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Discover More</h2>
            <span className="text-sm text-gray-500">
              Browse and apply to new courses
            </span>
          </div>

          <Link
            href="/academy"
            className="flex items-center justify-center gap-2 p-6 bg-white rounded-2xl border border-gray-200 border-dashed hover:border-[#f47822] hover:bg-orange-50 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-[#f47822]" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 group-hover:text-[#f47822]">Browse All Courses</h4>
              <p className="text-sm text-gray-500">Find your next learning adventure</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#f47822] ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  );
}
