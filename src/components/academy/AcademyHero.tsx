"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, Users, BookOpen } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const stats = [
  { icon: BookOpen,     value: "16+",    label: "Courses" },
  { icon: Users,        value: "2,000+", label: "Students" },
  { icon: Award,        value: "98%",    label: "Job Placement" },
  { icon: GraduationCap, value: "100%", label: "Certified" },
];

export default function AcademyHero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className="relative pt-32 pb-20 overflow-hidden"
      style={{ background: isDark ? "#0c0b1e" : "#f8f9fa" }}
    >
      {/* Orange accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "linear-gradient(90deg, transparent, #f47822, transparent)" }} />

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] rounded-full blur-[180px]"
          style={{ background: "rgba(244,120,34,0.06)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-[150px]"
          style={{ background: "rgba(244,120,34,0.04)" }} />
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-8" : "opacity-4"}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="w-8 h-px" style={{ background: "#f47822" }} />
          <span className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "#f47822" }}>
            DreamMore Academy
          </span>
          <div className="w-8 h-px" style={{ background: "#f47822" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Master High-Demand<br />
          <span style={{ color: "#f47822" }}>Digital Skills.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-lg max-w-2xl mx-auto mb-12 ${isDark ? "text-white/50" : "text-gray-600"}`}
        >
          Learn from industry professionals through real-world projects.
          Get certified and launch your career in tech.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-5 py-3 rounded-xl"
              style={{ background: isDark ? "rgba(244,120,34,0.07)" : "rgba(244,120,34,0.1)", border: "1px solid rgba(244,120,34,0.15)" }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#f47822" }} />
              <div className="text-left">
                <div className={`text-base font-black ${isDark ? "text-white" : "text-gray-900"}`}>{value}</div>
                <div className={`text-[10px] uppercase tracking-wider ${isDark ? "text-white/40" : "text-gray-500"}`}>{label}</div>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
