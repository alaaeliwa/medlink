/**
 * Pharmacy Dashboard — API Connected
 * All localStorage reads/writes replaced with real API calls.
 * All UI logic, table rendering, search, modals kept exactly as-is.
 */

// ─── DOM Element References ───────────────────────────────────────────────────
// Kept exactly as-is
let medicineName        = document.getElementById('medicineName');
let medicineStrength    = document.getElementById('medicineStrength');
let medicineCategory    = document.getElementById('medicineCategory');
let medicinePrice       = document.getElementById('medicinePrice');
let medicineAmount      = document.getElementById('medicineAmount');
let medicineImageInput  = document.getElementById('medicineImageInput');
let medicineImagePreview            = document.getElementById('medicineImagePreview');
let medicineImagePreviewContainer   = document.getElementById('medicineImagePreviewContainer');
let medicinePrescription= document.getElementById('medicinePrescription');
let medicineDescription = document.getElementById('medicineDescription');
let btnAdd              = document.getElementById('btnAdd');

let profileToggle       = document.getElementById('profileToggle');
let dropdownMenu        = document.getElementById('dropdownMenu');
let headerProfileImg    = document.getElementById('headerProfileImg');
let dropdownPharmName   = document.getElementById('dropdownPharmName');
let dropdownPharmEmail  = document.getElementById('dropdownPharmEmail');

let totalMedicinesCount = document.getElementById('totalMedicines');
let lowStockCountEl     = document.getElementById('runOut');
let orderCountEl        = document.getElementById('order');
let medicineNameSearch  = document.getElementById('medicineNameSearch');
let welcomeTitle        = document.querySelector('.welcome-text h1');

// ─── State ────────────────────────────────────────────────────────────────────
let mood             = 'Add';
let tmpInventoryId   = null;   // CHANGED: was tmpIndex (array index), now stores real DB id
let currentBase64Image = "";
let dataMedicine     = [];     // CHANGED: populated from API, not localStorage
let medlinkOrders    = [];     // CHANGED: populated from API, not localStorage

// ─── Auth Guard ───────────────────────────────────────────────────────────────
if (!Auth.isLoggedIn()) {
  window.location.href = '../auth/login.html';
}

// ─── Init: Load Everything from API ──────────────────────────────────────────
async function init() {
  await loadProfile();
  await loadInventory();
  await loadOrders();
  updateStats();
  display();
}

// ─── Load Profile from API ────────────────────────────────────────────────────
// REPLACED: reading pharmacyProfile from localStorage
// NOW: fetches real pharmacy profile from /users/me
async function loadProfile() {
  const res  = await AuthAPI.getMe();
  const user = res?.data || Auth.getUser();

  if (!user) return;

  const name  = user.name || user.firstName || 'Pharmacy';
  const email = user.email || '';
  const image = user.profileImage || null;

  if (welcomeTitle)      welcomeTitle.textContent     = `Welcome back, ${name}!`;
  if (dropdownPharmName) dropdownPharmName.textContent = name;
  if (dropdownPharmEmail)dropdownPharmEmail.textContent= email;
  if (headerProfileImg && image) headerProfileImg.src  = image;
}

// ─── Load Inventory from API ──────────────────────────────────────────────────
// REPLACED: JSON.parse(localStorage.getItem('medicine'))
// NOW: fetches real inventory from /inventory
async function loadInventory() {
  const res = await InventoryAPI.list({ per_page: 100 });
  if (res?.success) {
    // Map API response to the shape the existing render functions expect
    dataMedicine = res.data.medicines.map(item => ({
      _id:                 item.id,           // real DB id for updates/deletes
      medicineName:        item.medicineName,
      medicineStrength:    item.strength || '',
      medicineCategory:    item.category || '',
      medicinePrice:       item.price,
      medicineAmount:      item.quantity,
      medicineImage:       '',               // API doesn't store base64 images
      medicinePrescription:'OTC',
      medicineDescription: '',
      status:              item.status,
    }));
  }
}

// ─── Load Orders from API ─────────────────────────────────────────────────────
// REPLACED: JSON.parse(localStorage.getItem('medlink_orders'))
// NOW: fetches real orders from /orders
async function loadOrders() {
  const res = await OrdersAPI.list({ per_page: 100 });
  if (res?.success) {
    medlinkOrders = res.data.orders;
  }
}

// ─── Load Profile into Header ─────────────────────────────────────────────────
// Kept for compatibility — now called inside loadProfile()
function loadHeaderProfile() {
  // handled in loadProfile() above
}

// ─── Dropdown Toggle ──────────────────────────────────────────────────────────
// Kept exactly as-is
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

