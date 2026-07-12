"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, Quote, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AgencyTestimonials() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(data => { if (data.success) setTestimonials(data.testimonials || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative py-24 bg-[#050508] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="relative py-24 bg-[#050508] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/4 to-purple-500/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4">{t("agency.testimonialsEyebrow")}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            {t("agency.testimonialsTitlePart1")} <span className="gradient-text">{t("agency.testimonialsTitlePart2")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="animated-border rounded-2xl p-7 relative group"
            >
              <div className="absolute top-5 right-5 opacity-8">
                <Quote className="w-12 h-12 text-cyan-400" />
              </div>
              <div className="flex gap-0.5 mb-5">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-4 h-4 ${n <= (t.rating ?? 5) ? "text-yellow-400 fill-yellow-400" : "text-white/10"}`} />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6 italic">&quot;{t.content}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/40">{[t.role, t.company].filter(Boolean).join(" · ")}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
