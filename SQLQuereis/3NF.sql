CREATE TABLE passenger_3NF (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    aadhar VARCHAR(12) NOT NULL UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(10),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(15) NOT NULL
);

INSERT INTO passenger_3NF (passenger_id, name, aadhar, date_of_birth, gender, email, phone) VALUES
(1, 'Aditya S.', '123456789001', '2000-01-01', 'Male', 'aditya1@example.com', '9876500001'),
(2, 'Riya K.', '123456789002', '2001-02-02', 'Female', 'riya2@example.com', '9876500002'),
(3, 'Arjun M.', '123456789003', '2000-03-03', 'Male', 'arjun3@example.com', '9876500003'),
(4, 'Sneha P.', '123456789004', '2002-04-04', 'Female', 'sneha4@example.com', '9876500004'),
(5, 'Karan L.', '123456789005', '2001-05-05', 'Male', 'karan5@example.com', '9876500005'),
(6, 'Priya D.', '123456789006', '2000-06-06', 'Female', 'priya6@example.com', '9876500006'),
(7, 'Vikram T.', '123456789007', '2002-07-07', 'Male', 'vikram7@example.com', '9876500007'),
(8, 'Anjali S.', '123456789008', '2001-08-08', 'Female', 'anjali8@example.com', '9876500008'),
(9, 'Rohan P.', '123456789009', '2000-09-09', 'Male', 'rohan9@example.com', '9876500009'),
(10, 'Meera K.', '123456789010', '2002-10-10', 'Female', 'meera10@example.com', '9876500010'),
(11, 'Aditya S.', '123456789011', '2000-01-01', 'Male', 'aditya11@example.com', '9876500011'),
(12, 'Riya K.', '123456789012', '2001-02-02', 'Female', 'riya12@example.com', '9876500012'),
(13, 'Meera K.', '123456789013', '2002-10-10', 'Female', 'meera13@example.com', '9876500013');


CREATE TABLE address_3NF (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT,
    street_address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    FOREIGN KEY (passenger_id) REFERENCES passenger_3NF(passenger_id)
);

INSERT INTO address_3NF (address_id, passenger_id, street_address, city, country) VALUES
(1, 1, 'Delhi', 'Delhi', 'India'),
(2, 2, 'Mumbai', 'Mumbai', 'India'),
(3, 3, 'Bangalore', 'Bangalore', 'India'),
(4, 4, 'Chennai', 'Chennai', 'India'),
(5, 5, 'Pune', 'Pune', 'India'),
(6, 6, 'Hyderabad', 'Hyderabad', 'India'),
(7, 7, 'Kolkata', 'Kolkata', 'India'),
(8, 8, 'Jaipur', 'Jaipur', 'India'),
(9, 9, 'Lucknow', 'Lucknow', 'India'),
(10, 10, 'Ahmedabad', 'Ahmedabad', 'India'),
(11, 11, 'Delhi', 'Delhi', 'India'),
(12, 12, 'Mumbai', 'Mumbai', 'India'),
(13, 13, 'Ahmedabad', 'Ahmedabad', 'India');


CREATE TABLE nationality_3NF (
    passenger_id INT PRIMARY KEY,
    nationality VARCHAR(100),
    FOREIGN KEY (passenger_id) REFERENCES passenger_3NF(passenger_id)
);


INSERT INTO nationality_3NF (passenger_id, nationality) VALUES
(1, 'Indian'),
(2, 'Indian'),
(3, 'Indian'),
(4, 'Indian'),
(5, 'Indian'),
(6, 'Indian'),
(7, 'Indian'),
(8, 'Indian'),
(9, 'Indian'),
(10, 'Indian'),
(11, 'Indian'),
(12, 'Indian'),
(13, 'Indian');
