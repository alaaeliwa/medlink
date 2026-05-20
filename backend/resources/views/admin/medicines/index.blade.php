@extends('admin.layout', ['title' => 'Medicines - MedLink Admin'])

@section('content')
    <div class="card">
        <div class="top-actions">
            <div>
                <h2 style="margin:0 0 6px 0;">Medicines</h2>
                <div class="muted">CRUD UI (front-end) talking to /api/v1/medicines</div>
            </div>
            <div class="inline">
                <a href="/admin/medicines/create" style="text-decoration:none"><button>Create Medicine</button></a>
            </div>
        </div>

        <div class="row">
            <div>
                <label>Search (q)</label>
                <input id="q" type="text" placeholder="e.g. panadol">
            </div>
            <div>
                <label>Category ID</label>
                <input id="category_id" type="number" placeholder="optional">
            </div>
            <div>
                <label>is_active</label>
                <select id="is_active">
                    <option value="">Any</option>
                    <option value="1">true</option>
                    <option value="0">false</option>
                </select>
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
                        <th>Name</th>
                        <th>Category</th>
                        <th>Generic</th>
                        <th>Strength</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Active</th>
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
                const q = document.getElementById('q').value;
                const category_id = document.getElementById('category_id').value;
                const is_active = document.getElementById('is_active').value;

                const params = new URLSearchParams();
                if (q) params.append('q', q);
                if (category_id) params.append('category_id', category_id);
                if (is_active !== '') params.append('is_active', is_active);

                const res = await fetch(apiBase + '/medicines?' + params.toString());
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed');

                const rows = document.getElementById('rows');
                rows.innerHTML = '';

                (data.items || []).forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.id ?? ''}</td>
                    <td>${escapeHtml(item.name ?? '')}</td>
                    <td>${escapeHtml(item.category?.name ?? '')}</td>
                    <td>${escapeHtml(item.generic_name ?? '')}</td>
                    <td>${escapeHtml(item.strength ?? '')}</td>
                    <td>${item.price ?? ''}</td>
                    <td>${item.stock ?? ''}</td>
                    <td>${item.is_active ?? ''}</td>
                    <td>
                        <div class="actions">
                            <a href="/admin/medicines/${item.id}/edit" style="text-decoration:none"><button class="secondary" type="button">Edit</button></a>
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
            if (!confirm('Delete medicine #' + id + '?')) return;
            clearMessages();
            try {
                const res = await fetch(apiBase + '/medicines/' + id, {
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
            document.getElementById('q').value = '';
            document.getElementById('category_id').value = '';
            document.getElementById('is_active').value = '';
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
