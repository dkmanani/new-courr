-- CourierPro Database Schema for MySQL/phpMyAdmin
-- Compatible with Hostinger hosting

CREATE DATABASE IF NOT EXISTS courierpro;
USE courierpro;

-- Admin table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agent_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    join_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Couriers table
CREATE TABLE IF NOT EXISTS couriers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    courier_id VARCHAR(20) NOT NULL UNIQUE,
    from_name VARCHAR(100) NOT NULL,
    from_mobile VARCHAR(20) NOT NULL,
    from_place VARCHAR(100) NOT NULL,
    to_name VARCHAR(100) NOT NULL,
    to_mobile VARCHAR(20) NOT NULL,
    to_place VARCHAR(100) NOT NULL,
    pickup_date DATE NOT NULL,
    expected_delivery_date DATE NOT NULL,
    courier_amount DECIMAL(10,2) NOT NULL,
    remarks TEXT,
    status ENUM('Picked Up', 'In Transit', 'Out for Delivery', 'Delivered') DEFAULT 'Picked Up',
    agent_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE
);

-- Delivery selfies table
CREATE TABLE IF NOT EXISTS delivery_selfies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    courier_id VARCHAR(20) NOT NULL,
    agent_id VARCHAR(20) NOT NULL,
    customer_note TEXT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (courier_id) REFERENCES couriers(courier_id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO admins (username, password, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@courierpro.com');

-- Insert default agents
INSERT INTO agents (agent_id, name, email, password, join_date) VALUES 
('Agent001', 'Rajesh Kumar', 'rajesh@courier.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2024-01-01'),
('Agent002', 'Priya Sharma', 'priya@courier.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2024-01-02');

-- Insert sample couriers
INSERT INTO couriers (courier_id, from_name, from_mobile, from_place, to_name, to_mobile, to_place, pickup_date, expected_delivery_date, courier_amount, remarks, status, agent_id) VALUES 
('JOH123', 'John Doe', '9876543210', 'Mumbai', 'Jane Smith', '9876543211', 'Delhi', '2024-01-15', '2024-01-18', 300.00, 'Handle with care', 'In Transit', 'Agent001'),
('MAR456', 'Mark Johnson', '9876543212', 'Bangalore', 'Lisa Wilson', '9876543213', 'Chennai', '2024-01-14', '2024-01-17', 280.00, 'Fragile items', 'Delivered', 'Agent002'),
('SAR789', 'Sarah Brown', '9876543214', 'Kolkata', 'Tom Davis', '9876543215', 'Hyderabad', '2024-01-16', '2024-01-19', 270.00, 'Express delivery', 'Picked Up', 'Agent001');