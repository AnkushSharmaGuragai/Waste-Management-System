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
        let map = null;
        
        // Show route map when map icon is clicked
        if (mapButtons) {
            mapButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const routeName = row.cells[0].textContent;
                    const locations = row.cells[1].textContent;
                    const schedule = row.cells[2].textContent;
                    
                    // Update the route details in the map view
                    document.getElementById('selected-route-name').textContent = routeName;
                    document.getElementById('route-locations').textContent = locations;
                    
                    // Parse and display schedule items
                    const scheduleList = document.getElementById('route-schedule');
                    scheduleList.innerHTML = ''; // Clear existing schedule items
                    
                    // Split by commas and then by parentheses to separate each day/time entry
                    const scheduleItems = schedule.split(',');
                    scheduleItems.forEach(item => {
                        const dayTimeMatch = item.trim().match(/([A-Za-z]+)\s*\((.*?)\)/);
                        if (dayTimeMatch) {
                            const day = dayTimeMatch[1];
                            const time = dayTimeMatch[2];
                            
                            const scheduleItem = document.createElement('div');
                            scheduleItem.className = 'schedule-item';
                            scheduleItem.innerHTML = `
                                <div class="schedule-day">${day}</div>
                                <div class="schedule-time">${time}</div>
                            `;
                            scheduleList.appendChild(scheduleItem);
                        }
                    });
                    
                    // Show the route map container
                    routeMapContainer.style.display = 'block';
                    
                    // Hide the table view
                    document.querySelector('.table-container').style.display = 'none';
                    
                    // Create locations list
                    const locationsList = document.querySelector('.locations-list');
                    locationsList.innerHTML = ''; // Clear existing locations
                    
                    const locationsArray = locations.split(',');
                    locationsArray.forEach((location, index) => {
                        const locationItem = document.createElement('li');
                        locationItem.className = 'location-item';
                        locationItem.innerHTML = `
                            <span class="location-number">${index + 1}</span>
                            <p class="location-name">${location.trim()}</p>
                        `;
                        locationsList.appendChild(locationItem);
                    });
                    
                    // Initialize map after a slight delay to ensure container is visible
                    setTimeout(() => {
                        initializeMap(locationsArray);
                    }, 100);
                });
            });
        }
        
        // Close map and return to table view
        if (closeMapBtn) {
            closeMapBtn.addEventListener('click', function() {
                routeMapContainer.style.display = 'none';
                document.querySelector('.table-container').style.display = 'block';
                
                // Destroy map to prevent issues when re-opening
                if (map) {
                    map.remove();
                    map = null;
                }
            });
        }
        
        // Function to initialize Leaflet map
        function initializeMap(locations) {
            // Destroy existing map if any
            if (map) {
                map.remove();
                map = null;
            }
            
            // Get map container
            const mapContainer = document.querySelector('.route-map');
            mapContainer.innerHTML = '<div id="map-element" style="height: 400px; width: 100%;"></div>';
            
            // Nepal centered coordinates
            const nepalCenter = [27.7172, 85.3240]; // Kathmandu as default center
            
            // Initialize the map
            map = L.map('map-element').setView(nepalCenter, 12);
            
            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Location coordinates for common areas in Nepal
            // These are approximate - you should replace with actual coordinates
            const locationCoordinates = {
                'Baneshwor': [27.6980, 85.3421],
                'Koteshwor': [27.6794, 85.3497],
                'Boudha': [27.7214, 85.3621],
                'Thamel': [27.7151, 85.3123],
                'Patan': [27.6747, 85.3207],
                'Bhaktapur': [27.6718, 85.4277],
                'Lalitpur': [27.6588, 85.3247],
                'Maharajgunj': [27.7396, 85.3468],
                'Lazimpat': [27.7240, 85.3202],
                // Add more locations as needed
            };
            
            // Array to store markers for bounds calculation
            const markers = [];
            
            // Create markers for each location
            locations.forEach((location, index) => {
                const cleanLocation = location.trim();
                
                if (locationCoordinates[cleanLocation]) {
                    const marker = L.marker(locationCoordinates[cleanLocation])
                        .addTo(map)
                        .bindPopup(`<b>Stop ${index + 1}:</b> ${cleanLocation}`);
                    
                    markers.push(marker);
                } else {
                    console.warn(`No coordinates found for location: "${cleanLocation}"`);
                }
            });
            
            // Connect locations with a line to show the route
            if (markers.length > 1) {
                const routePoints = markers.map(marker => marker.getLatLng());
                const routeLine = L.polyline(routePoints, {color: '#08CC7B', weight: 5}).addTo(map);
                
                // Fit the map to show all markers
                const bounds = L.latLngBounds(routePoints);
                map.fitBounds(bounds.pad(0.1)); // Add 10% padding around the bounds
            } else if (markers.length === 1) {
                // If only one marker, center on it
                map.setView(markers[0].getLatLng(), 14);
            }
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