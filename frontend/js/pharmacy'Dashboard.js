// Medicine Elements
let medicineName = document.getElementById('medicineName');
let medicineStrength = document.getElementById('medicineStrength');
let medicineCategory = document.getElementById('medicineCategory');
let medicinePrice = document.getElementById('medicinePrice');
let medicineAmount = document.getElementById('medicineAmount');
let medicineImageInput = document.getElementById('medicineImageInput');
let medicineImagePreview = document.getElementById('medicineImagePreview');
let medicineImagePreviewContainer = document.getElementById('medicineImagePreviewContainer');
let medicinePrescription = document.getElementById('medicinePrescription');
let medicineDescription = document.getElementById('medicineDescription');
let btnAdd = document.getElementById('btnAdd');

// Header & Profile Dropdown Elements
let profileToggle = document.getElementById('profileToggle');
let dropdownMenu = document.getElementById('dropdownMenu');
let headerProfileImg = document.getElementById('headerProfileImg');
let dropdownPharmName = document.getElementById('dropdownPharmName');
let dropdownPharmEmail = document.getElementById('dropdownPharmEmail');

// Stats and Search Elements
let totalMedicinesCount = document.getElementById('totalMedicines');
let lowStockCountEl = document.getElementById('runOut');
let orderCountEl = document.getElementById('order');
let medicineNameSearch = document.getElementById('medicineNameSearch');
let welcomeTitle = document.querySelector('.welcome-text h1');

let mood = 'Add';
let tmpIndex;
let currentBase64Image = "";

// Initialize data from localStorage
let dataMedicine = localStorage.getItem('medicine') ? JSON.parse(localStorage.medicine) : [];
let pharmacyProfile = localStorage.getItem('pharmacy_profile') ? JSON.parse(localStorage.pharmacy_profile) : {
    name: 'Care Pharmacy',
    email: 'contact@carepharma.com',
    image: 'images/PHAR.jpg'
};
let medlinkOrders = localStorage.getItem('medlink_orders') ? JSON.parse(localStorage.medlink_orders) : [];

