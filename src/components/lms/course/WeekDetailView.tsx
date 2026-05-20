"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, PlayCircle, FileText, HelpCircle, Clock,
  CheckCircle2, Lock, Video, Download, Target,
} from "lucide-react";
import { Week, Phase, CourseStructure } from "@/types/lms";
import VideoCard from "./VideoCard";
import NoteCard from "./NoteCard";
import AssignmentCard from "./AssignmentCard";
import Link from "next/link";

type TabId = "videos" | "notes" | "questions";

interface WeekDetailViewProps {
  course: CourseStructure;
  phase: Phase;
  week: Week;
  activeTab?: TabId;
}

export default function WeekDetailView({ course, phase, week, activeTab = "videos" }: WeekDetailViewProps) {
  const [currentTab, setCurrentTab] = useState<TabId>(activeTab);

  const completedVideos = week.videos.filter((v) => v.isCompleted).length;
  const completedAssignments = week.assignments.filter((a) => a.isSubmitted).length;
  const downloadedNotes = week.notes.filter((n) => n.isDownloaded).length;

  const tabs = [
    { id: "videos" as TabId, label: "Videos", icon: Video, count: week.videos.length, done: completedVideos },
    { id: "notes" as TabId, label: "Notes", icon: FileText, count: week.notes.length, done: downloadedNotes },
    { id: "questions" as TabId, label: "Assignments", icon: Target, count: week.assignments.length, done: completedAssignments },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6 py-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5 flex-wrap">
            <Link href="/lms" className="hover:text-gray-800 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href={`/lms/course/${course.slug}`} className="hover:text-gray-800 transition-colors truncate max-w-[120px]">{course.title}</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href={`/lms/course/${course.slug}/phase/${phase.id}`} className="hover:text-gray-800 transition-colors">Phase {phase.phaseNumber}</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-gray-800 font-medium">Week {week.weekNumber}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Week Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-orange-50 text-[#f47822] text-xs font-semibold rounded-lg border border-orange-100">
                  Week {week.weekNumber} of {phase.weeks.length}
                </span>
                {week.isCompleted && (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1.5">{week.title}</h1>
              <p className="text-gray-600 text-sm leading-relaxed">{week.description}</p>
            </div>

            {/* Progress panel */}
            <div className="w-full lg:w-64 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Week Progress</span>
                <span className="text-lg font-bold text-[#f47822]">{week.progressPercentage}%</span>
              </div>
              <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${week.progressPercentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full bg-[#f47822] rounded-full"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Videos", val: `${completedVideos}/${week.videos.length}`, color: "text-blue-600" },
                  { label: "Notes", val: `${downloadedNotes}/${week.notes.length}`, color: "text-emerald-600" },
                  { label: "Tasks", val: `${completedAssignments}/${week.assignments.length}`, color: "text-violet-600" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="text-center p-2 bg-white rounded-xl border border-gray-100">
                    <div className={`text-sm font-bold ${color}`}>{val}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-0 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = currentTab === tab.id;
              const allDone = tab.done === tab.count && tab.count > 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    active
                      ? "border-[#f47822] text-[#f47822]"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className={`px-1.5 py-0.5 text-xs rounded-md font-semibold ${
                    allDone
                      ? "bg-emerald-100 text-emerald-700"
                      : active
                      ? "bg-orange-100 text-[#f47822]"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">

          {/* Videos */}
          {currentTab === "videos" && (
            <motion.div key="videos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Class Videos</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{completedVideos} of {week.videos.length} watched</p>
                </div>
                {completedVideos === week.videos.length && week.videos.length > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> All Watched
                  </span>
                )}
              </div>
              {week.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {week.videos.map((video, i) => (
                    <motion.div key={video.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <VideoCard video={video} index={i} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={PlayCircle} title="No Videos Yet" text="Videos will be uploaded soon." />
              )}
            </motion.div>
          )}

          {/* Notes */}
          {currentTab === "notes" && (
            <motion.div key="notes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Class Notes</h2>
                  <p className="text-sm text-gray-500 mt-0.5">PDF study materials for this week</p>
                </div>
              </div>
              {week.notes.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {week.notes.map((note, i) => (
                    <motion.div key={note.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <NoteCard note={note} index={i} onDownload={() => {}} onPreview={() => {}} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Download} title="No Notes Yet" text="Study notes will be uploaded soon." />
              )}
            </motion.div>
          )}

          {/* Assignments */}
          {currentTab === "questions" && (
            <motion.div key="questions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Assignments</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{completedAssignments} of {week.assignments.length} completed</p>
                </div>
              </div>
              {week.assignments.length > 0 ? (
                <div className="space-y-3">
                  {week.assignments.map((assignment, i) => (
                    <motion.div key={assignment.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <AssignmentCard assignment={assignment} index={i} onSubmit={() => {}} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={HelpCircle} title="No Assignments Yet" text="Assignments will be posted soon." />
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── LOCKED MODAL ─────────────────────────────────────────────── */}
      {week.isLocked && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl"
          >
            <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Week Locked</h3>
            <p className="text-zinc-500 text-sm mb-6">
              Complete Week {week.weekNumber - 1} first to unlock this content.
            </p>
            <Link
              href={`/lms/course/${course.slug}/phase/${phase.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f47822] text-white rounded-xl font-semibold text-sm hover:bg-[#e06b18] transition-colors"
            >
              Back to Phase
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
