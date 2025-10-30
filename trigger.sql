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


-- 2. AFTER UPDATE TRIGGER
-- Restore available seats when booking is cancelled
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
END//
DELIMITER ;






INSERT INTO booking (flight_id, passenger_id, pnr_number, seat_number, booking_status)
VALUES (1, 1, 'PNRTEST001', '50A', 'Confirmed');

-- Check if seats decreased
SELECT flight_number, available_seats FROM flight WHERE flight_id = 1;


-- Test Trigger 2: Cancel a booking (will increase available seats)

UPDATE booking 
SET booking_status = 'Cancelled' 
WHERE pnr_number = 'PNRTEST001';

-- Check if seats increased
SELECT flight_number, available_seats FROM flight WHERE flight_id = 1;

