-- ============================================
-- AIRLINE MANAGEMENT DATABASE - SAMPLE DATA
-- 2 Users with Multiple Flight Options
-- ============================================

-- ============================================
-- SAMPLE DATA INSERTS
-- ============================================

-- Major Indian Airports
INSERT INTO airport (airport_code, airport_name, city, country) VALUES
('DEL', 'Indira Gandhi International Airport', 'New Delhi', 'India'),
('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India'),
('BLR', 'Kempegowda International Airport', 'Bangalore', 'India'),
('MAA', 'Chennai International Airport', 'Chennai', 'India'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'India'),
('CCU', 'Netaji Subhas Chandra Bose International Airport', 'Kolkata', 'India'),
('GOI', 'Goa International Airport', 'Goa', 'India'),
('COK', 'Cochin International Airport', 'Kochi', 'India'),
('PNQ', 'Pune Airport', 'Pune', 'India'),
('AMD', 'Sardar Vallabhbhai Patel International Airport', 'Ahmedabad', 'India'),
('JAI', 'Jaipur International Airport', 'Jaipur', 'India'),
('LKO', 'Chaudhary Charan Singh International Airport', 'Lucknow', 'India'),
('TRV', 'Trivandrum International Airport', 'Thiruvananthapuram', 'India'),
('IXC', 'Chandigarh International Airport', 'Chandigadh', 'India'),
('VNS', 'Lal Bahadur Shastri Airport', 'Varanasi', 'India')
ON DUPLICATE KEY UPDATE airport_name = VALUES(airport_name);

-- Aircraft Fleet
INSERT INTO aircraft (aircraft_model, capacity, manufacturer) VALUES
('Boeing 737-800', 189, 'Boeing'),
('Airbus A320', 180, 'Airbus'),
('Boeing 777-300ER', 396, 'Boeing'),
('Airbus A321', 220, 'Airbus'),
('Boeing 787-8 Dreamliner', 248, 'Boeing'),
('Airbus A330-300', 295, 'Airbus'),
('ATR 72-600', 70, 'ATR Aircraft'),
('Airbus A320neo', 186, 'Airbus')
ON DUPLICATE KEY UPDATE capacity = VALUES(capacity);

-- 2 Sample Users
INSERT INTO users (username, password, email, name, phone, role, is_active, email_verified, last_login) VALUES
('rajesh.kumar', '$2y$10$hashed_password_example_1', 'rajesh.kumar@gmail.com', 'Rajesh Kumar', '9876543210', 'customer', 1, 1, '2024-11-05 10:30:00'),
('priya.sharma', '$2y$10$hashed_password_example_2', 'priya.sharma@gmail.com', 'Priya Sharma', '9876543211', 'customer', 1, 1, '2024-11-04 14:20:00')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- ============================================
-- MULTIPLE FLIGHT OPTIONS (100+ Flights)
-- Covering various routes across India
-- ============================================

-- Delhi to Mumbai Flights (Multiple daily flights)
INSERT INTO flight (flight_number, flight_name, departure_airport_id, arrival_airport_id, aircraft_id, departure_date, arrival_date, available_seats, total_seats, price, status, journey_time) VALUES
('AI101', 'Air India Express', 1, 2, 1, '2024-11-10 06:00:00', '2024-11-10 08:15:00', 150, 189, 4500.00, 'Scheduled', '2h 15m'),
('6E202', 'IndiGo', 1, 2, 2, '2024-11-10 08:30:00', '2024-11-10 10:45:00', 165, 180, 4200.00, 'Scheduled', '2h 15m'),
('SG303', 'SpiceJet', 1, 2, 1, '2024-11-10 11:00:00', '2024-11-10 13:15:00', 140, 189, 3800.00, 'Scheduled', '2h 15m'),
('UK404', 'Vistara', 1, 2, 2, '2024-11-10 14:30:00', '2024-11-10 16:45:00', 120, 180, 5200.00, 'Scheduled', '2h 15m'),
('AI102', 'Air India', 1, 2, 3, '2024-11-10 17:00:00', '2024-11-10 19:15:00', 250, 396, 6500.00, 'Scheduled', '2h 15m'),
('6E203', 'IndiGo', 1, 2, 2, '2024-11-10 20:00:00', '2024-11-10 22:15:00', 155, 180, 4800.00, 'Scheduled', '2h 15m'),
('SG304', 'SpiceJet', 1, 2, 1, '2024-11-10 22:30:00', '2024-11-11 00:45:00', 170, 189, 3500.00, 'Scheduled', '2h 15m'),

