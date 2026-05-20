"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function TeamPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then(r => r.json())
      .then(data => { if (data.success) setMembers(data.members || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const preview = members.slice(0, 4);

  return (
    <section className={`relative py-24 overflow-hidden ${isDark ? "bg-[#04060f]" : "bg-gray-50"}`}>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        {isDark && (
          <>
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
            <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />
          </>
        )}
        <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-10" : "opacity-5"}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          <div>
            <span className="section-badge mb-4">Our Team</span>
            <h2 className={`text-4xl sm:text-5xl font-black leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              The Innovators<br />
              Behind <span className="gradient-text">DreamMore</span>
            </h2>
          </div>
          <Link
            href="/team"
            className="btn-secondary text-sm py-3 px-5 self-start sm:self-auto"
          >
            Meet the Full Team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Team grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-white/30" : "text-gray-300"}`} />
          </div>
        ) : preview.length === 0 ? null : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {preview.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group rounded-2xl p-6 text-center transition-all duration-300 card-hover ${
                isDark 
                  ? "glass hover:border-white/15" 
                  : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"
              }`}
            >
              {/* Avatar */}
              <div className="relative w-16 h-16 mx-auto mb-4">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white" style={{ background: "linear-gradient(135deg, #f47822, #15142a)" }}>
                    {member.name.charAt(0)}
                  </div>
                )}
                <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center ${isDark ? "bg-[#04060f]" : "bg-white"}`}>
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>

              <h4 className={`font-black mb-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{member.name}</h4>
              <div className="text-xs font-semibold mb-3" style={{ color: "#f47822" }}>{member.position}</div>
              <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>{member.bio}</p>

              {/* Specialties */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {member.specialties.slice(0, 2).map((s: string) => (
                  <span key={s} className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? "bg-white/5 text-white/40 border border-white/8" : "bg-orange-50 text-gray-600 border border-orange-200"}`}>
                    {s}
                  </span>
                ))}
              </div>

              {/* LinkedIn hover */}
              <a
                href={member.linkedin}
                className={`mt-4 inline-flex items-center gap-1.5 text-xs transition-colors ${isDark ? "text-white/25 hover:text-orange-400" : "text-gray-400 hover:text-orange-500"}`}
              >
                <ExternalLink className="w-3 h-3" />
                Profile
              </a>
            </motion.div>
          ))}
        </div>
        )}

        {/* Footer nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className={`text-sm ${isDark ? "text-white/35" : "text-gray-500"}`}>
            {members.length > 4 ? `And ${members.length - preview.length}+ more talented individuals driving DreamMore's mission. ` : "Meet the talented individuals driving DreamMore's mission. "}
            <Link href="/team" className="hover:underline font-medium" style={{ color: "#f47822" }}>
              View all →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
