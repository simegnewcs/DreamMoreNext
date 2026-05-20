"use client";

import { motion } from "framer-motion";
import { ChevronRight, Clock, CheckCircle2, Lock, Target, BookOpen, Video, FileText, PlayCircle } from "lucide-react";
import { Phase, CourseStructure } from "@/types/lms";
import Link from "next/link";

interface PhaseDetailViewProps {
  course: CourseStructure;
  phase: Phase;
}

export default function PhaseDetailView({ course, phase }: PhaseDetailViewProps) {
  const completedWeeks = phase.weeks.filter((w) => w.isCompleted).length;
  const totalWeeks = phase.weeks.length;

  const phaseAccentColors = [
    { pill: "bg-blue-50 text-blue-700 border-blue-200", numBg: "bg-blue-500" },
    { pill: "bg-violet-50 text-violet-700 border-violet-200", numBg: "bg-violet-500" },
    { pill: "bg-emerald-50 text-emerald-700 border-emerald-200", numBg: "bg-emerald-500" },
    { pill: "bg-amber-50 text-amber-700 border-amber-200", numBg: "bg-amber-500" },
  ];
  const color = phaseAccentColors[(phase.phaseNumber - 1) % phaseAccentColors.length];
  const nextWeek = phase.weeks.find((w) => !w.isCompleted && !w.isLocked);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6 py-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5 flex-wrap">
            <Link href="/lms" className="hover:text-gray-800 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/lms/course/${course.slug}`} className="hover:text-gray-800 transition-colors truncate max-w-[150px]">{course.title}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium">Phase {phase.phaseNumber}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Phase Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl ${color.numBg} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {phase.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : phase.phaseNumber}
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium">Phase {phase.phaseNumber} of {course.totalPhases}</span>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{phase.title}</h1>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{phase.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{phase.durationWeeks} weeks</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{totalWeeks} total weeks</span>
                <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" />{phase.weeks.reduce((a, w) => a + w.videos.length, 0)} videos</span>
              </div>
            </div>

            {/* Progress Card */}
            <div className="w-full lg:w-60 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Phase Progress</span>
                <span className="text-lg font-bold text-[#f47822]">{completedWeeks}/{totalWeeks}</span>
              </div>
              <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progressPercentage}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="h-full bg-[#f47822] rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 mb-4">Complete all weeks to unlock the next phase</p>
              {!phase.isLocked && !phase.isCompleted && nextWeek && (
                <Link
                  href={`/lms/course/${course.slug}/phase/${phase.id}/week/${nextWeek.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#f47822] text-white rounded-xl font-semibold text-sm hover:bg-[#e06b18] transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  {phase.progressPercentage === 0 ? "Start Phase" : "Continue"}
                </Link>
              )}
              {phase.isCompleted && (
                <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-semibold text-sm border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> Phase Complete
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Learning Objectives */}
        {phase.learningObjectives && phase.learningObjectives.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#f47822]" /> What You&apos;ll Learn
            </h2>
            <div className="bg-white border border-zinc-200 rounded-2xl p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {phase.learningObjectives.map((obj, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#f47822]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-[#f47822]" />
                    </div>
                    <span className="text-sm text-gray-700 leading-snug">{obj}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Weeks Timeline */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Weekly Roadmap</h2>
            <span className="text-xs text-gray-500">{completedWeeks} of {totalWeeks} weeks done</span>
          </div>

          <div className="space-y-2">
            {phase.weeks.map((week, wi) => {
              const totalVids = week.videos.length;
              const totalNotes = week.notes.length;
              const totalAssign = week.assignments.length;

              return (
                <motion.div
                  key={week.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: wi * 0.05 }}
                >
                  <Link
                    href={week.isLocked ? "#" : `/lms/course/${course.slug}/phase/${phase.id}/week/${week.id}`}
                    onClick={(e) => week.isLocked && e.preventDefault()}
                    className={`flex items-center gap-4 p-4 bg-white border rounded-2xl transition-all group ${
                      week.isLocked
                        ? "opacity-50 cursor-not-allowed border-zinc-200"
                        : week.isCompleted
                        ? "border-emerald-200 hover:border-emerald-300 hover:shadow-sm"
                        : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Status */}
                    <div className="flex-shrink-0">
                      {week.isLocked ? (
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-zinc-400" />
                        </div>
                      ) : week.isCompleted ? (
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      ) : week.progressPercentage > 0 ? (
                        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                          <PlayCircle className="w-5 h-5 text-[#f47822]" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-600">{wi + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm text-gray-900 group-hover:text-gray-700">
                          Week {week.weekNumber}: {week.title}
                        </span>
                        {week.isCompleted && (
                          <span className="text-xs text-emerald-600 font-medium">✓ Done</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {totalVids > 0 && <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {totalVids} videos</span>}
                        {totalNotes > 0 && <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {totalNotes} notes</span>}
                        {totalAssign > 0 && <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {totalAssign} tasks</span>}
                      </div>
                    </div>

                    {/* Progress or arrow */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                      {!week.isLocked && week.progressPercentage > 0 && !week.isCompleted && (
                        <div className="hidden sm:flex items-center gap-1.5">
                          <div className="w-16 h-1 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#f47822]" style={{ width: `${week.progressPercentage}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{week.progressPercentage}%</span>
                        </div>
                      )}
                      {!week.isLocked && <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Locked Warning */}
        {phase.isLocked && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Phase Locked</h3>
            <p className="text-sm text-gray-600 mb-5">Complete Phase {phase.phaseNumber - 1} to unlock this content.</p>
            <Link
              href={`/lms/course/${course.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f47822] text-white rounded-xl font-semibold text-sm hover:bg-[#e06b18] transition-colors"
            >
              Back to Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
