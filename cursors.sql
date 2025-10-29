-- 1. CURSOR - Generate passenger booking report
DELIMITER //
CREATE PROCEDURE sp_passenger_booking_report()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_passenger_id INT;
    DECLARE v_name VARCHAR(255);
    DECLARE v_email VARCHAR(255);
    DECLARE v_booking_count INT;
    
    DECLARE passenger_cursor CURSOR FOR
        SELECT p.passenger_id, p.name, p.email, COUNT(b.booking_id) AS bookings
        FROM passenger p
        LEFT JOIN booking b ON p.passenger_id = b.passenger_id
        GROUP BY p.passenger_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_passenger_report (
        passenger_id INT,
        name VARCHAR(255),
        email VARCHAR(255),
        booking_count INT
    );
    
    DELETE FROM temp_passenger_report;
    
    OPEN passenger_cursor;
    
    read_loop: LOOP
        FETCH passenger_cursor INTO v_passenger_id, v_name, v_email, v_booking_count;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        INSERT INTO temp_passenger_report VALUES (v_passenger_id, v_name, v_email, v_booking_count);
    END LOOP;
    
    CLOSE passenger_cursor;
    
    SELECT * FROM temp_passenger_report ORDER BY booking_count DESC;
END//
DELIMITER ;



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
        SELECT p.passenger_id, COALESCE(SUM(pay.amount), 0) AS total_spent
        FROM passenger p
        LEFT JOIN booking b ON p.passenger_id = b.passenger_id
        LEFT JOIN payment pay ON b.booking_id = pay.booking_id
        WHERE b.booking_status = 'Confirmed'
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
        
        UPDATE passenger 
        SET loyalty_points = v_points
        WHERE passenger_id = v_passenger_id;
        
        SET v_updated_count = v_updated_count + 1;
    END LOOP;
    
    -- Close cursor
    CLOSE loyalty_cursor;
    
    -- Display result
    SELECT CONCAT(v_updated_count, ' passengers updated with loyalty points') AS result;
    
    -- Show updated loyalty points
    SELECT passenger_id, name, loyalty_points 
    FROM passenger 
    WHERE loyalty_points > 0 
    ORDER BY loyalty_points DESC;
END//
DELIMITER ;




SET SQL_SAFE_UPDATES = 0;
CALL sp_passenger_booking_report();
SET SQL_SAFE_UPDATES = 1; 
