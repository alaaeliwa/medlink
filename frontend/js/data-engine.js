/**
 * Data Engine for Citizen Dashboard
 * Handles Data representation, Pagination, Sorting, Filtering, and Custom Select Components
 */

// --- 1. MOCK DATA ---
const ALL_MEDICINES = [
  { id: 1, name: 'Panadol Extra (500mg)', category: 'Pain Relief', price: 5.00, pharmacies: 12, img: 'images/MID.webp', fav: false },
  { id: 2, name: 'Augmentin 1g', category: 'Antibiotics', price: 18.50, pharmacies: 5, img: 'images/MID.webp', fav: true },
  { id: 3, name: 'Aspirin Protect 100mg', category: 'Cardiology', price: 8.20, pharmacies: 8, img: 'images/MID.webp', fav: false },
  { id: 4, name: 'Zyrtec 10mg', category: 'Allergy', price: 12.00, pharmacies: 15, img: 'images/MID.webp', fav: false },
  { id: 5, name: 'Cataflam 50mg', category: 'Pain Relief', price: 4.50, pharmacies: 21, img: 'images/MID.webp', fav: false },
  { id: 6, name: 'Nexium 40mg', category: 'Gastrointestinal', price: 22.00, pharmacies: 7, img: 'images/MID.webp', fav: false },
  { id: 7, name: 'Amoxil 500mg', category: 'Antibiotics', price: 15.00, pharmacies: 9, img: 'images/MID.webp', fav: false },
  { id: 8, name: 'Concor 5mg', category: 'Cardiology', price: 14.20, pharmacies: 11, img: 'images/MID.webp', fav: false },
  { id: 9, name: 'Claritin 10mg', category: 'Allergy', price: 9.50, pharmacies: 14, img: 'images/MID.webp', fav: false },
  { id: 10, name: 'Brufen 400mg', category: 'Pain Relief', price: 6.00, pharmacies: 25, img: 'images/MID.webp', fav: true },
  { id: 11, name: 'Gaviscon Advance', category: 'Gastrointestinal', price: 11.00, pharmacies: 18, img: 'images/MID.webp', fav: false },
  { id: 12, name: 'Telfast 120mg', category: 'Allergy', price: 13.50, pharmacies: 8, img: 'images/MID.webp', fav: false },
  { id: 13, name: 'Lipitor 20mg', category: 'Cardiology', price: 35.00, pharmacies: 4, img: 'images/MID.webp', fav: false },
  { id: 14, name: 'Voltaren Emulgel', category: 'Pain Relief', price: 8.50, pharmacies: 20, img: 'images/MID.webp', fav: false }
];

const ALL_PHARMACIES = [
  { id: 1, name: 'Al Shifa Pharmacy', area: 'Downtown', rating: 4.9, reviews: 120, distance: 1.2, status: 'Open Now', img: 'images/PHAR.jpg' },
  { id: 2, name: 'CarePlus Pharmacy', area: 'Downtown', rating: 4.7, reviews: 85, distance: 2.5, status: 'Open 24/7', img: 'images/PHAR.jpg' },
  { id: 3, name: 'LifeStyle Pharmacy', area: 'West End', rating: 4.5, reviews: 64, distance: 3.8, status: 'Closed', img: 'images/PHAR.jpg' },
  { id: 4, name: 'Medix Care Store', area: 'North District', rating: 4.8, reviews: 210, distance: 4.1, status: 'Open Now', img: 'images/PHAR.jpg' },
  { id: 5, name: 'QuickMeds Pharmacy', area: 'North District', rating: 4.2, reviews: 45, distance: 7.5, status: 'Open 24/7', img: 'images/PHAR.jpg' },
  { id: 6, name: 'Trust Pharmacy Center', area: 'East Side', rating: 4.6, reviews: 92, distance: 8.0, status: 'Closed', img: 'images/PHAR.jpg' },
  { id: 7, name: 'City Central Pharma', area: 'Downtown', rating: 4.4, reviews: 150, distance: 0.8, status: 'Open Now', img: 'images/PHAR.jpg' },
  { id: 8, name: 'Wellness Hub', area: 'West End', rating: 4.9, reviews: 300, distance: 5.2, status: 'Open 24/7', img: 'images/PHAR.jpg' }
];

