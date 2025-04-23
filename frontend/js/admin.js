document.addEventListener('DOMContentLoaded', function() {
    // Content sections paths
    const sectionPaths = {
        'overview': 'overview.html',
        'users': 'users.html',
        'routes': 'routes.html',
        'schedules': 'schedules.html',
        'reports': 'reports.html',
        'requests': 'requests.html',
        'settings': 'settings.html'
    };
    
    // Get content container
    const contentContainer = document.getElementById('content-container');
    
    // Sidebar menu functionality
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    
    // Function to load content
    function loadContent(sectionId) {
        fetch(sectionPaths[sectionId])
            .then(response => response.text())
            .then(html => {
                contentContainer.innerHTML = html;
                
                // Initialize section-specific functionality
                if (sectionId === 'routes') {
                    initializeRoutesFunctionality();
                }
                
                if (sectionId === 'users') {
                    initializeUsersFunctionality();
                }
                
                if (sectionId === 'schedules') {
                    initializeSchedulesFunctionality();
                }
            })
            .catch(error => {
                console.error('Error loading content:', error);
                contentContainer.innerHTML = `<div class="content-section"><h2>Error</h2><p>Failed to load ${sectionId} content.</p></div>`;
            });
    }
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Get section ID and load content
            const sectionId = this.getAttribute('data-section');
            loadContent(sectionId);
        });
    });
    
    // Initialize with overview section
    loadContent('overview');
    
    // Route Management Specific JavaScript
    function initializeRoutesFunctionality() {
        const mapButtons = document.querySelectorAll('.actions .bx-map');
        const routeMapContainer = document.querySelector('.route-map-container');
        const closeMapBtn = document.querySelector('.close-map-btn');
        
        // Show route map when map icon is clicked
        if (mapButtons) {
            mapButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const routeName = row.cells[0].textContent;
                    const district = row.cells[1].textContent;
                    const driver = row.cells[2].textContent;
                    const truck = row.cells[3].textContent;
                    const days = row.cells[4].textContent;
                    
                    // Update the route details in the map view
                    document.getElementById('selected-route-name').textContent = routeName;
                    document.getElementById('route-district').textContent = district;
                    document.getElementById('route-driver').textContent = driver;
                    document.getElementById('route-truck').textContent = truck;
                    document.getElementById('route-days').textContent = days;
                    
                    // Show the route map container
                    routeMapContainer.style.display = 'block';
                    
                    // Hide the table view (optional)
                    document.querySelector('.table-container').style.display = 'none';
                });
            });
        }
        
        // Close map and return to table view
        if (closeMapBtn) {
            closeMapBtn.addEventListener('click', function() {
                routeMapContainer.style.display = 'none';
                document.querySelector('.table-container').style.display = 'block';
            });
        }
        
        // Search functionality for routes
        const routeSearchInput = document.querySelector('#routes-section .search-input');
        const routeSearchBtn = document.querySelector('#routes-section .search-btn');
        
        if (routeSearchBtn && routeSearchInput) {
            routeSearchBtn.addEventListener('click', function() {
                searchRoutes();
            });
            
            routeSearchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    searchRoutes();
                }
            });
        }
    }
    
    function searchRoutes() {
        const searchTerm = document.querySelector('#routes-section .search-input').value.toLowerCase();
        const routeRows = document.querySelectorAll('#routes-section .data-table tbody tr');
        
        routeRows.forEach(row => {
            let found = false;
            // Search in each cell of the row
            row.querySelectorAll('td').forEach(cell => {
                if (cell.textContent.toLowerCase().includes(searchTerm)) {
                    found = true;
                }
            });
            
            if (found) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    function initializeUsersFunctionality() {
        // Search functionality for users
        const userSearchInput = document.querySelector('#users-section .search-input');
        const userSearchBtn = document.querySelector('#users-section .search-btn');
        
        if (userSearchBtn && userSearchInput) {
            userSearchBtn.addEventListener('click', function() {
                searchUsers();
            });
            
            userSearchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    searchUsers();
                }
            });
        }
    }
    
    function searchUsers() {
        const searchTerm = document.querySelector('#users-section .search-input').value.toLowerCase();
        const userRows = document.querySelectorAll('#users-section .data-table tbody tr');
        
        userRows.forEach(row => {
            let found = false;
            // Search in each cell of the row
            row.querySelectorAll('td').forEach(cell => {
                if (cell.textContent.toLowerCase().includes(searchTerm)) {
                    found = true;
                }
            });
            
            if (found) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    function initializeSchedulesFunctionality() {
        // Add schedule-specific functionality here if needed
    }
});