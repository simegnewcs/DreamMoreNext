"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ExternalLink, BookOpen, Loader2, FolderOpen, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function AgencyPortfolio() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDesc, setExpandedDesc] = useState<Record<number, boolean>>({});

  const toggleDesc = (id: number) =>
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    fetch("/api/portfolio")
      .then(r => r.json())
      .then(data => {
        if (data.success) setProjects(data.projects || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

  const filtered = active === "all"
    ? projects
    : projects.filter((p) => p.category === active);

  return (
    <section id="portfolio" className={`relative py-24 overflow-hidden ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-20" : "opacity-5"}`} />
      {isDark && <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[100px] pointer-events-none" />}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4">Our Work</span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Portfolio <span className="gradient-text">Showcase</span>
          </h2>
          <p className={`max-w-xl mx-auto ${isDark ? "text-white/50" : "text-gray-600"}`}>
            Real projects. Real results. Here&apos;s what we&apos;ve built for our clients.
          </p>
        </motion.div>

        {/* Filter tabs — only show when there are projects */}
        {projects.length > 0 && <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                active === cat
                  ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                  : isDark 
                    ? "text-white/50 hover:text-white border border-white/10 hover:border-white/20"
                    : "text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>}

        {/* Project grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-cyan-400" : "text-[#f47822]"}`} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
              <FolderOpen className={`w-10 h-10 ${isDark ? "text-white/15" : "text-gray-300"}`} />
            </div>
            <p className={`font-semibold text-lg ${isDark ? "text-white/40" : "text-gray-400"}`}>No projects yet</p>
            <p className={`text-sm mt-1 ${isDark ? "text-white/25" : "text-gray-400"}`}>Portfolio projects will appear here once added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 card-hover ${
                  isDark ? "glass hover:border-white/15" : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"
                }`}
              >
                {/* Image */}
                <div className={`h-48 relative overflow-hidden ${isDark ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl opacity-30">
                        {project.category === "websites" ? "🌐" :
                         project.category === "mobile apps" ? "📱" :
                         project.category === "dashboards" ? "📊" :
                         project.category === "AI systems" ? "🤖" :
                         project.category === "branding projects" ? "🎨" : "📷"}
                      </span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black/80 via-black/20 to-transparent" : "from-gray-800/80 via-gray-800/20 to-transparent"} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4`}>
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400/20 text-cyan-400 text-xs font-medium border border-cyan-400/30 hover:bg-cyan-400/30 transition-colors">
                          <ExternalLink className="w-3 h-3" />
                          Live Preview
                        </a>
                      )}
                      {project.caseStudyUrl && (
                        <a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer"
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? "bg-white/10 text-white border border-white/15 hover:bg-white/15" : "bg-white text-gray-900 border border-gray-200"}`}>
                          <BookOpen className="w-3 h-3" />
                          Case Study
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Category badge */}
                  {project.category && (
                    <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full capitalize ${isDark ? "bg-black/50 text-white/70 border border-white/10" : "bg-white/90 text-gray-700 border border-gray-200"}`}>
                      {project.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className={`font-bold text-base mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{project.title}</h3>
                  <p className={`text-sm leading-relaxed ${expandedDesc[project.id] ? "" : "line-clamp-2"} ${isDark ? "text-white/50" : "text-gray-600"}`}>
                    {project.description}
                  </p>
                  {project.description?.length > 120 && (
                    <button
                      onClick={() => toggleDesc(project.id)}
                      className={`flex items-center gap-1 mt-1 mb-3 text-xs font-semibold transition-colors ${
                        isDark ? "text-orange-400 hover:text-orange-300" : "text-orange-500 hover:text-orange-600"
                      }`}
                    >
                      {expandedDesc[project.id] ? "Less" : "More"}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedDesc[project.id] ? "rotate-180" : ""}`} />
                    </button>
                  )}
                  {!project.description?.length || project.description.length <= 120 ? <div className="mb-4" /> : null}
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech: string) => (
                        <span key={tech} className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-white/5 text-white/45 border border-white/8" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
