"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, Quote, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Testimonials() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(data => { if (data.success) setTestimonials(data.testimonials || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden" style={{ background: isDark ? "#0c0b1e" : "#f8f9fa" }}>
      {/* ── Orange top accent bar ── */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, transparent, #f47822, transparent)" }} />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full blur-[180px]"
          style={{ background: "rgba(244,120,34,0.05)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full blur-[150px]"
          style={{ background: "rgba(244,120,34,0.04)" }} />
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-8" : "opacity-4"}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-8 h-px" style={{ background: "#f47822" }} />
            <span className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "#f47822" }}>
              Testimonials
            </span>
            <div className="w-8 h-px" style={{ background: "#f47822" }} />
          </div>
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.0] tracking-tight mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("home.testimonialsTitle")}
          </h2>
          <p className={`text-base leading-relaxed max-w-xl mx-auto ${isDark ? "text-white/50" : "text-gray-600"}`}>
            {t("home.testimonialsDesc")}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#f47822" }} />
          </div>
        ) : testimonials.length === 0 ? null : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative"
            >
              <div
                className="h-full rounded-2xl p-6 transition-all duration-300 group-hover:-translate-y-2"
                style={{
                  background: isDark ? "rgba(19,18,42,0.8)" : "rgba(255,255,255,0.9)",
                  border: isDark ? "1px solid rgba(244,120,34,0.12)" : "1px solid rgba(244,120,34,0.2)",
                  backdropFilter: "blur(12px)",
                  boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                {/* Quote icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(244,120,34,0.1)", border: "1px solid rgba(244,120,34,0.2)" }}
                >
                  <Quote className="w-5 h-5" style={{ color: "#f47822" }} />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${idx < testimonial.rating ? "fill-yellow-400 text-yellow-400" : isDark ? "text-white/20" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-white/70" : "text-gray-600"}`}>
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(244,120,34,0.1)" }}>
                  {/* Avatar placeholder */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white"
                    style={{ background: "linear-gradient(135deg, rgba(244,120,34,0.3), rgba(244,120,34,0.1))", border: "1px solid rgba(244,120,34,0.3)" }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{testimonial.name}</p>
                    <p className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div
            className="inline-flex flex-wrap justify-center items-center gap-4 sm:gap-6 px-5 sm:px-8 py-4 rounded-2xl"
            style={{ 
              background: isDark ? "rgba(244,120,34,0.05)" : "rgba(244,120,34,0.08)", 
              border: isDark ? "1px solid rgba(244,120,34,0.15)" : "1px solid rgba(244,120,34,0.2)" 
            }}
          >
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: "#f47822" }}>4.9★</p>
              <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-white/40" : "text-gray-500"}`}>Average Rating</p>
            </div>
            <div className={`w-px h-10 ${isDark ? "bg-white/10" : "bg-gray-300"}`} />
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: "#f47822" }}>50+</p>
              <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-white/40" : "text-gray-500"}`}>Happy Clients</p>
            </div>
            <div className={`w-px h-10 ${isDark ? "bg-white/10" : "bg-gray-300"}`} />
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: "#f47822" }}>98%</p>
              <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-white/40" : "text-gray-500"}`}>Satisfaction Rate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
