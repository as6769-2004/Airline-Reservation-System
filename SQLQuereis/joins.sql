-- =====================================================
-- 1. INNER JOIN
-- Returns only matching records from both tables
-- =====================================================
SELECT 
    b.booking_id,
    b.pnr_number,
    p.name AS passenger_name,
    p.email,
    f.flight_number,
    f.flight_name,
    f.departure_date,
    f.arrival_date,
    b.booking_status,
    b.total_amount
FROM booking b
INNER JOIN passenger p ON b.passenger_id = p.passenger_id
INNER JOIN flight f ON b.flight_id = f.flight_id;

-- =====================================================
-- 2. LEFT JOIN (LEFT OUTER JOIN)
-- Returns all records from left table and matched records from right table
-- =====================================================
SELECT 
    p.passenger_id,
    p.name,
    p.email,
    p.phone,
    b.pnr_number,
    b.booking_status,
    b.booking_date
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id;

-- =====================================================
-- 3. RIGHT JOIN (RIGHT OUTER JOIN)
-- Returns all records from right table and matched records from left table
-- =====================================================
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    f.departure_date,
    f.available_seats,
    b.pnr_number,
    b.booking_status
FROM booking b
RIGHT JOIN flight f ON b.flight_id = f.flight_id;

-- =====================================================
-- 4. FULL OUTER JOIN
-- Returns all records when there is a match in either left or right table
-- =====================================================
SELECT 
    p.passenger_id,
    p.name,
    p.email,
    b.booking_id,
    b.pnr_number,
    b.booking_status
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id
UNION
SELECT 
    p.passenger_id,
    p.name,
    p.email,
    b.booking_id,
    b.pnr_number,
    b.booking_status
FROM passenger p
RIGHT JOIN booking b ON p.passenger_id = b.passenger_id;

-- =====================================================
-- 5. CROSS JOIN (CARTESIAN PRODUCT)
-- Returns all possible combinations of rows from both tables
-- =====================================================
SELECT 
    p.name AS passenger_name,
    p.email,
    f.flight_number,
    f.flight_name,
    f.departure_date,
    f.price
FROM passenger p
CROSS JOIN flight f
LIMIT 20;  -- Limiting results as this creates many combinations

-- =====================================================
-- 6. SELF JOIN
-- Joins a table to itself
-- =====================================================
-- Example: Find flights departing from the same airport on the same date
SELECT 
    f1.flight_number AS flight1,
    f1.flight_name AS flight1_name,
    f1.departure_date AS departure_time1,
    f2.flight_number AS flight2,
    f2.flight_name AS flight2_name,
    f2.departure_date AS departure_time2,
    a.city AS departure_city,
    a.airport_name
FROM flight f1
JOIN flight f2 ON f1.departure_airport_id = f2.departure_airport_id 
               AND DATE(f1.departure_date) = DATE(f2.departure_date)
               AND f1.flight_id < f2.flight_id
JOIN airport a ON f1.departure_airport_id = a.airport_id;

-- Alternative: Find passengers with same nationality
SELECT 
    p1.passenger_id AS passenger1_id,
    p1.name AS passenger1_name,
    p2.passenger_id AS passenger2_id,
    p2.name AS passenger2_name,
    p1.nationality
FROM passenger p1
JOIN passenger p2 ON p1.nationality = p2.nationality 
                  AND p1.passenger_id < p2.passenger_id
LIMIT 20;

-- =====================================================
-- 7. NATURAL JOIN
-- Automatically joins tables based on columns with the same name
-- =====================================================
SELECT 
    passenger_id,
    name,
    email,
    pnr_number,
    booking_status,
    booking_date
FROM passenger
NATURAL JOIN booking
LIMIT 10;

-- =====================================================
-- 8. EQUI JOIN
-- Join based on equality condition (similar to INNER JOIN)
-- =====================================================
SELECT 
    p.name AS passenger_name,
    p.email,
    b.pnr_number,
    b.seat_number,
    f.flight_number,
    f.flight_name
FROM passenger p, booking b, flight f
WHERE p.passenger_id = b.passenger_id 
  AND b.flight_id = f.flight_id
LIMIT 20;

-- =====================================================
-- 9. NON-EQUI JOIN
-- Join based on conditions other than equality
-- =====================================================
-- Example: Find flights with prices within a certain range of another flight
SELECT 
    f1.flight_number AS flight1,
    f1.flight_name AS flight1_name,
    f1.price AS price1,
    f2.flight_number AS flight2,
    f2.flight_name AS flight2_name,
    f2.price AS price2,
    (f2.price - f1.price) AS price_difference
FROM flight f1
JOIN flight f2 ON f1.price < f2.price 
              AND f2.price <= f1.price + 5000
WHERE f1.flight_id < f2.flight_id
LIMIT 10;

-- Alternative: Find bookings made on different dates for same passenger
SELECT 
    b1.pnr_number AS booking1,
    b1.booking_date AS date1,
    b2.pnr_number AS booking2,
    b2.booking_date AS date2,
    p.name AS passenger_name
FROM booking b1
JOIN booking b2 ON b1.passenger_id = b2.passenger_id 
                AND b1.booking_date < b2.booking_date
JOIN passenger p ON b1.passenger_id = p.passenger_id
LIMIT 10;

-- =====================================================
-- 10. MULTIPLE TABLE JOIN (3+ tables)
-- Join multiple tables together
-- =====================================================
SELECT 
    b.pnr_number,
    b.seat_number,
    p.name AS passenger_name,
    p.phone,
    f.flight_number,
    f.flight_name,
    dep.city AS from_city,
    dep.airport_name AS from_airport,
    arr.city AS to_city,
    arr.airport_name AS to_airport,
    f.departure_date,
    f.arrival_date,
    pay.amount,
    pay.payment_method,
    pay.payment_status