// 1. Load Profile Data into Header & UI
function loadHeaderProfile() {
    if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${pharmacyProfile.name}!`;
    if (dropdownPharmName) dropdownPharmName.textContent = pharmacyProfile.name;
    if (dropdownPharmEmail) dropdownPharmEmail.textContent = pharmacyProfile.email;
    if (headerProfileImg && pharmacyProfile.image) {
        headerProfileImg.src = pharmacyProfile.image;
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

// 3. Handle Medicine Image Upload
if (medicineImageInput) {
    medicineImageInput.onchange = function(e) {
        let file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                currentBase64Image = e.target.result;
                if (medicineImagePreview) {
                    medicineImagePreview.src = currentBase64Image;
                    medicineImagePreviewContainer.style.display = 'block';
                }
            }
            reader.readAsDataURL(file);
        }
    };
}

// Helper to generate consistent color based on string
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
}

// Add / Update Medicine
btnAdd.onclick = function () {
  if (medicineName.value.trim() === '') {
    mlAlert('Please enter a medicine name', 'error');
    return;
  }

  let newMedicine = {
    medicineName: medicineName.value.toLowerCase(),
    medicineStrength: medicineStrength.value,
    medicineCategory: medicineCategory.value,
    medicinePrice: medicinePrice.value || "0",
    medicineAmount: parseInt(medicineAmount.value) || 0,
    medicineImage: currentBase64Image,
    medicinePrescription: medicinePrescription.value,
    medicineDescription: medicineDescription.value
  }

  if (mood === 'Add') {
    dataMedicine.push(newMedicine);
  } else {
    dataMedicine[tmpIndex] = newMedicine;
    mood = "Add";
    btnAdd.innerHTML = `<i class="fa-solid fa-plus"></i> Add to Inventory`;
  }

  localStorage.setItem('medicine', JSON.stringify(dataMedicine));
  
  mlAlert(`Medicine ${mood === 'Add' ? 'added' : 'updated'} successfully!`, 'success');

  clearInputs();
  updateStats();
  display();
}

function clearInputs() {
  medicineName.value = '';
  medicineStrength.value = '';
  medicineCategory.value = '';
  medicinePrice.value = '';
  medicineAmount.value = '';
  medicineImageInput.value = '';
  currentBase64Image = "";
  medicineImagePreviewContainer.style.display = 'none';
  medicinePrescription.value = 'OTC';
  medicineDescription.value = '';
}

function updateStats() {
    if (totalMedicinesCount) totalMedicinesCount.textContent = dataMedicine.length;
  
  let lowCount = 0;
  for (let i = 0; i < dataMedicine.length; i++) {
    if (dataMedicine[i].medicineAmount < 5) {
      lowCount++;
    }
  }
  if (lowStockCountEl) lowStockCountEl.textContent = lowCount;
  
  // Real count of Pending orders
  let pendingOrders = medlinkOrders.filter(o => o.status === 'Pending').length;
  if (orderCountEl) orderCountEl.textContent = pendingOrders;
}

// Display data table
function display() {
  renderTable(dataMedicine);
  
  let btnDeleteContainer = document.getElementById('deleteAll');
  if (dataMedicine.length > 0) {
    btnDeleteContainer.innerHTML = `
      <button onclick="deleteAll()" class="delete-all-btn">
        <i class="fa-regular fa-trash-can"></i> Delete All (${dataMedicine.length})
      </button>`;
  } else {
    btnDeleteContainer.innerHTML = '';
  }
}

function renderTable(items) {
  let tableRows = "";
  for (let i = 0; i < items.length; i++) {
    const isLowStock = items[i].medicineAmount < 5;
    const amountDisplay = isLowStock 
      ? `<span class="low-stock-badge"><i class="fas fa-exclamation-triangle"></i> ${items[i].medicineAmount} (Low)</span>` 
      : items[i].medicineAmount;

    // Avatar Logic
    const initials = items[i].medicineName.charAt(0).toUpperCase();
    const bgColor = stringToColor(items[i].medicineName);
    const avatarContent = items[i].medicineImage 
        ? `<img src="${items[i].medicineImage}" alt="${items[i].medicineName}" onerror="this.parentElement.innerHTML='${initials}'">` 
        : initials;

    tableRows += `
    <tr>
      <td>
        <div class="med-row-flex">
          <div class="med-avatar" style="background-color: ${bgColor}">
            ${avatarContent}
          </div>
          <div class="med-info">
            <strong style="text-transform: capitalize; font-size: 1.05rem;">${items[i].medicineName}</strong>
            <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">${items[i].medicineStrength || ''} • ${items[i].medicineCategory || 'General'}</span>
          </div>
        </div>
      </td>
      <td>$${items[i].medicinePrice}</td>
      <td class="${isLowStock ? 'low-stock' : ''}">${amountDisplay}</td>
      <td>
         <button onclick="editData(${i})" class="btn-icon edit" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
      </td>
      <td> 
        <button onclick="deleteData(${i})" class="btn-icon delete" title="Delete">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </td>
    </tr>
    `;
  }
  document.getElementById('tbody').innerHTML = tableRows;
}

// Delete logic
function deleteData(i) {
  mlConfirm(
    'Delete Medicine', 
    `Are you sure you want to remove "${dataMedicine[i].medicineName}" from your inventory?`,
    'Delete Now',
    () => {
        dataMedicine.splice(i, 1);
        localStorage.setItem('medicine', JSON.stringify(dataMedicine));
        updateStats();
        display();
        mlAlert('Medicine deleted successfully', 'info');
    }
  );
}

function deleteAll() {
  mlConfirm(
    'Clear All Inventory',
    'This will permanently delete all medicines from your inventory. This action cannot be undone.',
    'Clear All',
    () => {
        localStorage.removeItem('medicine');
        dataMedicine = [];
        updateStats();
        display();
        mlAlert('All inventory has been cleared', 'info');
    }
  );
}

// Update logic
function editData(i) {
  medicineName.value = dataMedicine[i].medicineName;
  medicineStrength.value = dataMedicine[i].medicineStrength || '';
  medicineCategory.value = dataMedicine[i].medicineCategory || '';
  medicinePrice.value = dataMedicine[i].medicinePrice;
  medicineAmount.value = dataMedicine[i].medicineAmount;
  currentBase64Image = dataMedicine[i].medicineImage || "";
  
  if (currentBase64Image) {
      medicineImagePreview.src = currentBase64Image;
      medicineImagePreviewContainer.style.display = 'block';
  } else {
      medicineImagePreviewContainer.style.display = 'none';
  }

  medicinePrescription.value = dataMedicine[i].medicinePrescription || 'OTC';
  medicineDescription.value = dataMedicine[i].medicineDescription || '';
  
  btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> Update Medicine';
  mood = 'update';
  tmpIndex = i;
  
  window.scrollTo({
    top: document.querySelector('.action-section').offsetTop - 100,
    behavior: "smooth"
  });
}

// Search functionality
function search(value) {
  let filtered = dataMedicine.filter(item => 
    item.medicineName.includes(value.toLowerCase()) || 
    (item.medicineCategory && item.medicineCategory.toLowerCase().includes(value.toLowerCase()))
  );
  renderTable(filtered);
}

// Global scope functions
window.editData = editData;
window.deleteData = deleteData;
window.deleteAll = deleteAll;
window.search = search;

// Initial calls
loadHeaderProfile();
updateStats();
display();
