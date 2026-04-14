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

    // 4. Update Profile Image dynamically across the dashboard
    const profileImgEl = document.querySelector('.profile-img');
    const userImage = localStorage.getItem('medlink_userImage');
    if (profileImgEl && window.mlAvatar) {
      const avatarHTML = window.mlAvatar(storedName, userImage, 'profile-img');
      // If no custom image, replace the default img with dynamic initial-based placeholder
      if (!userImage || userImage.includes('user.png')) {
          profileImgEl.outerHTML = avatarHTML;
      }
    }
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
      e.preventDefault(); 
      
      const medName = document.getElementById('req-medicine-name').value;
      const pharmacyName = "General Network"; // For out of stock requests
      
      // Save to OrdersEngine
      if(window.OrdersEngine) {
        window.OrdersEngine.submitOrder(pharmacyName, medName, 0);
      }
      
      mlAlert(`Your request for "${medName}" has been submitted to the network!`, 'success');
      
      // Clean up UI
      if(modalOverlay) modalOverlay.classList.remove('active');
      if(searchInput) searchInput.value = '';
      if(searchResultsContainer) searchResultsContainer.style.display = 'none';
      requestForm.reset();
    });
  }

  // --- NEW: Global Listener for Request Buttons ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-request');
    if (btn) {
      e.preventDefault();
      
      // 1. Extract Data
      const medName = btn.dataset.medicine || "Unknown Medicine";
      const price = parseFloat(btn.dataset.price) || 0;
      
      // If pharmacy is not in dataset, try to find it from page context
      let pharmacyName = btn.dataset.pharmacy;
      if (!pharmacyName) {
          const heroTitle = document.querySelector('.pharmacy-hero-title');
          pharmacyName = heroTitle ? heroTitle.textContent.trim() : "Local Pharmacy";
      }

      // 2. Confirmation
      window.mlConfirm(
        'Confirm Request',
        `Are you sure you want to request "${medName}" from ${pharmacyName}?`,
        'Request',
        () => {
            if(window.OrdersEngine) {
                window.OrdersEngine.submitOrder(pharmacyName, medName, price);
                window.mlAlert(`Request for ${medName} sent successfully!`, 'success');
                
                // Optional: visual feedback on button
                btn.innerHTML = '<i class="fas fa-check"></i> Requested';
                btn.classList.add('btn-success');
                btn.disabled = true;
            }
        }
      );
    }
  });

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

  // --- Complaint Modal Logic ---
  const complaintModal = document.getElementById('complaint-modal');
  const btnOpenComplaint = document.getElementById('btn-open-complaint');
  const btnCloseComplaint = document.getElementById('btn-close-complaint');
  const complaintForm = document.getElementById('complaint-form');

  if (btnOpenComplaint && complaintModal) {
    btnOpenComplaint.addEventListener('click', () => {
      complaintModal.classList.add('open');
    });
  }

  if (btnCloseComplaint && complaintModal) {
    btnCloseComplaint.addEventListener('click', () => {
      complaintModal.classList.remove('open');
    });
  }

  if (complaintModal) {
    complaintModal.addEventListener('click', (e) => {
      if (e.target === complaintModal) {
        complaintModal.classList.remove('open');
      }
    });
  }

  if (complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const category = document.getElementById('complaint-category').value;
      const details = document.getElementById('complaint-details').value;
      const heroTitle = document.querySelector('.pharmacy-hero-title');
      const pharmacyName = heroTitle ? heroTitle.textContent.trim() : "Local Pharmacy";

      if (window.OrdersEngine) {
        window.OrdersEngine.submitComplaint(pharmacyName, category, details);
        
        // Premium feedback
        mlAlert(`Complaint submitted regarding ${pharmacyName}. Our team will review it.`, 'info');
        
        // Close and Reset
        complaintModal.classList.remove('open');
        complaintForm.reset();
      }
    });
  }

});
