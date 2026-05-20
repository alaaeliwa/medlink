@extends('admin.layout', ['title' => 'Create Pharmacy - MedLink Admin'])

@section('content')
    <div class="card">
        <h2 style="margin-top:0;">Create Pharmacy</h2>
        <div class="muted">Form sends POST /api/v1/pharmacies</div>

        <div id="error" class="error"></div>
        <div id="success" class="success"></div>

        <div class="row" style="margin-top:14px">
            <div>
                <label>User ID</label>
                <input id="user_id" type="number" required>
            </div>
            <div>
                <label>Pharmacy Name</label>
                <input id="pharmacy_name" type="text" required>
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>License Number</label>
                <input id="license_number" type="text">
            </div>
            <div>
                <label>License Expiry</label>
                <input id="license_expiry" type="date">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Address</label>
                <input id="address" type="text">
            </div>
            <div>
                <label>Area</label>
                <input id="area" type="text">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Latitude</label>
                <input id="latitude" type="text">
            </div>
            <div>
                <label>Longitude</label>
                <input id="longitude" type="text">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Delivery Available</label>
                <select id="delivery_available">
                    <option value="1">true</option>
                    <option value="0">false</option>
                </select>
            </div>
            <div>
                <label>Delivery Fee</label>
                <input id="delivery_fee" type="number" step="0.01">
            </div>
        </div>

        <div class="row" style="margin-top:12px">
            <div>
                <label>Rating</label>
                <input id="rating" type="number" step="0.1">
            </div>
            <div>
                <label>Review Count</label>
                <input id="review_count" type="number">
            </div>
        </div>

        <div style="margin-top:12px">
            <div style="max-width:400px">
                <label>Status</label>
                <input id="status" type="text">
            </div>
        </div>

        <div style="margin-top:14px" class="actions">
            <button onclick="submitCreate()">Save</button>
            <a href="/admin/pharmacies" style="text-decoration:none"><button class="secondary"
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
                    user_id: parseInt(document.getElementById('user_id').value, 10),
                    pharmacy_name: document.getElementById('pharmacy_name').value,
                    license_number: document.getElementById('license_number').value || null,
                    license_expiry: document.getElementById('license_expiry').value || null,
                    address: document.getElementById('address').value || null,
                    area: document.getElementById('area').value || null,
                    latitude: document.getElementById('latitude').value || null,
                    longitude: document.getElementById('longitude').value || null,
                    delivery_available: document.getElementById('delivery_available').value === '1',
                    delivery_fee: document.getElementById('delivery_fee').value !== '' ? parseFloat(document
                        .getElementById('delivery_fee').value) : null,
                    rating: document.getElementById('rating').value !== '' ? parseFloat(document.getElementById(
                        'rating').value) : null,
                    review_count: document.getElementById('review_count').value !== '' ? parseInt(document
                        .getElementById('review_count').value, 10) : null,
                    status: document.getElementById('status').value || null,
                };

                const res = await fetch(apiBase + '/pharmacies', {
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
                    window.location.href = '/admin/pharmacies';
                }, 500);
            } catch (e) {
                showError(e.message || String(e));
            }
        }
    </script>
@endsection
