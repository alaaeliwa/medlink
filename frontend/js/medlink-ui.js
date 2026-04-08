/**
 * MedLink UI UX Helpers
 * Replaces native alert() and confirm() with high-end, aesthetic UI components.
 * Version: 2.0 (Premium Revamp)
 */

const MedLinkUI = {
    // 1. Toast Notifications (Revamped with Glassmorphism & Progress Bar)
    toast: function(message, type = 'success', duration = 4000) {
        let container = document.querySelector('.ml-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'ml-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `ml-toast ${type}`;
        
        // Icon mapping
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <div class="ml-toast-progress">
                <div class="ml-toast-progress-bar" style="animation-duration: ${duration}ms"></div>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after duration
        const timer = setTimeout(() => {
            this.removeToast(toast);
        }, duration);

        // Allow manual close on click
        toast.onclick = () => {
            clearTimeout(timer);
            this.removeToast(toast);
        };
    },

    removeToast: function(toast) {
        toast.style.animation = 'toastFadeOut 0.4s ease forwards';
        setTimeout(() => {
            toast.remove();
            // Remove container if empty for clean DOM
            const container = document.querySelector('.ml-toast-container');
            if (container && container.childNodes.length === 0) {
                container.remove();
            }
        }, 400);
    },

    // 2. Custom Confirmation Modal (Premium Revamp)
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

        const titleEl = overlay.querySelector('.ml-modal-title');
        const textEl = overlay.querySelector('.ml-modal-text');
        const confirmBtn = overlay.querySelector('#ml-modal-confirm');
        const cancelBtn = overlay.querySelector('#ml-modal-cancel');
        const iconContainer = overlay.querySelector('.ml-modal-icon');

        titleEl.textContent = title;
        textEl.textContent = text;
        confirmBtn.textContent = confirmBtnText;

        // Visual distinction for destructive actions (Delete)
        const isDestructive = title.toLowerCase().includes('delete') || title.toLowerCase().includes('clear');
        
        if (isDestructive) {
            iconContainer.innerHTML = '<i class="fas fa-trash-alt"></i>';
            iconContainer.style.background = '#fef2f2';
            iconContainer.style.color = '#ef4444';
            confirmBtn.style.backgroundColor = '#ef4444';
            confirmBtn.style.borderColor = '#ef4444';
        } else {
            iconContainer.innerHTML = '<i class="fas fa-question-circle"></i>';
            iconContainer.style.background = '#f0f9ff';
            iconContainer.style.color = 'var(--accent)';
            confirmBtn.style.backgroundColor = 'var(--accent)';
            confirmBtn.style.borderColor = 'var(--accent)';
        }

        // Add 'open' class for animation
        setTimeout(() => overlay.classList.add('open'), 10);

        // Cleanup and reattach listeners (cloning removes all internal listeners)
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        const closeModal = () => {
            overlay.classList.remove('open');
            // Remove overlay from DOM after animation for fresh state next time
            setTimeout(() => overlay.remove(), 400);
        };

        newConfirmBtn.addEventListener('click', () => {
            closeModal();
            if (onConfirm) onConfirm();
        });

        cancelBtn.addEventListener('click', closeModal);

        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal();
        };
    }
};

// Global shorthand for easy usage
window.mlAlert = (msg, type) => MedLinkUI.toast(msg, type);
window.mlConfirm = (title, text, confirmBtn, callback) => MedLinkUI.confirm(title, text, confirmBtn, callback);

// 3. Global Graceful Logout Interceptor
document.addEventListener('click', (e) => {
    const logoutLink = e.target.closest('a[href="index.html"]');
    if (logoutLink && (logoutLink.textContent.includes('Logout') || logoutLink.textContent.includes('تسجيل الخروج'))) {
        e.preventDefault();
        
        mlConfirm(
            'Logout Confirmation',
            'Are you sure you want to sign out? Your session will be closed.',
            'Logout',
            () => {
                window.location.href = 'index.html';
            }
        );
    }
});