// --- 2. STATE ---
let currentPage = 1;
const ITEMS_PER_PAGE = 6;
let currentCategoryFilter = 'All';
let currentSortFilter = 'Default';
let currentSearchQuery = '';

// Determine page context
const isMedicinesPage = document.getElementById('medicines-grid') !== null;
const isPharmaciesPage = document.getElementById('pharmacies-grid') !== null;
const gridContainer = document.getElementById('medicines-grid') || document.getElementById('pharmacies-grid');
const paginationContainer = document.getElementById('dynamic-pagination');
const statsDisplay = document.getElementById('stats-display');

// --- 3. CUSTOM SELECT COMPONENT LOGIC ---
function initCustomSelects() {
  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');
    const options = select.querySelectorAll('.custom-option');
    const filterType = select.dataset.filterType; // 'category' or 'sort'

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      // Close other selects
      customSelects.forEach(s => {
        if (s !== select) s.classList.remove('open');
      });
      select.classList.toggle('open');
    });

    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Update selection UI
        options.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        // Update trigger text
        trigger.querySelector('span').textContent = this.textContent;
        select.classList.remove('open');
        
        // Apply filter logic
        const value = this.dataset.value;
        if(filterType === 'category') {
          currentCategoryFilter = value;
        } else if (filterType === 'sort') {
          currentSortFilter = value;
        }
        
        // Reset to page 1 and re-render
        currentPage = 1;
        renderData();
      });
    });
  });

  // Close selects when clicking outside
  document.addEventListener('click', () => {
    customSelects.forEach(s => s.classList.remove('open'));
  });
}

// --- 4. RENDER LOGIC ---
function renderData() {
  if(!gridContainer) return;
  
  let dataSet = isMedicinesPage ? [...ALL_MEDICINES] : [...ALL_PHARMACIES];
  
  // A. Filter by Search Query
  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    dataSet = dataSet.filter(item => item.name.toLowerCase().includes(q));
  }
  
  // B. Filter by Category / Status
  if (currentCategoryFilter !== 'All') {
    if (isMedicinesPage) {
      dataSet = dataSet.filter(item => item.category === currentCategoryFilter);
    } else {
      if(currentCategoryFilter === 'Open Now' || currentCategoryFilter === 'Open 24/7') {
         dataSet = dataSet.filter(item => item.status === currentCategoryFilter);
      } else {
         dataSet = dataSet.filter(item => item.area === currentCategoryFilter);
      }
    }
  }
  
  // C. Sorting
  if (currentSortFilter !== 'Default') {
    if (isMedicinesPage) {
      if(currentSortFilter === 'PriceLow') dataSet.sort((a,b) => a.price - b.price);
      if(currentSortFilter === 'PriceHigh') dataSet.sort((a,b) => b.price - a.price);
      if(currentSortFilter === 'A-Z') dataSet.sort((a,b) => a.name.localeCompare(b.name));
    } else {
      if(currentSortFilter === 'Nearest') dataSet.sort((a,b) => a.distance - b.distance);
      if(currentSortFilter === 'Highest Rated') dataSet.sort((a,b) => b.rating - a.rating);
    }
  }
  
  // D. Pagination Math
  const totalItems = dataSet.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  if(currentPage > totalPages) currentPage = totalPages;
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageData = dataSet.slice(startIndex, endIndex);
  
  // E. Update Stats Text
  if(statsDisplay) {
    if(totalItems === 0) {
      statsDisplay.textContent = `Showing 0 results`;
    } else {
      statsDisplay.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems} ${isMedicinesPage ? 'medicines' : 'pharmacies'}`;
    }
  }
  
  // F. Render Grid HTML
  gridContainer.innerHTML = '';
  
  if (pageData.length === 0) {
    gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">No items matched your filters.</div>`;
  }
  
  pageData.forEach(item => {
    let cardHTML = '';
    if (isMedicinesPage) {
      const favClass = item.fav ? 'fas text-danger' : 'far';
      const activeClass = item.fav ? 'active' : '';
      cardHTML = `
        <div class="modern-card">
          <div class="card-image-wrapper">
            <img src="${item.img}" alt="${item.name}" class="card-img" />
            <button class="favorite-btn floating-action ${activeClass}"><i class="${favClass} fa-heart"></i></button>
            <div class="glass-badge">${item.category}</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">${item.name}</h3>
            <div class="card-meta">
              <div class="meta-item"><i class="fas fa-store-alt text-success"></i> <span>${item.pharmacies} Pharmacies</span></div>
              <div class="meta-item"><i class="fas fa-tag text-accent"></i> <span>From $${item.price.toFixed(2)}</span></div>
            </div>
            <a href="medicine-details.html" class="btn btn-outline w-full modern-btn-outline" style="text-align: center;">View Details</a>
          </div>
        </div>
      `;
    } else {
      let badgeClass = 'success-badge';
      let badgeIcon = 'fa-circle';
      if(item.status === 'Closed') {
        badgeClass = 'danger-badge';
        badgeIcon = 'fa-clock';
      }
      
      const favClass = 'far'; // defaults mostly unchecked
      cardHTML = `
        <div class="modern-card">
          <div class="card-image-wrapper pharmacy-wrapper">
            <img src="${item.img}" alt="${item.name}" class="card-img" />
            <button class="favorite-btn floating-action"><i class="far fa-heart"></i></button>
            <div class="glass-badge ${badgeClass}"><i class="fas ${badgeIcon} text-xs"></i> ${item.status}</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">${item.name}</h3>
            <p class="pharmacy-address"><i class="fas fa-map-marker-alt text-accent"></i> ${item.area}</p>
            <div class="pharmacy-stats">
              <span class="rating"><i class="fas fa-star text-warning"></i> ${item.rating} (${item.reviews})</span>
              <span class="distance"><i class="fas fa-location-arrow text-muted"></i> ${item.distance} km</span>
            </div>
            <a href="pharmacy-details.html" class="btn btn-outline w-full modern-btn-outline pharmacy-btn" style="text-align: center;">View Pharmacy</a>
          </div>
        </div>
      `;
    }
    gridContainer.insertAdjacentHTML('beforeend', cardHTML);
  });
  
  // Re-bind favorite buttons!
  const newFavBtns = gridContainer.querySelectorAll('.favorite-btn');
  newFavBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.toggle('active');
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

  // G. Render Pagination HTML
  renderPaginationData(totalPages);
}

