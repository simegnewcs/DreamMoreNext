"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle2, Clock, X, ExternalLink } from "lucide-react";
import { Video } from "@/types/lms";
import Image from "next/image";

interface VideoCardProps {
  video: Video;
  isActive?: boolean;
  index?: number;
}

export default function VideoCard({ video, isActive = false, index }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const fmt = (mins: number) => {
    const h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const progressPercent = video.durationMinutes > 0
    ? Math.min((video.progressSeconds / (video.durationMinutes * 60)) * 100, 100) : 0;

  const getVideoId = (url: string) => {
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0] || null;
    if (url.includes('youtube.com/watch')) return new URL(url).searchParams.get('v');
    return null;
  };

  const videoId = getVideoId(video.videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : video.videoUrl;
  const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : video.thumbnailUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${
        video.isCompleted ? "border-emerald-200" : isActive ? "border-[#f47822]/60" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Thumbnail / Player */}
      <div className="relative w-full h-44 bg-zinc-900">
        {isPlaying ? (
          <>
            <iframe
              src={embedUrl}
              title={video.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
              className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <Image src={thumbUrl} alt={video.title} fill className="object-cover" />
            {/* Dim overlay */}
            <div
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors cursor-pointer flex items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg"
              >
                <Play className="w-5 h-5 text-zinc-800 ml-0.5" />
              </motion.div>
            </div>

            {/* Duration */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {fmt(video.durationMinutes)}
            </div>

            {/* Completed badge */}
            {video.isCompleted && (
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Done
              </div>
            )}

            {/* Progress bar */}
            {progressPercent > 0 && !video.isCompleted && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                <div className="h-full bg-[#f47822]" style={{ width: `${progressPercent}%` }} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <span className="text-xs text-gray-500 font-medium">
              Video {index !== undefined ? index + 1 : video.videoNumber}
            </span>
            <h4 className="font-semibold text-sm text-gray-900 leading-snug mt-0.5 line-clamp-2">
              {video.title}
            </h4>
          </div>
          {video.isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              video.isCompleted
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-[#f47822] text-white hover:bg-[#e06b18]"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            {video.isCompleted ? "Rewatch" : progressPercent > 0 ? "Continue" : "Play"}
          </button>
          <button
            onClick={() => window.open(video.videoUrl, '_blank', 'noopener,noreferrer')}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            title="Open in YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
