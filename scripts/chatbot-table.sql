-- Chatbot conversation history table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(50) NOT NULL,
  user_id INT NULL,
  message TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session (session_id),
  INDEX idx_user (user_id),
  INDEX idx_created (created_at)
);
