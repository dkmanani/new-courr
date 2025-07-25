// Agent Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Auto-hide alerts
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    });

    // File upload validation
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Check file size (500KB limit)
                if (file.size > 500 * 1024) {
                    showAlert('File size must be less than 500KB', 'error');
                    this.value = '';
                    return;
                }
                
                // Check file type
                if (!file.type.startsWith('image/')) {
                    showAlert('Please select an image file', 'error');
                    this.value = '';
                    return;
                }
                
                showAlert('Selfie uploaded successfully', 'success');
            }
        });
    }
});

// Calculate courier amount based on cities
function calculateAmount() {
    const fromPlace = document.querySelector('input[name="from_place"]').value;
    const toPlace = document.querySelector('input[name="to_place"]').value;
    const amountInput = document.getElementById('courierAmount');
    
    if (fromPlace && toPlace) {
        const cityRates = {
            'Mumbai': 300, 'Delhi': 300, 'Bangalore': 280, 'Chennai': 280,
            'Hyderabad': 270, 'Kolkata': 270, 'Pune': 260, 'Ahmedabad': 250,
            'Jaipur': 220, 'Lucknow': 210, 'Kanpur': 200, 'Nagpur': 200,
            'Dubai': 1500, 'London': 2000, 'New York': 2200, 'Singapore': 1800
        };
        
        const fromRate = cityRates[fromPlace] || 120;
        const toRate = cityRates[toPlace] || 120;
        
        const baseAmount = (fromRate + toRate) / 2;
        const isInternational = fromRate > 1000 || toRate > 1000;
        const finalAmount = isInternational ? Math.round(baseAmount * 1.2) : Math.round(baseAmount);
        
        amountInput.value = finalAmount;
    }
}

// Open delivery modal
function openDeliveryModal(courierId) {
    document.getElementById('deliveryCourierId').value = courierId;
    document.getElementById('displayDeliveryCourierId').textContent = courierId;
    document.getElementById('deliveryModal').classList.add('active');
}

// Close delivery modal
function closeDeliveryModal() {
    document.getElementById('deliveryModal').classList.remove('active');
    
    // Reset form
    const form = document.querySelector('#deliveryModal form');
    form.reset();
}

// Export stats function
function exportStats() {
    const date = new Date().toISOString().split('T')[0];
    const agentId = document.querySelector('.welcome-text').textContent.split(': ')[1];
    
    // Get stats from the page
    const statCards = document.querySelectorAll('.stat-card .stat-info p');
    const totalCouriers = statCards[0].textContent;
    const delivered = statCards[1].textContent;
    const pending = statCards[2].textContent;
    const revenue = statCards[3].textContent;
    
    // Create export data
    const exportData = {
        agentId: agentId,
        exportDate: new Date().toISOString(),
        stats: {
            totalCouriers: totalCouriers,
            delivered: delivered,
            pending: pending,
            revenue: revenue
        },
        couriers: []
    };
    
    // Get courier data from table
    const courierRows = document.querySelectorAll('#update-tracking tbody tr');
    courierRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            exportData.couriers.push({
                id: cells[0].textContent.trim(),
                from: cells[1].textContent.trim(),
                to: cells[2].textContent.trim(),
                status: cells[3].textContent.trim(),
                expected: cells[4] ? cells[4].textContent.trim() : ''
            });
        }
    });
    
    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-stats-${agentId}-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    showAlert('Stats exported successfully!', 'success');
}

// Utility function to show alerts
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = '1';
        alert.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100%)';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 4000);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('deliveryModal');
    if (e.target === modal) {
        closeDeliveryModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDeliveryModal();
    }
});

// Form validation
document.addEventListener('submit', function(e) {
    const form = e.target;
    
    if (form.querySelector('input[name="action"][value="complete_delivery"]')) {
        const selfieInput = form.querySelector('input[name="selfie"]');
        const noteInput = form.querySelector('textarea[name="customer_note"]');
        
        if (!selfieInput.files[0]) {
            e.preventDefault();
            showAlert('Please upload a selfie to complete delivery', 'error');
            return;
        }
        
        if (!noteInput.value.trim()) {
            e.preventDefault();
            showAlert('Please add a customer note', 'error');
            return;
        }
    }
});