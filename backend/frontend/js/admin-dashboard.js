/**
 * Admin Dashboard — Complete Logic
 * Handles: Sidebar, Charts, Users, Pharmacies, Medicines, Reports
 */

// ============================================
// MOCK DATA
// ============================================
const ADMIN_DATA = {
    users: [
        { id: 1, name: 'Ahmed Ali', email: 'ahmed@example.com', img: '../images/user.png', registered: '2026-01-15', status: 'active' },
        { id: 2, name: 'Sara Mohamed', email: 'sara@example.com', img: '../images/user.png', registered: '2026-02-20', status: 'active' },
        { id: 3, name: 'Khaled Yassin', email: 'khaled@example.com', img: '../images/user.png', registered: '2026-03-01', status: 'frozen' },
        { id: 4, name: 'Nour Hasan', email: 'nour@example.com', img: '../images/user.png', registered: '2026-03-10', status: 'active' },
        { id: 5, name: 'Omar Fadi', email: 'omar@example.com', img: '../images/user.png', registered: '2026-03-12', status: 'active' },
        { id: 6, name: 'Lina Tamer', email: 'lina@example.com', img: '../images/user.png', registered: '2026-03-18', status: 'frozen' },
        { id: 7, name: 'Rami Saleh', email: 'rami@example.com', img: '../images/user.png', registered: '2026-03-25', status: 'active' },
        { id: 8, name: 'Dana Khalil', email: 'dana@example.com', img: '../images/user.png', registered: '2026-04-01', status: 'active' },
    ],
    pharmacies: [
        { id: 1, name: 'Al Shifa Pharmacy', email: 'alshifa@pharm.com', img: '../images/PHAR.jpg', license: 'LIC-20210045', area: 'Downtown', status: 'approved' },
        { id: 2, name: 'CarePlus Pharmacy', email: 'careplus@pharm.com', img: '../images/PHAR.jpg', license: 'LIC-20220112', area: 'Downtown', status: 'approved' },
        { id: 3, name: 'LifeStyle Pharmacy', email: 'lifestyle@pharm.com', img: '../images/PHAR.jpg', license: 'LIC-20230089', area: 'West End', status: 'pending' },
        { id: 4, name: 'Medix Care Store', email: 'medix@pharm.com', img: '../images/PHAR.jpg', license: 'LIC-20230095', area: 'North District', status: 'pending' },
        { id: 5, name: 'QuickMeds Pharmacy', email: 'quickmeds@pharm.com', img: '../images/PHAR.jpg', license: 'LIC-20240001', area: 'North District', status: 'rejected' },
        { id: 6, name: 'Trust Pharmacy Center', email: 'trust@pharm.com', img: '../images/PHAR.jpg', license: 'LIC-20240015', area: 'East Side', status: 'approved' },
        { id: 7, name: 'City Central Pharma', email: 'central@pharm.com', img: '../images/PHAR.jpg', license: 'LIC-20240022', area: 'Downtown', status: 'pending' },
        { id: 8, name: 'Wellness Hub', email: 'wellness@pharm.com', img: '../images/PHAR.jpg', license: 'LIC-20240030', area: 'West End', status: 'approved' },
    ],
    medicines: [
        { id: 1, name: 'Panadol Extra', category: 'Pain Relief', ingredient: 'Paracetamol + Caffeine', dosage: '500mg' },
        { id: 2, name: 'Augmentin', category: 'Antibiotics', ingredient: 'Amoxicillin + Clavulanate', dosage: '1g' },
        { id: 3, name: 'Aspirin Protect', category: 'Cardiology', ingredient: 'Acetylsalicylic acid', dosage: '100mg' },
        { id: 4, name: 'Zyrtec', category: 'Allergy', ingredient: 'Cetirizine', dosage: '10mg' },
        { id: 5, name: 'Cataflam', category: 'Pain Relief', ingredient: 'Diclofenac Potassium', dosage: '50mg' },
        { id: 6, name: 'Nexium', category: 'Gastrointestinal', ingredient: 'Esomeprazole', dosage: '40mg' },
        { id: 7, name: 'Amoxil', category: 'Antibiotics', ingredient: 'Amoxicillin', dosage: '500mg' },
        { id: 8, name: 'Concor', category: 'Cardiology', ingredient: 'Bisoprolol', dosage: '5mg' },
        { id: 9, name: 'Lipitor', category: 'Cardiology', ingredient: 'Atorvastatin', dosage: '20mg' },
        { id: 10, name: 'Brufen', category: 'Pain Relief', ingredient: 'Ibuprofen', dosage: '400mg' },
    ],
    missingRequests: [
        { id: 1, medicine: 'Glucophage 850mg', user: 'Ahmed Ali', date: '2026-04-08', status: 'pending' },
        { id: 2, medicine: 'Insulin Lantus', user: 'Sara Mohamed', date: '2026-04-07', status: 'pending' },
        { id: 3, medicine: 'Metformin 500mg', user: 'Khaled Yassin', date: '2026-04-06', status: 'completed' },
        { id: 4, medicine: 'Enalapril 10mg', user: 'Nour Hasan', date: '2026-04-05', status: 'pending' },
        { id: 5, medicine: 'Amlodipine 5mg', user: 'Omar Fadi', date: '2026-04-04', status: 'completed' },
    ],
    complaints: [
        { id: 1, reporter: 'Ahmed Ali', against: 'QuickMeds Pharmacy', subject: 'Incorrect price listed for Panadol', date: '2026-04-08', status: 'open' },
        { id: 2, reporter: 'Sara Mohamed', against: 'LifeStyle Pharmacy', subject: 'Medicine was expired on delivery', date: '2026-04-06', status: 'open' },
        { id: 3, reporter: 'Nour Hasan', against: 'City Central Pharma', subject: 'Wrong dosage dispensed', date: '2026-04-03', status: 'resolved' },
    ]
};


