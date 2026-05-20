"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Award, ArrowUpRight, User, X, CheckCircle, AlertCircle, LogIn, Loader2, BookOpen } from "lucide-react";
import { fetchCourses, applicationsAPI } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

const categories = ["all", "development", "design", "ai", "marketing", "security", "creative"];

const courseBanner: Record<string, string> = {
  // Legacy mappings
  "full-stack-development":  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "ui-ux-design":            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  "ai-engineering":          "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  "graphic-design":          "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
  "digital-marketing":       "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=80",
  "mobile-app-development":  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  cybersecurity:             "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  "video-editing":           "https://images.unsplash.com/photo-1574717024453-354056afd6fc?w=800&q=80",
  // New 16 courses
  "graphics-designing":      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
  "cinematography":          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
  "web-mobile-development":  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "cpp-programming":         "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  "basic-computer":          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
  "computer-maintenance":    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
  "mobile-maintenance":      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  "ai-business":             "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  "sales-career":            "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&q=80",
  "robotics-drone":          "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
  "english-language":        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
  "ai-freelancing":          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  "3d-modeling":             "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
};

const fallbackBanner = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80";

export default function CourseGrid() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [active, setActive] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationStatuses, setApplicationStatuses] = useState<Record<string, string>>({});
  const [checkingStatuses, setCheckingStatuses] = useState(true);

  // Fetch courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses");
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Check login status and application statuses on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  // Check application statuses for all courses when courses load
  useEffect(() => {
    const checkApplicationStatuses = async () => {
      const userData = localStorage.getItem("user");
      if (!userData || courses.length === 0) {
        setCheckingStatuses(false);
        return;
      }

      try {
        const user = JSON.parse(userData);
        console.log('=== CHECKING APPLICATION STATUSES ===');
        console.log('User email:', user.email);
        console.log('Total courses:', courses.length);
        const statuses: Record<string, string> = {};

        for (const course of courses) {
          const courseId = String(course.id);
          console.log(`Course ${courseId}:`, { title: course.title, slug: course.slug });
          
          const response = await applicationsAPI.checkStatus(courseId, user.email);
          console.log(`API Response for course ${courseId}:`, response);
          
          if (response.success && response.data?.hasApplied && response.data?.application) {
            const status = response.data.application.status.toLowerCase();
            statuses[courseId] = status;
            console.log(`✓ Application FOUND for course ${courseId} - Status: ${status}`);
          } else {
            console.log(`✗ No application for course ${courseId}. Response:`, response);
          }
        }

        console.log('=== FINAL STATUSES OBJECT ===', statuses);
        setApplicationStatuses(statuses);
      } catch (error) {
        console.error('Error checking application statuses:', error);
      } finally {
        setCheckingStatuses(false);
      }
    };

    if (courses.length > 0) {
      checkApplicationStatuses();
    } else {
      setCheckingStatuses(false);
    }
  }, [courses]);

  // Refresh statuses every 5 seconds when visible
  useEffect(() => {
    if (!isLoggedIn || courses.length === 0) return;
    
    const interval = setInterval(() => {
      console.log('Refreshing application statuses...');
      const userData = localStorage.getItem("user");
      if (!userData) return;
      
      const user = JSON.parse(userData);
      const checkAll = async () => {
        const statuses: Record<string, string> = {};
        for (const course of courses) {
          const response = await applicationsAPI.checkStatus(String(course.id), user.email);
          if (response.success && response.data?.hasApplied && response.data?.application) {
            statuses[String(course.id)] = response.data.application.status.toLowerCase();
          }
        }
        setApplicationStatuses(prev => ({ ...prev, ...statuses }));
      };
      checkAll();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [courses, isLoggedIn]);

  const filtered = active === "all" ? courses : courses.filter((c) => c.category === active);

  const handleApplyClick = (courseSlug: string) => {
    if (isLoggedIn) {
      router.push(`/apply?course=${courseSlug}`);
    } else {
      setSelectedCourse(courseSlug);
      setShowLoginModal(true);
    }
  };

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ background: isDark ? "#0b0a1a" : "#f8f9fa" }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[160px]"
          style={{ background: "rgba(244,120,34,0.04)" }} />
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-8" : "opacity-4"}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#f47822] animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`text-center py-20 ${isDark ? "text-white" : "text-gray-900"}`}>
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        )}

        {/* Category filter & Grid */}
        {!loading && !error && (
        <>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200"
              style={
                active === cat
                  ? { background: "rgba(244,120,34,0.15)", color: "#f47822", border: "1px solid rgba(244,120,34,0.35)" }
                  : { color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.06 }}
            >
              <div
                className="h-full rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: isDark ? "#13122a" : "#ffffff",
                  border: "1px solid rgba(244,120,34,0.1)",
                  boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.08)",
                }}
              >
                {/* 1. Photo */}
                <div className="relative h-48 overflow-hidden bg-[#1a1838] flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.image || courseBanner[course.slug] || fallbackBanner}
                    alt={course.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-[#13122a] via-[#13122a]/20 to-transparent" : "from-white/80 via-white/20 to-transparent"}`} />

                  {/* Duration pill */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[9px] text-white/90 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </div>

                  {/* Certificate badge */}
                  {course.certificate && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(244,120,34,0.2)", color: "#f47822", border: "1px solid rgba(244,120,34,0.3)" }}>
                      <Award className="w-3 h-3" />
                      Certified
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Description */}
                  <h3 className={`text-sm font-black leading-snug mb-2 hover:text-[#f47822] transition-colors duration-200 line-clamp-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {course.title}
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-2 mb-4 flex-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>
                    {course.description}
                  </p>

                  {/* Feature/Software (Technologies) */}
                  <div className="mb-4">
                    <p className={`text-[10px] font-semibold mb-2 uppercase tracking-wide ${isDark ? "text-white/40" : "text-gray-400"}`}>
                      Software & Tools
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {course.technologies.map((tech: string) => (
                        <span
                          key={tech}
                          className="text-[9px] px-2 py-0.5 rounded font-medium"
                          style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex gap-2">
                    {/* View Button */}
                    <Link 
                      href={`/academy/course/${course.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02]"
                      style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", color: isDark ? "#fff" : "#333", border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.1)" }}
                    >
                      View
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    
                    {/* Apply Button with Status */}
                    {checkingStatuses ? (
                      <button
                        disabled
                        title={`Checking... Course ID: ${course.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Checking...
                      </button>
                    ) : applicationStatuses[String(course.id)] === 'pending' ? (
                      <button
                        disabled
                        title={`Status: pending | Course ID: ${course.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-yellow-500 text-white cursor-not-allowed"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </button>
                    ) : applicationStatuses[String(course.id)] === 'approved' ? (
                      <Link
                        href={`/lms/course/${course.slug || String(course.id)}`}
                        title={`Status: approved | Course ID: ${course.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-all duration-200"
                      >
                        <BookOpen className="w-4 h-4" />
                        Access LMS
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleApplyClick(course.slug || String(course.id))}
                        title={`No application | Course ID: ${course.id} | Detected: '${applicationStatuses[String(course.id)]}'`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02]"
                        style={{ background: "#f47822", color: "#ffffff" }}
                      >
                        {isLoggedIn ? "Apply Now" : "Apply"}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </>)}
      </div>

      {/* Login Required Modal - Outside section to avoid overflow clipping */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl p-6 max-w-sm w-full ${isDark ? "glass border border-white/10" : "bg-white border border-gray-200 shadow-2xl"}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? "bg-[#f47822]/10" : "bg-orange-50"}`}>
                  <LogIn className="w-6 h-6 text-[#f47822]" />
                </div>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
                >
                  <X className={`w-5 h-5 ${isDark ? "text-white/60" : "text-gray-500"}`} />
                </button>
              </div>

              {/* Content */}
              <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                Login Required
              </h3>
              <p className={`text-sm mb-5 ${isDark ? "text-white/60" : "text-gray-600"}`}>
                Please log in to apply for this course. Once logged in, you can proceed with your application.
              </p>

              {/* Features */}
              <div className={`space-y-2 mb-6 p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                {[
                  "Track application status",
                  "Access course materials",
                  "Connect with instructors"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-[#f47822]" />
                    <span className={isDark ? "text-white/70" : "text-gray-600"}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <Link
                  href={`/login?redirect=/apply?course=${selectedCourse}`}
                  onClick={() => setShowLoginModal(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-[#f47822] text-white hover:bg-[#e06b18] transition-all"
                >
                  <User className="w-4 h-4" />
                  Login to Continue
                </Link>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                    isDark 
                      ? "text-white/60 hover:text-white hover:bg-white/5" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
