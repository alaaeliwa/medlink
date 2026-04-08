// Pharmacy Orders - Premium Logic
let ordersListEl = document.getElementById('ordersList');
let filterBtns = document.querySelectorAll('.filter-btn');

// Header elements
let profileToggle = document.getElementById('profileToggle');
let dropdownPharmName = document.getElementById('dropdownPharmName');
let dropdownPharmEmail = document.getElementById('dropdownPharmEmail');
let headerProfileImg = document.getElementById('headerProfileImg');

// Initialize Profile from localStorage
let pharmacyProfile = localStorage.getItem('pharmacy_profile') ? JSON.parse(localStorage.pharmacy_profile) : {
    name: 'Care Pharmacy',
    email: 'contact@carepharma.com',
    image: 'images/PHAR.jpg'
};

// Helper for unique user colors
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 45%)`;
}

// Dummy Orders for Demo
let medlinkOrders = localStorage.getItem('medlink_orders') ? JSON.parse(localStorage.medlink_orders) : [
    {
        id: "ORD-7721",
        customerName: "Ahmed Ali",
        medicineName: "Panadol Extra 500mg",
        quantity: 2,
        urgency: "urgent",
        notes: "I need it as soon as possible for high fever. Please confirm if delivery is possible.",
        timestamp: "10 mins ago",
        status: "Pending"
    },
    {
        id: "ORD-8832",
        customerName: "Sami Mansour",
        medicineName: "Augmentin 1g",
        quantity: 1,
        urgency: "standard",
        notes: "Subscription renewal. I'll pick it up in the evening.",
        timestamp: "2 hours ago",
        status: "Approved"
    },
    {
        id: "ORD-9910",
        customerName: "Laila H.",
        medicineName: "Euthyrox 50mcg",
        quantity: 3,
        urgency: "critical",
        notes: "Urgent! Chronic medicine, running out tonight. Please prioritize.",
        timestamp: "Just now",
        status: "Pending"
    },
    {
        id: "ORD-4412",
        customerName: "Noor J.",
        medicineName: "Ventolin Inhaler",
        quantity: 1,
        urgency: "urgent",
        notes: "Asthma flare-up. Please prepare it for immediate pickup.",
        timestamp: "1 hour ago",
        status: "Pending"
    }
];

// 1. Load Header Info
function loadHeader() {
    if (dropdownPharmName) dropdownPharmName.textContent = pharmacyProfile.name;
    if (dropdownPharmEmail) dropdownPharmEmail.textContent = pharmacyProfile.email;
    if (headerProfileImg && pharmacyProfile.image) {
        headerProfileImg.src = pharmacyProfile.image;
    }
}

// 2. Dropdown Toggle
if (profileToggle) {
    profileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.parentElement.classList.toggle('open');
    });
}
document.addEventListener('click', () => {
    if (profileToggle) profileToggle.parentElement.classList.remove('open');
});

// 3. Render Orders (Premium Grid)
function renderOrders(filter = 'all') {
    ordersListEl.className = "orders-grid"; // Ensure grid class is set
    ordersListEl.innerHTML = "";
    
    let filteredOrders = filter === 'all' 
        ? medlinkOrders 
        : medlinkOrders.filter(order => order.status === filter);

    if (filteredOrders.length === 0) {
        ordersListEl.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-clipboard-list" style="font-size: 4rem; color: #e2e8f0; margin-bottom: 1.5rem; display: block;"></i>
                <h3 style="color: var(--text-muted); font-size: 1.4rem;">No ${filter !== 'all' ? filter.toLowerCase() : ''} requests found.</h3>
                <p class="text-muted">Broadcast requests from citizens will appear here.</p>
            </div>`;
        return;
    }

    filteredOrders.forEach((order) => {
        const initials = order.customerName.split(' ').map(n => n[0]).join('').toUpperCase();
        const avatarColor = stringToColor(order.customerName);
        const realIndex = medlinkOrders.findIndex(o => o.id === order.id);

        let footerActions = "";
        if (order.status === "Pending") {
            footerActions = `
                <button class="btn-action btn-approve" onclick="updateOrderStatus(${realIndex}, 'Approved')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-action btn-decline" onclick="updateOrderStatus(${realIndex}, 'Cancelled')">
                    <i class="fas fa-times"></i> Decline
                </button>
            `;
        } else if (order.status === "Approved") {
            footerActions = `
                <button class="btn-action btn-ready" onclick="updateOrderStatus(${realIndex}, 'Ready')">
                    <i class="fas fa-box"></i> Mark as Ready
                </button>
            `;
        } else {
            footerActions = `<span class="status-badge status-${order.status}"><i class="fas fa-info-circle"></i> ${order.status}</span>`;
        }

        ordersListEl.innerHTML += `
            <div class="order-card" style="animation: fadeIn 0.4s ease forwards;">
                <span class="urgency-pill urgency-${order.urgency}">${order.urgency}</span>
                
                <div class="order-top">
                    <div class="customer-avatar" style="background: ${avatarColor}">${initials}</div>
                    <div class="customer-info">
                        <strong>${order.customerName}</strong>
                        <span class="order-time"><i class="far fa-clock"></i> ${order.timestamp}</span>
                    </div>
                </div>

                <div class="order-body">
                    <div class="med-request-box">
                        <span class="med-name">${order.medicineName}</span>
                        <div class="med-meta">
                            <span><i class="fas fa-layer-group"></i> ${order.quantity} Units</span>
                            <span><i class="fas fa-tag"></i> Market Price</span>
                        </div>
                    </div>
                    ${order.notes ? `<p class="order-notes">${order.notes}</p>` : ''}
                </div>

                <div class="order-footer">
                   ${order.status === 'Pending' || order.status === 'Approved' 
                     ? `<span class="status-badge status-${order.status}">${order.status}</span>` 
                     : ''}
                   <div class="order-actions" style="${order.status !== 'Pending' && order.status !== 'Approved' ? 'width: 100%; justify-content: center;' : ''}">
                        ${footerActions}
                   </div>
                </div>
            </div>
        `;
    });
}

// 4. Update Order Status
function updateOrderStatus(index, newStatus) {
    // Add a tiny delay for "feel"
    const cards = document.querySelectorAll('.order-card');
    // Find the card being updated (in theory we should use IDs, but index is okay for this demo)
    
    medlinkOrders[index].status = newStatus;
    localStorage.setItem('medlink_orders', JSON.stringify(medlinkOrders));
    
    // Modern Notification
    let type = 'success';
    if (newStatus === 'Cancelled') type = 'error';
    if (newStatus === 'Ready') type = 'info';
    
    mlAlert(`Order ${newStatus} Successfully!`, type);

    // Refresh current view
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    renderOrders(activeFilter);
}

// 5. Filter Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderOrders(this.dataset.filter);
    });
});

// Window scope
window.updateOrderStatus = updateOrderStatus;

// Initial calls
loadHeader();
renderOrders();
if (!localStorage.getItem('medlink_orders')) {
    localStorage.setItem('medlink_orders', JSON.stringify(medlinkOrders));
}
