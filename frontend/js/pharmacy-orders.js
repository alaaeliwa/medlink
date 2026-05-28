/**
 * Pharmacy Orders — API Connected
 * All localStorage profile reads and OrdersEngine localStorage calls
 * replaced with real API calls.
 * All UI: card rendering, filter tabs, status actions kept exactly as-is.
 */

// ─── DOM References — kept exactly as-is ─────────────────────────────────────
let ordersListEl      = document.getElementById('ordersList');
let filterBtns        = document.querySelectorAll('.filter-btn');
let profileToggle     = document.getElementById('profileToggle');
let dropdownPharmName = document.getElementById('dropdownPharmName');
let dropdownPharmEmail= document.getElementById('dropdownPharmEmail');
let headerProfileImg  = document.getElementById('headerProfileImg');

// ─── State ────────────────────────────────────────────────────────────────────
let medlinkOrders     = [];   // CHANGED: populated from API, not localStorage
let currentFilter     = 'all';

// ─── Auth Guard ───────────────────────────────────────────────────────────────
if (!Auth.isLoggedIn()) {
    window.location.href = '../auth/login.html';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
    await loadHeader();
    await refreshOrders();
}

// ─── Load Header Profile from API ────────────────────────────────────────────
// REPLACED: localStorage.getItem('pharmacy_profile')
// NOW: GET /users/me
async function loadHeader() {
    const res  = await AuthAPI.getMe();
    const user = res?.data || Auth.getUser();

    if (!user) return;

    const name  = user.name || user.firstName || 'Pharmacy';
    const email = user.email || '';
    const image = user.profileImage || null;

    if (dropdownPharmName)  dropdownPharmName.textContent  = name;
    if (dropdownPharmEmail) dropdownPharmEmail.textContent = email;
    if (headerProfileImg && image) headerProfileImg.src    = image;
}

// ─── Fetch Orders from API ────────────────────────────────────────────────────
// REPLACED: window.OrdersEngine.getOrders() which read from localStorage
// NOW: GET /orders (backend automatically filters by pharmacy role)
async function refreshOrders() {
    showLoadingSkeleton();

    const res     = await OrdersAPI.list({ per_page: 100 });
    medlinkOrders = (res?.data?.orders || []).map(normalizeOrder);

    renderOrders(currentFilter);
    updateFilterCounts();
}

// ─── Normalize API order to the shape the render function expects ─────────────
// Maps API field names → the names your existing HTML template uses
function normalizeOrder(order) {
    return {
        id:           order.id,
        customerName: order.citizen?.name || 'Customer',
        pharmacyName: order.pharmacy?.name || '',
        medicineName: (order.medicines?.[0]?.medicineName) || 'Medicine',
        quantity:     (order.medicines?.[0]?.quantity) || 1,
        price:        order.totalPrice || 0,
        urgency:      order.urgency || 'standard',
        notes:        order.notes || '',
        status:       capitalizeStatus(order.status),   // 'pending' → 'Pending'
        date:         order.orderDate
            ? new Date(order.orderDate).toLocaleDateString()
            : '—',
        time:         order.orderDate
            ? new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
    };
}

function capitalizeStatus(status) {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
}

// ─── Dropdown Toggle — kept exactly as-is ────────────────────────────────────
if (profileToggle) {
    profileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.parentElement.classList.toggle('open');
    });
}
document.addEventListener('click', () => {
    if (profileToggle) profileToggle.parentElement.classList.remove('open');
});

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
    });
}

