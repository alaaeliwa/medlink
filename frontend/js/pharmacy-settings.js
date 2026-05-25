// Pharmacy Settings Elements
let pharmNameInput = document.getElementById('pharmacyNameInput');
let pharmOwnerInput = document.getElementById('pharmacyOwnerInput');
let pharmPhoneInput = document.getElementById('pharmacyPhoneInput');
let pharmEmailInput = document.getElementById('pharmacyEmailInput');
let pharmLocationInput = document.getElementById('pharmacyLocationInput');
let pharmHoursInput = document.getElementById('pharmacyHoursInput');
let pharmDeliveryInput = document.getElementById('pharmacyDeliveryInput');
let pharmCoverInput = document.getElementById('pharmacyCoverInput');
let pharmCoverPreview = document.getElementById('pharmacyCoverPreview');
let btnSaveSettings = document.getElementById('btnSaveSettings');
let settingsSaveStatus = document.getElementById('settingsSaveStatus');

// Header & Profile Dropdown Elements
let profileToggle = document.getElementById('profileToggle');
let dropdownMenu = document.getElementById('dropdownMenu');
let headerProfileImg = document.getElementById('headerProfileImg');
let dropdownPharmName = document.getElementById('dropdownPharmName');
let dropdownPharmEmail = document.getElementById('dropdownPharmEmail');

// Initialize data from localStorage
let pharmacyProfile = localStorage.getItem('pharmacy_profile') ? JSON.parse(localStorage.pharmacy_profile) : {
    name: 'Care Pharmacy',
    owner: 'Pharmacist Sarah',
    phone: '+962 79 000 0000',
    location: 'Gaza',
    email: 'contact@carepharma.com',
    hours: '8:00 AM - 11:30 PM',
    delivery: 'Available',
    image: 'images/PHAR.jpg'
};

// 1. Load Profile Data into Header & UI
function loadPharmacyProfile() {
    // Sync Header
    if (dropdownPharmName) dropdownPharmName.textContent = pharmacyProfile.name || '';
    if (dropdownPharmEmail) dropdownPharmEmail.textContent = pharmacyProfile.email || '';
    if (headerProfileImg && pharmacyProfile.image) {
        headerProfileImg.src = pharmacyProfile.image;
    }

    // Sync Form
    if (pharmNameInput) pharmNameInput.value = pharmacyProfile.name || '';
    if (pharmOwnerInput) pharmOwnerInput.value = pharmacyProfile.owner || '';
    if (pharmPhoneInput) pharmPhoneInput.value = pharmacyProfile.phone || '';
    if (pharmEmailInput) pharmEmailInput.value = pharmacyProfile.email || '';
    if (pharmLocationInput) pharmLocationInput.value = pharmacyProfile.location || '';
    if (pharmHoursInput) pharmHoursInput.value = pharmacyProfile.hours || '';
    if (pharmDeliveryInput) pharmDeliveryInput.value = pharmacyProfile.delivery || 'Available';
    if (pharmCoverPreview && pharmacyProfile.image) {
        pharmCoverPreview.src = pharmacyProfile.image;
    }
}

// 2. Dropdown Toggle Logic
if (profileToggle) {
    profileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        profileToggle.parentElement.classList.toggle('open');
    });
}

// Close dropdown on click outside
document.addEventListener('click', function(e) {
    if (dropdownMenu && !dropdownMenu.contains(e.target) && !profileToggle.contains(e.target)) {
        profileToggle.parentElement.classList.remove('open');
    }
});

// 3. Handle Cover Image Upload
if (pharmCoverInput) {
    pharmCoverInput.onchange = function(e) {
        let file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                pharmacyProfile.image = e.target.result;
                pharmCoverPreview.src = e.target.result;
                if (headerProfileImg) headerProfileImg.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    };
}

// 4. Save Pharmacy Profile
if (btnSaveSettings) {
    btnSaveSettings.onclick = function() {
        pharmacyProfile = {
            ...pharmacyProfile,
            name: pharmNameInput.value,
            owner: pharmOwnerInput.value,
            phone: pharmPhoneInput.value,
            email: pharmEmailInput.value,
            location: pharmLocationInput.value,
            hours: pharmHoursInput.value,
            delivery: pharmDeliveryInput.value
        };
        localStorage.setItem('pharmacy_profile', JSON.stringify(pharmacyProfile));
        
        // Update header instantly
        if (dropdownPharmName) dropdownPharmName.textContent = pharmacyProfile.name;
        if (dropdownPharmEmail) dropdownPharmEmail.textContent = pharmacyProfile.email;

        localStorage.setItem('pharmacy_profile', JSON.stringify(pharmacyProfile));
        
        // Update header instantly
        if (dropdownPharmName) dropdownPharmName.textContent = pharmacyProfile.name;
        if (dropdownPharmEmail) dropdownPharmEmail.textContent = pharmacyProfile.email;

        // Modern notification
        mlAlert('Profile settings updated successfully!', 'success');
    };
}

// Initial calls
loadPharmacyProfile();
