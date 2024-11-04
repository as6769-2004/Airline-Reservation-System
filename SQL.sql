-- Step 1: Create the database
CREATE DATABASE airlinemanagement;

-- Step 2: Use the database
USE airlinemanagement;

-- Step 3: Create the passengers table
CREATE TABLE passenger (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    aadhar VARCHAR(12) NOT NULL UNIQUE,
    nationality VARCHAR(100),
    address VARCHAR(255),
    gender VARCHAR(10),
    phone VARCHAR(15) NOT NULL
);

-- Step 4: Create the flights table
CREATE TABLE flight (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(50) NOT NULL,
    flight_name VARCHAR(100) NOT NULL,
    departure VARCHAR(255) NOT NULL,
    arrival VARCHAR(255) NOT NULL,
    travel_date DATE NOT NULL,
    available_seats INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    journey_time VARCHAR(50) NOT NULL,
    arrival_date DATE,
    departure_date DATE
);

-- Step 5: Create the booking table
CREATE TABLE IF NOT EXISTS booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flight_name VARCHAR(255) NOT NULL,
    departure VARCHAR(255) NOT NULL,
    arrival VARCHAR(255) NOT NULL,
    pnr_number VARCHAR(20) NOT NULL UNIQUE,
    aadhar VARCHAR(12) NOT NULL
);

-- Step 6: Create the login table
CREATE TABLE IF NOT EXISTS login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
