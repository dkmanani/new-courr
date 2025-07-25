<?php
require_once '../includes/functions.php';

// Check authentication
if (!isAdminLoggedIn()) {
    redirect('login.php');
}

// Handle form submissions
if ($_POST) {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'add_agent':
                $agentData = [
                    'name' => sanitizeInput($_POST['name']),
                    'email' => sanitizeInput($_POST['email']),
                    'password' => $_POST['password']
                ];
                if (addAgent($agentData)) {
                    $success = "Agent added successfully!";
                } else {
                    $error = "Failed to add agent.";
                }
                break;
                
            case 'update_courier_status':
                $courierId = sanitizeInput($_POST['courier_id']);
                $status = sanitizeInput($_POST['status']);
                if (updateCourierStatus($courierId, $status)) {
                    $success = "Courier status updated successfully!";
                } else {
                    $error = "Failed to update courier status.";
                }
                break;
        }
    }
}

// Get data
$couriers = getAllCouriers();
$agents = getAllAgents();
$deliverySelfies = getDeliverySelfies();

// Calculate stats
$totalCouriers = count($couriers);
$deliveredCount = count(array_filter($couriers, fn($c) => $c['status'] === 'Delivered'));
$inTransitCount = count(array_filter($couriers, fn($c) => $c['status'] === 'In Transit'));
$activeAgents = count(array_filter($agents, fn($a) => $a['status'] === 'Active'));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - CourierPro</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="../assets/css/dashboard.css" rel="stylesheet">
</head>
<body>
    <div class="dashboard-container">
        <!-- Header -->
        <header class="dashboard-header">
            <div class="header-content">
                <a href="../index.php" class="logo">CourierPro</a>
                <div class="header-actions">
                    <span class="welcome-text">Welcome, Admin</span>
                    <a href="logout.php" class="logout-btn">
                        <i class="ri-logout-circle-line"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </div>
        </header>

        <div class="dashboard-content">
            <!-- Status Messages -->
            <?php if (isset($success)): ?>
                <div class="alert success"><?= $success ?></div>
            <?php endif; ?>
            
            <?php if (isset($error)): ?>
                <div class="alert error"><?= $error ?></div>
            <?php endif; ?>

            <!-- Navigation Tabs -->
            <nav class="tab-nav">
                <button class="tab-btn active" data-tab="overview">
                    <i class="ri-dashboard-line"></i>
                    <span>Overview</span>
                </button>
                <button class="tab-btn" data-tab="couriers">
                    <i class="ri-truck-line"></i>
                    <span>Couriers</span>
                </button>
                <button class="tab-btn" data-tab="agents">
                    <i class="ri-user-line"></i>
                    <span>Agents</span>
                </button>
                <button class="tab-btn" data-tab="selfies">
                    <i class="ri-camera-line"></i>
                    <span>Selfies</span>
                </button>
                <button class="tab-btn" data-tab="analytics">
                    <i class="ri-bar-chart-line"></i>
                    <span>Analytics</span>
                </button>
            </nav>

            <!-- Overview Tab -->
            <div class="tab-content active" id="overview">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="ri-truck-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Total Couriers</h3>
                            <p><?= $totalCouriers ?></p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon green">
                            <i class="ri-check-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Delivered</h3>
                            <p><?= $deliveredCount ?></p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon orange">
                            <i class="ri-time-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3>In Transit</h3>
                            <p><?= $inTransitCount ?></p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="ri-user-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Active Agents</h3>
                            <p><?= $activeAgents ?></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Couriers Tab -->
            <div class="tab-content" id="couriers">
                <div class="content-card">
                    <div class="card-header">
                        <h2>Manage Couriers</h2>
                        <button onclick="exportData()" class="btn-secondary">
                            <i class="ri-download-line"></i>
                            Export Data
                        </button>
                    </div>
                    
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Status</th>
                                    <th class="desktop-only">Date</th>
                                    <th class="desktop-only">Agent</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($couriers as $courier): ?>
                                <tr>
                                    <td class="courier-id"><?= htmlspecialchars($courier['courier_id']) ?></td>
                                    <td>
                                        <div class="courier-info">
                                            <div><?= htmlspecialchars($courier['from_name']) ?></div>
                                            <small><?= htmlspecialchars($courier['from_place']) ?></small>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="courier-info">
                                            <div><?= htmlspecialchars($courier['to_name']) ?></div>
                                            <small><?= htmlspecialchars($courier['to_place']) ?></small>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="status-badge status-<?= strtolower(str_replace(' ', '-', $courier['status'])) ?>">
                                            <?= htmlspecialchars($courier['status']) ?>
                                        </span>
                                    </td>
                                    <td class="desktop-only"><?= date('M d, Y', strtotime($courier['pickup_date'])) ?></td>
                                    <td class="desktop-only"><?= htmlspecialchars($courier['agent_id']) ?></td>
                                    <td>
                                        <button onclick="editCourier('<?= $courier['courier_id'] ?>', '<?= $courier['status'] ?>')" class="btn-edit">
                                            <i class="ri-edit-line"></i>
                                        </button>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Agents Tab -->
            <div class="tab-content" id="agents">
                <div class="content-card">
                    <div class="card-header">
                        <h2>Add New Agent</h2>
                    </div>
                    <form method="POST" class="agent-form">
                        <input type="hidden" name="action" value="add_agent">
                        <div class="form-grid">
                            <input type="text" name="name" placeholder="Agent Name" required>
                            <input type="email" name="email" placeholder="Email" required>
                            <input type="password" name="password" placeholder="Password" required>
                            <button type="submit" class="btn-primary">Add Agent</button>
                        </div>
                    </form>
                </div>

                <div class="content-card">
                    <div class="card-header">
                        <h2>Manage Agents</h2>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Agent ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Join Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($agents as $agent): ?>
                                <tr>
                                    <td><?= htmlspecialchars($agent['agent_id']) ?></td>
                                    <td><?= htmlspecialchars($agent['name']) ?></td>
                                    <td><?= htmlspecialchars($agent['email']) ?></td>
                                    <td>
                                        <span class="status-badge status-active">
                                            <?= htmlspecialchars($agent['status']) ?>
                                        </span>
                                    </td>
                                    <td><?= date('M d, Y', strtotime($agent['join_date'])) ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Delivery Selfies Tab -->
            <div class="tab-content" id="selfies">
                <div class="content-card">
                    <div class="card-header">
                        <h2>Delivery Selfies</h2>
                        <p>View selfies uploaded by agents upon delivery completion</p>
                    </div>
                    
                    <?php if (empty($deliverySelfies)): ?>
                        <div class="empty-state">
                            <i class="ri-camera-line"></i>
                            <p>No delivery selfies uploaded yet</p>
                        </div>
                    <?php else: ?>
                        <div class="selfies-grid">
                            <?php foreach ($deliverySelfies as $selfie): ?>
                            <div class="selfie-card">
                                <div class="selfie-image">
                                    <img src="../uploads/selfies/<?= htmlspecialchars($selfie['image_path']) ?>" alt="Delivery selfie">
                                </div>
                                <div class="selfie-info">
                                    <div class="selfie-header">
                                        <div>
                                            <p><strong>Courier ID:</strong> <?= htmlspecialchars($selfie['courier_id']) ?></p>
                                            <p><small>Agent: <?= htmlspecialchars($selfie['agent_id']) ?></small></p>
                                        </div>
                                        <span class="status-badge status-delivered">Delivered</span>
                                    </div>
                                    <div class="customer-note">
                                        <p><strong>Customer Note:</strong></p>
                                        <p><?= htmlspecialchars($selfie['customer_note']) ?></p>
                                    </div>
                                    <p class="upload-time">
                                        <i class="ri-time-line"></i>
                                        <?= date('M d, Y H:i', strtotime($selfie['upload_time'])) ?>
                                    </p>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Analytics Tab -->
            <div class="tab-content" id="analytics">
                <div class="analytics-grid">
                    <div class="content-card">
                        <h3>Daily Stats</h3>
                        <div class="analytics-stats">
                            <div class="analytics-item">
                                <span>Today's Deliveries</span>
                                <span class="analytics-value green">12</span>
                            </div>
                            <div class="analytics-item">
                                <span>Revenue Today</span>
                                <span class="analytics-value blue">₹2,400</span>
                            </div>
                            <div class="analytics-item">
                                <span>Active Agents</span>
                                <span class="analytics-value purple"><?= $activeAgents ?></span>
                            </div>
                        </div>
                    </div>

                    <div class="content-card">
                        <h3>Monthly Stats</h3>
                        <div class="analytics-stats">
                            <div class="analytics-item">
                                <span>Monthly Deliveries</span>
                                <span class="analytics-value green">325</span>
                            </div>
                            <div class="analytics-item">
                                <span>Monthly Revenue</span>
                                <span class="analytics-value blue">₹65,000</span>
                            </div>
                            <div class="analytics-item">
                                <span>Success Rate</span>
                                <span class="analytics-value purple">98.5%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Courier Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Update Courier Status</h3>
                <button onclick="closeModal()" class="modal-close">
                    <i class="ri-close-line"></i>
                </button>
            </div>
            
            <form method="POST" class="modal-form">
                <input type="hidden" name="action" value="update_courier_status">
                <input type="hidden" name="courier_id" id="editCourierId">
                
                <p>Courier ID: <span id="displayCourierId"></span></p>
                
                <div class="status-buttons">
                    <button type="button" class="status-btn" data-status="Picked Up">Picked Up</button>
                    <button type="button" class="status-btn" data-status="In Transit">In Transit</button>
                    <button type="button" class="status-btn" data-status="Out for Delivery">Out for Delivery</button>
                    <button type="button" class="status-btn" data-status="Delivered">Delivered</button>
                </div>
                
                <input type="hidden" name="status" id="selectedStatus">
                <button type="submit" class="btn-primary" id="updateBtn" disabled>Update Status</button>
            </form>
        </div>
    </div>

    <script src="../assets/js/dashboard.js"></script>
</body>
</html>