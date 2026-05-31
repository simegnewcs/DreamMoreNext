-- Migration: Create payment_accounts table
-- This table stores dynamic payment account information for CBE, TeleBirr, etc.

CREATE TABLE IF NOT EXISTS payment_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method VARCHAR(50) NOT NULL COMMENT 'Payment method type: cbe, telebirr, etc.',
  account_number VARCHAR(255) NOT NULL COMMENT 'Account number or phone number',
  account_holder VARCHAR(255) NOT NULL COMMENT 'Name of the account holder',
  bank_name VARCHAR(100) COMMENT 'Bank name (for bank transfers)',
  instructions TEXT COMMENT 'Payment instructions for this account',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Whether this account is currently active',
  display_order INT DEFAULT 0 COMMENT 'Order to display accounts',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_method (method),
  INDEX idx_is_active (is_active),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert default accounts (matching current static values)
INSERT INTO payment_accounts (method, account_number, account_holder, bank_name, instructions, display_order) VALUES
('cbe', '1000765205852', 'DreamMore Academy PLC', 'Commercial Bank of Ethiopia', 'Transfer to CBE account and take a screenshot of the confirmation.', 1),
('telebirr', '0993132122', 'DreamMore', 'Ethio Telecom', 'Send payment via Telebirr and screenshot the transaction confirmation.', 2)
ON DUPLICATE KEY UPDATE 
  account_holder = VALUES(account_holder),
  instructions = VALUES(instructions);
