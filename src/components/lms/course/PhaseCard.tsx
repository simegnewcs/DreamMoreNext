"use client";

import { motion } from "framer-motion";
import { Lock, Unlock, ChevronRight, Clock, CheckCircle2, Circle } from "lucide-react";
import { Phase } from "@/types/lms";
import ProgressBar from "./ProgressBar";
import Link from "next/link";

interface PhaseCardProps {
  phase: Phase;
  courseSlug: string;
  isActive?: boolean;
}

export default function PhaseCard({ phase, courseSlug, isActive = false }: PhaseCardProps) {
  const phaseColors = [
    { bg: "from-blue-50 to-blue-100", border: "border-blue-200", icon: "text-blue-600", bar: "#3b82f6" },
    { bg: "from-green-50 to-green-100", border: "border-green-200", icon: "text-green-600", bar: "#22c55e" },
    { bg: "from-purple-50 to-purple-100", border: "border-purple-200", icon: "text-purple-600", bar: "#a855f7" },
    { bg: "from-orange-50 to-orange-100", border: "border-orange-200", icon: "text-orange-600", bar: "#f97316" },
    { bg: "from-pink-50 to-pink-100", border: "border-pink-200", icon: "text-pink-600", bar: "#ec4899" },
  ];

  const color = phaseColors[(phase.phaseNumber - 1) % phaseColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: phase.orderIndex * 0.1 }}
      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
        phase.isLocked
          ? "bg-gray-50 border-gray-200 opacity-75"
          : isActive
          ? `bg-gradient-to-br ${color.bg} ${color.border} shadow-lg`
          : "bg-white border-gray-200 hover:border-[#f47822] hover:shadow-md"
      }`}
    >
      <Link
        href={phase.isLocked ? "#" : `/lms/course/${courseSlug}/phase/${phase.id}`}
        className="block p-6"
        onClick={(e) => phase.isLocked && e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                phase.isLocked
                  ? "bg-gray-200 text-gray-400"
                  : phase.isCompleted
                  ? "bg-green-500 text-white"
                  : `bg-gradient-to-br ${color.bg} ${color.icon}`
              }`}
            >
              {phase.isCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : phase.isLocked ? (
                <Lock className="w-5 h-5" />
              ) : (
                <span className={color.icon}>{phase.phaseNumber}</span>
              )}
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phase {phase.phaseNumber}
              </span>
              <h3
                className={`font-bold text-lg ${
                  phase.isLocked ? "text-gray-500" : "text-gray-900"
                }`}
              >
                {phase.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {phase.isLocked ? (
              <Lock className="w-5 h-5 text-gray-400" />
            ) : (
              <Unlock className="w-5 h-5 text-[#f47822]" />
            )}
          </div>
        </div>

        {/* Description */}
        <p
          className={`text-sm mb-4 line-clamp-2 ${
            phase.isLocked ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {phase.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{phase.durationWeeks} weeks</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Circle className="w-4 h-4" />
            <span>{phase.weeks.length} weeks</span>
          </div>
        </div>

        {/* Learning Objectives Preview */}
        {!phase.isLocked && phase.learningObjectives && (
          <div className="mb-4">
            <ul className="space-y-1">
              {phase.learningObjectives.slice(0, 3).map((objective, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <ChevronRight className="w-4 h-4 text-[#f47822] flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress Bar */}
        {!phase.isLocked && (
          <ProgressBar
            progress={phase.progressPercentage}
            size="sm"
            color={color.bar}
          />
        )}

        {/* CTA */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium">
          {phase.isLocked ? (
            <span className="text-gray-400">Complete previous phase to unlock</span>
          ) : phase.isCompleted ? (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </span>
          ) : phase.progressPercentage > 0 ? (
            <span className="text-[#f47822] flex items-center gap-1">
              Continue Learning
              <ChevronRight className="w-4 h-4" />
            </span>
          ) : (
            <span className="text-[#f47822] flex items-center gap-1">
              Start Phase
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
