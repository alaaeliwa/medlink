/**
 * MedLink Orders Engine
 * Handles order submission and status management using LocalStorage.
 */

const OrdersEngine = {
    STORAGE_KEY: 'medlink_orders',
    COMPLAINTS_KEY: 'medlink_complaints',

    // --- Core Data Operations ---
    
    /**
     * Get all orders from localStorage
     */
    getOrders: function() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    /**
     * Submit a new order (can be specific to a pharmacy or a general network broadcast)
     */
    submitOrder: function(pharmacyName, medicineName, price = 0, quantity = 1, urgency = 'standard', notes = '') {
        const orders = this.getOrders();
        const userName = localStorage.getItem('medlink_userName') || 'Ahmed Ali';
        
        const newOrder = {
            id: 'ORD-' + Date.now(),
            citizenName: userName,
            pharmacyName: pharmacyName,
            medicineName: medicineName,
            price: price,
            quantity: quantity,
            urgency: urgency,
            notes: notes,
            status: 'Pending',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        orders.unshift(newOrder); // Add to beginning
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
        
        console.log('Order submitted:', newOrder);
        return newOrder;
    },

    /**
     * --- Complaints Logic ---
     */
    
    getComplaints: function() {
        const stored = localStorage.getItem(this.COMPLAINTS_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    submitComplaint: function(pharmacyName, subject, details) {
        const complaints = this.getComplaints();
        const userName = localStorage.getItem('medlink_userName') || 'Ahmed Ali';
        
        const newComplaint = {
            id: 'CP-' + Date.now(),
            reporter: userName,
            against: pharmacyName,
            subject: subject,
            details: details,
            status: 'open',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        complaints.unshift(newComplaint);
        localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify(complaints));
        return newComplaint;
    },

    resolveComplaint: function(complaintId) {
        const complaints = this.getComplaints();
        const index = complaints.findIndex(c => c.id === complaintId);
        if (index !== -1) {
            complaints[index].status = 'resolved';
            localStorage.setItem(this.COMPLAINTS_KEY, JSON.stringify(complaints));
            return true;
        }
        return false;
    },

    /**
     * Update order status
     */
    updateStatus: function(orderId, newStatus, adminResponse = null) {
        const orders = this.getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            if (adminResponse) {
                orders[orderIndex].adminResponse = adminResponse;
                orders[orderIndex].responseDate = new Date().toLocaleDateString();
            }
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
            return true;
        }
        return false;
    },

    /**
     * Delete an order
     */
    deleteOrder: function(orderId) {
        let orders = this.getOrders();
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    },

    // --- UI Integration Helpers ---

    /**
     * Status styling helper
     */
    getStatusClass: function(status) {
        switch(status.toLowerCase()) {
            case 'approved': return 'status-approved';
            case 'rejected': return 'status-rejected';
            case 'pending': return 'status-pending';
            default: return '';
        }
    }
};

// Make it globally accessible
window.OrdersEngine = OrdersEngine;
