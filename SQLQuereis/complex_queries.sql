
-- =====================================================
-- 1. Find airports with the most connections (departures + arrivals)
-- =====================================================
SELECT 
    a.airport_id,
    a.airport_code,
    a.airport_name,
    a.city,
    a.country,
    COUNT(DISTINCT f1.flight_id) AS departure_flights,
    COUNT(DISTINCT f2.flight_id) AS arrival_flights,
    (COUNT(DISTINCT f1.flight_id) + COUNT(DISTINCT f2.flight_id)) AS total_flights,
    ROUND((COUNT(DISTINCT f1.flight_id) * 100.0) / 
          (COUNT(DISTINCT f1.flight_id) + COUNT(DISTINCT f2.flight_id)), 2) AS departure_percentage
FROM airport a
LEFT JOIN flight f1 ON a.airport_id = f1.departure_airport_id
LEFT JOIN flight f2 ON a.airport_id = f2.arrival_airport_id
GROUP BY a.airport_id, a.airport_code, a.airport_name, a.city, a.country
HAVING total_flights > 0
ORDER BY total_flights DESC
LIMIT 10;

-- =====================================================
-- 2. Find flights with lowest occupancy rate
-- =====================================================
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    dep.city AS departure_city,
    arr.city AS arrival_city,
    f.departure_date,
    ac.aircraft_model,
    ac.manufacturer,
    ac.capacity AS total_capacity,
    COUNT(b.booking_id) AS booked_seats,
    f.available_seats,
    ROUND((COUNT(b.booking_id) * 100.0 / ac.capacity), 2) AS occupancy_percentage,
    (ac.capacity - COUNT(b.booking_id)) AS empty_seats,
    f.price,
    (f.price * COUNT(b.booking_id)) AS current_revenue,
    (f.price * ac.capacity) AS potential_revenue
FROM flight f
JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
LEFT JOIN booking b ON f.flight_id = b.flight_id AND b.booking_status = 'Confirmed'
GROUP BY f.flight_id, f.flight_number, f.flight_name, dep.city, arr.city, 
         f.departure_date, ac.aircraft_model, ac.manufacturer, ac.capacity, 
         f.available_seats, f.price
HAVING occupancy_percentage < 50
ORDER BY occupancy_percentage ASC;


-- 3. Find most popular routes by booking count
SELECT 
    dep.city AS departure_city,
    dep.airport_code AS dep_code,
    arr.city AS arrival_city,
    arr.airport_code AS arr_code,
    COUNT(DISTINCT f.flight_id) AS total_flights,
    COUNT(b.booking_id) AS total_bookings,
    ROUND(AVG(f.price), 2) AS avg_price,
    SUM(CASE WHEN b.booking_status = 'Confirmed' THEN 1 ELSE 0 END) AS confirmed_bookings,
    ROUND((COUNT(b.booking_id) * 1.0 / COUNT(DISTINCT f.flight_id)), 2) AS avg_bookings_per_flight
FROM flight f
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
LEFT JOIN booking b ON f.flight_id = b.flight_id
GROUP BY dep.city, dep.airport_code, arr.city, arr.airport_code
HAVING total_bookings > 0
ORDER BY total_bookings DESC
LIMIT 10;

-- 4. Find flights with highest revenue per seat
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    dep.city AS from_city,
    arr.city AS to_city,
    f.price,
    ac.capacity,
    COUNT(b.booking_id) AS booked_seats,
    SUM(COALESCE(pay.amount, 0)) AS total_revenue,
    ROUND(SUM(COALESCE(pay.amount, 0)) / COUNT(b.booking_id), 2) AS revenue_per_booked_seat,
    ROUND(SUM(COALESCE(pay.amount, 0)) / ac.capacity, 2) AS revenue_per_total_seat
FROM flight f
JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
LEFT JOIN booking b ON f.flight_id = b.flight_id AND b.booking_status = 'Confirmed'
LEFT JOIN payment pay ON b.booking_id = pay.booking_id AND pay.payment_status = 'Completed'
GROUP BY f.flight_id, f.flight_number, f.flight_name, dep.city, arr.city, f.price, ac.capacity
HAVING booked_seats > 0
ORDER BY revenue_per_booked_seat DESC
LIMIT 10;

-- 5. Find peak booking days
SELECT 
    DATE(b.booking_date) AS booking_day,
    DAYNAME(b.booking_date) AS day_of_week,
    COUNT(b.booking_id) AS total_bookings,
    COUNT(DISTINCT b.passenger_id) AS unique_passengers,
    SUM(b.total_amount) AS total_booking_value,
    ROUND(AVG(b.total_amount), 2) AS avg_booking_value
FROM booking b
WHERE b.booking_status = 'Confirmed'
GROUP BY DATE(b.booking_date), DAYNAME(b.booking_date)
ORDER BY total_bookings DESC
LIMIT 10;

-- 6. Find flights that need price adjustment (low occupancy, high price)
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    dep.city AS from_city,
    arr.city AS to_city,
    f.departure_date,
    f.price,
    ac.capacity,
    COUNT(b.booking_id) AS booked_seats,
    ROUND((COUNT(b.booking_id) * 100.0 / ac.capacity), 2) AS occupancy_rate,
    CASE 
        WHEN f.price > (SELECT AVG(price) FROM flight) AND 
             (COUNT(b.booking_id) * 100.0 / ac.capacity) < 40 THEN 'Reduce Price'
        WHEN f.price < (SELECT AVG(price) FROM flight) AND 
             (COUNT(b.booking_id) * 100.0 / ac.capacity) > 80 THEN 'Increase Price'
        ELSE 'Maintain Price'
    END AS price_recommendation
FROM flight f
JOIN aircraft ac ON f.aircraft_id = ac.aircraft_id
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
LEFT JOIN booking b ON f.flight_id = b.flight_id AND b.booking_status = 'Confirmed'
WHERE f.departure_date > NOW()
GROUP BY f.flight_id, f.flight_number, f.flight_name, dep.city, arr.city, 
         f.departure_date, f.price, ac.capacity
ORDER BY occupancy_rate ASC;