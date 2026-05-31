"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

/* Per-course accent color + app-icon background + photo */
const courseCard: Record<string, { accent: string; iconBg: string; iconText: string; photo: string; difficulty: string }> = {
  "full-stack-development": {
    accent: "#3b82f6",
    iconBg: "#1e3a5f",
    iconText: "{ }",
    photo: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    difficulty: "Intermediate",
  },
  "ui-ux-design": {
    accent: "#10b981",
    iconBg: "#064e3b",
    iconText: "◈",
    photo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    difficulty: "Beginner",
  },
  "ai-engineering": {
    accent: "#8b5cf6",
    iconBg: "#2e1065",
    iconText: "AI",
    photo: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    difficulty: "Advanced",
  },
  "graphic-design": {
    accent: "#f47822",
    iconBg: "#431407",
    iconText: "Ps",
    photo: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
    difficulty: "Beginner",
  },
  "digital-marketing": {
    accent: "#ec4899",
    iconBg: "#4a044e",
    iconText: "↗",
    photo: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=600&q=80",
    difficulty: "Beginner",
  },
  "mobile-app-development": {
    accent: "#06b6d4",
    iconBg: "#083344",
    iconText: "📱",
    photo: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
    difficulty: "Intermediate",
  },
  cybersecurity: {
    accent: "#ef4444",
    iconBg: "#450a0a",
    iconText: "🔐",
    photo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
    difficulty: "Advanced",
  },
  "video-editing": {
    accent: "#a855f7",
    iconBg: "#3b0764",
    iconText: "Pr",
    photo: "https://images.unsplash.com/photo-1574717024453-354056afd6fc?w=600&q=80",
    difficulty: "Beginner",
  },
};

const fallbackCard = { accent: "#f47822", iconBg: "#431407", iconText: "D", photo: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80", difficulty: "Beginner" };

export default function AcademyPillar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses?limit=4")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.courses?.length) setFeatured(data.courses);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="academy-skills" className="relative overflow-hidden">

      {/* ══════════════════════════════════════
          FULL-BLEED BACKGROUND — classroom photo
      ══════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=85"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/* overlay so text is readable */}
        <div className="absolute inset-0" style={{ 
          background: isDark 
            ? "linear-gradient(180deg, rgba(10,9,26,0.72) 0%, rgba(10,9,26,0.88) 50%, rgba(10,9,26,0.97) 100%)" 
            : "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.97) 100%)" 
        }} />
        <div className="absolute inset-0" style={{ 
          background: isDark 
            ? "linear-gradient(90deg, rgba(10,9,26,0.6) 0%, transparent 40%, transparent 60%, rgba(10,9,26,0.6) 100%)" 
            : "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.5) 100%)" 
        }} />
      </div>

      {/* ══════════════════════════════════════
          CONTENT
      ══════════════════════════════════════ */}
      <div className="relative z-10 py-14 lg:py-28">

        {/* ── Headline block ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center px-4 mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-px" style={{ background: "#f47822" }} />
            <span className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "#f47822" }}>
              The Academy — The Teach
            </span>
            <div className="w-8 h-px" style={{ background: "#f47822" }} />
          </div>
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.0] tracking-tight uppercase ${isDark ? "text-white" : "text-gray-900"}`}>
            Master 16+ In-Demand<br />Digital Skills.
          </h2>
        </motion.div>

        {/* ── Horizontal card row ── */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

            {/* Skeleton while loading */}
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] sm:w-[240px] h-[260px] rounded-2xl animate-pulse snap-start"
                style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }} />
            ))}

            {/* Course cards */}
            {!loading && featured.map((course: any, i: number) => {
              const card = courseCard[course.slug] ?? fallbackCard;
              const photo = course.image || card.photo;
              const difficulty = course.level || card.difficulty;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="flex-shrink-0 w-[200px] sm:w-[240px] snap-start"
                >
                  <Link href={`/academy/course/${course.slug}`} className="group block h-full">
                    <div
                      className="h-full rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl"
                      style={{
                        background: isDark ? "rgba(13,12,30,0.92)" : "rgba(255,255,255,0.95)",
                        border: `1.5px solid ${card.accent}${isDark ? "40" : "60"}`,
                        boxShadow: isDark ? `0 8px 32px rgba(0,0,0,0.5)` : `0 8px 32px rgba(0,0,0,0.1)`,
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      {/* Colored top border accent */}
                      <div className="h-1 w-full flex-shrink-0" style={{ background: card.accent }} />

                      {/* App icon row */}
                      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                          style={{ background: card.iconBg, border: `1px solid ${card.accent}40` }}
                        >
                          {card.iconText}
                        </div>
                        <div>
                          <p className={`text-[11px] font-black leading-tight line-clamp-1 ${isDark ? "text-white" : "text-gray-900"}`}>{course.title}</p>
                          <p className={`text-[9px] line-clamp-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>{(course.short_description || course.description || "").split(".")[0]}</p>
                        </div>
                      </div>

                      {/* Course photo */}
                      <div className="relative mx-3 rounded-xl overflow-hidden h-28 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>

                      {/* Info */}
                      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1 flex-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={isDark ? "text-white/45" : "text-gray-500"}>Level:</span>
                          <span className={`font-semibold ${isDark ? "text-white/70" : "text-gray-700"}`}>{difficulty}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={isDark ? "text-white/45" : "text-gray-500"}>Duration:</span>
                          <span className={`font-semibold ${isDark ? "text-white/70" : "text-gray-700"}`}>{course.duration}</span>
                        </div>
                        {course.price != null && (
                          <div className="flex items-center justify-between text-[10px]">
                            <span className={isDark ? "text-white/45" : "text-gray-500"}>Price:</span>
                            <span className="font-bold" style={{ color: card.accent }}>{course.currency || "ETB"} {Number(course.price).toLocaleString()}</span>
                          </div>
                        )}

                        {/* CTA arrow */}
                        <div
                          className="mt-2 w-8 h-8 rounded-full flex items-center justify-center self-end transition-all duration-200 group-hover:scale-110"
                          style={{ background: card.accent }}
                        >
                          <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* ── Student Success stat card ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.36 }}
              className="flex-shrink-0 w-[160px] sm:w-[200px] snap-start"
            >
              <div
                className="h-full rounded-2xl flex flex-col items-center justify-center text-center p-6"
                style={{
                  background: isDark ? "rgba(13,12,30,0.92)" : "rgba(255,255,255,0.95)",
                  border: isDark ? "1.5px solid rgba(244,120,34,0.35)" : "1.5px solid rgba(244,120,34,0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-white/60" : "text-gray-500"}`}>Student Success</p>
                <div className="text-5xl font-black mb-1" style={{ color: "#f47822" }}>
                  150+
                </div>
                <p className={`text-xs font-black uppercase tracking-widest leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  Professionals<br />Trained
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-10 px-4"
        >
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 px-10 py-4 text-sm font-black uppercase tracking-widest text-white rounded-sm transition-all hover:brightness-110 active:scale-95"
            style={{ background: "#f47822" }}
          >
            Browse All Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