// ─── Render Orders — kept exactly as-is ──────────────────────────────────────
// The entire card HTML template is unchanged
function renderOrders(filter = 'all') {
    if (!ordersListEl) return;
    ordersListEl.className = 'orders-grid';
    ordersListEl.innerHTML = '';

    const filteredOrders = filter === 'all'
        ? medlinkOrders
        : medlinkOrders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

    if (filteredOrders.length === 0) {
        ordersListEl.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-clipboard-list" style="font-size: 4rem; color: #e2e8f0; margin-bottom: 1.5rem; display: block;"></i>
                <h3 style="color: var(--text-muted); font-size: 1.4rem;">
                    No ${filter !== 'all' ? filter.toLowerCase() : ''} requests found.
                </h3>
                <p class="text-muted">Orders from citizens will appear here.</p>
            </div>`;
        return;
    }

    filteredOrders.forEach((order) => {
        const initials    = (order.customerName || 'Customer').split(' ').map(n => n[0]).join('').toUpperCase();
        const avatarColor = stringToColor(order.customerName || 'Customer');
        const orderId     = order.id;
        const timestamp   = order.time ? `${order.date}, ${order.time}` : (order.date || 'Recently');
        const statusLower = order.status.toLowerCase();

        // Action buttons based on status — kept exactly as-is
        let footerActions = '';
        if (statusLower === 'pending') {
            footerActions = `
                <button class="btn-action btn-approve" onclick="updateOrderStatus('${orderId}', 'approved')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-action btn-decline" onclick="updateOrderStatus('${orderId}', 'rejected')">
                    <i class="fas fa-times"></i> Decline
                </button>
            `;
        } else if (statusLower === 'approved') {
            footerActions = `
                <button class="btn-action btn-ready" onclick="updateOrderStatus('${orderId}', 'preparing')">
                    <i class="fas fa-box"></i> Start Preparing
                </button>
            `;
        } else if (statusLower === 'preparing') {
            footerActions = `
                <button class="btn-action btn-ready" onclick="updateOrderStatus('${orderId}', 'ready')">
                    <i class="fas fa-box-check"></i> Mark as Ready
                </button>
            `;
        } else if (statusLower === 'ready') {
            footerActions = `
                <button class="btn-action btn-approve" onclick="updateOrderStatus('${orderId}', 'delivered')">
                    <i class="fas fa-truck"></i> Mark Delivered
                </button>
            `;
        } else {
            footerActions = `
                <span class="status-badge status-${statusLower}">
                    <i class="fas fa-info-circle"></i> ${order.status}
                </span>`;
        }

        // Card HTML — kept exactly as-is
        ordersListEl.innerHTML += `
            <div class="order-card" style="animation: fadeIn 0.4s ease forwards;">
                <span class="urgency-pill urgency-${order.urgency}">${order.urgency}</span>

                <div class="order-top">
                    <div class="customer-avatar" style="background: ${avatarColor}">${initials}</div>
                    <div class="customer-info">
                        <strong>${order.customerName}</strong>
                        <span class="order-time"><i class="far fa-clock"></i> ${timestamp}</span>
                    </div>
                </div>

                <div class="order-body">
                    <div class="med-request-box">
                        <span class="med-name">${order.medicineName}</span>
                        <div class="med-meta">
                            <span><i class="fas fa-layer-group"></i> ${order.quantity} Units</span>
                            <span><i class="fas fa-tag"></i> $${parseFloat(order.price).toFixed(2)}</span>
                        </div>
                    </div>
                    ${order.notes ? `<p class="order-notes">${order.notes}</p>` : ''}
                </div>

                <div class="order-footer">
                    ${statusLower === 'pending' || statusLower === 'approved' || statusLower === 'preparing'
                        ? `<span class="status-badge status-${statusLower}">${order.status}</span>`
                        : ''}
                    <div class="order-actions" style="${!['pending','approved','preparing'].includes(statusLower) ? 'width:100%;justify-content:center;' : ''}">
                        ${footerActions}
                    </div>
                </div>
            </div>
        `;
    });
}

// ─── Update Order Status ──────────────────────────────────────────────────────
// REPLACED: window.OrdersEngine.updateStatus() which wrote to localStorage
// NOW: PUT /orders/:id/status via real API
async function updateOrderStatus(id, newStatus) {
    // Optimistic UI — disable the clicked button immediately
    event?.target?.closest('button')?.setAttribute('disabled', 'true');

    const res = await OrdersAPI.updateStatus(id, newStatus, '');

    if (res?.success) {
        let type = 'success';
        if (newStatus === 'rejected' || newStatus === 'cancelled') type = 'error';
        if (newStatus === 'ready' || newStatus === 'preparing')    type = 'info';

        mlAlert(`Order ${capitalizeStatus(newStatus)} Successfully!`, type);

        // Re-fetch from API so counts and states are accurate
        await refreshOrders();

    } else {
        mlAlert(res?.message || 'Failed to update order. Please try again.', 'error');
        event?.target?.closest('button')?.removeAttribute('disabled');
    }
}

// ─── Filter Tabs — kept exactly as-is ────────────────────────────────────────
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderOrders(currentFilter);
    });
});

// ─── Update filter tab counts ─────────────────────────────────────────────────
// NEW: shows live counts on each tab badge
function updateFilterCounts() {
    const counts = {
        all:       medlinkOrders.length,
        pending:   medlinkOrders.filter(o => o.status.toLowerCase() === 'pending').length,
        approved:  medlinkOrders.filter(o => o.status.toLowerCase() === 'approved').length,
        preparing: medlinkOrders.filter(o => o.status.toLowerCase() === 'preparing').length,
        ready:     medlinkOrders.filter(o => o.status.toLowerCase() === 'ready').length,
        delivered: medlinkOrders.filter(o => o.status.toLowerCase() === 'delivered').length,
        rejected:  medlinkOrders.filter(o => o.status.toLowerCase() === 'rejected').length,
    };

    filterBtns.forEach(btn => {
        const filter = btn.dataset.filter;
        const badge  = btn.querySelector('.count-badge, .filter-count');
        if (badge && counts[filter] !== undefined) {
            badge.textContent = counts[filter];
        }
    });
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
// NEW: shows while orders are being fetched
function showLoadingSkeleton() {
    if (!ordersListEl) return;
    ordersListEl.className = 'orders-grid';
    ordersListEl.innerHTML = Array(4).fill('').map(() => `
        <div class="order-card" style="opacity:0.5;">
            <div style="height:14px;width:60px;background:var(--border,#e5e7eb);border-radius:20px;margin-bottom:16px;"></div>
            <div style="height:40px;background:var(--border,#e5e7eb);border-radius:8px;margin-bottom:12px;"></div>
            <div style="height:60px;background:var(--border,#e5e7eb);border-radius:8px;margin-bottom:12px;"></div>
            <div style="height:36px;background:var(--border,#e5e7eb);border-radius:8px;"></div>
        </div>
    `).join('');
}

// ─── Utility — kept exactly as-is ────────────────────────────────────────────
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 45%)`;
}

// ─── Window Scope — kept exactly as-is ───────────────────────────────────────
window.updateOrderStatus = updateOrderStatus;

// ─── Boot ─────────────────────────────────────────────────────────────────────
init();