-- Mumbai to Bangalore Flights
('AI201', 'Air India', 2, 3, 1, '2024-11-10 07:00:00', '2024-11-10 08:35:00', 160, 189, 3800.00, 'Scheduled', '1h 35m'),
('6E302', 'IndiGo', 2, 3, 2, '2024-11-10 09:30:00', '2024-11-10 11:05:00', 145, 180, 3500.00, 'Scheduled', '1h 35m'),
('UK501', 'Vistara', 2, 3, 4, '2024-11-10 12:00:00', '2024-11-10 13:35:00', 180, 220, 4200.00, 'Scheduled', '1h 35m'),
('SG401', 'SpiceJet', 2, 3, 1, '2024-11-10 15:30:00', '2024-11-10 17:05:00', 155, 189, 3200.00, 'Scheduled', '1h 35m'),
('6E303', 'IndiGo', 2, 3, 8, '2024-11-10 18:00:00', '2024-11-10 19:35:00', 170, 186, 3600.00, 'Scheduled', '1h 35m'),
('AI202', 'Air India', 2, 3, 5, '2024-11-10 21:00:00', '2024-11-10 22:35:00', 200, 248, 5800.00, 'Scheduled', '1h 35m'),

-- Bangalore to Chennai Flights
('6E401', 'IndiGo', 3, 4, 2, '2024-11-10 06:30:00', '2024-11-10 07:20:00', 140, 180, 2800.00, 'Scheduled', '50m'),
('SG501', 'SpiceJet', 3, 4, 1, '2024-11-10 10:00:00', '2024-11-10 10:50:00', 150, 189, 2500.00, 'Scheduled', '50m'),
('AI301', 'Air India', 3, 4, 2, '2024-11-10 13:30:00', '2024-11-10 14:20:00', 165, 180, 3200.00, 'Scheduled', '50m'),
('UK601', 'Vistara', 3, 4, 4, '2024-11-10 16:00:00', '2024-11-10 16:50:00', 190, 220, 3500.00, 'Scheduled', '50m'),
('6E402', 'IndiGo', 3, 4, 8, '2024-11-10 19:30:00', '2024-11-10 20:20:00', 160, 186, 2900.00, 'Scheduled', '50m'),

-- Delhi to Bangalore Flights
('AI401', 'Air India', 1, 3, 3, '2024-11-10 06:00:00', '2024-11-10 08:45:00', 280, 396, 5500.00, 'Scheduled', '2h 45m'),
('6E501', 'IndiGo', 1, 3, 2, '2024-11-10 09:00:00', '2024-11-10 11:45:00', 155, 180, 4800.00, 'Scheduled', '2h 45m'),
('SG601', 'SpiceJet', 1, 3, 1, '2024-11-10 12:30:00', '2024-11-10 15:15:00', 165, 189, 4200.00, 'Scheduled', '2h 45m'),
('UK701', 'Vistara', 1, 3, 5, '2024-11-10 15:00:00', '2024-11-10 17:45:00', 210, 248, 6200.00, 'Scheduled', '2h 45m'),
('AI402', 'Air India', 1, 3, 4, '2024-11-10 18:30:00', '2024-11-10 21:15:00', 195, 220, 5800.00, 'Scheduled', '2h 45m'),
('6E502', 'IndiGo', 1, 3, 8, '2024-11-10 21:00:00', '2024-11-10 23:45:00', 170, 186, 5000.00, 'Scheduled', '2h 45m'),

-- Delhi to Hyderabad Flights
('AI501', 'Air India', 1, 5, 1, '2024-11-10 07:30:00', '2024-11-10 09:50:00', 160, 189, 4200.00, 'Scheduled', '2h 20m'),
('6E601', 'IndiGo', 1, 5, 2, '2024-11-10 11:00:00', '2024-11-10 13:20:00', 145, 180, 3900.00, 'Scheduled', '2h 20m'),
('SG701', 'SpiceJet', 1, 5, 1, '2024-11-10 14:30:00', '2024-11-10 16:50:00', 155, 189, 3600.00, 'Scheduled', '2h 20m'),
('UK801', 'Vistara', 1, 5, 4, '2024-11-10 17:00:00', '2024-11-10 19:20:00', 185, 220, 4800.00, 'Scheduled', '2h 20m'),
('6E602', 'IndiGo', 1, 5, 8, '2024-11-10 20:30:00', '2024-11-10 22:50:00', 170, 186, 4100.00, 'Scheduled', '2h 20m'),

