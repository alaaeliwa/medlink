// pharmacy-details.js — fetches and renders a single pharmacy from the API

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        window.location.href = 'pharmacies.html';
        return;
    }

    const res = await PharmaciesAPI.get(id);
    if (!res?.success) {
        MedLinkUI.toast('Pharmacy not found.', 'error');
        setTimeout(() => window.location.href = 'pharmacies.html', 1500);
        return;
    }

    renderPharmacy(res.data);
    bindComplaintForm(res.data.id);
    bindCallBtn(res.data.phone);
    bindSearch(res.data.medicines || [], res.data.name, res.data.id);
});

// ─── Render ───────────────────────────────────────────────────────────────────

function renderPharmacy(p) {
    // Hero
    setEl('pharm-name-hero', p.name);
    setEl('pharm-name-hero2', p.name);
    setEl('pharm-address', p.address || p.area || '—');
    setEl('pharm-rating', `${parseFloat(p.rating || 0).toFixed(1)} Rating (${p.reviewCount || 0} reviews)`);

    const statusBadge = document.getElementById('pharm-status-badge');
    if (statusBadge) {
        statusBadge.innerHTML = p.isOpenNow
            ? '<i class="fas fa-circle text-xs"></i> Open Now'
            : '<i class="fas fa-circle text-xs" style="color:var(--danger)"></i> Closed';
        statusBadge.className = `glass-badge mb-4 ${p.isOpenNow ? 'success-badge' : 'danger-badge'}`;
        statusBadge.style = 'background:white;position:static;display:inline-block;';
    }

    // Info bar
    const todayHours = getTodayHours(p.workingHours);
    setEl('pharm-hours', todayHours);
    setEl('pharm-phone', p.phone ? formatPhone(p.phone) : '—');
    setEl('pharm-delivery', p.deliveryAvailable
        ? `<i class="fas fa-check"></i> Available${p.deliveryFee ? ` ($${p.deliveryFee} fee)` : ''}`
        : '<i class="fas fa-times"></i> Not Available');

    // Inventory grid
    renderInventory(p.medicines || [], p.name, p.id);

    // Empty state text
    const emptySpan = document.getElementById('search-query-display');
    if (emptySpan) {
        const pharmacyLabel = document.querySelector('#empty-state p .highlight-query');
        if (pharmacyLabel) pharmacyLabel.closest('p').innerHTML =
            `We couldn't find "<span id="search-query-display" class="highlight-query"></span>" in ${p.name}.`;
    }
}

function renderInventory(medicines, pharmacyName, pharmacyId) {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;

    if (!medicines.length) {
        grid.innerHTML = '<p class="text-muted">No medicines in stock.</p>';
        return;
    }

    grid.innerHTML = medicines.map(m => `
        <div class="modern-card inventory-card" data-medicine="${m.medicineName.toLowerCase()}">
            <div class="card-image-wrapper">
                <img src="../images/MID.webp" alt="${m.medicineName}" class="card-img" />
                <button class="favorite-btn floating-action" data-id="${m.medicineId}" title="Add to Favorites">
                    <i class="far fa-heart"></i>
                </button>
                <div class="glass-badge">${statusLabel(m.status)}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${m.medicineName}</h3>
                <div class="card-meta">
                    <div class="meta-item"><i class="fas fa-boxes text-success"></i> <span class="font-bold">In Stock (${m.quantity})</span></div>
                    <div class="meta-item"><i class="fas fa-tag text-accent"></i> <span>$${parseFloat(m.price).toFixed(2)}</span></div>
                </div>
                <div class="flex-btn-group">
                    <a href="medicine-details.html?id=${m.medicineId}" class="btn btn-outline modern-btn-outline" style="flex:1;text-align:center;font-size:0.9rem;padding:10px;">Details</a>
                    <button class="btn btn-primary modern-btn btn-request"
                        data-pharmacy-id="${pharmacyId}"
                        data-pharmacy="${pharmacyName}"
                        data-medicine="${m.medicineName}"
                        data-medicine-id="${m.medicineId}"
                        data-price="${m.price}"
                        style="flex:1;font-size:0.9rem;padding:10px;">Request</button>
                </div>
            </div>
        </div>
    `).join('');

    // Bind favorite buttons
    grid.querySelectorAll('.favorite-btn[data-id]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const res = await FavoritesAPI.toggle('medicine', btn.dataset.id);
            if (res?.success) {
                const isFav = res.data?.isFavorite;
                btn.classList.toggle('active', isFav);
                btn.querySelector('i').className = isFav ? 'fas fa-heart text-danger' : 'far fa-heart';
                MedLinkUI.toast(isFav ? 'Added to favorites' : 'Removed from favorites', 'success');
            }
        });
    });
}

// ─── Search ───────────────────────────────────────────────────────────────────

function bindSearch(medicines, pharmacyName, pharmacyId) {
    const input = document.getElementById('medicine-search');
    if (!input) return;

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        const cards = document.querySelectorAll('#inventory-grid .inventory-card');

        if (!q) {
            cards.forEach(c => c.style.display = '');
            return;
        }

        let found = 0;
        cards.forEach(c => {
            const name = c.dataset.medicine || '';
            const visible = name.includes(q);
            c.style.display = visible ? '' : 'none';
            if (visible) found++;
        });

        const emptyState = document.getElementById('empty-state');
        const queryDisplay = document.getElementById('search-query-display');
        if (emptyState) {
            emptyState.style.display = found === 0 ? 'block' : 'none';
            if (queryDisplay) queryDisplay.textContent = input.value.trim();
        }
    });
}

// ─── Complaint Form ───────────────────────────────────────────────────────────

function bindComplaintForm(pharmacyId) {
    const openBtn  = document.getElementById('btn-open-complaint');
    const closeBtn = document.getElementById('btn-close-complaint');
    const modal    = document.getElementById('complaint-modal');
    const form     = document.getElementById('complaint-form');

    if (openBtn && modal)  openBtn.addEventListener('click',  () => modal.classList.add('active'));
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const subject  = document.getElementById('complaint-category')?.value;
            const details  = document.getElementById('complaint-details')?.value;
            if (!subject || !details) return;

            const res = await ComplaintsAPI.submit(pharmacyId, subject, details);
            if (res?.success) {
                MedLinkUI.toast('Complaint submitted successfully.', 'success');
                modal.classList.remove('active');
                form.reset();
            } else {
                MedLinkUI.toast(res?.message || 'Failed to submit complaint.', 'error');
            }
        });
    }
}

// ─── Call Button ──────────────────────────────────────────────────────────────

function bindCallBtn(phone) {
    const btn = document.getElementById('btn-call');
    if (btn && phone) {
        btn.addEventListener('click', () => window.open(`tel:${phone}`));
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setEl(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function getTodayHours(workingHours) {
    if (!workingHours) return '—';
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const today = days[new Date().getDay()];
    const hours = workingHours[today];
    if (!hours || hours === 'closed') return 'Closed today';
    return hours.replace('-', ' – ');
}

function formatPhone(phone) {
    return '+' + phone.replace(/\D/g, '');
}

function statusLabel(status) {
    return status === 'in_stock' ? 'In Stock' : status === 'low_stock' ? 'Low Stock' : 'Out of Stock';
}
