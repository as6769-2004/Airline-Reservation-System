-- Add created_by_user_id column to passenger table
ALTER TABLE passenger 
ADD COLUMN created_by_user_id INT,
ADD FOREIGN KEY (created_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
ADD INDEX idx_passenger_created_by (created_by_user_id);

-- Update existing passengers to link them to users based on email
UPDATE passenger p
JOIN users u ON p.email = u.email
SET p.created_by_user_id = u.user_id
WHERE p.created_by_user_id IS NULL;