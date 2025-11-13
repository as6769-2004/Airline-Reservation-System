-- =====================================================
-- CURSOR 1: Generate passenger booking report
-- =====================================================
DELIMITER //
CREATE PROCEDURE sp_passenger_booking_report()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_passenger_id INT;
    DECLARE v_name VARCHAR(255);
    DECLARE v_email VARCHAR(255);
    DECLARE v_phone VARCHAR(15);
    DECLARE v_booking_count INT;
    DECLARE v_total_spent DECIMAL(10, 2);
    
    DECLARE passenger_cursor CURSOR FOR
        SELECT 
            p.passenger_id, 
            p.name, 
            p.email, 
            p.phone,
            COUNT(b.booking_id) AS bookings,
            COALESCE(SUM(b.total_amount), 0) AS total_spent
        FROM passenger p
        LEFT JOIN booking b ON p.passenger_id = b.passenger_id
        GROUP BY p.passenger_id, p.name, p.email, p.phone;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Create temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_passenger_report;
    CREATE TEMPORARY TABLE temp_passenger_report (
        passenger_id INT,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(15),
        booking_count INT,
        total_spent DECIMAL(10, 2),
        customer_category VARCHAR(50)
    );
    
    OPEN passenger_cursor;
    
    read_loop: LOOP
        FETCH passenger_cursor INTO v_passenger_id, v_name, v_email, v_phone, v_booking_count, v_total_spent;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Categorize customers based on spending
        INSERT INTO temp_passenger_report 
        VALUES (
            v_passenger_id, 
            v_name, 
            v_email, 
            v_phone,
            v_booking_count, 
            v_total_spent,
            CASE 
                WHEN v_total_spent >= 50000 THEN 'Premium'
                WHEN v_total_spent >= 20000 THEN 'Gold'
                WHEN v_total_spent >= 10000 THEN 'Silver'
                WHEN v_total_spent > 0 THEN 'Regular'
                ELSE 'New'
            END
        );
    END LOOP;
    
    CLOSE passenger_cursor;
    
    SELECT * FROM temp_passenger_report ORDER BY total_spent DESC;
    
    DROP TEMPORARY TABLE IF EXISTS temp_passenger_report;
END//
DELIMITER ;

-- =====================================================
-- CURSOR 2: Update loyalty points (Note: This requires adding loyalty_points column)
-- First, add the loyalty_points column to passenger table
-- =====================================================
-- Run this first to add the column:
-- ALTER TABLE passenger ADD COLUMN loyalty_points INT DEFAULT 0;

DELIMITER //
CREATE PROCEDURE sp_update_loyalty_points()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_passenger_id INT;
    DECLARE v_total_spent DECIMAL(10, 2);
    DECLARE v_points INT;
    DECLARE v_updated_count INT DEFAULT 0;
    
    -- Declare cursor
    DECLARE loyalty_cursor CURSOR FOR
        SELECT 
            p.passenger_id, 
            COALESCE(SUM(pay.amount), 0) AS total_spent
        FROM passenger p
        LEFT JOIN booking b ON p.passenger_id = b.passenger_id
        LEFT JOIN payment pay ON b.booking_id = pay.booking_id
        WHERE pay.payment_status = 'Completed'
        GROUP BY p.passenger_id;
    
    -- Declare continue handler
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Open cursor
    OPEN loyalty_cursor;
    
    -- Loop through cursor
    read_loop: LOOP
        FETCH loyalty_cursor INTO v_passenger_id, v_total_spent;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Calculate points: 1 point per 100 rupees spent
        SET v_points = FLOOR(v_total_spent / 100);
        
        SET v_updated_count = v_updated_count + 1;
    END LOOP;
    
    -- Close cursor
    CLOSE loyalty_cursor;
    
    -- Display result
    SELECT CONCAT(v_updated_count, ' passengers processed for loyalty points') AS result;

END//
DELIMITER ;