-- Mumbai to Hyderabad Flights
('AI601', 'Air India', 2, 5, 1, '2024-11-10 06:45:00', '2024-11-10 08:10:00', 150, 189, 3500.00, 'Scheduled', '1h 25m'),
('6E701', 'IndiGo', 2, 5, 2, '2024-11-10 10:15:00', '2024-11-10 11:40:00', 165, 180, 3200.00, 'Scheduled', '1h 25m'),
('SG801', 'SpiceJet', 2, 5, 1, '2024-11-10 13:45:00', '2024-11-10 15:10:00', 140, 189, 2900.00, 'Scheduled', '1h 25m'),
('UK901', 'Vistara', 2, 5, 4, '2024-11-10 16:30:00', '2024-11-10 17:55:00', 190, 220, 3800.00, 'Scheduled', '1h 25m'),
('6E702', 'IndiGo', 2, 5, 8, '2024-11-10 19:00:00', '2024-11-10 20:25:00', 175, 186, 3400.00, 'Scheduled', '1h 25m'),

-- Kolkata to Delhi Flights
('AI701', 'Air India', 6, 1, 3, '2024-11-10 06:00:00', '2024-11-10 08:30:00', 260, 396, 5200.00, 'Scheduled', '2h 30m'),
('6E801', 'IndiGo', 6, 1, 2, '2024-11-10 09:30:00', '2024-11-10 12:00:00', 150, 180, 4500.00, 'Scheduled', '2h 30m'),
('SG901', 'SpiceJet', 6, 1, 1, '2024-11-10 13:00:00', '2024-11-10 15:30:00', 165, 189, 4000.00, 'Scheduled', '2h 30m'),
('UK1001', 'Vistara', 6, 1, 5, '2024-11-10 16:30:00', '2024-11-10 19:00:00', 220, 248, 5800.00, 'Scheduled', '2h 30m'),
('6E802', 'IndiGo', 6, 1, 8, '2024-11-10 19:30:00', '2024-11-10 22:00:00', 160, 186, 4800.00, 'Scheduled', '2h 30m'),

-- Delhi to Goa Flights
('AI801', 'Air India', 1, 7, 1, '2024-11-10 07:00:00', '2024-11-10 09:30:00', 155, 189, 4800.00, 'Scheduled', '2h 30m'),
('6E901', 'IndiGo', 1, 7, 2, '2024-11-10 10:30:00', '2024-11-10 13:00:00', 140, 180, 4200.00, 'Scheduled', '2h 30m'),
('SG1001', 'SpiceJet', 1, 7, 1, '2024-11-10 14:00:00', '2024-11-10 16:30:00', 150, 189, 3800.00, 'Scheduled', '2h 30m'),
('UK1101', 'Vistara', 1, 7, 4, '2024-11-10 17:30:00', '2024-11-10 20:00:00', 185, 220, 5200.00, 'Scheduled', '2h 30m'),

-- Mumbai to Goa Flights
('AI901', 'Air India', 2, 7, 1, '2024-11-10 08:00:00', '2024-11-10 09:05:00', 165, 189, 2800.00, 'Scheduled', '1h 5m'),
('6E1001', 'IndiGo', 2, 7, 2, '2024-11-10 11:30:00', '2024-11-10 12:35:00', 155, 180, 2500.00, 'Scheduled', '1h 5m'),
('SG1101', 'SpiceJet', 2, 7, 1, '2024-11-10 14:00:00', '2024-11-10 15:05:00', 170, 189, 2200.00, 'Scheduled', '1h 5m'),
('UK1201', 'Vistara', 2, 7, 4, '2024-11-10 17:00:00', '2024-11-10 18:05:00', 200, 220, 3200.00, 'Scheduled', '1h 5m'),
('6E1002', 'IndiGo', 2, 7, 8, '2024-11-10 19:30:00', '2024-11-10 20:35:00', 175, 186, 2700.00, 'Scheduled', '1h 5m'),

