<?php
// Database configuration for Hostinger
// Update these credentials with your Hostinger database details

define('DB_HOST', 'localhost'); // Usually localhost for Hostinger
define('DB_NAME', 'courierpro'); // Your database name
define('DB_USER', 'your_db_username'); // Your database username
define('DB_PASS', 'your_db_password'); // Your database password
define('DB_CHARSET', 'utf8mb4');

// Create database connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Session configuration
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>