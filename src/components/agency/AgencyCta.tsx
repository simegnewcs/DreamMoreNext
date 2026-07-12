"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AgencyCta() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <section className={`relative py-28 overflow-hidden ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {isDark && <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-purple-500/8 pointer-events-none" />}
      <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-20" : "opacity-5"}`} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("agency.ctaTitlePart1")} {" "}
            <span className="gradient-text">{t("agency.ctaTitlePart2")}</span>
          </h2>
          <p className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDark ? "text-white/55" : "text-gray-600"}`}>
            {t("agency.ctaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-base py-4 px-8">
              {t("agency.ctaPrimary")}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="btn-secondary text-base py-4 px-8">
              <Mail className="w-4 h-4" />
              {t("agency.ctaSecondary")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