-- =====================================================
-- CURSOR 3: Generate flight occupancy report
-- =====================================================
DELIMITER //
CREATE PROCEDURE sp_flight_occupancy_report()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_flight_id INT;
    DECLARE v_flight_number VARCHAR(50);
    DECLARE v_flight_name VARCHAR(100);
    DECLARE v_departure_date DATETIME;
    DECLARE v_capacity INT;
    DECLARE v_booked_seats INT;
    DECLARE v_occupancy_rate DECIMAL(5, 2);
    
    DECLARE flight_cursor CURSOR FOR
        SELECT 
            f.flight_id,
            f.flight_number,
            f.flight_name,
            f.departure_date,
            a.capacity,
            COUNT(b.booking_id) AS booked_seats
        FROM flight f
        JOIN aircraft a ON f.aircraft_id = a.aircraft_id
        LEFT JOIN booking b ON f.flight_id = b.flight_id AND b.booking_status = 'Confirmed'
        GROUP BY f.flight_id, f.flight_number, f.flight_name, f.departure_date, a.capacity;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    DROP TEMPORARY TABLE IF EXISTS temp_flight_occupancy;
    CREATE TEMPORARY TABLE temp_flight_occupancy (
        flight_id INT,
        flight_number VARCHAR(50),
        flight_name VARCHAR(100),
        departure_date DATETIME,
        capacity INT,
        booked_seats INT,
        available_seats INT,
        occupancy_rate DECIMAL(5, 2),
        status VARCHAR(20)
    );
    
    OPEN flight_cursor;
    
    read_loop: LOOP
        FETCH flight_cursor INTO v_flight_id, v_flight_number, v_flight_name, 
                                 v_departure_date, v_capacity, v_booked_seats;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Calculate occupancy rate
        SET v_occupancy_rate = (v_booked_seats / v_capacity) * 100;
        
        INSERT INTO temp_flight_occupancy VALUES (
            v_flight_id,
            v_flight_number,
            v_flight_name,
            v_departure_date,
            v_capacity,
            v_booked_seats,
            v_capacity - v_booked_seats,
            v_occupancy_rate,
            CASE 
                WHEN v_occupancy_rate >= 90 THEN 'Almost Full'
                WHEN v_occupancy_rate >= 70 THEN 'Good'
                WHEN v_occupancy_rate >= 50 THEN 'Moderate'
                WHEN v_occupancy_rate > 0 THEN 'Low'
                ELSE 'Empty'
            END
        );
    END LOOP;
    
    CLOSE flight_cursor;
    
    SELECT * FROM temp_flight_occupancy ORDER BY occupancy_rate DESC;
    
    DROP TEMPORARY TABLE IF EXISTS temp_flight_occupancy;
END//
DELIMITER ;

-- =====================================================
-- CURSOR 4: Process pending payments
-- =====================================================
DELIMITER //
CREATE PROCEDURE sp_process_pending_payments()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_booking_id INT;
    DECLARE v_pnr_number VARCHAR(20);
    DECLARE v_passenger_name VARCHAR(255);
    DECLARE v_total_amount DECIMAL(10, 2);
    DECLARE v_paid_amount DECIMAL(10, 2);
    DECLARE v_pending_amount DECIMAL(10, 2);
    DECLARE v_count INT DEFAULT 0;
    
    DECLARE pending_cursor CURSOR FOR
        SELECT 
            b.booking_id,
            b.pnr_number,
            p.name,
            b.total_amount,
            COALESCE(SUM(pay.amount), 0) AS paid_amount
        FROM booking b
        JOIN passenger p ON b.passenger_id = p.passenger_id
        LEFT JOIN payment pay ON b.booking_id = pay.booking_id 
                              AND pay.payment_status = 'Completed'
        WHERE b.booking_status = 'Confirmed'
        GROUP BY b.booking_id, b.pnr_number, p.name, b.total_amount
        HAVING paid_amount < b.total_amount;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    DROP TEMPORARY TABLE IF EXISTS temp_pending_payments;
    CREATE TEMPORARY TABLE temp_pending_payments (
        booking_id INT,
        pnr_number VARCHAR(20),
        passenger_name VARCHAR(255),
        total_amount DECIMAL(10, 2),
        paid_amount DECIMAL(10, 2),
        pending_amount DECIMAL(10, 2)
    );
    
    OPEN pending_cursor;
    
    read_loop: LOOP
        FETCH pending_cursor INTO v_booking_id, v_pnr_number, v_passenger_name, 
                                  v_total_amount, v_paid_amount;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET v_pending_amount = v_total_amount - v_paid_amount;
        
        INSERT INTO temp_pending_payments VALUES (
            v_booking_id,
            v_pnr_number,
            v_passenger_name,
            v_total_amount,
            v_paid_amount,
            v_pending_amount
        );
        
        SET v_count = v_count + 1;
    END LOOP;
    
    CLOSE pending_cursor;
    
    SELECT CONCAT(v_count, ' bookings have pending payments') AS summary;
    SELECT * FROM temp_pending_payments ORDER BY pending_amount DESC;
    
    DROP TEMPORARY TABLE IF EXISTS temp_pending_payments;
