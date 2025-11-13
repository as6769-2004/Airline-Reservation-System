-- ============================================
-- AIRLINE MANAGEMENT DATABASE SCHEMA
-- Simple and Efficient Design
-- ============================================

CREATE DATABASE IF NOT EXISTS airlinemanagement;
USE airlinemanagement;

-- ============================================
-- CORE TABLES
-- ============================================

-- Users table (must be created first due to foreign key dependencies)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'customer',
    is_active TINYINT(1) DEFAULT 1,
    email_verified TINYINT(1) DEFAULT 0,
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_username (username),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Passenger table
CREATE TABLE IF NOT EXISTS passenger (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    aadhar VARCHAR(12) UNIQUE,
    nationality VARCHAR(100) DEFAULT 'Indian',
    address VARCHAR(255),
    gender VARCHAR(10) DEFAULT 'Male',
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_passenger_email (email),
    INDEX idx_passenger_aadhar (aadhar)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Airport table
CREATE TABLE IF NOT EXISTS airport (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_code VARCHAR(3) NOT NULL UNIQUE,
    airport_name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    INDEX idx_airport_code (airport_code),
    INDEX idx_airport_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Aircraft table
CREATE TABLE IF NOT EXISTS aircraft (
    aircraft_id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_model VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    manufacturer VARCHAR(100),
    INDEX idx_aircraft_model (aircraft_model)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Flight table
CREATE TABLE IF NOT EXISTS flight (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(50) NOT NULL UNIQUE,
    flight_name VARCHAR(100) NOT NULL,
    departure_airport_id INT,
    arrival_airport_id INT,
    aircraft_id INT,
    departure_date DATETIME NOT NULL,
    arrival_date DATETIME NOT NULL,
    available_seats INT NOT NULL,
    total_seats INT NOT NULL DEFAULT 180,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Scheduled',
    journey_time VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (departure_airport_id) REFERENCES airport(airport_id) ON DELETE RESTRICT,
    FOREIGN KEY (arrival_airport_id) REFERENCES airport(airport_id) ON DELETE RESTRICT,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id) ON DELETE RESTRICT,
    INDEX idx_flight_number (flight_number),
    INDEX idx_flight_departure (departure_airport_id, departure_date),
    INDEX idx_flight_arrival (arrival_airport_id),
    INDEX idx_flight_status (status),
    INDEX idx_flight_date (departure_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Booking table
CREATE TABLE IF NOT EXISTS booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    passenger_id INT NOT NULL,
    user_id INT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pnr_number VARCHAR(20) NOT NULL UNIQUE,
    seat_number VARCHAR(10),
    booking_status VARCHAR(20) DEFAULT 'Confirmed',
    total_amount DECIMAL(10, 2),
    booking_reference VARCHAR(50),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE CASCADE,
    FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_booking_pnr (pnr_number),
    INDEX idx_booking_user (user_id),
    INDEX idx_booking_passenger (passenger_id),
    INDEX idx_booking_flight (flight_id),
    INDEX idx_booking_status (booking_status),
    INDEX idx_booking_date (booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payment table
CREATE TABLE IF NOT EXISTS payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Online',
    transaction_id VARCHAR(100) UNIQUE,
    payment_status VARCHAR(20) DEFAULT 'Completed',
    gateway_response TEXT,
    refund_amount DECIMAL(10, 2) DEFAULT 0.00,
    refund_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_payment_booking (booking_id),
    INDEX idx_payment_user (user_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Employee table
CREATE TABLE IF NOT EXISTS employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    employee_number VARCHAR(20) UNIQUE,
    department VARCHAR(100),
    job_title VARCHAR(100),
    hire_date DATE,
    airport_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airport_id) REFERENCES airport(airport_id) ON DELETE SET NULL,
    INDEX idx_employee_number (employee_number),
    INDEX idx_employee_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Baggage table
CREATE TABLE IF NOT EXISTS baggage (
    baggage_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    weight DECIMAL(5, 2),
    baggage_type VARCHAR(50),
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE,
    INDEX idx_baggage_booking (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Customer feedback table
CREATE TABLE IF NOT EXISTS customer_feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT,
    flight_id INT,
    rating INT,
    comment TEXT,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE CASCADE,
    INDEX idx_feedback_passenger (passenger_id),
    INDEX idx_feedback_flight (flight_id),
    INDEX idx_feedback_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Route table
CREATE TABLE IF NOT EXISTS route (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    departure_airport_id INT,
    arrival_airport_id INT,
    distance DECIMAL(10, 2),
    duration TIME,
    FOREIGN KEY (departure_airport_id) REFERENCES airport(airport_id) ON DELETE CASCADE,
    FOREIGN KEY (arrival_airport_id) REFERENCES airport(airport_id) ON DELETE CASCADE,
    INDEX idx_route_airports (departure_airport_id, arrival_airport_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User booking summary table
CREATE TABLE IF NOT EXISTS user_booking_summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_bookings INT DEFAULT 0,
    total_amount_spent DECIMAL(12, 2) DEFAULT 0.00,
    last_booking_date DATETIME NULL,
    favorite_destination VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_summary (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
>