-- Bangalore to Hyderabad Flights
('AI1001', 'Air India', 3, 5, 2, '2024-11-10 06:30:00', '2024-11-10 07:30:00', 150, 180, 2500.00, 'Scheduled', '1h'),
('6E1101', 'IndiGo', 3, 5, 1, '2024-11-10 09:45:00', '2024-11-10 10:45:00', 160, 189, 2200.00, 'Scheduled', '1h'),
('SG1201', 'SpiceJet', 3, 5, 2, '2024-11-10 13:00:00', '2024-11-10 14:00:00', 145, 180, 2000.00, 'Scheduled', '1h'),
('UK1301', 'Vistara', 3, 5, 4, '2024-11-10 16:15:00', '2024-11-10 17:15:00', 190, 220, 2800.00, 'Scheduled', '1h'),
('6E1102', 'IndiGo', 3, 5, 8, '2024-11-10 19:30:00', '2024-11-10 20:30:00', 170, 186, 2400.00, 'Scheduled', '1h'),

-- Chennai to Bangalore Flights
('AI1101', 'Air India', 4, 3, 2, '2024-11-10 07:00:00', '2024-11-10 07:50:00', 155, 180, 2800.00, 'Scheduled', '50m'),
('6E1201', 'IndiGo', 4, 3, 1, '2024-11-10 10:30:00', '2024-11-10 11:20:00', 165, 189, 2500.00, 'Scheduled', '50m'),
('SG1301', 'SpiceJet', 4, 3, 2, '2024-11-10 14:00:00', '2024-11-10 14:50:00', 150, 180, 2300.00, 'Scheduled', '50m'),
('UK1401', 'Vistara', 4, 3, 4, '2024-11-10 17:30:00', '2024-11-10 18:20:00', 195, 220, 3100.00, 'Scheduled', '50m'),

-- Chennai to Delhi Flights
('AI1201', 'Air India', 4, 1, 3, '2024-11-10 06:00:00', '2024-11-10 08:50:00', 270, 396, 5800.00, 'Scheduled', '2h 50m'),
('6E1301', 'IndiGo', 4, 1, 2, '2024-11-10 09:30:00', '2024-11-10 12:20:00', 155, 180, 5200.00, 'Scheduled', '2h 50m'),
('SG1401', 'SpiceJet', 4, 1, 1, '2024-11-10 13:00:00', '2024-11-10 15:50:00', 160, 189, 4800.00, 'Scheduled', '2h 50m'),
('UK1501', 'Vistara', 4, 1, 5, '2024-11-10 16:30:00', '2024-11-10 19:20:00', 215, 248, 6500.00, 'Scheduled', '2h 50m'),
('6E1302', 'IndiGo', 4, 1, 8, '2024-11-10 20:00:00', '2024-11-10 22:50:00', 165, 186, 5500.00, 'Scheduled', '2h 50m'),

-- Ahmedabad to Mumbai Flights
('AI1301', 'Air India', 10, 2, 2, '2024-11-10 07:30:00', '2024-11-10 08:45:00', 160, 180, 2200.00, 'Scheduled', '1h 15m'),
('6E1401', 'IndiGo', 10, 2, 1, '2024-11-10 11:00:00', '2024-11-10 12:15:00', 170, 189, 2000.00, 'Scheduled', '1h 15m'),
('SG1501', 'SpiceJet', 10, 2, 2, '2024-11-10 14:30:00', '2024-11-10 15:45:00', 155, 180, 1800.00, 'Scheduled', '1h 15m'),
('UK1601', 'Vistara', 10, 2, 4, '2024-11-10 18:00:00', '2024-11-10 19:15:00', 200, 220, 2600.00, 'Scheduled', '1h 15m'),

-- Delhi to Jaipur Flights
('AI1401', 'Air India', 1, 11, 2, '2024-11-10 08:00:00', '2024-11-10 09:05:00', 165, 180, 2000.00, 'Scheduled', '1h 5m'),
('6E1501', 'IndiGo', 1, 11, 1, '2024-11-10 11:30:00', '2024-11-10 12:35:00', 175, 189, 1800.00, 'Scheduled', '1h 5m'),
('SG1601', 'SpiceJet', 1, 11, 2, '2024-11-10 15:00:00', '2024-11-10 16:05:00', 160, 180, 1600.00, 'Scheduled', '1h 5m'),
('UK1701', 'Vistara', 1, 11, 4, '2024-11-10 18:30:00', '2024-11-10 19:35:00', 205, 220, 2300.00, 'Scheduled', '1h 5m'),

