/**
 * MedLink Orders Engine — API Connected
 * All localStorage reads/writes replaced with real API calls.
 * Interface (method names, return shapes) kept identical so all
 * existing callers (citizen-dashboard, pharmacy-orders, admin) work unchanged.
 */

const OrdersEngine = {

    // ─── Orders ───────────────────────────────────────────────────────────────

    /**
     * Get all orders for the current user.
     * REPLACED: localStorage.getItem('medlink_orders')
     * NOW: GET /orders
     */
    getOrders: async function(params = {}) {
        const res = await OrdersAPI.list({ per_page: 100, ...params });
        return res?.data?.orders || [];
    },

    /**
     * Submit a new order to a specific pharmacy.
     * REPLACED: pushing to localStorage array
     * NOW: POST /orders  (specific pharmacy)
     *   or POST /requests (broadcast to network)
     */
    submitOrder: async function(pharmacyId, medicineName, price = 0, quantity = 1, urgency = 'standard', notes = '') {
        // If it's a broadcast request (no real pharmacyId)
        if (!pharmacyId || pharmacyId === 'General Network' || pharmacyId === 'Local Pharmacy') {
            const res = await RequestsAPI.create(medicineName, quantity, urgency, notes);
            return res?.data || null;
        }

        // Otherwise look up the medicine and place a direct order
        const searchRes  = await MedicinesAPI.list({ search: medicineName, per_page: 1 });
        const medicine   = searchRes?.data?.medicines?.[0];

        if (!medicine) {
            console.warn('OrdersEngine.submitOrder: medicine not found in catalog —', medicineName);
            // Fall back to broadcast
            const res = await RequestsAPI.create(medicineName, quantity, urgency, notes);
            return res?.data || null;
        }

        const res = await OrdersAPI.place(
            pharmacyId,
            [{ medicineId: medicine.id, quantity }],
            urgency,
            notes
        );
        return res?.data || null;
    },

    /**
     * Update order status (pharmacy action).
     * REPLACED: orders[index].status = newStatus + localStorage.setItem
     * NOW: PUT /orders/:id/status
     */
    updateStatus: async function(orderId, newStatus, adminResponse = null) {
        // Map old status strings to API-expected values
        const statusMap = {
            'Approved':  'approved',
            'Rejected':  'rejected',
            'Ready':     'ready',
            'Delivered': 'delivered',
            'Cancelled': 'cancelled',
            'Preparing': 'preparing',
            'Responded': 'approved', // admin "responded" treated as approved
        };

        const apiStatus = statusMap[newStatus] || newStatus.toLowerCase();
        const res       = await OrdersAPI.updateStatus(orderId, apiStatus, adminResponse || '');
        return res?.success || false;
    },

    /**
     * Cancel/delete an order.
     * REPLACED: filter + localStorage.setItem
     * NOW: DELETE /orders/:id
     */
    deleteOrder: async function(orderId) {
        const res = await OrdersAPI.cancel(orderId);
        return res?.success || false;
    },

    // ─── Complaints ───────────────────────────────────────────────────────────

    /**
     * Get all complaints for the current user.
     * REPLACED: localStorage.getItem('medlink_complaints')
     * NOW: GET /complaints
     */
    getComplaints: async function() {
        const res = await ComplaintsAPI.list({ per_page: 100 });
        return res?.data?.complaints || [];
    },

    /**
     * Submit a complaint against a pharmacy.
     * REPLACED: pushing to localStorage complaints array
     * NOW: POST /complaints
     */
    submitComplaint: async function(pharmacyId, subject, details, severity = 'medium') {
        const res = await ComplaintsAPI.submit(pharmacyId, subject, details, severity);
        return res?.data || null;
    },

    /**
     * Resolve a complaint (admin action).
     * REPLACED: complaints[index].status = 'resolved' + localStorage
     * NOW: PUT /admin/complaints/:id
     */
    resolveComplaint: async function(complaintId) {
        const res = await AdminAPI.resolveComplaint(complaintId, 'resolved', 'Resolved by admin.');
        return res?.success || false;
    },

    // ─── Broadcast Requests ───────────────────────────────────────────────────

    /**
     * Get open broadcast requests (pharmacy network view).
     * NOW: GET /requests/network
     */
    getNetworkRequests: async function() {
        const res = await RequestsAPI.network({ per_page: 50 });
        return res?.data?.requests || [];
    },

    /**
     * Get citizen's own broadcast requests.
     * NOW: GET /requests
     */
    getMyRequests: async function() {
        const res = await RequestsAPI.myRequests({ per_page: 50 });
        return res?.data?.requests || [];
    },

    // ─── UI Helper (kept exactly as-is) ──────────────────────────────────────

    getStatusClass: function(status) {
        switch ((status || '').toLowerCase()) {
            case 'approved':  return 'status-approved';
            case 'rejected':  return 'status-rejected';
            case 'pending':   return 'status-pending';
            case 'ready':     return 'status-ready';
            case 'delivered': return 'status-delivered';
            case 'cancelled': return 'status-cancelled';
            default:          return '';
        }
    },
};

// Make globally accessible — same as before
window.OrdersEngine = OrdersEngine;
