<?php
require_once '../includes/functions.php';

// Check authentication
if (!isAgentLoggedIn()) {
    redirect('login.php');
}

$agentId = $_SESSION['agent_id'];
$agentName = $_SESSION['agent_name'];

// Handle form submissions
if ($_POST) {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'add_courier':
                $courierId = generateCourierId($_POST['to_name']);
                $courierData = [
                    'courier_id' => $courierId,
                    'from_name' => sanitizeInput($_POST['from_name']),
                    'from_mobile' => sanitizeInput($_POST['from_mobile']),
                    'from_place' => sanitizeInput($_POST['from_place']),
                    'to_name' => sanitizeInput($_POST['to_name']),
                    'to_mobile' => sanitizeInput($_POST['to_mobile']),
                    'to_place' => sanitizeInput($_POST['to_place']),
                    'pickup_date' => $_POST['pickup_date'],
                    'expected_delivery_date' => $_POST['expected_delivery_date'],
                    'courier_amount' => floatval($_POST['courier_amount']),
                    'remarks' => sanitizeInput($_POST['remarks']),
                    'agent_id' => $agentId
                ];
                
                if (addCourier($courierData)) {
                    $success = "Courier added successfully! ID: $courierId";
                    // Generate receipt
                    generateReceipt($courierData);
                } else {
                    $error = "Failed to add courier.";
                }
                break;
                
            case 'update_status':
                $courierId = sanitizeInput($_POST['courier_id']);
                $status = sanitizeInput($_POST['status']);
                
                if ($status === 'Delivered') {
                    $error = "Cannot mark as delivered without uploading selfie first.";
                } else {
                    if (updateCourierStatus($courierId, $status)) {
                        $success = "Courier status updated successfully!";
                    } else {
                        $error = "Failed to update courier status.";
                    }
                }
                break;
                
            case 'complete_delivery':
                $courierId = sanitizeInput($_POST['courier_id']);
                $customerNote = sanitizeInput($_POST['customer_note']);
                
                // Handle file upload
                if (isset($_FILES['selfie']) && $_FILES['selfie']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = '../uploads/selfies/';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }
                    
                    $fileName = $courierId . '_' . time() . '.jpg';
                    $uploadPath = $uploadDir . $fileName;
                    
                    if (move_uploaded_file($_FILES['selfie']['tmp_name'], $uploadPath)) {
                        if (addDeliverySelfie($courierId, $agentId, $customerNote, $fileName)) {
                            if (updateCourierStatus($courierId, 'Delivered')) {
                                $success = "Delivery completed successfully!";
                            }
                        }
                    } else {
                        $error = "Failed to upload selfie.";
                    }
                } else {
                    $error = "Please upload a selfie to complete delivery.";
                }
                break;
        }
    }
}

// Get agent's couriers
$myCouriers = getCouriersByAgent($agentId);

// Calculate stats
$totalCouriers = count($myCouriers);
$deliveredCount = count(array_filter($myCouriers, fn($c) => $c['status'] === 'Delivered'));
$pendingCount = $totalCouriers - $deliveredCount;
$revenue = $deliveredCount * 200; // Assuming ₹200 per delivery

