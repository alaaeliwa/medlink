/**
 * Data Engine — API Connected
 * All mock ALL_MEDICINES and ALL_PHARMACIES arrays replaced with real API calls.
 * All UI logic: pagination, sorting, filtering, custom selects, card rendering — kept exactly as-is.
 */

// --- 1. STATE ---
// REMOVED: ALL_MEDICINES and ALL_PHARMACIES mock arrays
// These are now fetched from the API and stored here
let apiDataset = []; // holds the full current dataset from the API
let isLoading = false;

let currentPage = 1;
const ITEMS_PER_PAGE = 6;
let currentCategoryFilter = "All";
let currentSortFilter = "Default";
let currentSearchQuery = "";

// Page context detection — kept exactly as-is
const isMedicinesPage = document.getElementById("medicines-grid") !== null;
const isPharmaciesPage = document.getElementById("pharmacies-grid") !== null;
const gridContainer =
  document.getElementById("medicines-grid") ||
  document.getElementById("pharmacies-grid");
const paginationContainer = document.getElementById("dynamic-pagination");
const statsDisplay = document.getElementById("stats-display");

// --- 2. API FETCH FUNCTIONS ---
// REPLACED: reading from hardcoded ALL_MEDICINES / ALL_PHARMACIES
// NOW: fetches from real API with current filters applied

async function fetchFromAPI() {
  if (!gridContainer) return;
  isLoading = true;
  showSkeletonCards();

  let res;

  if (isMedicinesPage) {
    // Build query params from current filter state
    const params = { per_page: 100 };

    if (currentSearchQuery) params.search = currentSearchQuery;
    if (currentCategoryFilter !== "All")
      params.category = currentCategoryFilter;
    if (currentSortFilter === "PriceLow") params.sort = "price_asc";
    else if (currentSortFilter === "PriceHigh") params.sort = "price_desc";
    else if (currentSortFilter === "A-Z") params.sort = "name_asc";

    console.log(
      "[Medicines Filter] Category:",
      currentCategoryFilter,
      "| Sort:",
      currentSortFilter,
      "| Params:",
      params,
    );
    res = await MedicinesAPI.list(params);

    // Map API shape → shape the card renderer expects
    apiDataset = (res?.data?.medicines || []).map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category || "General",
      price: parseFloat(m.lowestPrice || m.averagePrice || 0),
      pharmacies: m.pharmaciesCount || 0,
      img: "../images/MID.webp", // fallback image
      fav: m.isFavorite || false,
    }));
  } else {
    // Pharmacies page
    const params = { per_page: 100 };

    if (currentSearchQuery) params.search = currentSearchQuery;

    // Area filter
    if (
      currentCategoryFilter !== "All" &&
      currentCategoryFilter !== "Open Now" &&
      currentCategoryFilter !== "Open 24/7"
    ) {
      params.area = currentCategoryFilter;
    }

    // Sort
    if (currentSortFilter === "Highest Rated") params.sort = "rating_high";

    console.log(
      "[Pharmacies Filter] Category:",
      currentCategoryFilter,
      "| Sort:",
      currentSortFilter,
      "| Params:",
      params,
    );
    res = await PharmaciesAPI.list(params);

    // Map API shape → shape the card renderer expects
    apiDataset = (res?.data?.pharmacies || []).map((p) => ({
      id: p.id,
      name: p.name,
      area: p.area || "—",
      rating: parseFloat(p.rating || 0),
      reviews: p.reviewCount || 0,
      status: p.isOpenNow ? "Open Now" : "Closed",
      img: p.profileImage || "../images/PHAR.jpg",
      fav: p.isFavorite || false,
    }));
  }

  isLoading = false;
  renderData();
}

// --- 3. CUSTOM SELECT COMPONENT LOGIC — IMPROVED ---
let selectsInitialized = false;
function initCustomSelects() {
  if (selectsInitialized) return;
  selectsInitialized = true;

  document.addEventListener("click", function (e) {
    // 1. Click on trigger
    const trigger = e.target.closest(".custom-select-trigger");
    if (trigger) {
      const select = trigger.closest(".custom-select");
      document.querySelectorAll(".custom-select").forEach((s) => {
        if (s !== select) s.classList.remove("open");
      });
      select.classList.toggle("open");
      return;
    }

    // 2. Click on option
    const option = e.target.closest(".custom-option");
    if (option) {
      const select = option.closest(".custom-select");
      if (!select) return;

      select.querySelectorAll(".custom-option").forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      
      const span = select.querySelector(".custom-select-trigger span");
      if (span) span.textContent = option.textContent;
      
      select.classList.remove("open");

      const filterType = select.dataset.filterType;
      const value = option.dataset.value;
      console.log(`[Filter Changed] Type: ${filterType}, Value: ${value}`);
      if (filterType === "category") {
        currentCategoryFilter = value;
      } else if (filterType === "sort") {
        currentSortFilter = value;
      }

      // CHANGED: reset page and re-fetch from API
      currentPage = 1;
      fetchFromAPI();
      return;
    }

    // 3. Click outside
    document.querySelectorAll(".custom-select").forEach((s) => s.classList.remove("open"));
  });
}

