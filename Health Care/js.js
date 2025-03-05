
 document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelector('.menu-item.active').classList.remove('active');
        this.classList.add('active');
    });
});
// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Dashboard sidebar menu functionality
    initializeSidebar();
    
    // Search functionality
    initializeSearch();
    
    // Notification functionality
    initializeNotifications();
    
    // Chart tooltip functionality
    initializeChartTooltips();
    
    // Appointment actions functionality
    initializeAppointmentActions();
    
    // Initialize date selection
    initializeDateSelection();
});

// Function to handle sidebar menu item selection
function initializeSidebar() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(mi => mi.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Get the menu name and simulate page change
            const menuName = this.querySelector('span').textContent;
            console.log(`Navigating to ${menuName} page`);
            
            // This would typically load content for that section
            // For now we'll just show an alert
            if (menuName !== 'Dashboard') {
                alert(`${menuName} section will be loaded here`);
            }
        });
    });
}

// Function to handle search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-container input');
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                console.log(`Searching for: ${searchTerm}`);
                alert(`Search results for "${searchTerm}" would appear here`);
            }
        }
    });
}

// Function to handle notifications
function initializeNotifications() {
    const notificationIcon = document.querySelector('.notification-icon');
    
    notificationIcon.addEventListener('click', function() {
        alert('Notifications panel would open here');
        // This would typically toggle a notifications dropdown
    });
}

// Function to add tooltips to chart bars
function initializeChartTooltips() {
    const chartBars = document.querySelectorAll('.bar');
    
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            const value = this.getAttribute('data-value');
            
            // Create tooltip if it doesn't exist
            let tooltip = this.querySelector('.tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = `${value} patients`;
                this.appendChild(tooltip);
            }
        });
        
        bar.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Function to handle appointment action buttons
function initializeAppointmentActions() {
    // View appointment buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const patientName = row.querySelector('td:first-child').textContent;
            alert(`Viewing details for patient: ${patientName}`);
        });
    });
    
    // Edit appointment buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const patientName = row.querySelector('td:first-child').textContent;
            alert(`Editing appointment for patient: ${patientName}`);
        });
    });
}

// Function to handle date selection in charts
function initializeDateSelection() {
    const dateSelect = document.querySelector('.chart-header select');
    
    dateSelect.addEventListener('change', function() {
        const selectedOption = this.value;
        console.log(`Changing chart data to: ${selectedOption}`);
        
        // This would typically fetch new data and update the chart
        // For now, we'll simulate changes with random values
        simulateChartDataUpdate();
    });
}

// Function to simulate updating chart with new data
function simulateChartDataUpdate() {
    const bars = document.querySelectorAll('.bar');
    
    bars.forEach(bar => {
        // Generate random height between 20% and 95%
        const randomHeight = Math.floor(Math.random() * 75) + 20;
        const randomValue = Math.floor(randomHeight * 2);
        
        // Animate the height change
        bar.style.transition = 'height 0.5s ease-in-out';
        bar.style.height = `${randomHeight}%`;
        bar.setAttribute('data-value', randomValue);
    });
}

// Function to show/hide user profile dropdown (to be implemented in HTML)
function toggleProfileDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileDropdown) {
        profileDropdown.classList.toggle('show');
    } else {
        console.log('Profile dropdown element not found');
    }
}

// Function to dynamically update dashboard statistics (for real applications)
function updateDashboardStats() {
    // This function would be used to fetch and update real-time statistics
    // For now, it's just a placeholder for future implementation
    console.log('Updating dashboard statistics...');
    
}