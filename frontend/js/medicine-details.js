// medicine-details.js — fetches and renders a single medicine from the API

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        window.location.href = 'medicines.html';
        return;
    }

    showSkeleton();

    const res = await MedicinesAPI.get(id);
    if (!res?.success) {
        MedLinkUI.toast('Medicine not found.', 'error');
        setTimeout(() => window.location.href = 'medicines.html', 1500);
        return;
    }

    renderMedicine(res.data);
    bindFavoriteBtn(res.data);
});

// ─── Render ───────────────────────────────────────────────────────────────────

function renderMedicine(med) {
    const lowestPrice  = med.availableAt.length ? Math.min(...med.availableAt.map(p => p.price)) : 0;
    const highestPrice = med.availableAt.length ? Math.max(...med.availableAt.map(p => p.price)) : 0;

    document.title = `${med.name} - MedLink`;

    el('med-breadcrumb').textContent   = med.name;
    el('med-title').textContent        = med.name;
    el('med-category').textContent     = med.category;
    el('med-description').textContent  = med.description;

    el('med-pharmacy-count').textContent = `Available in ${med.availableAt.length} Local Pharmacie${med.availableAt.length !== 1 ? 's' : ''}`;
    el('med-price-range').textContent    = med.availableAt.length
        ? `Price: $${lowestPrice.toFixed(2)} – $${highestPrice.toFixed(2)}`
        : 'Price: Not available';
    el('med-prescription').textContent   = med.requiresPrescription
        ? 'Prescription Required'
        : 'No Prescription Required (OTC)';

    // Extra info
    if (med.sideEffects)  el('med-side-effects').textContent  = med.sideEffects;
    if (med.precautions)  el('med-precautions').textContent   = med.precautions;
    if (med.manufacturer) el('med-manufacturer').textContent  = med.manufacturer;
    if (med.strength)     el('med-strength').textContent      = med.strength;
    if (med.form)         el('med-form').textContent          = med.form;

    if (med.activeIngredients?.length) {
        el('med-ingredients').textContent = med.activeIngredients.join(', ');
    }

    // Favorite state
    const favBtn = document.getElementById('med-fav-btn');
    if (favBtn) {
        favBtn.querySelector('i').className = med.isFavorite ? 'fas fa-heart' : 'far fa-heart';
        favBtn.classList.toggle('active', med.isFavorite);
        favBtn.dataset.id = med.id;
    }

    // Pharmacies list
    renderPharmacies(med.availableAt, med.name, med.id);
}

function renderPharmacies(list, medicineName, medicineId) {
    const grid = el('pharmacies-grid');
    if (!grid) return;

    if (!list.length) {
        grid.innerHTML = '<p class="text-muted">No pharmacies currently stock this medicine.</p>';
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="modern-card stock-card">
            <div>
                <h4 class="stock-title" style="font-size:1.3rem;margin-bottom:8px;">${p.pharmacyName}</h4>
                <p class="text-muted mb-0"><i class="fas fa-map-marker-alt text-accent"></i> ${p.area}</p>
                ${p.rating ? `<p class="text-muted mb-0"><i class="fas fa-star text-warning"></i> ${p.rating.toFixed(1)}</p>` : ''}
                <span class="text-success font-bold" style="display:inline-block;margin-top:12px;">
                    <i class="fas fa-check-circle"></i> In Stock (${p.quantity}) — $${p.price.toFixed(2)}
                </span>
            </div>
            <div class="flex-btn-group">
                <a href="pharmacy-details.html?id=${p.pharmacyId}" class="btn btn-primary modern-btn-outline" style="text-align:center;flex:1;font-size:0.9rem;padding:10px;">View</a>
                <button class="btn btn-primary modern-btn btn-request"
                    data-pharmacy-id="${p.pharmacyId}"
                    data-pharmacy="${p.pharmacyName}"
                    data-medicine="${medicineName}"
                    data-medicine-id="${medicineId}"
                    data-price="${p.price}"
                    style="flex:2;font-size:0.9rem;padding:10px;">
                    Request Now
                </button>
            </div>
        </div>
    `).join('');
}

// ─── Favorite Toggle ──────────────────────────────────────────────────────────

function bindFavoriteBtn(med) {
    const favBtn = document.getElementById('med-fav-btn');
    if (!favBtn) return;

    favBtn.addEventListener('click', async () => {
        const res = await FavoritesAPI.toggle('medicine', med.id, med);
        if (res?.success) {
            const isFav = res.data?.isFavorite;
            favBtn.querySelector('i').className = isFav ? 'fas fa-heart' : 'far fa-heart';
            favBtn.classList.toggle('active', isFav);
            MedLinkUI.toast(isFav ? 'Added to favorites' : 'Removed from favorites', 'success');
        }
    });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function showSkeleton() {
    const title = el('med-title');
    if (title) title.textContent = 'Loading...';
    const desc = el('med-description');
    if (desc) desc.textContent = '';
}

// ─── Util ─────────────────────────────────────────────────────────────────────

function el(id) {
    return document.getElementById(id);
}
