"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Tag, Play, Sparkles, Calendar, User, Loader2, Newspaper } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const categories = ["all", "AI", "Technology", "Startups", "Cybersecurity", "Education", "Innovation", "Promotions"];

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  description?: string;
  category: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime: string;
  image?: string;
  video?: string | null;
  featured?: boolean;
  promotion?: boolean;
}

interface BlogClientProps {
  initialBlogs?: BlogPost[];
}

export default function BlogClient({ initialBlogs = [] }: BlogClientProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeCategory, setActiveCategory] = useState("all");
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [loading, setLoading] = useState(false);

  // Fetch blogs dynamically
  useEffect(() => {
    const fetchBlogs = async () => {
      if (initialBlogs.length > 0) return; // Skip if we have initial data
      setLoading(true);
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.blogs || []);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [initialBlogs]);

  const filtered = activeCategory === "all"
    ? blogs
    : activeCategory === "Promotions"
      ? blogs.filter((p) => p.promotion)
      : blogs.filter((p) => p.category === activeCategory);

  const featured = blogs.find((p) => p.featured && (activeCategory === "all" || activeCategory === "Promotions" ? true : p.category === activeCategory));
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
        {featured && (activeCategory === "all" || activeCategory === "Promotions") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl overflow-hidden mb-10 group transition-all duration-300 ${isDark ? "glass hover:border-white/15" : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"} ${featured.promotion ? "ring-2 ring-orange-500/30" : ""}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className={`lg:col-span-2 h-56 lg:h-auto flex items-center justify-center relative overflow-hidden ${isDark ? "bg-gradient-to-br from-cyan-900/40 to-purple-900/20" : "bg-gradient-to-br from-orange-100 to-purple-100"}`}>
                {featured.video ? (
                  <div className="absolute inset-0">
                    <iframe
                      src={featured.video}
                      title={featured.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <>
                    <span className="text-6xl opacity-30">📰</span>
                    {featured.promotion && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-bold">
                        <Sparkles className="w-3 h-3" />
                        PROMO
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="lg:col-span-3 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="section-badge text-xs">{featured.category}</span>
                  {featured.promotion && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
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
                    {featured.video ? "Watch Video" : "Read Article"}
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

        {/* Loading State */}
        {loading && (
          <div className={`flex flex-col items-center justify-center py-12 ${isDark ? "text-white/50" : "text-gray-500"}`}>
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p>Loading blog posts...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-12 ${isDark ? "text-white/50" : "text-gray-500"}`}>
            <Newspaper className="w-12 h-12 mb-3 opacity-30" />
            <p>No blog posts found.</p>
          </div>
        )}

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`group rounded-2xl overflow-hidden transition-all duration-300 card-hover flex flex-col ${isDark ? "glass hover:border-white/15" : "bg-white border border-gray-200 hover:border-orange-300 shadow-sm"} ${post.promotion ? "ring-2 ring-orange-500/30" : ""}`}
            >
              <div className={`h-44 flex items-center justify-center relative ${isDark ? "bg-gradient-to-br from-slate-800/60 to-slate-900/40" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
                {post.video ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20" />
                    <div className="relative z-10 w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </>
                ) : (
                  <span className="text-4xl opacity-25">
                    {post.category === "AI" ? "🤖" :
                     post.category === "Technology" ? "💻" :
                     post.category === "Startups" ? "🚀" :
                     post.category === "Cybersecurity" ? "🔐" :
                     post.category === "Education" ? "📚" : "💡"}
                  </span>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="section-badge text-xs px-2 py-1 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                  {post.promotion && (
                    <span className="px-2 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      PROMO
                    </span>
                  )}
                </div>
                {post.video && (
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/70 text-white text-xs font-medium flex items-center gap-1">
                    <Play className="w-3 h-3 fill-white" />
                    Video
                  </div>
                )}
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
                    {post.video ? <Play className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
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
