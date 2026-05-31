-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  description LONGTEXT,
  category VARCHAR(50) NOT NULL,
  author VARCHAR(100) NOT NULL,
  author_image VARCHAR(255) DEFAULT '/images/team/default.jpg',
  date DATE NOT NULL,
  read_time VARCHAR(20) NOT NULL,
  image VARCHAR(255) DEFAULT '/images/blog/default.jpg',
  video VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  promotion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_featured (featured),
  INDEX idx_date (date)
);

-- Insert default blog posts from data file (optional migration)
-- These will be inserted manually or via seed script
