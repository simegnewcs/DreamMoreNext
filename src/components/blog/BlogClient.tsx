"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Tag } from "lucide-react";
import { BLOG_POSTS } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const categories = ["all", "AI", "Technology", "Startups", "Cybersecurity", "Education", "Innovation"];

export default function BlogClient() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === activeCategory);

  const featured = BLOG_POSTS.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || activeCategory !== "all");

  return (
    <div className={`min-h-screen pt-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {isDark && <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />}
          <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-20" : "opacity-5"}`} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-badge mb-4">Blog & Insights</span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
            Tech Insights from <span className="gradient-text">DreamMore</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/55" : "text-gray-600"}`}>
            AI, startups, web development, cybersecurity, and the future of African tech.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Featured post */}
        {featured && activeCategory === "all" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl overflow-hidden mb-10 group transition-all duration-300 ${isDark ? "glass hover:border-white/15" : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className={`lg:col-span-2 h-56 lg:h-auto flex items-center justify-center ${isDark ? "bg-gradient-to-br from-cyan-900/40 to-purple-900/20" : "bg-gradient-to-br from-orange-100 to-purple-100"}`}>
                <span className="text-6xl opacity-30">📰</span>
              </div>
              <div className="lg:col-span-3 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="section-badge text-xs">{featured.category}</span>
                  <span className={`text-xs flex items-center gap-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                    <Clock className="w-3 h-3" />
                    {featured.readTime}
                  </span>
                </div>
                <h2 className={`text-2xl sm:text-3xl font-black mb-3 group-hover:text-orange-500 transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                  {featured.title}
                </h2>
                <p className={`leading-relaxed mb-6 ${isDark ? "text-white/55" : "text-gray-600"}`}>{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #f47822, #15142a)" }}>
                      {featured.author.charAt(0)}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{featured.author}</div>
                      <div className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{formatDate(featured.date)}</div>
                    </div>
                  </div>
                  <Link href={`/blog/${featured.slug}`} className="btn-primary text-sm py-2 px-4">
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                  : isDark 
                    ? "text-white/50 hover:text-white border border-white/10 hover:border-white/20"
                    : "text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`group rounded-2xl overflow-hidden transition-all duration-300 card-hover flex flex-col ${isDark ? "glass hover:border-white/15" : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"}`}
            >
              <div className={`h-44 flex items-center justify-center relative ${isDark ? "bg-gradient-to-br from-slate-800/60 to-slate-900/40" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
                <span className="text-4xl opacity-25">
                  {post.category === "AI" ? "🤖" :
                   post.category === "Technology" ? "💻" :
                   post.category === "Startups" ? "🚀" :
                   post.category === "Cybersecurity" ? "🔐" :
                   post.category === "Education" ? "📚" : "💡"}
                </span>
                <div className="absolute top-3 left-3 flex items-center gap-1.5 section-badge text-xs px-2 py-1">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className={`font-bold text-base mb-2 group-hover:text-orange-500 transition-colors leading-snug line-clamp-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {post.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-4 flex-1 line-clamp-3 ${isDark ? "text-white/50" : "text-gray-600"}`}>{post.excerpt}</p>
                <div className={`flex items-center justify-between pt-3 ${isDark ? "border-t border-white/5" : "border-t border-gray-100"}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? "bg-gradient-to-br from-cyan-400/20 to-purple-400/20 text-white" : "bg-orange-100 text-orange-600"}`}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className={`text-xs font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>{post.author}</div>
                      <div className={`text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>{formatDate(post.date)}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
