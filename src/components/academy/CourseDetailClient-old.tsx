"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Clock, BarChart2, Globe, Award, CheckCircle, ChevronDown, ChevronUp,
  Users, BookOpen, ArrowRight, PlayCircle, Target, Lightbulb, FileCheck,
  Info, Calendar, MapPin, Wallet, Loader2, Star, TrendingUp, Zap, Video, 
  FileText, HelpCircle, ChevronRight, Sparkles, GraduationCap, MonitorPlay
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { applicationsAPI } from "@/lib/api";

interface Course {
  id: string | number;
  slug: string;
  title: string;
  description?: string;
  short_description?: string;
  image?: string;
  duration?: string;
  level?: string;
  language?: string;
  students?: number;
  price?: number;
  rating?: number;
  category?: string;
  certificate?: boolean;
  instructor?: string;
  instructorBio?: string;
  instructorImage?: string;
  technologies?: string[];
  outcomes?: string[];
  requirements?: string[];
  modules?: { title: string; lessons: number }[];
  faqs?: { q: string; a: string }[];
}

const courseBanner: Record<string, string> = {
  "full-stack-development":  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=85",
  "ui-ux-design":            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=85",
  "ai-engineering":          "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=85",
  "graphic-design":          "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=85",
  "digital-marketing":       "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1200&q=85",
  "mobile-app-development":  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=85",
  "cybersecurity":           "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85",
  "video-editing":           "https://images.unsplash.com/photo-1574717024453-354056afd6fc?w=1200&q=85",
  "graphics-designing":      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=85",
  "cinematography":          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=85",
  "web-mobile-development":  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=85",
  "cpp-programming":         "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=85",
  "basic-computer":          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&q=85",
  "computer-maintenance":    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&q=85",
  "mobile-maintenance":      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=85",
  "ai-business":             "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=85",
  "sales-career":            "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1200&q=85",
  "robotics-drone":          "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=85",
  "english-language":        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&q=85",
  "ai-freelancing":          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85",
  "3d-modeling":             "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=85",
};

const fallbackBanner = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=85";