// ─── Medicine Image Upload ────────────────────────────────────────────────────
// Kept exactly as-is (base64 preview still works locally)
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
      };
      reader.readAsDataURL(file);
    }
  };
}

// ─── Helper: String to Color ──────────────────────────────────────────────────
// Kept exactly as-is
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

// ─── Add / Update Medicine ────────────────────────────────────────────────────
// REPLACED: localStorage.setItem('medicine', ...) with API calls
if (btnAdd) {
  btnAdd.onclick = async function() {
    if (!medicineName?.value.trim()) {
      mlAlert('Please enter a medicine name', 'error');
      return;
    }

    // Show loading state
    const originalText  = btnAdd.innerHTML;
    btnAdd.innerHTML    = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btnAdd.disabled     = true;

    if (mood === 'Add') {
      // ── Create new inventory item ──
      // First we need to find or create the medicine in the medicines table.
      // For now we send name + details. The backend matches by medicine name.
      const payload = {
        medicineName:    medicineName.value.trim(),
        quantity:        parseInt(medicineAmount?.value) || 0,
        price:           parseFloat(medicinePrice?.value) || 0,
        minimumStock:    5,
        maximumStock:    1000,
        expiryDate:      null,
      };

      // Try to find medicine by name first
      const searchRes = await MedicinesAPI.list({ search: medicineName.value.trim(), per_page: 1 });
      const found     = searchRes?.data?.medicines?.[0];

      if (found) {
        payload.medicineId = found.id;
        delete payload.medicineName;
        const res = await InventoryAPI.add(payload);

        if (res?.success) {
          mlAlert('Medicine added to inventory!', 'success');
        } else {
          mlAlert(res?.message || 'Failed to add medicine.', 'error');
          btnAdd.innerHTML = originalText;
          btnAdd.disabled  = false;
          return;
        }
      } else {
        mlAlert('Medicine not found in the database. Please ask your admin to add it first.', 'error');
        btnAdd.innerHTML = originalText;
        btnAdd.disabled  = false;
        return;
      }

    } else {
      // ── Update existing inventory item ──
      const payload = {
        quantity:     parseInt(medicineAmount?.value) || 0,
        price:        parseFloat(medicinePrice?.value) || 0,
      };

      const res = await InventoryAPI.update(tmpInventoryId, payload);

      if (res?.success) {
        mlAlert('Medicine updated successfully!', 'success');
      } else {
        mlAlert(res?.message || 'Failed to update medicine.', 'error');
        btnAdd.innerHTML = originalText;
        btnAdd.disabled  = false;
        return;
      }

      mood = 'Add';
      btnAdd.innerHTML = `<i class="fa-solid fa-plus"></i> Add to Inventory`;
      tmpInventoryId   = null;
    }

    // Reload inventory from API to get fresh data
    await loadInventory();
    clearInputs();
    updateStats();
    display();

    btnAdd.innerHTML = originalText;
    btnAdd.disabled  = false;
  };
}

// ─── Clear Inputs ─────────────────────────────────────────────────────────────
// Kept exactly as-is
function clearInputs() {
  if (medicineName)        medicineName.value        = '';
  if (medicineStrength)    medicineStrength.value    = '';
  if (medicineCategory)    medicineCategory.value    = '';
  if (medicinePrice)       medicinePrice.value       = '';
  if (medicineAmount)      medicineAmount.value      = '';
  if (medicineImageInput)  medicineImageInput.value  = '';
  currentBase64Image = '';
  if (medicineImagePreviewContainer) medicineImagePreviewContainer.style.display = 'none';
  if (medicinePrescription) medicinePrescription.value = 'OTC';
  if (medicineDescription)  medicineDescription.value  = '';
}

// ─── Update Stats ─────────────────────────────────────────────────────────────
// UPDATED: reads from API-populated arrays instead of localStorage
function updateStats() {
  if (totalMedicinesCount) totalMedicinesCount.textContent = dataMedicine.length;

  const lowCount = dataMedicine.filter(item => item.medicineAmount < 5).length;
  if (lowStockCountEl) lowStockCountEl.textContent = lowCount;

  const pendingOrders = medlinkOrders.filter(o =>
    o.status === 'pending' || o.status === 'Pending'
  ).length;
  if (orderCountEl) orderCountEl.textContent = pendingOrders;
}

// ─── Display Table ────────────────────────────────────────────────────────────
// Kept exactly as-is — just reads from dataMedicine which is now API-populated
function display() {
  renderTable(dataMedicine);

  const btnDeleteContainer = document.getElementById('deleteAll');
  if (!btnDeleteContainer) return;

  if (dataMedicine.length > 0) {
    btnDeleteContainer.innerHTML = `
      <button onclick="deleteAll()" class="delete-all-btn">
        <i class="fa-regular fa-trash-can"></i> Delete All (${dataMedicine.length})
      </button>`;
  } else {
    btnDeleteContainer.innerHTML = '';
  }
}

