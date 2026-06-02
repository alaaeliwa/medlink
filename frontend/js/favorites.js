// favorites.js — fetches and renders user favorites from the API

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('favorites-grid');
    if (!grid) return;

    grid.innerHTML = skeletonCards(3);

    const res = await FavoritesAPI.list('all');
    if (!res?.success) {
        grid.innerHTML = '<p class="text-muted">Could not load favorites.</p>';
        return;
    }

    const favorites = res.data?.favorites || [];

    if (favorites.length) {
        await renderFavorites(grid, favorites);
        bindRemoveFavorites(grid);
    } else {
        showEmptyState(grid);
    }
});


function showEmptyState(grid) {
    grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;padding:60px 24px;text-align:center;">
            <div class="empty-icon-modern" style="width:70px;height:70px;font-size:1.8rem;margin:0 auto 20px;">
                <i class="far fa-heart"></i>
            </div>
            <h3>No favorites yet</h3>
            <p class="text-muted">Browse medicines and pharmacies and add them to your favorites.</p>
            <a href="medicines.html" class="btn btn-primary modern-btn mt-4" style="padding:12px 28px;">Browse Medicines</a>
        </div>`;
}

async function renderFavorites(grid, favorites) {
    const cards = await Promise.all(favorites.map(async fav => {
        if (fav.type === 'medicine' || fav.targetType === 'medicine') {
            const favData = fav.favoriteData || fav.target || fav;
            const medId = fav.favoriteId || fav.targetId || favData.id;
            
            // Fetch real medicine data
            const medRes = await MedicinesAPI.get(medId);
            const m = medRes?.data || favData;
            
            const pharmaciesCount = m.pharmaciesCount ?? (m.availableAt?.length || 0);
            const lowestPrice = m.lowestPrice ?? (m.availableAt?.length ? Math.min(...m.availableAt.map(p => p.price)) : 0);

            return `
                <div class="modern-card" data-fav-id="${fav.id}">
                    <div class="card-image-wrapper">
                        <img src="../images/MID.webp" alt="${m.name || 'Medicine'}" class="card-img" />
                        <button class="favorite-btn floating-action active" data-target-id="${medId}" data-type="medicine" title="Remove from Favorites">
                            <i class="fas fa-heart text-danger"></i>
                        </button>
                        <div class="glass-badge">${m.category || 'Medicine'}</div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${m.name || '—'}</h3>
                        <div class="card-meta">
                            <div class="meta-item"><i class="fas fa-store-alt text-success"></i> <span>${pharmaciesCount} Pharmacies</span></div>
                            <div class="meta-item"><i class="fas fa-tag text-accent"></i> <span>From $${parseFloat(lowestPrice).toFixed(2)}</span></div>
                        </div>
                        <a href="medicine-details.html?id=${medId}" class="btn btn-primary w-full modern-btn-outline" style="text-align:center;">View Details</a>
                    </div>
                </div>`;
        } else {
            const favData = fav.favoriteData || fav.target || fav;
            const pharmId = fav.favoriteId || fav.targetId || favData.id;
            
            // Fetch real pharmacy data
            const pharmRes = await PharmaciesAPI.get(pharmId);
            const p = pharmRes?.data || favData;
            const rating = parseFloat(p.rating || 0).toFixed(1);
            
            return `
                <div class="modern-card" data-fav-id="${fav.id}">
                    <div class="card-image-wrapper pharmacy-wrapper">
                        <img src="../images/PHAR.jpg" alt="${p.name || 'Pharmacy'}" class="card-img" />
                        <button class="favorite-btn floating-action active" data-target-id="${pharmId}" data-type="pharmacy" title="Remove from Favorites">
                            <i class="fas fa-heart text-danger"></i>
                        </button>
                        <div class="glass-badge success-badge"><i class="fas fa-circle text-xs"></i> ${p.area || 'Nearby'}</div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${p.name || '—'}</h3>
                        <p class="pharmacy-address"><i class="fas fa-map-marker-alt text-accent"></i> ${p.area || '—'}</p>
                        <div class="pharmacy-stats">
                            <span class="rating"><i class="fas fa-star text-warning"></i> ${rating > 0 ? rating : 'New'}</span>
                        </div>
                        <a href="pharmacy-details.html?id=${pharmId}" class="btn btn-outline w-full hover-fill modern-btn-outline pharmacy-btn" style="text-align:center;">View Pharmacy</a>
                    </div>
                </div>`;
        }
    }));
    
    grid.innerHTML = cards.join('');
}

function bindRemoveFavorites(grid) {
    grid.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.dataset.targetId;
            const type = btn.dataset.type;

            // Disable button to prevent double-click
            btn.disabled = true;

            const res = await FavoritesAPI.toggle(type, targetId);
            if (res?.success && !res.data?.isFavorite) {
                // Item was removed from favorites
                const card = btn.closest('.modern-card');
                card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.92) translateY(10px)';
                setTimeout(() => {
                    card.remove();
                    // Check if grid is now empty
                    if (!grid.querySelectorAll('.modern-card').length) {
                        showEmptyState(grid);
                    }
                }, 350);
                MedLinkUI.toast('Removed from favorites', 'success');
            } else {
                btn.disabled = false;
            }
        });
    });
}

function skeletonCards(count) {
    return Array(count).fill(`
        <div class="modern-card" style="opacity:0.5;">
            <div class="card-image-wrapper" style="background:var(--border);height:180px;border-radius:12px;"></div>
            <div class="card-content">
                <div style="background:var(--border);height:18px;border-radius:6px;margin-bottom:12px;"></div>
                <div style="background:var(--border);height:14px;border-radius:6px;width:60%;"></div>
            </div>
        </div>
    `).join('');
}
