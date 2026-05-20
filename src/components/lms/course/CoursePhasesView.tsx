"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, BookOpen, Clock, Award, PlayCircle,
  Lock, CheckCircle2, ChevronDown, Layers, Video, FileText, HelpCircle,
  ArrowRight, BarChart3, GraduationCap, Zap
} from "lucide-react";
import { CourseStructure } from "@/types/lms";
import Link from "next/link";
import Image from "next/image";

interface CoursePhasesViewProps {
  course: CourseStructure;
}

export default function CoursePhasesView({ course }: CoursePhasesViewProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(course.phases[0]?.id || null);

  const completedPhases = course.phases.filter((p) => p.isCompleted).length;
  const totalWeeks = course.phases.reduce((acc, phase) => acc + phase.weeks.length, 0);
  const completedWeeks = course.phases.reduce(
    (acc, phase) => acc + phase.weeks.filter((w) => w.isCompleted).length, 0
  );
  const nextPhase = course.phases.find((p) => !p.isCompleted && !p.isLocked);
  const nextWeek = nextPhase?.weeks.find((w) => !w.isCompleted && !w.isLocked);

  const phaseAccentColors = [
    {
      border: "border-l-blue-500",
      headerBg: "bg-blue-50",
      labelText: "text-blue-700",
      iconBg: "bg-blue-500",
      iconText: "text-white",
      pill: "bg-blue-50 text-blue-700 border-blue-200",
      num: "text-white",
      progressBar: "bg-blue-500",
      expandedBorder: "border-blue-300",
    },
    {
      border: "border-l-violet-500",
      headerBg: "bg-violet-50",
      labelText: "text-violet-700",
      iconBg: "bg-violet-500",
      iconText: "text-white",
      pill: "bg-violet-50 text-violet-700 border-violet-200",
      num: "text-white",
      progressBar: "bg-violet-500",
      expandedBorder: "border-violet-300",
    },
    {
      border: "border-l-emerald-500",
      headerBg: "bg-emerald-50",
      labelText: "text-emerald-700",
      iconBg: "bg-emerald-500",
      iconText: "text-white",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
      num: "text-white",
      progressBar: "bg-emerald-500",
      expandedBorder: "border-emerald-300",
    },
    {
      border: "border-l-amber-500",
      headerBg: "bg-amber-50",
      labelText: "text-amber-700",
      iconBg: "bg-amber-500",
      iconText: "text-white",
      pill: "bg-amber-50 text-amber-700 border-amber-200",
      num: "text-white",
      progressBar: "bg-amber-500",
      expandedBorder: "border-amber-300",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      {/* ── COURSE HERO ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-7">
            <Link href="/lms" className="hover:text-gray-800 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/lms/courses" className="hover:text-gray-800 transition-colors">My Courses</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium truncate max-w-xs">{course.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Thumbnail */}
            <div className="relative w-full lg:w-72 h-44 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 bg-[#f47822] text-white text-xs font-semibold rounded-lg">
                  {course.level}
                </span>
                {course.certificateEnabled && (
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur text-white text-xs font-medium rounded-lg flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Certificate
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {course.title}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-2">
                {course.description}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { icon: Layers, label: `${course.totalPhases} Phases` },
                  { icon: Clock, label: course.totalDuration },
                  { icon: Video, label: `${course.totalVideos} Videos` },
                  { icon: BookOpen, label: `${course.totalWeeks} Weeks` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                    <Icon className="w-3.5 h-3.5 text-gray-500" />
                    {label}
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm font-semibold text-[#f47822]">
                    {completedWeeks} / {totalWeeks} weeks
                  </span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.overallProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-[#f47822] rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-gray-500">{completedPhases} of {course.totalPhases} phases done</span>
                  <span className="text-xs font-medium text-[#f47822]">{course.overallProgress}%</span>
                </div>
              </div>

              {/* CTA */}
              {nextPhase && nextWeek && (
                <Link
                  href={`/lms/course/${course.slug}/phase/${nextPhase.id}/week/${nextWeek.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f47822] text-white rounded-xl font-semibold text-sm hover:bg-[#e06b18] transition-all shadow-sm hover:shadow-md"
                >
                  <PlayCircle className="w-4 h-4" />
                  {course.overallProgress === 0 ? "Start Learning" : "Continue Learning"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Phases", value: `${completedPhases}/${course.totalPhases}`, icon: Layers, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Weeks Done", value: `${completedWeeks}/${totalWeeks}`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Videos", value: course.totalVideos, icon: Video, color: "text-violet-600", bg: "bg-violet-50" },
              { label: "Progress", value: `${course.overallProgress}%`, icon: BarChart3, color: "text-[#f47822]", bg: "bg-orange-50" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 leading-none">{value}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PHASES ACCORDION ────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Course Curriculum</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {course.totalPhases} phases · {totalWeeks} weeks · {course.totalVideos} lessons
            </p>
          </div>
        </div>

        {course.phases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-[#f47822] opacity-60" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Content Not Added Yet</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              The instructor hasn&apos;t uploaded the course content yet. Check back soon!
            </p>
          </div>
        )}

        <div className="space-y-3">
          {course.phases.map((phase, pi) => {
            const color = phaseAccentColors[pi % phaseAccentColors.length];
            const isExpanded = expandedPhase === phase.id;
            const phaseCompletedWeeks = phase.weeks.filter(w => w.isCompleted).length;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pi * 0.07 }}
                className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 border-l-4 ${
                  phase.isLocked
                    ? "border-l-gray-300 border-gray-200 opacity-70"
                    : isExpanded
                    ? `${color.border} ${color.expandedBorder} shadow-md`
                    : `${color.border} border-gray-200 hover:shadow-sm`
                }`}
              >
                {/* Phase Header */}
                <button
                  onClick={() => !phase.isLocked && setExpandedPhase(isExpanded ? null : phase.id)}
                  disabled={phase.isLocked}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${
                    phase.isLocked ? "cursor-not-allowed" : "cursor-pointer"
                  } ${isExpanded && !phase.isLocked ? color.headerBg : "bg-white"}`}
                >
                  {/* Phase Number Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 ${
                    phase.isLocked
                      ? "bg-gray-200 text-gray-500"
                      : phase.isCompleted
                      ? "bg-emerald-500 text-white"
                      : `${color.iconBg} ${color.iconText}`
                  }`}>
                    {phase.isLocked ? (
                      <Lock className="w-4.5 h-4.5" />
                    ) : phase.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-black">{phase.phaseNumber}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-bold uppercase tracking-widest ${
                        phase.isLocked ? "text-gray-400" : color.labelText
                      }`}>Phase {phase.phaseNumber}</span>
                      {phase.isCompleted && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full uppercase tracking-wide">✓ Completed</span>
                      )}
                      {phase.isLocked && (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-red-50 text-red-500 border border-red-200 rounded-full uppercase tracking-wide">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>
                    <h3 className={`font-bold text-base truncate ${
                      phase.isLocked ? "text-gray-400" : "text-gray-900"
                    }`}>{phase.title}</h3>
                    <div className={`flex items-center gap-3 mt-1 text-xs font-medium ${
                      phase.isLocked ? "text-gray-400" : "text-gray-600"
                    }`}>
                      <span>{phase.weeks.length} weeks</span>
                      <span>·</span>
                      <span>{phase.weeks.reduce((a, w) => a + w.videos.length, 0)} videos</span>
                      <span>·</span>
                      <span>{phaseCompletedWeeks}/{phase.weeks.length} complete</span>
                    </div>
                  </div>

                  {/* Progress mini */}
                  {!phase.isLocked && (
                    <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                      <div className="w-24">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color.progressBar} rounded-full transition-all duration-500`}
                            style={{ width: `${phase.progressPercentage}%` }}
                          />
                        </div>
                        <div className={`text-xs mt-1 text-right font-medium ${color.labelText}`}>{phase.progressPercentage}%</div>
                      </div>
                    </div>
                  )}

                  {phase.isLocked ? (
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  ) : (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${color.labelText} ${isExpanded ? "rotate-180" : ""}`} />
                  )}
                </button>

                {/* Phase Body - Weeks */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 px-5 pb-4 pt-3 space-y-1">
                        {phase.weeks.map((week, wi) => {
                          const weekVideos = week.videos.length;
                          const weekNotes = week.notes.length;
                          const weekAssignments = week.assignments.length;

                          return (
                            <Link
                              key={week.id}
                              href={week.isLocked ? "#" : `/lms/course/${course.slug}/phase/${phase.id}/week/${week.id}`}
                              onClick={(e) => week.isLocked && e.preventDefault()}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                                week.isLocked
                                  ? "opacity-50 cursor-not-allowed bg-gray-50"
                                  : week.isCompleted
                                  ? "bg-emerald-50 hover:bg-emerald-100"
                                  : "bg-white hover:bg-orange-50 border border-gray-100 hover:border-orange-100"
                              }`}
                            >
                              {/* Status icon */}
                              <div className="flex-shrink-0">
                                {week.isLocked ? (
                                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                                  </div>
                                ) : week.isCompleted ? (
                                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  </div>
                                ) : week.progressPercentage > 0 ? (
                                  <div className="w-7 h-7 rounded-full bg-[#f47822]/10 flex items-center justify-center">
                                    <PlayCircle className="w-4 h-4 text-[#f47822]" />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-gray-700">{wi + 1}</span>
                                  </div>
                                )}
                              </div>

                              {/* Week info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-gray-900 group-hover:text-[#f47822] truncate">
                                    Week {week.weekNumber}: {week.title}
                                  </span>
                                  {week.isCompleted && (
                                    <span className="text-xs text-emerald-600 font-medium flex-shrink-0">✓ Done</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-600 font-medium">
                                  {weekVideos > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Video className="w-3 h-3" /> {weekVideos}
                                    </span>
                                  )}
                                  {weekNotes > 0 && (
                                    <span className="flex items-center gap-1">
                                      <FileText className="w-3 h-3" /> {weekNotes}
                                    </span>
                                  )}
                                  {weekAssignments > 0 && (
                                    <span className="flex items-center gap-1">
                                      <HelpCircle className="w-3 h-3" /> {weekAssignments}
                                    </span>
                                  )}
                                  </div>
                              </div>

                              {/* Progress or Arrow */}
                              <div className="flex-shrink-0 flex items-center gap-2">
                                {!week.isLocked && week.progressPercentage > 0 && !week.isCompleted && (
                                  <div className="hidden sm:flex items-center gap-1.5">
                                    <div className="w-16 h-1 bg-zinc-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-[#f47822]" style={{ width: `${week.progressPercentage}%` }} />
                                    </div>
                                    <span className="text-xs text-gray-500">{week.progressPercentage}%</span>
                                  </div>
                                )}
                                {!week.isLocked && (
                                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#f47822] transition-colors" />
                                )}
                              </div>
                            </Link>
                          );
                        })}

                        {/* Phase CTA */}
                        {!phase.isLocked && !phase.isCompleted && (
                          <div className="pt-2">
                            <Link
                              href={`/lms/course/${course.slug}/phase/${phase.id}`}
                              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-[#f47822] hover:bg-orange-50 rounded-xl transition-colors border border-[#f47822]/20 hover:border-[#f47822]/40"
                            >
                              <Zap className="w-4 h-4" />
                              {phase.progressPercentage === 0 ? "Start Phase" : "Continue Phase"}
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
