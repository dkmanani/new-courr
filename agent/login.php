<?php
require_once '../includes/functions.php';

// Redirect if already logged in
if (isAgentLoggedIn()) {
    redirect('dashboard.php');
}

$error = '';

if ($_POST) {
    $agentId = sanitizeInput($_POST['agent_id']);
    $password = $_POST['password'];
    
    if (loginAgent($agentId, $password)) {
        redirect('dashboard.php');
    } else {
        $error = 'Invalid credentials';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agent Login - CourierPro</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="../assets/css/auth.css" rel="stylesheet">
</head>
<body>
    <div class="auth-container agent-theme">
        <div class="auth-card">
            <div class="auth-header">
                <a href="../index.php" class="logo-link">
                    <h1 class="logo">CourierPro</h1>
                </a>
                <h2>Agent Login</h2>
                <p>Access your agent dashboard</p>
            </div>

            <form method="POST" class="auth-form">
                <div class="form-group">
                    <label>Agent ID</label>
                    <div class="input-group">
                        <input type="text" name="agent_id" placeholder="Enter your agent ID" required>
                        <i class="ri-user-line"></i>
                    </div>
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <div class="input-group">
                        <input type="password" name="password" placeholder="Enter your password" required>
                        <i class="ri-lock-line"></i>
                    </div>
                </div>

                <?php if ($error): ?>
                    <div class="alert error"><?= $error ?></div>
                <?php endif; ?>

                <button type="submit" class="btn-primary">Sign In</button>
            </form>

            <div class="auth-footer">
                <a href="../index.php">← Back to Home</a>
            </div>
        </div>
    </div>
</body>
</html>