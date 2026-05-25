<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Admin CRUD pages (Blade UI) — front-end forms talk to /api/v1/*
Route::prefix('admin')->group(function () {
    Route::get('medicines', fn() => view('admin.medicines.index'));
    Route::get('medicines/create', fn() => view('admin.medicines.create'));
    Route::get('medicines/{id}/edit', fn(int $id) => view('admin.medicines.edit', ['id' => $id]));

    Route::get('categories', fn() => view('admin.categories.index'));
    Route::get('categories/create', fn() => view('admin.categories.create'));
    Route::get('categories/{id}/edit', fn(int $id) => view('admin.categories.edit', ['id' => $id]));

    Route::get('pharmacies', fn() => view('admin.pharmacies.index'));
    Route::get('pharmacies/create', fn() => view('admin.pharmacies.create'));
    Route::get('pharmacies/{id}/edit', fn(int $id) => view('admin.pharmacies.edit', ['id' => $id]));

    Route::get('inventory-items', fn() => view('admin.inventory-items.index'));
    Route::get('inventory-items/create', fn() => view('admin.inventory-items.create'));
    Route::get('inventory-items/{id}/edit', fn(int $id) => view('admin.inventory-items.edit', ['id' => $id]));
});
