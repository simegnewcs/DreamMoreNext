"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlayCircle, FileText, HelpCircle, Clock, Lock, CheckCircle2, Circle } from "lucide-react";
import { Week } from "@/types/lms";
import Link from "next/link";

interface WeekAccordionProps {
  week: Week;
  phaseId: string;
  courseSlug: string;
  defaultExpanded?: boolean;
}

export default function WeekAccordion({
  week,
  phaseId,
  courseSlug,
  defaultExpanded = false,
}: WeekAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const totalVideos = week.videos.length;
  const totalNotes = week.notes.length;
  const totalAssignments = week.assignments.length;
  const completedVideos = week.videos.filter((v) => v.isCompleted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: week.orderIndex * 0.05 }}
      className={`rounded-xl border overflow-hidden ${
        week.isLocked
          ? "bg-gray-50 border-gray-200"
          : week.isCompleted
          ? "bg-green-50/50 border-green-200"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <button
        onClick={() => !week.isLocked && setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center gap-4 text-left ${
          week.isLocked ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
        }`}
      >
        {/* Status Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            week.isLocked
              ? "bg-gray-200 text-gray-400"
              : week.isCompleted
              ? "bg-green-500 text-white"
              : "bg-[#f47822]/10 text-[#f47822]"
          }`}
        >
          {week.isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : week.isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </div>

        {/* Title & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Week {week.weekNumber}
            </span>
            {week.progressPercentage > 0 && !week.isCompleted && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#f47822]/10 text-[#f47822]">
                {week.progressPercentage}%
              </span>
            )}
          </div>
          <h4
            className={`font-semibold truncate ${
              week.isLocked ? "text-gray-500" : "text-gray-900"
            }`}
          >
            {week.title}
          </h4>
          {!week.isLocked && (
            <p className="text-sm text-gray-500 line-clamp-1">{week.description}</p>
          )}
        </div>

        {/* Stats */}
        {!week.isLocked && (
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{totalVideos}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>{totalNotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{totalAssignments}</span>
            </div>
          </div>
        )}

        {/* Expand Icon */}
        {!week.isLocked && (
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && !week.isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 space-y-4">
              {/* Learning Topics */}
              <div>
                <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">
                  What You&apos;ll Learn
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {week.learningTopics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#f47822] mt-2" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Links */}
              <div className="grid grid-cols-3 gap-3">
                <Link
                  href={`/lms/course/${courseSlug}/phase/${phaseId}/week/${week.id}/videos`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Videos</span>
                  <span className="text-xs text-gray-500">
                    {completedVideos}/{totalVideos}
                  </span>
                </Link>

                <Link
                  href={`/lms/course/${courseSlug}/phase/${phaseId}/week/${week.id}/notes`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Notes</span>
                  <span className="text-xs text-gray-500">{totalNotes} PDFs</span>
                </Link>

                <Link
                  href={`/lms/course/${courseSlug}/phase/${phaseId}/week/${week.id}/questions`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Questions</span>
                  <span className="text-xs text-gray-500">{totalAssignments} items</span>
                </Link>
              </div>

              {/* Continue Button */}
              <Link
                href={`/lms/course/${courseSlug}/phase/${phaseId}/week/${week.id}/videos`}
                className="block w-full py-3 px-4 bg-[#f47822] text-white text-center rounded-xl font-medium hover:bg-[#e06b18] transition-colors"
              >
                {week.progressPercentage > 0 ? "Continue Week" : "Start Week"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
