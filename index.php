<?php
require_once 'includes/functions.php';

// Handle tracking form submission
$trackingResult = null;
if ($_POST && isset($_POST['tracking_id'])) {
    $trackingId = sanitizeInput($_POST['tracking_id']);
    $trackingResult = getCourierById($trackingId);
}

// Handle contact form submission
if ($_POST && isset($_POST['contact_name'])) {
    $contactData = [
        'name' => sanitizeInput($_POST['contact_name']),
        'email' => sanitizeInput($_POST['contact_email']),
        'subject' => sanitizeInput($_POST['contact_subject']),
        'message' => sanitizeInput($_POST['contact_message'])
    ];
    
    if (addContactMessage($contactData)) {
        $contactSuccess = "Thank you for your message. We'll get back to you soon!";
    } else {
        $contactError = "Sorry, there was an error sending your message. Please try again.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CourierPro - Fast & Reliable Courier Service</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Header -->
        <header class="bg-white shadow-sm">
            <div class="container">
                <div class="header-content">
                    <a href="admin/login.php" class="admin-link">
                        <i class="ri-admin-line"></i>
                        <span class="desktop-only">Admin Login</span>
                        <span class="mobile-only">Admin</span>
                    </a>
                    
                    <div class="logo-center">
                        <h1 class="logo">CourierPro</h1>
                    </div>
                    
                    <div class="header-actions">
                        <a href="agent/login.php" class="agent-link">
                            <i class="ri-user-line"></i>
                            <span class="desktop-only">Agent Login</span>
                            <span class="mobile-only">Agent</span>
                        </a>
                        <a href="https://wa.me/1234567890" class="whatsapp-btn">
                            <i class="ri-whatsapp-line"></i>
                            <span class="desktop-only">WhatsApp Help</span>
                            <span class="mobile-only">Help</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-bg"></div>
            <div class="hero-overlay"></div>
            
            <div class="container hero-content">
                <div class="hero-icon">
                    <i class="ri-truck-line"></i>
                </div>
                
                <h2 class="hero-title">Fast & Reliable Courier Service</h2>
                <p class="hero-subtitle">Track your packages in real-time with our advanced courier management system</p>

                <!-- Tracking Box -->
                <div class="tracking-box">
                    <h3 class="tracking-title">Track Your Package</h3>
                    
                    <form method="POST" class="tracking-form">
                        <div class="input-group">
                            <input type="text" name="tracking_id" placeholder="Enter Courier ID (e.g., JOH123)" required>
                            <i class="ri-search-line"></i>
                        </div>
                        
                        <button type="submit" class="btn-primary">Track Package</button>
                    </form>

                    <!-- Tracking Results -->
                    <?php if ($trackingResult): ?>
                        <div class="tracking-result">
                            <h4>Tracking Results</h4>
                            <div class="result-details">
                                <p><span>From:</span> <?= htmlspecialchars($trackingResult['from_name']) ?> - <?= htmlspecialchars($trackingResult['from_place']) ?></p>
                                <p><span>To:</span> <?= htmlspecialchars($trackingResult['to_name']) ?> - <?= htmlspecialchars($trackingResult['to_place']) ?></p>
                                <p><span>Status:</span> 
                                    <span class="status-badge status-<?= strtolower(str_replace(' ', '-', $trackingResult['status'])) ?>">
                                        <?= htmlspecialchars($trackingResult['status']) ?>
                                    </span>
                                </p>
                                <p><span>Expected:</span> <?= date('M d, Y', strtotime($trackingResult['expected_delivery_date'])) ?></p>
                            </div>
                        </div>
                    <?php elseif ($_POST && isset($_POST['tracking_id'])): ?>
                        <div class="tracking-result error">
                            <p>No courier found with ID: <?= htmlspecialchars($_POST['tracking_id']) ?></p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <!-- Why Choose Us Section -->
        <section class="features-section">
            <div class="container">
                <div class="section-header">
                    <h2>Why Choose CourierPro?</h2>
                    <p>We provide exceptional courier services with cutting-edge technology and unmatched reliability</p>
                </div>

                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon blue-gradient">
                            <i class="ri-time-line"></i>
                        </div>
                        <h3>Lightning Fast Delivery</h3>
                        <p>Same-day and next-day delivery options available. Our advanced logistics network ensures your packages reach their destination quickly and safely.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon green-gradient">
                            <i class="ri-shield-check-line"></i>
                        </div>
                        <h3>100% Secure & Insured</h3>
                        <p>All packages are fully insured and tracked with real-time monitoring. Our secure handling process ensures your items are protected throughout the journey.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon orange-gradient">
                            <i class="ri-customer-service-line"></i>
                        </div>
                        <h3>24/7 Customer Support</h3>
                        <p>Our dedicated support team is available round the clock to assist you. Get instant help via WhatsApp, phone, or email whenever you need it.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="services-section">
            <div class="container">
                <div class="section-header">
                    <h2>Our Services</h2>
                    <p>From local to international, we deliver everywhere</p>
                </div>

                <div class="services-grid">
                    <div class="service-card">
                        <div class="service-image blue-bg">
                            <div class="service-overlay"></div>
                        </div>
                        <div class="service-content">
                            <h3>District Delivery</h3>
                            <p>Fast local delivery within your district. Same-day delivery available for urgent packages.</p>
                            <div class="service-meta">
                                <i class="ri-map-pin-line"></i>
                                <span>Local Coverage</span>
                            </div>
                        </div>
                    </div>

                    <div class="service-card">
                        <div class="service-image green-bg">
                            <div class="service-overlay"></div>
                        </div>
                        <div class="service-content">
                            <h3>State-Wide Delivery</h3>
                            <p>Reliable interstate delivery services. Connect with customers across the entire state network.</p>
                            <div class="service-meta">
                                <i class="ri-roadster-line"></i>
                                <span>Interstate Network</span>
                            </div>
                        </div>
                    </div>

                    <div class="service-card">
                        <div class="service-image purple-bg">
                            <div class="service-overlay"></div>
                        </div>
                        <div class="service-content">
                            <h3>International Delivery</h3>
                            <p>Global shipping solutions with customs clearance and international tracking support.</p>
                            <div class="service-meta">
                                <i class="ri-plane-line"></i>
                                <span>Worldwide Coverage</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Footer -->
        <footer class="contact-footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="contact-form-section">
                        <h3>Contact Us</h3>
                        
                        <?php if (isset($contactSuccess)): ?>
                            <div class="alert success"><?= $contactSuccess ?></div>
                        <?php endif; ?>
                        
                        <?php if (isset($contactError)): ?>
                            <div class="alert error"><?= $contactError ?></div>
                        <?php endif; ?>
                        
                        <form method="POST" class="contact-form">
                            <div class="form-row">
                                <input type="text" name="contact_name" placeholder="Your Name" required>
                                <input type="email" name="contact_email" placeholder="Your Email" required>
                            </div>
                            <input type="text" name="contact_subject" placeholder="Subject" required>
                            <textarea name="contact_message" placeholder="Your Message" rows="4" maxlength="500" required></textarea>
                            <button type="submit" class="btn-primary">Send Message</button>
                        </form>
                    </div>

                    <div class="company-info">
                        <div class="company-header">
                            <h2 class="company-logo">CourierPro</h2>
                            <p>Your trusted partner for fast, secure, and reliable courier services worldwide.</p>
                        </div>
                        
                        <div class="social-links">
                            <a href="#"><i class="ri-facebook-fill"></i></a>
                            <a href="#"><i class="ri-twitter-fill"></i></a>
                            <a href="#"><i class="ri-instagram-fill"></i></a>
                            <a href="#"><i class="ri-linkedin-fill"></i></a>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>© 2024 CourierPro. All rights reserved. Fast, Secure, Reliable.</p>
                </div>
            </div>
        </footer>
    </div>

    <script src="assets/js/main.js"></script>
</body>
</html>