function renderPaginationData(totalPages) {
  if(!paginationContainer) return;
  paginationContainer.innerHTML = '';
  
  if(totalPages <= 1) return; // don't show pagination if only 1 page
  
  // Prev button
  const prevDisabled = currentPage === 1 ? 'disabled' : '';
  let html = `<button class="page-btn nav-btn" data-page="prev" ${prevDisabled}><i class="fas fa-chevron-left" style="margin-right: 6px;"></i> Prev</button>`;
  
  // Page buttons
  for(let i = 1; i <= totalPages; i++) {
    const activeClass = currentPage === i ? 'active' : '';
    html += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
  }
  
  // Next button
  const nextDisabled = currentPage === totalPages ? 'disabled' : '';
  html += `<button class="page-btn nav-btn" data-page="next" ${nextDisabled}>Next <i class="fas fa-chevron-right" style="margin-left: 6px;"></i></button>`;
  
  paginationContainer.innerHTML = html;
  
  // Bind pagination events
  const pageBtns = paginationContainer.querySelectorAll('.page-btn');
  pageBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if(this.disabled || this.classList.contains('active')) return;
      
      const action = this.dataset.page;
      if(action === 'prev') currentPage--;
      else if(action === 'next') currentPage++;
      else currentPage = parseInt(action);
      
      renderData();
      
      // scroll to top smoothly
      window.scrollTo({ top: document.querySelector('.search-section').offsetTop - 20, behavior: 'smooth' });
    });
  });
}

// --- 5. OVERRIDE SEARCH IN citizen-dashboard.js ---
// Since we have a robust data engine now, we need to tie the global search input into it.
document.addEventListener('DOMContentLoaded', () => {
  initCustomSelects();
  renderData(); // Initial render
  
  const searchInput = document.getElementById('medicine-search');
  if(searchInput) {
    // override the default citizen-dashboard simulateSearch by capturing 'input' again
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      currentPage = 1;
      renderData();
    });
  }
});
