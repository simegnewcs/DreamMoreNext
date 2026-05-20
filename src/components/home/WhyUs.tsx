"use client";

import { motion } from "framer-motion";
import { Layers, Zap, Users, Trophy } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const advantages = [
  {
    icon: Layers,
    color: "#00d4ff",
    title: "Real-World Curriculum",
    desc: "Our courses are built from the exact stacks and workflows we use every day for our agency clients — not outdated textbooks.",
  },
  {
    icon: Zap,
    color: "#7c3aed",
    title: "Active Practitioners",
    desc: "Your instructors are senior developers, designers, and marketers who are actively building products for global brands.",
  },
  {
    icon: Users,
    color: "#10b981",
    title: "Built-In Talent Pipeline",
    desc: "Our clients benefit from a continuously trained talent pool. Our graduates are pre-vetted, cutting-edge, and job-ready.",
  },
  {
    icon: Trophy,
    color: "#f59e0b",
    title: "Ecosystem Advantage",
    desc: "One ecosystem. Two power centers. Agency insights feed the Academy. Academy talent powers the Agency.",
  },
];

export default function WhyUs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative py-24 overflow-hidden ${isDark ? "bg-[#050508]" : "bg-gray-50"}`}>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-10" : "opacity-5"}`} />
        {isDark && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/4 rounded-full blur-[120px]" />
        )}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-5">Our Ecosystem Advantage</span>
          <h2 className={`text-4xl sm:text-5xl font-black mb-5 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            Why Doing Both Makes Us{" "}
            <span className="gradient-text">Better Than Everyone Else</span>
          </h2>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${isDark ? "text-white/50" : "text-gray-600"}`}>
            We don&apos;t just teach theory — we teach what we do every day for our global clients.
            Our students learn from active practitioners, and our clients benefit from a talent pool
            that is always at the cutting edge of digital innovation.
          </p>
        </motion.div>

        {/* Advantage cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {advantages.map((adv, i) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group rounded-2xl p-7 text-center transition-all duration-300 ${
                  isDark 
                    ? "glass hover:border-white/15" 
                    : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: adv.color + "14", border: `1px solid ${adv.color}22` }}
                >
                  <Icon className="w-6 h-6" style={{ color: adv.color }} />
                </div>
                <h4 className={`font-black mb-2.5 text-base ${isDark ? "text-white" : "text-gray-900"}`}>{adv.title}</h4>
                <p className={`text-sm leading-relaxed ${isDark ? "text-white/45" : "text-gray-600"}`}>{adv.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bridge quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="animated-border rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto"
        >
          <div className="text-5xl mb-6 opacity-60">&ldquo;</div>
          <blockquote className={`text-xl sm:text-2xl font-bold leading-relaxed mb-6 ${isDark ? "text-white/85" : "text-gray-700"}`}>
            Our students learn from active developers and marketers, and our clients
            benefit from a talent pool that is always at the cutting edge of digital innovation.
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ background: "linear-gradient(135deg, #f47822, #15142a)" }}>
              DM
            </div>
            <div className="text-left">
              <div className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>DreamMore Leadership</div>
              <div className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>Agency + Academy Ecosystem</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
