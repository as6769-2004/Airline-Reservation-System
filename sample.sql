-- Insert data into the passenger table
INSERT INTO passenger (name, aadhar, nationality, address, gender, phone) VALUES 
('Amit Kumar', '123456789012', 'Indian', '123 MG Road, Bengaluru, Karnataka', 'Male', '9876543210'),
('Priya Sharma', '987654321098', 'Indian', '456 South Street, Mumbai, Maharashtra', 'Female', '8765432109'),
('Rahul Singh', '345678901234', 'Indian', '789 North Avenue, Jaipur, Rajasthan', 'Male', '7654321098'),
('Anita Desai', '234567890123', 'Indian', '12 Gandhi Nagar, Pune, Maharashtra', 'Female', '6543210987'),
('Ravi Verma', '456789012345', 'Indian', '34 Lake Road, Kolkata, West Bengal', 'Male', '5432109876');

-- Insert data into the flight table
INSERT INTO flight (flight_number, flight_name, departure, arrival, travel_date, available_seats, price, journey_time, arrival_date, departure_date) VALUES
('AI302', 'Air India Express', 'Bengaluru', 'Delhi', '2024-11-10', 100, 5000.00, '2h 30m', '2024-11-10', '2024-11-10'),
('6E102', 'IndiGo', 'Mumbai', 'Hyderabad', '2024-11-12', 120, 4000.00, '1h 20m', '2024-11-12', '2024-11-12'),
('SG501', 'SpiceJet', 'Jaipur', 'Goa', '2024-11-15', 80, 5500.00, '2h 15m', '2024-11-15', '2024-11-15'),
('UK809', 'Vistara', 'Pune', 'Chennai', '2024-11-18', 150, 6000.00, '1h 40m', '2024-11-18', '2024-11-18'),
('G897', 'GoAir', 'Kolkata', 'Ahmedabad', '2024-11-20', 90, 4800.00, '2h 10m', '2024-11-20', '2024-11-20');

-- Insert data into the booking table
INSERT INTO booking (flight_id, flight_name, departure, arrival, pnr_number, aadhar) VALUES
(1, 'Air India Express', 'Bengaluru', 'Delhi', 'PNR123456', '123456789012'),
(2, 'IndiGo', 'Mumbai', 'Hyderabad', 'PNR987654', '987654321098'),
(3, 'SpiceJet', 'Jaipur', 'Goa', 'PNR345678', '345678901234'),
(4, 'Vistara', 'Pune', 'Chennai', 'PNR234567', '234567890123'),
(5, 'GoAir', 'Kolkata', 'Ahmedabad', 'PNR456789', '456789012345');

-- Insert data into the login table
INSERT INTO login (username, password) VALUES
('admin', 'adminpass123'), -- Example admin credentials
('amitkumar', 'amit12345'),
('priyasharma', 'priya9876'),
('rahulsingh', 'rahul2345'),
('anitadesai', 'anita5432');
