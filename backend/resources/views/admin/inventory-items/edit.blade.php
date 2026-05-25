@extends('admin.layout', ['title' => 'Edit Inventory Item - MedLink Admin'])

@section('content')
    <div class="card">
        <h2 style="margin-top:0;">Edit Inventory Item</h2>
        <div class="muted">Form sends PUT /api/v1/inventory-items/{id}</div>

        <div id="error" class="error"></div>
        <div id="success" class="success"></div>

        <div class="row" style="margin-top:14px">
            <div>
                <label>Pharmacy ID</label>
                <input id="pharmacy_id" type="number" required>
            </div>
            <div>
                <label>Medicine ID</label>
                <input id="medicine_id" type="number" required>
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Quantity</label>
                <input id="quantity" type="number">
            </div>
            <div>
                <label>Price</label>
                <input id="price" type="number" step="0.01">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Cost Price</label>
                <input id="cost_price" type="number" step="0.01">
            </div>
            <div>
                <label>Minimum Stock</label>
                <input id="minimum_stock" type="number">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Maximum Stock</label>
                <input id="maximum_stock" type="number">
            </div>
            <div>
                <label>Status</label>
                <input id="status" type="text">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Expiry Date</label>
                <input id="expiry_date" type="date">
            </div>
        </div>

        <div style="margin-top:14px" class="actions">
            <button onclick="submitUpdate()">Update</button>
            <a href="/admin/inventory-items" style="text-decoration:none"><button class="secondary"
                    type="button">Back</button></a>
        </div>
    </div>

    <script>
        const apiBase = '/api/v1';
        const itemId = {{ $id }};

        function showError(msg) {
            const el = document.getElementById('error');
            el.textContent = msg;
            el.style.display = 'block';
        }

        function showSuccess(msg) {
            const el = document.getElementById('success');
            el.textContent = msg;
            el.style.display = 'block';
        }

        function clearMessages() {
            document.getElementById('error').style.display = 'none';
            document.getElementById('success').style.display = 'none';
        }

        async function loadOne() {
            clearMessages();
            try {
                const res = await fetch(apiBase + '/inventory-items/' + itemId);
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Load failed');
                const item = data.data || data;

                document.getElementById('pharmacy_id').value = item.pharmacy_id ?? '';
                document.getElementById('medicine_id').value = item.medicine_id ?? '';
                document.getElementById('quantity').value = item.quantity ?? '';
                document.getElementById('price').value = item.price ?? '';
                document.getElementById('cost_price').value = item.cost_price ?? '';
                document.getElementById('minimum_stock').value = item.minimum_stock ?? '';
                document.getElementById('maximum_stock').value = item.maximum_stock ?? '';
                document.getElementById('status').value = item.status ?? '';
                document.getElementById('expiry_date').value = item.expiry_date ?? '';
            } catch (e) {
                showError(e.message || String(e));
            }
        }

        async function submitUpdate() {
            clearMessages();
            try {
                const payload = {
                    pharmacy_id: parseInt(document.getElementById('pharmacy_id').value, 10),
                    medicine_id: parseInt(document.getElementById('medicine_id').value, 10),
                    quantity: document.getElementById('quantity').value !== '' ? parseInt(document.getElementById(
                        'quantity').value, 10) : null,
                    price: document.getElementById('price').value !== '' ? parseFloat(document.getElementById(
                        'price').value) : null,
                    cost_price: document.getElementById('cost_price').value !== '' ? parseFloat(document
                        .getElementById('cost_price').value) : null,
                    minimum_stock: document.getElementById('minimum_stock').value !== '' ? parseInt(document
                        .getElementById('minimum_stock').value, 10) : null,
                    maximum_stock: document.getElementById('maximum_stock').value !== '' ? parseInt(document
                        .getElementById('maximum_stock').value, 10) : null,
                    status: document.getElementById('status').value || null,
                    expiry_date: document.getElementById('expiry_date').value || null,
                };

                const res = await fetch(apiBase + '/inventory-items/' + itemId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.message || 'Update failed');

                showSuccess(data?.message || 'Updated');
                setTimeout(() => {
                    window.location.href = '/admin/inventory-items';
                }, 500);
            } catch (e) {
                showError(e.message || String(e));
            }
        }

        loadOne();
    </script>
@endsection
