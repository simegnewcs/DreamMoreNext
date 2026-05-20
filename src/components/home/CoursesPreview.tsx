"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, BarChart2, Star, ArrowRight, Users } from "lucide-react";
import { COURSES } from "@/lib/data";

const levelColor: Record<string, string> = {
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#ef4444",
};

export default function CoursesPreview() {
  const featured = COURSES.slice(0, 6);

  return (
    <section className="relative py-24 bg-[#050508] overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="section-badge section-badge-purple mb-4">Academy Courses</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Master High-Demand{" "}
              <span className="gradient-text">Digital Skills</span>
            </h2>
            <p className="text-white/50 mt-3 max-w-xl">
              Learn from industry professionals through real-world projects. Get certified and launch your career.
            </p>
          </div>
          <Link href="/academy" className="btn-secondary whitespace-nowrap self-start md:self-auto">
            View All 16 Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Course cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group glass rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300 card-hover card-hover-purple flex flex-col"
            >
              {/* Card image area */}
              <div className="relative h-44 bg-gradient-to-br from-purple-900/40 to-cyan-900/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-3xl">
                      {course.category === "development" ? "💻" :
                       course.category === "design" ? "🎨" :
                       course.category === "ai" ? "🤖" :
                       course.category === "marketing" ? "📈" :
                       course.category === "security" ? "🔐" :
                       course.category === "creative" ? "🎬" : "📚"}
                    </span>
                  </div>
                </div>
                {/* Level badge */}
                <div
                  className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    color: levelColor[course.level],
                    background: `${levelColor[course.level]}15`,
                    border: `1px solid ${levelColor[course.level]}30`,
                  }}
                >
                  {course.level}
                </div>
                {/* Duration badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-white/60 bg-black/40 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </div>
              </div>

              {/* Card content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                  {course.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/8">
                      {tech}
                    </span>
                  ))}
                  {course.technologies.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                      +{course.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-white">{course.rating}</span>
                    <span className="text-xs text-white/40 ml-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href={`/academy/course/${course.slug}`}
                    className="btn-purple text-xs py-1.5 px-4"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