// ─── Render Table ─────────────────────────────────────────────────────────────
// Kept exactly as-is — visual output unchanged
function renderTable(items) {
  const tbody = document.getElementById('tbody');
  if (!tbody) return;

  let tableRows = '';
  for (let i = 0; i < items.length; i++) {
    const isLowStock    = items[i].medicineAmount < 5;
    const amountDisplay = isLowStock
      ? `<span class="low-stock-badge"><i class="fas fa-exclamation-triangle"></i> ${items[i].medicineAmount} (Low)</span>`
      : items[i].medicineAmount;

    const initials      = (items[i].medicineName || '?').charAt(0).toUpperCase();
    const bgColor       = stringToColor(items[i].medicineName || '');
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
              <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">
                ${items[i].medicineStrength || ''} • ${items[i].medicineCategory || 'General'}
              </span>
            </div>
          </div>
        </td>
        <td>$${parseFloat(items[i].medicinePrice).toFixed(2)}</td>
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
  tbody.innerHTML = tableRows;
}

// ─── Delete ───────────────────────────────────────────────────────────────────
// REPLACED: localStorage splice with real API delete
async function deleteData(i) {
  mlConfirm(
    'Delete Medicine',
    `Are you sure you want to remove "${dataMedicine[i].medicineName}" from your inventory?`,
    'Delete Now',
    async () => {
      const id  = dataMedicine[i]._id;
      const res = await InventoryAPI.remove(id);

      if (res?.success) {
        await loadInventory();
        updateStats();
        display();
        mlAlert('Medicine removed from inventory', 'info');
      } else {
        mlAlert(res?.message || 'Failed to delete medicine.', 'error');
      }
    }
  );
}

// REPLACED: wipe localStorage with API deletes
async function deleteAll() {
  mlConfirm(
    'Clear All Inventory',
    'This will permanently remove all medicines from your inventory. This action cannot be undone.',
    'Clear All',
    async () => {
      // Delete all items via API
      const deletePromises = dataMedicine.map(item => InventoryAPI.remove(item._id));
      await Promise.all(deletePromises);

      await loadInventory();
      updateStats();
      display();
      mlAlert('All inventory has been cleared', 'info');
    }
  );
}

// ─── Edit ─────────────────────────────────────────────────────────────────────
// UPDATED: stores real DB id instead of array index
function editData(i) {
  const item = dataMedicine[i];

  if (medicineName)        medicineName.value        = item.medicineName;
  if (medicineStrength)    medicineStrength.value    = item.medicineStrength || '';
  if (medicineCategory)    medicineCategory.value    = item.medicineCategory || '';
  if (medicinePrice)       medicinePrice.value       = item.medicinePrice;
  if (medicineAmount)      medicineAmount.value      = item.medicineAmount;
  currentBase64Image = item.medicineImage || '';

  if (currentBase64Image) {
    if (medicineImagePreview) medicineImagePreview.src = currentBase64Image;
    if (medicineImagePreviewContainer) medicineImagePreviewContainer.style.display = 'block';
  } else {
    if (medicineImagePreviewContainer) medicineImagePreviewContainer.style.display = 'none';
  }

  if (medicinePrescription) medicinePrescription.value = item.medicinePrescription || 'OTC';
  if (medicineDescription)  medicineDescription.value  = item.medicineDescription || '';

  if (btnAdd) btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> Update Medicine';
  mood           = 'update';
  tmpInventoryId = item._id; // CHANGED: store real API id, not array index

  const actionSection = document.querySelector('.action-section');
  if (actionSection) {
    window.scrollTo({ top: actionSection.offsetTop - 100, behavior: 'smooth' });
  }
}

// ─── Search ───────────────────────────────────────────────────────────────────
// UPDATED: searches API-populated dataMedicine array (same logic, no localStorage)
function search(value) {
  const filtered = dataMedicine.filter(item =>
    item.medicineName.toLowerCase().includes(value.toLowerCase()) ||
    (item.medicineCategory && item.medicineCategory.toLowerCase().includes(value.toLowerCase()))
  );
  renderTable(filtered);
}

// ─── Global Scope ─────────────────────────────────────────────────────────────
// Kept exactly as-is — needed for inline onclick handlers in renderTable()
window.editData   = editData;
window.deleteData = deleteData;
window.deleteAll  = deleteAll;
window.search     = search;

// ─── Boot ─────────────────────────────────────────────────────────────────────
// REPLACED: loadHeaderProfile() + updateStats() + display() with async init()
init();
