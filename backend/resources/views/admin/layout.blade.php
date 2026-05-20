<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'MedLink Admin' }}</title>

    {{-- Global styles from the frontend team (served by Laravel) --}}
    <link rel="stylesheet" href="{{ asset('css/global.css') }}">
    <link rel="stylesheet" href="{{ asset('css/admin-dashboard.css') }}">

    {{-- Optional: icons (if you already include FontAwesome elsewhere, you can remove this) --}}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>

<body>
    {{-- Minimal wrapper so existing Blade pages keep working with the new design system --}}
    <div class="admin-layout">
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <img class="logo" src="{{ asset('images/logo.png') }}" alt="MedLink Logo" />
                <button class="sidebar-close" type="button" aria-label="Close Sidebar">✕</button>
            </div>

            <nav class="sidebar-nav">
                <div class="nav-group">
                    <div class="nav-group-title">Admin</div>
                    <a class="sidebar-link" href="/admin/medicines">
                        <i class="fa-solid fa-pills"></i>
                        <span>Medicines</span>
                    </a>
                    <a class="sidebar-link" href="/admin/categories">
                        <i class="fa-solid fa-layer-group"></i>
                        <span>Categories</span>
                    </a>
                    <a class="sidebar-link" href="/admin/pharmacies">
                        <i class="fa-solid fa-building"></i>
                        <span>Pharmacies</span>
                    </a>
                    <a class="sidebar-link" href="/admin/inventory-items">
                        <i class="fa-solid fa-warehouse"></i>
                        <span>Inventory Items</span>
                    </a>
                </div>
            </nav>
        </aside>

        <main class="admin-main">
            <div class="container">
                @yield('content')
            </div>
        </main>
    </div>

    {{-- Shared UI scripts --}}
    <script src="{{ asset('js/medlink-ui.js') }}"></script>
    <script src="{{ asset('js/admin-dashboard.js') }}"></script>
</body>

</html>
