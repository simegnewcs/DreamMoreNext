"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ExternalLink, Share2, Users, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function TeamClient() {
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

  return (
    <div className={`min-h-screen pt-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {isDark && (
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px]" />
          )}
          <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-20" : "opacity-5"}`} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-badge section-badge-purple mb-4">Our Team</span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-5 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            The Innovators Behind <span className="gradient-text">DreamMore</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/55" : "text-gray-600"}`}>
            A passionate team of developers, designers, educators, and strategists driving Africa&apos;s digital transformation.
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className={`w-10 h-10 animate-spin ${isDark ? "text-white/30" : "text-gray-300"}`} />
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                <Users className={`w-10 h-10 ${isDark ? "text-white/15" : "text-gray-300"}`} />
              </div>
              <p className={`text-xl font-bold ${isDark ? "text-white/40" : "text-gray-400"}`}>No team members yet</p>
              <p className={`text-sm mt-1 ${isDark ? "text-white/25" : "text-gray-400"}`}>Team members will appear here once added from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`group rounded-2xl p-7 text-center transition-all duration-300 relative overflow-hidden ${
                    isDark
                      ? "glass hover:border-white/15 card-hover card-hover-purple"
                      : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"
                  }`}
                >
                  {/* Hover glow */}
                  {isDark && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  {/* Avatar */}
                  <div className="relative w-20 h-20 mx-auto mb-5">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white" style={{ background: "linear-gradient(135deg, #f47822, #15142a)" }}>
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center ${isDark ? "bg-[#0a0a0f]" : "bg-white"}`}>
                      <div className="w-5 h-5 rounded-full bg-green-400" />
                    </div>
                  </div>

                  <h3 className={`font-black text-lg mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{member.name}</h3>
                  <div className="text-sm font-medium mb-3" style={{ color: "#f47822" }}>{member.position}</div>
                  {member.bio && <p className={`text-sm leading-relaxed mb-5 ${isDark ? "text-white/50" : "text-gray-600"}`}>{member.bio}</p>}

                  {/* Specialties */}
                  {member.specialties?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                      {member.specialties.map((s: string) => (
                        <span key={s} className={`text-xs px-2.5 py-1 rounded-full ${isDark ? "bg-white/5 text-white/50 border border-white/8" : "bg-orange-50 text-gray-600 border border-orange-200"}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social */}
                  {(member.linkedin || member.twitter) && (
                    <div className="flex justify-center gap-3">
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDark ? "glass text-white/40 hover:text-orange-400" : "bg-gray-100 text-gray-500 hover:text-orange-500"}`}>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {member.twitter && (
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" title="Twitter"
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDark ? "glass text-white/40 hover:text-orange-400" : "bg-gray-100 text-gray-500 hover:text-orange-500"}`}>
                          <Share2 className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
