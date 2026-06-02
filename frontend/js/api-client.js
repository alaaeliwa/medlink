/**
 * MedLink API Client
 * Drop this file in your frontend/js/ folder.
 * It replaces all localStorage-based data calls.
 */

const API_BASE = 'http://localhost:8000/api/v1';

// ─── Token Management ────────────────────────────────────────────────────────

const Auth = {
  setSession(data) {
    localStorage.setItem('medlink_token',   data.token);
    localStorage.setItem('medlink_role',    data.role);
    localStorage.setItem('medlink_user_id', data.id);
    localStorage.setItem('medlink_user',    JSON.stringify(data));
    localStorage.setItem('medlink_token_expires', Date.now() + (data.expiresIn * 1000));
  },

  getToken() {
    return localStorage.getItem('medlink_token');
  },

  getRole() {
    return localStorage.getItem('medlink_role');
  },

  getUser() {
    const raw = localStorage.getItem('medlink_user');
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  logout() {
    // Tell the API to invalidate the token
    APIClient.post('/auth/logout').catch(() => {});
    localStorage.removeItem('medlink_token');
    localStorage.removeItem('medlink_role');
    localStorage.removeItem('medlink_user_id');
    localStorage.removeItem('medlink_user');
    localStorage.removeItem('medlink_token_expires');
    window.location.href = '/medlink/frontend/auth/login.html';
  },

  redirectIfNotLoggedIn() {
    if (!this.isLoggedIn()) {
      window.location.href = '/medlink/frontend/auth/login.html';
    }
  },

  redirectToDashboard() {
    const role = this.getRole();
    const dashboards = {
      citizen:  '/citizen/citizen-dashboard.html',
      pharmacy: '/pharmacy/pharmacy-dashboard.html',
      admin:    '/admin/admin-dashboard.html',
    };
    if (dashboards[role]) window.location.href = dashboards[role];
  }
};

// ─── Core API Client ─────────────────────────────────────────────────────────

const APIClient = {

  async request(method, endpoint, body = null, isFormData = false) {
    const token = Auth.getToken();

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const options = { method, headers };
    if (body) {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, options);

      // Handle auth errors globally
      if (res.status === 401) {
        Auth.logout();
        return null;
      }

      const data = await res.json();

      // Show validation errors as toast if MedLinkUI is available
      if (!data.success && data.code === 422 && typeof MedLinkUI !== 'undefined') {
        const messages = Object.values(data.errors || {}).flat();
        MedLinkUI.toast(messages[0] || data.message, 'error');
      }

      return data;

    } catch (err) {
      console.error('API Error:', err);
      if (typeof MedLinkUI !== 'undefined') {
        MedLinkUI.toast('Network error. Check your connection.', 'error');
      }
      return null;
    }
  },

  get(endpoint)          { return this.request('GET',    endpoint); },
  post(endpoint, body)   { return this.request('POST',   endpoint, body); },
  put(endpoint, body)    { return this.request('PUT',    endpoint, body); },
  patch(endpoint, body)  { return this.request('PATCH',  endpoint, body); },
  delete(endpoint)       { return this.request('DELETE', endpoint); },
  upload(endpoint, formData) { return this.request('POST', endpoint, formData, true); },
};

// ─── Auth API ────────────────────────────────────────────────────────────────

const AuthAPI = {
  async login(email, password) {
    const res = await APIClient.post('/auth/login', { email, password });
    if (res?.success) {
      Auth.setSession(res.data);
    }
    return res;
  },

  async register(data) {
    return await APIClient.post('/auth/register', data);
  },

  async getMe() {
    return await APIClient.get('/users/me');
  },

  async updateProfile(data) {
    return await APIClient.put('/users/me', data);
  },

  async changePassword(currentPassword, newPassword) {
    return await APIClient.post('/users/change-password', {
      currentPassword,
      newPassword,
      confirmPassword: newPassword,
    });
  },
};

// ─── Medicines API ────────────────────────────────────────────────────────────

const MedicinesAPI = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await APIClient.get(`/medicines?${query}`);
  },

  async get(id) {
    return await APIClient.get(`/medicines/${id}`);
  },

  async categories() {
    return await APIClient.get('/medicines/categories');
  },
};

// ─── Pharmacies API ───────────────────────────────────────────────────────────

const PharmaciesAPI = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await APIClient.get(`/pharmacies?${query}`);
  },

  async get(id) {
    return await APIClient.get(`/pharmacies/${id}`);
  },

  async areas() {
    return await APIClient.get('/pharmacies/areas');
  },
};

// ─── Inventory API (Pharmacy) ─────────────────────────────────────────────────

const InventoryAPI = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await APIClient.get(`/inventory?${query}`);
  },

  async add(data) {
    return await APIClient.post('/inventory', data);
  },

  async update(id, data) {
    return await APIClient.put(`/inventory/${id}`, data);
  },

  async remove(id) {
    return await APIClient.delete(`/inventory/${id}`);
  },
};

// ─── Orders API ───────────────────────────────────────────────────────────────