// ============================================
// 1. SIDEBAR LOGIC
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.admin-sidebar');
    const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
    const overlay = document.querySelector('.sidebar-overlay');
    const closeBtn = document.querySelector('.sidebar-close');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    // Detect current page and highlight sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        } else if (!href || !href.endsWith('.html') || href.includes('index.html')) {
            // keep logout link unstyled
        } else {
            link.classList.remove('active');
        }
    });

    // Initialize page-specific logic
    const pageId = document.body.dataset.page;
    if (pageId === 'dashboard') initDashboardCharts();
    if (pageId === 'users') initUsersPage();
    if (pageId === 'pharmacies') initPharmaciesPage();
    if (pageId === 'medicines') initMedicinesPage();
    if (pageId === 'reports') initReportsPage();
});


// ============================================
// 2. DASHBOARD — Charts
// ============================================
function initDashboardCharts() {
    // Update stat card values
    document.getElementById('statUsers') && (document.getElementById('statUsers').textContent = '1,284');
    document.getElementById('statPharmacies') && (document.getElementById('statPharmacies').textContent = '156');
    document.getElementById('statRequests') && (document.getElementById('statRequests').textContent = '42');
    document.getElementById('statTransfers') && (document.getElementById('statTransfers').textContent = '89');

    // Activity Chart
    const ctxActivity = document.getElementById('activityChart');
    if (ctxActivity) {
        new Chart(ctxActivity, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'New Users',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    borderColor: '#074799',
                    backgroundColor: 'rgba(7, 71, 153, 0.08)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#074799',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }, {
                    label: 'Medicine Requests',
                    data: [5, 12, 8, 18, 15, 22, 20],
                    borderColor: '#00a9e0',
                    backgroundColor: 'rgba(0, 169, 224, 0.08)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00a9e0',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: { usePointStyle: true, font: { family: 'Inter', size: 12, weight: '600' }, padding: 20 }
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'Inter' } } },
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter' } } }
                }
            }
        });
    }

    // Categories Doughnut
    const ctxCategories = document.getElementById('categoriesChart');
    if (ctxCategories) {
        new Chart(ctxCategories, {
            type: 'doughnut',
            data: {
                labels: ['Antibiotics', 'Pain Relief', 'Cardiology', 'Allergy', 'Others'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: ['#074799', '#00a9e0', '#97c93e', '#f59e0b', '#8b5cf6'],
                    borderWidth: 0,
                    hoverOffset: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 16, usePointStyle: true, font: { family: 'Inter', size: 12, weight: '600' } }
                    }
                }
            }
        });
    }
}


