@extends('admin.layout', ['title' => 'Create Medicine - MedLink Admin'])

@section('content')
    <div class="card">
        <h2 style="margin-top:0;">Create Medicine</h2>
        <div class="muted">Form sends POST /api/v1/medicines</div>

        <div id="error" class="error"></div>
        <div id="success" class="success"></div>

        <div class="row" style="margin-top:14px">
            <div>
                <label>Category ID</label>
                <input id="category_id" type="number" required>
            </div>
            <div>
                <label>Name</label>
                <input id="name" type="text" required>
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Generic Name</label>
                <input id="generic_name" type="text">
            </div>
            <div>
                <label>Strength</label>
                <input id="strength" type="text">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Price</label>
                <input id="price" type="number" step="0.01">
            </div>
            <div>
                <label>Form</label>
                <input id="form" type="text">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Manufacturer</label>
                <input id="manufacturer" type="text">
            </div>
            <div>
                <label>Stock</label>
                <input id="stock" type="number">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Requires Prescription</label>
                <select id="requires_prescription">
                    <option value="1">true</option>
                    <option value="0">false</option>
                </select>
            </div>
            <div>
                <label>Is Controlled</label>
                <select id="is_controlled">
                    <option value="1">true</option>
                    <option value="0">false</option>
                </select>
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Expiry Date</label>
                <input id="expiry_date" type="date">
            </div>
            <div>
                <label>Is Active</label>
                <select id="is_active">
                    <option value="1">true</option>
                    <option value="0">false</option>
                </select>
            </div>
        </div>

        <div style="margin-top:12px">
            <label>Description</label>
            <textarea id="description"></textarea>
        </div>

        <div style="margin-top:14px" class="actions">
            <button onclick="submitCreate()">Save</button>
            <a href="/admin/medicines" style="text-decoration:none"><button class="secondary"
                    type="button">Back</button></a>
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

        async function submitCreate() {
            clearMessages();
            try {
                const payload = {
                    category_id: parseInt(document.getElementById('category_id').value, 10),
                    name: document.getElementById('name').value,
                    generic_name: document.getElementById('generic_name').value || null,
                    strength: document.getElementById('strength').value || null,
                    price: document.getElementById('price').value !== '' ? parseFloat(document.getElementById(
                        'price').value) : null,
                    form: document.getElementById('form').value || null,
                    manufacturer: document.getElementById('manufacturer').value || null,
                    stock: document.getElementById('stock').value !== '' ? parseInt(document.getElementById('stock')
                        .value, 10) : null,
                    description: document.getElementById('description').value || null,
                    requires_prescription: document.getElementById('requires_prescription').value === '1',
                    is_controlled: document.getElementById('is_controlled').value === '1',
                    expiry_date: document.getElementById('expiry_date').value || null,
                    is_active: document.getElementById('is_active').value === '1',
                };

                const res = await fetch(apiBase + '/medicines', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.message || 'Create failed');

                showSuccess(data?.message || 'Created');
                setTimeout(() => {
                    window.location.href = '/admin/medicines';
                }, 500);
            } catch (e) {
                showError(e.message || String(e));
            }
        }
    </script>
@endsection
