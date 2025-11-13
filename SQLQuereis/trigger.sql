-- TRIGGER 1: AFTER INSERT ON BOOKING
-- Decrease available seats when a confirmed booking is made
DELIMITER //
CREATE TRIGGER trg_after_booking_insert
AFTER INSERT ON booking
FOR EACH ROW
BEGIN
    IF NEW.booking_status = 'Confirmed' THEN
        UPDATE flight 
        SET available_seats = available_seats - 1
        WHERE flight_id = NEW.flight_id;
    END IF;
END//
DELIMITER ;

-- TRIGGER 2: AFTER UPDATE ON BOOKING
-- Adjust available seats when booking status changes
DELIMITER //
CREATE TRIGGER trg_after_booking_update
AFTER UPDATE ON booking
FOR EACH ROW
BEGIN
    -- If booking changed from Confirmed to Cancelled
    IF OLD.booking_status = 'Confirmed' AND NEW.booking_status = 'Cancelled' THEN
        UPDATE flight 
        SET available_seats = available_seats + 1
        WHERE flight_id = NEW.flight_id;
    END IF;
    
    -- If booking changed from Cancelled to Confirmed
    IF OLD.booking_status = 'Cancelled' AND NEW.booking_status = 'Confirmed' THEN
        UPDATE flight 
        SET available_seats = available_seats - 1
        WHERE flight_id = NEW.flight_id;
    END IF;
    
    -- If booking changed from any other status to Confirmed
    IF OLD.booking_status != 'Confirmed' AND OLD.booking_status != 'Cancelled' 
       AND NEW.booking_status = 'Confirmed' THEN
        UPDATE flight 
        SET available_seats = available_seats - 1
        WHERE flight_id = NEW.flight_id;
    END IF;
    
    -- If booking changed from Confirmed to any other status (not Cancelled)
    IF OLD.booking_status = 'Confirmed' 
       AND NEW.booking_status != 'Confirmed' 
       AND NEW.booking_status != 'Cancelled' THEN
        UPDATE flight 
        SET available_seats = available_seats + 1
        WHERE flight_id = NEW.flight_id;
    END IF;
END//
DELIMITER ;

-- TEST CASES

-- First, let's add a test passenger if needed
INSERT INTO passenger (name, aadhar, nationality, address, gender, phone, email, date_of_birth)
VALUES ('Test Passenger', '123456789012', 'Indian', '123 Test Street, Mumbai', 'Male', 
        '9876543210', 'testpassenger@example.com', '1990-01-01')
ON DUPLICATE KEY UPDATE name = name;

-- Get the passenger_id (assuming it's 1, adjust if needed)
SET @test_passenger_id = LAST_INSERT_ID();

-- Check initial available seats for flight 1
SELECT 
    flight_number, 
    flight_name,
    departure_date,
    available_seats AS seats_before_booking
FROM flight 
WHERE flight_id = 1;

-- TEST 1: Insert a confirmed booking (should decrease seats)
INSERT INTO booking (flight_id, passenger_id, pnr_number, seat_number, booking_status, total_amount)
VALUES (1, 1, 'PNRTEST001', '12A', 'Confirmed', 5500.00);

-- Check if seats decreased
SELECT 
    flight_number, 
    flight_name,
    available_seats AS seats_after_booking
FROM flight 
WHERE flight_id = 1;

-- TEST 2: Cancel the booking (should increase seats)
UPDATE booking 
SET booking_status = 'Cancelled' 
WHERE pnr_number = 'PNRTEST001';

-- Check if seats increased back
SELECT 
    flight_number, 
    flight_name,
    available_seats AS seats_after_cancellation
FROM flight 
WHERE flight_id = 1;

-- TEST 3: Re-confirm the booking (should decrease seats again)
UPDATE booking 
SET booking_status = 'Confirmed' 
WHERE pnr_number = 'PNRTEST001';

-- Check if seats decreased again
SELECT 
    flight_number, 
    flight_name,
    available_seats AS seats_after_reconfirmation
FROM flight 
WHERE flight_id = 1;

-- TEST 4: Check booking history
SELECT 
    b.booking_id,
    b.pnr_number,
    b.seat_number,
    b.booking_status,
    b.total_amount,
    b.booking_date,
    f.flight_number,
    f.available_seats AS current_available_seats
FROM booking b
JOIN flight f ON b.flight_id = f.flight_id
WHERE b.pnr_number = 'PNRTEST001';
