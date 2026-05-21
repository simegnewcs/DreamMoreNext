"use client";

import type { Metadata } from "next";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Target, Eye, Heart, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const values = [
  { icon: Target, title: "Mission", color: "#00d4ff", desc: "To empower Africa through digital innovation by building world-class products and training the next generation of creators." },
  { icon: Eye, title: "Vision", color: "#7c3aed", desc: "To become Africa's leading digital ecosystem — a hub where technology, education, and innovation converge." },
  { icon: Heart, title: "Values", color: "#ec4899", desc: "Excellence, integrity, community, and relentless pursuit of innovation in everything we do." },
  { icon: Zap, title: "Impact", color: "#10b981", desc: "Transforming African businesses and empowering thousands of young professionals to compete globally." },
];

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen pt-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {isDark && <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/6 rounded-full blur-[120px]" />}
          <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-20" : "opacity-5"}`} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-badge mb-6">About DreamMore</span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            We Are a <span className="gradient-text">Digital Innovation</span> Ecosystem
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? "text-white/55" : "text-gray-600"}`}>
            DreamMore was founded with a bold vision: to bridge the gap between Africa&apos;s digital potential and the world-class technology needed to realize it.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className={`py-16 ${isDark ? "bg-[#050508]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-black mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>About Dreammore</h2>
              <div className={`space-y-4 leading-relaxed ${isDark ? "text-white/60" : "text-gray-600"}`}>
                <p>Dreammore Dream More is a collaborative group of dynamic youth and active team members dedicated to education purpose, digital marketing, and a wide range of tech-related services. We prioritize a client-centred approach, supported by our versatile service offerings and an unwavering commitment to quality. With a focus on reliability, trust, and continuous innovation, our dedicated team adapts to meet the evolving demands of every client, ensuring that we consistently exceed expectations.</p>
                <p className={`text-sm italic border-l-2 pl-4 ${isDark ? "border-orange-500/50 text-white/45" : "border-orange-400 text-gray-500"}`}>
                  ድሪም-ሞር የወጣትና የታታሪዎች ስብስብ ሲሆን በሀገራችን ላይ በትምህርቱ ዘርፍ፤ በድጂታል ማርኬቲንግ እና በሌሎች ቴክኖሎጂ ዘርፎች ስራዎች እና ሁለገብ ድጂታል ሃሳቦች ላይ በአንክሮ የሚሰራ ሩቅ አላሚ፤ ቀልጣፋ እና ዘመኑን የዋጁ ስራዎች ላይ የሚያተኩር ለሁሉም ደንበኞቻችን ፍላጎት ዋልታ እና የጋራ መድረክ የሆነ ሃገር በቀል ድርጅት ነው፡፡
                </p>
                <p>Our mission is to deliver outstanding services tailored to the unique needs of each client, ensuring quality, efficiency, and innovation in every aspect of our work. Dream More is an indigenous company committed to empowering our community with the tools and resources necessary for success in any sectors.</p>
                <p>At Dreammore, we are committed to excellence, innovation, and social impact. Our team of skilled professionals works tirelessly to deliver high-quality services that meet the unique needs of our clients.</p>
              </div>
              <Link href="/team" className="btn-primary inline-flex mt-8">
                Meet Our Team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "5+", label: "Years of Excellence" },
                { num: "30+", label: "Projects Delivered" },
                { num: "150+", label: "Students Trained" },
                { num: "16+", label: "Active Courses" },
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
              What Drives <span className="gradient-text">Us</span>
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
