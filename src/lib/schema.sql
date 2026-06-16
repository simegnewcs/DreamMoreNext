-- DreamMore Platform Database Schema
-- Run this script to initialize the MySQL database

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS dreammore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dreammore;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin', 'instructor') DEFAULT 'student',
  phone VARCHAR(20),
  avatar VARCHAR(255),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  email_verified TINYINT(1) DEFAULT 0,
  verification_token VARCHAR(255),
  verification_expires_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  image VARCHAR(255),
  duration VARCHAR(50),
  level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
  instructor VARCHAR(255),
  instructor_bio TEXT,
  instructor_image VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ETB',
  category VARCHAR(50),
  language VARCHAR(50) DEFAULT 'English / Amharic',
  schedule VARCHAR(255),
  certificate BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2, 1) DEFAULT 0,
  students_count INT DEFAULT 0,
  status ENUM('active', 'draft', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_status (status)
);

-- Course modules table
CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  lessons_count INT DEFAULT 0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id)
);

-- Course outcomes table
CREATE TABLE IF NOT EXISTS outcomes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  outcome TEXT NOT NULL,
  order_index INT DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id)
);

-- Course requirements table
CREATE TABLE IF NOT EXISTS requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  requirement TEXT NOT NULL,
  order_index INT DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id)
);

-- Course technologies/tools table
CREATE TABLE IF NOT EXISTS technologies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id)
);

-- Course FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INT DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  education VARCHAR(255),
  experience TEXT,
  motivation TEXT,
  amount DECIMAL(10, 2),
  payment_method VARCHAR(50),
  payment_screenshot VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_course_id (course_id),
  INDEX idx_user_id (user_id)
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  role VARCHAR(100),
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  image VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_active (is_active)
);

-- Portfolio projects table
CREATE TABLE IF NOT EXISTS portfolio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  technologies JSON,
  image VARCHAR(255),
  live_url VARCHAR(255),
  case_study_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (is_active)
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,
  category VARCHAR(100),
  author VARCHAR(255),
  author_image VARCHAR(255),
  image VARCHAR(255),
  read_time VARCHAR(20),
  featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_featured (featured)
);

-- Insert sample admin user (password: admin123)
INSERT IGNORE INTO users (email, password, name, role) VALUES
('admin@dreammore.com', '$2a$10$YourHashedPasswordHere', 'Admin User', 'admin');

-- Insert sample courses
INSERT IGNORE INTO courses (slug, title, description, short_description, image, duration, level, instructor, instructor_bio, price, category, schedule) VALUES
('full-stack-development', 'Full Stack Development', 
 '<p>Master modern web development from <strong>frontend to backend</strong>. Build production-ready applications using React, Node.js, and cloud technologies.</p><h3>What You\'ll Learn</h3><ul><li>Frontend with React & Next.js</li><li>Backend APIs with Node.js</li><li>Database design with MySQL</li><li>Cloud deployment on AWS</li></ul>', 
 'Master modern web development from frontend to backend', 
 '/images/courses/fullstack.jpg', '6 Months', 'Intermediate', 'Samuel Tesfaye', 
 '10+ years experience building enterprise applications', 4500, 'development', 
 'Mon, Wed, Fri — 6:00 PM – 9:00 PM'),

('ui-ux-design', 'UI/UX Design', 
 '<p>Learn to design stunning, user-centered digital products. Master <strong>Figma</strong>, design systems, and UX research methodologies.</p><h3>What You\'ll Learn</h3><ul><li>Design Principles & Theory</li><li>Figma Mastery</li><li>UX Research & Testing</li><li>Design Systems</li></ul>', 
 'Learn to design stunning, user-centered digital products', 
 '/images/courses/uiux.jpg', '4 Months', 'Beginner', 'Hana Girma', 
 'Lead designer with 8 years experience', 3500, 'design', 
 'Tue, Thu — 6:00 PM – 9:00 PM'),

('graphic-design', 'Graphic Design', 
 '<p>Master visual communication with <strong>Adobe Creative Suite</strong>. Create logos, branding, marketing materials, and digital artwork.</p><h3>What You\'ll Learn</h3><ul><li>Adobe Photoshop</li><li>Adobe Illustrator</li><li>Logo & Branding Design</li><li>Print & Digital Design</li></ul>', 
 'Master visual communication with Adobe Creative Suite', 
 '/images/courses/graphic.jpg', '3 Months', 'Beginner', 'Meron Tadesse', 
 'Award-winning graphic designer with 7 years experience', 2500, 'design', 
 'Mon, Wed — 5:00 PM – 8:00 PM');

-- Insert sample outcomes
INSERT IGNORE INTO outcomes (course_id, outcome, order_index) 
SELECT id, 'Build full-stack web applications from scratch', 0 FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'Work with REST APIs and GraphQL', 1 FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'Deploy applications on cloud platforms', 2 FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'Design professional UI components', 0 FROM courses WHERE slug = 'ui-ux-design'
UNION SELECT id, 'Create interactive prototypes', 1 FROM courses WHERE slug = 'ui-ux-design'
UNION SELECT id, 'Build and maintain design systems', 2 FROM courses WHERE slug = 'ui-ux-design';

-- Insert sample requirements
INSERT IGNORE INTO requirements (course_id, requirement, order_index)
SELECT id, 'Basic computer skills', 0 FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'Logical thinking ability', 1 FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'No prior design experience needed', 0 FROM courses WHERE slug = 'ui-ux-design'
UNION SELECT id, 'Creative mindset', 1 FROM courses WHERE slug = 'ui-ux-design';

-- Insert sample technologies
INSERT IGNORE INTO technologies (course_id, name)
SELECT id, 'React' FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'Node.js' FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'MySQL' FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'AWS' FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'Figma' FROM courses WHERE slug = 'ui-ux-design'
UNION SELECT id, 'Adobe XD' FROM courses WHERE slug = 'ui-ux-design'
UNION SELECT id, 'Photoshop' FROM courses WHERE slug = 'graphic-design'
UNION SELECT id, 'Illustrator' FROM courses WHERE slug = 'graphic-design';

-- Insert sample FAQs
INSERT IGNORE INTO faqs (course_id, question, answer, order_index)
SELECT id, 'Is this course for beginners?', 'Yes, the course covers everything from basics to advanced topics.', 0 FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'Will I get a certificate?', 'Yes, a verified certificate is issued upon completion.', 1 FROM courses WHERE slug = 'full-stack-development'
UNION SELECT id, 'Do I need design experience?', 'No experience needed. We start from absolute basics.', 0 FROM courses WHERE slug = 'ui-ux-design';

-- Insert sample testimonials
INSERT IGNORE INTO testimonials (name, company, role, content, rating) VALUES
('Abebe Kebede', 'Kebede Imports', 'CEO', 'DreamMore transformed our business with a world-class e-commerce platform.', 5),
('Tigist Hailu', 'EduTech Ethiopia', 'Founder', 'The team built our entire learning management system professionally.', 5),
('Yonas Tesfaye', 'StartupAddis', 'Product Manager', 'Our app has 50,000+ downloads since launch.', 5);

-- Insert sample applications
INSERT IGNORE INTO applications (course_id, name, email, phone, status, amount) 
FROM courses c WHERE c.slug = 'full-stack-development';

-- Trusted Brands table
CREATE TABLE IF NOT EXISTS trusted_brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

