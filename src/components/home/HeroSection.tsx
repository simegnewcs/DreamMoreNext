"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Play, TrendingUp, Users, Award, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";
  
  return (
    <section className={`relative min-h-screen overflow-hidden ${isDark ? "" : "bg-gray-50"}`}>

      {/* ═══════════════════════════════════════════════════════
          FULL-BLEED BACKGROUND IMAGE
      ═══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        {/* Main background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Overlay - dark for dark mode, light for light mode */}
        <div className="absolute inset-0" style={{ background: isDark ? "rgba(11,10,26,0.2)" : "rgba(255,255,255,0.85)" }} />
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: isDark 
          ? "linear-gradient(180deg, rgba(11,10,26,0.15) 0%, rgba(11,10,26,0.25) 50%, rgba(11,10,26,0.45) 100%)" 
          : "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.7) 100%)" 
        }} />
        <div className="absolute inset-0" style={{ background: isDark 
          ? "linear-gradient(90deg, rgba(11,10,26,0.25) 0%, transparent 15%, transparent 85%, rgba(11,10,26,0.25) 100%)" 
          : "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, transparent 15%, transparent 85%, rgba(255,255,255,0.5) 100%)" 
        }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-4" />
      </div>

      {/* Orange accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 z-50"
        style={{ background: "linear-gradient(90deg, transparent, #f47822, transparent)" }} />

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════════════ */}
      <div className="relative z-10 pt-20 lg:pt-24">

        {/* ── Top Tagline ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-4 mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-px" style={{ background: isDark ? "#ffffff" : "#f47822" }} />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full" style={{ background: "rgba(244,120,34,0.15)", color: "#f47822", border: "1px solid rgba(244,120,34,0.3)" }}>
              {t("home.heroTag")}
            </span>
            <div className="w-6 h-px" style={{ background: isDark ? "#ffffff" : "#f47822" }} />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase">
            <span className={isDark ? "text-white" : "text-gray-900"}>Empowering</span>{" "}
            <span style={{ color: "#f47822" }}>Africa&apos;s</span>{" "}
            <span className={isDark ? "text-white" : "text-gray-900"}>{t("home.heroTitle")}</span>
          </h1>
        </motion.div>

        {/* ── Split Hero Cards ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ════════ LEFT — AGENCY ════════ */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative rounded-3xl overflow-hidden"
              style={{
                background: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(244,120,34,0.3)",
                boxShadow: isDark 
                  ? "0 25px 80px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)" 
                  : "0 25px 80px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {/* Subtle warm glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(244,120,34,0.12) 0%, transparent 50%)" }} />

              <div className="relative p-5 sm:p-8 lg:p-10 flex flex-col h-full min-h-[480px] sm:min-h-[600px]">

                {/* Header */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#f47822" }}>
                    {t("home.agencyEyebrow")}
                  </p>
                  <h2 className="text-4xl sm:text-5xl font-black leading-[0.95] tracking-tight">
                    <span className={isDark ? "text-white" : "text-gray-900"}>DREAM</span>
                    <span style={{ color: "#f47822" }}>MORE</span><br />
                    <span style={{ color: isDark ? "#ffffff" : "#15142a" }}>{t("home.agencyTitle")}</span>
                  </h2>
                </div>

                {/* Dashboard Mockup with Real Image */}
                <div className="relative flex-1 mb-6">
                  <div className="relative mx-auto max-w-md">
                    {/* Main dashboard image */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl"
                      style={{ border: "1px solid rgba(244,120,34,0.2)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                        alt="Analytics Dashboard"
                        className="w-full aspect-[16/10] object-cover"
                      />
                      {/* Dark overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#15142a] via-transparent to-transparent opacity-60" />

                      {/* Stats overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        {[
                          { label: "Revenue", val: "ETB 2.4M", color: "#f47822" },
                          { label: "Projects", val: "18 Live", color: isDark ? "#ffffff" : "#15142a" },
                          { label: "Clients", val: "50+", color: "#f47822" },
                        ].map((s) => (
                          <div key={s.label} className="flex-1 rounded-lg px-3 py-2 text-center"
                            style={{ 
                              background: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.8)", 
                              border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(244,120,34,0.2)", 
                              backdropFilter: "blur(8px)" 
                            }}>
                            <p className={`text-[10px] uppercase ${isDark ? "text-white/60" : "text-gray-500"}`}>{s.label}</p>
                            <p className="text-sm font-black" style={{ color: s.color }}>{s.val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Mac-style window bar */}
                      <div className="absolute top-0 left-0 right-0 h-7 flex items-center px-3 gap-1.5"
                        style={{ background: "rgba(0,0,0,0.4)" }}>
                        {["#ff5f57","#ffbd2e","#28c940"].map(c => (
                          <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                        ))}
                        <span className="text-[8px] text-white/30 font-mono ml-2 flex-1 text-center">dreammore.et/dashboard</span>
                      </div>
                    </div>

                    {/* Floating phone */}
                    <div className="hidden sm:block absolute -right-4 bottom-0 w-[22%] aspect-[9/18] rounded-2xl overflow-hidden shadow-xl border-2 border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80"
                        alt="Mobile App"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#15142a]/80 to-transparent" />
                    </div>

                    {/* Floating client badge */}
                    <motion.div
                      whileHover={{ scale: 1.05, backgroundColor: "#f47822" }}
                      transition={{ duration: 0.3 }}
                      className="hidden sm:block absolute -right-2 top-8 px-3 py-2 rounded-xl shadow-lg border-2 cursor-pointer"
                      style={{ background: "#ffffff", borderColor: "#f47822" }}
                      onClick={() => {
                        document.getElementById('trusted-brands')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      title="View trusted brands"
                    >
                      <p className="text-[9px] font-black leading-tight text-center text-[#15142a] hover:text-white transition-colors duration-300">
                        TRUSTED<br/><span className="text-[#f47822] hover:text-white transition-colors duration-300">BY 50+</span>
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-6 max-w-sm ${isDark ? "text-white/70" : "text-gray-600"}`}>
                  {t("home.agencyDescription")}
                </p>

                {/* CTA */}
                <Link
                  href="/agency"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest rounded-xl transition-all hover:gap-3 group/cta border-2"
                  style={{ background: "#ffffff", color: "#15142a", borderColor: "#f47822", maxWidth: "240px" }}
                >
                  {t("home.agencyCta")}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" style={{ color: "#f47822" }} />
                </Link>

              </div>
            </motion.div>

            {/* ════════ RIGHT — ACADEMY ════════ */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="group relative rounded-3xl overflow-hidden"
              style={{
                background: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(244,120,34,0.3)",
                boxShadow: isDark 
                  ? "0 25px 80px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)" 
                  : "0 25px 80px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {/* Subtle warm glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(244,120,34,0.12) 0%, transparent 60%)" }} />

              <div className="relative p-5 sm:p-8 lg:p-10 flex flex-col h-full min-h-[480px] sm:min-h-[600px]">

                {/* Header */}
                <div className="mb-6 text-right">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#f47822" }}>
                    {t("home.academyEyebrow")}
                  </p>
                  <h2 className="text-4xl sm:text-5xl font-black leading-[0.95] tracking-tight">
                    <span style={{ color: isDark ? "#ffffff" : "#15142a" }}>THE SKILLS</span><br />
                    <span style={{ color: "#f47822" }}>{t("home.academyTitle")}</span>
                  </h2>
                </div>

                {/* Student Scene with Real Image */}
                <div className="relative flex-1 mb-6">
                  <div className="relative mx-auto max-w-md">
                    {/* Main classroom image */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl"
                      style={{ border: "1px solid rgba(244,120,34,0.25)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                        alt="Students Learning"
                        className="w-full aspect-[4/3] object-cover"
                      />
                      {/* Warm overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2d1810]/90 via-[#2d1810]/30 to-transparent" />

                      {/* Course tags */}
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                        {["Full Stack","UI/UX","AI/ML","Marketing"].map((t, i) => (
                          <span key={t} className="text-[9px] px-2.5 py-1 rounded-full font-bold"
                            style={{ 
                              background: i % 2 === 0 
                                ? (isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.8)") 
                                : "rgba(244,120,34,0.3)", 
                              border: i % 2 === 0 
                                ? (isDark ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(244,120,34,0.3)") 
                                : "1px solid rgba(244,120,34,0.4)",
                              color: i % 2 === 0 && !isDark ? "#15142a" : "#ffffff"
                            }}>
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
                          style={{ background: "rgba(244,120,34,0.9)", boxShadow: "0 0 40px rgba(244,120,34,0.4)" }}
                        >
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Floating student avatars */}
                    <div className="hidden sm:flex absolute -left-3 top-8 -space-x-2">
                      {["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100","https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"].map((src, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#2d1810] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-[#2d1810] flex items-center justify-center text-xs font-bold"
                        style={{ background: "#ffffff", color: "#15142a" }}>
                        +2k
                      </div>
                    </div>

                    {/* Stats badge */}
                    <motion.div
                      whileHover={{ scale: 1.05, backgroundColor: "#f47822" }}
                      transition={{ duration: 0.3 }}
                      className="hidden sm:block absolute -right-2 bottom-16 px-4 py-3 rounded-xl border-2 cursor-pointer"
                      style={{ background: "#ffffff", borderColor: "#f47822" }}
                      onClick={() => {
                        document.getElementById('academy-skills')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      title="Browse all courses"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#f47822] hover:text-white transition-colors duration-300" />
                        <span className="text-sm font-black text-[#15142a] hover:text-white transition-colors duration-300">16+</span>
                      </div>
                      <p className="text-[9px] uppercase tracking-wider text-[#f47822] hover:text-white/90 transition-colors duration-300">Courses</p>
                    </motion.div>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-6 max-w-sm ml-auto text-right ${isDark ? "text-white/70" : "text-gray-600"}`}>
                  {t("home.academyDescription")}
                </p>

                {/* CTA */}
                <div className="flex justify-end">
                  <Link
                    href="/academy"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest rounded-xl transition-all hover:gap-3 group/cta border-2"
                    style={{ background: "#ffffff", color: "#15142a", borderColor: "#f47822", maxWidth: "240px" }}
                  >
                    Join the Academy
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" style={{ color: "#f47822" }} />
                  </Link>
                </div>

              </div>
            </motion.div>

          </div>

          {/* ── Trust Bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-5 sm:gap-8 lg:gap-12 px-4 sm:px-6 py-4 rounded-2xl"
            style={{ 
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)", 
              border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(244,120,34,0.2)" 
            }}
          >
            {[
              { icon: Award, label: "Award Winning", value: "Agency", color: isDark ? "#ffffff" : "#15142a" },
              { icon: Users, label: "150+", value: "Students Trained", color: "#f47822" },
              { icon: TrendingUp, label: "98%", value: "Success Rate", color: isDark ? "#ffffff" : "#15142a" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: isDark ? "rgba(255,255,255,0.1)" : "rgba(244,120,34,0.1)", 
                    border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(244,120,34,0.2)" 
                  }}>
                  <Icon className="w-5 h-5" style={{ color: color }} />
                </div>
                <div>
                  <p className="text-sm font-black" style={{ color: color }}>{label}</p>
                  <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}