// ============================================
// 3. USERS PAGE
// ============================================
function initUsersPage() {
    let currentFilter = 'all';
    let searchQuery = '';
    const tbody = document.getElementById('usersTableBody');
    const searchInput = document.getElementById('usersSearch');
    const filterTabs = document.querySelectorAll('#usersFilters .filter-tab');

    function render() {
        let data = [...ADMIN_DATA.users];
        if (currentFilter !== 'all') data = data.filter(u => u.status === currentFilter);
        if (searchQuery) data = data.filter(u => u.name.toLowerCase().includes(searchQuery) || u.email.toLowerCase().includes(searchQuery));

        if (!tbody) return;
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-users-slash"></i><h3>No Users Found</h3><p>No users match your current filters.</p></div></td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(u => `
            <tr>
                <td>
                    <div class="cell-user">
                        ${window.mlAvatar ? window.mlAvatar(u.name, u.img, 'cell-avatar circle') : `<img src="${u.img}" class="cell-avatar circle">`}
                        <div>
                            <span class="cell-name">${u.name}</span>
                            <span class="cell-email">${u.email}</span>
                        </div>
                    </div>
                </td>
                <td>${formatDate(u.registered)}</td>
                <td><span class="status-pill ${u.status}">${capitalize(u.status)}</span></td>
                <td>
                    <div class="action-btns">
                        ${u.status === 'active'
                            ? `<button class="btn-action freeze" onclick="toggleUserStatus(${u.id}, 'frozen')"><i class="fas fa-ban"></i> Freeze</button>`
                            : `<button class="btn-action approve" onclick="toggleUserStatus(${u.id}, 'active')"><i class="fas fa-check"></i> Activate</button>`
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            render();
        });
    });

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            searchQuery = e.target.value.toLowerCase();
            render();
        });
    }

    // Toggle freeze/activate
    window.toggleUserStatus = function(id, newStatus) {
        const user = ADMIN_DATA.users.find(u => u.id === id);
        if (!user) return;
        const action = newStatus === 'frozen' ? 'Freeze' : 'Activate';

        mlConfirm(
            `${action} User`,
            `Are you sure you want to ${action.toLowerCase()} "${user.name}"?`,
            action,
            () => {
                user.status = newStatus;
                render();
                mlAlert(`User "${user.name}" has been ${newStatus === 'frozen' ? 'frozen' : 'activated'}.`, newStatus === 'frozen' ? 'error' : 'success');
            }
        );
    };

    render();
}


