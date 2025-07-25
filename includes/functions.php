<?php
require_once 'config/database.php';

// Authentication functions
function isAdminLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function isAgentLoggedIn() {
    return isset($_SESSION['agent_logged_in']) && $_SESSION['agent_logged_in'] === true;
}

function loginAdmin($username, $password) {
    global $pdo;
    
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    
    if ($admin && password_verify($password, $admin['password'])) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        return true;
    }
    return false;
}

function loginAgent($agentId, $password) {
    global $pdo;
    
    $stmt = $pdo->prepare("SELECT * FROM agents WHERE agent_id = ?");
    $stmt->execute([$agentId]);
    $agent = $stmt->fetch();
    
    if ($agent && password_verify($password, $agent['password'])) {
        $_SESSION['agent_logged_in'] = true;
        $_SESSION['agent_id'] = $agent['agent_id'];
        $_SESSION['agent_name'] = $agent['name'];
        return true;
    }
    return false;
}

function logout() {
    session_destroy();
    header('Location: /');
    exit;
}

// Courier functions
function generateCourierId($toName) {
    $initials = '';
    $words = explode(' ', strtoupper($toName));
    foreach ($words as $word) {
        if (!empty($word)) {
            $initials .= substr($word, 0, 1);
        }
    }
    $initials = substr($initials, 0, 3);
    $numbers = rand(100, 999);
    return $initials . $numbers;
}

function calculateCourierAmount($fromPlace, $toPlace) {
    $cityRates = [
        'Mumbai' => 300, 'Delhi' => 300, 'Bangalore' => 280, 'Chennai' => 280,
        'Hyderabad' => 270, 'Kolkata' => 270, 'Pune' => 260, 'Ahmedabad' => 250,
        'Jaipur' => 220, 'Lucknow' => 210, 'Kanpur' => 200, 'Nagpur' => 200,
        'Dubai' => 1500, 'London' => 2000, 'New York' => 2200, 'Singapore' => 1800
    ];
    
    $fromRate = isset($cityRates[$fromPlace]) ? $cityRates[$fromPlace] : 120;
    $toRate = isset($cityRates[$toPlace]) ? $cityRates[$toPlace] : 120;
    
    $baseAmount = ($fromRate + $toRate) / 2;
    
    $isInternational = $fromRate > 1000 || $toRate > 1000;
    if ($isInternational) {
        return round($baseAmount * 1.2);
    }
    
    return round($baseAmount);
}

function getAllCouriers() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM couriers ORDER BY created_at DESC");
    return $stmt->fetchAll();
}

function getCouriersByAgent($agentId) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM couriers WHERE agent_id = ? ORDER BY created_at DESC");
    $stmt->execute([$agentId]);
    return $stmt->fetchAll();
}

function getCourierById($courierId) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM couriers WHERE courier_id = ?");
    $stmt->execute([$courierId]);
    return $stmt->fetch();
}

function updateCourierStatus($courierId, $status) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE couriers SET status = ?, updated_at = NOW() WHERE courier_id = ?");
    return $stmt->execute([$status, $courierId]);
}

function addCourier($data) {
    global $pdo;
    
    $sql = "INSERT INTO couriers (courier_id, from_name, from_mobile, from_place, to_name, to_mobile, to_place, pickup_date, expected_delivery_date, courier_amount, remarks, agent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    return $stmt->execute([
        $data['courier_id'],
        $data['from_name'],
        $data['from_mobile'],
        $data['from_place'],
        $data['to_name'],
        $data['to_mobile'],
        $data['to_place'],
        $data['pickup_date'],
        $data['expected_delivery_date'],
        $data['courier_amount'],
        $data['remarks'],
        $data['agent_id']
    ]);
}

function getAllAgents() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM agents ORDER BY created_at DESC");
    return $stmt->fetchAll();
}

function addAgent($data) {
    global $pdo;
    
    $agentId = 'Agent' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO agents (agent_id, name, email, password, join_date) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    return $stmt->execute([
        $agentId,
        $data['name'],
        $data['email'],
        $hashedPassword,
        date('Y-m-d')
    ]);
}

function getDeliverySelfies() {
    global $pdo;
    $stmt = $pdo->query("SELECT ds.*, c.from_name, c.to_name FROM delivery_selfies ds JOIN couriers c ON ds.courier_id = c.courier_id ORDER BY ds.upload_time DESC");
    return $stmt->fetchAll();
}

function addDeliverySelfie($courierId, $agentId, $customerNote, $imagePath) {
    global $pdo;
    
    $sql = "INSERT INTO delivery_selfies (courier_id, agent_id, customer_note, image_path) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    return $stmt->execute([$courierId, $agentId, $customerNote, $imagePath]);
}

function addContactMessage($data) {
    global $pdo;
    
    $sql = "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    return $stmt->execute([
        $data['name'],
        $data['email'],
        $data['subject'],
        $data['message']
    ]);
}

function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function redirect($url) {
    header("Location: $url");
    exit;
}
?>