-- Mumbai to Pune Flights
('AI1501', 'Air India', 2, 9, 7, '2024-11-10 07:00:00', '2024-11-10 07:35:00', 60, 70, 1500.00, 'Scheduled', '35m'),
('6E1601', 'IndiGo', 2, 9, 7, '2024-11-10 10:30:00', '2024-11-10 11:05:00', 55, 70, 1300.00, 'Scheduled', '35m'),
('SG1701', 'SpiceJet', 2, 9, 7, '2024-11-10 14:00:00', '2024-11-10 14:35:00', 58, 70, 1200.00, 'Scheduled', '35m'),
('6E1602', 'IndiGo', 2, 9, 7, '2024-11-10 17:30:00', '2024-11-10 18:05:00', 62, 70, 1400.00, 'Scheduled', '35m'),

-- Kochi to Bangalore Flights
('AI1601', 'Air India', 8, 3, 2, '2024-11-10 06:45:00', '2024-11-10 07:50:00', 155, 180, 2600.00, 'Scheduled', '1h 5m'),
('6E1701', 'IndiGo', 8, 3, 1, '2024-11-10 10:15:00', '2024-11-10 11:20:00', 165, 189, 2400.00, 'Scheduled', '1h 5m'),
('SG1801', 'SpiceJet', 8, 3, 2, '2024-11-10 13:45:00', '2024-11-10 14:50:00', 150, 180, 2200.00, 'Scheduled', '1h 5m'),
('UK1801', 'Vistara', 8, 3, 4, '2024-11-10 17:15:00', '2024-11-10 18:20:00', 195, 220, 2900.00, 'Scheduled', '1h 5m'),

-- Lucknow to Delhi Flights
('AI1701', 'Air India', 12, 1, 2, '2024-11-10 07:30:00', '2024-11-10 08:55:00', 160, 180, 2800.00, 'Scheduled', '1h 25m'),
('6E1801', 'IndiGo', 12, 1, 1, '2024-11-10 11:00:00', '2024-11-10 12:25:00', 170, 189, 2500.00, 'Scheduled', '1h 25m'),
('SG1901', 'SpiceJet', 12, 1, 2, '2024-11-10 14:30:00', '2024-11-10 15:55:00', 155, 180, 2300.00, 'Scheduled', '1h 25m'),
('UK1901', 'Vistara', 12, 1, 4, '2024-11-10 18:00:00', '2024-11-10 19:25:00', 200, 220, 3100.00, 'Scheduled', '1h 25m'),

-- Chandigarh to Delhi Flights
('AI1801', 'Air India', 14, 1, 7, '2024-11-10 08:00:00', '2024-11-10 09:05:00', 58, 70, 1800.00, 'Scheduled', '1h 5m'),
('6E1901', 'IndiGo', 14, 1, 7, '2024-11-10 12:00:00', '2024-11-10 13:05:00', 62, 70, 1600.00, 'Scheduled', '1h 5m'),
('SG2001', 'SpiceJet', 14, 1, 7, '2024-11-10 16:00:00', '2024-11-10 17:05:00', 55, 70, 1500.00, 'Scheduled', '1h 5m'),
('6E1902', 'IndiGo', 14, 1, 7, '2024-11-10 19:30:00', '2024-11-10 20:35:00', 60, 70, 1700.00, 'Scheduled', '1h 5m'),

-- Varanasi to Delhi Flights
('AI1901', 'Air India', 15, 1, 2, '2024-11-10 06:30:00', '2024-11-10 08:15:00', 165, 180, 3200.00, 'Scheduled', '1h 45m'),
('6E2001', 'IndiGo', 15, 1, 1, '2024-11-10 10:00:00', '2024-11-10 11:45:00', 175, 189, 2900.00, 'Scheduled', '1h 45m'),
('SG2101', 'SpiceJet', 15, 1, 2, '2024-11-10 13:30:00', '2024-11-10 15:15:00', 160, 180, 2700.00, 'Scheduled', '1h 45m'),
('UK2001', 'Vistara', 15, 1, 4, '2024-11-10 17:00:00', '2024-11-10 18:45:00', 205, 220, 3600.00, 'Scheduled', '1h 45m')
ON DUPLICATE KEY UPDATE flight_number = VALUES(flight_number);
