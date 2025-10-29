-- 1. Find passengers who have booked international flights (crossing countries)

SELECT DISTINCT 
    p.name, 
    p.email, 
    f.flight_number,
    dep_airport.city AS departure_city,
    dep_airport.country AS departure_country,
    arr_airport.city AS arrival_city,
    arr_airport.country AS arrival_country,
    f.price
FROM passenger p
JOIN booking b ON p.passenger_id = b.passenger_id
JOIN flight f ON b.flight_id = f.flight_id
JOIN airport dep_airport ON f.departure_airport_id = dep_airport.airport_id
JOIN airport arr_airport ON f.arrival_airport_id = arr_airport.airport_id
WHERE dep_airport.country != arr_airport.country
ORDER BY f.price DESC;


SELECT 
    f.flight_number,
    f.flight_name,
    f.price,
    COUNT(b.booking_id) AS total_bookings,
    f.available_seats,
    (f.price * COUNT(b.booking_id)) AS total_revenue
FROM flight f
LEFT JOIN booking b ON f.flight_id = b.flight_id
WHERE f.price > (SELECT AVG(price) FROM flight)
GROUP BY f.flight_id
HAVING COUNT(b.booking_id) > 0
ORDER BY total_revenue DESC;

-- 3. Find passengers who have spent more than the average booking amount

SELECT 
    p.passenger_id,
    p.name,
    p.email,
    COUNT(b.booking_id) AS total_bookings,
    SUM(pay.amount) AS total_spent,
    AVG(pay.amount) AS avg_per_booking
FROM passenger p
JOIN booking b ON p.passenger_id = b.passenger_id
JOIN payment pay ON b.booking_id = pay.booking_id
GROUP BY p.passenger_id
HAVING SUM(pay.amount) > (SELECT AVG(amount) FROM payment)
ORDER BY total_spent DESC;

-- 4. Find airports with the most connections (departures + arrivals)

SELECT 
    a.airport_name,
    a.city,
    a.country,
    COUNT(DISTINCT f1.flight_id) AS departure_flights,
    COUNT(DISTINCT f2.flight_id) AS arrival_flights,
    (COUNT(DISTINCT f1.flight_id) + COUNT(DISTINCT f2.flight_id)) AS total_flights
FROM airport a
LEFT JOIN flight f1 ON a.airport_id = f1.departure_airport_id
LEFT JOIN flight f2 ON a.airport_id = f2.arrival_airport_id
GROUP BY a.airport_id
ORDER BY total_flights DESC
LIMIT 10;

-- 5. Find flights with lowest occupancy rate

SELECT 
    f.flight_number,
    f.flight_name,
    ac.aircraft_model,
    ac.capacity AS total_capacity,
    COUNT(b.booking_id) AS booked_seats,
    (COUNT(b.booking_id) * 100.0 / ac.capacity) AS occupancy_percentage,
    (ac.capacity - COUNT(b.booking_id)) AS empty_seats
FROM flight f
JOIN flight_aircraft fa ON f.flight_id = fa.flight_id
JOIN aircraft ac ON fa.aircraft_id = ac.aircraft_id
LEFT JOIN booking b ON f.flight_id = b.flight_id AND b.booking_status = 'Confirmed'
GROUP BY f.flight_id, ac.aircraft_id
HAVING occupancy_percentage < 50
ORDER BY occupancy_percentage ASC;