// --- 4. RENDER LOGIC — kept exactly as-is ---
// Now reads from apiDataset instead of ALL_MEDICINES / ALL_PHARMACIES
// but the pagination math, card HTML, and favorite binding are all unchanged
function renderData() {
  if (!gridContainer) return;

  let dataSet = [...apiDataset];

  // 1. Client-side Search filter
  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    dataSet = dataSet.filter((item) => item.name.toLowerCase().includes(q));
  }

  // 2. Client-side Category / Area / Status filter
  if (isMedicinesPage) {
    if (currentCategoryFilter !== "All") {
      dataSet = dataSet.filter(
        (item) => item.category === currentCategoryFilter,
      );
    }
  } else {
    // Pharmacies Page
    if (
      currentCategoryFilter === "Open Now" ||
      currentCategoryFilter === "Open 24/7"
    ) {
      dataSet = dataSet.filter(
        (p) => p.status === currentCategoryFilter || p.status === "Open Now",
      );
    } else if (currentCategoryFilter !== "All") {
      dataSet = dataSet.filter((p) => p.area === currentCategoryFilter);
    }
  }

  // 3. Client-side Sorting
  if (isMedicinesPage) {
    if (currentSortFilter === "PriceLow") {
      dataSet.sort((a, b) => a.price - b.price);
    } else if (currentSortFilter === "PriceHigh") {
      dataSet.sort((a, b) => b.price - a.price);
    } else if (currentSortFilter === "A-Z") {
      dataSet.sort((a, b) => a.name.localeCompare(b.name));
    }
  } else {
    // Pharmacies Page
    if (currentSortFilter === "Highest Rated") {
      dataSet.sort((a, b) => b.rating - a.rating);
    }
  }

  // D. Pagination Math — kept exactly as-is
  const totalItems = dataSet.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageData = dataSet.slice(startIndex, endIndex);

  // E. Update Stats Text — kept exactly as-is
  if (statsDisplay) {
    if (totalItems === 0) {
      statsDisplay.textContent = `Showing 0 results`;
    } else {
      statsDisplay.textContent = `Showing ${startIndex + 1}–${Math.min(endIndex, totalItems)} of ${totalItems} ${isMedicinesPage ? "medicines" : "pharmacies"}`;
    }
  }

  // F. Render Grid HTML — kept exactly as-is
  gridContainer.innerHTML = "";

  if (pageData.length === 0) {
    gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">No items matched your filters.</div>`;
  }

  pageData.forEach((item) => {
    let cardHTML = "";

    if (isMedicinesPage) {
      const favClass = item.fav ? "fas text-danger" : "far";
      const activeClass = item.fav ? "active" : "";
      // CHANGED: href now passes real database ID
      cardHTML = `
                <div class="modern-card">
                    <div class="card-image-wrapper">
                        <img src="${item.img}" alt="${item.name}" class="card-img" />
                        <button class="favorite-btn floating-action ${activeClass}"
                            data-type="medicine" data-id="${item.id}">
                            <i class="${favClass} fa-heart"></i>
                        </button>
                        <div class="glass-badge">${item.category}</div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${item.name}</h3>
                        <div class="card-meta">
                            <div class="meta-item"><i class="fas fa-store-alt text-success"></i> <span>${item.pharmacies} Pharmacies</span></div>
                            <div class="meta-item"><i class="fas fa-tag text-accent"></i> <span>From $${item.price.toFixed(2)}</span></div>
                        </div>
                        <a href="medicine-details.html?id=${item.id}" class="btn btn-outline w-full modern-btn-outline" style="text-align: center;">View Details</a>
                    </div>
                </div>
            `;
    } else {
      let badgeClass = "success-badge";
      let badgeIcon = "fa-circle";
      if (item.status === "Closed") {
        badgeClass = "danger-badge";
        badgeIcon = "fa-clock";
      }
      // CHANGED: href now passes real database ID
      cardHTML = `
                <div class="modern-card">
                    <div class="card-image-wrapper pharmacy-wrapper">
                        <img src="${item.img}" alt="${item.name}" class="card-img" onerror="this.src='images/PHAR.jpg'" />
                        <button class="favorite-btn floating-action ${item.fav ? "active" : ""}"
                            data-type="pharmacy" data-id="${item.id}">
                            <i class="${item.fav ? "fas text-danger" : "far"} fa-heart"></i>
                        </button>
                        <div class="glass-badge ${badgeClass}"><i class="fas ${badgeIcon} text-xs"></i> ${item.status}</div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${item.name}</h3>
                        <p class="pharmacy-address"><i class="fas fa-map-marker-alt text-accent"></i> ${item.area}</p>
                        <div class="pharmacy-stats">
                            <span class="rating"><i class="fas fa-star text-warning"></i> ${item.rating.toFixed(1)} (${item.reviews})</span>
                        </div>
                        <a href="pharmacy-details.html?id=${item.id}" class="btn btn-outline w-full modern-btn-outline pharmacy-btn" style="text-align: center;">View Pharmacy</a>
                    </div>
                </div>
            `;
    }

    gridContainer.insertAdjacentHTML("beforeend", cardHTML);
  });

  // Re-bind favorite buttons
  gridContainer.querySelectorAll(".favorite-btn").forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();

      const type = this.dataset.type;
      const targetId = this.dataset.id;
      if (!targetId) return;

      // Optimistic visual toggle
      const isNowActive = !this.classList.contains("active");
      this.classList.toggle("active", isNowActive);
      const icon = this.querySelector("i");
      if (isNowActive) {
        icon.classList.replace("far", "fas");
        icon.classList.add("text-danger");
      } else {
        icon.classList.remove("fas", "text-danger");
        icon.classList.add("far");
      }

      const targetData = apiDataset.find(item => String(item.id) === String(targetId)) || {};
      const res = await FavoritesAPI.toggle(type, targetId, targetData);

      if (res?.success) {
        const isFav = res.data?.isFavorite;
        MedLinkUI.toast(isFav ? "Added to favorites" : "Removed from favorites", "success");
      } else {
        // Revert visual on failure
        this.classList.toggle("active", !isNowActive);
        if (!isNowActive) {
          icon.classList.replace("far", "fas");
          icon.classList.add("text-danger");
        } else {
          icon.classList.remove("fas", "text-danger");
          icon.classList.add("far");
        }
      }
    });
  });

  // G. Render Pagination — kept exactly as-is
  renderPaginationData(totalPages);
}

