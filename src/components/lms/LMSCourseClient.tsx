"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, ChevronRight, PlayCircle, CheckCircle, Home, 
  Code, Database, Server, Layout, GitBranch, Terminal
} from "lucide-react";

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
  icon?: string;
}

interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string;
  duration?: string;
  level?: string;
  image?: string;
  batch?: string;
  instructor?: string;
}

interface LMSCourseClientProps {
  course: Course;
  modules: Module[];
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// Phase icons mapping
const phaseIcons: Record<string, React.ReactNode> = {
  "1": <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">5</div>,
  "2": <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">JS</div>,
  "3": <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">R</div>,
  "4": <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">P</div>,
  "5": <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg">A</div>,
};

// Default icons for phases
const getPhaseIcon = (index: number) => {
  const icons = [
    <Layout className="w-6 h-6 text-orange-600" />,
    <Code className="w-6 h-6 text-green-600" />,
    <Server className="w-6 h-6 text-blue-600" />,
    <GitBranch className="w-6 h-6 text-purple-600" />,
    <Terminal className="w-6 h-6 text-red-600" />,
  ];
  return icons[index % icons.length];
};

export default function LMSCourseClient({ course, modules, user }: LMSCourseClientProps) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const togglePhase = (phaseId: number) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  // Generate batch info from current date if not provided
  const batchInfo = course.batch || "Class of " + new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toLowerCase();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2">
              <Link href="/lms" className="flex items-center gap-1 text-gray-500 hover:text-[#f47822] transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/lms" className="text-gray-500 hover:text-[#f47822] transition-colors">
                Fullstack Web Application Development
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#f47822] font-medium">{batchInfo}</span>
            </nav>

            {/* Batch Info */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500">{batchInfo}</span>
              <Link 
                href="#" 
                className="text-[#f47822] hover:underline text-xs"
              >
                Click here for live Q&A Session
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-[#f47822] font-medium">{batchInfo}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {course.title}
          </h1>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            Welcome to the {course.title} dashboard. On this page, you will find all the class related materials. 
            We will be using this page to guide you to follow up with the course.
          </p>
        </div>

        {/* Phases / Modules List */}
        <div className="space-y-4">
          {modules.map((module, index) => {
            const isExpanded = expandedPhase === module.id;
            const completedCount = module.lessons.filter(l => l.is_completed).length;
            const totalCount = module.lessons.length;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Phase Header - Always visible */}
                <button
                  onClick={() => togglePhase(module.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  {/* Phase Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {getPhaseIcon(index)}
                  </div>

                  {/* Phase Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      Phase {index + 1}: {module.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>{totalCount} lessons</span>
                      {completedCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">{completedCount} completed</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0">
                    <ChevronRight 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`} 
                    />
                  </div>
                </button>

                {/* Expanded Content - Lessons */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 bg-gray-50/30"
                  >
                    <div className="p-4 space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
                        >
                          {/* Lesson Status */}
                          <div className="flex-shrink-0">
                            {lesson.is_completed ? (
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                <PlayCircle className="w-3 h-3 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${
                              lesson.is_completed ? "text-gray-500 line-through" : "text-gray-700"
                            }`}>
                              Lesson {lessonIndex + 1}: {lesson.title}
                            </p>
                          </div>

                          {/* Duration */}
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {modules.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Phases Available</h3>
            <p className="text-gray-500 text-sm">Course content is being prepared. Check back soon!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">DREAM</span>
              <span className="text-[#f47822]">MORE</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-gray-700">About Us</Link>
              <Link href="#" className="hover:text-gray-700">Privacy Policy</Link>
              <Link href="#" className="hover:text-gray-700">Terms of Services</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
