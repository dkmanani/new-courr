// Admin Dashboard JavaScript
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

    // Status button functionality in modal
    const statusBtns = document.querySelectorAll('.status-btn');
    const selectedStatusInput = document.getElementById('selectedStatus');
    const updateBtn = document.getElementById('updateBtn');

    statusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            
            // Remove active class from all status buttons
            statusBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set the selected status
            selectedStatusInput.value = status;
            updateBtn.disabled = false;
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
});

// Edit courier function
function editCourier(courierId, currentStatus) {
    document.getElementById('editCourierId').value = courierId;
    document.getElementById('displayCourierId').textContent = courierId;
    
    // Reset status buttons
    const statusBtns = document.querySelectorAll('.status-btn');
    statusBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-status') === currentStatus) {
            btn.classList.add('active');
            document.getElementById('selectedStatus').value = currentStatus;
            document.getElementById('updateBtn').disabled = false;
        }
    });
    
    document.getElementById('editModal').classList.add('active');
}

// Close modal function
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    
    // Reset form
    document.getElementById('selectedStatus').value = '';
    document.getElementById('updateBtn').disabled = true;
    
    const statusBtns = document.querySelectorAll('.status-btn');
    statusBtns.forEach(btn => btn.classList.remove('active'));
}

// Export data function
function exportData() {
    // Get current date for filename
    const date = new Date().toISOString().split('T')[0];
    
    // Create export data
    const exportData = {
        exportDate: new Date().toISOString(),
        couriers: [],
        agents: []
    };
    
    // Get courier data from table
    const courierRows = document.querySelectorAll('#couriers tbody tr');
    courierRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            exportData.couriers.push({
                id: cells[0].textContent.trim(),
                from: cells[1].textContent.trim(),
                to: cells[2].textContent.trim(),
                status: cells[3].textContent.trim(),
                date: cells[4] ? cells[4].textContent.trim() : '',
                agent: cells[5] ? cells[5].textContent.trim() : ''
            });
        }
    });
    
    // Get agent data from table
    const agentRows = document.querySelectorAll('#agents tbody tr');
    agentRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            exportData.agents.push({
                id: cells[0].textContent.trim(),
                name: cells[1].textContent.trim(),
                email: cells[2].textContent.trim(),
                status: cells[3].textContent.trim(),
                joinDate: cells[4].textContent.trim()
            });
        }
    });
    
    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `courier-data-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    // Show success message
    showAlert('Data exported successfully!', 'success');
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
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});