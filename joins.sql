-- 1. INNER JOIN
-- Returns only matching records from both tables

SELECT 
    b.booking_id,
    b.pnr_number,
    p.name AS passenger_name,
    f.flight_number,
    f.travel_date
FROM booking b
INNER JOIN passenger p ON b.passenger_id = p.passenger_id
INNER JOIN flight f ON b.flight_id = f.flight_id;


-- 2. LEFT JOIN (LEFT OUTER JOIN)
-- Returns all records from left table and matched records from right table

SELECT 
    p.passenger_id,
    p.name,
    p.email,
    b.pnr_number,
    b.booking_status
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id;


-- 3. RIGHT JOIN (RIGHT OUTER JOIN)
-- Returns all records from right table and matched records from left table

SELECT 
    f.flight_id,
    f.flight_number,
    f.travel_date,
    b.pnr_number,
    b.booking_status
FROM booking b
RIGHT JOIN flight f ON b.flight_id = f.flight_id;


-- 4. FULL OUTER JOIN
-- Returns all records when there is a match in either left or right table

SELECT 
    p.passenger_id,
    p.name,
    b.booking_id,
    b.pnr_number
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id
UNION
SELECT 
    p.passenger_id,
    p.name,
    b.booking_id,
    b.pnr_number
FROM passenger p
RIGHT JOIN booking b ON p.passenger_id = b.passenger_id;


-- 5. CROSS JOIN (CARTESIAN PRODUCT)
-- Returns all possible combinations of rows from both tables


SELECT 
    p.name AS passenger_name,
    f.flight_number,
    f.travel_date
FROM passenger p
CROSS JOIN flight f
LIMIT 20;  -- Limiting results as this creates many combinations



-- 6. SELF JOIN
-- Joins a table to itself


-- Example: Find flights departing from the same airport on the same date
SELECT 
    f1.flight_number AS flight1,
    f2.flight_number AS flight2,
    a.city AS departure_city,
    f1.travel_date
FROM flight f1
JOIN flight f2 ON f1.departure_airport_id = f2.departure_airport_id 
               AND f1.travel_date = f2.travel_date 
               AND f1.flight_id < f2.flight_id
JOIN airport a ON f1.departure_airport_id = a.airport_id;



-- 7. NATURAL JOIN
-- Automatically joins tables based on columns with the same name


SELECT 
    passenger_id,
    name,
    pnr_number,
    booking_status
FROM passenger
NATURAL JOIN booking
LIMIT 10;



-- 8. EQUI JOIN
-- Join based on equality condition (similar to INNER JOIN)


SELECT 
    p.name,
    b.pnr_number,
    f.flight_number
FROM passenger p, booking b, flight f
WHERE p.passenger_id = b.passenger_id 
  AND b.flight_id = f.flight_id;



-- 9. NON-EQUI JOIN
-- Join based on conditions other than equality


-- Example: Find flights with prices within a certain range of another flight
SELECT 
    f1.flight_number AS flight1,
    f1.price AS price1,
    f2.flight_number AS flight2,
    f2.price AS price2
FROM flight f1
JOIN flight f2 ON f1.price < f2.price 
              AND f2.price <= f1.price + 5000
WHERE f1.flight_id < f2.flight_id
LIMIT 10;



-- 10. MULTIPLE TABLE JOIN (3+ tables)
-- Join multiple tables together


SELECT 
    b.pnr_number,
    p.name AS passenger_name,
    f.flight_number,
    dep.city AS from_city,
    arr.city AS to_city,
    f.travel_date,
    pay.amount,
    pay.payment_method
FROM booking b
JOIN passenger p ON b.passenger_id = p.passenger_id
JOIN flight f ON b.flight_id = f.flight_id
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
JOIN payment pay ON b.booking_id = pay.booking_id
WHERE b.booking_status = 'Confirmed';



-- 11. LEFT JOIN with NULL CHECK
-- Find records in left table with no match in right table


-- Example: Find flights with no bookings
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    f.travel_date,
    f.available_seats
FROM flight f
LEFT JOIN booking b ON f.flight_id = b.flight_id
WHERE b.booking_id IS NULL;



-- 12. JOIN with GROUP BY and HAVING
-- Aggregate data while joining tables


SELECT 
    p.passenger_id,
    p.name,
    p.email,
    COUNT(b.booking_id) AS total_bookings,
    SUM(pay.amount) AS total_spent
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id
LEFT JOIN payment pay ON b.booking_id = pay.booking_id
GROUP BY p.passenger_id
HAVING total_bookings > 0
ORDER BY total_spent DESC;


-- 13. JOIN with Subquery
-- Use subquery in JOIN condition

SELECT 
    p.name,
    p.email,
    high_value.total_spent
FROM passenger p
JOIN (
    SELECT 
        b.passenger_id,
        SUM(pay.amount) AS total_spent
    FROM booking b
    JOIN payment pay ON b.booking_id = pay.booking_id
    GROUP BY b.passenger_id
    HAVING SUM(pay.amount) > 10000
) AS high_value ON p.passenger_id = high_value.passenger_id;

-- 14. USING Clause (Alternative to ON)
-- Simpler syntax when column names are identical

SELECT 
    b.pnr_number,
    p.name,
    f.flight_number
FROM booking b
JOIN passenger p USING (passenger_id)
JOIN flight f USING (flight_id)
LIMIT 10;

