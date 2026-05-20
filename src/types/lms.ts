// LMS Course Structure Types

export interface Video {
  id: string;
  videoNumber: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  durationMinutes: number;
  isCompleted: boolean;
  progressSeconds: number;
  orderIndex: number;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  fileSizeMb: number;
  isDownloaded: boolean;
  orderIndex: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  assignmentType: 'practice' | 'assignment' | 'quiz';
  deadline?: string;
  isSubmitted: boolean;
  submissionUrl?: string;
  score?: number;
  maxScore: number;
  orderIndex: number;
}

export interface Week {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  learningTopics: string[];
  isLocked: boolean;
  isCompleted: boolean;
  orderIndex: number;
  videos: Video[];
  notes: Note[];
  assignments: Assignment[];
  progressPercentage: number;
}

export interface Phase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  durationWeeks: number;
  learningObjectives: string[];
  isLocked: boolean;
  isCompleted: boolean;
  orderIndex: number;
  weeks: Week[];
  progressPercentage: number;
}

export interface CourseStructure {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  instructor: string;
  instructorImage: string;
  totalPhases: number;
  totalWeeks: number;
  totalVideos: number;
  totalDuration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  currency: string;
  phases: Phase[];
  overallProgress: number;
  isEnrolled: boolean;
  certificateEnabled: boolean;
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  completedVideos: string[];
  completedWeeks: string[];
  completedPhases: string[];
  downloadedNotes: string[];
  submittedAssignments: string[];
  lastAccessedWeek: string;
  lastAccessedVideo: string;
  overallProgress: number;
}

export interface VideoProgress {
  videoId: string;
  progressSeconds: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
  isLocked?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
  isLocked?: boolean;
  progress?: number;
}
