"use client";

import type { Metadata } from "next";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Briefcase, Users, Target, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function CareersPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const benefits = [
    { icon: Target, title: t("careers.benefits.growthTitle"), color: "#00d4ff", desc: t("careers.benefits.growthDesc") },
    { icon: Users, title: t("careers.benefits.collabTitle"), color: "#7c3aed", desc: t("careers.benefits.collabDesc") },
    { icon: Zap, title: t("careers.benefits.innovationTitle"), color: "#ec4899", desc: t("careers.benefits.innovationDesc") },
    { icon: Briefcase, title: t("careers.benefits.impactTitle"), color: "#10b981", desc: t("careers.benefits.impactDesc") },
  ];

  return (
    <div className={`min-h-screen pt-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {isDark && <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/6 rounded-full blur-[120px]" />}
          <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-20" : "opacity-5"}`} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-badge mb-6">{t("careers.heroBadge")}</span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("careers.heroTitlePart1")} <span className="gradient-text">{t("careers.heroTitlePart2")}</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? "text-white/55" : "text-gray-600"}`}>
            {t("careers.heroDescription")}
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className={`py-16 ${isDark ? "bg-[#050508]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("careers.sectionTitlePart1")} <span className="gradient-text">{t("careers.sectionTitlePart2")}</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/55" : "text-gray-600"}`}>
              {t("careers.sectionDescription")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className={`rounded-2xl p-6 text-center ${isDark ? "glass" : "bg-gray-50 border border-gray-200 shadow-sm"}`}>
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: b.color + (isDark ? "15" : "20"), border: `1px solid ${b.color}${isDark ? "25" : "40"}` }}>
                    <Icon className="w-7 h-7" style={{ color: b.color }} />
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{b.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-white/50" : "text-gray-600"}`}>{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("careers.positionsTitlePart1")} <span className="gradient-text">{t("careers.positionsTitlePart2")}</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/55" : "text-gray-600"}`}>
              {t("careers.positionsDescription")}
            </p>
          </div>

          <div className={`rounded-2xl p-8 text-center ${isDark ? "glass" : "bg-white border border-gray-200 shadow-sm"}`}>
            <Briefcase className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-white/30" : "text-gray-300"}`} />
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{t("careers.noOpeningsTitle")}</h3>
            <p className={`mb-6 ${isDark ? "text-white/50" : "text-gray-600"}`}>
              {t("careers.noOpeningsDescription")}
            </p>
            <Link href="/contact" className="btn-primary inline-flex">
              {t("careers.resumeCta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 ${isDark ? "bg-[#050508]" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("careers.ctaTitlePart1")} <span className="gradient-text">{t("careers.ctaTitlePart2")}</span>
          </h2>
          <p className={`text-lg mb-8 ${isDark ? "text-white/55" : "text-gray-600"}`}>
            {t("careers.ctaDescription")}
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            {t("careers.ctaButton")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