function generateReceipt($data) {
    $receipt = "CourierPro Receipt\n" . str_repeat('=', 30) . "\n";
    $receipt .= "Courier ID: {$data['courier_id']}\n";
    $receipt .= "From: {$data['from_name']} ({$data['from_place']})\n";
    $receipt .= "To: {$data['to_name']} ({$data['to_place']})\n";
    $receipt .= "Pickup Date: {$data['pickup_date']}\n";
    $receipt .= "Expected Delivery: {$data['expected_delivery_date']}\n";
    $receipt .= "Amount: ₹{$data['courier_amount']}\n";
    $receipt .= "Remarks: {$data['remarks']}\n";
    $receipt .= "Agent: {$data['agent_id']}\n";
    $receipt .= "Status: Picked Up\n";
    $receipt .= str_repeat('=', 30);
    
    header('Content-Type: text/plain');
    header('Content-Disposition: attachment; filename="receipt-' . $data['courier_id'] . '.txt"');
    echo $receipt;
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agent Dashboard - CourierPro</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="../assets/css/dashboard.css" rel="stylesheet">
</head>
<body>
    <div class="dashboard-container agent-theme">
        <!-- Header -->
        <header class="dashboard-header">
            <div class="header-content">
                <a href="../index.php" class="logo">CourierPro</a>
                <div class="header-actions">
                    <span class="welcome-text">Agent: <?= htmlspecialchars($agentId) ?></span>
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
                <button class="tab-btn" data-tab="add-courier">
                    <i class="ri-add-line"></i>
                    <span>Add</span>
                </button>
                <button class="tab-btn" data-tab="update-tracking">
                    <i class="ri-refresh-line"></i>
                    <span>Update</span>
                </button>
                <button class="tab-btn" data-tab="stats">
                    <i class="ri-bar-chart-line"></i>
                    <span>Stats</span>
                </button>
            </nav>

            <!-- Overview Tab -->
            <div class="tab-content active" id="overview">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon green">
                            <i class="ri-truck-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3>My Couriers</h3>
                            <p><?= $totalCouriers ?></p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon blue">
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
                            <h3>Pending</h3>
                            <p><?= $pendingCount ?></p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="ri-money-dollar-circle-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Revenue</h3>
                            <p>₹<?= $revenue ?></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Courier Tab -->
            <div class="tab-content" id="add-courier">
                <div class="content-card">
                    <div class="card-header">
                        <h2>Add New Courier</h2>
                    </div>
                    
                    <form method="POST" class="courier-form">
                        <input type="hidden" name="action" value="add_courier">
                        
                        <div class="form-sections">
                            <div class="form-section">
                                <h3>From Details</h3>
                                <div class="form-group">
                                    <input type="text" name="from_name" placeholder="From Name" required>
                                </div>
                                <div class="form-group">
                                    <input type="tel" name="from_mobile" placeholder="From Mobile" required>
                                </div>
                                <div class="form-group">
                                    <input type="text" name="from_place" placeholder="From Place" required onchange="calculateAmount()">
                                </div>
                            </div>

                            <div class="form-section">
                                <h3>To Details</h3>
                                <div class="form-group">
                                    <input type="text" name="to_name" placeholder="To Name" required>
                                </div>
                                <div class="form-group">
                                    <input type="tel" name="to_mobile" placeholder="To Mobile" required>
                                </div>
                                <div class="form-group">
                                    <input type="text" name="to_place" placeholder="To Place" required onchange="calculateAmount()">
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Pickup Date</label>
                                <input type="date" name="pickup_date" required>
                            </div>
                            <div class="form-group">
                                <label>Expected Delivery Date</label>
                                <input type="date" name="expected_delivery_date" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Courier Amount</label>
                                <div class="amount-input">
                                    <span>₹</span>
                                    <input type="number" name="courier_amount" id="courierAmount" min="0" step="0.01" required>
                                </div>
                                <small>Amount calculated based on city rates</small>
                            </div>
                            <div class="form-group">
                                <label>Remarks</label>
                                <textarea name="remarks" placeholder="Add any special instructions" maxlength="500"></textarea>
                            </div>
                        </div>

                        <button type="submit" class="btn-primary">
                            <i class="ri-add-line"></i>
                            Add Courier & Generate Receipt
                        </button>
                    </form>
                </div>
            </div>

            <!-- Update Tracking Tab -->
            <div class="tab-content" id="update-tracking">
                <div class="content-card">
                    <div class="card-header">
                        <h2>Update Tracking</h2>
                        <p>Note: To mark as delivered, use the delivery completion feature below</p>
                    </div>
                    
                    <form method="POST" class="tracking-form">
                        <input type="hidden" name="action" value="update_status">
                        <div class="form-row">
                            <input type="text" name="courier_id" placeholder="Courier ID" required>
                            <select name="status" required>
                                <option value="">Select Status</option>
                                <option value="Picked Up">Picked Up</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                            </select>
                            <button type="submit" class="btn-primary">Update Status</button>
                        </div>
                    </form>
                </div>

                <div class="content-card">
                    <div class="card-header">
                        <h2>My Couriers</h2>
                    </div>
                    
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Status</th>
                                    <th class="desktop-only">Expected</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($myCouriers as $courier): ?>
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
                                    <td class="desktop-only"><?= date('M d, Y', strtotime($courier['expected_delivery_date'])) ?></td>
                                    <td>
                                        <?php if ($courier['status'] !== 'Delivered'): ?>
                                            <button onclick="openDeliveryModal('<?= $courier['courier_id'] ?>')" class="btn-complete">
                                                <span class="desktop-only">Complete</span>
                                                <span class="mobile-only">✓</span>
                                            </button>
                                        <?php else: ?>
                                            <span class="delivered-mark">
                                                <i class="ri-check-line"></i>
                                                <span class="desktop-only">Delivered</span>
                                            </span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Stats Tab -->
            <div class="tab-content" id="stats">
                <div class="content-card">
                    <div class="card-header">
                        <h2>My Performance Stats</h2>
                        <button onclick="exportStats()" class="btn-secondary">
                            <i class="ri-download-line"></i>
                            Export Stats
                        </button>
                    </div>
                    
                    <div class="performance-grid">
                        <div class="performance-item">
                            <div class="performance-value green"><?= $deliveredCount ?></div>
                            <div class="performance-label">Today's Deliveries</div>
                        </div>
                        <div class="performance-item">
                            <div class="performance-value blue"><?= $pendingCount ?></div>
                            <div class="performance-label">Pending</div>
                        </div>
                        <div class="performance-item">
                            <div class="performance-value purple">₹<?= $revenue ?></div>
                            <div class="performance-label">Today's Revenue</div>
                        </div>
                        <div class="performance-item">
                            <div class="performance-value orange"><?= $totalCouriers * 15 ?></div>
                            <div class="performance-label">Monthly Total</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Delivery Completion Modal -->
    <div id="deliveryModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Complete Delivery</h3>
                <button onclick="closeDeliveryModal()" class="modal-close">
                    <i class="ri-close-line"></i>
                </button>
            </div>
            
            <form method="POST" enctype="multipart/form-data" class="modal-form">
                <input type="hidden" name="action" value="complete_delivery">
                <input type="hidden" name="courier_id" id="deliveryCourierId">
                
                <p>Courier ID: <span id="displayDeliveryCourierId"></span></p>
                
                <div class="form-group">
                    <label>Upload Delivery Selfie <span class="required">*</span></label>
                    <input type="file" name="selfie" accept="image/*" required>
                    <small>Max file size: 500KB</small>
                </div>

                <div class="form-group">
                    <label>Customer Note <span class="required">*</span></label>
                    <textarea name="customer_note" placeholder="Add a note about the delivery" maxlength="500" required></textarea>
                </div>

                <div class="modal-actions">
                    <button type="button" onclick="closeDeliveryModal()" class="btn-secondary">Cancel</button>
                    <button type="submit" class="btn-primary">Complete Delivery</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../assets/js/agent-dashboard.js"></script>
</body>
</html>