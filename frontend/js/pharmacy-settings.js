/**
 * Pharmacy Settings — API Connected
 * All localStorage reads/writes replaced with real API calls.
 * All UI logic: form population, image preview, dropdown toggle kept exactly as-is.
 */

// ─── DOM References — kept exactly as-is ─────────────────────────────────────
let pharmNameInput     = document.getElementById('pharmacyNameInput');
let pharmOwnerInput    = document.getElementById('pharmacyOwnerInput');
let pharmPhoneInput    = document.getElementById('pharmacyPhoneInput');
let pharmEmailInput    = document.getElementById('pharmacyEmailInput');
let pharmLocationInput = document.getElementById('pharmacyLocationInput');
let pharmHoursInput    = document.getElementById('pharmacyHoursInput');
let pharmDeliveryInput = document.getElementById('pharmacyDeliveryInput');
let pharmCoverInput    = document.getElementById('pharmacyCoverInput');
let pharmCoverPreview  = document.getElementById('pharmacyCoverPreview');
let btnSaveSettings    = document.getElementById('btnSaveSettings');

let profileToggle      = document.getElementById('profileToggle');
let dropdownMenu       = document.getElementById('dropdownMenu');
let headerProfileImg   = document.getElementById('headerProfileImg');
let dropdownPharmName  = document.getElementById('dropdownPharmName');
let dropdownPharmEmail = document.getElementById('dropdownPharmEmail');

// ─── Auth Guard ───────────────────────────────────────────────────────────────
if (!Auth.isLoggedIn()) {
    window.location.href = '../auth/login.html';
}

// ─── Load Profile from API ────────────────────────────────────────────────────
// REPLACED: localStorage.getItem('pharmacy_profile')
// NOW: GET /users/me
async function loadPharmacyProfile() {
    const res  = await AuthAPI.getMe();
    const user = res?.data;

    if (!user) return;

    const name  = user.name || user.firstName || '';
    const email = user.email || '';
    const phone = user.phone || '';
    const addr  = user.address || '';
    const image = user.profileImage || 'images/PHAR.jpg';

    // Sync Header — kept exactly as-is
    if (dropdownPharmName)  dropdownPharmName.textContent  = name;
    if (dropdownPharmEmail) dropdownPharmEmail.textContent = email;
    if (headerProfileImg)   headerProfileImg.src           = image;

    // Sync Form — kept exactly as-is
    if (pharmNameInput)     pharmNameInput.value     = name;
    if (pharmOwnerInput)    pharmOwnerInput.value    = user.firstName || '';
    if (pharmPhoneInput)    pharmPhoneInput.value    = phone;
    if (pharmEmailInput)    pharmEmailInput.value    = email;
    if (pharmLocationInput) pharmLocationInput.value = addr;

    // Working hours — stored as JSON object in API, display as readable string
    if (pharmHoursInput && user.workingHours) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        pharmHoursInput.value = user.workingHours[today] || 'Closed';
    }

    // Delivery
    if (pharmDeliveryInput) {
        pharmDeliveryInput.value = user.deliveryAvailable ? 'Available' : 'Not Available';
    }

    // Cover image preview
    if (pharmCoverPreview) pharmCoverPreview.src = image;
}

// ─── Dropdown Toggle — kept exactly as-is ────────────────────────────────────
if (profileToggle) {
    profileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        profileToggle.parentElement.classList.toggle('open');
    });
}

document.addEventListener('click', function(e) {
    if (dropdownMenu && profileToggle &&
        !dropdownMenu.contains(e.target) &&
        !profileToggle.contains(e.target)) {
        profileToggle.parentElement.classList.remove('open');
    }
});

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
    });
}

// ─── Cover Image Upload ───────────────────────────────────────────────────────
// UPDATED: previews locally (same as before), then uploads to API
if (pharmCoverInput) {
    pharmCoverInput.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Local preview — kept exactly as-is
        const reader = new FileReader();
        reader.onload = function(ev) {
            if (pharmCoverPreview) pharmCoverPreview.src = ev.target.result;
            if (headerProfileImg)  headerProfileImg.src  = ev.target.result;
        };
        reader.readAsDataURL(file);

        // CHANGED: upload to API instead of storing base64 in localStorage
        const formData = new FormData();
        formData.append('file', file);

        const res = await APIClient.upload('/users/upload-avatar', formData);
        if (res?.success) {
            mlAlert('Profile image updated!', 'success');
        } else {
            mlAlert(res?.message || 'Image upload failed.', 'error');
        }
    };
}

// ─── Save Settings ────────────────────────────────────────────────────────────
// REPLACED: localStorage.setItem('pharmacy_profile', ...)
// NOW: PUT /users/me with real API call
if (btnSaveSettings) {
    btnSaveSettings.onclick = async function() {
        // Show loading state — same feel as before
        const originalText    = btnSaveSettings.innerHTML;
        btnSaveSettings.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        btnSaveSettings.disabled  = true;

        // Build payload from form values
        const payload = {
            phone:   pharmPhoneInput?.value?.trim()    || '',
            address: pharmLocationInput?.value?.trim() || '',
        };

        // If pharmacy name field exists and changed
        if (pharmNameInput?.value?.trim()) {
            payload.firstName = pharmNameInput.value.trim(); // maps to name for pharmacy
        }

        // Delivery available toggle
        if (pharmDeliveryInput) {
            payload.deliveryAvailable = pharmDeliveryInput.value === 'Available';
        }

        // Working hours — if the user typed a single time range, apply to all weekdays
        if (pharmHoursInput?.value?.trim()) {
            const hoursValue = pharmHoursInput.value.trim();
            payload.workingHours = {
                monday:    hoursValue,
                tuesday:   hoursValue,
                wednesday: hoursValue,
                thursday:  hoursValue,
                friday:    hoursValue,
                saturday:  hoursValue,
                sunday:    'closed',
            };
        }

        // CHANGED: save to real API
        const res = await AuthAPI.updateProfile(payload);

        btnSaveSettings.innerHTML = originalText;
        btnSaveSettings.disabled  = false;

        if (res?.success) {
            // Update header instantly — kept exactly as-is
            const name  = pharmNameInput?.value?.trim();
            const email = pharmEmailInput?.value?.trim();
            if (dropdownPharmName  && name)  dropdownPharmName.textContent  = name;
            if (dropdownPharmEmail && email) dropdownPharmEmail.textContent = email;

            mlAlert('Profile settings updated successfully!', 'success');
        } else {
            mlAlert(res?.message || 'Failed to save settings. Please try again.', 'error');
        }
    };
}

// ─── Password Change (if form exists on this page) ───────────────────────────
const changePasswordForm = document.getElementById('change-password-form');
if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPw = document.getElementById('current-password')?.value;
        const newPw     = document.getElementById('new-password')?.value;
        const confirmPw = document.getElementById('confirm-password')?.value;

        if (newPw !== confirmPw) {
            mlAlert('New passwords do not match.', 'error');
            return;
        }

        const submitBtn     = changePasswordForm.querySelector('button[type="submit"]');
        const originalText  = submitBtn?.innerHTML;
        if (submitBtn) { submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; submitBtn.disabled = true; }

        const res = await AuthAPI.changePassword(currentPw, newPw);

        if (submitBtn) { submitBtn.innerHTML = originalText; submitBtn.disabled = false; }

        if (res?.success) {
            mlAlert('Password changed successfully!', 'success');
            changePasswordForm.reset();
        } else {
            mlAlert(res?.message || 'Failed to change password.', 'error');
        }
    });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
loadPharmacyProfile();
