"use client";

import type { Metadata } from "next";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Briefcase, Users, Target, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const benefits = [
  { icon: Target, title: "Growth Opportunities", color: "#00d4ff", desc: "Continuous learning and professional development in a fast-paced environment." },
  { icon: Users, title: "Collaborative Culture", color: "#7c3aed", desc: "Work with talented individuals who are passionate about making a difference." },
  { icon: Zap, title: "Innovation First", color: "#ec4899", desc: "Be part of cutting-edge projects that push the boundaries of technology." },
  { icon: Briefcase, title: "Impact Work", color: "#10b981", desc: "Build solutions that empower African businesses and communities." },
];

export default function CareersPage() {
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
          <span className="section-badge mb-6">Join Our Team</span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            Build the Future with <span className="gradient-text">DreamMore</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? "text-white/55" : "text-gray-600"}`}>
            Join a team of passionate innovators dedicated to transforming Africa through digital excellence. We're looking for talented individuals who want to make an impact.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className={`py-16 ${isDark ? "bg-[#050508]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Why Work at <span className="gradient-text">DreamMore</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/55" : "text-gray-600"}`}>
              We offer more than just a job — we offer a career path where you can grow, innovate, and make a real difference.
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
              Open <span className="gradient-text">Positions</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/55" : "text-gray-600"}`}>
              We're always looking for talented individuals to join our team. Check out our current openings.
            </p>
          </div>

          <div className={`rounded-2xl p-8 text-center ${isDark ? "glass" : "bg-white border border-gray-200 shadow-sm"}`}>
            <Briefcase className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-white/30" : "text-gray-300"}`} />
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>No Current Openings</h3>
            <p className={`mb-6 ${isDark ? "text-white/50" : "text-gray-600"}`}>
              We're not actively hiring at the moment, but we're always interested in connecting with talented individuals.
            </p>
            <Link href="/contact" className="btn-primary inline-flex">
              Send Us Your Resume
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 ${isDark ? "bg-[#050508]" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Ready to Make an <span className="gradient-text">Impact</span>?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? "text-white/55" : "text-gray-600"}`}>
            Even if we don't have a current opening that matches your skills, we'd love to hear from you. Send us your resume and let us know how you can contribute to our mission.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
