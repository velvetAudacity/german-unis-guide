document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Example: Placeholder for button functionality
    const checkDeadlinesBtn = document.getElementById('checkDeadlinesBtn');
    if (checkDeadlinesBtn) {
        checkDeadlinesBtn.addEventListener('click', function() {
            alert('This feature (checking specific university deadlines) will be implemented later! It would typically involve fetching data or linking to relevant university portals.');
        });
    }

    function setActiveLink(){
        const navLinksCntainer = document.querySelector('.navbar .nav-links')
        if(!navLinksContainer){
            console.error('Navigation links container not found')
            return;
        }

    }
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.querySelector('.search-input-container');
    const searchInput = document.getElementById('search-input');
    
    // Toggle search input visibility
    searchToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        searchContainer.classList.toggle('active');
        
        // Focus input when shown
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        } else {
            // Clear input when hiding
            searchInput.value = '';
        }
    });
    
    // Close search and clear input when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchContainer.classList.remove('active');
            searchInput.value = ''; // Clear the input
        }
    });
    
    // Handle search submission
    document.getElementById('search-submit').addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            // Implement your search functionality here
            alert('Searching for: ' + query);
            // window.location.href = '/search?q=' + encodeURIComponent(query);
            
            // Optional: Clear after search
            searchInput.value = '';
            searchContainer.classList.remove('active');
        }
    });
    
    // Allow search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('search-submit').click();
        }
    });
    
    // Clear input when pressing Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchContainer.classList.remove('active');
        }
    });
  

    // You can add more interactive features here later, such as:
    // - Filtering lists
    // - Showing/hiding content sections (accordions)
    // - Making API calls to your Python backend to fetch dynamic data
    // - Validating forms
    console.log('Frontend JavaScript loaded.');
});