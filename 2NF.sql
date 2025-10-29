CREATE TABLE passenger_2NF (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    aadhar VARCHAR(12) NOT NULL UNIQUE,
    gender VARCHAR(10),
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255) UNIQUE,
    date_of_birth DATE
);

INSERT INTO passenger_2NF (passenger_id, name, aadhar, gender, phone, email, date_of_birth) VALUES
(1, 'Aditya S.', '123456789001', 'Male', '9876500001', 'aditya1@example.com', '2000-01-01'),
(2, 'Riya K.', '123456789002', 'Female', '9876500002', 'riya2@example.com', '2001-02-02'),
(3, 'Arjun M.', '123456789003', 'Male', '9876500003', 'arjun3@example.com', '2000-03-03'),
(4, 'Sneha P.', '123456789004', 'Female', '9876500004', 'sneha4@example.com', '2002-04-04'),
(5, 'Karan L.', '123456789005', 'Male', '9876500005', 'karan5@example.com', '2001-05-05'),
(6, 'Priya D', '123456789006', 'Female', '9876500006', 'priya6@example.com', '2000-06-06'),
(7, 'Vikram T.', '123456789007', 'Male', '9876500007', 'vikram7@example.com', '2002-07-07'),
(8, 'Anjali S.', '123456789008', 'Female', '9876500008', 'anjali8@example.com', '2001-08-08'),
(9, 'Rohan P.', '123456789009', 'Male', '9876500009', 'rohan9@example.com', '2000-09-09'),
(10, 'Meera K.', '123456789010', 'Female', '9876500010', 'meera10@example.com', '2002-10-10'),
(11, 'Aditya S.', '123456789011', 'Male', '9876500011', 'aditya11@example.com', '2000-01-01'),
(12, 'Riya K.', '123456789012', 'Female', '9876500012', 'riya12@example.com', '2001-02-02'),
(13, 'Meera K.', '123456789013', 'Female', '9876500013', 'meera13@example.com', '2002-10-10');


CREATE TABLE passenger_address_2NF (
    passenger_id INT PRIMARY KEY,
    nationality VARCHAR(100),
    address VARCHAR(255),
    FOREIGN KEY (passenger_id) REFERENCES passenger_2NF(passenger_id)
);

INSERT INTO passenger_address_2NF (passenger_id, nationality, address) VALUES
(1, 'Indian', 'Delhi, India'),
(2, 'Indian', 'Mumbai, India'),
(3, 'Indian', 'Bangalore, India'),
(4, 'Indian', 'Chennai, India'),
(5, 'Indian', 'Pune, India'),
(6, 'Indian', 'Hyderabad, India'),
(7, 'Indian', 'Kolkata, India'),
(8, 'Indian', 'Jaipur, India'),
(9, 'Indian', 'Lucknow, India'),
(10, 'Indian', 'Ahmedabad, India'),
(11, 'Indian', 'Delhi, India'),
(12, 'Indian', 'Mumbai, India'),
(13, 'Indian', 'Ahmedabad, India');
