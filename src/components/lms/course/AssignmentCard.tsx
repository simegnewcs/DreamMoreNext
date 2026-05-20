"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, FileText, HelpCircle, Target, ArrowRight } from "lucide-react";
import { Assignment } from "@/types/lms";

interface AssignmentCardProps {
  assignment: Assignment;
  onSubmit?: () => void;
  index?: number;
}

export default function AssignmentCard({ assignment, onSubmit, index }: AssignmentCardProps) {
  const typeConfig = {
    practice: { icon: HelpCircle, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", label: "Practice" },
    assignment: { icon: FileText, bg: "bg-orange-50", text: "text-[#f47822]", border: "border-orange-100", label: "Assignment" },
    quiz: { icon: Target, bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", label: "Quiz" },
  };

  const cfg = typeConfig[assignment.assignmentType] ?? typeConfig.assignment;
  const Icon = cfg.icon;

  const formatDeadline = (date?: string) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    if (diff < 0) return { label: "Overdue", danger: true };
    if (diff === 0) return { label: "Due today", danger: true };
    if (diff === 1) return { label: "Due tomorrow", danger: false };
    return { label: `${diff} days left`, danger: false };
  };

  const deadline = formatDeadline(assignment.deadline);
  const isOverdue = assignment.deadline && new Date(assignment.deadline) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border p-4 transition-all hover:shadow-sm ${
        assignment.isSubmitted
          ? "border-emerald-200"
          : isOverdue
          ? "border-red-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.bg} ${cfg.border}`}>
          <Icon className={`w-5 h-5 ${cfg.text}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">
                  {cfg.label} {index !== undefined ? index + 1 : assignment.orderIndex + 1}
                </span>
                {assignment.isSubmitted && (
                  <span className="px-1.5 py-0.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium">Submitted</span>
                )}
                {isOverdue && !assignment.isSubmitted && (
                  <span className="px-1.5 py-0.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-full font-medium">Overdue</span>
                )}
              </div>
              <h4 className="font-semibold text-sm text-gray-900">{assignment.title}</h4>
            </div>
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{assignment.description}</p>

          {/* Meta + Action row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {deadline && (
                <span className={`flex items-center gap-1 ${deadline.danger ? "text-red-500 font-medium" : ""}`}>
                  <Clock className="w-3 h-3" /> {deadline.label}
                </span>
              )}
              {assignment.isSubmitted && assignment.score !== undefined && (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> {assignment.score}/{assignment.maxScore} pts
                </span>
              )}
              {assignment.maxScore && !assignment.isSubmitted && (
                <span>{assignment.maxScore} pts</span>
              )}
            </div>

            {assignment.isSubmitted ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                {assignment.score !== undefined ? "Graded" : "Awaiting review"}
              </div>
            ) : (
              <button
                onClick={onSubmit}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isOverdue
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-[#f47822] text-white hover:bg-[#e06b18]"
                }`}
              >
                {isOverdue ? (
                  <><AlertCircle className="w-3.5 h-3.5" /> Submit Late</>
                ) : (
                  <>Start <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
