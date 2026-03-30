/**
 * Citizen Dashboard Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- User Profile Context from LocalStorage ---
  const storedName = localStorage.getItem('medlink_userName');
  const storedFirstName = localStorage.getItem('medlink_firstName');
  const storedEmail = localStorage.getItem('medlink_userEmail');

  if (storedName && storedEmail) {
    // 1. Update Profile Navbar Dropdown across all pages
    const profileNameEl = document.querySelector('.dropdown-header strong');
    const profileEmailEl = document.querySelector('.dropdown-header p.text-muted');
    if (profileNameEl) profileNameEl.textContent = storedName;
    if (profileEmailEl) profileEmailEl.textContent = storedEmail;

    // 2. Update Welcome Banner text (specifically on dashboard)
    const welcomeBadge = document.querySelector('.welcome-text .badge-accent');
    if (welcomeBadge) {
      welcomeBadge.innerHTML = `<i class="fas fa-hand-sparkles"></i> Hello, ${storedFirstName || storedName}`;
    }

    // 3. Pre-fill Settings Form (if on settings.html)
    const settingsNameInput = document.getElementById('settings-name');
    const settingsEmailInput = document.getElementById('settings-email');
    if (settingsNameInput) settingsNameInput.value = storedName;
    if (settingsEmailInput) settingsEmailInput.value = storedEmail;
  }

  // --- Dynamic Layout Configuration ---
  const profileBtn = document.getElementById('profileToggle');
  const profileDropdown = document.querySelector('.profile-dropdown');

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('open');
      }
    });
  }

  // --- Mobile Menu Toggle ---
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // --- Favorite Button Toggle (Instant Feedback) ---
  const favoriteBtns = document.querySelectorAll('.favorite-btn');
  
  favoriteBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle 'active' class
      this.classList.toggle('active');
      
      // Update the icon class
      const icon = this.querySelector('i');
      if (this.classList.contains('active')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-danger');
      } else {
        icon.classList.remove('fas', 'text-danger');
        icon.classList.add('far');
      }
    });
  });

  // --- Smart Search & Empty State Simulation ---
  const searchInput = document.getElementById('medicine-search');
  const searchBtn = document.getElementById('btn-search');
  const searchResultsContainer = document.getElementById('search-results');
  const emptyState = document.getElementById('empty-state');
  const searchQueryDisplay = document.getElementById('search-query-display');

  function simulateSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.modern-card');
    
    if (query === '') {
      if(searchResultsContainer) searchResultsContainer.style.display = 'none';
      cards.forEach(card => card.style.display = 'flex');
      return;
    }
    
    let found = false;
    cards.forEach(card => {
      const titleEl = card.querySelector('.card-title');
      if (titleEl && titleEl.textContent.toLowerCase().includes(query)) {
        card.style.display = 'flex';
        found = true;
      } else {
        card.style.display = 'none';
      }
    });

    if (!found) {
      if(searchResultsContainer) searchResultsContainer.style.display = 'block';
      if(emptyState) emptyState.style.display = 'block';
      if(searchQueryDisplay) searchQueryDisplay.textContent = searchInput.value;
      const reqInput = document.getElementById('req-medicine-name');
      if(reqInput) reqInput.value = searchInput.value;
    } else {
      if(searchResultsContainer) searchResultsContainer.style.display = 'none';
      if(emptyState) emptyState.style.display = 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', simulateSearch);
  }

  // --- Modal Logic : Request Medicine ---
  const modalOverlay = document.getElementById('request-modal');
  const btnRequestMedicine = document.getElementById('btn-request-medicine');
  const closeModalBtn = document.getElementById('close-modal');
  const requestForm = document.getElementById('request-form');

  // Open Modal
  if (btnRequestMedicine) {
    btnRequestMedicine.addEventListener('click', () => {
      modalOverlay.classList.add('active');
    });
  }

  // Close Modal (Button)
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  // Close Modal (Click Outside)
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // Handle Form Submit
  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent page reload
      
      const medName = document.getElementById('req-medicine-name').value;
      
      // In a real system, send this to backend.
      // For now, simply alert user and close modal to simulate success.
      alert(`Your request for "${medName}" has been submitted successfully! We will notify you when it becomes available.`);
      
      // Clean up UI
      modalOverlay.classList.remove('active');
      searchInput.value = '';
      searchResultsContainer.style.display = 'none';
      requestForm.reset();
    });
  }

  // --- Interactive Star Rating Widget ---
  const starWidgets = document.querySelectorAll('.star-rating-widget');
  starWidgets.forEach(widget => {
    const stars = widget.querySelectorAll('i');
    let currentRating = 0;

    stars.forEach(star => {
      // Hover effect: highlight up to this star
      star.addEventListener('mouseenter', function() {
        const rating = parseInt(this.getAttribute('data-rating'));
        highlightStars(stars, rating);
      });

      // Remove hover effect: revert to clicked state
      star.addEventListener('mouseleave', function() {
        highlightStars(stars, currentRating);
      });

      // Click to set rating permanent
      star.addEventListener('click', function() {
        currentRating = parseInt(this.getAttribute('data-rating'));
        highlightStars(stars, currentRating);
        
        // Find title element to give elegant feedback instead of alert
        const widgetContainer = widget.parentElement;
        if(widgetContainer) {
          const title = widgetContainer.querySelector('strong');
          if(title) {
            title.innerHTML = `<span class="text-success"><i class="fas fa-check-circle"></i> Rated ${currentRating} Stars</span>`;
          }
        }
        
        // Add a tiny bounce animation to the clicked star
        this.style.transform = 'scale(1.3)';
        setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
      });
    });

    function highlightStars(starsList, rating) {
      starsList.forEach(s => {
        const starRating = parseInt(s.getAttribute('data-rating'));
        if (starRating <= rating) {
          s.style.color = 'var(--warning)'; // Active gold color
        } else {
          s.style.color = '#cbd5e1'; // Inactive gray color
        }
      });
    }
  });

});
