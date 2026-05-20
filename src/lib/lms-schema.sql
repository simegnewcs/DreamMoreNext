-- LMS Course Structure Schema
-- Supports phases, weeks, videos, notes, and assignments

-- Course Phases Table
CREATE TABLE IF NOT EXISTS course_phases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  phase_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_weeks INT NOT NULL,
  learning_objectives JSON,
  order_index INT DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_phase (course_id, phase_number),
  INDEX idx_order (order_index)
);

-- Weekly Content Table
CREATE TABLE IF NOT EXISTS weekly_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phase_id INT NOT NULL,
  week_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  learning_topics JSON,
  is_locked BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (phase_id) REFERENCES course_phases(id) ON DELETE CASCADE,
  INDEX idx_phase_week (phase_id, week_number),
  INDEX idx_order (order_index)
);

-- Class Videos Table
CREATE TABLE IF NOT EXISTS class_videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  week_id INT NOT NULL,
  video_number VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  video_url VARCHAR(500) NOT NULL,
  duration_minutes INT,
  is_completed BOOLEAN DEFAULT FALSE,
  progress_seconds INT DEFAULT 0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (week_id) REFERENCES weekly_content(id) ON DELETE CASCADE,
  INDEX idx_week_video (week_id, video_number),
  INDEX idx_order (order_index)
);

-- Class Notes Table
CREATE TABLE IF NOT EXISTS class_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  week_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  pdf_url VARCHAR(500) NOT NULL,
  file_size_mb DECIMAL(5,2),
  is_downloaded BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (week_id) REFERENCES weekly_content(id) ON DELETE CASCADE,
  INDEX idx_week_note (week_id),
  INDEX idx_order (order_index)
);

-- Questions & Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  week_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignment_type ENUM('practice', 'assignment', 'quiz') DEFAULT 'practice',
  deadline DATE,
  is_submitted BOOLEAN DEFAULT FALSE,
  submission_url VARCHAR(500),
  score INT,
  max_score INT DEFAULT 100,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (week_id) REFERENCES weekly_content(id) ON DELETE CASCADE,
  INDEX idx_week_assignment (week_id),
  INDEX idx_type (assignment_type),
  INDEX idx_order (order_index)
);

-- Student Progress Table
CREATE TABLE IF NOT EXISTS student_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  phase_id INT,
  week_id INT,
  video_id INT,
  progress_percentage INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (phase_id) REFERENCES course_phases(id) ON DELETE CASCADE,
  FOREIGN KEY (week_id) REFERENCES weekly_content(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES class_videos(id) ON DELETE CASCADE,
  INDEX idx_user_course (user_id, course_id),
  INDEX idx_progress (progress_percentage),
  UNIQUE KEY unique_user_video (user_id, video_id)
);

-- Course Enrollments with Phase Unlock Tracking
CREATE TABLE IF NOT EXISTS enrollment_phase_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enrollment_id INT NOT NULL,
  phase_id INT NOT NULL,
  is_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  progress_percentage INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (phase_id) REFERENCES course_phases(id) ON DELETE CASCADE,
  INDEX idx_enrollment_phase (enrollment_id, phase_id)
);
