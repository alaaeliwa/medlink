@extends('admin.layout', ['title' => 'Categories - MedLink Admin'])

@section('content')
    <div class="card">
        <div class="top-actions">
            <div>
                <h2 style="margin:0 0 6px 0;">Categories</h2>
                <div class="muted">CRUD UI (front-end) talking to /api/v1/categories</div>
            </div>
            <div class="inline">
                <a href="/admin/categories/create" style="text-decoration:none"><button>Create Category</button></a>
            </div>
        </div>

        <div class="row">
            <div>
                <label>per_page</label>
                <input id="per_page" type="number" value="15">
            </div>
        </div>

        <div style="margin-top:12px" class="actions">
            <button onclick="loadItems()">Load</button>
        </div>

        <div id="error" class="error"></div>
        <div id="success" class="success"></div>

        <div style="margin-top:16px; overflow:auto;">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
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
                const perPage = document.getElementById('per_page').value || 15;
                const res = await fetch(apiBase + '/categories?per_page=' + encodeURIComponent(perPage));
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed');

                const rows = document.getElementById('rows');
                rows.innerHTML = '';

                (data.items || []).forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.id ?? ''}</td>
                    <td>${escapeHtml(item.name ?? '')}</td>
                    <td>${escapeHtml(item.description ?? '')}</td>
                    <td>
                        <div class="actions">
                            <a href="/admin/categories/${item.id}/edit" style="text-decoration:none"><button class="secondary" type="button">Edit</button></a>
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
            if (!confirm('Delete category #' + id + '?')) return;
            clearMessages();
            try {
                const res = await fetch(apiBase + '/categories/' + id, {
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
