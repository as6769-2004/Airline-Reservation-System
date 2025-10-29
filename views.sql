
-- 1. Simple View - Flight schedule with airport names
CREATE OR REPLACE VIEW vw_flight_schedule AS
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    dep.city AS departure_city,
    arr.city AS arrival_city,
    f.travel_date,
    f.price,
    f.available_seats
FROM flight f
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id;

-- Query the views
SELECT * FROM vw_flight_schedule WHERE travel_date >= '2025-11-01';


-- 2. View with Aggregation - Passenger b ooking summary
CREATE OR REPLACE VIEW vw_passenger_summary AS
SELECT 
    p.passenger_id,
    p.name,
    p.email,
    p.phone,
    COUNT(b.booking_id) AS total_bookings,
    SUM(CASE WHEN b.booking_status = 'Confirmed' THEN 1 ELSE 0 END) AS confirmed_bookings,
    SUM(pay.amount) AS total_spent
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id
LEFT JOIN payment pay ON b.booking_id = pay.booking_id
GROUP BY p.passenger_id;