// ============================================
// 4. PHARMACIES PAGE
// ============================================
function initPharmaciesPage() {
    let currentFilter = 'all';
    let searchQuery = '';
    const tbody = document.getElementById('pharmaciesTableBody');
    const searchInput = document.getElementById('pharmaciesSearch');
    const filterTabs = document.querySelectorAll('#pharmaciesFilters .filter-tab');

    function render() {
        let data = [...ADMIN_DATA.pharmacies];
        if (currentFilter !== 'all') data = data.filter(p => p.status === currentFilter);
        if (searchQuery) data = data.filter(p => p.name.toLowerCase().includes(searchQuery) || p.email.toLowerCase().includes(searchQuery));

        // Update sidebar badge
        const badge = document.getElementById('pendingBadge');
        const pendingCount = ADMIN_DATA.pharmacies.filter(p => p.status === 'pending').length;
        if (badge) badge.textContent = pendingCount;

        if (!tbody) return;
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-store-slash"></i><h3>No Pharmacies Found</h3><p>No pharmacies match your current filters.</p></div></td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(p => `
            <tr>
                <td>
                    <div class="cell-user">
                        <img src="${p.img}" alt="${p.name}" class="cell-avatar" />
                        <div>
                            <span class="cell-name">${p.name}</span>
                            <span class="cell-email">${p.email}</span>
                        </div>
                    </div>
                </td>
                <td>${p.license}</td>
                <td>${p.area}</td>
                <td><span class="status-pill ${p.status}">${capitalize(p.status)}</span></td>
                <td>
                    <div class="action-btns">
                        ${p.status === 'pending' ? `
                            <button class="btn-action approve" onclick="updatePharmacy(${p.id}, 'approved')"><i class="fas fa-check"></i> Approve</button>
                            <button class="btn-action reject" onclick="updatePharmacy(${p.id}, 'rejected')"><i class="fas fa-times"></i> Reject</button>
                        ` : p.status === 'approved' ? `
                            <button class="btn-action reject" onclick="updatePharmacy(${p.id}, 'rejected')"><i class="fas fa-ban"></i> Revoke</button>
                        ` : `
                            <button class="btn-action approve" onclick="updatePharmacy(${p.id}, 'approved')"><i class="fas fa-redo"></i> Re-approve</button>
                        `}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            render();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', e => {
            searchQuery = e.target.value.toLowerCase();
            render();
        });
    }

    window.updatePharmacy = function(id, newStatus) {
        const p = ADMIN_DATA.pharmacies.find(ph => ph.id === id);
        if (!p) return;
        const label = capitalize(newStatus);

        mlConfirm(
            `${label} Pharmacy`,
            `Are you sure you want to ${newStatus === 'approved' ? 'approve' : 'reject'} "${p.name}"?`,
            label,
            () => {
                p.status = newStatus;
                render();
                mlAlert(`"${p.name}" has been ${newStatus}.`, newStatus === 'approved' ? 'success' : 'error');
            }
        );
    };

    render();
}


