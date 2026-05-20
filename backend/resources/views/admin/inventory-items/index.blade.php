@extends('admin.layout', ['title' => 'Inventory Items - MedLink Admin'])

@section('content')
    <div class="card">
        <div class="top-actions">
            <div>
                <h2 style="margin:0 0 6px 0;">Inventory Items</h2>
                <div class="muted">CRUD UI talking to /api/v1/inventory-items</div>
            </div>
            <div class="inline">
                <a href="/admin/inventory-items/create" style="text-decoration:none"><button>Create Inventory
                        Item</button></a>
            </div>
        </div>

        <div class="row">
            <div>
                <label>Pharmacy ID</label>
                <input id="pharmacy_id" type="number" placeholder="optional">
            </div>
            <div>
                <label>Medicine ID</label>
                <input id="medicine_id" type="number" placeholder="optional">
            </div>
        </div>

        <div style="margin-top:12px" class="actions">
            <button onclick="loadItems()">Search</button>
            <button class="secondary" onclick="resetFilters()">Reset</button>
        </div>

        <div id="error" class="error"></div>
        <div id="success" class="success"></div>

        <div style="margin-top:16px; overflow:auto;">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Pharmacy</th>
                        <th>Medicine</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="rows"></tbody>
            </table>
        </div>
    </div>

    <script>
        const apiBase = '/api/v1';

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

        async function loadItems() {
            clearMessages();
            try {
                const pharmacy_id = document.getElementById('pharmacy_id').value;
                const medicine_id = document.getElementById('medicine_id').value;

                const params = new URLSearchParams();
                if (pharmacy_id) params.append('pharmacy_id', pharmacy_id);
                if (medicine_id) params.append('medicine_id', medicine_id);

                const res = await fetch(apiBase + '/inventory-items?' + params.toString());
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed');

                const rows = document.getElementById('rows');
                rows.innerHTML = '';

                (data.items || []).forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.id ?? ''}</td>
                    <td>${escapeHtml(item.pharmacy?.pharmacy_name ?? '')}</td>
                    <td>${escapeHtml(item.medicine?.name ?? '')}</td>
                    <td>${item.quantity ?? ''}</td>
                    <td>${item.price ?? ''}</td>
                    <td>${escapeHtml(item.status ?? '')}</td>
                    <td>
                        <div class="actions">
                            <a href="/admin/inventory-items/${item.id}/edit" style="text-decoration:none"><button class="secondary" type="button">Edit</button></a>
                            <button type="button" class="danger" onclick="deleteItem(${item.id})">Delete</button>
                        </div>
                    </td>
                `;
                    rows.appendChild(tr);
                });
            } catch (e) {
                showError(e.message || String(e));
            }
        }

        async function deleteItem(id) {
            if (!confirm('Delete inventory item #' + id + '?')) return;
            clearMessages();
            try {
                const res = await fetch(apiBase + '/inventory-items/' + id, {
                    method: 'DELETE'
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.message || 'Delete failed');
                showSuccess(data?.message || 'Deleted successfully');
                await loadItems();
            } catch (e) {
                showError(e.message || String(e));
            }
        }

        function resetFilters() {
            document.getElementById('pharmacy_id').value = '';
            document.getElementById('medicine_id').value = '';
            loadItems();
        }

        function escapeHtml(s) {
            return String(s).replace(/[&<>"]/g, (c) => ({
                '&': '&amp;',
                '<': '<',
                '>': '>',
                '\"': '"'
            } [c]));
        }

        loadItems();
    </script>
@endsection