export default function CourseDetailClient({ course }: { course: Course }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check application status on mount
  useEffect(() => {
    const checkApplicationStatus = async () => {
      const userData = localStorage.getItem('user');
      if (!userData || !course.id) {
        setCheckingStatus(false);
        return;
      }

      try {
        const user = JSON.parse(userData);
        console.log('Checking application status for course:', course.id, 'user:', user.email);
        const response = await applicationsAPI.checkStatus(String(course.id), user.email);
        console.log('Application status response:', response);
        if (response.success && response.data?.hasApplied && response.data?.application) {
          setApplicationStatus((response.data.application.status || '').toLowerCase());
          console.log('Application found with status:', response.data.application.status);
        } else {
          console.log('No application found for this course. Response:', response);
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkApplicationStatus();
    
    // Refresh status every 5 seconds
    const interval = setInterval(() => {
      const userData = localStorage.getItem('user');
      if (!userData || !course.id) return;
      
      const user = JSON.parse(userData);
      applicationsAPI.checkStatus(String(course.id), user.email).then(response => {
        if (response.success && response.data?.hasApplied && response.data?.application) {
          const newStatus = (response.data.application.status || '').toLowerCase();
          setApplicationStatus(prev => {
            if (prev !== newStatus) {
              console.log('Status updated:', prev, '->', newStatus);
              return newStatus;
            }
            return prev;
          });
        }
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [course.id]);
  
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className={`min-h-screen pt-16 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-100"}`}>
      {/* Orange Header Bar */}
      <div className="bg-[#f47822] py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-center text-lg sm:text-xl font-bold">
            Apply for Dream More {course.title} Course
          </h1>
        </div>
      </div>

      {/* Course Banner Image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img
          src={course.image || courseBanner[course.slug] || fallbackBanner}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#f47822] text-white mb-3 inline-block">
              {course.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {course.title}
            </h1>
            {course.certificate && (
              <span className="flex items-center gap-1 text-sm text-white/80">
                <Award className="w-4 h-4" />
                Certificate Included
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content with Bordered Card */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Course Info Card */}
        <div className={`rounded-xl border-2 overflow-hidden ${
          isDark 
            ? "bg-[#15142a] border-[#f47822]/50" 
            : "bg-white border-[#f47822]"
        }`}>
          {/* Card Header */}
          <div className={`px-6 py-4 border-b ${
            isDark ? "border-[#f47822]/30 bg-[#f47822]/10" : "border-[#f47822]/30 bg-orange-50"
          }`}>
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#f47822] text-white">
                {course.category}
              </span>
              {course.certificate && (
                <span className="flex items-center gap-1 text-xs font-medium text-[#f47822]">
                  <Award className="w-3.5 h-3.5" />
                  Certificate
                </span>
              )}
            </div>
          </div>

          {/* Course Content - Rendered HTML Description */}
          <div className="p-6">
            {/* Course Title */}
            <h2 className={`text-2xl font-bold text-center mb-6 ${isDark ? "text-[#f47822]" : "text-[#f47822]"}`}>
              {course.title}
            </h2>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className={`text-center p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                <Clock className="w-5 h-5 text-[#f47822] mx-auto mb-1" />
                <p className="text-xs text-[#f47822] font-medium">Duration</p>
                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{course.duration}</p>
              </div>
              <div className={`text-center p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                <BarChart2 className="w-5 h-5 text-[#f47822] mx-auto mb-1" />
                <p className="text-xs text-[#f47822] font-medium">Level</p>
                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>All Level</p>
              </div>
              <div className={`text-center p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                <Globe className="w-5 h-5 text-[#f47822] mx-auto mb-1" />
                <p className="text-xs text-[#f47822] font-medium">Language</p>
                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{course.language}</p>
              </div>
              <div className={`text-center p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                <Users className="w-5 h-5 text-[#f47822] mx-auto mb-1" />
                <p className="text-xs text-[#f47822] font-medium">Students</p>
                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{course.students.toLocaleString()}</p>
              </div>
            </div>

            {/* Rich Text Description */}
            <div 
              className={`prose prose-sm max-w-none mb-6 ${
                isDark 
                  ? "prose-invert text-[#f47822]/90 prose-headings:text-[#f47822] prose-strong:text-[#f47822] prose-table:border-[#f47822]/30 prose-td:border-[#f47822]/20 prose-th:bg-[#f47822]/10" 
                  : "text-[#f47822]/90 prose-headings:text-[#f47822] prose-strong:text-[#f47822] prose-table:border-[#f47822]/30 prose-td:border-[#f47822]/20 prose-th:bg-orange-50"
              }`}
              style={{ color: '#f47822' }}
              dangerouslySetInnerHTML={{ 
                __html: course.description || `<p>The Dream More ${course.title} Course is a comprehensive training program designed to help you master the skills needed to succeed in this field.</p>`
              }}
            />

            {/* Course Outcomes - What You'll Learn */}
            {course.outcomes && course.outcomes.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-lg font-bold text-center mb-4 ${isDark ? "text-[#f47822]" : "text-[#f47822]"}`}>
                  What You&apos;ll Learn
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.outcomes.map((outcome, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-2 p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}
                    >
                      <CheckCircle className="w-4 h-4 text-[#f47822] flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements - Who is this course for */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-lg font-bold text-center mb-4 ${isDark ? "text-[#f47822]" : "text-[#f47822]"}`}>
                  Who is this course for?
                </h3>
                <div className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-2 p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}
                    >
                      <Info className="w-4 h-4 text-[#f47822] flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div className="mb-6">
              <h3 className={`text-lg font-bold text-center mb-4 ${isDark ? "text-[#f47822]" : "text-[#f47822]"}`}>
                Technologies & Tools
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {course.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border"
                    style={{ 
                      background: isDark ? "rgba(244,120,34,0.15)" : "rgba(244,120,34,0.1)", 
                      color: "#f47822", 
                      borderColor: "rgba(244,120,34,0.3)"
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Instructor Info */}
            <div className={`flex items-center justify-center gap-3 p-4 rounded-lg mb-6 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f47822] to-[#15142a] flex items-center justify-center text-white font-bold text-lg">
                {course.instructor.charAt(0)}
              </div>
              <div className="text-center">
                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{course.instructor}</p>
                <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{course.instructorBio}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {checkingStatus ? (
                <button
                  disabled
                  title={`Checking... Course ID: ${course.id}`}
                  className="flex-1 text-center py-3 px-6 text-sm font-bold rounded-xl bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </button>
              ) : applicationStatus === 'pending' ? (
                <button
                  disabled
                  title={`Status: pending | Course ID: ${course.id}`}
                  className="flex-1 text-center py-3 px-6 text-sm font-bold rounded-xl bg-yellow-500 text-white cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Pending Approval
                </button>
              ) : applicationStatus === 'approved' ? (
                <Link
                  href={`/lms/course/${course.slug || String(course.id)}`}
                  title={`Status: approved | Course ID: ${course.id}`}
                  className="flex-1 text-center py-3 px-6 text-sm font-bold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Access Course
                </Link>
              ) : (
                <Link
                  href={`/apply?course=${course.slug}`}
                  title={`No application | Course ID: ${course.id} | Detected: '${applicationStatus}'`}
                  className="flex-1 text-center py-3 px-6 text-sm font-bold rounded-xl bg-[#f47822] text-white hover:bg-[#e06b18] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                href="/academy"
                className={`flex-1 text-center py-3 px-6 text-sm font-bold rounded-xl border-2 transition-all duration-200 ${
                  isDark 
                    ? "border-[#f47822]/50 text-[#f47822] hover:bg-[#f47822]/10" 
                    : "border-[#f47822] text-[#f47822] hover:bg-[#f47822]/10"
                }`}
              >
                Back to Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Curriculum Preview */}
          <div className={`rounded-xl border p-6 ${isDark ? "bg-[#15142a]/50 border-white/10" : "bg-white border-gray-200"}`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? "text-[#f47822]" : "text-[#f47822]"}`}>
              <BookOpen className="w-5 h-5" />
              Course Curriculum
            </h3>
            <p className={`text-sm mb-4 ${isDark ? "text-white/70" : "text-gray-600"}`}>
              {course.modules.length} modules • {course.modules.reduce((a, m) => a + m.lessons, 0)} lessons
            </p>
            <div className="space-y-2">
              {course.modules.slice(0, 3).map((mod, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                  <span className="w-6 h-6 rounded bg-[#f47822]/20 text-[#f47822] text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span className={`text-sm truncate ${isDark ? "text-white/80" : "text-gray-700"}`}>{mod.title}</span>
                </div>
              ))}
              {course.modules.length > 3 && (
                <p className={`text-xs text-center ${isDark ? "text-white/50" : "text-gray-500"}`}>
                  +{course.modules.length - 3} more modules
                </p>
              )}
            </div>
          </div>

          {/* FAQs */}
          {course.faqs && course.faqs.length > 0 && (
            <div className={`rounded-xl border p-6 ${isDark ? "bg-[#15142a]/50 border-white/10" : "bg-white border-gray-200"}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? "text-[#f47822]" : "text-[#f47822]"}`}>
                <Info className="w-5 h-5" />
                Common Questions
              </h3>
              <div className="space-y-3">
                {course.faqs.slice(0, 2).map((faq, i) => (
                  <div key={i}>
                    <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{faq.q}</p>
                    <p className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-gray-500"}`}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