END//
DELIMITER ;

-- =====================================================
-- CURSOR 5: Generate revenue report by route
-- =====================================================
DELIMITER //
CREATE PROCEDURE sp_route_revenue_report()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_dep_city VARCHAR(100);
    DECLARE v_arr_city VARCHAR(100);
    DECLARE v_total_flights INT;
    DECLARE v_total_bookings INT;
    DECLARE v_total_revenue DECIMAL(10, 2);
    
    DECLARE route_cursor CURSOR FOR
        SELECT 
            dep.city AS departure_city,
            arr.city AS arrival_city,
            COUNT(DISTINCT f.flight_id) AS total_flights,
            COUNT(b.booking_id) AS total_bookings,
            COALESCE(SUM(pay.amount), 0) AS total_revenue
        FROM flight f
        JOIN airport dep ON f.departure_airport_id = dep.airport_id
        JOIN airport arr ON f.arrival_airport_id = arr.airport_id
        LEFT JOIN booking b ON f.flight_id = b.flight_id
        LEFT JOIN payment pay ON b.booking_id = pay.booking_id 
                              AND pay.payment_status = 'Completed'
        GROUP BY dep.city, arr.city;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    DROP TEMPORARY TABLE IF EXISTS temp_route_revenue;
    CREATE TEMPORARY TABLE temp_route_revenue (
        route VARCHAR(200),
        departure_city VARCHAR(100),
        arrival_city VARCHAR(100),
        total_flights INT,
        total_bookings INT,
        total_revenue DECIMAL(10, 2),
        avg_revenue_per_flight DECIMAL(10, 2)
    );
    
    OPEN route_cursor;
    
    read_loop: LOOP
        FETCH route_cursor INTO v_dep_city, v_arr_city, v_total_flights, 
                                v_total_bookings, v_total_revenue;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        INSERT INTO temp_route_revenue VALUES (
            CONCAT(v_dep_city, ' → ', v_arr_city),
            v_dep_city,
            v_arr_city,
            v_total_flights,
            v_total_bookings,
            v_total_revenue,
            CASE WHEN v_total_flights > 0 THEN v_total_revenue / v_total_flights ELSE 0 END
        );
    END LOOP;
    
    CLOSE route_cursor;
    
    SELECT * FROM temp_route_revenue ORDER BY total_revenue DESC;
    
    DROP TEMPORARY TABLE IF EXISTS temp_route_revenue;
END//
DELIMITER ;

-- =====================================================
-- TEST THE PROCEDURES
-- =====================================================

-- Test 1: Passenger booking report
SET SQL_SAFE_UPDATES = 0;
CALL sp_passenger_booking_report();
SET SQL_SAFE_UPDATES = 1;

-- Test 2: Flight occupancy report
CALL sp_flight_occupancy_report();

-- Test 3: Pending payments report
CALL sp_process_pending_payments();

-- Test 4: Route revenue report
CALL sp_route_revenue_report();

