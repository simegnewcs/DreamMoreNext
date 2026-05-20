"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, CheckCircle2, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Note } from "@/types/lms";

interface NoteCardProps {
  note: Note;
  onDownload?: () => void;
  onPreview?: () => void;
  index?: number;
}

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];

export default function NoteCard({ note, index }: NoteCardProps) {
  const [downloading, setDownloading] = useState(false);

  const rawExt = note.pdfUrl.split(".").pop()?.toLowerCase() || "pdf";
  const fileExtension = rawExt.toUpperCase();
  const isImage = IMAGE_EXTS.includes(rawExt);

  const handlePreview = () => {
    window.open(note.pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(note.pdfUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = note.pdfUrl.split("/").pop() || `${note.title}.${rawExt}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(note.pdfUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 p-4 transition-all hover:shadow-sm group"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isImage ? "bg-blue-50" : "bg-red-50"}`}>
          {isImage
            ? <ImageIcon className="w-5 h-5 text-blue-500" />
            : <FileText className="w-5 h-5 text-red-500" />
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <span className="text-xs text-gray-500 font-medium">Note {index !== undefined ? index + 1 : note.orderIndex + 1}</span>
              <h4 className="font-semibold text-sm text-gray-900 truncate">{note.title}</h4>
            </div>
            {note.isDownloaded && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />}
          </div>
          {note.description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{note.description}</p>}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded font-medium">{fileExtension}</span>
              {note.fileSizeMb > 0 && <span className="text-xs text-gray-500">{note.fileSizeMb.toFixed(1)} MB</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePreview}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-[#f47822] text-white hover:bg-[#e06b18] disabled:opacity-60"
              >
                {downloading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Download className="w-3.5 h-3.5" />
                }
                {downloading ? "Downloading…" : "Download"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
