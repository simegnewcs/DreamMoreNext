"use client";

import type { Metadata } from "next";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Target, Eye, Heart, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const values = [
    { icon: Target, title: t("about.values.missionTitle"), color: "#00d4ff", desc: t("about.values.missionDesc") },
    { icon: Eye, title: t("about.values.visionTitle"), color: "#7c3aed", desc: t("about.values.visionDesc") },
    { icon: Heart, title: t("about.values.valuesTitle"), color: "#ec4899", desc: t("about.values.valuesDesc") },
    { icon: Zap, title: t("about.values.impactTitle"), color: "#10b981", desc: t("about.values.impactDesc") },
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
          <span className="section-badge mb-6">{t("about.heroBadge")}</span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("about.heroTitlePart1")} <span className="gradient-text">{t("about.heroTitlePart2")}</span> {t("about.heroTitlePart3")}
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? "text-white/55" : "text-gray-600"}`}>
            {t("about.heroDescription")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className={`py-16 ${isDark ? "bg-[#050508]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-black mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>{t("about.storyTitle")}</h2>
              <div className={`space-y-4 leading-relaxed ${isDark ? "text-white/60" : "text-gray-600"}`}>
                <p>{t("about.storyParagraph1")}</p>
                <p className={`text-sm italic border-l-2 pl-4 ${isDark ? "border-orange-500/50 text-white/45" : "border-orange-400 text-gray-500"}`}>
                  ድሪም-ሞር የወጣትና የታታሪዎች ስብስብ ሲሆን በሀገራችን ላይ በትምህርቱ ዘርፍ፤ በድጂታል ማርኬቲንግ እና በሌሎች ቴክኖሎጂ ዘርፎች ስራዎች እና ሁለገብ ድጂታል ሃሳቦች ላይ በአንክሮ የሚሰራ ሩቅ አላሚ፤ ቀልጣፋ እና ዘመኑን የዋጁ ስራዎች ላይ የሚያተኩር ለሁሉም ደንበኞቻችን ፍላጎት ዋልታ እና የጋራ መድረክ የሆነ ሃገር በቀል ድርጅት ነው፡፡
                </p>
                <p>{t("about.storyParagraph2")}</p>
                <p>{t("about.storyParagraph3")}</p>
              </div>
              <Link href="/team" className="btn-primary inline-flex mt-8">
                {t("about.meetTeam")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "5+", label: t("about.stats.years") },
                { num: "30+", label: t("about.stats.projects") },
                { num: "150+", label: t("about.stats.students") },
                { num: "16+", label: t("about.stats.courses") },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl p-6 text-center ${isDark ? "glass" : "bg-gray-50 border border-gray-200 shadow-sm"}`}>
                  <div className="text-3xl font-black gradient-text mb-1">{s.num}</div>
                  <div className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("about.valuesTitlePart1")} <span className="gradient-text">{t("about.valuesTitlePart2")}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className={`rounded-2xl p-6 text-center ${isDark ? "glass" : "bg-white border border-gray-200 shadow-sm"}`}>
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: v.color + (isDark ? "15" : "20"), border: `1px solid ${v.color}${isDark ? "25" : "40"}` }}>
                    <Icon className="w-7 h-7" style={{ color: v.color }} />
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{v.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-white/50" : "text-gray-600"}`}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
