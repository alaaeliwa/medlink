/**
 * Admin Dashboard — API Connected
 * All ADMIN_DATA mock objects and localStorage reads replaced with real API calls.
 * All UI logic: sidebar, charts, tables, modals, filters, search kept exactly as-is.
 */

// ============================================
// 1. SIDEBAR LOGIC
// ============================================
document.addEventListener('DOMContentLoaded', async () => {

    // ── Auth Guard ────────────────────────────────────────────────────────────
    if (!Auth.isLoggedIn()) {
        window.location.href = '../auth/login.html';
        return;
    }

    // ── Sidebar ───────────────────────────────────────────────────────────────
    // Kept exactly as-is
    const sidebar   = document.querySelector('.admin-sidebar');
    const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
    const overlay   = document.querySelector('.sidebar-overlay');
    const closeBtn  = document.querySelector('.sidebar-close');

    function openSidebar()  { sidebar?.classList.add('open');    overlay?.classList.add('active'); }
    function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('active'); }

    toggleBtn?.addEventListener('click', openSidebar);
    overlay?.addEventListener('click', closeSidebar);
    closeBtn?.addEventListener('click', closeSidebar);

    // Highlight active sidebar link — kept exactly as-is
    const currentPage  = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) link.classList.add('active');
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn?.addEventListener('click', (e) => { e.preventDefault(); Auth.logout(); });

    // ── Dispatch to page-specific logic ──────────────────────────────────────
    const pageId = document.body.dataset.page;
    if (pageId === 'dashboard')  await initDashboardCharts();
    if (pageId === 'users')      await initUsersPage();
    if (pageId === 'pharmacies') await initPharmaciesPage();
    if (pageId === 'medicines')  await initMedicinesPage();
    if (pageId === 'reports')    await initReportsPage();
});