const OrdersAPI = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await APIClient.get(`/orders?${query}`);
  },

  async get(id) {
    return await APIClient.get(`/orders/${id}`);
  },

  async place(pharmacyId, medicines, urgency = 'standard', notes = '') {
    return await APIClient.post('/orders', { pharmacyId, medicines, urgency, notes });
  },

  async updateStatus(id, status, response = '') {
    return await APIClient.put(`/orders/${id}/status`, { status, response });
  },

  async cancel(id) {
    return await APIClient.delete(`/orders/${id}`);
  },
};

// ─── Broadcast Requests API ───────────────────────────────────────────────────

const RequestsAPI = {
  async myRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await APIClient.get(`/requests?${query}`);
  },

  async create(medicineName, quantity, urgency = 'standard', notes = '') {
    return await APIClient.post('/requests', { medicineName, quantity, urgency, notes });
  },

  async accept(requestId, pharmacyId) {
    return await APIClient.post(`/requests/${requestId}/accept/${pharmacyId}`);
  },

  async close(requestId) {
    return await APIClient.delete(`/requests/${requestId}`);
  },

  // Pharmacy
  async network(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await APIClient.get(`/requests/network?${query}`);
  },

  async respond(requestId, price, quantity) {
    return await APIClient.post(`/requests/${requestId}/respond`, { price, quantity });
  },
};

// ─── Favorites API ────────────────────────────────────────────────────────────

const FavoritesAPI = {
  async list(type = 'all') {
    let favs = JSON.parse(localStorage.getItem('medlink_favorites')) || [];
    
    // Auto-clean corrupted favorites (ones without a target name)
    const originalLength = favs.length;
    favs = favs.filter(f => f.target && f.target.name);
    if (favs.length !== originalLength) {
        localStorage.setItem('medlink_favorites', JSON.stringify(favs));
    }

    let filtered = favs;
    if (type !== 'all') {
      filtered = favs.filter(f => f.type === type);
    }
    return { success: true, data: { favorites: filtered } };
  },

  async toggle(type, targetId, targetData = {}) {
    let favs = JSON.parse(localStorage.getItem('medlink_favorites')) || [];
    const existingIndex = favs.findIndex(f => f.type === type && String(f.targetId) === String(targetId));
    let isFavorite = false;

    if (existingIndex >= 0) {
      favs.splice(existingIndex, 1);
    } else {
      isFavorite = true;
      let finalData = targetData;
      // If targetData is missing, try to fetch it
      if (!finalData || Object.keys(finalData).length === 0 || !finalData.name) {
          try {
              if (type === 'medicine') {
                  const res = await MedicinesAPI.get(targetId);
                  if (res && res.success) finalData = res.data;
              } else if (type === 'pharmacy') {
                  const res = await PharmaciesAPI.get(targetId);
                  if (res && res.success) finalData = res.data;
              }
          } catch(e) { console.error(e); }
      }

      favs.push({
        id: 'fav_' + Date.now(),
        type: type,
        targetId: targetId,
        target: finalData
      });
    }

    localStorage.setItem('medlink_favorites', JSON.stringify(favs));
    return { success: true, data: { isFavorite } };
  },

  async remove(id) {
    let favs = JSON.parse(localStorage.getItem('medlink_favorites')) || [];
    favs = favs.filter(f => String(f.id) !== String(id));
    localStorage.setItem('medlink_favorites', JSON.stringify(favs));
    return { success: true };
  },
};

// ─── Reviews API ──────────────────────────────────────────────────────────────

const ReviewsAPI = {
  async forPharmacy(pharmacyId, page = 1) {
    return await APIClient.get(`/reviews/pharmacy/${pharmacyId}?page=${page}`);
  },

  async submit(pharmacyId, rating, reviewText = '') {
    return await APIClient.post('/reviews', { pharmacyId, rating, reviewText });
  },
};

// ─── Complaints API ───────────────────────────────────────────────────────────

const ComplaintsAPI = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await APIClient.get(`/complaints?${query}`);
  },

  async submit(againstPharmacyId, subject, details, severity = 'medium') {
    return await APIClient.post('/complaints', { againstPharmacyId, subject, details, severity });
  },
};

// ─── Admin API ────────────────────────────────────────────────────────────────

const AdminAPI = {
  async statistics() {
    return await APIClient.get('/admin/statistics');
  },

  async users(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await APIClient.get(`/admin/users?${query}`);
  },

  async toggleUserActive(id) {
    return await APIClient.patch(`/admin/users/${id}/toggle-active`);
  },

  async pendingPharmacies(status = 'pending') {
    return await APIClient.get(`/admin/pharmacies/verification?status=${status}`);
  },

  async verifyPharmacy(id, status, notes = '') {
    return await APIClient.put(`/admin/pharmacies/${id}/verify`, { status, notes });
  },

  async complaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await APIClient.get(`/admin/complaints?${query}`);
  },

  async resolveComplaint(id, status, resolution = '') {
    return await APIClient.put(`/admin/complaints/${id}`, { status, resolution });
  },

  async reports(type, startDate, endDate) {
    return await APIClient.get(`/admin/reports?type=${type}&startDate=${startDate}&endDate=${endDate}`);
  },
};
