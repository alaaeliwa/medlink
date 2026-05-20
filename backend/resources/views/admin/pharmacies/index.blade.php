@extends('admin.layout', ['title' => 'Pharmacies - MedLink Admin'])

@section('content')
    <div class="card">
        <div class="top-actions">
            <div>
                <h2 style="margin:0 0 6px 0;">Pharmacies</h2>
                <div class="muted">CRUD UI (front-end) talking to /api/v1/pharmacies</div>
            </div>
            <div class="inline">
                <a href="/admin/pharmacies/create" style="text-decoration:none"><button>Create Pharmacy</button></a>
            </div>
        </div>

        <div class="row">
            <div>
                <label>Area</label>
                <input id="area" type="text" placeholder="optional">
            </div>
            <div>
                <label>Status</label>
                <input id="status" type="text" placeholder="optional">
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
                        <th>License</th>
                        <th>Area</th>
                        <th>Delivery Fee</th>
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
                const area = document.getElementById('area').value;
                const status = document.getElementById('status').value;

                const params = new URLSearchParams();
                if (area) params.append('area', area);
                if (status) params.append('status', status);

                const res = await fetch(apiBase + '/pharmacies?' + params.toString());
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed');

                const rows = document.getElementById('rows');
                rows.innerHTML = '';

                (data.items || []).forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.id ?? ''}</td>
                    <td>${escapeHtml(item.pharmacy_name ?? '')}</td>
                    <td>${escapeHtml(item.license_number ?? '')}</td>
                    <td>${escapeHtml(item.area ?? '')}</td>
                    <td>${item.delivery_fee ?? ''}</td>
                    <td>${escapeHtml(item.status ?? '')}</td>
                    <td>
                        <div class="actions">
                            <a href="/admin/pharmacies/${item.id}/edit" style="text-decoration:none"><button class="secondary" type="button">Edit</button></a>
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
            if (!confirm('Delete pharmacy #' + id + '?')) return;
            clearMessages();
            try {
                const res = await fetch(apiBase + '/pharmacies/' + id, {
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
            document.getElementById('area').value = '';
            document.getElementById('status').value = '';
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
