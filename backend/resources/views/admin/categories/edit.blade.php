@extends('admin.layout', ['title' => 'Edit Category - MedLink Admin'])

@section('content')
    <div class="card">
        <h2 style="margin-top:0;">Edit Category</h2>
        <div class="muted">Form sends PUT /api/v1/categories/{id}</div>

        <div id="error" class="error"></div>
        <div id="success" class="success"></div>

        <div style="margin-top:14px" class="row">
            <div>
                <label>Name</label>
                <input id="name" type="text" required>
            </div>
            <div>
                <label>Description</label>
                <input id="description" type="text">
            </div>
        </div>

        <div style="margin-top:14px" class="actions">
            <button onclick="submitUpdate()">Update</button>
            <a href="/admin/categories" style="text-decoration:none"><button class="secondary"
                    type="button">Back</button></a>
        </div>
    </div>

    <script>
        const apiBase = '/api/v1';
        const categoryId = {{ $id }};

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
                const res = await fetch(apiBase + '/categories/' + categoryId);
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Load failed');
                const item = data.data || data;

                document.getElementById('name').value = item.name ?? '';
                document.getElementById('description').value = item.description ?? '';
            } catch (e) {
                showError(e.message || String(e));
            }
        }

        async function submitUpdate() {
            clearMessages();
            try {
                const payload = {
                    name: document.getElementById('name').value,
                    description: document.getElementById('description').value || null,
                };

                const res = await fetch(apiBase + '/categories/' + categoryId, {
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
                    window.location.href = '/admin/categories';
                }, 500);
            } catch (e) {
                showError(e.message || String(e));
            }
        }

        loadOne();
    </script>
@endsection