FROM booking b
JOIN passenger p ON b.passenger_id = p.passenger_id
JOIN flight f ON b.flight_id = f.flight_id
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
JOIN payment pay ON b.booking_id = pay.booking_id
WHERE b.booking_status = 'Confirmed';

-- Alternative: Include aircraft and baggage information
SELECT 
    b.pnr_number,
    p.name AS passenger_name,
    f.flight_number,
    dep.city AS from_city,
    arr.city AS to_city,
    f.departure_date,
    a.aircraft_model,
    a.capacity,
    bg.weight AS baggage_weight,
    bg.baggage_type
FROM booking b
JOIN passenger p ON b.passenger_id = p.passenger_id
JOIN flight f ON b.flight_id = f.flight_id
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
JOIN aircraft a ON f.aircraft_id = a.aircraft_id
LEFT JOIN baggage bg ON b.booking_id = bg.booking_id
WHERE b.booking_status = 'Confirmed'
LIMIT 20;

-- =====================================================
-- 11. LEFT JOIN with NULL CHECK
-- Find records in left table with no match in right table
-- =====================================================
-- Example: Find flights with no bookings
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    dep.city AS from_city,
    arr.city AS to_city,
    f.departure_date,
    f.available_seats,
    f.price,
    f.status
FROM flight f
LEFT JOIN booking b ON f.flight_id = b.flight_id
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
WHERE b.booking_id IS NULL;

-- Alternative: Find passengers who never booked
SELECT 
    p.passenger_id,
    p.name,
    p.email,
    p.phone,
    p.nationality
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id
WHERE b.booking_id IS NULL;

-- =====================================================
-- 12. JOIN with GROUP BY and HAVING
-- Aggregate data while joining tables
-- =====================================================
SELECT 
    p.passenger_id,
    p.name,
    p.email,
    p.phone,
    COUNT(b.booking_id) AS total_bookings,
    SUM(b.total_amount) AS total_booking_amount,
    SUM(pay.amount) AS total_paid,
    AVG(pay.amount) AS avg_payment
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id
LEFT JOIN payment pay ON b.booking_id = pay.booking_id
GROUP BY p.passenger_id, p.name, p.email, p.phone
HAVING total_bookings > 0
ORDER BY total_paid DESC;

-- Alternative: Flight booking statistics
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    dep.city AS from_city,
    arr.city AS to_city,
    COUNT(b.booking_id) AS total_bookings,
    SUM(CASE WHEN b.booking_status = 'Confirmed' THEN 1 ELSE 0 END) AS confirmed_bookings,
    SUM(b.total_amount) AS total_revenue,
    AVG(cf.rating) AS avg_rating
FROM flight f
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
LEFT JOIN booking b ON f.flight_id = b.flight_id
LEFT JOIN customer_feedback cf ON f.flight_id = cf.flight_id
GROUP BY f.flight_id, f.flight_number, f.flight_name, dep.city, arr.city
HAVING total_bookings > 0
ORDER BY total_revenue DESC;

-- =====================================================
-- 13. JOIN with Subquery
-- Use subquery in JOIN condition
-- =====================================================
SELECT 
    p.passenger_id,
    p.name,
    p.email,
    p.phone,
    high_value.total_spent,
    high_value.booking_count
FROM passenger p
JOIN (
    SELECT 
        b.passenger_id,
        COUNT(b.booking_id) AS booking_count,
        SUM(pay.amount) AS total_spent
    FROM booking b
    JOIN payment pay ON b.booking_id = pay.booking_id
    WHERE pay.payment_status = 'Completed'
    GROUP BY b.passenger_id
    HAVING SUM(pay.amount) > 10000
) AS high_value ON p.passenger_id = high_value.passenger_id
ORDER BY high_value.total_spent DESC;

-- Alternative: Find most popular routes
SELECT 
    dep.city AS from_city,
    arr.city AS to_city,
    route_stats.total_flights,
    route_stats.total_bookings,
    route_stats.avg_price
FROM (
    SELECT 
        f.departure_airport_id,
        f.arrival_airport_id,
        COUNT(DISTINCT f.flight_id) AS total_flights,
        COUNT(b.booking_id) AS total_bookings,
        AVG(f.price) AS avg_price
    FROM flight f
    LEFT JOIN booking b ON f.flight_id = b.flight_id
    GROUP BY f.departure_airport_id, f.arrival_airport_id
    HAVING total_bookings > 5
) AS route_stats
JOIN airport dep ON route_stats.departure_airport_id = dep.airport_id
JOIN airport arr ON route_stats.arrival_airport_id = arr.airport_id
ORDER BY route_stats.total_bookings DESC;

-- =====================================================
-- 14. USING Clause (Alternative to ON)
-- Simpler syntax when column names are identical
-- =====================================================
SELECT 
    b.pnr_number,
    b.seat_number,
    b.booking_status,
    p.name AS passenger_name,
    p.email,
    f.flight_number,
    f.flight_name,
    f.departure_date
FROM booking b
JOIN passenger p USING (passenger_id)
JOIN flight f USING (flight_id)
LIMIT 10;

-- Alternative: Payment information with USING clause
SELECT 
    b.pnr_number,
    p.name AS passenger_name,
    pay.amount,
    pay.payment_method,
    pay.payment_date,
    pay.payment_status
FROM booking b
JOIN passenger p USING (passenger_id)
JOIN payment pay USING (booking_id)
WHERE pay.payment_status = 'Completed'
LIMIT 10;