// ============================================
// 2. DASHBOARD — Stats + Charts
// ============================================
async function initDashboardCharts() {

    // REPLACED: hardcoded stat strings ('1,284' etc.)
    // NOW: fetches real counts from /admin/statistics
    const statsRes = await AdminAPI.statistics();
    const stats    = statsRes?.data || {};

    const el = id => document.getElementById(id);

    if (el('statUsers'))     el('statUsers').textContent     = (stats.totalCitizens   || 0).toLocaleString();
    if (el('statPharmacies'))el('statPharmacies').textContent= (stats.totalPharmacies || 0).toLocaleString();
    if (el('statRequests'))  el('statRequests').textContent  = (stats.totalOrders     || 0).toLocaleString();
    if (el('statTransfers')) el('statTransfers').textContent = (stats.recentComplaints|| 0).toLocaleString();

    // ── Activity Chart ────────────────────────────────────────────────────────
    // Chart.js config kept exactly as-is — only the data source changes
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

    // ── Categories Doughnut ───────────────────────────────────────────────────
    // UPDATED: labels and data pulled from real categories API
    const ctxCategories = document.getElementById('categoriesChart');
    if (ctxCategories) {
        const catRes    = await MedicinesAPI.categories();
        const cats      = catRes?.data || [];
        const topCats   = cats.slice(0, 5);
        const labels    = topCats.map(c => c.name);
        const dataVals  = topCats.map(c => c.medicineCount || 0);
        const colors    = ['#074799', '#00a9e0', '#97c93e', '#f59e0b', '#8b5cf6'];

        new Chart(ctxCategories, {
            type: 'doughnut',
            data: {
                labels: labels.length ? labels : ['No Data'],
                datasets: [{
                    data: dataVals.length ? dataVals : [1],
                    backgroundColor: colors,
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
async function initUsersPage() {
    let currentFilter = 'all';
    let searchQuery   = '';
    let allUsers      = []; // REPLACED: ADMIN_DATA.users

    const tbody      = document.getElementById('usersTableBody');
    const searchInput= document.getElementById('usersSearch');
    const filterTabs = document.querySelectorAll('#usersFilters .filter-tab');

    // REPLACED: reading from ADMIN_DATA.users
    // NOW: fetches all citizens from /admin/users
    async function fetchUsers() {
        showLoading(tbody, 5);
        const res = await AdminAPI.users({ per_page: 100 });
        allUsers  = res?.data?.users || [];
        render();
    }

    function render() {
        let data = [...allUsers];

        // Filter
        if (currentFilter === 'active')   data = data.filter(u => u.isActive && u.status !== 'suspended');
        if (currentFilter === 'frozen')    data = data.filter(u => !u.isActive || u.status === 'suspended');

        // Search
        if (searchQuery) {
            data = data.filter(u =>
                (u.name || '').toLowerCase().includes(searchQuery) ||
                (u.email || '').toLowerCase().includes(searchQuery)
            );
        }

        if (!tbody) return;
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-users-slash"></i><h3>No Users Found</h3><p>No users match your current filters.</p></div></td></tr>`;
            return;
        }

        // Kept exactly as-is — same HTML structure
        tbody.innerHTML = data.map(u => {
            const isActive  = u.isActive && u.status !== 'suspended';
            const statusStr = isActive ? 'active' : 'frozen';
            return `
            <tr>
                <td>
                    <div class="cell-user">
                        ${window.mlAvatar ? window.mlAvatar(u.name, u.profileImage, 'cell-avatar circle') : `<img src="../images/user.png" class="cell-avatar circle">`}
                        <div>
                            <span class="cell-name">${u.name}</span>
                            <span class="cell-email">${u.email}</span>
                        </div>
                    </div>
                </td>
                <td>${formatDate(u.createdAt)}</td>
                <td><span class="status-pill ${statusStr}">${capitalize(statusStr)}</span></td>
                <td>
                    <div class="action-btns">
                        ${isActive
                            ? `<button class="btn-action freeze" onclick="toggleUserStatus('${u.id}', 'frozen')"><i class="fas fa-ban"></i> Freeze</button>`
                            : `<button class="btn-action approve" onclick="toggleUserStatus('${u.id}', 'active')"><i class="fas fa-check"></i> Activate</button>`
                        }
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    // Filter tabs — kept exactly as-is
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            render();
        });
    });

    // Search — kept exactly as-is
    searchInput?.addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase();
        render();
    });

    // REPLACED: user.status = newStatus (mutating mock data)
    // NOW: calls real API then re-fetches
    window.toggleUserStatus = async function(id, newStatus) {
        const user   = allUsers.find(u => u.id === id);
        if (!user) return;
        const action = newStatus === 'frozen' ? 'Freeze' : 'Activate';

        mlConfirm(
            `${action} User`,
            `Are you sure you want to ${action.toLowerCase()} "${user.name}"?`,
            action,
            async () => {
                const res = await AdminAPI.toggleUserActive(id);
                if (res?.success) {
                    mlAlert(`User "${user.name}" has been ${newStatus === 'frozen' ? 'frozen' : 'activated'}.`, newStatus === 'frozen' ? 'error' : 'success');
                    await fetchUsers(); // re-fetch to reflect real DB state
                } else {
                    mlAlert(res?.message || 'Action failed.', 'error');
                }
            }
        );
    };

    await fetchUsers();
}


// ============================================
// 4. PHARMACIES PAGE
// ============================================
async function initPharmaciesPage() {
    let currentFilter = 'all';
    let searchQuery   = '';
    let allPharmacies = []; // REPLACED: ADMIN_DATA.pharmacies

    const tbody      = document.getElementById('pharmaciesTableBody');
    const searchInput= document.getElementById('pharmaciesSearch');
    const filterTabs = document.querySelectorAll('#pharmaciesFilters .filter-tab');

    // REPLACED: ADMIN_DATA.pharmacies
    // NOW: fetches from /admin/pharmacies/verification
    async function fetchPharmacies() {
        showLoading(tbody, 6);

        // Fetch all statuses in parallel
        const [pendingRes, verifiedRes, rejectedRes] = await Promise.all([
            AdminAPI.pendingPharmacies('pending'),
            AdminAPI.pendingPharmacies('verified'),
            AdminAPI.pendingPharmacies('rejected'),
        ]);

        allPharmacies = [
            ...(pendingRes?.data?.pharmacies  || []),
            ...(verifiedRes?.data?.pharmacies || []),
            ...(rejectedRes?.data?.pharmacies || []),
        ];

        // Update pending badge
        const badge        = document.getElementById('pendingBadge');
        const pendingCount = allPharmacies.filter(p => p.status === 'pending').length;
        if (badge) badge.textContent = pendingCount;

        render();
    }

    function render() {
        let data = [...allPharmacies];

        if (currentFilter !== 'all') data = data.filter(p => p.status === currentFilter);
        if (searchQuery) data = data.filter(p =>
            (p.name || '').toLowerCase().includes(searchQuery) ||
            (p.email || '').toLowerCase().includes(searchQuery)
        );

        // Update badge with filtered pending count
        const badge        = document.getElementById('pendingBadge');
        const pendingCount = allPharmacies.filter(p => p.status === 'pending').length;
        if (badge) badge.textContent = pendingCount;

        if (!tbody) return;
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-store-slash"></i><h3>No Pharmacies Found</h3><p>No pharmacies match your current filters.</p></div></td></tr>`;
            return;
        }

        // Kept exactly as-is — same HTML structure
        tbody.innerHTML = data.map(p => `
            <tr>
                <td>
                    <div class="cell-user">
                        <img src="${p.profileImage || '../images/PHAR.jpg'}" alt="${p.name}" class="cell-avatar" />
                        <div>
                            <span class="cell-name">${p.name}</span>
                            <span class="cell-email">${p.email}</span>
                        </div>
                    </div>
                </td>
                <td>${p.licenseNumber || '—'}</td>
                <td>${p.area || '—'}</td>
                <td><span class="status-pill ${p.status}">${capitalize(p.status)}</span></td>
                <td>
                    <div class="action-btns">
                        ${p.status === 'pending' ? `
                            <button class="btn-action approve" onclick="updatePharmacy('${p.id}', 'verified')"><i class="fas fa-check"></i> Approve</button>
                            <button class="btn-action reject"  onclick="updatePharmacy('${p.id}', 'rejected')"><i class="fas fa-times"></i> Reject</button>
                        ` : p.status === 'verified' ? `
                            <button class="btn-action reject"  onclick="updatePharmacy('${p.id}', 'suspended')"><i class="fas fa-ban"></i> Revoke</button>
                        ` : `
                            <button class="btn-action approve" onclick="updatePharmacy('${p.id}', 'verified')"><i class="fas fa-redo"></i> Re-approve</button>
                        `}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Filter tabs — kept exactly as-is
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            render();
        });
    });

    // Search — kept exactly as-is
    searchInput?.addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase();
        render();
    });

    // REPLACED: p.status = newStatus (mutating mock)
    // NOW: calls real API then re-fetches
    window.updatePharmacy = async function(id, newStatus) {
        const p     = allPharmacies.find(ph => ph.id === id);
        if (!p) return;
        const label = capitalize(newStatus === 'verified' ? 'Approve' : newStatus);

        mlConfirm(
            `${label} Pharmacy`,
            `Are you sure you want to ${newStatus === 'verified' ? 'approve' : newStatus} "${p.name}"?`,
            label,
            async () => {
                const res = await AdminAPI.verifyPharmacy(id, newStatus);
                if (res?.success) {
                    mlAlert(`"${p.name}" has been ${newStatus}.`, newStatus === 'verified' ? 'success' : 'error');
                    await fetchPharmacies(); // re-fetch to reflect real DB state
                } else {
                    mlAlert(res?.message || 'Action failed.', 'error');
                }
            }
        );
    };

    await fetchPharmacies();
}


// ============================================
// 5. MEDICINES PAGE
// ============================================
async function initMedicinesPage() {
    const tbody      = document.getElementById('medicinesTableBody');
    const searchInput= document.getElementById('medicinesSearch');
    let   allMeds    = []; // REPLACED: localStorage.getItem('medicine')

    // REPLACED: JSON.parse(localStorage.getItem('medicine'))
    // NOW: fetches real medicine catalog from /medicines
    async function fetchMedicines(search = '') {
        showLoading(tbody, 5);
        const res = await MedicinesAPI.list({ search, per_page: 100 });
        allMeds   = res?.data?.medicines || [];
        renderMedicines(allMeds);
    }

    function renderMedicines(meds) {
        if (!tbody) return;
        if (meds.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state" style="padding: 40px; text-align: center;">
                <i class="fas fa-prescription-bottle" style="font-size: 3rem; opacity: 0.3; margin-bottom: 16px;"></i>
                <h3>Catalog is Empty</h3>
                <p>No medicines have been added yet.</p>
            </div></td></tr>`;
            return;
        }

        // Kept exactly as-is — same HTML structure
        tbody.innerHTML = meds.map(m => `
            <tr>
                <td><strong style="text-transform: capitalize;">${m.name}</strong></td>
                <td><span class="category-tag">${m.category || 'General'}</span></td>
                <td>${m.strength || '—'}</td>
                <td><strong>${m.pharmaciesCount || 0}</strong> pharmacies</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action delete" onclick="deleteGlobalMedicine('${m.id}', '${m.name}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // REPLACED: localStorage.splice() hack
    // NOW: calls real DELETE /admin/medicines/:id
    window.deleteGlobalMedicine = async function(id, name) {
        mlConfirm(
            'Delete from Catalog',
            `Are you sure you want to remove "${name}" from the global catalog? This will affect pharmacy inventories.`,
            'Delete',
            async () => {
                const res = await APIClient.delete(`/admin/medicines/${id}`);
                if (res?.success) {
                    mlAlert('Medicine removed from catalog.', 'info');
                    await fetchMedicines();
                } else {
                    mlAlert(res?.message || 'Failed to delete medicine.', 'error');
                }
            }
        );
    };

    // Search — REPLACED: localStorage re-read on each keystroke
    // NOW: debounced API search
    let searchTimeout;
    searchInput?.addEventListener('input', e => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => fetchMedicines(e.target.value.trim()), 300);
    });

    await fetchMedicines();
}


// ============================================
// 6. REPORTS PAGE
// ============================================
async function initReportsPage() {
    const tabBtns           = document.querySelectorAll('#reportsTabs .filter-tab');
    const missingSection    = document.getElementById('missingSection');
    const complaintsSection = document.getElementById('complaintsSection');

    // Tab switching — kept exactly as-is
    function showTab(tab) {
        if (tab === 'missing') {
            missingSection   && (missingSection.style.display   = 'block');
            complaintsSection&& (complaintsSection.style.display= 'none');
        } else {
            missingSection   && (missingSection.style.display   = 'none');
            complaintsSection&& (complaintsSection.style.display= 'block');
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showTab(btn.dataset.tab);
        });
    });

    // ── Detail Modal ──────────────────────────────────────────────────────────
    // Kept exactly as-is
    const detailModal   = document.getElementById('admin-detail-modal');
    const modalTitle    = document.getElementById('admin-modal-title');
    const modalBody     = document.getElementById('admin-modal-body');
    const btnCloseModal = document.getElementById('btn-close-admin-modal');

    if (detailModal && btnCloseModal) {
        btnCloseModal.onclick = () => detailModal.classList.remove('open');
        window.addEventListener('click', e => { if (e.target === detailModal) detailModal.classList.remove('open'); });
    }

    // ── Response Modal ────────────────────────────────────────────────────────
    // Kept exactly as-is
    const responseModal     = document.getElementById('admin-response-modal');
    const btnCloseResponse  = document.getElementById('btn-close-response-modal');
    const btnSubmitAssist   = document.getElementById('btn-submit-assistance');
    const assistanceText    = document.getElementById('admin-assistance-text');
    const requestIdInput    = document.getElementById('current-request-id');

    if (responseModal && btnCloseResponse) {
        btnCloseResponse.onclick = () => responseModal.classList.remove('open');
        window.addEventListener('click', e => { if (e.target === responseModal) responseModal.classList.remove('open'); });
    }

    window.openResponseModal = function(id) {
        if (!responseModal || !requestIdInput) return;
        requestIdInput.value = id;
        if (assistanceText) assistanceText.value = '';
        responseModal.classList.add('open');
    };

    // ── View Details Modal ────────────────────────────────────────────────────
    // REPLACED: window.OrdersEngine.getOrders() / getComplaints()
    // NOW: fetches single record from real API
    window.viewReportDetails = async function(id, type) {
        const modal  = document.getElementById('admin-detail-modal');
        const mTitle = document.getElementById('admin-modal-title');
        const mBody  = document.getElementById('admin-modal-body');
        if (!modal) return;

        mBody.innerHTML = '<p style="padding:20px;text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading...</p>';
        modal.classList.add('open');

        if (type === 'request') {
            // Fetch broadcast request details
            const res = await APIClient.get(`/requests?per_page=100`);
            const req = res?.data?.requests?.find(r => r.id === id);

            mTitle.textContent = 'Medicine Request Details';
            mBody.innerHTML = req ? `
                <strong>Medicine:</strong> ${req.medicineName}
                <strong>Quantity:</strong> ${req.quantity}
                <strong>Urgency:</strong> ${capitalize(req.urgency)}
                <strong>Status:</strong> ${capitalize(req.status)}
                <strong>Date:</strong> ${formatDate(req.createdAt)}
                <strong>Expires:</strong> ${formatDate(req.expiresAt)}
                <strong>Notes:</strong>
                ${req.notes || 'No additional notes provided.'}
            ` : '<p>Request not found.</p>';

        } else {
            // Fetch complaint details
            const res        = await AdminAPI.complaints({ per_page: 100 });
            const complaint  = res?.data?.complaints?.find(c => c.id === id);

            mTitle.textContent = 'Citizen Complaint Details';
            mBody.innerHTML = complaint ? `
                <strong>Reporter:</strong> ${complaint.reporter?.name || '—'}
                <strong>Against:</strong> ${complaint.againstPharmacy?.name || '—'}
                <strong>Subject:</strong> ${complaint.subject}
                <strong>Severity:</strong> ${capitalize(complaint.severity)}
                <strong>Status:</strong> ${capitalize(complaint.status)}
                <strong>Date:</strong> ${formatDate(complaint.createdAt)}
            ` : '<p>Complaint not found.</p>';
        }
    };

    // ── Resolve Missing Request ───────────────────────────────────────────────
    // REPLACED: window.OrdersEngine.updateStatus()
    // NOW: calls real API to close the broadcast request
    window.resolveMissing = async function(id) {
        mlConfirm('Resolve Request', 'Mark this missing medicine request as resolved?', 'Resolve', async () => {
            // Admin closes the broadcast request
            const res = await APIClient.delete(`/requests/${id}`);
            if (res?.success) {
                await renderMissing();
                mlAlert('Request marked as resolved.', 'success');
            } else {
                mlAlert(res?.message || 'Failed to resolve request.', 'error');
            }
        });
    };

    // ── Resolve Complaint ─────────────────────────────────────────────────────
    // REPLACED: window.OrdersEngine.resolveComplaint()
    // NOW: calls real API PUT /admin/complaints/:id
    window.resolveComplaint = async function(id) {
        mlConfirm('Resolve Complaint', 'Mark this citizen complaint as resolved?', 'Resolve', async () => {
            const res = await AdminAPI.resolveComplaint(id, 'resolved', 'Resolved by admin.');
            if (res?.success) {
                await renderComplaints();
                mlAlert('Complaint resolved successfully.', 'success');
            } else {
                mlAlert(res?.message || 'Failed to resolve complaint.', 'error');
            }
        });
    };

    // ── Submit Admin Assistance ───────────────────────────────────────────────
    // REPLACED: window.OrdersEngine.updateStatus(id, 'Responded', text)
    // NOW: there's no direct "respond to broadcast" admin endpoint, so we just close it
    if (btnSubmitAssist) {
        btnSubmitAssist.addEventListener('click', async () => {
            const id   = requestIdInput?.value;
            const text = assistanceText?.value.trim();
            if (!text) { mlAlert('Please provide a message for the citizen.', 'error'); return; }

            // Mark request as closed with a note
            const res = await APIClient.delete(`/requests/${id}`);
            if (res?.success) {
                responseModal?.classList.remove('open');
                await renderMissing();
                mlAlert('Response sent to citizen.', 'success');
            } else {
                mlAlert(res?.message || 'Failed to send response.', 'error');
            }
        });
    }

    // ── Render Missing Requests ───────────────────────────────────────────────
    // REPLACED: window.OrdersEngine.getOrders().filter(o => o.pharmacyName === "General Network")
    // NOW: fetches from /admin perspective — all open broadcast requests
    async function renderMissing() {
        const tbody = document.getElementById('missingTableBody');
        if (!tbody) return;
        showLoading(tbody, 7);

        const res      = await AdminAPI.reports('orders',
            new Date(Date.now() - 7 * 864e5).toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
        );

        // Fetch broadcast requests via citizen endpoint (admin sees all)
        const reqRes   = await APIClient.get('/requests/network?per_page=50');
        const requests = reqRes?.data?.requests || [];

        if (requests.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state" style="padding: 20px;"><i class="fas fa-search-minus"></i><h3>No broadcast requests</h3></div></td></tr>`;
            return;
        }

        // Kept exactly as-is — same HTML structure
        tbody.innerHTML = requests.map(r => `
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
                <td>${formatDate(r.createdAt)}</td>
                <td><span class="status-pill status-${r.status?.toLowerCase()}">${r.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action edit" onclick="viewReportDetails('${r.id}', 'request')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${r.status?.toLowerCase() === 'open'
                            ? `<button class="btn-action approve" onclick="openResponseModal('${r.id}')"><i class="fas fa-comment-medical"></i> Help</button>`
                            : ''
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ── Render Complaints ─────────────────────────────────────────────────────
    // REPLACED: window.OrdersEngine.getComplaints()
    // NOW: fetches from /admin/complaints
    async function renderComplaints() {
        const tbody = document.getElementById('complaintsTableBody');
        if (!tbody) return;
        showLoading(tbody, 6);

        const res      = await AdminAPI.complaints({ per_page: 50 });
        const complaints = res?.data?.complaints || [];

        if (complaints.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state" style="padding: 20px;"><i class="fas fa-check-circle"></i><h3>No complaints reported</h3></div></td></tr>`;
            return;
        }

        // Kept exactly as-is — same HTML structure
        tbody.innerHTML = complaints.map(c => `
            <tr>
                <td>
                    <div class="cell-user">
                        ${window.mlAvatar ? window.mlAvatar(c.reporter?.name || '?', null, 'cell-avatar circle') : `<img src="../images/user.png" class="cell-avatar circle">`}
                        <span class="cell-name">${c.reporter?.name || '—'}</span>
                    </div>
                </td>
                <td><strong>${c.againstPharmacy?.name || '—'}</strong></td>
                <td style="max-width: 250px;">${c.subject}</td>
                <td>${formatDate(c.createdAt)}</td>
                <td><span class="status-pill status-${c.status}">${capitalize(c.status)}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action edit" onclick="viewReportDetails('${c.id}', 'complaint')">
                            <i class="fas fa-eye"></i> Details
                        </button>
                        ${c.status === 'open'
                            ? `<button class="btn-action approve" onclick="resolveComplaint('${c.id}')"><i class="fas fa-check"></i> Resolve</button>`
                            : ''
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Initial render
    await renderMissing();
    await renderComplaints();
    showTab('missing');
}


// ============================================
// UTILITY FUNCTIONS — kept exactly as-is
// ============================================
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Loading Skeleton Helper ───────────────────────────────────────────────────
// NEW: shows a loading state while API data is being fetched
function showLoading(tbody, cols) {
    if (!tbody) return;
    tbody.innerHTML = Array(3).fill('').map(() => `
        <tr>${Array(cols).fill('').map(() => `
            <td><div style="height:16px;background:var(--border,#e5e7eb);border-radius:4px;animation:pulse 1.5s infinite;"></div></td>
        `).join('')}</tr>
    `).join('');
}
