document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in by verifying token in cookie
    function checkAuth() {
        const cookies = document.cookie.split(';');
        let authToken = null;
        
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('Authorization=')) {
                authToken = cookie.substring('Authorization='.length);
                break;
            }
        }
        
        if (!authToken) {
            // Redirect to login page if no token is found
            window.location.href = "index.html";
        }
        
        // You might want to validate the token with your backend here
    }
    
    // Check authentication when page loads
    checkAuth();
    
    // Dashboard navigation
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const contentSections = document.querySelectorAll('.content-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
    
            // Hide all content sections
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
    
            // Show the selected section
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).style.display = 'block';
            
            // Load schedule data if the schedule section is shown
            if (sectionId === 'schedule-section') {
                loadSchedule();
            }
        });
    });
    
    // Logout function
    function logout() {
        // Clear the authentication cookie
        document.cookie = "Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        // Redirect to login page
        window.location.href = "index.html";
    }
    
    // Add logout button event listener if it exists
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    // Schedule data
    const scheduleData = [
        { day: 'Tuesday', neighborhoods: ['Thamel', 'Baneshwor', 'Durbar Marg'], time: '09:00 AM' },
        { day: 'Friday', neighborhoods: ['Basantapur', 'Patan', 'Kamalpokhari'], time: '08:45 AM' }
    ];
    
    function loadSchedule() {
        const grid = document.getElementById('schedule-grid');
        grid.innerHTML = ''; // Clear previous content
    
        scheduleData.forEach(schedule => {
            const card = document.createElement('div');
            card.className = 'schedule-card';
            card.innerHTML = `
                <div class="schedule-day">${schedule.day}</div>
                <div class="schedule-detail"><strong>Neighborhoods:</strong> ${schedule.neighborhoods.join(', ')}</div>
                <div class="schedule-detail"><strong>Time:</strong> ${schedule.time}</div>
            `;
            grid.appendChild(card);
        });
    }
    
    // Load schedule on initial page load if we're on that section
    if (document.getElementById('schedule-section').style.display !== 'none') {
        loadSchedule();
    }
});