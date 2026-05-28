/**
 * MedLink UI UX Helpers
 * Replaces native alert() and confirm() with high-end, aesthetic UI components.
 * Version: 2.0 (Premium Revamp)
 * 
 * CHANGE from original:
 * - Logout interceptor now calls Auth.logout() (invalidates JWT token via API)
 *   instead of just navigating to index.html directly.
 * Everything else is identical.
 */

const MedLinkUI = {
    // 1. Toast Notifications
    toast: function(message, type = 'success', duration = 4000) {
        let container = document.querySelector('.ml-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'ml-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `ml-toast ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error:   'fa-exclamation-circle',
            info:    'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <div class="ml-toast-progress">
                <div class="ml-toast-progress-bar" style="animation-duration: ${duration}ms"></div>
            </div>
        `;

        container.appendChild(toast);

        const timer = setTimeout(() => { this.removeToast(toast); }, duration);
        toast.onclick = () => { clearTimeout(timer); this.removeToast(toast); };
    },

    removeToast: function(toast) {
        toast.style.animation = 'toastFadeOut 0.4s ease forwards';
        setTimeout(() => {
            toast.remove();
            const container = document.querySelector('.ml-toast-container');
            if (container && container.childNodes.length === 0) container.remove();
        }, 400);
    },

    // 2. Custom Confirmation Modal
    confirm: function(title, text, confirmBtnText, onConfirm) {
        let overlay = document.querySelector('.ml-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'ml-modal-overlay';
            overlay.innerHTML = `
                <div class="ml-modal">
                    <div class="ml-modal-icon"></div>
                    <h3 class="ml-modal-title"></h3>
                    <p class="ml-modal-text"></p>
                    <div class="ml-modal-actions">
                        <button class="btn btn-outline" id="ml-modal-cancel">Cancel</button>
                        <button class="btn btn-primary" id="ml-modal-confirm"></button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        const titleEl    = overlay.querySelector('.ml-modal-title');
        const textEl     = overlay.querySelector('.ml-modal-text');
        const confirmBtn = overlay.querySelector('#ml-modal-confirm');
        const cancelBtn  = overlay.querySelector('#ml-modal-cancel');
        const iconEl     = overlay.querySelector('.ml-modal-icon');

        titleEl.textContent    = title;
        textEl.textContent     = text;
        confirmBtn.textContent = confirmBtnText;

        const isDestructive = title.toLowerCase().includes('delete') || title.toLowerCase().includes('clear');
        if (isDestructive) {
            iconEl.innerHTML         = '<i class="fas fa-trash-alt"></i>';
            iconEl.style.background  = '#fef2f2';
            iconEl.style.color       = '#ef4444';
            confirmBtn.style.backgroundColor = '#ef4444';
            confirmBtn.style.borderColor     = '#ef4444';
        } else {
            iconEl.innerHTML         = '<i class="fas fa-question-circle"></i>';
            iconEl.style.background  = '#f0f9ff';
            iconEl.style.color       = 'var(--accent)';
            confirmBtn.style.backgroundColor = 'var(--accent)';
            confirmBtn.style.borderColor     = 'var(--accent)';
        }

        setTimeout(() => overlay.classList.add('open'), 10);

        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        const closeModal = () => {
            overlay.classList.remove('open');
            setTimeout(() => overlay.remove(), 400);
        };

        newConfirmBtn.addEventListener('click', () => { closeModal(); if (onConfirm) onConfirm(); });
        cancelBtn.addEventListener('click', closeModal);
        overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
    },

    // 3. Avatar Helper
    stringToColor: function(str) {
        if (!str) return '#074799';
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    },

    getInitials: function(name) {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) return '??';
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    },

    getAvatarHTML: function(name, image, className = 'cell-avatar') {
        if (image && image.trim() !== '') {
            return `<img src="${image}" alt="${name}" class="${className}" onerror="this.outerHTML=MedLinkUI.getAvatarHTML('${name}', null, '${className}')" />`;
        }
        const initials = this.getInitials(name);
        const color    = this.stringToColor(name);
        return `<div class="${className}" style="background-color: ${color}; overflow: hidden;">
            <div class="ml-avatar-placeholder">${initials}</div>
        </div>`;
    }
};

// Global shorthands — kept exactly as-is
window.mlAlert   = (msg, type) => MedLinkUI.toast(msg, type);
window.mlConfirm = (title, text, confirmBtn, callback) => MedLinkUI.confirm(title, text, confirmBtn, callback);
window.mlAvatar  = (name, img, cls) => MedLinkUI.getAvatarHTML(name, img, cls);

// ─── Logout Interceptor ───────────────────────────────────────────────────────
// CHANGED: now calls Auth.logout() which hits POST /auth/logout to invalidate
// the JWT token on the server, then clears localStorage and redirects.
// Previously it just navigated directly to index.html.
document.addEventListener('click', (e) => {
    const logoutLink = e.target.closest('a');

    if (logoutLink &&
        logoutLink.href.toLowerCase().endsWith('index.html') &&
        logoutLink.textContent.includes('Logout')) {

        e.preventDefault();

        mlConfirm(
            'Logout Confirmation',
            'Are you sure you want to sign out? Your session will be closed.',
            'Logout',
            () => {
                // CHANGED: use Auth.logout() instead of window.location.href
                if (window.Auth) {
                    Auth.logout();
                } else {
                    // Fallback if api-client.js not loaded yet
                    localStorage.clear();
                    window.location.href = logoutLink.href;
                }
            }
        );
    }
});
