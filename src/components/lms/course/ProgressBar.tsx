"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  total?: number;
  completed?: number;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export default function ProgressBar({
  progress,
  total,
  completed,
  showPercentage = true,
  size = "md",
  color = "#f47822",
  className = "",
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {clampedProgress}%
          </span>
        )}
        {total !== undefined && completed !== undefined && (
          <span className="text-xs text-gray-500">
            {completed} of {total} completed
          </span>
        )}
      </div>
      <div
        className={`w-full ${sizeClasses[size]} bg-gray-100 rounded-full overflow-hidden`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
