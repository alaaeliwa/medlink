<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'MedLink Admin' }}</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            background: #f6f6f6;
            color: #111;
        }

        nav {
            background: #111;
            color: #fff;
            padding: 12px 16px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
        }

        nav a {
            color: #fff;
            text-decoration: none;
            padding: 8px 10px;
            border-radius: 6px;
            background: rgba(255, 255, 255, .06)
        }

        nav a:hover {
            background: rgba(255, 255, 255, .14)
        }

        .container {
            max-width: 1100px;
            margin: 18px auto;
            padding: 0 16px;
        }

        .card {
            background: #fff;
            border-radius: 10px;
            padding: 16px;
            box-shadow: 0 1px 6px rgba(0, 0, 0, .06);
            margin-bottom: 16px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border-bottom: 1px solid #eee;
            padding: 10px 8px;
            text-align: left;
            font-size: 14px;
            vertical-align: top;
        }

        th {
            font-size: 13px;
            color: #333;
            background: #fafafa;
        }

        .row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .row>* {
            flex: 1;
            min-width: 260px;
        }

        label {
            display: block;
            font-size: 13px;
            margin-bottom: 6px;
            color: #333;
        }

        input,
        select,
        textarea {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ddd;
            font-size: 14px;
            box-sizing: border-box;
        }

        textarea {
            min-height: 90px;
        }

        button {
            padding: 10px 14px;
            border: 0;
            border-radius: 8px;
            background: #111;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
        }

        button.secondary {
            background: #666;
        }

        button.danger {
            background: #b00020;
        }

        .error {
            background: #ffe6e6;
            border: 1px solid #ffb3b3;
            padding: 10px;
            border-radius: 10px;
            margin-top: 10px;
            display: none;
        }

        .success {
            background: #e6ffef;
            border: 1px solid #8ce0a8;
            padding: 10px;
            border-radius: 10px;
            margin-top: 10px;
            display: none;
        }

        .actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .top-actions {
            display: flex;
            gap: 12px;
            align-items: flex-end;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 12px;
        }

        .inline {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }
    </style>
</head>

<body>
    <nav>
        <a href="/admin/medicines">Medicines</a>
        <a href="/admin/categories">Categories</a>
        <a href="/admin/pharmacies">Pharmacies</a>
        <a href="/admin/inventory-items">Inventory Items</a>
    </nav>
    <div class="container">
        @yield('content')
    </div>
</body>

</html>
