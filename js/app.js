/**
 * MedLink - Application Logic
 * Handles data simulation, search, auth, and dashboard interactions
 */

// 1. Simulated Data
const medicines = [
    { id: 1, name: "Panadol Advance 500mg", pharmacy: "Care Pharmacy", category: "Painkiller", price: 5.50, available: true, featured: true },
    { id: 2, name: "Amoxicillin 500mg", pharmacy: "Health First", category: "Antibiotic", price: 12.00, available: true, featured: true },
    { id: 3, name: "Ibuprofen 400mg", pharmacy: "City Pharma", category: "Painkiller", price: 4.20, available: false, featured: true },
    { id: 4, name: "Vitamin C 1000mg", pharmacy: "Care Pharmacy", category: "Supplement", price: 8.50, available: true, featured: false },
    { id: 5, name: "Aspirin 81mg", pharmacy: "Green Cross", category: "Painkiller", price: 3.10, available: true, featured: false },
    { id: 6, name: "Loratadine 10mg", pharmacy: "Health First", category: "Antihistamine", price: 7.80, available: true, featured: false },
    { id: 7, name: "Metformin 500mg", pharmacy: "City Pharma", category: "Diabetes", price: 15.00, available: true, featured: false },
    { id: 8, name: "Omeprazole 20mg", pharmacy: "Care Pharmacy", category: "Stomach", price: 9.90, available: true, featured: false },
];

/**
 * Common Functions
 */
function logout() {
    alert("Logged out successfully");
    window.location.href = "index.html";
}

/**
 * HOME PAGE FUNCTIONS
 */
function handleSearch() {
    const query = document.getElementById('medicineSearch').value.toLowerCase();
    const resultsSection = document.getElementById('searchResults');
    const resultsGrid = document.getElementById('resultsGrid');
    const queryText = document.getElementById('searchQueryText');

    if (!query) {
        alert("Please enter a medicine name");
        return;
    }

    // Filter results
    const filtered = medicines.filter(m => m.name.toLowerCase().includes(query));

    // Show results section
    resultsSection.style.display = 'block';
    queryText.innerText = `Showing ${filtered.length} results for "${query}"`;
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // Render results
    if (filtered.length === 0) {
        resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <p style="font-size: 1.2rem; color: var(--text-muted);">No medicines found matching your search.</p>
            </div>
        `;
    } else {
        resultsGrid.innerHTML = filtered.map(m => createMedicineCard(m)).join('');
    }
}

function createMedicineCard(m) {
    return `
        <article class="medicine-card card">
            <h3>${m.name}</h3>
            <span class="pharmacy-name">📍 ${m.pharmacy}</span>
            <p style="margin-bottom: 15px;">Category: ${m.category} | Price: $${m.price.toFixed(2)}</p>
            <div class="status ${m.available ? 'available' : 'unavailable'}">
                ${m.available ? 'In Stock' : 'Out of Stock'}
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 20px;">Contact Pharmacy</button>
        </article>
    `;
}

function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;

    const featured = medicines.filter(m => m.featured);
    grid.innerHTML = featured.map(m => createMedicineCard(m)).join('');
}

/**
 * AUTH FUNCTIONS
 */
function handleAuth(event, type) {
    event.preventDefault();
    const msg = document.getElementById('authMessage');
    
    if (type === 'login') {
        const email = document.getElementById('loginEmail').value;
        msg.style.color = '#10b981';
        msg.innerText = "Redirecting to dashboard...";
        
        setTimeout(() => {
            if (email.includes('admin')) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }, 1500);
    } else {
        msg.style.color = '#10b981';
        msg.innerText = "Account created successfully! Please login.";
        setTimeout(() => {
            toggleAuth('login');
        }, 2000);
    }
}

/**
 * DASHBOARD FUNCTIONS
 */
let pharmacyInventory = medicines.filter(m => m.pharmacy === "Care Pharmacy");

function renderInventory() {
    const table = document.getElementById('inventoryTable');
    if (!table) return;

    table.innerHTML = pharmacyInventory.map(m => `
        <tr style="border-bottom: 1px solid #f1f5f9; height: 60px;">
            <td><strong>${m.name}</strong></td>
            <td>${m.category}</td>
            <td>$${m.price.toFixed(2)}</td>
            <td>
                <span class="status ${m.available ? 'available' : 'unavailable'}">
                    ${m.available ? 'Stock' : 'Out'}
                </span>
            </td>
            <td>
                <button class="btn" style="padding: 5px 10px; font-size: 0.8rem; background: #f1f5f9;" onclick="deleteMed(${m.id})">Delete</button>
            </td>
        </tr>
    `).join('');

    // Update stats
    document.getElementById('totalMedicines').innerText = pharmacyInventory.length;
    document.getElementById('lowStock').innerText = Math.floor(pharmacyInventory.length * 0.2);
    document.getElementById('outOfStock').innerText = pharmacyInventory.filter(m => !m.available).length;
}

function handleMedicineSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('medName').value;
    const category = document.getElementById('medCategory').value;
    const price = parseFloat(document.getElementById('medPrice').value);
    const available = document.getElementById('medAvailable').value === 'true';

    const newMed = {
        id: pharmacyInventory.length + 100,
        name,
        category,
        price,
        available,
        pharmacy: "Care Pharmacy"
    };

    pharmacyInventory.unshift(newMed);
    renderInventory();
    closeAddModal();
    document.getElementById('medicineForm').reset();
}

function deleteMed(id) {
    pharmacyInventory = pharmacyInventory.filter(m => m.id !== id);
    renderInventory();
}

// Initialize Page Content
window.addEventListener('DOMContentLoaded', () => {
    renderFeatured();
    if (document.getElementById('inventoryTable')) {
        renderInventory();
    }
});
