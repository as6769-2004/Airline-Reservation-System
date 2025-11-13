-- =====================================================
-- QUERY 1: UNION - Get all unique cities (departure or arrival)
-- =====================================================
SELECT DISTINCT
    city, 
    country, 
    airport_code,
    airport_name,
    'Departure' AS type 
FROM airport 
WHERE airport_id IN (SELECT DISTINCT departure_airport_id FROM flight)
UNION
SELECT DISTINCT
    city, 
    country, 
    airport_code,
    airport_name,
    'Arrival' AS type 
FROM airport 
WHERE airport_id IN (SELECT DISTINCT arrival_airport_id FROM flight)
ORDER BY city;

-- Alternative: Get cities that serve as BOTH departure and arrival
SELECT DISTINCT
    city, 
    country, 
    airport_code,
    airport_name,
    'Both Departure & Arrival' AS type 
FROM airport 
WHERE airport_id IN (SELECT DISTINCT departure_airport_id FROM flight)
  AND airport_id IN (SELECT DISTINCT arrival_airport_id FROM flight)
ORDER BY city;

-- Get all active airports with flight counts
SELECT 
    a.city, 
    a.country, 
    a.airport_code,
    a.airport_name,
    COUNT(DISTINCT CASE WHEN f.departure_airport_id = a.airport_id THEN f.flight_id END) AS departure_flights,
    COUNT(DISTINCT CASE WHEN f.arrival_airport_id = a.airport_id THEN f.flight_id END) AS arrival_flights,
    COUNT(DISTINCT f.flight_id) AS total_flights
FROM airport a
LEFT JOIN flight f ON a.airport_id = f.departure_airport_id OR a.airport_id = f.arrival_airport_id
GROUP BY a.airport_id, a.city, a.country, a.airport_code, a.airport_name
HAVING total_flights > 0
ORDER BY total_flights DESC;

-- =====================================================
-- QUERY 2: EXCEPT/MINUS - Passengers who booked but gave NO feedback
-- =====================================================
SELECT 
    p.passenger_id, 
    p.name, 
    p.email,
    p.phone,
    p.aadhar,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    COUNT(DISTINCT b.flight_id) AS flights_taken
FROM passenger p
INNER JOIN booking b ON p.passenger_id = b.passenger_id
WHERE p.passenger_id NOT IN (
    SELECT DISTINCT passenger_id 
    FROM customer_feedback 
    WHERE passenger_id IS NOT NULL
)
GROUP BY p.passenger_id, p.name, p.email, p.phone, p.aadhar
ORDER BY total_bookings DESC;

-- Alternative: Using LEFT JOIN method (more efficient)
SELECT 
    p.passenger_id, 
    p.name, 
    p.email,
    p.phone,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    COUNT(DISTINCT b.flight_id) AS flights_taken
FROM passenger p
INNER JOIN booking b ON p.passenger_id = b.passenger_id
LEFT JOIN customer_feedback cf ON p.passenger_id = cf.passenger_id
WHERE cf.feedback_id IS NULL
GROUP BY p.passenger_id, p.name, p.email, p.phone
ORDER BY total_bookings DESC;

-- =====================================================
-- BONUS QUERIES
-- =====================================================

-- Passengers who booked AND gave feedback
SELECT 
    p.passenger_id, 
    p.name, 
    p.email,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    COUNT(DISTINCT cf.feedback_id) AS feedback_count,
    AVG(cf.rating) AS average_rating
FROM passenger p
INNER JOIN booking b ON p.passenger_id = b.passenger_id
INNER JOIN customer_feedback cf ON p.passenger_id = cf.passenger_id
GROUP BY p.passenger_id, p.name, p.email
ORDER BY feedback_count DESC;

-- Flights without any feedback
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    dep.city AS departure_city,
    arr.city AS arrival_city,
    f.departure_date,
    COUNT(DISTINCT b.booking_id) AS total_bookings
FROM flight f
LEFT JOIN airport dep ON f.departure_airport_id = dep.airport_id
LEFT JOIN airport arr ON f.arrival_airport_id = arr.airport_id
LEFT JOIN booking b ON f.flight_id = b.flight_id
LEFT JOIN customer_feedback cf ON f.flight_id = cf.flight_id
WHERE cf.feedback_id IS NULL
  AND b.booking_id IS NOT NULL
GROUP BY f.flight_id, f.flight_number, f.flight_name, dep.city, arr.city, f.departure_date
ORDER BY total_bookings DESC;

-- Passengers who never booked
SELECT 
    p.passenger_id, 
    p.name, 
    p.email,
    p.phone,
    p.date_of_birth
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id
WHERE b.booking_id IS NULL;

-- Cities with no departure flights (only arrival)
SELECT 
    a.city, 
    a.country, 
    a.airport_code,
    a.airport_name
FROM airport a
WHERE a.airport_id IN (SELECT DISTINCT arrival_airport_id FROM flight)
  AND a.airport_id NOT IN (SELECT DISTINCT departure_airport_id FROM flight);

-- Cities with no arrival flights (only departure)
SELECT 
    a.city, 
    a.country, 
    a.airport_code,
    a.airport_name
FROM airport a
WHERE a.airport_id IN (SELECT DISTINCT departure_airport_id FROM flight)
  AND a.airport_id NOT IN (SELECT DISTINCT arrival_airport_id FROM flight);