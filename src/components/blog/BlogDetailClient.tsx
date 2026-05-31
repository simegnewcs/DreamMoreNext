"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Play, Sparkles, Share2, Bookmark } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

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

interface BlogDetailClientProps {
  post: BlogPost;
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  
  // If already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) return url;
  
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return url;
}

// Helper function to get YouTube thumbnail URL
function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
  }
  
  return null;
}

// Helper function to extract video ID
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return match[2];
  }
  
  return null;
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showVideo, setShowVideo] = useState(false);
  
  const embedUrl = post.video ? getYouTubeEmbedUrl(post.video) : null;
  const thumbnailUrl = post.video ? getYouTubeThumbnail(post.video) : null;
  const videoId = post.video ? getYouTubeVideoId(post.video) : null;

  return (
    <div className={`min-h-screen pt-20 ${isDark ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
      {/* Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {isDark && (
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
          )}
          <div className={`absolute inset-0 grid-pattern ${isDark ? "opacity-20" : "opacity-5"}`} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className={`inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors ${
              isDark ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category & Badges */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="section-badge text-xs">{post.category}</span>
              {post.promotion && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-bold">
                  <Sparkles className="w-3 h-3" />
                  PROMOTION
                </span>
              )}
              {post.video && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                  <Play className="w-3 h-3 fill-white" />
                  VIDEO
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className={`flex flex-wrap items-center gap-4 text-sm mb-8 ${isDark ? "text-white/60" : "text-gray-600"}`}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg, #f47822, #15142a)" }}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{post.author}</div>
                  <div className="text-xs">Author</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </div>
              <div className="flex items-center gap-1">
                {post.video ? <Play className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {post.readTime}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image or Video */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`rounded-2xl overflow-hidden ${isDark ? "border border-white/10" : "border border-gray-200"}`}
        >
          {post.video && embedUrl ? (
            <div className="relative aspect-video bg-black">
              {showVideo ? (
                <iframe
                  src={`${embedUrl}?autoplay=1`}
                  title={post.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div 
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => setShowVideo(true)}
                >
                  {/* Thumbnail */}
                  {thumbnailUrl ? (
                    <img 
                      src={thumbnailUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if maxresdefault doesn't exist
                        const img = e.target as HTMLImageElement;
                        img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-200"}`}>
                      <Play className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform group-hover:bg-red-700">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Video Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold">
                    <Play className="w-4 h-4 fill-white" />
                    Watch Video
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-64 sm:h-80 lg:h-96 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-cyan-900/40 to-purple-900/20" : "bg-gradient-to-br from-orange-100 to-purple-100"}`}>
              <span className="text-8xl opacity-30">
                {post.category === "AI" ? "🤖" :
                 post.category === "Technology" ? "💻" :
                 post.category === "Startups" ? "🚀" :
                 post.category === "Cybersecurity" ? "🔐" :
                 post.category === "Education" ? "📚" : "💡"}
              </span>
            </div>
          )}
        </motion.div>
      </section>

      {/* Content */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Action Buttons */}
          <div className={`flex items-center gap-3 mb-8 pb-8 border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}>
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}>
              <Bookmark className="w-4 h-4" />
              Save
            </button>
          </div>

          {/* Excerpt */}
          <p className={`text-xl leading-relaxed mb-8 font-medium ${isDark ? "text-white/80" : "text-gray-700"}`}>
            {post.excerpt}
          </p>

          {/* Full Description */}
          {post.description && (
            <div className={`prose prose-lg max-w-none ${isDark ? "prose-invert" : ""}`}>
              {post.description.split("\n\n").map((paragraph, index) => (
                <p key={index} className={`text-base leading-relaxed mb-6 ${isDark ? "text-white/70" : "text-gray-600"}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className={`mt-12 pt-8 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? "text-white/60" : "text-gray-500"}`}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDark ? "bg-white/5 text-white/70" : "bg-gray-100 text-gray-700"
              }`}>
                {post.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDark ? "bg-white/5 text-white/70" : "bg-gray-100 text-gray-700"
              }`}>
                Africa Tech
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDark ? "bg-white/5 text-white/70" : "bg-gray-100 text-gray-700"
              }`}>
                Innovation
              </span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
