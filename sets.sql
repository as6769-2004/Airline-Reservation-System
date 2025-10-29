-- 1. UNION - Get all unique cities (departure or arrival)
SELECT city, country, 'Departure' AS type 
FROM airport 
WHERE airport_id IN (SELECT departure_airport_id FROM flight)
UNION
SELECT city, country, 'Arrival' AS type 
FROM airport 
WHERE airport_id IN (SELECT arrival_airport_id FROM flight);

-- 2. EXCEPT/MINUS - Passengers who booked but gave NO feedbacks
SELECT passenger_id, name, email 
FROM passenger
WHERE passenger_id IN (SELECT passenger_id FROM booking)
  AND passenger_id NOT IN (SELECT passenger_id FROM customer_feedback WHERE passenger_id IS NOT NULL);

