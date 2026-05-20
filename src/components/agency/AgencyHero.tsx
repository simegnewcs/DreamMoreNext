"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function AgencyHero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isDark ? "gradient-bg-agency" : "bg-gray-50"}`}>
      {/* Cinematic background */}
      <div className="absolute inset-0 pointer-events-none">
        {isDark && (
          <>
            <div className="absolute top-1/4 -left-32 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/2 to-transparent" style={{ backgroundSize: "100% 4px" }} />
          </>
        )}
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-30" : "opacity-5"}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="section-badge">Digital Agency</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-8"
        >
          <span className={isDark ? "text-white" : "text-gray-900"}>We Build Digital</span>
          <br />
          <span className="gradient-text">Experiences</span>
          <br />
          <span className={isDark ? "text-white/80" : "text-gray-600"}>That Convert</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-xl max-w-2xl mx-auto mb-12 leading-relaxed ${isDark ? "text-white/55" : "text-gray-600"}`}
        >
          From concept to launch — we architect world-class software, mobile apps, AI systems, and digital identities for forward-thinking businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/contact" className="btn-primary text-base py-4 px-8">
            Start a Project
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="btn-secondary text-base py-4 px-8 gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
              <Play className={`w-3.5 h-3.5 fill-current ${isDark ? "text-white" : "text-gray-700"}`} />
            </div>
            Watch Our Work
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className={`w-6 h-6 ${isDark ? "text-white/30" : "text-gray-400"}`} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
