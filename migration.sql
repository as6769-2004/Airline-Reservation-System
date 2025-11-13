-- Migration script to update existing database schema
USE airlinemanagement;

-- Add user_id column to booking table if it doesn't exist
ALTER TABLE booking 
ADD COLUMN IF NOT EXISTS user_id INT,
ADD FOREIGN KEY IF NOT EXISTS (user_id) REFERENCES users(user_id) ON DELETE SET NULL;

-- Add indexes if they don't exist
ALTER TABLE booking 
ADD INDEX IF NOT EXISTS idx_booking_user (user_id);

-- Update existing bookings to link with users based on passenger email
UPDATE booking b
JOIN passenger p ON b.passenger_id = p.passenger_id
JOIN users u ON p.email = u.email
SET b.user_id = u.user_id
WHERE b.user_id IS NULL;

-- Add missing columns to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(15),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add missing columns to passenger table if they don't exist
ALTER TABLE passenger 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add missing columns to flight table if they don't exist
ALTER TABLE flight 
ADD COLUMN IF NOT EXISTS total_seats INT NOT NULL DEFAULT 180,
ADD COLUMN IF NOT EXISTS journey_time VARCHAR(20),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add missing columns to booking table if they don't exist
ALTER TABLE booking 
ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(50),
ADD COLUMN IF NOT EXISTS special_requests TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create user booking summary table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_booking_summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_bookings INT DEFAULT 0,
    total_amount_spent DECIMAL(12, 2) DEFAULT 0.00,
    last_booking_date TIMESTAMP NULL,
    favorite_destination VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_summary (user_id)
);

-- Populate user booking summary for existing users
INSERT INTO user_booking_summary (user_id, total_bookings, total_amount_spent, last_booking_date)
SELECT 
    b.user_id,
    COUNT(*) as total_bookings,
    SUM(b.total_amount) as total_amount_spent,
    MAX(b.booking_date) as last_booking_date
FROM booking b
WHERE b.user_id IS NOT NULL
GROUP BY b.user_id
ON DUPLICATE KEY UPDATE
    total_bookings = VALUES(total_bookings),
    total_amount_spent = VALUES(total_amount_spent),
    last_booking_date = VALUES(last_booking_date);