// ============================================
// 5. MEDICINES PAGE
// ============================================
function initMedicinesPage() {
    const tbody = document.getElementById('medicinesTableBody');
    const searchInput = document.getElementById('medicinesSearch');

    function renderMedicines() {
        if (!tbody) return;

        // Fetch from shared pharmacy inventory (simulated global catalog)
        const medsData = localStorage.getItem('medicine');
        const meds = medsData ? JSON.parse(medsData) : [];
        
        if (meds.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state" style="padding: 40px; text-align: center;">
                <i class="fas fa-prescription-bottle" style="font-size: 3rem; opacity: 0.3; margin-bottom: 16px;"></i>
                <h3>Catalog is Empty</h3>
                <p>Global medicines entered by pharmacies will appear here.</p>
            </div></td></tr>`;
            return;
        }

        tbody.innerHTML = meds.map((m, index) => `
            <tr>
                <td><strong style="text-transform: capitalize;">${m.medicineName}</strong></td>
                <td><span class="category-tag">${m.medicineCategory || 'General'}</span></td>
                <td>${m.medicineStrength || '—'}</td>
                <td><strong>${m.medicineAmount}</strong> units</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action delete" onclick="deleteGlobalMedicine(${index})"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderMedicines();

    window.deleteGlobalMedicine = function(index) {
        mlConfirm('Delete from Catalog', 'Are you sure you want to remove this medicine from the global catalog? This will affect pharmacy inventories.', 'Delete', () => {
             const meds = JSON.parse(localStorage.getItem('medicine') || '[]');
             meds.splice(index, 1);
             localStorage.setItem('medicine', JSON.stringify(meds));
             renderMedicines();
             mlAlert('Medicine removed from catalog.', 'info');
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const q = e.target.value.toLowerCase();
            const meds = localStorage.getItem('medicine') ? JSON.parse(localStorage.medicine) : [];
            const filtered = meds.filter(m => 
                m.medicineName.toLowerCase().includes(q) || 
                (m.medicineCategory && m.medicineCategory.toLowerCase().includes(q))
            );
            
            tbody.innerHTML = filtered.map((m, index) => `
                <tr>
                    <td><strong style="text-transform: capitalize;">${m.medicineName}</strong></td>
                    <td><span class="category-tag">${m.medicineCategory || 'General'}</span></td>
                    <td>${m.medicineStrength || '—'}</td>
                    <td><strong>${m.medicineAmount}</strong> units</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-action delete" onclick="deleteGlobalMedicine(${index})"><i class="fas fa-trash"></i> Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        });
    }
}

    render();


// ============================================
// 6. REPORTS PAGE
// ============================================
function initReportsPage() {
    const tabBtns = document.querySelectorAll('#reportsTabs .filter-tab');
    const missingSection = document.getElementById('missingSection');
    const complaintsSection = document.getElementById('complaintsSection');

    function showTab(tab) {
        if (tab === 'missing') {
            missingSection && (missingSection.style.display = 'block');
            complaintsSection && (complaintsSection.style.display = 'none');
        } else {
            missingSection && (missingSection.style.display = 'none');
            complaintsSection && (complaintsSection.style.display = 'block');
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showTab(btn.dataset.tab);
        });
    });

    // --- Admin Detail View Modal Selectors ---
    const detailModal = document.getElementById('admin-detail-modal');
    const modalTitle = document.getElementById('admin-modal-title');
    const modalBody = document.getElementById('admin-modal-body');
    const modalIcon = document.getElementById('admin-modal-icon');
    const btnCloseModal = document.getElementById('btn-close-admin-modal');

    if (detailModal && btnCloseModal) {
        btnCloseModal.onclick = () => detailModal.classList.remove('open');
        window.addEventListener('click', (e) => {
            if (e.target === detailModal) detailModal.classList.remove('open');
        });
    }

    // --- Admin Response Modal Logic ---
    const responseModal = document.getElementById('admin-response-modal');
    const btnCloseResponse = document.getElementById('btn-close-response-modal');
    const btnSubmitAssistance = document.getElementById('btn-submit-assistance');
    const assistanceText = document.getElementById('admin-assistance-text');
    const requestIdInput = document.getElementById('current-request-id');

    if (responseModal && btnCloseResponse) {
        btnCloseResponse.onclick = () => responseModal.classList.remove('open');
        window.addEventListener('click', (e) => {
            if (e.target === responseModal) responseModal.classList.remove('open');
        });
    }

    window.openResponseModal = function(id) {
        if (!responseModal || !requestIdInput) return;
        requestIdInput.value = id;
        assistanceText.value = '';
        responseModal.classList.add('open');
    };

    if (btnSubmitAssistance) {
        btnSubmitAssistance.addEventListener('click', () => {
            const id = requestIdInput.value;
            const text = assistanceText.value.trim();
            if (!text) {
                mlAlert('Please provide a message for the citizen.', 'error');
                return;
            }

            if (window.OrdersEngine) {
                window.OrdersEngine.updateStatus(id, 'Responded', text);
                responseModal.classList.remove('open');
                renderMissing();
                mlAlert('Response sent to citizen.', 'success');
            }
        });
    }

    // Assign to window immediately so render functions can use them
    window.viewReportDetails = function(id, type) {
        console.log(`Viewing ${type} details for ID: ${id}`);
        // Re-lookup modal if context was lost
        const modal = document.getElementById('admin-detail-modal');
        const mTitle = document.getElementById('admin-modal-title');
        const mBody = document.getElementById('admin-modal-body');
        
        if (!window.OrdersEngine || !modal) {
            console.error('Missing OrdersEngine or Admin Detail Modal');
            return;
        }

        let content = '';
        if (type === 'request') {
            const r = window.OrdersEngine.getOrders().find(o => o.id === id);
            if (!r) return;
            mTitle.textContent = "Medicine Request Details";
            content = `
<strong>Medicine:</strong> ${r.medicineName}
<strong>Requested By:</strong> ${r.citizenName}
<strong>Quantity:</strong> ${r.quantity}
<strong>Urgency:</strong> ${capitalize(r.urgency)}
<strong>Date:</strong> ${r.date} ${r.time}
<strong>Notes:</strong> 
${r.notes || "No additional notes provided."}
            `;
        } else {
            const c = window.OrdersEngine.getComplaints().find(comp => comp.id === id);
            if (!c) return;
            mTitle.textContent = "Citizen Complaint Details";
            content = `
<strong>Reporter:</strong> ${c.reporter}
<strong>Against:</strong> ${c.against}
<strong>Category:</strong> ${c.subject}
<strong>Date:</strong> ${c.date} ${c.time}
<strong>Status:</strong> ${capitalize(c.status)}

<strong>Description:</strong>
${c.details}
            `;
        }

        mBody.innerHTML = content;
        modal.classList.add('open');
    };

    window.resolveMissing = function(id) {
        if (!window.OrdersEngine) return;
        mlConfirm('Resolve Request', `Mark this missing medicine request as resolved?`, 'Resolve', () => {
            window.OrdersEngine.updateStatus(id, 'Resolved');
            renderMissing();
            mlAlert('Request marked as resolved.', 'success');
        });
    };

    window.resolveComplaint = function(id) {
        if (!window.OrdersEngine) return;
        mlConfirm('Resolve Complaint', `Mark this citizen complaint as resolved?`, 'Resolve', () => {
            window.OrdersEngine.resolveComplaint(id);
            renderComplaints();
            mlAlert('Complaint resolved successfully.', 'success');
        });
    };

    // Render missing requests
    renderMissing();
    renderComplaints();
    showTab('missing');

    function renderMissing() {
        const tbody = document.getElementById('missingTableBody');
        if (!tbody) return;

        // Fetch from OrdersEngine (Filter for General Network - broadcasted requests)
        let liveRequests = [];
        if(window.OrdersEngine) {
            liveRequests = window.OrdersEngine.getOrders().filter(o => o.pharmacyName === "General Network");
        }

        if(liveRequests.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state" style="padding: 20px;"><i class="fas fa-search-minus"></i><h3>No broadcast requests</h3></div></td></tr>`;
            return;
        }

        tbody.innerHTML = liveRequests.map(r => `
            <tr>
                <td><strong>${r.medicineName}</strong></td>
                <td>
                    <div class="cell-user">
                        ${window.mlAvatar ? window.mlAvatar(r.citizenName, null, 'cell-avatar circle') : `<img src="../images/user.png" class="cell-avatar circle">`}
                        <span class="cell-name">${r.citizenName}</span>
                    </div>
                </td>
                <td>${r.quantity || 1}</td>
                <td><span class="urgency-pill urgency-${r.urgency || 'standard'}">${r.urgency || 'standard'}</span></td>
                <td>${r.date}</td>
                <td><span class="status-pill status-${r.status.toLowerCase()}">${r.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action edit" onclick="viewReportDetails('${r.id}', 'request')"><i class="fas fa-eye"></i> View</button>
                        ${r.status.toLowerCase() === 'pending' 
                            ? `<button class="btn-action approve" onclick="openResponseModal('${r.id}')"><i class="fas fa-comment-medical"></i> Help</button>`
                            : ``
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function renderComplaints() {
        const tbody = document.getElementById('complaintsTableBody');
        if (!tbody) return;

        // Fetch from OrdersEngine
        let liveComplaints = [];
        if(window.OrdersEngine) {
            liveComplaints = window.OrdersEngine.getComplaints();
        }

        if(liveComplaints.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state" style="padding: 20px;"><i class="fas fa-check-circle"></i><h3>No complaints reported</h3></div></td></tr>`;
            return;
        }

        tbody.innerHTML = liveComplaints.map(c => `
            <tr>
                <td>
                    <div class="cell-user">
                        ${window.mlAvatar ? window.mlAvatar(c.reporter, null, 'cell-avatar circle') : `<img src="../images/user.png" class="cell-avatar circle">`}
                        <span class="cell-name">${c.reporter}</span>
                    </div>
                </td>
                <td><strong>${c.against}</strong></td>
                <td style="max-width: 250px;">${c.subject}</td>
                <td>${c.date}</td>
                <td><span class="status-pill status-${c.status}">${capitalize(c.status)}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action edit" onclick="viewReportDetails('${c.id}', 'complaint')"><i class="fas fa-eye"></i> Details</button>
                        ${c.status === 'open'
                            ? `<button class="btn-action approve" onclick="resolveComplaint('${c.id}')"><i class="fas fa-check"></i> Resolve</button>`
                            : ``
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }
}


// ============================================
// UTILITY FUNCTIONS
// ============================================
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
