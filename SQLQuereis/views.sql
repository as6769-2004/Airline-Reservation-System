-- 1. Simple View - Flight schedule with airport names
CREATE OR REPLACE VIEW vw_flight_schedule AS
SELECT 
    f.flight_id,
    f.flight_number,
    f.flight_name,
    dep.airport_code AS departure_code,
    dep.airport_name AS departure_airport,
    dep.city AS departure_city,
    arr.airport_code AS arrival_code,
    arr.airport_name AS arrival_airport,
    arr.city AS arrival_city,
    f.departure_date,
    f.arrival_date,
    f.price,
    f.available_seats,
    f.status,
    a.aircraft_model,
    a.capacity
FROM flight f
JOIN airport dep ON f.departure_airport_id = dep.airport_id
JOIN airport arr ON f.arrival_airport_id = arr.airport_id
JOIN aircraft a ON f.aircraft_id = a.aircraft_id;

SELECT * FROM vw_flight_schedule WHERE DATE(departure_date) >= '2025-11-01';

SELECT * FROM vw_flight_schedule WHERE DATE(departure_date) = '2025-11-10';

-- 2. View with Aggregation - Passenger booking summary
CREATE OR REPLACE VIEW vw_passenger_summary AS
SELECT 
    p.passenger_id,
    p.name,
    p.email,
    p.phone,
    p.aadhar,
    p.nationality,
    COUNT(b.booking_id) AS total_bookings,
    SUM(CASE WHEN b.booking_status = 'Confirmed' THEN 1 ELSE 0 END) AS confirmed_bookings,
    SUM(CASE WHEN b.booking_status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_bookings,
    SUM(b.total_amount) AS total_booking_amount,
    SUM(pay.amount) AS total_paid,
    MAX(b.booking_date) AS last_booking_date
FROM passenger p
LEFT JOIN booking b ON p.passenger_id = b.passenger_id
LEFT JOIN payment pay ON b.booking_id = pay.booking_id
GROUP BY p.passenger_id, p.name, p.email, p.phone, p.aadhar, p.nationality;

SELECT * FROM vw_passenger_summary ORDER BY total_bookings DESC;

SELECT * FROM vw_passenger_summary 
WHERE total_bookings > 0 
ORDER BY total_paid DESC 
LIMIT 10;