// --- 5. PAGINATION — kept exactly as-is ---
function renderPaginationData(totalPages) {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";
  if (totalPages <= 1) return;

  const prevDisabled = currentPage === 1 ? "disabled" : "";
  let html = `<button class="page-btn nav-btn" data-page="prev" ${prevDisabled}><i class="fas fa-chevron-left" style="margin-right: 6px;"></i> Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${currentPage === i ? "active" : ""}" data-page="${i}">${i}</button>`;
  }

  const nextDisabled = currentPage === totalPages ? "disabled" : "";
  html += `<button class="page-btn nav-btn" data-page="next" ${nextDisabled}>Next <i class="fas fa-chevron-right" style="margin-left: 6px;"></i></button>`;

  paginationContainer.innerHTML = html;

  paginationContainer.querySelectorAll(".page-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.disabled || this.classList.contains("active")) return;

      const action = this.dataset.page;
      if (action === "prev") currentPage--;
      else if (action === "next") currentPage++;
      else currentPage = parseInt(action);

      // CHANGED: re-fetch from API on page change to get fresh page data
      // (API handles pagination server-side for large datasets)
      renderData(); // uses already-fetched apiDataset, just re-slices

      const searchSection = document.querySelector(".search-section");
      if (searchSection)
        window.scrollTo({
          top: searchSection.offsetTop - 20,
          behavior: "smooth",
        });
    });
  });
}

// --- 6. SKELETON CARDS while loading ---
// NEW: shows placeholder cards while API is fetching
function showSkeletonCards() {
  if (!gridContainer) return;
  gridContainer.innerHTML = Array(ITEMS_PER_PAGE)
    .fill("")
    .map(
      () => `
        <div class="modern-card" style="opacity:0.5; pointer-events:none;">
            <div style="height:180px; background:var(--border,#e5e7eb); border-radius:12px 12px 0 0;"></div>
            <div class="card-content" style="display:flex; flex-direction:column; gap:10px; padding:16px;">
                <div style="height:18px; background:var(--border,#e5e7eb); border-radius:6px; width:80%;"></div>
                <div style="height:14px; background:var(--border,#e5e7eb); border-radius:6px; width:60%;"></div>
                <div style="height:36px; background:var(--border,#e5e7eb); border-radius:8px; margin-top:8px;"></div>
            </div>
        </div>
    `,
    )
    .join("");
}

// --- 7. DYNAMIC CATEGORIES ---
async function loadCategories() {
  const container = document.getElementById("category-options");
  if (!container) return;

  const res = await MedicinesAPI.categories();
  if (!res?.success) {
    console.warn("[loadCategories] Failed to load categories");
    return;
  }

  const categories = res.data.filter((c) => c.medicineCount > 0);
  console.log("[loadCategories] Found categories:", categories);

  categories.forEach((cat) => {
    const span = document.createElement("span");
    span.className = "custom-option";
    span.dataset.value = cat.name;
    span.textContent = cat.name;
    container.appendChild(span);
  });

  // Event delegation handles new options automatically
}

// --- 8. BOOT ---
document.addEventListener("DOMContentLoaded", () => {
  initCustomSelects();
  loadCategories();

  // CHANGED: initial load from API instead of mock array
  fetchFromAPI();

  // Search — CHANGED: re-fetches from API on each keystroke (debounced)
  const searchInput = document.getElementById("medicine-search");
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearchQuery = e.target.value.trim();
        currentPage = 1;
        fetchFromAPI();
      }, 350); // debounce: wait 350ms after user stops typing
    });
  }
});
