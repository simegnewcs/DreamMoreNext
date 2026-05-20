"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronDown, ChevronRight, Layers, BookMarked,
  Play, FileArchive, ClipboardList, Plus, Trash2, Save,
  Loader2, Upload, Monitor, X, Search
} from "lucide-react";
import { useInstructor, AssignedCourse } from "@/context/InstructorContext";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Phase { id: number; phase_number: number; title: string; description?: string; duration_weeks: number; weeks: Week[]; }
interface Week { id: number; week_number: number; title: string; description?: string; videos: Video[]; notes: Note[]; assignments: Assignment[]; }
interface Video { id: number; title: string; video_url: string; duration_minutes?: number; }
interface Note { id: number; title: string; pdf_url: string; file_size_mb?: number; }
interface Assignment { id: number; title: string; assignment_type: string; deadline?: string; max_score: number; }

// ── LMS Content Manager for one course ────────────────────────────────────────
function CourseContentManager({ course, onClose }: { course: AssignedCourse; onClose: () => void }) {
  const [tree, setTree] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // form visibility
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [showWeekForm, setShowWeekForm] = useState<number | null>(null);
  const [showVideoForm, setShowVideoForm] = useState<number | null>(null);
  const [showNoteForm, setShowNoteForm] = useState<number | null>(null);
  const [showAssignForm, setShowAssignForm] = useState<number | null>(null);

  // form states
  const [phaseForm, setPhaseForm] = useState({ title: "", description: "", duration_weeks: 1, learning_objectives: "" });
  const [weekForm, setWeekForm] = useState({ title: "", description: "", learning_topics: "" });
  const [videoForm, setVideoForm] = useState({ title: "", description: "", video_url: "", thumbnail_url: "", duration_minutes: "" });
  const [noteForm, setNoteForm] = useState({ title: "", description: "", pdf_url: "", file_size_mb: "" });
  const [assignForm, setAssignForm] = useState({ title: "", description: "", assignment_type: "assignment", deadline: "", max_score: "100" });
  const [noteUploading, setNoteUploading] = useState(false);
  const [noteUploadedFile, setNoteUploadedFile] = useState<{ name: string; sizeMb: number } | null>(null);
  const noteFileInputRef = useRef<HTMLInputElement>(null);

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/lms/content?courseId=${(course as any).id}`);
      const data = await res.json();
      if (data.success) setTree(data.phases || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTree(); }, [course.id]);

  const post = async (payload: any) => {
    setSaving(true); setFormError("");
    try {
      const res = await fetch("/api/admin/lms/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed");
      await fetchTree();
      return true;
    } catch (e: any) { setFormError(e.message || "Error saving"); return false; }
    finally { setSaving(false); }
  };

  const inputCls = "text-xs px-3 py-2 rounded-lg border outline-none w-full bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-orange-300";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center p-4 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl rounded-2xl shadow-2xl bg-white border border-gray-200">

          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white rounded-t-2xl">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#f47822]" />
                <h2 className="text-base font-bold text-gray-900">{course.title}</h2>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Phases · Weeks · Videos · Notes · Assignments</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-[#f47822]" /></div>
            ) : (
              <>
                {/* Empty state */}
                {tree.length === 0 && !showPhaseForm && (
                  <div className="text-center py-12 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                    <Layers className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">No phases yet</p>
                    <p className="text-xs opacity-60 mt-0.5">Add your first phase below</p>
                  </div>
                )}

                {/* Phase list */}
                {tree.map(phase => (
                  <div key={phase.id} className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                    {/* Phase header */}
                    <div onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <Layers className="w-4 h-4 text-violet-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">Phase {phase.phase_number}: {phase.title}</div>
                        <div className="text-xs text-gray-400">{phase.weeks?.length || 0} weeks · {phase.duration_weeks}w duration</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={e => { e.stopPropagation(); post({ action: "delete_phase", id: phase.id }); }}
                          className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedPhase === phase.id ? "rotate-180" : ""}`} />
                      </div>
                    </div>

                    {/* Phase body */}
                    {expandedPhase === phase.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-200 space-y-3">
                        {phase.weeks?.map(week => (
                          <div key={week.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                            <div onClick={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer hover:bg-gray-50 transition-colors">
                              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                <BookMarked className="w-3.5 h-3.5 text-amber-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-800">Week {week.week_number}: {week.title}</div>
                                <div className="text-xs text-gray-400">
                                  {week.videos?.length || 0} videos · {week.notes?.length || 0} notes · {week.assignments?.length || 0} assignments
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={e => { e.stopPropagation(); post({ action: "delete_week", id: week.id }); }}
                                  className="p-1 rounded-lg bg-red-50 text-red-400 hover:bg-red-100">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expandedWeek === week.id ? "rotate-180" : ""}`} />
                              </div>
                            </div>

                            {expandedWeek === week.id && (
                              <div className="px-3 pb-3 border-t border-gray-100 space-y-3">

                                {/* ── Videos ── */}
                                <div className="pt-2">
                                  <div className="text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-400">Videos</div>
                                  {week.videos?.map(v => (
                                    <div key={v.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg mb-1 bg-gray-50">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <Play className="w-3.5 h-3.5 text-[#f47822] flex-shrink-0" />
                                        <span className="text-xs font-medium truncate text-gray-700">{v.title}</span>
                                        {v.duration_minutes && <span className="text-xs text-gray-400">{v.duration_minutes}min</span>}
                                      </div>
                                      <button onClick={() => post({ action: "delete_video", id: v.id })} className="p-1 text-red-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                  ))}
                                  {showVideoForm === week.id ? (
                                    <div className="mt-2 p-3 rounded-lg border bg-blue-50 border-blue-200">
                                      <div className="grid grid-cols-1 gap-2">
                                        <input placeholder="Video title *" value={videoForm.title} onChange={e => setVideoForm(f => ({...f, title: e.target.value}))} className={inputCls} />
                                        <input placeholder="YouTube URL or video link *" value={videoForm.video_url} onChange={e => setVideoForm(f => ({...f, video_url: e.target.value}))} className={inputCls} />
                                        <input placeholder="Thumbnail URL (optional)" value={videoForm.thumbnail_url} onChange={e => setVideoForm(f => ({...f, thumbnail_url: e.target.value}))} className={inputCls} />
                                        <div className="grid grid-cols-2 gap-2">
                                          <input placeholder="Duration (min)" type="number" value={videoForm.duration_minutes} onChange={e => setVideoForm(f => ({...f, duration_minutes: e.target.value}))} className={inputCls} />
                                          <input placeholder="Description" value={videoForm.description} onChange={e => setVideoForm(f => ({...f, description: e.target.value}))} className={inputCls} />
                                        </div>
                                      </div>
                                      {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                                      <div className="flex gap-2 mt-2">
                                        <button disabled={saving} onClick={async () => { const ok = await post({ action: "add_video", week_id: week.id, ...videoForm, duration_minutes: videoForm.duration_minutes ? Number(videoForm.duration_minutes) : null }); if (ok) { setShowVideoForm(null); setVideoForm({ title: "", description: "", video_url: "", thumbnail_url: "", duration_minutes: "" }); }}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f47822] text-white text-xs font-semibold disabled:opacity-50">
                                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                                        </button>
                                        <button onClick={() => setShowVideoForm(null)} className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-500">Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setShowVideoForm(week.id); setShowNoteForm(null); setShowAssignForm(null); }} className="flex items-center gap-1.5 text-xs mt-1 px-2.5 py-1.5 rounded-lg bg-[#f47822]/5 hover:bg-[#f47822]/10 text-[#f47822] transition-colors">
                                      <Plus className="w-3 h-3" /> Add Video
                                    </button>
                                  )}
                                </div>

                                {/* ── Notes ── */}
                                <div>
                                  <div className="text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-400">Notes / PDFs</div>
                                  {week.notes?.map(n => (
                                    <div key={n.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg mb-1 bg-gray-50">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <FileArchive className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                        <span className="text-xs font-medium truncate text-gray-700">{n.title}</span>
                                        {n.file_size_mb && <span className="text-xs text-gray-400">{n.file_size_mb}MB</span>}
                                      </div>
                                      <button onClick={() => post({ action: "delete_note", id: n.id })} className="p-1 text-red-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                  ))}
                                  {showNoteForm === week.id ? (
                                    <div className="mt-2 p-3 rounded-lg border bg-emerald-50 border-emerald-200">
                                      <div className="grid grid-cols-1 gap-2">
                                        <input placeholder="Note title *" value={noteForm.title} onChange={e => setNoteForm(f => ({...f, title: e.target.value}))} className={inputCls} />
                                        <input placeholder="Description (optional)" value={noteForm.description} onChange={e => setNoteForm(f => ({...f, description: e.target.value}))} className={inputCls} />
                                        <input ref={noteFileInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" className="hidden"
                                          onChange={async e => {
                                            const file = e.target.files?.[0]; if (!file) return;
                                            setNoteUploading(true); setFormError("");
                                            try {
                                              const fd = new FormData(); fd.append("file", file);
                                              const res = await fetch("/api/upload/lms-note", { method: "POST", body: fd });
                                              const data = await res.json();
                                              if (!data.success) { setFormError(data.error || "Upload failed"); return; }
                                              setNoteForm(f => ({ ...f, pdf_url: data.url, file_size_mb: String(data.sizeMb) }));
                                              setNoteUploadedFile({ name: data.originalName, sizeMb: data.sizeMb });
                                            } catch { setFormError("Upload failed"); }
                                            finally { setNoteUploading(false); }
                                          }}
                                        />
                                        <div onClick={() => noteFileInputRef.current?.click()}
                                          className={`flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${noteUploadedFile ? "border-emerald-300 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`}>
                                          {noteUploading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin text-emerald-500" /><span className="text-xs text-gray-400">Uploading…</span></>
                                          ) : noteUploadedFile ? (
                                            <><FileArchive className="w-5 h-5 text-emerald-500" /><span className="text-xs font-medium truncate max-w-full px-2 text-gray-700">{noteUploadedFile.name}</span><span className="text-xs text-gray-400">{noteUploadedFile.sizeMb} MB · click to replace</span></>
                                          ) : (
                                            <><Upload className="w-5 h-5 text-emerald-500 opacity-60" /><span className="text-xs font-medium text-gray-500">Click to upload file</span><span className="text-[10px] text-gray-400">PDF · DOCX · PPT · Images — max 20 MB</span></>
                                          )}
                                        </div>
                                      </div>
                                      {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                                      <div className="flex gap-2 mt-2">
                                        <button disabled={saving || noteUploading || !noteForm.pdf_url} onClick={async () => { const ok = await post({ action: "add_note", week_id: week.id, ...noteForm, file_size_mb: noteForm.file_size_mb ? Number(noteForm.file_size_mb) : null }); if (ok) { setShowNoteForm(null); setNoteForm({ title: "", description: "", pdf_url: "", file_size_mb: "" }); setNoteUploadedFile(null); }}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold disabled:opacity-50">
                                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                                        </button>
                                        <button onClick={() => { setShowNoteForm(null); setNoteUploadedFile(null); setNoteForm({ title: "", description: "", pdf_url: "", file_size_mb: "" }); }} className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-500">Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setShowNoteForm(week.id); setShowVideoForm(null); setShowAssignForm(null); }} className="flex items-center gap-1.5 text-xs mt-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors">
                                      <Plus className="w-3 h-3" /> Add Note
                                    </button>
                                  )}
                                </div>

                                {/* ── Assignments ── */}
                                <div>
                                  <div className="text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-400">Assignments</div>
                                  {week.assignments?.map(a => (
                                    <div key={a.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg mb-1 bg-gray-50">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <ClipboardList className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                        <span className="text-xs font-medium truncate text-gray-700">{a.title}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${a.assignment_type === "quiz" ? "bg-violet-100 text-violet-600" : a.assignment_type === "practice" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>{a.assignment_type}</span>
                                      </div>
                                      <button onClick={() => post({ action: "delete_assignment", id: a.id })} className="p-1 text-red-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                  ))}
                                  {showAssignForm === week.id ? (
                                    <div className="mt-2 p-3 rounded-lg border bg-blue-50 border-blue-200">
                                      <div className="grid grid-cols-1 gap-2">
                                        <input placeholder="Assignment title *" value={assignForm.title} onChange={e => setAssignForm(f => ({...f, title: e.target.value}))} className={inputCls} />
                                        <textarea placeholder="Description" rows={2} value={assignForm.description} onChange={e => setAssignForm(f => ({...f, description: e.target.value}))} className={`${inputCls} resize-none`} />
                                        <div className="grid grid-cols-3 gap-2">
                                          <select value={assignForm.assignment_type} onChange={e => setAssignForm(f => ({...f, assignment_type: e.target.value}))} className={inputCls}>
                                            <option value="practice">Practice</option>
                                            <option value="assignment">Assignment</option>
                                            <option value="quiz">Quiz</option>
                                          </select>
                                          <input type="date" value={assignForm.deadline} onChange={e => setAssignForm(f => ({...f, deadline: e.target.value}))} className={inputCls} />
                                          <input placeholder="Max score" type="number" value={assignForm.max_score} onChange={e => setAssignForm(f => ({...f, max_score: e.target.value}))} className={inputCls} />
                                        </div>
                                      </div>
                                      {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                                      <div className="flex gap-2 mt-2">
                                        <button disabled={saving} onClick={async () => { const ok = await post({ action: "add_assignment", week_id: week.id, ...assignForm, max_score: Number(assignForm.max_score) || 100 }); if (ok) { setShowAssignForm(null); setAssignForm({ title: "", description: "", assignment_type: "assignment", deadline: "", max_score: "100" }); }}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold disabled:opacity-50">
                                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                                        </button>
                                        <button onClick={() => setShowAssignForm(null)} className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-500">Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setShowAssignForm(week.id); setShowVideoForm(null); setShowNoteForm(null); }} className="flex items-center gap-1.5 text-xs mt-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
                                      <Plus className="w-3 h-3" /> Add Assignment
                                    </button>
                                  )}
                                </div>

                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add Week form */}
                        {showWeekForm === phase.id ? (
                          <div className="mt-2 p-4 rounded-xl border bg-amber-50 border-amber-200">
                            <p className="text-xs font-bold mb-2 text-amber-700">New Week</p>
                            <div className="space-y-2">
                              <input placeholder="Week title *" value={weekForm.title} onChange={e => setWeekForm(f => ({...f, title: e.target.value}))} className={inputCls} />
                              <input placeholder="Description" value={weekForm.description} onChange={e => setWeekForm(f => ({...f, description: e.target.value}))} className={inputCls} />
                              <input placeholder="Learning topics (comma separated)" value={weekForm.learning_topics} onChange={e => setWeekForm(f => ({...f, learning_topics: e.target.value}))} className={inputCls} />
                            </div>
                            {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                            <div className="flex gap-2 mt-3">
                              <button disabled={saving} onClick={async () => { const ok = await post({ action: "add_week", phase_id: phase.id, ...weekForm, learning_topics: weekForm.learning_topics.split(",").map(s => s.trim()).filter(Boolean) }); if (ok) { setShowWeekForm(null); setWeekForm({ title: "", description: "", learning_topics: "" }); }}} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white text-xs font-semibold disabled:opacity-50">
                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save Week
                              </button>
                              <button onClick={() => setShowWeekForm(null)} className="px-3 py-2 rounded-lg text-xs bg-gray-100 text-gray-500">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setShowWeekForm(phase.id)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors w-full justify-center mt-1">
                            <Plus className="w-3 h-3" /> Add Week
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Phase form */}
                {showPhaseForm ? (
                  <div className="p-4 rounded-xl border bg-violet-50 border-violet-200">
                    <p className="text-xs font-bold mb-2 text-violet-700">New Phase</p>
                    <div className="space-y-2">
                      <input placeholder="Phase title *" value={phaseForm.title} onChange={e => setPhaseForm(f => ({...f, title: e.target.value}))} className={inputCls} />
                      <input placeholder="Description" value={phaseForm.description} onChange={e => setPhaseForm(f => ({...f, description: e.target.value}))} className={inputCls} />
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="Duration (weeks)" type="number" min={1} value={phaseForm.duration_weeks} onChange={e => setPhaseForm(f => ({...f, duration_weeks: Number(e.target.value)}))} className={inputCls} />
                        <input placeholder="Learning objectives (comma separated)" value={phaseForm.learning_objectives} onChange={e => setPhaseForm(f => ({...f, learning_objectives: e.target.value}))} className={inputCls} />
                      </div>
                    </div>
                    {formError && <p className="text-xs text-red-500 mt-1">{formError}</p>}
                    <div className="flex gap-2 mt-3">
                      <button disabled={saving} onClick={async () => { const ok = await post({ action: "add_phase", course_id: (course as any).id, ...phaseForm, learning_objectives: phaseForm.learning_objectives.split(",").map(s => s.trim()).filter(Boolean) }); if (ok) { setShowPhaseForm(false); setPhaseForm({ title: "", description: "", duration_weeks: 1, learning_objectives: "" }); }}} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-500 text-white text-xs font-semibold disabled:opacity-50">
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save Phase
                      </button>
                      <button onClick={() => setShowPhaseForm(false)} className="px-3 py-2 rounded-lg text-xs bg-gray-100 text-gray-500">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowPhaseForm(true)} className="flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl border-2 border-dashed border-violet-200 text-violet-500 hover:bg-violet-50 text-sm font-semibold transition-colors mt-2">
                    <Plus className="w-4 h-4" /> Add Phase
                  </button>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Main InstructorLMS page ────────────────────────────────────────────────────
export default function InstructorLMS() {
  const { assignedCourses, loading } = useInstructor();
  const [activeCourse, setActiveCourse] = useState<AssignedCourse | null>(null);
  const [search, setSearch] = useState("");

  const filtered = assignedCourses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || (c.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Monitor className="w-5 h-5 text-[#f47822]" />
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Instructor Panel</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">LMS Content Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Manage phases, weeks, videos, notes and assignments for your assigned courses.</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-orange-300 bg-white transition-colors" />
      </motion.div>

      {/* Courses grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-gray-300" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <BookOpen className="w-7 h-7 text-gray-300" />
          </div>
          <p className="font-semibold text-gray-500">{assignedCourses.length === 0 ? "No courses assigned yet" : "No results"}</p>
          <p className="text-xs text-gray-400 mt-1">{assignedCourses.length === 0 ? "Ask your admin to assign courses to you." : "Try a different search."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <motion.button key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setActiveCourse(course)}
              className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all p-5 group">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5 text-[#f47822]" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#f47822] transition-colors">{course.title}</h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {course.category && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{course.category}</span>}
                {course.level && <span className="text-[10px] bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full font-medium">{course.level}</span>}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${course.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>{course.status}</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-[#f47822] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Manage content</span> <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Content Manager Modal */}
      <AnimatePresence>
        {activeCourse && <CourseContentManager course={activeCourse} onClose={() => setActiveCourse(null)} />}
      </AnimatePresence>

    </div>
  );
}
