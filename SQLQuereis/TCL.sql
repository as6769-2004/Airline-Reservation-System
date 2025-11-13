USE airlinemanagement;

-- Set up assumed references
SET @flight_id_ref = 1;
SET @user_id_ref = 1;

-- ============================================
-- ❌ FAILED TRANSACTION (ROLLBACK)
-- ============================================

START TRANSACTION;

-- Insert new passenger data
INSERT INTO passenger (name, aadhar, nationality, address, gender, phone, email, date_of_birth)
VALUES ('Deepak Kumar', '112233445566', 'Indian', 'Chennai, Tamil Nadu', 'Male', '9876123450', 'deepak.rollback@email.com', '1990-01-01');

SET @passenger_id_rollback = LAST_INSERT_ID();
SET @pnr_rollback = 'PNR999FAIL';

-- Create a booking
INSERT INTO booking (flight_id, passenger_id, user_id, pnr_number, seat_number, booking_status, total_amount)
VALUES (@flight_id_ref, @passenger_id_rollback, @user_id_ref, @pnr_rollback, '22C', 'Pending Payment', 7000.00);

-- Insert payment attempt (assumed to fail immediately after)
INSERT INTO payment (booking_id, user_id, amount, transaction_id, payment_status)
VALUES (LAST_INSERT_ID(), @user_id_ref, 7000.00, CONCAT('TXN_F_', UUID()), 'Failed');

-- Check data before rollback
SELECT * FROM booking WHERE pnr_number = @pnr_rollback;

-- Payment failed, cancel entire booking/passenger operation
ROLLBACK;

SELECT '--- ROLLBACK EXECUTED: All changes undone. ---' AS 'Status';

-- Verify data removal
SELECT * FROM booking WHERE pnr_number = @pnr_rollback;
SELECT * FROM passenger WHERE passenger_id = @passenger_id_rollback;